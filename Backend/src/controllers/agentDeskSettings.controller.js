const catchAsync = require('../utils/catchAsync');
const { agentDeskSettingsService } = require('../services');

const getSettings = catchAsync(async (req, res) => {
  const result = await agentDeskSettingsService.getSettings();
  res.send(result);
});



const updateSettings = catchAsync(async (req, res) => {
  const result = await agentDeskSettingsService.updateSettings(req.body);
  res.send(result);
});

module.exports = {
  getSettings,
  updateSettings,
};
