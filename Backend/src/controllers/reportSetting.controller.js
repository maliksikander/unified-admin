// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { reportSettingService } = require('../services');

const getReportSettings = catchAsync(async (req, res) => {
  const result = await reportSettingService.getReportSettings();
  const response = {
    status: res.statusCode,
    reportSetting: result,
  };
  res.send(response);
});

const createReportSettings = catchAsync(async (req, res) => {
  const result = await reportSettingService.createReportSettings(req.body);
  const response = {
    status: res.statusCode,
    reportSetting: result,
  };
  res.send(response);
});

const updateReportSettings = catchAsync(async (req, res) => {
  const result = await reportSettingService.updateReportSettings(req.body);
  const response = {
    status: res.statusCode,
    reportSetting: result,
  };
  res.send(response);
});

module.exports = {
  getReportSettings,
  createReportSettings,
  updateReportSettings,
};
