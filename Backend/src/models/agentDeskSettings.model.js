const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const agentDeskSettingSchema = mongoose.Schema(
  {
    isMessageFormattingEnabled: {
      type: Boolean,
      required: true,
      default:false
    },
    isFileSharingEnabled: {
      type: Boolean,
      required: true,
      default:false

    },
    isEmojisEnabled: {
      type: Boolean,
      required: true,
      default:false

    },
    isConversationParticipantsEnabled: {
      type: Boolean,
      required: true,
      default:false

    },
    isWrapUpEnabled: {
      type: Boolean,
      required: true,
      default:false
    },
    wrapUpTime: {
      type: Number,
      required: true,
      min:15,
      max:1800,
      default:15

    },
    isOutboundSmsEnabled: {
      type: Boolean,
      required: true,
      default: false
      
    },
    prefixCode: {
      type: String,
      required: true,
      min: 1,
      max: 3,
      default: '+92'

    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
agentDeskSettingSchema.plugin(toJSON);
const agentDeskSetting = mongoose.model('agentDeskSetting', agentDeskSettingSchema);
module.exports = agentDeskSetting;
