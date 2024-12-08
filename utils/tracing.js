const { NodeSDK } = require("@opentelemetry/sdk-node");
const { Resource } = require("@opentelemetry/resources");
const { ATTR_SERVICE_NAME, SEMRESATTRS_SERVICE_NAME } = require("@opentelemetry/semantic-conventions");
const grpc = require("@grpc/grpc-js");
const {
  BasicTracerProvider,
  SimpleSpanProcessor,
  ConsoleSpanExporter
} = require("@opentelemetry/sdk-trace-base");

const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
// const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-grpc");

try {
  const traceExporter = new OTLPTraceExporter({
    // endpoint: "http://otel-collector:4317",
    credentials: grpc.credentials.createSsl(),
  });
  
  const sdk = new NodeSDK({
    resource: new Resource({
      [ATTR_SERVICE_NAME]: "recipes-app",
    }),
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });
  
  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });
  
  // initialize the SDK and register with the OpenTelemetry API
  // this enables the API to record telemetry
  sdk.start();
} catch (err) {
  console.error(err)
}


// const provider = new BasicTracerProvider({
//   spanProcessors: [new SimpleSpanProcessor(exporter)],
// });
// provider.register();
// const sdk = new NodeSDK({
//   resource: new Resource({
//     [ATTR_SERVICE_NAME]: "recipes-app",
//   }),
//   traceExporter,
//   instrumentations: [getNodeAutoInstrumentations()],
// });

// sdk.start();
