const winston = require("winston");
const LokiTransport = require("winston-loki");

const logger = winston.createLogger({
    transports: [
      new LokiTransport({
        host: 'http://loki:3100', // Замените на URL вашего Loki
        json: true,
        labels: { job: 'recipes-app' },
        format: winston.format.json(),
      })
    ]
  });
  
  module.exports = logger;