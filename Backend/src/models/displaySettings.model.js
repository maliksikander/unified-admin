const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const displaySettingSchema = mongoose.Schema(
  {
    companyDisplayName: {
      type: String,
      required: true,
      // trim: true,
    },
    agentAlias: {
      type: String,
      required: true,
      // trim: true,
    },
    companyLogo: {
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
displaySettingSchema.plugin(toJSON);
const DisplaySetting = mongoose.model('DisplaySetting', displaySettingSchema);
module.exports = DisplaySetting;
