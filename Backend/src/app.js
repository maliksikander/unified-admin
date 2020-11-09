const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const path = require('path');
const fs = require('fs');
const ApiError = require('./utils/ApiError');
const angularRoutes = require('./angular.route');
const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

//static html page
// app.use(express.static(process.cwd()+"/my-app/dist/angular-nodejs-example/"));
app.use(express.static(path.join(__dirname, './public')));
// These files load fine (SimpleController.js, main.css)
// app.use(express.static(path.join(__dirname, '/public/dist/index.html')));




// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());

app.get('/', (req, res) => {
  let indexPath = __dirname + '/public/index.html';
  res.sendFile(indexPath);
});

// app.get('/general/amq-settings', (req, res) => {
//   let indexPath = __dirname + '/public/dist/index.html';
//   res.sendFile(indexPath);
// });

// app.get('/general/database-settings', (req, res) => {
//   let indexPath = __dirname + '/public/dist/index.html';
//   res.sendFile(indexPath);
// });

// app.get('/general/display-settings', (req, res) => {
//   let indexPath = __dirname + '/public/dist/index.html';
//   res.sendFile(indexPath);
// });

// app.get('/general/locale-settings', (req, res) => {
//   let indexPath = __dirname + '/public/dist/index.html';
//   res.sendFile(indexPath);
// });

// app.get('/general/logging-settings', (req, res) => {
//   let indexPath = __dirname + '/public/dist/index.html';
//   res.sendFile(indexPath);
// });

// app.get('/general/reporting-settings', (req, res) => {
//   let indexPath = __dirname + '/public/dist/index.html';
//   res.sendFile(indexPath);
// });

// app.get('/general/security-settings', (req, res) => {
//   let indexPath = __dirname + '/public/dist/index.html';
//   res.sendFile(indexPath);
// });

app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  // app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/api', routes);
app.use('/general', angularRoutes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);



module.exports = app;
