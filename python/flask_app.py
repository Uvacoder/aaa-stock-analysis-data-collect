from flask import Flask, send_from_directory, jsonify, request, redirect, url_for
from flask_restful import Api
from flask_cors import CORS
import pandas as pd
import re
import requests
import traceback
app = Flask(__name__, static_url_path='',
            static_folder='../stock-analysis-tool-frontend/public')
CORS(app)
api = Api(app)

companywithid_url = "https://raw.githubusercontent.com/saikr789/stock-tool/main/Data/companywithid.json"
companydetails_url = "https://raw.githubusercontent.com/saikr789/stock-tool/main/Data/companies.json"
equity_url = "https://raw.githubusercontent.com/saikr789/stock-tool/main/Data/Equity.csv"
stock_url = "https://raw.githubusercontent.com/saikr789/stock-tool/main/Data/Stock/{}.csv"
companies_url = "https://raw.githubusercontent.com/saikr789/stock-tool/main/Data/companies.csv"
sp500_url = "https://raw.githubusercontent.com/saikr789/stock-tool/main/Data/sp500.csv"
sectors_url = "https://raw.githubusercontent.com/saikr789/stock-tool/main/Data/sectors.json"


@app.route("/")
def main():
    return send_from_directory(app.static_folder, 'index.html')


@app.route("/companyNames", methods=["GET"])
def companynames():
    try:
        response = requests.get(companywithid_url)
        response = response.json()
        company_names = list(response.keys())
        return jsonify(company_names), 200
    except:
        return jsonify([]), 404


@app.route("/companydetails", methods=["GET"])
def companydetails():
    args = request.args
    try:
        response = requests.get(companydetails_url)
        response = response.json()
        if "company" in args:
            company = args["company"]
            company = company.upper()
            return jsonify(response[company]), 200
        else:
            return jsonify(response), 200
    except Exception as e:
        return jsonify([]), 400


def read_companies():
    df = pd.read_csv(companies_url)
    df["Security Name"] = df.apply(lambda row: re.sub(
        '[!@#$%^&*()-=,\\\/\']', '', row["Security Name"]), axis=1)
    code = df["Security Code"].tolist()
    sid = df["Security Name"].str.upper().tolist()
    name_id = dict(zip(sid, code))
    return name_id


@app.route("/previousdaystockdetails", methods=["GET"])
def previousdaystockdetails():
    name_id = read_companies()
    args = request.args
    if "company" in args:
        company = args["company"]
        company = company.upper()
        company_id = name_id[company]
        path = stock_url.format(company_id)
        df = pd.read_csv(path)
        row = df.head(1).to_dict(orient="records")[0]
        row['company'] = company
        return jsonify(row), 200
    else:
        response = []
        codes = list(name_id.values())
        for name, code in name_id.items():
            try:
                path = stock_url.format(code)
                df = pd.read_csv(path)
                row = df.head(1).to_dict(orient="records")[0]
                row['company'] = name
                response.append(row)
            except Exception as e:
                pass
        return jsonify(response), 200
    return jsonify([]), 400


@app.route("/sectors", methods=["GET"])
def sectors():
    try:
        response = requests.get(sectors_url)
        response = response.json()
        return jsonify(response), 200
    except:
        return jsonify([]), 404


@app.route("/sp500", methods=["GET"])
def sp500():
    try:
        df = pd.read_csv(sp500_url)
        df = df.to_dict(orient="records")
        return jsonify(df), 200
    except:
        return jsonify([]), 404


@app.route("/stockdetails", methods=["GET"])
def stockdetails():
    name_id = read_companies()
    args = request.args
    if "company" in args:
        company = args["company"]
        company = company.upper()
        company_id = name_id[company]
        path = stock_url.format(company_id)
        df = pd.read_csv(path)
        df = df.dropna(axis=0)
        df = df.to_dict(orient="records")
        return jsonify(df), 200
    else:
        response = []
        codes = list(name_id.values())
        for name, code in name_id.items():
            try:
                path = stock_url.format(code)
                df = pd.read_csv(path)
                df = df.dropna(axis=0)
                df = df.to_dict(orient="records")
                response.append(row)
            except Exception as e:
                pass
        return jsonify(response), 200
    return jsonify([]), 400
