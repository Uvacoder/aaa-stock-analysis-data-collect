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

url = "https://stock-analysis-tool-1011-default-rtdb.firebaseio.com/"
cred = credentials.Certificate("stock-analysis-tool-1011.json")
myapp = firebase_admin.initialize_app(cred, {
    'databaseURL': url
})

mydb = db.reference()

# mydb.child("companies").set({})

companies = json.load(open("companies.json", "r"))
pool = ThreadPool(multiprocessing.cpu_count())
pool.map(lambda row: mydb.child("companies").child(
    row[0]).set(row[1]), companies.items())

# for key, val in companies.items():
#     mydb.child("companies").child(key).set(val)

# mydb.child("sectors").set({})
# sectors = json.load(open("sectors.json", "r"))
# pool = ThreadPool(multiprocessing.cpu_count())
# pool.map(lambda row: mydb.child("sectors").child(
#     row[0]).set(row[1]), sectors.items())
# for key, val in sectors.items():
#     mydb.child("sectors").child(key).set(val)
