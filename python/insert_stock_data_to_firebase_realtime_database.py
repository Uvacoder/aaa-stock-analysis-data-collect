import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import pandas as pd
import numpy as np
import multiprocessing
from multiprocessing.pool import ThreadPool
import re
import json
import sys
import traceback

url = "https://stock-analysis-tool-1011-default-rtdb.firebaseio.com/"
cred = credentials.Certificate("stock-analysis-tool-1011.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': url
})

db_ref = db.reference()
stocks = db_ref.child("stocks")

companies = pd.read_csv(
    "F:\PracticumProject\stock-analysis-tool-python\Equity.csv")
stockpath = "grstockdatanew"
companies = companies.head(100)
for _, row in companies.iterrows():
    try:
        security_code = str(row["Security Code"])
        company_name = re.sub('[!@#$%^&*()-=,\\\/\']',
                              '', row["Security Name"])
        company_name = company_name.upper()
        company_name = company_name.strip()
        print(company_name, security_code)
        # df = pd.read_csv(os.path.join(
        #     stockpath, "gr"+str(security_code)+".csv"))
        # df.columns = df.columns.str.replace('[!#$^@&./.\']', '')
        # rows = json.loads(df.to_json(orient="records"))
        current_stock = stocks.child(company_name)
        # pool = ThreadPool(multiprocessing.cpu_count())
        # pool.map(lambda row: current_stock.child(
        #     str(int(row["Unix Date"]))).set(row), rows)
    except Exception as e:
        traceback.print_exc()
