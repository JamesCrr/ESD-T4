import datetime
from uuid import uuid4
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

listingIds = ['b9c6c471-227c-4b6e-8ee9-0c5536614c92', '230054c7-60e1-42ac-9112-3541755dc097', 'dad33752-e4b2-4434-b1ac-ff449b50c73f']
userIds = ['aa37640287224f9f11376cf215f45c83', '1431174c9d55ad47b01adaec4d152370', 'c6aaa1c3785fc13712379fab08b46dc1']

client = MongoClient(os.getenv('DB_URL'))
db = client['mongo']
collection = db['Bidding']


documents = [
    {
        'bidId': '0fe5b3e0-cf76-4447-b044-55cd04c05468',
        'bidAmt': 20,
        'bidTime': datetime.datetime.utcnow(),
        'listingId': 'b9c6c471-227c-4b6e-8ee9-0c5536614c92',
        'userId': 'aa37640287224f9f11376cf215f45c83',
        'bidStatus': 'Pending'
    },
    {
        'bidId': 'abbde310-a06c-4dca-9938-81a4f5f13c7d',
        'bidAmt': 30,
        'bidTime': datetime.datetime.utcnow(),
        'listingId': 'b9c6c471-227c-4b6e-8ee9-0c5536614c92',
        'userId': '1431174c9d55ad47b01adaec4d152370',
        'bidStatus': 'Pending'
    },
    {
        'bidId': '04b9f143-09d9-452f-855f-4a3fc5381203',
        'bidAmt': 50,
        'bidTime': datetime.datetime.utcnow(),
        'listingId': 'b9c6c471-227c-4b6e-8ee9-0c5536614c92',
        'userId': 'c6aaa1c3785fc13712379fab08b46dc1',
        'bidStatus': 'Pending'
    },
    {
        'bidId': '6e096d0e-3f45-4479-a3be-017c2ae105aa',
        'bidAmt': 60,
        'bidTime': datetime.datetime.utcnow(),
        'listingId': '230054c7-60e1-42ac-9112-3541755dc097',
        'userId': 'aa37640287224f9f11376cf215f45c83',
        'bidStatus': 'Pending'
    },
    {
        'bidId': '2b27b121-085d-46cb-8e41-f885588d4ec9',
        'bidAmt': 40,
        'bidTime': datetime.datetime.utcnow(),
        'listingId': '230054c7-60e1-42ac-9112-3541755dc097',
        'userId': '1431174c9d55ad47b01adaec4d152370',
        'bidStatus': 'Pending'
    },
    {
        'bidId': '9f98f174-1e1c-413b-94bb-664cc08805a7',
        'bidAmt': 30,
        'bidTime': datetime.datetime.utcnow(),
        'listingId': '230054c7-60e1-42ac-9112-3541755dc097',
        'userId': 'c6aaa1c3785fc13712379fab08b46dc1',
        'bidStatus': 'Pending'
    },
    {
        'bidId': '214a68c1-9bf0-4bda-a193-c2b4903c4e8b',
        'bidAmt': 30,
        'bidTime': datetime.datetime.utcnow(),
        'listingId': 'dad33752-e4b2-4434-b1ac-ff449b50c73f',
        'userId': 'aa37640287224f9f11376cf215f45c83',
        'bidStatus': 'Pending'
    },
    {
        'bidId': 'd217b2f0-4b7a-4ebe-9ec4-cbb00d853af0',
        'bidAmt': 80,
        'bidTime': datetime.datetime.utcnow(),
        'listingId': 'dad33752-e4b2-4434-b1ac-ff449b50c73f',
        'userId': '1431174c9d55ad47b01adaec4d152370',
        'bidStatus': 'Pending'
    },
    {
        'bidId': '2a0c8a25-4dc6-4a22-99ed-79725d2b94d1',
        'bidAmt': 70,
        'bidTime': datetime.datetime.utcnow(),
        'listingId': 'dad33752-e4b2-4434-b1ac-ff449b50c73f',
        'userId': 'c6aaa1c3785fc13712379fab08b46dc1',
        'bidStatus': 'Pending'
    }
]

collection.insert_many(documents)


