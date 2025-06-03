from flask import Flask
from flask_cors import CORS
from app.routes.user_route import user_bp
from app.routes.article_route import article_bp
from app.routes.transaction_route import transaction_bp

def create_app():
    
    app = Flask(__name__)
    
    CORS(app,supports_credentials=True)

    app.register_blueprint(user_bp, url_prefix="/user")
    app.register_blueprint(article_bp, url_prefix="/article")
    app.register_blueprint(transaction_bp, url_prefix="/transaction")

    return app 