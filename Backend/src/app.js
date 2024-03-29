const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
// const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
// const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const path = require('path');
const ApiError = require('./utils/ApiError');
const app = express();
var session = require('express-session');
// var memoryStore = new session.MemoryStore();
const MongoStore = require('connect-mongo');


app.use(session({
  secret: 'secret1',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: config.mongoose.url
  })
}));

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0


if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

//static html page
app.use(express.static(path.join(__dirname, './public')));


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




app.options('*', cors());

// jwt authentication
// app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  // app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/', routes);

app.get('*', (req, res) => {
  let indexPath = path.resolve('src', 'public', 'index.html');
  res.sendFile(indexPath);
});


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);



module.exports = app;
