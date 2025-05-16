from datetime import datetime, timezone

product_categories_data = [
    {"id": 1, "name": "Apparel", "slug": "apparel"},
]

products_data = [
    {"id": 1, "name": "T-Shirt", "description": "A cool t-shirt", "base_price": 20.00, "category_id": 1, "image_url": "http://example.com/tshirt.jpg"},
]

product_variants_data = [
    {"id": 1, "product_id": 1, "color": "White", "size": "S", "price_modifier": 2.0, "stock_status": "in_stock", "stock_quantity": 100, "image_url": "https://www.craftclothing.ph/cdn/shop/files/standard-plain-round-neck-shirt-white_49d15c1b-697e-45e2-b40b-29807d377b6e_600x.png?v=1740991398"},
    {"id": 2, "product_id": 1, "color": "White", "size": "M", "price_modifier": 2.0, "stock_status": "in_stock", "stock_quantity": 100, "image_url": "https://www.craftclothing.ph/cdn/shop/files/standard-plain-round-neck-shirt-white_49d15c1b-697e-45e2-b40b-29807d377b6e_600x.png?v=1740991398"},
    {"id": 3, "product_id": 1, "color": "White", "size": "L", "price_modifier": 2.5, "stock_status": "in_stock", "stock_quantity": 50, "image_url": "https://www.craftclothing.ph/cdn/shop/files/standard-plain-round-neck-shirt-white_49d15c1b-697e-45e2-b40b-29807d377b6e_600x.png?v=1740991398"},
    {"id": 4, "product_id": 1, "color": "White", "size": "XL", "price_modifier": 3.0, "stock_status": "in_stock", "stock_quantity": 25, "image_url": "https://www.craftclothing.ph/cdn/shop/files/standard-plain-round-neck-shirt-white_49d15c1b-697e-45e2-b40b-29807d377b6e_600x.png?v=1740991398"},
    {"id": 5, "product_id": 1, "color": "Coral", "size": "S", "price_modifier": 2.0, "stock_status": "in_stock", "stock_quantity": 100, "image_url": "https://www.craftclothing.ph/cdn/shop/files/winner-plain-round-neck-shirt-coral_e19a466b-9a77-4aaf-ab92-eed406627d97_600x.png?v=1740991398"},
    {"id": 6, "product_id": 1, "color": "Coral", "size": "M", "price_modifier": 2.0, "stock_status": "in_stock", "stock_quantity": 100, "image_url": "https://www.craftclothing.ph/cdn/shop/files/winner-plain-round-neck-shirt-coral_e19a466b-9a77-4aaf-ab92-eed406627d97_600x.png?v=1740991398"},
    {"id": 7, "product_id": 1, "color": "Coral", "size": "L", "price_modifier": 2.5, "stock_status": "in_stock", "stock_quantity": 50, "image_url": "https://www.craftclothing.ph/cdn/shop/files/winner-plain-round-neck-shirt-coral_e19a466b-9a77-4aaf-ab92-eed406627d97_600x.png?v=1740991398"},
    {"id": 8, "product_id": 1, "color": "Coral", "size": "XL", "price_modifier": 3.0, "stock_status": "in_stock", "stock_quantity": 25, "image_url": "https://www.craftclothing.ph/cdn/shop/files/winner-plain-round-neck-shirt-coral_e19a466b-9a77-4aaf-ab92-eed406627d97_600x.png?v=1740991398"},
    {"id": 9, "product_id": 1, "color": "Aqua", "size": "S", "price_modifier": 2.0, "stock_status": "in_stock", "stock_quantity": 100, "image_url": "https://www.craftclothing.ph/cdn/shop/files/winner-plain-round-neck-shirt-djaqua_07a696bd-5663-4f8f-acd5-a0243d87ecc8_600x.png?v=1740991398"},
    {"id": 10, "product_id": 1, "color": "Aqua", "size": "M", "price_modifier": 2.0, "stock_status": "in_stock", "stock_quantity": 100, "image_url": "https://www.craftclothing.ph/cdn/shop/files/winner-plain-round-neck-shirt-djaqua_07a696bd-5663-4f8f-acd5-a0243d87ecc8_600x.png?v=1740991398"},
    {"id": 11, "product_id": 1, "color": "Aqua", "size": "L", "price_modifier": 2.5, "stock_status": "in_stock", "stock_quantity": 50, "image_url": "https://www.craftclothing.ph/cdn/shop/files/winner-plain-round-neck-shirt-djaqua_07a696bd-5663-4f8f-acd5-a0243d87ecc8_600x.png?v=1740991398"},
    {"id": 12, "product_id": 1, "color": "Aqua", "size": "XL", "price_modifier": 3.0, "stock_status": "in_stock", "stock_quantity": 25, "image_url": "https://www.craftclothing.ph/cdn/shop/files/winner-plain-round-neck-shirt-djaqua_07a696bd-5663-4f8f-acd5-a0243d87ecc8_600x.png?v=1740991398"},
    {"id": 13, "product_id": 1, "color": "White", "size": "XS", "price_modifier": 1.5, "stock_status": "in_stock", "stock_quantity": 110, "image_url": "https://www.craftclothing.ph/cdn/shop/files/standard-plain-round-neck-shirt-white_49d15c1b-697e-45e2-b40b-29807d377b6e_600x.png?v=1740991398"},
    {"id": 14, "product_id": 1, "color": "Coral", "size": "XS", "price_modifier": 1.5, "stock_status": "in_stock", "stock_quantity": 110, "image_url": "https://www.craftclothing.ph/cdn/shop/files/winner-plain-round-neck-shirt-coral_e19a466b-9a77-4aaf-ab92-eed406627d97_600x.png?v=1740991398"},
    {"id": 15, "product_id": 1, "color": "Aqua", "size": "XS", "price_modifier": 1.5, "stock_status": "in_stock", "stock_quantity": 110, "image_url": "https://www.craftclothing.ph/cdn/shop/files/winner-plain-round-neck-shirt-djaqua_07a696bd-5663-4f8f-acd5-a0243d87ecc8_600x.png?v=1740991398"},
    {"id": 16, "product_id": 1, "color": "White", "size": "XXL", "price_modifier": 3.5, "stock_status": "in_stock", "stock_quantity": 20, "image_url": "https://www.craftclothing.ph/cdn/shop/files/standard-plain-round-neck-shirt-white_49d15c1b-697e-45e2-b40b-29807d377b6e_600x.png?v=1740991398"},
    {"id": 17, "product_id": 1, "color": "Coral", "size": "XXL", "price_modifier": 3.5, "stock_status": "in_stock", "stock_quantity": 20, "image_url": "https://www.craftclothing.ph/cdn/shop/files/winner-plain-round-neck-shirt-coral_e19a466b-9a77-4aaf-ab92-eed406627d97_600x.png?v=1740991398"},
    {"id": 18, "product_id": 1, "color": "Aqua", "size": "XXL", "price_modifier": 3.5, "stock_status": "in_stock", "stock_quantity": 20, "image_url": "https://www.craftclothing.ph/cdn/shop/files/winner-plain-round-neck-shirt-djaqua_07a696bd-5663-4f8f-acd5-a0243d87ecc8_600x.png?v=1740991398"},
]

shipping_options_data = [
    {"id": 1, "name": "Standard Shipping", "base_cost": 5.00, "estimated_delivery_template": "5-7 business days"},
    {"id": 2, "name": "Express Shipping", "base_cost": 10.00, "estimated_delivery_template": "2-3 business days"},
    {"id": 3, "name": "Next Day Air", "base_cost": 25.00, "estimated_delivery_template": "1 business day"},
    {"id": 4, "name": "International Shipping", "base_cost": 20.00, "estimated_delivery_template": "7-14 business days"},
]
addresses_data = [
    {"id": 1, "user_id": 1, "street": "123 Main St", "city": "Anytown", "country": "USA", "is_default": True},
    {"id": 2, "user_id": 1, "street": "456 Oak Ave", "city": "Otherville", "country": "USA", "is_default": False},
    {"id": 3, "user_id": 2, "street": "789 Pine Ln", "city": "Springfield", "country": "USA", "is_default": True},
    {"id": 4, "user_id": 2, "street": "101 Elm St", "city": "Riverside", "country": "USA", "is_default": False},
    {"id": 5, "user_id": 3, "street": "222 Maple Dr", "city": "Lakewood", "country": "Canada", "is_default": True},
    {"id": 6, "user_id": 3, "street": "333 Cedar Rd", "city": "Hilltop", "country": "Canada", "is_default": False},
]

designs_data = [
    {
        "id": 1,
        "name": "Tux",
        "user_id": 1,  # Assuming user with id 1 exists
        "product_id": 1, # Corresponds to the T-Shirt product
        "final_product_image_url": "https://firebasestorage.googleapis.com/v0/b/snappress-11a72.firebasestorage.app/o/printed_shirts%2Fwhite-tux.png?alt=media&token=e829facf-d985-4774-a7a7-a5466597c5e2",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "id": 2,
        "name": "Michael",
        "user_id": 2,  # Assuming user with id 2 exists
        "product_id": 1, # Corresponds to the T-Shirt product
        "final_product_image_url": "https://firebasestorage.googleapis.com/v0/b/snappress-11a72.firebasestorage.app/o/printed_shirts%2Fwhite-michael.png?alt=media&token=8c58c620-6bfc-4b88-b1f6-78d69b2f80fa",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "id": 3,
        "name": "Alban",
        "user_id": 1, # Assuming user with id 1 exists
        "product_id": 1, # Corresponds to the T-Shirt product
        "final_product_image_url": "https://firebasestorage.googleapis.com/v0/b/snappress-11a72.firebasestorage.app/o/printed_shirts%2Fwhite-alban.png?alt=media&token=f00ccd27-1992-49c1-8426-242a52906b48",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "id": 4,
        "name": "Smoking Skeleton",
        "user_id": 2,  # Assuming user with id 2 exists
        "product_id": 1, # Corresponds to the T-Shirt product
        "final_product_image_url": "https://firebasestorage.googleapis.com/v0/b/snappress-11a72.firebasestorage.app/o/printed_shirts%2Fwhite-smokingSkeleton.png?alt=media&token=d372d635-2115-4d7d-b182-e6c824fdfd70",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    },
    {
        "id": 5,
        "name": "Sword Skeleton",
        "user_id": 1, # Assuming user with id 1 exists
        "product_id": 1, # Corresponds to the T-Shirt product
        "final_product_image_url": "https://firebasestorage.googleapis.com/v0/b/snappress-11a72.firebasestorage.app/o/printed_shirts%2Fwhite-swordSkeleton.png?alt=media&token=b4223436-c49e-49b5-a4eb-ee927e0dde5d",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    },
        {
        "id": 6,
        "name": "Violin Skeleton",
        "user_id": 2,  # Assuming user with id 2 exists
        "product_id": 1, # Corresponds to the T-Shirt product
        "final_product_image_url": "https://firebasestorage.googleapis.com/v0/b/snappress-11a72.firebasestorage.app/o/printed_shirts%2Fwhite-violinSkeleton.png?alt=media&token=56ed6bfe-40ed-45da-ad45-ac4757f8f35f",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
]

# CartItem model requires design_id.
cart_items_data = [
    {
        "id": 1,
        "user_id": 1,
        "variant_id": 2,
        "design_id": 3,
        "quantity": 2,
        "customization_details": "No logo"
    },
    {
        "id": 2,
        "user_id": 2,
        "variant_id": 1,
        "design_id": 2,
        "quantity": 1,
        "customization_details": "Add custom text: 'Birthday Fun'"
    },
    {
        "id": 3,
        "user_id": 1,
        "variant_id": 4,
        "design_id": 1,
        "quantity": 1,
        "customization_details": "Graphic on back"
    },
    {
        "id": 4,
        "user_id": 2,
        "variant_id": 5,
        "design_id": 4,
        "quantity": 3,
        "customization_details": "Long sleeve version"
    },
    {
        "id": 5,
        "user_id": 1,
        "variant_id": 8,
        "design_id": 5,
        "quantity": 2,
        "customization_details": "Limited edition print"
    },
    {
        "id": 6,
        "user_id": 2,
        "variant_id": 9,
        "design_id": 6,
        "quantity": 1,
        "customization_details": "Oversized fit"
    },
    {
        "id": 7,
        "user_id": 1,
        "variant_id": 13,
        "design_id": 1,
        "quantity": 1,
        "customization_details": "Small front print"
    },
    {
        "id": 8,
        "user_id": 2,
        "variant_id": 16,
        "design_id": 2,
        "quantity": 2,
        "customization_details": "Glitter print"
    },
    {
        "id": 9,
        "user_id": 1,
        "variant_id": 10,
        "design_id": 3,
        "quantity": 1,
        "customization_details": "Distressed look"
    },
    {
        "id": 10,
        "user_id": 2,
        "variant_id": 6,
        "design_id": 4,
        "quantity": 1,
        "customization_details": "Glow in the dark"
    },
    {
        "id": 11,
        "user_id": 1,
        "variant_id": 18,
        "design_id": 5,
        "quantity": 1,
        "customization_details": "Acid wash"
    },
    {
        "id": 12,
        "user_id": 2,
        "variant_id": 3,
        "design_id": 6,
        "quantity": 1,
        "customization_details": "Tie-dye"
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
        "billing_address_id": 1,
        "shipping_option_name": "Standard Shipping",
        "shipping_cost": 5.00,
        "status": "completed",
        "total_amount": 51.50,
        "subtotal": 46.50,
        "tax_amount": 0.00,
        "payment_method": "Credit Card",
        "tracking_number": "TRK123456789",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": 2,
        "user_id": 2,
        "shipping_address_id": 1,
        "billing_address_id": 1,
        "shipping_option_name": "Standard Shipping",
        "shipping_cost": 5.00,
        "status": "pending",
        "total_amount": 72.00,
        "subtotal": 67.00,
        "tax_amount": 0.00,
        "payment_method": "PayPal",
        "tracking_number": "TRK987654321",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": 3,
        "user_id": 1,
        "shipping_address_id": 1,
        "billing_address_id": 1,
        "shipping_option_name": "Standard Shipping",
        "shipping_cost": 5.00,
        "status": "processing",
        "total_amount": 49.00,
        "subtotal": 44.00,
        "tax_amount": 0.00,
        "payment_method": "Credit Card",
        "tracking_number": "TRK543216789",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": 4,
        "user_id": 2,
        "shipping_address_id": 1,
        "billing_address_id": 1,
        "shipping_option_name": "Express Shipping",
        "shipping_cost": 10.00,
        "status": "completed",
        "total_amount": 95.00,
        "subtotal": 85.00,
        "tax_amount": 0.00,
        "payment_method": "PayPal",
        "tracking_number": "TRK112233445",
        "created_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": 5,
        "user_id": 1,
        "shipping_address_id": 1,
        "billing_address_id": 1,
        "shipping_option_name": "Standard Shipping",
        "shipping_cost": 5.00,
        "status": "shipped",
        "total_amount": 50.00,
        "subtotal": 45.00,
        "tax_amount": 0.00,
        "payment_method": "Credit Card",
        "tracking_number": "TRK223344556",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": 6,
        "user_id": 2,
        "shipping_address_id": 1,
        "billing_address_id": 1,
        "shipping_option_name": "Express Shipping",
        "shipping_cost": 10.00,
        "status": "delivered",
        "total_amount": 75.00,
        "subtotal": 65.00,
        "tax_amount": 0.00,
        "payment_method": "PayPal",
        "tracking_number": "TRK334455667",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
]

order_items_data = [
    {
        "id": 1,
        "order_id": 1,
        "variant_id": 1,
        "design_id": 1,
        "product_name_snapshot": "T-Shirt",
        "variant_details_snapshot": '{"color": "White", "size": "S"}',
        "quantity": 1,
        "unit_price_snapshot": 22.00,
        "item_total": 22.00
    },
    {
        "id": 2,
        "order_id": 1,
        "variant_id": 2,
        "design_id": 3,
        "product_name_snapshot": "T-Shirt",
        "variant_details_snapshot": '{"color": "White", "size": "M"}',
        "quantity": 1,
        "unit_price_snapshot": 22.00,
        "item_total": 22.00
    },
    {
        "id": 3,
        "order_id": 2,
        "variant_id": 4,
        "design_id": 4,
        "product_name_snapshot": "T-Shirt",
        "variant_details_snapshot": '{"color": "White", "size": "XL"}',
        "quantity": 2,
        "unit_price_snapshot": 23.00,
        "item_total": 46.00
    },
    {
        "id": 4,
        "order_id": 2,
        "variant_id": 5,
        "design_id": 2,
        "product_name_snapshot": "T-Shirt",
        "variant_details_snapshot": '{"color": "Coral", "size": "S"}',
        "quantity": 1,
        "unit_price_snapshot": 22.00,
        "item_total": 22.00
    },
    {
        "id": 5,
        "order_id": 3,
        "variant_id": 7,
        "design_id": 5,
        "product_name_snapshot": "T-Shirt",
        "variant_details_snapshot": '{"color": "Coral", "size": "L"}',
        "quantity": 1,
        "unit_price_snapshot": 22.50,
        "item_total": 22.50
    },
    {
        "id": 6,
        "order_id": 3,
        "variant_id": 9,
        "design_id": 6,
        "product_name_snapshot": "T-Shirt",
        "variant_details_snapshot": '{"color": "Aqua", "size": "S"}',
        "quantity": 1,
        "unit_price_snapshot": 22.00,
        "item_total": 22.00
    },
    {
        "id": 7,
        "order_id": 4,
        "variant_id": 13,
        "design_id": 1,
        "product_name_snapshot": "T-Shirt",
        "variant_details_snapshot": '{"color": "White", "size": "XS"}',
        "quantity": 1,
        "unit_price_snapshot": 21.50,
        "item_total": 21.50
    },
    {
        "id": 8,
        "order_id": 4,
        "variant_id": 16,
        "design_id": 2,
        "product_name_snapshot": "T-Shirt",
        "variant_details_snapshot": '{"color": "White", "size": "XXL"}',
        "quantity": 2,
        "unit_price_snapshot": 23.50,
        "item_total": 47.00
    },
    {
        "id": 9,
        "order_id": 5,
        "variant_id": 10,
        "design_id": 3,
        "product_name_snapshot": "T-Shirt",
        "variant_details_snapshot": '{"color": "Aqua", "size": "M"}',
        "quantity": 1,
        "unit_price_snapshot": 22.00,
        "item_total": 22.00
    },
    {
        "id": 10,
        "order_id": 5,
        "variant_id": 6,
        "design_id": 4,
        "product_name_snapshot": "T-Shirt",
        "variant_details_snapshot": '{"color": "Coral", "size": "M"}',
        "quantity": 1,
        "unit_price_snapshot": 22.00,
        "item_total": 22.00
    },
    {
        "id": 11,
        "order_id": 6,
        "variant_id": 18,
        "design_id": 5,
        "product_name_snapshot": "T-Shirt",
        "variant_details_snapshot": '{"color": "Aqua", "size": "XXL"}',
        "quantity": 1,
        "unit_price_snapshot": 23.50,
        "item_total": 23.50
    },
    {
        "id": 12,
        "order_id": 6,
        "variant_id": 3,
        "design_id": 6,
        "product_name_snapshot": "T-Shirt",
        "variant_details_snapshot": '{"color": "White", "size": "L"}',
        "quantity": 1,
        "unit_price_snapshot": 22.50,
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