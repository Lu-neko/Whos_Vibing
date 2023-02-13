import requests
import os
from dotenv import load_dotenv
import secrets
import random
from flask import Flask, jsonify, render_template, make_response, redirect, url_for
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)

CORS(app)

@app.route("/")
def index():
    return redirect(url_for('play', number=random.randint(100000, 999999)))

@app.route("/<int:number>")
def play():
    return render_template("layers.html")

@app.route("/get_token")
def get_token():
    get_token = requests.post("https://api.lovense.com/api/basicApi/getToken", json={
        "token": os.getenv("TOKEN"),
        "uid": secrets.token_urlsafe(),
        "uname": secrets.token_urlsafe()
    }).json()

    print(get_token["data"])

    response = make_response(jsonify(get_token["data"]))
    return response

app.run("0.0.0.0", 5000)