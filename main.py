from flask import Flask, request, jsonify

app = Flask(__name__)

from routes.graph import graph_bp
from routes.index import index_bp

from routes.api.graph import graph_api_bp

# Client facing endpoints
app.register_blueprint(graph_bp)
app.register_blueprint(index_bp)

# API Endpoints
app.register_blueprint(graph_api_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5001)