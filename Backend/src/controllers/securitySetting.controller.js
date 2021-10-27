const catchAsync = require('../utils/catchAsync');
const { securitySettingService } = require('../services');

const getSettings = catchAsync(async (req, res) => {
  const result = await securitySettingService.getSettings();
  res.send(result);
});

const createSettings = catchAsync(async (req, res) => {
  const result = await securitySettingService.createSettings(req.body);
  res.send(result);
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await securitySettingService.updateSettings(req.body);
  res.send(result);
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
