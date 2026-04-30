module github.com/gowdas1997/enterprise-microservices-platform/src/productcatalogservice

go 1.21

require (
	github.com/golang/protobuf v1.5.3
	github.com/pkg/errors v0.9.1
	github.com/sirupsen/logrus v1.9.3
	go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc v0.45.0
	go.opentelemetry.io/otel v1.19.0
	go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc v1.19.0
	go.opentelemetry.io/otel/sdk v1.19.0
	golang.org/x/net v0.17.0
	google.golang.org/grpc v1.58.3
)