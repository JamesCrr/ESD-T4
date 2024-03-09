FROM python:3.11-slim

WORKDIR /app

COPY . /app

RUN pip install poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-dev --no-interaction --no-ansi

EXPOSE 3012

CMD ["poetry", "run", "python", "server.py"]