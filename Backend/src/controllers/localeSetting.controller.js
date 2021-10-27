const catchAsync = require('../utils/catchAsync');
const { localeSettingService } = require('../services');

const getSettings = catchAsync(async (req, res) => {
  const result = await localeSettingService.getSettings();
  res.send(result);
});

const createSettings = catchAsync(async (req, res) => {
  const result = await localeSettingService.createSettings(req.body);
  res.send(result);
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await localeSettingService.updateSettings(req.body);
  res.send(result);
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
