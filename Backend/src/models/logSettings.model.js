const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const logSettingSchema = mongoose.Schema(
  {
    agentLogsMaxFiles: {
      type: Number,
      required: true,
      // trim: true,
    },
    agentLogsFileSize: {
      type: Number,
      required: true,
      // trim: true,
    },
    logFilePath: {
      type: String,
      required: true,
      // trim: true,
    },
    logLevel: {
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
logSettingSchema.plugin(toJSON);
const LogSetting = mongoose.model('LogSetting', logSettingSchema);
module.exports = LogSetting;
