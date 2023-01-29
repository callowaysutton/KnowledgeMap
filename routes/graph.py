from flask import Blueprint, request, jsonify, render_template

# Makes the blueprint for the /graph route 
# Example query may be /graph?q=QUERY which returns the graph of nodes which correspond to the query
graph_bp = Blueprint('graph', __name__)
@graph_bp.route('/graph', methods=['GET'])
def graph():
    return render_template('graph.html')