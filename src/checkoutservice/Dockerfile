FROM golang:1.25-alpine AS builder

RUN apk add --no-cache ca-certificates git build-base

WORKDIR /src

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -o /checkoutservice .

FROM alpine:3.18

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=builder /checkoutservice /app/checkoutservice

ENV GOTRACEBACK=single

EXPOSE 5050

USER nobody

ENTRYPOINT ["/app/checkoutservice"]
