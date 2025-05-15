from datetime import datetime, timezone

product_categories_data = [
    {"id": 1, "name": "Apparel", "slug": "apparel"},
]

products_data = [
    {"id": 1, "name": "T-Shirt", "description": "A cool t-shirt", "base_price": 20.00, "category_id": 1, "image_url": "http://example.com/tshirt.jpg"},
]

product_variants_data = [
    {"id": 1, "product_id": 1, "color": "Red", "size": "M", "price_modifier": 2.0, "stock_status": "in_stock", "stock_quantity": 100, "image_url": "http://example.com/tshirt_red_m.jpg"},
    {"id": 2, "product_id": 1, "color": "Blue", "size": "L", "price_modifier": 2.5, "stock_status": "in_stock", "stock_quantity": 50, "image_url": "http://example.com/tshirt_blue_l.jpg"},
]

shipping_options_data = [
    {"id": 1, "name": "Standard Shipping", "base_cost": 5.00, "estimated_delivery_template": "5-7 business days"},
]
addresses_data = [
    {"id": 1, "user_id": 1, "street": "123 Main St", "city": "Anytown", "country": "USA", "is_default": True},
    # Add more addresses if needed for other users or orders
]

designs_data = [
    {
        "id": 1,
        "name": "Cool Red Tee Design",
        "user_id": 1,  # Assuming user with id 1 exists
        "product_id": 1, # Corresponds to the T-Shirt product
        "final_product_image_url": "http://example.com/designs/design_1.png",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "id": 2,
        "name": "Awesome Blue L Design",
        "user_id": 2,  # Assuming user with id 2 exists
        "product_id": 1, # Corresponds to the T-Shirt product
        "final_product_image_url": "http://example.com/designs/design_2.png",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "id": 3,
        "name": "User One Second Design",
        "user_id": 1, # Assuming user with id 1 exists
        "product_id": 1, # Corresponds to the T-Shirt product
        "final_product_image_url": "http://example.com/designs/design_3.png",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
]

# CartItem model requires design_id.
cart_items_data = [
    {
        "id": 1,
        "user_id": 1,      # Assuming user with id 1 exists
        "variant_id": 2,   # Corresponds to "Blue", "L" T-Shirt variant
        "design_id": 3,    # Corresponds to "User One Second Design" which is for product_id 1
        "quantity": 2,
        "customization_details": "No logo"
    },
    # Add another cart item example, perhaps for a different user or design
    {
        "id": 2,
        "user_id": 2,      # Assuming user with id 2 exists
        "variant_id": 1,   # Corresponds to "Red", "M" T-Shirt variant
        "design_id": 2,    # Corresponds to "Awesome Blue L Design" (note: design is for product_id 1, variant is also for product_id 1)
        "quantity": 1,
        "customization_details": "Add custom text: 'Birthday Fun'"
    }
]


# Orders and OrderItems need to be consistent with users, addresses, variants and designs.
# Assuming user_id 1, address_id 1 exists.
# OrderItem refers to variant_id and design_id.
orders_data = [
    {
        "id": 1,
        "user_id": 1,
        "shipping_address_id": 1,
        "billing_address_id": 1, # Can be same or different
        "shipping_option_name": "Standard Shipping", # From shipping_options_data
        "shipping_cost": 5.00,                     # From shipping_options_data
        "status": "completed",
        "total_amount": 51.50, # (22.00 * 1 item from design 1) + (22.50 * 1 from design 3) + 5.00 shipping
        "subtotal": 46.50,
        "tax_amount": 0.00, # Example, adjust as needed
        "payment_method": "Credit Card",
        "tracking_number": "TRK123456789",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
]

order_items_data = [
    {   # This item corresponds to ProductVariant 1 (Red, M, base_price 20 + modifier 2 = 22) and Design 1
        "id": 1,
        "order_id": 1,
        "variant_id": 1,
        "design_id": 1, # User 1's "Cool Red Tee Design"
        "product_name_snapshot": "T-Shirt", # Snapshot from Product
        "variant_details_snapshot": '{"color": "Red", "size": "M"}', # JSON string of relevant variant details
        "quantity": 1,
        "unit_price_snapshot": 22.00, # Product base_price (20.00) + Variant price_modifier (2.00)
        "item_total": 22.00
    },
    {   # This item corresponds to ProductVariant 2 (Blue, L, base_price 20 + modifier 2.5 = 22.50) and Design 3
        "id": 2,
        "order_id": 1,
        "variant_id": 2,
        "design_id": 3, # User 1's "User One Second Design"
        "product_name_snapshot": "T-Shirt", # Snapshot from Product
        "variant_details_snapshot": '{"color": "Blue", "size": "L"}', # JSON string
        "quantity": 1,
        "unit_price_snapshot": 22.50, # Product base_price (20.00) + Variant price_modifier (2.50)
        "item_total": 22.50
    }
]


# --- How to use (example with SQLAlchemy - adapt to your setup) ---
from app import db  # Assuming 'db' is your SQLAlchemy instance
from run import app
from app.models import Design, ProductCategory, Product, ProductVariant, Address, CartItem, ShippingOption, Order, OrderItem, Item

def load_mock_data():
    with app.app_context():

        for data in product_categories_data:
            if not db.session.get(ProductCategory, data['id']):
                db.session.add(ProductCategory(**data))
            else:
                print(f"ProductCategory with ID {data['id']} already exists. Skipping.")
        db.session.commit()

        for data in products_data:
            if not db.session.get(Product, data['id']):
                db.session.add(Product(**data))
            else:
                print(f"Product with ID {data['id']} already exists. Skipping.")
        db.session.commit()

        for data in product_variants_data:
            if not db.session.get(ProductVariant, data['id']):
                db.session.add(ProductVariant(**data))
            else:
                print(f"ProductVariant with ID {data['id']} already exists. Skipping.")
        db.session.commit()

        for data in designs_data:
            if not db.session.get(Design, data['id']):
                db.session.add(Design(**data))
            else:
                print(f"Design with ID {data['id']} already exists. Skipping.")
        db.session.commit()


        for data in shipping_options_data:
            if not db.session.get(ShippingOption, data['id']):
                db.session.add(ShippingOption(**data))
            else:
                print(f"ShippingOption with ID {data['id']} already exists. Skipping.")
        db.session.commit()

        for data in addresses_data:
            if not db.session.get(Address, data['id']):
                db.session.add(Address(**data))
            else:
                print(f"Address with ID {data['id']} already exists. Skipping.")
        db.session.commit()

        for data in orders_data:
            if not db.session.get(Order, data['id']):
                data_copy = data.copy()
                if 'created_at' in data_copy and isinstance(data_copy['created_at'], str):
                    data_copy['created_at'] = datetime.fromisoformat(data_copy['created_at'].replace('Z', '+00:00'))
                if 'updated_at' in data_copy and isinstance(data_copy['updated_at'], str):
                    data_copy['updated_at'] = datetime.fromisoformat(data_copy['updated_at'].replace('Z', '+00:00'))
                db.session.add(Order(**data_copy))
            else:
                print(f"Skipping duplicate Order with ID {data['id']}")
        db.session.commit()

        for data in order_items_data:
            if not db.session.get(OrderItem, data['id']):
                db.session.add(OrderItem(**data))
            else:
                print(f"Skipping duplicate OrderItem with ID {data['id']}")
        db.session.commit()

        for data in cart_items_data:
            if not db.session.get(CartItem, data['id']):
                db.session.add(CartItem(**data))
            else:
                print(f"Skipping duplicate CartItem with ID {data['id']}")
        db.session.commit()

            # for data in items_data:
            #     db.session.add(Item(**data))
            # db.session.commit()

        print("Mock data loaded successfully!")

load_mock_data()