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
import os
url = "https://stock-analysis-tool-1011-default-rtdb.firebaseio.com/"
cred = credentials.Certificate("stock-analysis-tool-1011.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': url
})
db_ref = db.reference()
stocks = db_ref.child("stocks")
stockpath = "grstockdata"
companies = json.load(open("companies.json", "r"))
for key, company in companies.items():
    try:
        security_id = str(company["Security Code"])
        company_name = company["Security Name"]
        company_name = company_name.replace('[#$./.]', '')
        company_name = company_name.replace('.', ' ')
        print(company_name)
        df = pd.read_csv(os.path.join(stockpath, "gr"+str(security_id)+".csv"))
        df.columns = df.columns.str.replace('[#$./.]', '')
        rows = json.loads(df.to_json(orient="records"))
        current_stock = stocks.child(company_name)
        pool = ThreadPool(multiprocessing.cpu_count())
        pool.map(lambda row: current_stock.child(
            str(int(row["Unix Date"]))).set(row), rows)
    except Exception as e:
        traceback.print_exc()
