from datetime import datetime, timezone
from decimal import ROUND_HALF_UP, Decimal
from flask import Blueprint, abort, current_app, json, jsonify, request, send_file
from .models import Item, Order, OrderItem, User, Product, ProductVariant, ProductCategory, Design, CartItem, Address, ShippingOption, db
from .auth import clerk_auth_required
from svix import Webhook, WebhookVerificationError
import os
from sqlalchemy import and_
from sqlalchemy.orm import selectinload, joinedload


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

@main_bp.route('/api/products', methods=['GET'])
def get_products():
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        category_id = request.args.get('category_id', type=int)
        color_filter = request.args.get('color', type=str)
        size_filter = request.args.get('size', type=str)

        query = Product.query.options(selectinload(Product.variants))

        if category_id:
            query = query.filter(Product.category_id == category_id)

        if color_filter and size_filter:
            query = query.join(Product.variants).filter(
                and_(ProductVariant.color == color_filter, ProductVariant.size == size_filter)
            )
        elif color_filter:
            query = query.join(Product.variants).filter(ProductVariant.color == color_filter)
        elif size_filter:
            query = query.join(Product.variants).filter(ProductVariant.size == size_filter)

        if color_filter or size_filter:
            query = query.distinct()

        paginated_products = query.paginate(page=page, per_page=limit, error_out=False)
        products_on_page = paginated_products.items

        data = []
        for product in products_on_page:
            variant_colors = []
            if product.variants:
                all_colors = [v.color for v in product.variants if v.color]
                if all_colors:
                    variant_colors = sorted(list(set(all_colors)))

            variant_sizes = []
            if product.variants:
                all_sizes = [v.size for v in product.variants if v.size]
                if all_sizes:
                    variant_sizes = sorted(list(set(all_sizes)))
            
            product_dict = {
                "id": product.id,
                "name": product.name,
                "description": product.description,
                "base_price": product.base_price,
                "colors": variant_colors,
                "sizes": variant_sizes,
                "image_url": product.image_url
            }
            data.append(product_dict)

        pagination_details = {
            "total_items": paginated_products.total,
            "total_pages": paginated_products.pages,
            "current_page": paginated_products.page,
            "next_page": paginated_products.next_page_num if paginated_products.has_next else None,
            "prev_page": paginated_products.prev_page_num if paginated_products.has_prev else None
        }
        
        return jsonify({
            "data": data,
            "pagination": pagination_details
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error in /api/products endpoint: {str(e)}")
        return jsonify({"error": "An unexpected error occurred while retrieving products.", "details": str(e)}), 500

@main_bp.route('/api/products/<int:product_id>', methods=['GET'])
def get_product_detail(product_id):
    try:
        product = db.session.query(Product).options(
            selectinload(Product.variants)
        ).get(product_id)

        if not product:
            return jsonify({"error": "Product not found"}), 404

        variants_data = []
        for variant in product.variants:
            variants_data.append({
                "variant_id": variant.id,
                "color": variant.color,
                "size": variant.size,
                "price_modifier": variant.price_modifier,
                "stock_status": variant.stock_status,
                "image_url": variant.image_url
            })

        response_data = {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "base_price": product.base_price,
            "image_url": product.image_url,
            "variants": variants_data
        }

        return jsonify(response_data), 200

    except Exception as e:
        current_app.logger.error(f"Error in /api/products/{product_id} endpoint: {str(e)}")
        return jsonify({"details": str(e)}), 500

@main_bp.route('/api/categories', methods=['GET'])
def get_categories():
    try:
        categories = ProductCategory.query.all()
        categories_data = [category.to_dict() for category in categories]
        
        return jsonify({"data": categories_data}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error in /api/categories endpoint: {str(e)}")
        return jsonify({"details": str(e)}), 500

@main_bp.route('/api/cart', methods=['GET'])
@clerk_auth_required
def get_cart(clerk_user_id):
    try:
        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        cart_items_query = CartItem.query.filter_by(user_id=user.id).options(
            selectinload(CartItem.design).selectinload(Design.product),
            selectinload(CartItem.variant)
        )
        cart_items = cart_items_query.all()
        
        cart_data = []
        total_price = Decimal("0.00")

        for item in cart_items:
            if not item.design or not item.design.product or not item.variant:
                current_app.logger.error(f"CartItem {item.id} has missing design, product, or variant link.")
                cart_data.append({
                    "id": item.id,
                    "error": "Incomplete item data (missing design, product, or variant link).",
                    "quantity": item.quantity,
                    "design_id": item.design_id,
                    "variant_id": item.variant_id
                })
                continue

            base_price = Decimal(str(item.design.product.base_price))
            price_modifier = Decimal(str(item.variant.price_modifier))
            effective_price = base_price + price_modifier
            item_total = effective_price * Decimal(item.quantity)
            total_price += item_total
            
            cart_data.append({
                "id": item.id,
                "user_id": item.user_id,
                "design_id": item.design.id,
                "design_name": item.design.name,
                "design_final_image_url": item.design.final_product_image_url,
                "variant_id": item.variant.id,
                "variant_color": item.variant.color,
                "variant_size": item.variant.size,
                "variant_image_url": item.variant.image_url, # Specific variant image
                "variant_stock_status": item.variant.stock_status,
                "quantity": item.quantity,
                "customization_details": json.loads(item.customization_details) if item.customization_details else None,
                "product_id": item.design.product.id,
                "product_name": item.design.product.name,
                "product_image_url": item.design.product.image_url,
                "base_price": float(base_price),
                "variant_price_modifier": float(price_modifier),
                "unit_price": float(effective_price),
                "item_total_price": float(item_total),
            })

        return jsonify({"cart": cart_data, "total_price": float(total_price)}), 200
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred.", "details": str(e)}), 500

@main_bp.route('/api/cart/items', methods=['POST'])
@clerk_auth_required
def add_to_cart(clerk_user_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    variant_id = data.get('variant_id')
    design_id = data.get('design_id')
    quantity = data.get('quantity')
    customization_details = data.get('customization_details') 

    if not isinstance(variant_id, int):
        return jsonify({"error": "Missing or invalid 'variant_id'. It must be an integer."}), 400
    if not isinstance(design_id, int):
        return jsonify({"error": "Missing or invalid 'design_id'. It must be an integer."}), 400
    if not isinstance(quantity, int) or quantity <= 0:
        return jsonify({"error": "Missing or invalid 'quantity'. It must be a positive integer."}), 400

    try:
        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if not user:
            return jsonify({"error": "Authenticated user not found in database"}), 404

        variant = ProductVariant.query.get(variant_id)
        if not variant:
            return jsonify({"error": "Product variant not found"}), 404
        
        design = Design.query.filter_by(id=design_id).first()

        if not design:
            return jsonify({"error": "Design not found or not accessible by user"}), 404
        if design.product_id != variant.product_id:
            return jsonify({"error": "Design does not match the product of the selected variant."}), 400

        if variant.stock_status == "out_of_stock":
            return jsonify({
                "error": "Item is out of stock",
                "variant_id": variant_id
            }), 400
        
        existing_item = CartItem.query.filter_by(
            user_id=user.id,
            variant_id=variant_id,
            design_id=design_id,
            customization_details=customization_details 
        ).first()

        current_quantity_already_in_cart = existing_item.quantity if existing_item else 0
        all_total_quantity = current_quantity_already_in_cart + quantity
        
        if variant.stock_quantity is not None:
            if all_total_quantity > variant.stock_quantity:
                available_to_add = variant.stock_quantity - current_quantity_already_in_cart
                if available_to_add <= 0:
                     return jsonify({
                        "error": f"Stock limit reached.",
                        "variant_id": variant_id,
                        "current_in_cart": current_quantity_already_in_cart,
                        "stock_available": variant.stock_quantity,
                        "can_add": max(0, available_to_add)
                    }), 400
                else:
                    return jsonify({
                        "error": f"Insufficient stock for the requested quantity.",
                        "variant_id": variant_id,
                        "can_add": available_to_add,
                        "current_in_cart": current_quantity_already_in_cart,
                        "stock_available": variant.stock_quantity
                    }), 400
        
        status_code = 200 
        if existing_item:
            existing_item.quantity += quantity
            message = "Cart updated successfully"
        else:
            new_cart_item = CartItem(
                user_id=user.id,
                variant_id=variant_id,
                design_id=design_id,
                quantity=quantity,
                customization_details=customization_details
            )
            db.session.add(new_cart_item)
            status_code = 201
            message = "Item added to cart"
        
        db.session.commit()
        updated_cart_items_query = CartItem.query.filter_by(user_id=user.id).options(
            selectinload(CartItem.design).selectinload(Design.product),
            selectinload(CartItem.variant)
        )
        
        updated_cart_items = updated_cart_items_query.all()

        cart_data = []
        for item in updated_cart_items:
            item_dict = item.to_dict()
            cart_data.append(item_dict)
        
        return jsonify({
            "message": message,
            "cart": cart_data 
        }), status_code

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred while updating the cart.", "details": str(e)}), 500

@main_bp.route('/api/cart/items/<int:cart_item_id>', methods=['PUT'])
@clerk_auth_required
def update_cart_item(clerk_user_id, cart_item_id):
    
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    new_quantity = data.get('quantity')

    if new_quantity is None or not isinstance(new_quantity, int) or new_quantity <= 0:
        return jsonify({"error": "Invalid 'quantity'. Must be a positive integer."}), 400

    try:
        user = User.query.options(
            selectinload(User.cart_items).selectinload(CartItem.variant)
        ).filter_by(clerk_user_id=clerk_user_id).first()
        
        if not user:
            return jsonify({"error": "Authenticated user not found in database"}), 404

        cart_item_to_update = None
        for item_in_user_cart in user.cart_items:
            if item_in_user_cart.id == cart_item_id:
                cart_item_to_update = item_in_user_cart
                break
        
        if not cart_item_to_update:
            return jsonify({"error": "Cart item not found"}), 404

        variant = cart_item_to_update.variant
        if not variant:
            return jsonify({"error": "Product variant details missing for this cart item."}), 500
            
        if variant.stock_status == "out_of_stock":
            return jsonify({
                "error": "Item is out of stock. Cannot update quantity.",
                "variant_id": variant.id
            }), 400
        
        if variant.stock_quantity is not None:
            quantity_of_this_variant_in_other_cart_lines = 0
            for item_in_cart in user.cart_items:
                if item_in_cart.variant_id == variant.id and item_in_cart.id != cart_item_to_update.id:
                    quantity_of_this_variant_in_other_cart_lines += item_in_cart.quantity
            
            all_total_quantity_for_variant_in_cart = quantity_of_this_variant_in_other_cart_lines + new_quantity
            
            if all_total_quantity_for_variant_in_cart > variant.stock_quantity:
                available_for_this_specific_line_item = variant.stock_quantity - quantity_of_this_variant_in_other_cart_lines
                return jsonify({
                    "error": f"Insufficient stock to set quantity to {new_quantity}. ",
                    "variant_id": variant.id,
                    "max_allowable_for_this_item": max(0, available_for_this_specific_line_item),
                    "stock_available_for_variant": variant.stock_quantity,
                    "quantity_in_other_lines": quantity_of_this_variant_in_other_cart_lines
                }), 400
        
        cart_item_to_update.quantity = new_quantity
        
        db.session.commit()

        final_cart_items_query = CartItem.query.filter_by(user_id=user.id)\
            .options(
                selectinload(CartItem.variant).selectinload(ProductVariant.product)
            )
        
        final_cart_items = final_cart_items_query.all()
        
        cart_data = []
        for item in final_cart_items:
            item_dict = item.to_dict() 
            cart_data.append(item_dict)

        return jsonify({
            "message": "Cart item updated",
            "cart": cart_data 
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred while updating the cart item.", "details": str(e)}), 500
 
@main_bp.route('/api/cart/items/<int:cart_item_id>', methods=['DELETE'])
@clerk_auth_required
def remove_cart_item(clerk_user_id, cart_item_id):
    try:
        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if not user:
            return jsonify({"error": "Authenticated user not found in database"}), 404

        cart_item_to_delete = CartItem.query.filter_by(id=cart_item_id, user_id=user.id).first()

        if not cart_item_to_delete:
            return jsonify({"error": "Cart item not found"}), 404

        db.session.delete(cart_item_to_delete)
        db.session.commit()

        updated_cart_items = CartItem.query.filter_by(user_id=user.id)\
            .options(selectinload(CartItem.variant).selectinload(ProductVariant.product))\
            .all()
        
        cart_data = [item.to_dict() for item in updated_cart_items]

        return jsonify({
            "message": "Item removed from cart",
            "cart": cart_data
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred while removing the item.", "details": str(e)}), 500

@main_bp.route('/api/cart', methods=['DELETE'])
@clerk_auth_required
def clear_cart(clerk_user_id):

    try:
        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if not user:
            return jsonify({"error": "Authenticated user not found in database"}), 404

        CartItem.query.filter_by(user_id=user.id).delete(synchronize_session='fetch')
        
        db.session.commit()

        empty_cart_response = {
            "items": [],
            "total": 0.00 
        }

        return jsonify({
            "message": "Cart cleared",
            "cart": empty_cart_response
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred while clearing the cart.", "details": str(e)}), 500

@main_bp.route('/api/addresses', methods=['POST'])
@clerk_auth_required
def add_address(clerk_user_id):

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    required_fields = ["street", "city", "state", "zip_code", "country", "phone_number"]
    missing_fields = []
    for field in required_fields:
        if field not in data or not data[field]:
            missing_fields.append(field)
    
    if missing_fields:
        return jsonify({"error": f"Missing or empty required fields: {', '.join(missing_fields)}"}), 400

    street = data["street"]
    city = data["city"]
    state = data["state"]
    zip_code = data["zip_code"]
    country = data["country"]
    phone_number = data["phone_number"]
    is_default_requested = data.get("is_default", False)

    try:
        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if not user:
            return jsonify({"error": "Authenticated user not found in database"}), 404

        if is_default_requested:
            current_default_address = Address.query.filter_by(user_id=user.id, is_default=True).first()
            if current_default_address:
                current_default_address.is_default = False
                db.session.add(current_default_address)

        new_address = Address(
            user_id=user.id,
            street=street,
            city=city,
            state=state,
            zip_code=zip_code,
            country=country,
            phone_number=phone_number,
            is_default=is_default_requested
        )

        db.session.add(new_address)
        db.session.commit()

        return jsonify({
            "message": "Address added successfully",
            "address": new_address.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred while adding the address.", "details": str(e)}), 500

@main_bp.route('/api/addresses', methods=['GET'])
@clerk_auth_required
def get_addresses(clerk_user_id):
    try:
        user = User.query.options(selectinload(User.addresses))\
                         .filter_by(clerk_user_id=clerk_user_id).first()
        
        if not user:
            return jsonify({"error": "Authenticated user not found in database"}), 404
        address_list_data = [address.to_dict() for address in user.addresses]

        return jsonify({
            "data": address_list_data
        }), 200

    except Exception as e:
        return jsonify({"error": "An unexpected error occurred while retrieving addresses.", "details": str(e)}), 500
@main_bp.route('/api/addresses/<int:address_id>', methods=['PUT'])
@clerk_auth_required
def update_address(clerk_user_id, address_id):

    data = request.get_json()

    if data is None:
        return jsonify({"error": "Invalid json data provided"}), 400
    if not data: 
        return jsonify({"error": "No fields provided for update"}), 400

    try:
        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if not user:
            return jsonify({"error": "Authenticated user not found in database"}), 404

        address_to_update = Address.query.filter_by(id=address_id, user_id=user.id).first()
        if not address_to_update:
            return jsonify({"error": "Address not found or does not belong to user"}), 404

        if "is_default" in data:
            requested_is_default = data.get("is_default")
            
            if not isinstance(requested_is_default, bool):
                return jsonify({"error": "'is_default' must be a boolean value (true or false)"}), 400

            if requested_is_default is True:
                if not address_to_update.is_default:
                    other_default_address = Address.query.filter(
                        Address.user_id == user.id,
                        Address.is_default == True
                    ).first()
                    
                    if other_default_address:
                        other_default_address.is_default = False
                        db.session.add(other_default_address)
                    address_to_update.is_default = True
            else:
                if address_to_update.is_default:
                    address_to_update.is_default = False
        
        non_nullable_fields_in_model = ["street", "city", "zip_code", "country"] 
        
        updatable_fields = ["street", "city", "state", "zip_code", "country", "phone_number"]
        for field in updatable_fields:
            if field in data:
                value = data[field]
                
                if value is None and field in non_nullable_fields_in_model:
                     return jsonify({"error": f"Field '{field}' cannot be set to null as it is required."}), 400
                
                setattr(address_to_update, field, value)
        
        db.session.add(address_to_update)
        db.session.commit()

        return jsonify({
            "message": "Address updated successfully",
            "address": address_to_update.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred while updating the address.", "details": str(e)}), 500

@main_bp.route('/api/addresses/<int:address_id>', methods=['DELETE'])
@clerk_auth_required
def delete_address(clerk_user_id, address_id):
    try:
        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if not user:
            return jsonify({"error": "Authenticated user not found in database"}), 404

        address_to_delete = Address.query.filter_by(id=address_id, user_id=user.id).first()

        if not address_to_delete:
            return jsonify({"error": "Address not found or does not belong to user"}), 404

        db.session.delete(address_to_delete)
        db.session.commit()

        return jsonify({"message": "Address deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "An unexpected error occurred while deleting the address.", "details": str(e)}), 500

@main_bp.route('/api/shipping/options', methods=['GET'])
@clerk_auth_required
def get_shipping_options(clerk_user_id):
    try:
        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if not user:
            return jsonify({"error": "Authenticated user not found in database"}), 404

        shipping_options = ShippingOption.query.all()
        shipping_options_data = [shipping_option.to_dict() for shipping_option in shipping_options]
        
        return jsonify({"shipping_options": shipping_options_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@main_bp.route('/api/orders', methods=['POST'])
@clerk_auth_required
def create_order(clerk_user_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    shipping_address_id = data.get("shipping_address_id")
    shipping_option_id_input = data.get("shipping_option_id")
    payment_method = data.get("payment_method")

    if not all([shipping_address_id, shipping_option_id_input, payment_method]):
        return jsonify({"error": "Missing required fields: shipping_address_id, shipping_option_id, payment_method"}), 400
    
    billing_address_id = data.get("billing_address_id", shipping_address_id) 
    try:
        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if not user: return jsonify({"error": "User not found"}), 404

        shipping_address = Address.query.filter_by(id=shipping_address_id, user_id=user.id).first()
        if not shipping_address: return jsonify({"error": "Shipping address not found or invalid"}), 400
        
        billing_addr = Address.query.filter_by(id=billing_address_id, user_id=user.id).first()
        if not billing_addr: return jsonify({"error": "Billing address not found or invalid"}), 400

        cart_items = CartItem.query.filter_by(user_id=user.id)\
            .options(
                selectinload(CartItem.variant).selectinload(ProductVariant.product),
                selectinload(CartItem.design) 
            ).all()
        if not cart_items:
            return jsonify({"error": "Cart is empty"}), 400
        
        selected_shipping_info = ShippingOption.query.filter_by(id=shipping_option_id_input).first()
        if not selected_shipping_info:
            return jsonify({"error": "Invalid shipping option ID"}), 400
        
        selected_shipping_info = selected_shipping_info.to_dict()
        shipping_cost = selected_shipping_info.get("base_cost", 4.99)
        shipping_option_name = selected_shipping_info.get("name", "Standard Shipping")
        
        shipping_cost = Decimal(str(shipping_cost))
        subtotal = Decimal("0.00")
        order_item_instances = []
        for item in cart_items:
            if not (item.variant and item.variant.product and \
                    hasattr(item.variant.product, 'base_price') and \
                    hasattr(item.variant, 'price_modifier')):
                current_app.logger.error(f"CartItem {item.id} for user {user.id} has incomplete variant or product data.")
                return jsonify({"error": f"Cart item (ID: {item.id}) has invalid or incomplete product/variant data."}), 400
            
            base_price = Decimal(str(item.variant.product.base_price))
            price_modifier = Decimal(str(item.variant.price_modifier))
            unit_price = base_price + price_modifier

            item_total = unit_price * Decimal(str(item.quantity))
            subtotal += item_total

            if item.design_id is None:
                 current_app.logger.error(f"CartItem {item.id} is missing design_id.")
                 return jsonify({"error": f"Cart item (ID: {item.id}) is missing design information."}), 400

            order_item_instances.append(OrderItem(
                variant_id=item.variant_id,
                design_id=item.design_id, # Added this line
                product_name_snapshot=item.variant.product.name,
                variant_details_snapshot=f"Color: {item.variant.color}, Size: {item.variant.size}", 
                quantity=item.quantity,
                unit_price_snapshot=float(unit_price), 
                item_total=float(item_total) 
            ))

        tax_amount = (subtotal * Decimal("0.07")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        total_amount = subtotal + tax_amount + shipping_cost

        new_order = Order(
            user_id=user.id,
            shipping_address_id=shipping_address.id,
            billing_address_id=billing_addr.id,
            shipping_option_name=shipping_option_name,
            shipping_cost=float(shipping_cost),
            status='pending_payment',
            total_amount=float(total_amount),
            subtotal=float(subtotal), 
            tax_amount=float(tax_amount), 
            payment_method=payment_method,
            items=order_item_instances, 
        )
        db.session.add(new_order)

        CartItem.query.filter_by(user_id=user.id).delete(synchronize_session=False)
        
        db.session.commit()

        order_response_data = new_order.to_dict()
        order_response_data['items'] = [oi.to_dict() for oi in new_order.items]
        order_response_data['shipping_address'] = new_order.shipping_address.to_dict() if new_order.shipping_address else None
        order_response_data['billing_address'] = new_order.billing_address.to_dict() if new_order.billing_address else None

        return jsonify({"message": "Order placed successfully", "order": order_response_data}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create order.", "details": str(e)}), 500


DEFAULT_ORDER_LIMIT = 10
MAX_ORDER_LIMIT = 50
@main_bp.route('/api/orders', methods=['GET'])
@clerk_auth_required
def get_orders(clerk_user_id):

    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', DEFAULT_ORDER_LIMIT, type=int)
        status_filter = request.args.get('status', None, type=str)

        if page < 1:
            page = 1
        if limit < 1:
            limit = DEFAULT_ORDER_LIMIT
        elif limit > MAX_ORDER_LIMIT:
            limit = MAX_ORDER_LIMIT

        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if not user:
            return jsonify({"error": "Authenticated user not found"}), 404 

        order_query = Order.query.filter_by(user_id=user.id)

        if status_filter:
            order_query = order_query.filter(Order.status == status_filter)

        order_query = order_query.order_by(Order.created_at.desc())
        paginated_orders = order_query.paginate(page=page, per_page=limit, error_out=False)
        
        orders_list_response = []
        for order in paginated_orders.items:
            order_dict = order.to_dict() 
            order_dict["id"] = f"ORD{order.id:05d}"
            order_items_list = []
            if order.items:
                for item in order.items:
                    order_items_list.append(item.to_dict()) 
            
            order_dict["items"] = order_items_list

            orders_list_response.append(order_dict)

        pagination_meta = {
            "current_page": paginated_orders.page,
            "limit": paginated_orders.per_page,
            "total_items": paginated_orders.total,
            "total_pages": paginated_orders.pages,
            "has_next": paginated_orders.has_next,
            "next_page": paginated_orders.next_num if paginated_orders.has_next else None,
            "has_prev": paginated_orders.has_prev,
            "prev_page": paginated_orders.prev_num if paginated_orders.has_prev else None,
        }

        return jsonify({
            "data": orders_list_response,
            "pagination": pagination_meta
        }), 200

    except Exception as e:
        return jsonify({"error": "An unexpected error occurred while retrieving orders.", "details": str(e)}), 500


@main_bp.route('/api/orders/<int:order_id>', methods=['GET'])
@clerk_auth_required
def get_order_details(clerk_user_id, order_id):
    """
    Retrieves details of a specific order for the authenticated user.
    """
    try:
        user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
        if not user:
            return jsonify({"error": "Authenticated user not found"}), 404

        order = Order.query.options(
            selectinload(Order.items).selectinload(OrderItem.variant),
            joinedload(Order.shipping_address),
            joinedload(Order.billing_address)
        ).filter_by(id=order_id, user_id=user.id).first()

        if not order:
            return jsonify({"error": "Order not found or access denied"}), 404

        order_data = order.to_dict()

        order_data["id"] = f"ORD{order.id:05d}"


        order_data["items"] = [item.to_dict() for item in order.items]

        if order.shipping_address:
            order_data["shipping_address"] = order.shipping_address.to_dict()
        else:
            order_data["shipping_address"] = None 

        if order.billing_address:
            order_data["billing_address"] = order.billing_address.to_dict()
        else:
            order_data["billing_address"] = None
            
        return jsonify(order_data), 200

    except Exception as e:
        return jsonify({"error": "An unexpected error occurred.", "details": str(e)}), 500


@main_bp.route('/api/designs', methods=['POST'])
@clerk_auth_required
def create_design(clerk_user_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    variant_id = data.get('variant_id')
    final_product_image_url = data.get('final_product_image_url')
    name = data.get('name')

    if not variant_id or not isinstance(variant_id, int):
        return jsonify({"error": "Missing or invalid 'variant_id'"}), 400
    if not final_product_image_url or not isinstance(final_product_image_url, str):
        return jsonify({"error": "Missing or invalid 'final_product_image_url'"}), 400
    if name and not isinstance(name, str):
        return jsonify({"error": "Invalid 'name', must be a string"}), 400

    variant = ProductVariant.query.get(variant_id)
    if not variant:
        return jsonify({"error": "ProductVariant not found"}), 404

    try:
        new_design = Design(
            user_id=user.id,
            variant_id=variant_id,
            final_product_image_url=final_product_image_url,
            name=name
        )
        db.session.add(new_design)
        db.session.commit()
        return jsonify(new_design.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating design: {str(e)}")
        return jsonify({"error": "Failed to create design", "details": str(e)}), 500

@main_bp.route('/api/designs', methods=['GET'])
@clerk_auth_required
def get_user_designs(clerk_user_id):
    user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)

        designs_query = Design.query \
            .options(
                joinedload(Design.product), 
                joinedload(Design.user)  
            ) \
            .order_by(Design.created_at.desc())
        
        paginated_designs = designs_query.paginate(page=page, per_page=limit, error_out=False)
        designs_on_page = paginated_designs.items

        designs_data = []
        for design in designs_on_page:
            design_dict = design.to_dict()
            
            if design.product:
                design_dict['product_details'] = design.product.to_dict()
            else:
                design_dict['product_details'] = None
            
            if design.user:
                design_dict['creator_name'] = design.user.username
            else:
                design_dict['creator_name'] = "Unknown" 
                
            designs_data.append(design_dict)

        pagination_details = {
            "total_items": paginated_designs.total,
            "total_pages": paginated_designs.pages,
            "current_page": paginated_designs.page,
            "next_page": paginated_designs.next_page_num if paginated_designs.has_next else None,
            "prev_page": paginated_designs.prev_page_num if paginated_designs.has_prev else None
        }

        return jsonify({
            "data": designs_data,
            "pagination": pagination_details
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching user designs: {str(e)}")
        return jsonify({"error": "Failed to fetch designs", "details": str(e)}), 500

@main_bp.route('/api/designs/<int:design_id>', methods=['GET'])
@clerk_auth_required
def get_design_detail(clerk_user_id, design_id):
    user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        design_query = Design.query.options(
            joinedload(Design.product),
            joinedload(Design.user)
        ).filter_by(id=design_id)

        design = design_query.first()

        if not design:
            return jsonify({"error": "Design not found"}), 404
        
        design_dict = design.to_dict()
        
        if design.product:
            design_dict['product_details'] = design.product.to_dict()
            design_dict['product_details']['variants'] = [
                variant.to_dict() for variant in design.product.variants
            ]
                
        else:
            design_dict['product_details'] = None

        
        if design.user:
            design_dict['creator_name'] = design.user.username
        else:
            design_dict['creator_name'] = "Unknown"

        return jsonify(design_dict), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching design {design_id}: {str(e)}")
        return jsonify({"error": "Failed to fetch design details", "details": str(e)}), 500

@main_bp.route('/api/designs/<int:design_id>', methods=['PUT'])
@clerk_auth_required
def update_design(clerk_user_id, design_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    design = Design.query.filter_by(id=design_id, user_id=user.id).first()
    if not design:
        return jsonify({"error": "Design not found or access denied"}), 404

    updated = False
    if 'name' in data:
        if data['name'] is None or isinstance(data['name'], str): 
            design.name = data['name']
            updated = True
        else:
            return jsonify({"error": "Invalid 'name', must be a string or null"}), 400
            
    if 'final_product_image_url' in data:
        if isinstance(data['final_product_image_url'], str) and data['final_product_image_url']:
            design.final_product_image_url = data['final_product_image_url']
            updated = True
        else:
            return jsonify({"error": "Invalid 'final_product_image_url', must be a non-empty string"}), 400

    if not updated:
        return jsonify({"message": "No changes provided to update."}), 200

    try:
        design.updated_at = datetime.now(timezone.utc)
        db.session.commit()
        return jsonify(design.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating design {design_id}: {str(e)}")
        return jsonify({"error": "Failed to update design", "details": str(e)}), 500

@main_bp.route('/api/designs/<int:design_id>', methods=['DELETE'])
@clerk_auth_required
def delete_design(clerk_user_id, design_id):
    """Delete a specific design."""
    user = User.query.filter_by(clerk_user_id=clerk_user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    design = Design.query.filter_by(id=design_id, user_id=user.id).first()
    if not design:
        return jsonify({"error": "Design not found or access denied"}), 404

    try:
        db.session.delete(design)
        db.session.commit()
        return jsonify({"message": "Design deleted successfully"}), 200 
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting design {design_id}: {str(e)}")
        return jsonify({"error": "Failed to delete design", "details": str(e)}), 500


from .print_on_shirt import overlay_images, fetch_image_from_url, allowed_file, Image, DESIGN_PLACEMENT_BOX, BytesIO
import uuid
from firebase_admin import storage
import firebase_admin.exceptions

@main_bp.route('/api/print-on-shirt', methods=['POST'])
def print_on_shirt():

    # shirt_image_url = request.form.get('shirt_image_url')
    # if not shirt_image_url:
    #     return jsonify({"error": "Missing 'shirt_image_url' in form data"}), 400

    shirt_image_url = "https://blob.apliiq.com/sitestorage/resized-products/4159488_4461_577_880.jpg?v=1"

    if 'design_image' not in request.files:
        return jsonify({"error": "No 'design_image' file part in the request"}), 400

    design_file = request.files['design_image']

    if design_file.filename == '':
        return jsonify({"error": "No selected file for 'design_image'"}), 400

    if not design_file or not allowed_file(design_file.filename):
        return jsonify({"error": "Invalid file type for 'design_image'. Allowed: png, jpg, jpeg"}), 400

    try:
        design_image_pil = Image.open(design_file.stream)
    except IOError:
        return jsonify({"error": "Could not open or read 'design_image'. Is it a valid image?"}), 400


    shirt_image_pil = fetch_image_from_url(shirt_image_url)
    if not shirt_image_pil:
        return jsonify({"error": f"Could not fetch or open shirt image from URL: {shirt_image_url}"}), 500


    placement_box = DESIGN_PLACEMENT_BOX 

    result_image_pil = overlay_images(shirt_image_pil, design_image_pil, placement_box)
    if not result_image_pil:
        return jsonify({"error": "Failed to overlay images."}), 500

    img_io = BytesIO()
    try:
        image_format = 'PNG'
        mime_type = f'image/{image_format.lower()}'
        result_image_pil.save(img_io, format=image_format)
        img_io.seek(0)
    except Exception as e:
        return jsonify({"error": f"Failed to save processed image to memory buffer: {str(e)}"}), 500

    try:
        if not firebase_admin._apps:
            return jsonify({"error": "Firebase Admin SDK not initialized."}), 500

        bucket = storage.bucket()

        unique_filename = f"printed_shirts/{uuid.uuid4()}.{image_format.lower()}"

        blob = bucket.blob(unique_filename)

        blob.upload_from_file(img_io, content_type=mime_type)

        blob.make_public()
        public_url = blob.public_url

        return jsonify({
            "message": "Image processed and uploaded successfully to Firebase Storage.",
            "imageUrl": public_url
        }), 200

    except firebase_admin.exceptions.FirebaseError as fe:
        return jsonify({"error": f"Firebase Storage error: {str(fe)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred during Firebase upload: {str(e)}"}), 500


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
