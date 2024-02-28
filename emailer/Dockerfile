FROM python:3-slim

WORKDIR /app

COPY requirements.txt .

RUN python -m pip install --no-cache-dir -r requirements.txt

COPY ./emailer.py ./emailer.py
COPY ./emailservice.py ./emailservice.py
COPY ./amqp_connection.py ./amqp_connection.py
COPY ./.env ./.env

CMD ["python", "emailer.py"]