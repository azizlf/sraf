from flask import Blueprint, request, jsonify
from app.services.article_service import ArticleService

article_bp = Blueprint('article', __name__)

def convert_objectid(doc):
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


# create
@article_bp.route("/add", methods=["POST"])
def create():
    
    data = request.get_json()
        
    user = ArticleService.add_user(data)
    
    return jsonify({"response": user})
    

# get all
@article_bp.route("/all", methods=["GET"])
def getAllUsers():
    
    users = list(ArticleService.getAll())
    users = [convert_objectid(user) for user in users]
    return jsonify({"response": users})

# get by id
@article_bp.route("/<article_id>", methods=["GET"])
def getById(article_id):
    
    user = ArticleService.getUserById(article_id)
    
    if not user:
    
        return jsonify({"response": "introuvable"})
    
    else:
    
        user = convert_objectid(user)
    
        return jsonify({"response": user})

# update
@article_bp.route("/<article_id>", methods=["PUT"])
def update(article_id):
    
    data = request.get_json()
    
    update = ArticleService.updateUser(article_id, data)
    
    return jsonify({"response": update})

# delete
@article_bp.route("/<article_id>", methods=["DELETE"])
def delete(article_id):
    
    delete = ArticleService.deleteUser(article_id)
    
    return jsonify({"response":delete})