import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
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

companies = json.load(open("companies.json", "r"))
for key, val in companies.items():
    key = key.replace('[#$./.]', '')
    key = key.replace('.', ' ')
    mydb.child("companies").child(key).set(val)

sectors = json.load(open("sectors.json", "r"))
for key, val in sectors.items():
    key = key.replace('[#$./.]', '')
    key = key.replace('.', ' ')
    mydb.child("sectors").child(key).set(val)
