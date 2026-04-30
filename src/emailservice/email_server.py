
#!/usr/bin/python
#
# Copyright 2018 Google LLC
#

from concurrent import futures
import os
import time
import grpc
import traceback

from jinja2 import Environment, FileSystemLoader, select_autoescape, TemplateError

import demo_pb2
import demo_pb2_grpc

from grpc_health.v1 import health_pb2
from grpc_health.v1 import health_pb2_grpc

from opentelemetry import trace
from opentelemetry.instrumentation.grpc import GrpcInstrumentorServer
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

from logger import getJSONLogger

logger = getJSONLogger('emailservice-server')

env = Environment(
    loader=FileSystemLoader('templates'),
    autoescape=select_autoescape(['html', 'xml'])
)

template = env.get_template('confirmation.html')


class BaseEmailService(demo_pb2_grpc.EmailServiceServicer):
    def Check(self, request, context):
        return health_pb2.HealthCheckResponse(
            status=health_pb2.HealthCheckResponse.SERVING
        )

    def Watch(self, request, context):
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        return health_pb2.HealthCheckResponse()

    def List(self, request, context):
        return health_pb2.HealthListResponse()


class DummyEmailService(BaseEmailService):
    def SendOrderConfirmation(self, request, context):
        logger.info(
            f"A request to send order confirmation email to {request.email} has been received."
        )

        try:
            confirmation = template.render(order=request.order)
            logger.info("Email template rendered successfully.")
        except TemplateError as err:
            logger.error(f"Template rendering failed: {err}")
            context.set_details(
                "An error occurred when preparing the confirmation mail."
            )
            context.set_code(grpc.StatusCode.INTERNAL)

        return demo_pb2.Empty()


def start(dummy_mode=True):
    server = grpc.server(
        futures.ThreadPoolExecutor(max_workers=10),
    )

    service = DummyEmailService()

    demo_pb2_grpc.add_EmailServiceServicer_to_server(service, server)
    health_pb2_grpc.add_HealthServicer_to_server(service, server)

    port = os.environ.get("PORT", "8080")

    logger.info(f"listening on port: {port}")

    server.add_insecure_port(f"[::]:{port}")
    server.start()

    try:
        while True:
            time.sleep(3600)
    except KeyboardInterrupt:
        server.stop(0)


if __name__ == '__main__':
    logger.info('starting the email service in dummy mode.')

    # Tracing
    try:
        if os.environ.get("ENABLE_TRACING") == "1":
            otel_endpoint = os.getenv(
                "COLLECTOR_SERVICE_ADDR",
                "localhost:4317"
            )

            trace.set_tracer_provider(TracerProvider())

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

        grpc_server_instrumentor = GrpcInstrumentorServer()
        grpc_server_instrumentor.instrument()

    except Exception:
        logger.warning(
            f"Tracing initialization failed: {traceback.format_exc()}"
        )

    start(dummy_mode=True)

