
import json
import re
from multiprocessing.pool import ThreadPool
import multiprocessing
import numpy as np
import pandas as pd
from firebase_admin import db
from firebase_admin import credentials
import firebase_admin
import os
import sys

url = "https://stock-analysis-tool.firebaseio.com/"
cred = credentials.Certificate("stock-analysis-tool-senior.json")
senior_app = firebase_admin.initialize_app(cred, {
    'databaseURL': url
}, )

senior_db = db.reference()
companies = senior_db.child("Companies").get()
with open("companies.json", "w") as outfile:
    json.dump(companies, outfile)

sectors = senior_db.child("SectorsData").get()
with open("sectors.json", "w") as outfile:
    json.dump(sectors, outfile)
