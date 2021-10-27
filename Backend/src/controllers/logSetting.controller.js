const catchAsync = require('../utils/catchAsync');
const { logSettingService } = require('../services');

const getSettings = catchAsync(async (req, res) => {
  const result = await logSettingService.getSettings();
  res.send(result);
});

const createSettings = catchAsync(async (req, res) => {
  const result = await logSettingService.createSettings(req.body);
  res.send(result);
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await logSettingService.updateSettings(req.body);
  res.send(result);
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
