from flask import Blueprint, request, jsonify, render_template
from json import loads
import http.client

from dotenv import load_dotenv
from os import getenv
load_dotenv()

OPENAIKEY = getenv('OPENAIKEY')

headers = {
    'Authorization': f"{OPENAIKEY}",
    'content-type': "application/json"
    }

summary_api_bp = Blueprint('summary_api', __name__)
@summary_api_bp.route('/api/summary', methods=['POST'])
def graph():
    content_type = request.headers.get('Content-Type')
    if (content_type != 'application/json'):
        return 'Content-Type not supported!'

    question = request.json['prompt']
    print(question)
    conn = http.client.HTTPConnection("127.0.0.1:8787")
    payload = ' {\n  "model": "text-davinci-003",\n  "prompt":' + f'"Summarize the concept surrounding the subject: {question}. Make sure to include any references to articles, books, documents and websites which can further help explain the concept below:", ' + '  \n "max_tokens": 512,\n  "temperature": 0\n}\n'
    conn.request("POST", "/proxy/completions", payload, headers)

    res = conn.getresponse()
    data = res.read()

    print(data)

    answer = loads(data.decode("utf-8"))

    return answer
