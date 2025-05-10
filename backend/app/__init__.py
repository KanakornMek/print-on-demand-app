from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
from . import db_utils

load_dotenv()

def create_app():
    app = Flask(__name__)

    db_utils.init_app(app)

    CORS(app)

    from .routes import main_bp
    app.register_blueprint(main_bp)

    return app