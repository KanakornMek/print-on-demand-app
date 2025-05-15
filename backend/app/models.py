from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from . import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    clerk_user_id = db.Column(db.String(255), nullable=False, unique=True)
    username = db.Column(db.String(255), nullable=False)
    firstname = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False)

    addresses = db.relationship("Address", back_populates="user")
    orders = db.relationship("Order", back_populates="user")
    cart_items = db.relationship("CartItem", back_populates="user")
    designs = db.relationship("Design", back_populates="user")

    def __repr__(self):
        return f"<User id={self.id} username='{self.username}' email='{self.email}'>"
    def to_dict(self):
        return {
            "id": self.id,
            "clerk_user_id": self.clerk_user_id,
            "username": self.username,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "email": self.email,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
    
class ProductCategory(db.Model):
    __tablename__ = 'product_categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), nullable=False, unique=True)

    products = db.relationship("Product", back_populates="category")

    def __repr__(self):
        return f"<ProductCategory id={self.id} name='{self.name}' slug='{self.slug}'>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
        }

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    base_price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255))
    category_id = db.Column(db.Integer, db.ForeignKey('product_categories.id'))

    category = db.relationship("ProductCategory", back_populates="products")
    variants = db.relationship("ProductVariant", back_populates="product")
    designs = db.relationship("Design", back_populates="product")

    def __repr__(self):
        return f"<Product id={self.id} name='{self.name}' base_price={self.base_price}>"
    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "description": self.description,
            "base_price": self.base_price, "image_url": self.image_url,
            "category_id": self.category_id
        }

class ProductVariant(db.Model):
    __tablename__ = 'product_variants'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    color = db.Column(db.String(255))
    size = db.Column(db.String(255))
    price_modifier = db.Column(db.Float, default=0.0)
    stock_status = db.Column(db.String(50)) #"in_stock", "out_of_stock"
    stock_quantity = db.Column(db.Integer)
    image_url = db.Column(db.String(255))

    product = db.relationship("Product", back_populates="variants")
    cart_items = db.relationship("CartItem", back_populates="variant")
    order_items = db.relationship("OrderItem", back_populates="variant")
    # designs = db.relationship("Design", back_populates="variant")

    def __repr__(self):
        return f"<ProductVariant id={self.id} product_id={self.product_id} color='{self.color}' size='{self.size}'>"

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "color": self.color,
            "size": self.size,
            "price_modifier": self.price_modifier,
            "stock_status": self.stock_status,
            "stock_quantity": self.stock_quantity,
            "image_url": self.image_url,
        }

class CartItem(db.Model):
    __tablename__ = 'cart_items'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    variant_id = db.Column(db.Integer, db.ForeignKey('product_variants.id'), nullable=False)
    design_id = db.Column(db.Integer, db.ForeignKey('designs.id'), nullable=False)
    
    quantity = db.Column(db.Integer, nullable=False)
    customization_details = db.Column(db.Text) 

    user = db.relationship("User", back_populates="cart_items")
    design = db.relationship("Design", back_populates="cart_items")
    variant = db.relationship("ProductVariant", back_populates="cart_items") 

    def __repr__(self):
        return f"<CartItem id={self.id} user_id={self.user_id} design_id={self.design_id} quantity={self.quantity}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "design_id": self.design_id,
            "variant_id": self.variant_id,
            "quantity": self.quantity,
            "customization_details": self.customization_details,
        }

class Address(db.Model):
    __tablename__ = 'addresses'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    street = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(255), nullable=False)
    state = db.Column(db.String(255))
    zip_code = db.Column(db.String(20))
    country = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20))
    is_default = db.Column(db.Boolean, default=False)

    user = db.relationship("User", back_populates="addresses")
    shipping_orders = db.relationship("Order", foreign_keys='[Order.shipping_address_id]', back_populates="shipping_address")
    billing_orders = db.relationship("Order", foreign_keys='[Order.billing_address_id]', back_populates="billing_address")

    def __repr__(self):
        return f"<Address id={self.id} user_id={self.user_id} city='{self.city}' country='{self.country}'>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "street": self.street,
            "city": self.city,
            "state": self.state,
            "zip_code": self.zip_code,
            "country": self.country,
            "phone_number": self.phone_number,
            "is_default": self.is_default,
        }

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    shipping_address_id = db.Column(db.Integer, db.ForeignKey('addresses.id'))
    billing_address_id = db.Column(db.Integer, db.ForeignKey('addresses.id'))
    shipping_option_name = db.Column(db.String(255))
    shipping_cost = db.Column(db.Float)
    status = db.Column(db.String(50), default='pending_payment')
    total_amount = db.Column(db.Float, nullable=False)
    subtotal = db.Column(db.Float)
    tax_amount = db.Column(db.Float)
    payment_method = db.Column(db.String(255))
    tracking_number = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    user = db.relationship("User", back_populates="orders")
    shipping_address = db.relationship("Address", foreign_keys=[shipping_address_id], back_populates="shipping_orders")
    billing_address = db.relationship("Address", foreign_keys=[billing_address_id], back_populates="billing_orders")
    items = db.relationship("OrderItem", back_populates="order")

    def __repr__(self):
        return f"<Order id={self.id} user_id={self.user_id} status='{self.status}' total_amount={self.total_amount}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "shipping_address_id": self.shipping_address_id,
            "billing_address_id": self.billing_address_id,
            "shipping_option_name": self.shipping_option_name,
            "shipping_cost": self.shipping_cost,
            "status": self.status,
            "total_amount": self.total_amount,
            "subtotal": self.subtotal,
            "tax_amount": self.tax_amount,
            "payment_method": self.payment_method,
            "tracking_number": self.tracking_number,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    variant_id = db.Column(db.Integer, db.ForeignKey('product_variants.id'))
    design_id = db.Column(db.Integer, db.ForeignKey('designs.id'))
    product_name_snapshot = db.Column(db.String(255), nullable=False) 
    variant_details_snapshot = db.Column(db.Text) 
    quantity = db.Column(db.Integer, nullable=False)
    unit_price_snapshot = db.Column(db.Float, nullable=False)
    item_total = db.Column(db.Float, nullable=False)

    order = db.relationship("Order", back_populates="items")
    variant = db.relationship("ProductVariant", back_populates="order_items")
    design = db.relationship("Design", back_populates="order_items")

    def __repr__(self):
        return f"<OrderItem id={self.id} order_id={self.order_id} quantity={self.quantity} unit_price_snapshot={self.unit_price_snapshot} item_total={self.item_total}>"

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "variant_id": self.variant_id,
            "design_id": self.design_id,
            "product_name_snapshot": self.product_name_snapshot,
            "variant_details_snapshot": self.variant_details_snapshot,
            "quantity": self.quantity,
            "unit_price_snapshot": self.unit_price_snapshot,
            "item_total": self.item_total,
        }

class ShippingOption(db.Model):
    __tablename__ = 'shipping_options'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    base_cost = db.Column(db.Float, nullable=False)
    estimated_delivery_template = db.Column(db.String(255))

    def __repr__(self):
        return f"<ShippingOption id={self.id} name='{self.name}' base_cost={self.base_cost}>"

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "base_cost": self.base_cost,
            "estimated_delivery_template": self.estimated_delivery_template,
        }

class Design(db.Model):
    __tablename__ = 'designs'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    final_product_image_url = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc) if isinstance(db.DateTime, type) else db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc) if isinstance(db.DateTime, type) else db.DateTime, onupdate=lambda: datetime.now(timezone.utc) if isinstance(db.DateTime, type) else db.DateTime, nullable=False)

    user = db.relationship("User", back_populates="designs")
    product = db.relationship("Product", back_populates="designs")
    
    cart_items = db.relationship("CartItem", back_populates="design")
    order_items = db.relationship("OrderItem", back_populates="design")

    def __repr__(self):
        return f"<Design id={self.id} name='{self.name}' product_id={self.product_id} user_id={self.user_id}>"
    def to_dict(self):
        return {
            "id": self.id, "name": self.name, "user_id": self.user_id,
            "product_id": self.product_id,
            "final_product_image_url": self.final_product_image_url,
            "created_at": self.created_at.isoformat() if self.created_at and hasattr(self.created_at, 'isoformat') else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at and hasattr(self.updated_at, 'isoformat') else None,
        }

class Item(db.Model):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(1024), nullable=False)

    def __repr__(self):
        return f"<Item id={self.id} name='{self.name}'>"
    

