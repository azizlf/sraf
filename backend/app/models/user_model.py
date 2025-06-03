from app.config import Config
from bson.objectid import ObjectId

class User:
    
    def findAll():
        
        collection = Config().connectionDB()['user']
        
        return collection.find()
    
    
    def create(data):
                
        try:
            collection = Config().connectionDB()['user']
            
            collection.insert_one(data)
            
            return True
        
        except:
        
            return "error"
        
    def findById(id):
        
        try:
            collection = Config().connectionDB()['user']
            
            user = collection.find_one({"_id": ObjectId(id)})
            
            return user
        
        except:
        
            return False
        
        
    def update(id,data):
        
        try:
            
            collection = Config().connectionDB()['user']
            
            collection.update_one({"_id": ObjectId(id)}, {"$set": data})
            
            return True
        
        except:
            return False
        
        
    def delete(id):
        
        try:
            
            collection = Config().connectionDB()['user']
            
            collection.delete_one({"_id": ObjectId(id)})
            
            return True
            
        except:
            return False
        
        
    def login(data):
        
        adresse_email = data['email']
        
        mdp = data['password']
        
        collection = Config().connectionDB()['user']
                    
        user = collection.find_one({'email': adresse_email})
        
        if not user:
            return {"status":False,"user":'user not found'}

        else:
            if mdp == user['password']:
                return {"status":True,"user":user}
            else:
                return {"status":False,"user":'Password is incorrect'}