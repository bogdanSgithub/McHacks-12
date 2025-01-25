import cv2
import imutils
import numpy as np
import pytesseract
from imutils.perspective import four_point_transform

import json
import re

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
    print(text)
    
    pattern = r'(?<!\d)(?:\((\d+)\))?\s*(\d{11})(?=\s)'

    # Find all matches for product codes and quantities
    matches = re.findall(pattern, text)
    print(matches)

    date_pattern = r'Time:\s*(\d{2}/\d{2}/\d{2})'
    date_match = re.search(date_pattern, text)
    date_bought = date_match.group(1) if date_match else None

    products = []
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
    json_output = json.dumps(products, indent=2)
    return json_output


#img_path = r"C:\Users\Bogdan\Downloads\maxi_0.jpg"
'''
img_path = r"C:\Users\Bogdan\Downloads\receipt_1.jpg"
img = cv2.imread(img_path)

if img is None:
    print("Error loading image!")
else:
    _, img_encoded = cv2.imencode('.jpg', img)  # Encode to JPG format
    img_bytes = img_encoded.tobytes()  # Convert to byte buffer
    perform_ocr(np.frombuffer(img_bytes, dtype=np.uint8))  # Ensure it's a NumPy array
'''