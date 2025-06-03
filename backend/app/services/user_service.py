from app.models.user_model import User

class UserService:
    
    def getAll():
        return User.findAll()
    
    def add_user(data):
        
        user = {
            "full_name": data.get("full_name"),
            "email": data.get("email"),
            "password": data.get("password"),
            "role": data.get("role")
        }
        
        return User.create(user)
    
    def getUserById(id):
        return User.findById(id)
    
    def updateUser(id,data):

        return User.update(id,data)
    
    def deleteUser(id):
        
        return User.delete(id)
    
    def loginUser(data):
        
        return User.login(data)