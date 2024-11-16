'use strict';

const path = require('path');
const http = require('http');
const express = require('express');

const oas3Tools = require('oas3-tools');
const serverPort = 8080;
const app = express();

const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

client.collectDefaultMetrics({
    app: 'recipies-app',
    prefix: 'node_',
    timeout: 10000,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register
});

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});


// swaggerRouter configuration
const options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

const expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
const swaggerApp = expressAppConfig.getApp();

app.use(swaggerApp);

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});