from flask import Blueprint, jsonify, request
from .db_utils import query_db, get_db

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return jsonify({"message": "Hello from Flask"})

@main_bp.route('/api/items', methods=['GET'])
def get_items():
    try:
        items = query_db("SELECT id, name, description FROM items")
        return jsonify(items)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main_bp.route('/api/items', methods=['POST'])
def add_item():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')

    if not name or not description:
        return jsonify({"error": "Missing name/description"}), 400

    try:
        query = "INSERT INTO items (name, description) VALUES (%s, %s)"
        item_id = query_db(query, (name, description), commit=True)
        return jsonify({"message": "Item added successfully", "id": item_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
