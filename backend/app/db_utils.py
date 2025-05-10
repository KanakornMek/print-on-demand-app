import mysql.connector
from mysql.connector import Error
import os
from flask import g

def get_db_config():
    return {
        'host': os.environ.get('MYSQL_HOST', 'localhost'),
        'user': os.environ.get('MYSQL_USER', 'root'),
        'password': os.environ.get('MYSQL_PASSWORD', ''),
        'database': os.environ.get('MYSQL_DB', 'pod_app_dev')
    }

def get_db():
    if 'db' not in g:
        try:
            g.db = mysql.connector.connect(**get_db_config())
        except Error as e:
            print(f"Error connecting to MySQL: {e}")
            raise
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_app(app):
    app.teardown_appcontext(close_db) 

def query_db(query, args=(), one=False, commit=False):
    db_conn = get_db()
    cursor = db_conn.cursor(dictionary=True)
    try:
        cursor.execute(query, args)
        if commit:
            db_conn.commit()
            return cursor.lastrowid
        rv = cursor.fetchall()
        return (rv[0] if rv else None) if one else rv
    except Error as e:
        print(f"query error: {e}")
        if commit:
            db_conn.rollback()
        raise
    finally:
        cursor.close()