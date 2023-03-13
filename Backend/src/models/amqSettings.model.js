const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const amqSettingSchema = mongoose.Schema(
  {
    amqHost: {
      type: String,
      required: true,
      // trim: true,
    },
    amqPort: {
      type: String,
      required: true,
      // trim: true,
    },
    amqUser: {
      type: String,
      required: true,
      // trim: true,
    },
    amqPwd: {
      type: String,
      required: true,
      // trim: true,
    },
    amqUrl: {
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
amqSettingSchema.plugin(toJSON);
const AmqSetting = mongoose.model('AmqSetting', amqSettingSchema);
module.exports = AmqSetting;
