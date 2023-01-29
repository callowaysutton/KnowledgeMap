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
    conn = http.client.HTTPSConnection("api.openai.com")
    payload = ' {\n  "model": "text-davinci-003",\n  "prompt":' + f'"List 10 concepts surrounding the subject {question} and include the word(s) {question} in each of the related concepts in the list below:", ' + '  \n "max_tokens": 256,\n  "temperature": 0\n}\n'
    conn.request("POST", "/v1/completions", payload, headers)

    res = conn.getresponse()
    data = res.read()

    answer = loads(data.decode("utf-8"))

    return answer
