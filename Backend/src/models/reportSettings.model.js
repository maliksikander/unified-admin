const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const reportSettingSchema = mongoose.Schema(
  {
    reportingEnabled: {
      type: Boolean,
    },
    rcDBUrl: {
      type: String,
    },
    rcDBUser: {
      type: String,
    },
    rcDBPwd: {
      type: String,
    },
    rcDBName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
reportSettingSchema.plugin(toJSON);
const ReportSetting = mongoose.model('ReportSetting', reportSettingSchema);
module.exports = ReportSetting;
