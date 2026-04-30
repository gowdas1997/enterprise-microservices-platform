
/*
 * Copyright 2018 Google LLC.
 */

console.log("Profiler disabled.");

// Register GRPC OTel Instrumentation
const { GrpcInstrumentation } = require('@opentelemetry/instrumentation-grpc');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

registerInstrumentations({
  instrumentations: [new GrpcInstrumentation()]
});

if (process.env.ENABLE_TRACING === "1") {
  console.log("Tracing enabled.");

  const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
  const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
  const { OTLPTraceExporter } = require("@opentelemetry/exporter-otlp-grpc");

  const provider = new NodeTracerProvider();
  const collectorUrl = process.env.COLLECTOR_SERVICE_ADDR;

  provider.addSpanProcessor(
    new SimpleSpanProcessor(
      new OTLPTraceExporter({ url: collectorUrl })
    )
  );

  provider.register();
} else {
  console.log("Tracing disabled.");
}

const path = require('path');
const grpc = require('@grpc/grpc-js');
const pino = require('pino');
const protoLoader = require('@grpc/proto-loader');

const MAIN_PROTO_PATH = path.join(__dirname, './proto/demo.proto');
const HEALTH_PROTO_PATH = path.join(__dirname, './proto/grpc/health/v1/health.proto');

const PORT = process.env.PORT || 7000;

const shopProto = loadProto(MAIN_PROTO_PATH).hipstershop;
const healthProto = loadProto(HEALTH_PROTO_PATH).grpc.health.v1;

const logger = pino({
  name: 'currencyservice-server',
  messageKey: 'message',
  formatters: {
    level(logLevelString) {
      return { severity: logLevelString };
    }
  }
});

function loadProto(protoPath) {
  const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

  return grpc.loadPackageDefinition(packageDefinition);
}

function getCurrencyData(callback) {
  const data = require('./data/currency_conversion.json');
  callback(data);
}

function carry(amount) {
  const fractionSize = Math.pow(10, 9);

  amount.nanos += (amount.units % 1) * fractionSize;
  amount.units = Math.floor(amount.units) + Math.floor(amount.nanos / fractionSize);
  amount.nanos = amount.nanos % fractionSize;

  return amount;
}

function getSupportedCurrencies(call, callback) {
  logger.info('Getting supported currencies...');

  getCurrencyData((data) => {
    callback(null, {
      currency_codes: Object.keys(data)
    });
  });
}

function convert(call, callback) {
  try {
    getCurrencyData((data) => {
      const request = call.request;
      const from = request.from;

      const euros = carry({
        units: from.units / data[from.currency_code],
        nanos: from.nanos / data[from.currency_code]
      });

      euros.nanos = Math.round(euros.nanos);

      const result = carry({
        units: euros.units * data[request.to_code],
        nanos: euros.nanos * data[request.to_code]
      });

      result.units = Math.floor(result.units);
      result.nanos = Math.floor(result.nanos);
      result.currency_code = request.to_code;

      logger.info('conversion request successful');
      callback(null, result);
    });
  } catch (err) {
    logger.error(`conversion request failed: ${err}`);
    callback(err.message);
  }
}

function check(call, callback) {
  callback(null, {
    status: 'SERVING'
  });
}

function watch(call) {
  call.write({
    status: 'SERVING'
  });
}

function list(call, callback) {
  callback(null, {});
}

function main() {
  logger.info(`Starting gRPC server on port ${PORT}...`);

  const server = new grpc.Server();

  server.addService(shopProto.CurrencyService.service, {
    getSupportedCurrencies,
    convert
  });

  server.addService(healthProto.Health.service, {
    check,
    watch,
    list
  });

  server.bindAsync(
    `[::]:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    () => {
      logger.info(`CurrencyService gRPC server started on port ${PORT}`);
      server.start();
    }
  );
}

main();
