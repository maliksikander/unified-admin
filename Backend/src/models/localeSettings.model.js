const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const localeSettingSchema = mongoose.Schema(
  {
    supportedLanguages: {
      type: [
        {
          code: String,
          name: String,
          flagUrl: String,
        },
      ],
      required: true,
      // trim: true,
    },
    defaultLanguage: {
      type: {
        code: String,
        name: String,
        flagUrl: String,
      },
      required: true,
      // trim: true,
    },
    timezone: {
      type: {
        id: Number,
        name: String,
      },
      required: true,
      // trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
localeSettingSchema.plugin(toJSON);
const LocaleSetting = mongoose.model('LocaleSetting', localeSettingSchema);
module.exports = LocaleSetting;
