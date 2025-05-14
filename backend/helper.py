import os
from dotenv import load_dotenv
from datetime import datetime, timezone
from clerk_backend_api import Clerk
from app import db
from run import app
from app.models import User

load_dotenv()
clerk_secret_key = os.environ.get("CLERK_SECRET_KEY")
print(f"CLERK_SECRET_KEY: '{clerk_secret_key}'")

if not clerk_secret_key:
    print("CLERK_SECRET_KEY is not set or is empty.")
    exit()

sdk = Clerk(bearer_auth=clerk_secret_key)

def sync_all_clerk_users_to_db():
    with app.app_context():
        try:
            users = sdk.users.list()

            if not users:
                return
            
            total_users_processed = 0
            total_users_added = 0
            total_users_updated = 0

            for user in users:
                clerk_id = user.id
                firstname = user.first_name
                lastname = user.last_name
                email = user.email_addresses[0].email_address if user.email_addresses else None
                created_at =  datetime.fromtimestamp(user.created_at / 1000, tz=timezone.utc)
                username = user.first_name

                user = User.query.filter_by(clerk_user_id=clerk_id).first()

                if user:
                    updated = False
                    if user.username != username and username is not None: user.username = username; updated = True
                    if user.firstname != firstname and firstname is not None: user.firstname = firstname; updated = True
                    if user.lastname != lastname and lastname is not None: user.lastname = lastname; updated = True
                    if user.email != email and email is not None: user.email = email; updated = True
                    if updated:
                        total_users_updated += 1
                        print(f"Updating user: Clerk ID {clerk_id}")
                else:
                    user = User(
                        clerk_user_id=clerk_id,
                        username=username,
                        firstname=firstname,
                        lastname=lastname,
                        email=email,
                        created_at=created_at if created_at else datetime.now(timezone.utc)
                    )
                    db.session.add(user)
                    total_users_added += 1
                    print(f"Adding new user: Clerk ID {clerk_id}, Username: {username}")
                total_users_processed += 1

            try:
                db.session.commit()
                print(f"Total users updated: {total_users_updated}")
                print(f"Total users added: {total_users_added}")
                print(f"Total users processed: {total_users_processed}")
            except Exception as e:
                db.session.rollback()
                print(f"Error committing to the database: {e}")

        except Exception as e:
            print(f"An error occurred: {e}")

    
