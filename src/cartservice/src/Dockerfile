FROM mcr.microsoft.com/dotnet/sdk:8.0 AS builder

WORKDIR /app

COPY cartservice.csproj ./

RUN dotnet restore cartservice.csproj -r linux-musl-x64

COPY . .

RUN dotnet publish cartservice.csproj \
    -c Release \
    -r linux-musl-x64 \
    --self-contained true \
    -p:PublishSingleFile=true \
    -p:PublishTrimmed=true \
    -p:TrimMode=Full \
    -o /cartservice \
    --no-restore

FROM mcr.microsoft.com/dotnet/runtime-deps:8.0-alpine

WORKDIR /app

COPY --from=builder /cartservice .

EXPOSE 7070

ENV DOTNET_EnableDiagnostics=0 \
    ASPNETCORE_HTTP_PORTS=7070 \
    ASPNETCORE_ENVIRONMENT=Production

USER 1000

ENTRYPOINT ["/app/cartservice"]