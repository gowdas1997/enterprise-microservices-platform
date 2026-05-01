package main

import (
	"fmt"
	"net"
	"os"
	"time"

	"github.com/sirupsen/logrus"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/reflection"
	"google.golang.org/grpc/status"

	pb "github.com/gowdas1997/enterprise-microservices-platform/src/shippingservice/genproto"
	healthpb "google.golang.org/grpc/health/grpc_health_v1"
)

const (
	defaultPort = "50051"
)

var log *logrus.Logger

func init() {
	log = logrus.New()
	log.Level = logrus.InfoLevel
	log.Formatter = &logrus.JSONFormatter{
		FieldMap: logrus.FieldMap{
			logrus.FieldKeyTime:  "timestamp",
			logrus.FieldKeyLevel: "severity",
			logrus.FieldKeyMsg:   "message",
		},
		TimestampFormat: time.RFC3339Nano,
	}
	log.Out = os.Stdout
}

func main() {
	if os.Getenv("ENABLE_TRACING") == "1" {
		log.Info("Tracing support reserved for future OpenTelemetry integration.")
	} else {
		log.Info("Tracing disabled.")
	}

	port := defaultPort
	if value, ok := os.LookupEnv("PORT"); ok {
		port = value
	}

	address := fmt.Sprintf(":%s", port)

	lis, err := net.Listen("tcp", address)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	srv := grpc.NewServer()

	svc := &server{}

	pb.RegisterShippingServiceServer(srv, svc)
	healthpb.RegisterHealthServer(srv, svc)

	log.Infof("Shipping Service listening on port %s", address)

	// Reflection is safe for internal service debugging
	reflection.Register(srv)

	if err := srv.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

// server controls RPC service responses.
type server struct{}

// Check is for health checking.
func (s *server) Check(
	ctx context.Context,
	req *healthpb.HealthCheckRequest,
) (*healthpb.HealthCheckResponse, error) {
	return &healthpb.HealthCheckResponse{
		Status: healthpb.HealthCheckResponse_SERVING,
	}, nil
}

// Watch is not implemented.
func (s *server) Watch(
	req *healthpb.HealthCheckRequest,
	ws healthpb.Health_WatchServer,
) error {
	return status.Errorf(
		codes.Unimplemented,
		"health check via Watch not implemented",
	)
}

// GetQuote produces a shipping quote (cost) in USD.
func (s *server) GetQuote(
	ctx context.Context,
	in *pb.GetQuoteRequest,
) (*pb.GetQuoteResponse, error) {

	log.Info("[GetQuote] received request")
	defer log.Info("[GetQuote] completed request")

	quote := CreateQuoteFromCount(0)

	return &pb.GetQuoteResponse{
		CostUsd: &pb.Money{
			CurrencyCode: "USD",
			Units:        int64(quote.Dollars),
			Nanos:        int32(quote.Cents * 10000000),
		},
	}, nil
}

// ShipOrder mocks item shipment and returns tracking ID.
func (s *server) ShipOrder(
	ctx context.Context,
	in *pb.ShipOrderRequest,
) (*pb.ShipOrderResponse, error) {

	log.Info("[ShipOrder] received request")
	defer log.Info("[ShipOrder] completed request")

	baseAddress := fmt.Sprintf(
		"%s, %s, %s",
		in.Address.StreetAddress,
		in.Address.City,
		in.Address.State,
	)

	id := CreateTrackingId(baseAddress)

	return &pb.ShipOrderResponse{
		TrackingId: id,
	}, nil
}