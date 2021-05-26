const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const error = require('./middlewares/error');
const https = require('https');
const fs = require('fs');

let server;
const keyPath = config.httpsKeyPath ? config.httpsKeyPath : "httpsFiles/server.key";
const certPath = config.httpsCertPath ? config.httpsCertPath : "httpsFiles/server.cert";
const certPassphrase = config.httpsCertPassphrase ? config.httpsCertPassphrase : "";
const httpsKey = fs.readFileSync(keyPath, 'utf8');
const httpsCert = fs.readFileSync(certPath, 'utf8');
const httpsCredentials = {
  key: httpsKey,
  cert: httpsCert,
  passphrase: certPassphrase
};

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');

  if (config.isSSL == true) {
    server = https.createServer(httpsCredentials, app).listen(config.Port, () => {
      logger.info(`Listening to port ${config.Port} on https`);
    });
  }
  else {
    server = app.listen(config.Port, () => {
      logger.info(`Listening to port ${config.Port} on http`);
    });
  }


}).catch(error => logger.error('DB connection Error:', error));

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  }
  else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) { server.close(); }
});
