import cv2
import imutils
import numpy as np
import pytesseract
from imutils.perspective import four_point_transform
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import json
import re
from openai import OpenAI
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
import platform

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = None

if api_key:
    client = OpenAI(api_key=api_key)

if platform.system() == "Windows":
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


def perform_ocr(img: np.ndarray):
    img_orig = cv2.imdecode(img, cv2.IMREAD_COLOR)
    image = img_orig.copy()
    image = imutils.resize(image, width=500)
    ratio = img_orig.shape[1] / float(image.shape[1])

    # convert the image to grayscale, blur it slightly, and then apply
    # edge detection
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    blurred = cv2.GaussianBlur(
        gray,
        (
            5,
            5,
        ),
        0,
    )
    edged = cv2.Canny(blurred, 75, 200)

    # find contours in the edge map and sort them by size in descending
    # order
    cnts = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    cnts = sorted(cnts, key=cv2.contourArea, reverse=True)

    # initialize a contour that corresponds to the receipt outline
    receiptCnt = None
    # loop over the contours
    for c in cnts:
        # approximate the contour
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        # if our approximated contour has four points, then we can
        # assume we have found the outline of the receipt
        if len(approx) == 4:
            receiptCnt = approx
            break

    # if the receipt contour is empty then our script could not find the
    # outline and we should be notified
    if receiptCnt is None:
        raise Exception(
            (
                "Could not find receipt outline. "
                "Try debugging your edge detection and contour steps."
            )
        )

    # apply a four-point perspective transform to the *original* image to
    # obtain a top-down bird's-eye view of the receipt
    receipt = four_point_transform(img_orig, receiptCnt.reshape(4, 2) * ratio)

    # apply OCR to the receipt image by assuming column data, ensuring
    # the text is *concatenated across the row* (additionally, for your
    # own images you may need to apply additional processing to cleanup
    # the image, including resizing, thresholding, etc.)
    options = "--psm 6"
    text = pytesseract.image_to_string(
        cv2.cvtColor(receipt, cv2.COLOR_BGR2RGB), config=options
    )    
    pattern = r'(?<!\d)(?:\((\d+)\))?\s*(\d{11})\s'

    # Find all matches for product codes and quantities
    matches = re.findall(pattern, text)
    print(text)

    date_pattern = r'\s\d{2}/\d{2}/\d{2}\s'
    date_match = re.search(date_pattern, text)
    date_bought = date_match.group().strip() if date_match else None

    products = []
    print(f"matches {matches}")
    for match in matches:
        if match[0] == "":
            quantity = 1
        else:
            quantity = int(match[0])
        product_code = match[1]
        
        product = {
            "product_code": product_code,
            "quantity": quantity,
            "date_bought": date_bought
        }
        products.append(product)
    print(f"products {products}")

    for product in products:
        get_product_info(product)
    print(f"final products {products}")
    return products

def get_expiration_date(name, bought_date):
    if client is None:
        new_date = datetime.strptime(bought_date, "%y/%m/%d") + timedelta(weeks=3)
        return new_date.strftime("%y/%m/%d")
    bought_date = datetime.strptime(bought_date, "%y/%m/%d")
    completion = client.chat.completions.create(
    model="gpt-4",
    store=True,
    messages=[
        {"role": "user", "content": f"Only give me the date. Only that. Only return datetime in format %y/%m/%d. Not always 1 month later. Provide the expiration date of this product {name} which was bought on {bought_date}."},
    ]
    )
    return completion.choices[0].message.content

def get_product_info(product):
    url = f'https://www.maxi.ca/fr/search?search-bar={product["product_code"]}'

    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode (no GUI)
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-webgl")
    chrome_options.add_argument("--enable-unsafe-swiftshader")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")  # Disable Selenium detection
    
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    )
    # Start the WebDriver
    driver = webdriver.Chrome(options=chrome_options)
    driver.get(url)
    time.sleep(4)
    wait = WebDriverWait(driver, 10)

    name_element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".chakra-heading.css-6qrhwc")))
    brand_element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".chakra-text.css-1ecdp9w")))
    image_element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".chakra-image.css-oguq8l")))
    weight_element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".chakra-text.css-1yftjin")))

    product["name"] = name_element.get_attribute("innerText")
    product["brand"] = brand_element.get_attribute("innerText")
    product["image"] = image_element.get_attribute("src")
    product["weight"] = weight_element.get_attribute("innerText")
    product["expiration_date"] = get_expiration_date(product["name"], product["date_bought"])
