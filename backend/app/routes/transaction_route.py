from flask import Blueprint, request, jsonify
from app.services.transaction_service import TransactionService

transaction_bp = Blueprint('transaction', __name__)

def convert_objectid(doc):
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


# create
@transaction_bp.route("/add", methods=["POST"])
def create():
    
    data = request.get_json()
        
    user = TransactionService.add_user(data)
    
    return jsonify({"response": user})
    

# get all
@transaction_bp.route("/all", methods=["GET"])
def getAllUsers():
    
    users = list(TransactionService.getAll())
    users = [convert_objectid(user) for user in users]
    return jsonify({"response": users})

# get by id
@transaction_bp.route("/<transaction_id>", methods=["GET"])
def getById(transaction_id):
    
    user = TransactionService.getUserById(transaction_id)
    
    if not user:
    
        return jsonify({"response": "introuvable"})
    
    else:
    
        user = convert_objectid(user)
    
        return jsonify({"response": user})

# update
@transaction_bp.route("/<transaction_id>", methods=["PUT"])
def update(transaction_id):
    
    data = request.get_json()
    
    update = TransactionService.updateUser(transaction_id, data)
    
    return jsonify({"response": update})

# delete
@transaction_bp.route("/<transaction_id>", methods=["DELETE"])
def delete(transaction_id):
    
    delete = TransactionService.deleteUser(transaction_id)
    
    return jsonify({"response":delete})