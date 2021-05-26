const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const error = require('./middlewares/error');
const https = require('https');
const fs = require('fs');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');

  httpsServer = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  }, app).listen(config.httpsPort, () => {
    logger.info(`Listening to https port ${config.httpsPort}`);
  })

  httpServer = app.listen(config.httpPort, () => {
    logger.info(`Listening to http port ${config.httpPort}`);
  });
}).catch(error => logger.error('DB connection Error:', error));

const exitHandler = () => {
  if (httpServer) {
    httpServer.close(() => {
      logger.info('Http Server closed');
      process.exit(1);
    });
  }
  else if (httpsServer) {
    httpsServer.close(() => {
      logger.info('Https Server closed');
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
  if (httpsServer) {
    // server.close();
    httpsServer.close();
  }
  else if (httpServer) {
    httpServer.close();
  }
});
