FROM golang:1.21-alpine AS builder

RUN apk add --no-cache ca-certificates git

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /shippingservice .

FROM alpine:3.18

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=builder /shippingservice /app/shippingservice

ENV PORT=50051
ENV GOTRACEBACK=single

RUN adduser -D appuser
USER appuser

EXPOSE 50051

ENTRYPOINT ["/app/shippingservice"]