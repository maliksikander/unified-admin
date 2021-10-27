const catchAsync = require('../utils/catchAsync');
const { amqSettingService } = require('../services');

const getSettings = catchAsync(async (req, res) => {
  const result = await amqSettingService.getSettings();
  res.send(result);
});

const createSettings = catchAsync(async (req, res) => {
  const result = await amqSettingService.createSettings(req.body);
  res.send(result);
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await amqSettingService.updateSettings(req.body);
  res.send(result);
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
