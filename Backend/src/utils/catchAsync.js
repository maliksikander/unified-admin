const logger = require('../config/logger');

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    logger.error("Catch Error :", err);
    next(err)
  });
};

module.exports = catchAsync;
