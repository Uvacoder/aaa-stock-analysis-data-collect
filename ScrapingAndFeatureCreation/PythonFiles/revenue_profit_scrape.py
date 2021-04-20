import os
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
from bs4 import BeautifulSoup
import traceback


def download_revenue_profit(code, name):
    """
    Creates the revenue profit file.

    Parameters
    ----------
    code : string
        security code of the company.
    name : 
        security id of the company.

    Methods:
    --------

    create_driver : creates the chrome driver.

    download : extracts the data from the page and saves to a csv file.

    """
    path = os.path.join(os.getcwd(), os.path.join("Data", "Revenue"))

    if not os.path.exists(path):
        os.makedirs("Data/Revenue")

    def create_driver():
        """
        Creates a Chrome Driver.

        Returns
        --------
        driver : driver
            chrome web driver.
        """

        chromeOptions = webdriver.ChromeOptions()
        chromeOptions.add_argument("--headless")
        chromeOptions.add_experimental_option(
            "prefs", {"download.default_directory": path})
        driver = webdriver.Chrome(
            ChromeDriverManager().install(), options=chromeOptions)
        return driver

    def download():
        """
        extracts the data from the page and saves to a csv file.
        """
        columns = ["security code", "security name", 'total income', 'net sales/revenue from operations', 'expenditure',
                   'net profit', 'basic eps for continuing operation', 'basic & diluted eps before extraordinary items', "year", "quartile"]
        code_df = pd.DataFrame(columns=columns)
        for q in range(55, 104):
            url = "https://www.bseindia.com/corporates/results.aspx?Code=" + \
                str(code) + "&Company=" + str(name) + \
                "&qtr=" + str(q) + "&RType=D"
            driver.get(url)
            html = driver.page_source
            soup = BeautifulSoup(html, "html")

            table = soup.find_all(
                "table", attrs={"id": "ContentPlaceHolder1_tbl_typeID"})
            table = pd.read_html(str(table))[0]
            table = table[[0, 1]]
            table.dropna(inplace=True)
            table = table.transpose()
            table.columns = table.iloc[0]
            table = table[1:]
            table.columns = map(str.lower, table.columns)
            table.drop(["description"], inplace=True, axis=1)
            try:
                table["date begin"] = pd.to_datetime(table["date begin"])
                date = table.iloc[0]["date begin"]
                table["quartile"] = (date.month-1)//3 + 1
                table["year"] = date.year
                table["security name"] = name
                table["security code"] = code
                code_df = code_df.append(table, ignore_index=True)
            except:
                traceback.print_exc()

        code_df["eps"] = code_df['basic eps for continuing operation'].fillna(
            '') + code_df['basic & diluted eps before extraordinary items'].fillna('')
        keep_columns = ['security code', 'security name', 'total income',
                        'net sales/revenue from operations', 'expenditure', 'net profit', 'year', 'quartile', 'eps']
        res = ["other operating income", "other income",
               "net sales / income from operations", "total income"]
        code_df[res] = code_df[res].apply(pd.to_numeric)
        code_df = code_df.fillna(0)
        code_df["total income"] = code_df["total income"] + code_df["other operating income"] + \
            code_df["other income"] + \
            code_df["net sales / income from operations"]
        code_df = code_df[keep_columns]
        code_df.to_csv(os.path.join(path, str(code)+".csv"), index=None)
    driver = create_driver()
    download()
