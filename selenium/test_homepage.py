
import os
import time

from selenium import webdriver
from selenium.webdriver.common.by import By

selenium_url = os.getenv("SELENIUM_URL", "http://chrome:4444")
website_url = os.getenv(
    "WEBSITE_URL",
    "http://host.docker.internal:3000/"
)

driver = None

try:
    for attempt in range(30):
        try:
            options = webdriver.ChromeOptions()
            driver = webdriver.Remote(
                command_executor=selenium_url,
                options=options
            )
            break
        except Exception:
            if attempt == 29:
                raise
            time.sleep(2)

    driver.set_page_load_timeout(30)
    driver.get(website_url)

    assert "CampusCare" in driver.title, (
        f"Unexpected page title: {driver.title}"
    )

    body_text = driver.find_element(By.TAG_NAME, "body").text
    assert "CampusCare" in body_text, (
        "CampusCare text was not found on the page"
    )

    print("PASS: CampusCare opened successfully in Chrome.")
    print(f"Page title: {driver.title}")

finally:
    if driver:
        driver.quit()
