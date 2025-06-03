from flask import Blueprint, request, jsonify
from app.services.user_service import UserService

user_bp = Blueprint('user', __name__)

def convert_objectid(doc):
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


# create
@user_bp.route("/add", methods=["POST"])
def create():
    
    data = request.get_json()
        
    user = UserService.add_user(data)
    
    return jsonify({"response": user})
    

# get all
@user_bp.route("/all", methods=["GET"])
def getAllUsers():
    
    users = list(UserService.getAll())
    users = [convert_objectid(user) for user in users]
    return jsonify({"response": users})

# get by id
@user_bp.route("/<user_id>", methods=["GET"])
def getById(user_id):
    
    user = UserService.getUserById(user_id)
    
    if not user:
    
        return jsonify({"response": "introuvable"})
    
    else:
    
        user = convert_objectid(user)
    
        return jsonify({"response": user})

# update
@user_bp.route("/<user_id>", methods=["PUT"])
def update(user_id):
    
    data = request.get_json()
    
    update = UserService.updateUser(user_id, data)
    
    return jsonify({"response": update})

# delete
@user_bp.route("/<user_id>", methods=["DELETE"])
def delete(user_id):
    
    delete = UserService.deleteUser(user_id)
    
    return jsonify({"response":delete})


# login
@user_bp.route('/login', methods=['POST'])
def login():
    
    data = request.get_json()
    
    res = UserService.loginUser(data)
    
    print(res)
    
    if res["user"]:
        res["user"] = convert_objectid(res["user"])

    return jsonify({"response":res})