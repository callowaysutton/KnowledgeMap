from flask import Blueprint, request, jsonify, render_template
import http.client

from dotenv import load_dotenv
from os import getenv
load_dotenv()

OPENAIKEY = getenv('OPENAIKEY')

headers = {
    'Authorization': f"{OPENAIKEY}",
    'content-type': "application/json"
    }

graph_api_bp = Blueprint('graph_api', __name__)
@graph_api_bp.route('/api/graph', methods=['GET'])
def graph():
    conn = http.client.HTTPSConnection("api.openai.com")
    payload = """ {\n  "model": "text-davinci-003",\n  "prompt": "list 10 things that I could learn while driving  and include driving in the concept below:",   \n "max_tokens": 512,\n  "temperature": 0\n}\n"""
    conn.request("POST", "/v1/completions", payload, headers)

    res = conn.getresponse()
    data = res.read()

    list = data.decode("utf-8")

    return list