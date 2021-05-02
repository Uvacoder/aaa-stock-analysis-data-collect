import os
import firebase_admin
from firebase_admin import credentials, db, firestore
import pandas as pd
import numpy as np
import json
import multiprocessing
from multiprocessing.pool import ThreadPool
import datetime
url = "https://stock-analysis-tool-1024-default-rtdb.firebaseio.com/"
cred = credentials.Certificate("stock-analysis-tool-1024.json")
firebase_admin.initialize_app(cred)
store = firestore.client()


path = os.getcwd()
companies = pd.read_csv(os.path.join(path, "companies.csv"))
companies.set_index('security id', inplace=True)
df = pd.read_csv(os.path.join(path, "grstockdata/"+"gr500112.csv"))
df["Date"] = pd.to_datetime(df['Date'])
df["Date"] = df.apply(lambda x: x['Date'].date(), axis=1)
for filename in os.listdir(os.path.join(path, "grstockdata")):
    name = int(filename[2:8])
    df = pd.read_csv(os.path.join(path, "grstockdata/"+filename))
    security_id = filename[2:8]
    company_name = companies.loc[int(security_id)].values[0]
    collection_name = security_id + "-" + company_name
    rows = json.loads(df.to_json(orient="records"))
    collection = store.collection(collection_name)

    pool = ThreadPool(multiprocessing.cpu_count())
    result = pool.map(lambda row: collection.document(
        str(row["Date"])).set(row), rows)
