FROM python:3.10-slim AS base

FROM base AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM base

ENV PYTHONUNBUFFERED=1

WORKDIR /email_server

COPY --from=builder /usr/local/lib/python3.10/ /usr/local/lib/python3.10/
COPY . .

EXPOSE 8080

ENTRYPOINT ["python", "email_server.py"]