from app.models.article_model import Article

class ArticleService:
        
    def getAll():
        return Article.findAll()
    
    def getById(id):
        return Article.findById(id)
    
    def update(id,data):

        return Article.update(id,data)
    
    def add_user(data):
        
        dt = {
            "language": data.get("language"),
            "location": data.get("location"),
            "category": data.get("category"),
            "country": data.get("country"),
            "pubDate": data.get("pubDate"),
            "provider": data.get("provider"),
            "title": data.get("title")
        }
        
        return Article.create(dt)