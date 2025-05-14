from datetime import datetime, timezone

product_categories_data = [
    {"id": 1, "name": "Electronics", "slug": "electronics"},
    {"id": 2, "name": "Apparel", "slug": "apparel"},
    {"id": 3, "name": "Home Goods", "slug": "home-goods"},
    {"id": 4, "name": "Books", "slug": "books"},
    {"id": 5, "name": "Sports & Outdoors", "slug": "sports-outdoors"}
]

products_data = [
    {
        "id": 1, "name": "Smart LED TV 55 inch", "description": "A 55-inch 4K Smart LED TV with HDR.",
        "base_price": 499.99, "image_url": "/images/tv_main.jpg", "category_id": 1
    },
    {
        "id": 2, "name": "Wireless Noise-Cancelling Headphones", "description": "Over-ear headphones with active noise cancellation and 20-hour battery life.",
        "base_price": 199.50, "image_url": "/images/headphones_main.jpg", "category_id": 1
    },
    {
        "id": 3, "name": "Men's Cotton T-Shirt", "description": "Comfortable and durable 100% cotton t-shirt.",
        "base_price": 25.00, "image_url": "/images/tshirt_main.jpg", "category_id": 2
    },
    {
        "id": 4, "name": "Women's Running Shoes", "description": "Lightweight and breathable running shoes for women.",
        "base_price": 79.95, "image_url": "/images/womens_shoes_main.jpg", "category_id": 2
    },
    {
        "id": 5, "name": "Robotic Vacuum Cleaner", "description": "Smart vacuum cleaner with mapping technology and app control.",
        "base_price": 299.00, "image_url": "/images/robot_vacuum_main.jpg", "category_id": 3
    },
    {
        "id": 6, "name": "Coffee Maker with Grinder", "description": "Drip coffee maker with built-in burr grinder.",
        "base_price": 120.75, "image_url": "/images/coffee_maker_main.jpg", "category_id": 3
    },
    {
        "id": 7, "name": "The Midnight Library - Novel", "description": "A novel by Matt Haig.",
        "base_price": 15.99, "image_url": "/images/midnight_library.jpg", "category_id": 4
    },
    {
        "id": 8, "name": "Yoga Mat - Eco Friendly", "description": "Non-slip, eco-friendly yoga mat.",
        "base_price": 35.50, "image_url": "/images/yoga_mat.jpg", "category_id": 5
    }
]

product_variants_data = [
    # Variants for Smart LED TV (Product ID: 1)
    {
        "id": 1, "product_id": 1, "color": "Black", "size": "55 inch", "price_modifier": 0.0,
        "stock_status": "in_stock", "stock_quantity": 50, "image_url": "/images/tv_black_55.jpg"
    },
    # Variants for Headphones (Product ID: 2)
    {
        "id": 2, "product_id": 2, "color": "Black", "size": None, "price_modifier": 0.0,
        "stock_status": "in_stock", "stock_quantity": 120, "image_url": "/images/headphones_black.jpg"
    },
    {
        "id": 3, "product_id": 2, "color": "Silver", "size": None, "price_modifier": 5.0, # Slightly more expensive
        "stock_status": "in_stock", "stock_quantity": 75, "image_url": "/images/headphones_silver.jpg"
    },
    {
        "id": 4, "product_id": 2, "color": "Blue", "size": None, "price_modifier": 0.0,
        "stock_status": "out_of_stock", "stock_quantity": 0, "image_url": "/images/headphones_blue.jpg"
    },
    # Variants for Men's T-Shirt (Product ID: 3)
    {
        "id": 5, "product_id": 3, "color": "White", "size": "M", "price_modifier": 0.0,
        "stock_status": "in_stock", "stock_quantity": 200, "image_url": "/images/tshirt_white_m.jpg"
    },
    {
        "id": 6, "product_id": 3, "color": "White", "size": "L", "price_modifier": 0.0,
        "stock_status": "in_stock", "stock_quantity": 150, "image_url": "/images/tshirt_white_l.jpg"
    },
    {
        "id": 7, "product_id": 3, "color": "Black", "size": "M", "price_modifier": 0.0,
        "stock_status": "in_stock", "stock_quantity": 180, "image_url": "/images/tshirt_black_m.jpg"
    },
    {
        "id": 8, "product_id": 3, "color": "Black", "size": "XL", "price_modifier": 2.50, # XL slightly more
        "stock_status": "preorder", "stock_quantity": 0, "image_url": "/images/tshirt_black_xl.jpg"
    },
    # Variants for Women's Running Shoes (Product ID: 4)
    {
        "id": 9, "product_id": 4, "color": "Pink", "size": "7", "price_modifier": 0.0,
        "stock_status": "in_stock", "stock_quantity": 60, "image_url": "/images/womens_shoes_pink_7.jpg"
    },
    {
        "id": 10, "product_id": 4, "color": "Pink", "size": "8", "price_modifier": 0.0,
        "stock_status": "in_stock", "stock_quantity": 50, "image_url": "/images/womens_shoes_pink_8.jpg"
    },
    {
        "id": 11, "product_id": 4, "color": "Teal", "size": "8", "price_modifier": 0.0,
        "stock_status": "out_of_stock", "stock_quantity": 0, "image_url": "/images/womens_shoes_teal_8.jpg"
    },
    # Variant for Robotic Vacuum (Product ID: 5) - Assuming one variant for simplicity
    {
        "id": 12, "product_id": 5, "color": "Charcoal", "size": None, "price_modifier": 0.0,
        "stock_status": "in_stock", "stock_quantity": 30, "image_url": "/images/robot_vacuum_charcoal.jpg"
    },
    # Variant for Coffee Maker (Product ID: 6)
    {
        "id": 13, "product_id": 6, "color": "Stainless Steel", "size": None, "price_modifier": 0.0,
        "stock_status": "in_stock", "stock_quantity": 45, "image_url": "/images/coffee_maker_ss.jpg"
    },
    # Variant for Book (Product ID: 7) - Usually no variants, but let's add one for hardcover
    {
        "id": 14, "product_id": 7, "color": None, "size": "Hardcover", "price_modifier": 4.01, # Hardcover more expensive
        "stock_status": "in_stock", "stock_quantity": 100, "image_url": "/images/midnight_library_hc.jpg"
    },
    {
        "id": 15, "product_id": 7, "color": None, "size": "Paperback", "price_modifier": 0.0,
        "stock_status": "in_stock", "stock_quantity": 250, "image_url": "/images/midnight_library_pb.jpg"
    },
    # Variant for Yoga Mat (Product ID: 8)
    {
        "id": 16, "product_id": 8, "color": "Teal", "size": "Standard", "price_modifier": 0.0,
        "stock_status": "in_stock", "stock_quantity": 90, "image_url": "/images/yoga_mat_teal.jpg"
    },
    {
        "id": 17, "product_id": 8, "color": "Purple", "size": "Standard", "price_modifier": 0.0,
        "stock_status": "in_stock", "stock_quantity": 70, "image_url": "/images/yoga_mat_purple.jpg"
    }
]

# --- Address Mock Data (user_id are placeholders) ---
addresses_data = [
    {
        "id": 1, "user_id": 1, "street": "123 Main St", "city": "Anytown", "state": "CA",
        "zip_code": "90210", "country": "USA", "phone_number": "555-1234", "is_default": True
    },
    {
        "id": 2, "user_id": 1, "street": "456 Oak Ave", "city": "Anytown", "state": "CA",
        "zip_code": "90211", "country": "USA", "phone_number": "555-5678", "is_default": False
    },
    {
        "id": 3, "user_id": 2, "street": "789 Pine Ln", "city": "Otherville", "state": "NY",
        "zip_code": "10001", "country": "USA", "phone_number": "555-8765", "is_default": True
    },
    {
        "id": 4, "user_id": 2, "street": "10 Downing Street", "city": "London", "state": None, # No state for UK
        "zip_code": "SW1A 2AA", "country": "UK", "phone_number": "+44 20 7123 4567", "is_default": True
    }
]


# --- CartItem Mock Data (user_id are placeholders) ---
cart_items_data = [
    {
        "id": 1, "user_id": 1, "variant_id": 5, "quantity": 2, # User 1: 2x White M T-Shirt
        "customization_details": "Gift wrap request: Blue ribbon."
    },
    {
        "id": 2, "user_id": 1, "variant_id": 2, "quantity": 1, # User 1: 1x Black Headphones
        "customization_details": None
    },
    {
        "id": 3, "user_id": 2, "variant_id": 10, "quantity": 1, # User 2: 1x Pink Women's Shoes Size 8
        "customization_details": None
    },
    {
        "id": 4, "user_id": 2, "variant_id": 14, "quantity": 1, # User 2: 1x Midnight Library Hardcover
        "customization_details": "Please include a bookmark."
    },
    {
        "id": 5, "user_id": 2, "variant_id": 12, "quantity": 1, # User 3: 1x Robot Vacuum
        "customization_details": None
    }
]

# --- ShippingOption Mock Data ---
shipping_options_data = [
    {
        "id": 1, "name": "Standard Shipping", "base_cost": 5.00,
        "estimated_delivery_template": "5-7 business days"
    },
    {
        "id": 2, "name": "Express Shipping", "base_cost": 15.00,
        "estimated_delivery_template": "1-3 business days"
    },
    {
        "id": 3, "name": "International Standard", "base_cost": 25.00,
        "estimated_delivery_template": "10-15 business days"
    },
    {
        "id": 4, "name": "Free Shipping (Orders over $100)", "base_cost": 0.00,
        "estimated_delivery_template": "5-7 business days"
    }
]

# --- Order Mock Data (user_id are placeholders) ---

orders_data = [
    {
        "id": 1, "user_id": 1, "shipping_address_id": 1, "billing_address_id": 1,
        "shipping_option_name": "Standard Shipping", "shipping_cost": 5.00,
        "status": "completed", "total_amount": 254.50, "subtotal": 249.50, "tax_amount": 0.00,
        "payment_method": "credit card", "tracking_number": "1Z999AA10123456789",
        "created_at": datetime(2024, 1, 15, 10, 30, 0, tzinfo=timezone.utc),
        "updated_at": datetime(2024, 1, 17, 11, 0, 0, tzinfo=timezone.utc)
    },
    {
        "id": 2, "user_id": 2, "shipping_address_id": 3, "billing_address_id": 3,
        "shipping_option_name": "Express Shipping", "shipping_cost": 15.00,
        "status": "shipped", "total_amount": 114.94, "subtotal": 99.94, "tax_amount": 0.00,
        "payment_method": "cash", "tracking_number": "TN789XYZ123",
        "created_at": datetime(2024, 2, 1, 14, 0, 0, tzinfo=timezone.utc),
        "updated_at": datetime(2024, 2, 2, 9, 15, 0, tzinfo=timezone.utc)
    },
    {
        "id": 3, "user_id": 1, "shipping_address_id": 2, "billing_address_id": 1, # Different shipping address
        "shipping_option_name": "Free Shipping (Orders over $100)", "shipping_cost": 0.00,
        "status": "pending_payment", "total_amount": 120.75, "subtotal": 120.75, "tax_amount": 0.00,
        "payment_method": "credit card", "tracking_number": None,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    },
    {
        "id": 4, "user_id": 2, "shipping_address_id": 4, "billing_address_id": 4,
        "shipping_option_name": "International Standard", "shipping_cost": 25.00,
        "status": "processing", "total_amount": 324.00, "subtotal": 299.00, "tax_amount": 0.00,
        "payment_method": "cash", "tracking_number": None,
        "created_at": datetime(2024, 2, 20, 18, 0, 0, tzinfo=timezone.utc),
        "updated_at": datetime(2024, 2, 21, 10, 0, 0, tzinfo=timezone.utc)
    }
]
order_items_data = [
    # Order 1 (User 1)
    { # 2x White M T-Shirt for order 1
        "id": 1, "order_id": 1, "variant_id": 5,
        "product_name_snapshot": "Men's Cotton T-Shirt",
        "variant_details_snapshot": '{"color": "White", "size": "M"}',
        "quantity": 2, "unit_price_snapshot": 25.00, "item_total": 50.00
    },
    { # 1x Black Headphones for order 1
        "id": 2, "order_id": 1, "variant_id": 2,
        "product_name_snapshot": "Wireless Noise-Cancelling Headphones",
        "variant_details_snapshot": '{"color": "Black", "size": null}',
        "quantity": 1, "unit_price_snapshot": 199.50, "item_total": 199.50
    },
    # Order 2 (User 2)
    { # 1x Pink Women's Shoes Size 8 for order 2
        "id": 3, "order_id": 2, "variant_id": 10,
        "product_name_snapshot": "Women's Running Shoes",
        "variant_details_snapshot": '{"color": "Pink", "size": "8"}',
        "quantity": 1, "unit_price_snapshot": 79.95, "item_total": 79.95
    },
    { # 1x Midnight Library Hardcover for order 2
        "id": 4, "order_id": 2, "variant_id": 14,
        "product_name_snapshot": "The Midnight Library - Novel",
        "variant_details_snapshot": '{"color": null, "size": "Hardcover", "price_modifier": 4.01}', # Price was base + modifier
        "quantity": 1, "unit_price_snapshot": 15.99 + 4.01, "item_total": 20.00 # 15.99 (base) + 4.01 (modifier)
    },
    # Order 3 (User 1, pending)
    { # 1x Coffee Maker for order 3
        "id": 5, "order_id": 3, "variant_id": 13,
        "product_name_snapshot": "Coffee Maker with Grinder",
        "variant_details_snapshot": '{"color": "Stainless Steel", "size": null}',
        "quantity": 1, "unit_price_snapshot": 120.75, "item_total": 120.75
    },
    # Order 4 (User 3, processing)
    { # 1x Robot Vacuum for order 4
        "id": 6, "order_id": 4, "variant_id": 12,
        "product_name_snapshot": "Robotic Vacuum Cleaner",
        "variant_details_snapshot": '{"color": "Charcoal", "size": null}',
        "quantity": 1, "unit_price_snapshot": 299.00, "item_total": 299.00
    }
]


# --- How to use (example with SQLAlchemy - adapt to your setup) ---
from app import db  # Assuming 'db' is your SQLAlchemy instance
from run import app
from app.models import ProductCategory, Product, ProductVariant, Address, CartItem, ShippingOption, Order, OrderItem, Item

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

        for data in shipping_options_data:
            if not db.session.get(ShippingOption, data['id']):
                db.session.add(ShippingOption(**data))
            else:
                print(f"ShippingOption with ID {data['id']} already exists. Skipping.")
        db.session.commit()

       
        for data in addresses_data: # User IDs are placeholders
            if not db.session.get(Address, data['id']):
                db.session.add(Address(**data))
            else:
                print(f"Address with ID {data['id']} already exists. Skipping.")
        db.session.commit()


        for data in orders_data: # User IDs are placeholders
            # Convert ISO string dates back to datetime objects if your model expects them
            if not db.session.get(Order, data['id']):
                # Convert ISO string dates back to datetime objects
                data_copy = data.copy() # Work on a copy to avoid modifying original dict
                data_copy['created_at'] = datetime.fromisoformat(data_copy['created_at'].replace('Z', '+00:00')) if isinstance(data_copy['created_at'], str) else data_copy['created_at']
                data_copy['updated_at'] = datetime.fromisoformat(data_copy['updated_at'].replace('Z', '+00:00')) if isinstance(data_copy['updated_at'], str) else data_copy['updated_at']
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

        for data in cart_items_data: # User IDs are placeholders
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