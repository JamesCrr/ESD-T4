from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv('DB_URL'))
db = client['mongo']
collection = db['Bidding']

collection.drop()