const Joi = require('@hapi/joi');


const updateSetting = {
  body: Joi.object().keys({
    isMessageFormattingEnabled: Joi.boolean(),
    isFileSharingEnabled: Joi.boolean(),
    isEmojisEnabled: Joi.boolean(),
    isConversationParticipantsEnabled: Joi.boolean(),
    isWrapUpEnabled: Joi.boolean(),
    wrapUpTime: Joi.number(),
    id: Joi.string().required()
  }),
};

module.exports = {
  updateSetting,
};