const Joi = require('@hapi/joi');

const createSetting = {
  body: Joi.object().keys({
    amqHost: Joi.string().max(256).pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).required(),
    amqPort: Joi.string().min(2).max(5).required(),
    amqUser: Joi.string().max(40).required(),
    amqPwd: Joi.string().max(256).required(),
    amqUrl: Joi.string().pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).required(),
  }),
};

const updateSetting = {
  body: Joi.object().keys({
    amqHost: Joi.string().max(256).pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).required(),
    amqPort: Joi.string().min(2).max(5).required(),
    amqUser: Joi.string().max(40).required(),
    amqPwd: Joi.string().max(256).required(),
    amqUrl: Joi.string().pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).required(),
    id: Joi.string().required(),
  }),
};

module.exports = {
  createSetting,
  updateSetting,
};
