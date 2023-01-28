from flask import Blueprint, request, jsonify, render_template

graph_bp = Blueprint('graph', __name__)
@graph_bp.route('/graph', methods=['GET'])
def graph():
    pass