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

graph_api_bp = Blueprint('graph_api', __name__)
@graph_api_bp.route('/api/graph', methods=['POST'])
def graph():

    content_type = request.headers.get('Content-Type')
    if (content_type != 'application/json'):
        return 'Content-Type not supported!'

    question = request.json['prompt']
    if question is None or question == "":
        return 'Please supply a prompt!'
    
    conn = http.client.HTTPConnection("openai-caching-proxy-worker.calloway.workers.dev")
    payload = ' {\n  "model": "text-davinci-003",\n  "prompt":' + f'"List up to 10 concepts which build up to the subject {question}. Do not include a concept if you are even a little unsure that it may not relate back to the main subject. Make sure to include {question} in each of the related concepts in the list below:", ' + '  \n "max_tokens": 128,\n  "temperature": 0\n}\n'
    conn.request("POST", "/proxy/completions", payload, headers)

    res = conn.getresponse()
    data = res.read()

    print(data)

    answer = loads(data.decode("utf-8"))

    return answer

    