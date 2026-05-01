FROM python:3.10-slim AS builder

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY --from=builder /usr/local/lib/python3.10/ /usr/local/lib/python3.10/

COPY . .

ENV PORT=8080

EXPOSE 8080

RUN useradd -m appuser
USER appuser

ENTRYPOINT ["python", "recommendation_server.py"]