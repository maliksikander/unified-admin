const catchAsync = require('../utils/catchAsync');
const { healthCheckService } = require('../services');

const getHealth = catchAsync(async (req, res) => {
  const result = await healthCheckService.checkHealth();
  res.send(result);
});


module.exports = {
  getHealth
};