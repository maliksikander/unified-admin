const catchAsync = require('../utils/catchAsync');
const { databaseSettingService } = require('../services');

const getSettings = catchAsync(async (req, res) => {
  const result = await databaseSettingService.getSettings();
  res.send(result);
});

const createSettings = catchAsync(async (req, res) => {
  const result = await databaseSettingService.createSettings(req.body);
  res.send(result);
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await databaseSettingService.updateSettings(req.body);
  res.send(result);
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
