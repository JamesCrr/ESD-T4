# Dependencies 
from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from flask_pymongo import PyMongo
from flasgger import Swagger
from dotenv import load_dotenv
from os import getenv
import logging
import uuid
import datetime

# Set up basic configuration for logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
logging.getLogger().setLevel(logging.INFO)

load_dotenv()

# App configs
app = Flask(__name__)
# uncomment this when dockerizing 
app.config["MONGO_URI"] = getenv('DB_CLOUD_URL')
# app.config["MONGO_URI"] = getenv('DB_URL')
app.config['SWAGGER'] = {
    'title': 'Bid microservice API',
    'version': 1.0,
    'description': 'Bidding endpoints'
}
mongo= PyMongo(app)  
swagger = Swagger(app)
CORS(app)  

# Constants
collection = mongo.db[getenv('DB_TABLE')]


# Create a new bid
@app.route('/create', methods=['POST'])
def create():
    """
    Create a new bid.
    ---
    tags:
      - Create bid
    consumes:
      - "application/json"
    parameters:
      - in: body
        name: body
        description: Creation of bid
        required: true
        schema:
          type: object
          properties:
            bidAmt:
              type: integer
              description: Bid amount
              example: 40
            listingId:
              type: string
              description: Listing ID
              example: b9c6c471-227c-4b6e-8ee9-0c5536614c92
            userId:
              type: string
              description: User ID
              example: 8002d4b80d4d94c858974786da16b3fe
    responses:
      201:
        description: Bid created successfully
      400:
        description: Bad Request, missing required fields
      500:
        description: Handling of unexpected errors 
    """
    try:
        print(request.get_data())
        content = request.get_json(silent=True)
        bid_amt = int(content.get('bidAmt'))
        listing_id = content.get('listingId')
        user_id = content.get('userId')

        if bid_amt is None or listing_id is None or user_id is None:
            # If any of the required keys are missing
            raise ValueError("Missing required fields in JSON")

        document = {
            'bidId': str(uuid.uuid4()),
            'bidAmt': bid_amt,
            'bidTime': datetime.datetime.utcnow(),
            'listingId': listing_id,
            'userId': user_id,
            'bidStatus': 'Pending'
        }

        # Insert the document into the collection
        collection.insert_one(document)
        logging.info(f'User {user_id} has created a new bid')
        return 'successful', 201

    except ValueError as e:
        # Handle missing keys or invalid data in the JSON
        error_message = f"Error: {str(e)}"
        return jsonify({'error': error_message}), 400

    except Exception as e:
        # Handle other unexpected exceptions
        logging.info(e)
        return jsonify({'error': 'Internal server'}), 500
    
# Retrieve all bids in db 
@app.route('/retrieve/all')
def retrieve_all_bids():
    """
    Retrieving all bids and (optionally) by listing ID
    ---
    tags:
        - Retrieve bids
    parameters:
     - in: query
       name: listingId
       type: string
       required: false
       description: Bids belonging to a specified listing
       example: b9c6c471-227c-4b6e-8ee9-0c5536614c92
    responses:
        200:
            description: Successfully returns all bids created 
        404:
            description: No bids found in db
        500:
            description: Handling of unexpected errors 
    """
    try:
        # Retrieve optional query parameters from the URL
        listing_id = request.args.get('listingId')

        # Construct the query based on user_id and optional listing_id
        query = {}
        if listing_id:
            query['listingId'] = listing_id
        res = collection.find(query)

        if res is None:
            # If no matching bid is found, return a 404 Not Found response
            return jsonify({'error': 'No bids found'}), 404

        # Convert ObjectId to a string for JSON serialization
        results = []
        for entry in list(res):
            entry['_id'] = str(entry['_id'])
            results.append(entry)
        
        # Return the bid data as JSON
        return jsonify(results), 200
    except Exception as e:
        logging.info(e)
        return jsonify({'error': 'Internal server error'}), 500


# Retrieve a single bid from bid id
@app.route('/retrieve/<string:bidId>')
def retrieve_bid(bidId):
    """
    Retrieving a single bid
    ---
    tags:
        - Retrieve bids
    parameters:
     - in: path
       name: bidId
       type: string
       required: true
       description: Get bid by id
       example: 0fe5b3e0-cf76-4447-b044-55cd04c05468
    responses:
        200:
            description: Successfully returns a single bid 
        404:
            description: No bid found in db
        500:
            description: Handling of unexpected errors 
    """
    try:
        res = collection.find_one({'bidId': bidId})

        logging.info(bidId)

        if res is None:
            # If no matching bid is found, return a 404 Not Found response
            return jsonify({'error': 'Bid id not found'}), 404

        # Convert ObjectId to a string for JSON serialization
        res['_id'] = str(res['_id'])
        
        # Return the bid data as JSON
        return jsonify(res), 200
    except Exception as e:
        logging.info(e)
        return jsonify({'error': 'Internal server error'}), 500

# Retrieve all biddings from user id
@app.route('/retrieve/all/<string:userId>')
def retrieve_all_user_bids(userId):
    """
    Retrieving all bids from user ID and (optionally) by listing ID
    ---
    tags:
        - Retrieve bids
    parameters:
     - in: path
       name: userId
       type: string
       required: true
       description: Bids belonging to a user 
       example: aa37640287224f9f11376cf215f45c83
     - in: query
       name: listingId
       type: string
       required: false
       description: Bids belonging to a user of a specified listing
       example: b9c6c471-227c-4b6e-8ee9-0c5536614c92
    responses:
        200:
            description: Sucessfully returns all bids by User ID and (optionally) by listing ID
        404:
            description: No bids found in db
        500:
            description: Handling of unexpected errors 
    """
    try:
        # Retrieve optional query parameters from the URL
        listing_id = request.args.get('listingId')

        # Construct the query based on user_id and optional listing_id
        query = {'userId': userId}
        if listing_id:
            query['listingId'] = listing_id

        # Retrieve bids based on the constructed query
        res = collection.find(query)

        count = collection.count_documents(query)

        # Check if any bids were found
        if count == 0:
            # If no bids are found, return a 404 Not Found response
            return jsonify({'error': 'No bids found'}), 404

        # Convert ObjectId to a string for JSON serialization
        results = []
        for entry in list(res):
            entry['_id'] = str(entry['_id'])
            results.append(entry)

        return jsonify(results)

    except Exception as e:
        # Handle other unexpected exceptions (e.g., issues with the MongoDB connection)
        logging.info(e)
        return jsonify({'error': 'Internal server error'}), 500
    
# Update bidding ammount, listing ID
@app.route('/update/<string:bidId>', methods=['PATCH'])
def update(bidId):
    """
    Updating of bids
    ---
    tags:
      - Update bids
    consumes:
      - "application/json"
    parameters:
      - in: path
        name: bidId
        type: string
        required: true
        description: ID of the bid to update
        example: "214a68c1-9bf0-4bda-a193-c2b4903c4e8b"
      - in: body
        name: body
        description: Creation of bid
        required: false
        schema:
          type: object
          properties:
            bidAmt:
              type: integer
              description: Bid amount
              example: 80
            listingId:
              type: string
              description: Listing ID
              example: b9c6c471-227c-4b6e-8ee9-0c5536614c92
    responses:
        200:
            description: No changes were made to existing bid
        201:
            description: Update of bid successful 
        400:
            description: Invalid JSON payload
        404:
            description: No bid found in db
        500:
            description: Handling of unexpected errors 
    """
    try:
        content = request.get_json(silent=True)

        if not content:
            return jsonify({'error': 'Invalid JSON payload'}), 400

        res = collection.update_one(
            {'bidId': bidId},
            {'$set': content}
        )

        if res.matched_count == 1:
            if res.modified_count > 0:
                return jsonify({'message': 'Update successful'}), 201
            else:
                return jsonify({'message': 'No changes applied'}), 200
        else:
            return jsonify({'message': 'Bid id not found'}), 404

    except Exception as e:
        logging.info(e)
        return jsonify({'error': 'Internal server error'}), 500
    
# Update bid statuses made by all users when auction closes
@app.route('/update/bids/<string:listingId>', methods=['PATCH'])
def update_all_bids(listingId):
    """
    Update bid statuses to failure/success once listing has been closed 
    ---
    tags:
        - Update bids
    parameters:
     - in: path
       name: listingId
       type: string
       required: true
       description: Bids belonging to a user 
       example: b9c6c471-227c-4b6e-8ee9-0c5536614c92
    responses:
        200:
            description: Sucessfully returns all bids by User ID and (optionally) by listing ID
        404:
            description: No bids found in db
        500:
            description: Handling of unexpected errors 
    """
    try:
        # Check if any bids were found
        count = collection.count_documents({'listingId': listingId})

        if count == 0:
            # If no bids are found, return a 404 Not Found response
            return jsonify({'error': 'No bids found'}), 404

        # Update all bids except the highest to 'Failure' and the highest bid to 'Success'
        res = list(collection.find({'listingId': listingId}))
        if res:
            res.sort(key=lambda entry: entry['bidAmt'], reverse=True)

            # Convert ObjectId to a string for JSON serialization
            results = []
            for entry in list(res):
                entry['_id'] = str(entry['_id'])
                results.append(entry)

            # Update the rest of the bids to 'Failure'
            res = collection.update_many({'bidId': {'$in': [entry['bidId'] for entry in results[1:]]}}, {'$set': {'bidStatus': 'Failure'}})

            # Update the highest bid to 'Success'
            res = collection.update_one({'bidId': results[0]['bidId']}, {'$set': {'bidStatus': 'Success'}})

            result = collection.find({'bidId':  {'$in': [entry['bidId'] for entry in results] }})

            response = []
            for entry in list(result):
                entry['_id'] = str(entry['_id'])
                response.append(entry)

            response.sort(key=lambda entry: entry['bidAmt'])

            if res.modified_count > 0:
                return jsonify(response), 201
            else:
                return jsonify({'message': 'No changes applied'}), 200
    except Exception as e:
        # Handle other unexpected exceptions (e.g., issues with the MongoDB connection)
        logging.info(e)
        return jsonify({'error': 'Internal server error'}), 500
    
# Reset all bid statuses to 'Pending'
@app.route('/reset/status', methods=['PATCH'])
def reset_bid_statuses():
    """
    Reset all bid statuses to 'Pending'.
    ---
    tags:
      - Reset bids
    responses:
        200:
            description: All bid statuses reset to 'Pending' successfully
        500:
            description: Handling of unexpected errors 
    """
    try:
        # Update all bids' statuses to 'Pending'
        res = collection.update_many({}, {'$set': {'bidStatus': 'Pending'}})
        
        if res.modified_count > 0:
            return jsonify({'message': 'All bid statuses reset to \'Pending\' successfully'}), 200
        else:
            return jsonify({'message': 'No changes applied'}), 200
    except Exception as e:
        logging.info(e)
        return jsonify({'error': 'Internal server error'}), 500


# Delete bid entry 
@app.route('/delete/<string:bidId>', methods=['DELETE'])
def delete(bidId):
    """
    Deletion of bid
    ---
    tags:
     - Delete bid
    parameters:
     - in: path
       name: bidId
       type: string
       required: true
       description: Delete bid by id
       example: 0fe5b3e0-cf76-4447-b044-55cd04c05468
    responses:
        204:
            description: Sucessfully deleted bid 
        404:
            description: No bid found in db
        500:
            description: Handling of unexpected errors 

    """
    try:
        res = collection.delete_one({'bidId': bidId})

        if res.deleted_count == 1:
            return jsonify({'message': 'Deletion successful'}), 204
        else:
            return jsonify({'message': 'Bid Id not found'}), 404
    except Exception as e:
        logging.info(e)
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.config.from_mapping({
        "DEBUG": (getenv('SERVER_MODE') or "development") == "development"
    })
    app.run(host='0.0.0.0', port=int(getenv('SERVER_PORT') or 3012))