const Joi = require('@hapi/joi');

const createSetting = {
  body: Joi.object().keys({
    reportingEnabled: Joi.boolean().required(),
    rcDBUrl: Joi.string().allow('').pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).required(),
    rcDBUser: Joi.string().allow('').max(40).required(),
    rcDBPwd: Joi.string().allow('').max(256).required(),
    rcDBName: Joi.string().allow('').max(40).required(),
  }),
};

const updateSetting = {
  body: Joi.object().keys({
    reportingEnabled: Joi.boolean().required(),
    rcDBUrl: Joi.string().allow('').pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).required(),
    rcDBUser: Joi.string().allow('').max(40).required(),
    rcDBPwd: Joi.string().allow('').max(256).required(),
    rcDBName: Joi.string().allow('').max(40).required(),
    id: Joi.string().required(),
  }),
};

module.exports = {
  createSetting,
  updateSetting,
};
