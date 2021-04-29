from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
import threading


def create_driver():
    chromeOptions = webdriver.ChromeOptions()
    chromeOptions.add_argument("--headless")
    chromeOptions.add_experimental_option(
        'excludeSwitches', ['enable-logging'])
    driver = webdriver.Chrome(
        ChromeDriverManager().install(), options=chromeOptions)
    return driver


def update():
    url = "https://in.finance.yahoo.com/quote/%5EBSESN?p=^BSESN"
    driver = create_driver()
    driver.get(url)
    previous_close_price_path = "/html/body/div[1]/div/div/div[1]/div/div[3]/div[1]/div/div[1]/div/div/div/div[2]/div[1]/table/tbody/tr[1]/td[2]"
    open_price_path = "/html/body/div[1]/div/div/div[1]/div/div[3]/div[1]/div/div[1]/div/div/div/div[2]/div[1]/table/tbody/tr[2]/td[2]"
    days_range_path = "/html/body/div[1]/div/div/div[1]/div/div[3]/div[1]/div/div[1]/div/div/div/div[2]/div[2]/table/tbody/tr[1]/td[2]"
    previous_close_price = driver.find_element_by_xpath(
        previous_close_price_path).text
    open_price = driver.find_element_by_xpath(open_price_path).text
    days_range = driver.find_element_by_xpath(days_range_path).text
    result = {"previous_close_price": previous_close_price,
              "open_price": open_price, "days_range": days_range}
    print(result)
    # return (previous_close_price, open_price, days_range)
    # threading.Timer(5, update).start()
