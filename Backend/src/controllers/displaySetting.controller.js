const catchAsync = require('../utils/catchAsync');
const { displaySettingService } = require('../services');

const getSettings = catchAsync(async (req, res) => {
  const result = await displaySettingService.getSettings();
  res.send(result);
});

const createSettings = catchAsync(async (req, res) => {
  const result = await displaySettingService.createSettings(req.body);
  res.send(result);
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await displaySettingService.updateSettings(req.body);
  res.send(result);
});

module.exports = {
  getSettings,
  createSettings,
  updateSettings,
};
