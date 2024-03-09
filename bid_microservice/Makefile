.PHONY: API endpoint + db
COMPOSE_FILE := service/docker-compose.yml

# Dockerize the entire microservice
build:
	docker-compose -f $(COMPOSE_FILE) up 

.PHONY: Mongo db 
COMPOSE_FILE_DB := service/db-compose.yml

# Set up the db 
db-up:
	docker-compose -f $(COMPOSE_FILE_DB) up -d

# Seed db 
db-seed:
	@echo "Seeding db with bids..."
	@cd service/utils && poetry run python seed.py
	@echo "Seeding done successfully"

# Remove all records in db 
db-remove:
	@echo "Removing db bids..."
	@cd service/utils && poetry run python drop.py
	@echo "Deletion done successfully"

# Down/remove the db and remove volume as well
db-down:
	docker-compose -f $(COMPOSE_FILE_DB) down 

# Get db logs
db-logs:
	docker-compose -f $(COMPOSE_FILE_DB) logs

.PHONY: Poetry/flask server 

# Install Poetry using pip
install-poetry:
	@echo "Installing Poetry..."
	@pip install poetry
	@echo "Poetry installed successfully"

# Install project dependencies using Poetry
install-deps:
	@echo "Installing project dependencies with Poetry..."
	@cd service && poetry install --no-root
	@echo "Project dependencies installed successfully"

# Packaged installation of poetry + install dev dependencies 
install: install-poetry install-deps

# Run the flask server endpoint
# If this command fails, replace python with python3
run: 
	cd service && poetry run python server.py

# Do this if the container hasn't ran yet and want to run the server at the same time 
run-dev: db-up run