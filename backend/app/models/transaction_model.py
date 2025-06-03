from app.config import Config
from bson.objectid import ObjectId

class Transaction:
    
    def findAll():
        
        collection = Config().connectionDB()['transaction']

        return collection.find()
    
    
    def create(data):
                
        try:
            collection = Config().connectionDB()['transaction']
            
            collection.insert_one(data)
            
            return True
        
        except:
        
            return "error"
        
    def findById(id):
        
        try:
            collection = Config().connectionDB()['transaction']
            
            user = collection.find_one({"_id": ObjectId(id)})
            
            return user
        
        except:
        
            return False
        
        
    def update(id,data):
        
        try:
            
            collection = Config().connectionDB()['transaction']
            
            collection.update_one({"_id": ObjectId(id)}, {"$set": data})
            
            return True
        
        except:
            return False
        
        
    def delete(id):
        
        try:
            
            collection = Config().connectionDB()['transaction']
            
            collection.delete_one({"_id": ObjectId(id)})
            
            return True
            
        except:
            return False