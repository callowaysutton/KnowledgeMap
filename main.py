from flask import Flask, request, jsonify

app = Flask(__name__)

from routes.graph import graph_bp
from routes.index import index_bp

app.register_blueprint(graph_bp)
app.register_blueprint(index_bp)

if __name__ == '__main__':
    app.run(debug=True)