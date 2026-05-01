#!/usr/bin/python

import os
import random
import time
import traceback
from concurrent import futures

import grpc

import demo_pb2
import demo_pb2_grpc
from grpc_health.v1 import health_pb2
from grpc_health.v1 import health_pb2_grpc

from opentelemetry import trace
from opentelemetry.instrumentation.grpc import GrpcInstrumentorClient, GrpcInstrumentorServer
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

from logger import getJSONLogger

logger = getJSONLogger('recommendationservice-server')


class RecommendationService(demo_pb2_grpc.RecommendationServiceServicer):
    def ListRecommendations(self, request, context):
        max_responses = 5

        # Fetch products from product catalog
        cat_response = product_catalog_stub.ListProducts(demo_pb2.Empty())
        product_ids = [x.id for x in cat_response.products]

        filtered_products = list(set(product_ids) - set(request.product_ids))
        num_products = len(filtered_products)
        num_return = min(max_responses, num_products)

        if num_products == 0:
            response = demo_pb2.ListRecommendationsResponse()
            return response

        indices = random.sample(range(num_products), num_return)

        prod_list = [filtered_products[i] for i in indices]

        logger.info("[Recv ListRecommendations] product_ids={}".format(prod_list))

        response = demo_pb2.ListRecommendationsResponse()
        response.product_ids.extend(prod_list)

        return response

    def Check(self, request, context):
        return health_pb2.HealthCheckResponse(
            status=health_pb2.HealthCheckResponse.SERVING
        )

    def Watch(self, request, context):
        return health_pb2.HealthCheckResponse(
            status=health_pb2.HealthCheckResponse.UNIMPLEMENTED
        )


def init_tracing():
    try:
        grpc_client_instrumentor = GrpcInstrumentorClient()
        grpc_client_instrumentor.instrument()

        grpc_server_instrumentor = GrpcInstrumentorServer()
        grpc_server_instrumentor.instrument()

        if os.getenv("ENABLE_TRACING") == "1":
            trace.set_tracer_provider(TracerProvider())

            otel_endpoint = os.getenv(
                "COLLECTOR_SERVICE_ADDR",
                "otel-collector:4317"
            )

            trace.get_tracer_provider().add_span_processor(
                BatchSpanProcessor(
                    OTLPSpanExporter(
                        endpoint=otel_endpoint,
                        insecure=True
                    )
                )
            )

            logger.info("Tracing enabled.")

        else:
            logger.info("Tracing disabled.")

    except Exception:
        logger.warning(
            f"Exception during tracing setup: {traceback.format_exc()}"
        )


if __name__ == "__main__":
    logger.info("Initializing recommendationservice")

    # Initialize tracing only
    init_tracing()

    # Environment configs
    port = os.getenv("PORT", "8080")

    catalog_addr = os.getenv(
        "PRODUCT_CATALOG_SERVICE_ADDR",
        "productcatalogservice:3550"
    )

    logger.info("Product catalog address: " + catalog_addr)

    # Connect to product catalog service
    channel = grpc.insecure_channel(catalog_addr)
    product_catalog_stub = demo_pb2_grpc.ProductCatalogServiceStub(channel)

    # Create gRPC server
    server = grpc.server(
        futures.ThreadPoolExecutor(max_workers=10)
    )

    # Register services
    service = RecommendationService()

    demo_pb2_grpc.add_RecommendationServiceServicer_to_server(
        service,
        server
    )

    health_pb2_grpc.add_HealthServicer_to_server(
        service,
        server
    )

    # Start server
    logger.info("Listening on port: " + port)

    server.add_insecure_port("[::]:" + port)

    server.start()

    # Keep alive
    try:
        while True:
            time.sleep(10000)

    except KeyboardInterrupt:
        logger.info("Shutting down recommendationservice")
        server.stop(0)