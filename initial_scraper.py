from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

# Function to scrape an element by class with realistic browser settings
def get_element_with_custom_headers(url, class_name):
    # Set up Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode (no GUI)
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")  # Disable Selenium detection
    
    # Add a realistic user agent
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    )
    # Start the WebDriver
    driver = webdriver.Chrome(options=chrome_options)

    try:
        driver.get(url)
        time.sleep(4)  # Adjust if needed for dynamic content
        element = driver.find_element(By.CSS_SELECTOR, f".{class_name.replace(' ', '.')}")
        element_html = element.get_attribute("outerHTML")
        driver.quit()
        return element_html

    except Exception as e:
        print(f"Error: {e}")
        driver.quit()
        return None

# URL and class to scrape
url = "https://www.maxi.ca/fr/search?search-bar=06148301475"  # Replace with the target URL
class_name = "chakra-linkbox__overlay css-1hnz6hu"  # Replace with your class name

# Call the function and display the HTML of the element
element_html = get_element_with_custom_headers(url, class_name)
if element_html:
    print(element_html)
