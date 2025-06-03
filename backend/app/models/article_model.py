from app.config import Config
from bson.objectid import ObjectId

class Article:
    
    def findAll():
        
        collection = Config().connectionDB()['article']

        pipeline = [
            # {
            #     "$lookup": {
            #         "from": "client",
            #         "localField": "client_id",     
            #         "foreignField": "_id",         
            #         "as": "client_id"
            #     }
            # }
        ]

        return collection.aggregate(pipeline)
    
    
    def create(data):
                
        try:
            collection = Config().connectionDB()['article']
            
            collection.insert_one(data)
            
            return True
        
        except:
        
            return "error"
        
    def findById(id):
        
        try:
            collection = Config().connectionDB()['article']
            
            user = collection.find_one({"_id": ObjectId(id)})
            
            return user
        
        except:
        
            return False
        
        
    def update(id,data):
        
        try:
            
            collection = Config().connectionDB()['article']
            
            collection.update_one({"_id": ObjectId(id)}, {"$set": data})
            
            return True
        
        except:
            return False
        
        
    def delete(id):
        
        try:
            
            collection = Config().connectionDB()['article']
            
            collection.delete_one({"_id": ObjectId(id)})
            
            return True
            
        except:
            return False