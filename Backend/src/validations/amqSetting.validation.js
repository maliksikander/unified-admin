const Joi = require('@hapi/joi');

const createAmqSetting = {
  body: Joi.object().keys({
    amqHost: Joi.string().required(),
    amqPort: Joi.string().required(),
    amqUser: Joi.string().required(),
    amqPwd: Joi.string().required(),
    amqUrl: Joi.string().required(),
  }),
};

const updateAmqSetting = {
  body: Joi.object().keys({
    amqHost: Joi.string().required(),
    amqPort: Joi.string().required(),
    amqUser: Joi.string().required(),
    amqPwd: Joi.string().required(),
    amqUrl: Joi.string().required(),
    id: Joi.string().required(),
  }),
};

module.exports = {
  createAmqSetting,
  updateAmqSetting,
};
