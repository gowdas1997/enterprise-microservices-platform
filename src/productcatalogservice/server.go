package main

import (
	"bytes"
	"context"
	"flag"
	"fmt"
	"net"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	pb "github.com/gowdas1997/enterprise-microservices-platform/src/productcatalogservice/genproto"
	"github.com/golang/protobuf/jsonpb"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"

	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/propagation"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	healthpb "google.golang.org/grpc/health/grpc_health_v1"
)

var (
	catalogMutex *sync.Mutex
	log          *logrus.Logger
	extraLatency time.Duration

	port = "3550"

	reloadCatalog bool
)

func init() {
	log = logrus.New()
	log.Formatter = &logrus.JSONFormatter{
		FieldMap: logrus.FieldMap{
			logrus.FieldKeyTime:  "timestamp",
			logrus.FieldKeyLevel: "severity",
			logrus.FieldKeyMsg:   "message",
		},
		TimestampFormat: time.RFC3339Nano,
	}
	log.Out = os.Stdout
	catalogMutex = &sync.Mutex{}
}

func main() {
	if os.Getenv("ENABLE_TRACING") == "1" {
		err := initTracing()
		if err != nil {
			log.Warnf("failed to initialize tracing: %+v", err)
		}
	} else {
		log.Info("Tracing disabled.")
	}

	flag.Parse()

	if s := os.Getenv("EXTRA_LATENCY"); s != "" {
		v, err := time.ParseDuration(s)
		if err != nil {
			log.Fatalf("failed to parse EXTRA_LATENCY: %+v", err)
		}
		extraLatency = v
		log.Infof("extra latency enabled: %v", extraLatency)
	} else {
		extraLatency = 0
	}

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGUSR1, syscall.SIGUSR2)

	go func() {
		for {
			sig := <-sigs
			log.Printf("Received signal: %s", sig)

			if sig == syscall.SIGUSR1 {
				reloadCatalog = true
				log.Infof("Catalog reloading enabled")
			} else {
				reloadCatalog = false
				log.Infof("Catalog reloading disabled")
			}
		}
	}()

	if os.Getenv("PORT") != "" {
		port = os.Getenv("PORT")
	}

	log.Infof("Starting gRPC server on port %s", port)

	run(port)

	select {}
}

func run(port string) string {
	listener, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatal(err)
	}

	otel.SetTextMapPropagator(
		propagation.NewCompositeTextMapPropagator(
			propagation.TraceContext{},
			propagation.Baggage{},
		),
	)

	srv := grpc.NewServer(
		grpc.UnaryInterceptor(otelgrpc.UnaryServerInterceptor()),
		grpc.StreamInterceptor(otelgrpc.StreamServerInterceptor()),
	)

	svc := &productCatalog{}

	err = readCatalogFile(&svc.catalog)
	if err != nil {
		log.Warn("Could not parse product catalog")
	}

	pb.RegisterProductCatalogServiceServer(srv, svc)
	healthpb.RegisterHealthServer(srv, svc)

	go srv.Serve(listener)

	return listener.Addr().String()
}

func initTracing() error {
	var (
		collectorAddr string
		collectorConn *grpc.ClientConn
	)

	ctx := context.Background()

	collectorAddr = os.Getenv("COLLECTOR_SERVICE_ADDR")
	if collectorAddr == "" {
		collectorAddr = "otel-collector:4317"
	}

	mustConnGRPC(ctx, &collectorConn, collectorAddr)

	exporter, err := otlptracegrpc.New(
		ctx,
		otlptracegrpc.WithGRPCConn(collectorConn),
	)

	if err != nil {
		log.Warnf("Failed to create trace exporter: %v", err)
		return err
	}

	tp := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
		sdktrace.WithSampler(sdktrace.AlwaysSample()),
	)

	otel.SetTracerProvider(tp)

	return nil
}

func mustConnGRPC(ctx context.Context, conn **grpc.ClientConn, addr string) {
	var err error

	ctx, cancel := context.WithTimeout(ctx, time.Second*3)
	defer cancel()

	*conn, err = grpc.DialContext(
		ctx,
		addr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithUnaryInterceptor(otelgrpc.UnaryClientInterceptor()),
		grpc.WithStreamInterceptor(otelgrpc.StreamClientInterceptor()),
	)

	if err != nil {
		panic(errors.Wrapf(err, "grpc: failed to connect %s", addr))
	}
}

func readCatalogFile(catalog *pb.ListProductsResponse) error {
	catalogMutex.Lock()
	defer catalogMutex.Unlock()

	catalogJSON, err := os.ReadFile("products.json")
	if err != nil {
		log.Fatalf("failed to open product catalog json file: %v", err)
		return err
	}

	if err := jsonpb.Unmarshal(bytes.NewReader(catalogJSON), catalog); err != nil {
		log.Warnf("failed to parse catalog JSON: %v", err)
		return err
	}

	log.Info("Successfully parsed product catalog JSON")

	return nil
}