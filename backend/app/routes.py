from datetime import datetime, timezone
from flask import Blueprint, abort, current_app, jsonify, request
from .models import Item, User, Product, ProductCategory, ProductVariant, db
from .auth import clerk_auth_required
from svix import Webhook, WebhookVerificationError
import os


main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return jsonify({"message": "Hello from Flask"})

# This is clerk webhook endpoint. Needs to be public so that Clerk can send events to it.
# Use ngrok to do in development
@main_bp.route('/api/webhooks/clerk', methods=['POST'])
def clerk_webhook():
    logger = current_app.logger
    logger.info("Webhook received")

    WEBHOOK_SECRET = os.environ.get("CLERK_WEBHOOK_SECRET_KEY")
    if not WEBHOOK_SECRET:
        logger.error("Webhook secret not set")
        abort(500, "Webhook secret not set")
    
    headers = request.headers
    svix_id = headers.get("svix-id")
    svix_timestamp = headers.get('svix-timestamp')
    svix_signature = headers.get('svix-signature')

    if not svix_id or not svix_timestamp or not svix_signature:
        logger.warning("Webhook verification failed: Missing Svix headers.")
        abort(400, description="Error occurred: Missing Svix headers.")

    payload_bytes = request.data
    if not payload_bytes:
        logger.warning("Webhook received empty payload.")
        abort(400, description="Error occurred: Empty payload.")

    try:
        wh = Webhook(WEBHOOK_SECRET)
        evt = wh.verify(payload_bytes, headers)
        logger.info(f"Webhook verified successfully. Event type: {evt['type']}")
    except WebhookVerificationError as e:
        logger.error(f"Webhook verification failed: {e}")
        abort(400, description=f"Webhook Error: {e}")
    except Exception as e:
        logger.error(f"An unexpected error occurred during verification: {e}")
        abort(500, description="Internal Server Error during verification.")

    event_type = evt['type']
    event_data = evt['data']

    try:
        if event_type == 'user.created':
            clerk_id = event_data.get('id')
            if not clerk_id:
                    logger.error("user.created event missing user ID.")
                    abort(400, description="Missing user ID in event data.")

            logger.info(f"Processing user.created for Clerk ID: {clerk_id}")

            existing_user = db.session.execute(db.select(User).filter_by(clerk_user_id=clerk_id)).scalar_one_or_none()
            if existing_user:
                logger.info(f"User {clerk_id} already exists in DB. Skipping creation.")
                return jsonify(success=True), 200

            primary_email = None
            email_list = event_data.get('email_addresses', [])
            primary_email_id = event_data.get('primary_email_address_id')
            if primary_email_id and email_list:
                for email_obj in email_list:
                    if email_obj.get('id') == primary_email_id:
                        primary_email = email_obj.get('email_address')
                        break

            new_user = User(
                clerk_user_id=clerk_id,
                email=primary_email,
                username=event_data.get('first_name'),
                firstname=event_data.get('first_name'),
                lastname=event_data.get('last_name'),
                created_at=datetime.fromtimestamp(event_data.get('created_at')/1000.00, tz=timezone.utc),

            )
            db.session.add(new_user)
            db.session.commit()
            logger.info(f"User {clerk_id} created in database.")

        elif event_type == 'user.updated':
            clerk_id = event_data.get('id')
            if not clerk_id:
                    logger.error("user.updated event missing user ID.")
                    abort(400, description="Missing user ID in event data.")

            logger.info(f"Processing user.updated for Clerk ID: {clerk_id}")

            user_to_update = db.session.execute(db.select(User).filter_by(clerk_user_id=clerk_id)).scalar_one_or_none()
            if not user_to_update:
                logger.warning(f"User {clerk_id} not found in DB for update.")
                return jsonify(success=True, message="User not found"), 200

            primary_email = None
            email_list = event_data.get('email_addresses', [])
            primary_email_id = event_data.get('primary_email_address_id')
            if primary_email_id and email_list:
                    for email_obj in email_list:
                        if email_obj.get('id') == primary_email_id:
                            primary_email = email_obj.get('email_address')
                            break

            user_to_update.email = primary_email
            user_to_update.username = event_data.get('first_name')
            user_to_update.firstname = event_data.get('first_name')
            user_to_update.lastname = event_data.get('last_name')
            db.session.commit()
            logger.info(f"User {clerk_id} updated in database.")

        elif event_type == 'user.deleted':
            clerk_id = event_data.get('id')
            if not clerk_id:
                logger.error("user.deleted event missing user ID.")
                abort(400, description="Missing user ID in event data.")

            logger.info(f"Processing user.deleted for Clerk ID: {clerk_id}")

            user_to_delete = db.session.execute(db.select(User).filter_by(clerk_user_id=clerk_id)).scalar_one_or_none()
            if user_to_delete:
                db.session.delete(user_to_delete)
                db.session.commit()
                logger.info(f"User {clerk_id} deleted from database.")
            else:
                logger.warning(f"User {clerk_id} not found in DB for deletion.")

        else:
            logger.info(f"Received unhandled event type: {event_type}")

        return jsonify(success=True), 200

    except Exception as e:
        logger.error(f"Error processing webhook event {evt.get('id', 'unknown')}: {e}", exc_info=True)
        db.session.rollback()
        abort(500, description=f"Internal Server Error: Failed to process webhook event.")
    

@main_bp.route('/api/profile', methods=['GET'])
@clerk_auth_required
def get_profile(clerk_user_id):
    try:
        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if user:
            return jsonify(user.to_dict())
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

 
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

@main_bp.route('/api/categories')
def get_categories():
    try:
        categories = ProductCategory.query.all()
        if not categories:
            return jsonify({"error": "No categories found"}), 404
        categories_data = [category.to_dict() for category in categories]

        return jsonify({"data" : categories_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main_bp.route('/api/products/<product_id>', methods=["GET"])
def get_product_by_id(product_id):
    try:
        product = Product.query.filter_by(id=product_id).first()
        if not product:
            return jsonify({"error": "Product not found"}), 404

        return jsonify(product.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 500