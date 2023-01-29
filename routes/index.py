from flask import Blueprint, request, jsonify, render_template

# Just serve the index.html landing page
# SHOULD NOT have any other logic other than serving the landing page
index_bp = Blueprint('index', __name__)
@index_bp.route('/', methods=['GET'])
def index():
    return render_template('index.html')