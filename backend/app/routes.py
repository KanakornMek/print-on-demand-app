from flask import Blueprint, jsonify, request
from .models import Item, db

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return jsonify({"message": "Hello from Flask"})

@main_bp.route('/api/items', methods=['GET'])
def get_items():
    try:
        # items = query_db("SELECT id, name, description FROM items")
        # return jsonify(items)
        items = Item.query.all()
        return jsonify([item.to_dict() for item in items])
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
        # query = "INSERT INTO items (name, description) VALUES (%s, %s)"
        # item_id = query_db(query, (name, description), commit=True)
        # return jsonify({"message": "Item added successfully", "id": item_id}), 201
        new_item = Item(name=name, description=description)
        db.session.add(new_item)
        db.session.commit()

        return jsonify({"message": "Item added successfully", "id": new_item.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
