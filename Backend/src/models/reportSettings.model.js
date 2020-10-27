const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const reportSettingSchema = mongoose.Schema(
  {
    reportingEnabled: {
      type: Boolean,
      required: true,
      // trim: true,
    },
    rcDBUrl: {
      type: String,
      required: true,
      // trim: true,
    },
    rcDBUser: {
      type: String,
      required: true,
      // trim: true,
    },
    rcDBPwd: {
      type: String,
      required: true,
      // trim: true,
    },
    rcDBName: {
      type: String,
      required: true,
      // trim: true,
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
