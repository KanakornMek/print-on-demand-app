from functools import wraps
from flask import request, jsonify, current_app
from clerk_backend_api import Clerk
from clerk_backend_api.jwks_helpers import authenticate_request, AuthenticateRequestOptions
import os

sdk = Clerk(bearer_auth=os.environ.get("CLERK_SECRET_KEY"))

def clerk_auth_required(f):

    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Unauthorized", "message": "Missing or invalid Authorization header"}), 401


        try:
            request_state = sdk.authenticate_request(
                request,
                AuthenticateRequestOptions()
            )
            payload = request_state.payload
            current_app.logger.info(f"Payload: {request_state}")
            clerk_user_id = payload.get("sub")


        except Exception as e:
            current_app.logger.error(f"Authentication error in middleware: {e}")
            return jsonify({"error": "Unauthorized", "message": str(e)}), 401

        return f(clerk_user_id, *args, **kwargs)
    return decorated_function
