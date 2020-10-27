// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { databaseSettingService } = require('../services');

const getDatabaseSettings = catchAsync(async (req, res) => {
  const result = await databaseSettingService.getDatabaseSettings();
  const response = {
    status: res.statusCode,
    databaseSetting: result,
  };
  res.send(response);
});

const createDatabaseSettings = catchAsync(async (req, res) => {
  const result = await databaseSettingService.createDatabaseSettings(req.body);
  const response = {
    status: res.statusCode,
    databaseSetting: result,
  };
  res.send(response);
});

const updateDatabaseSettings = catchAsync(async (req, res) => {
  const result = await databaseSettingService.updateDatabaseSettings(req.body);
  const response = {
    status: res.statusCode,
    databaseSetting: result,
  };
  res.send(response);
});

module.exports = {
  getDatabaseSettings,
  createDatabaseSettings,
  updateDatabaseSettings,
};
