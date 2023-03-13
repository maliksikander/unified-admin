const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const databaseSettingSchema = mongoose.Schema(
  {
    mongoUrl: {
      type: String,
      required: true,
      // trim: true,
    },
    eabcDBUrl: {
      type: String,
      required: true,
      // trim: true,
    },
    eabcDBDriver: {
      type: String,
      required: true,
      // trim: true,
    },
    eabcDBDialect: {
      type: String,
      required: true,
      // trim: true,
    },
    eabcDBUser: {
      type: String,
      required: true,
      // trim: true,
    },
    eabcDBPwd: {
      type: String,
      required: true,
      // trim: true,
    },
    ecmDBUrl: {
      type: String,
      required: true,
      // trim: true,
    },
    ecmDBDriver: {
      type: String,
      required: true,
      // trim: true,
    },
    ecmDBDialect: {
      type: String,
      required: true,
      // trim: true,
    },
    ecmDBUser: {
      type: String,
      required: true,
      // trim: true,
    },
    ecmDBPwd: {
      type: String,
      required: true,
      // trim: true,
    },
    ecmDBEngine: {
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
databaseSettingSchema.plugin(toJSON);
const DatabaseSetting = mongoose.model('DatabaseSetting', databaseSettingSchema);
module.exports = DatabaseSetting;
