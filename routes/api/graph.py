from flask import Blueprint, request, jsonify, render_template

graph_api_bp = Blueprint('graph_api', __name__)
@graph_api_bp.route('/api/graph', methods=['GET'])
def graph():
    pass