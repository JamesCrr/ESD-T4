FROM python:3-slim

WORKDIR /app

COPY requirements.txt .

RUN python -m pip install --no-cache-dir -r requirements.txt

COPY ./sender.py ./sender.py
COPY ./amqp_connection.py ./amqp_connection.py

CMD ["python", "sender.py"]