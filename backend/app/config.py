from pymongo import MongoClient

class Config:
    
    def __init__(self):
    
        self.MONGO_URI = "mongodb://localhost:27017"
    
    def connectionDB(self):
    
        client = MongoClient(self.MONGO_URI)

        db = client['saraProject']
        
        return db