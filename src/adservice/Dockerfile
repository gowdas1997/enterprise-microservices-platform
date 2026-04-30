FROM eclipse-temurin:19 AS builder

WORKDIR /app

COPY ["build.gradle", "gradlew", "./"]
COPY gradle gradle
RUN chmod +x gradlew
RUN ./gradlew downloadRepos

COPY . .
RUN chmod +x gradlew
RUN ./gradlew installDist

FROM eclipse-temurin:19-jre-alpine

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=builder /app/build/install/hipstershop /app

EXPOSE 9555

ENTRYPOINT ["/app/bin/AdService"]