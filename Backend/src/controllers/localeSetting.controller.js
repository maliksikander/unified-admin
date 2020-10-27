// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { localeSettingService } = require('../services');

const getLocaleSettings = catchAsync(async (req, res) => {
  const result = await localeSettingService.getLocaleSettings();
  const response = {
    status: res.statusCode,
    localeSetting: result,
  };
  res.send(response);
});

const createLocaleSettings = catchAsync(async (req, res) => {
  const result = await localeSettingService.createLocaleSettings(req.body);
  const response = {
    status: res.statusCode,
    localeSetting: result,
  };
  res.send(response);
});

const updateLocaleSettings = catchAsync(async (req, res) => {
  const result = await localeSettingService.updateLocaleSettings(req.body);
  const response = {
    status: res.statusCode,
    localeSetting: result,
  };
  res.send(response);
});

module.exports = {
  getLocaleSettings,
  createLocaleSettings,
  updateLocaleSettings,
};
