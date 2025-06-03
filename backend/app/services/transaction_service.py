from app.models.transaction_model import Transaction

class TransactionService:
        
    def getAll():
        return Transaction.findAll()
    
    def getById(id):
        return Transaction.findById(id)
    
    def update(id,data):

        return Transaction.update(id,data)
    
    def add_user(data):
        
        dt = {
            "article": data.get("article"),
            "provider": data.get("provider"),
            "consumer": data.get("consumer"),
            "transaction_date": data.get("transaction_date"),
            "country": data.get("country")
        }
        
        return Transaction.create(dt)