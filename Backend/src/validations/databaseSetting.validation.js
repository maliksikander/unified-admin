const Joi = require('@hapi/joi');

const createSetting = {
  body: Joi.object().keys({
    mongoUrl: Joi.string().pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).required(),
    eabcDBUrl: Joi.string().pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).required(),
    eabcDBDriver: Joi.string().max(256).required(),
    eabcDBDialect: Joi.string().max(256).required(),
    eabcDBUser: Joi.string().max(40).required(),
    eabcDBPwd: Joi.string().max(256).required(),
    ecmDBUrl: Joi.string().pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).required(),
    ecmDBDriver: Joi.string().max(256).required(),
    ecmDBDialect: Joi.string().max(256).required(),
    ecmDBUser: Joi.string().max(256).max(40).required(),
    ecmDBPwd: Joi.string().max(256).required(),
    ecmDBEngine: Joi.string().max(256).required(),
  }),
};
const updateSetting = {
  body: Joi.object().keys({
    mongoUrl: Joi.string().pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).required(),
    eabcDBUrl: Joi.string().pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).required(),
    eabcDBDriver: Joi.string().max(256).required(),
    eabcDBDialect: Joi.string().max(256).required(),
    eabcDBUser: Joi.string().max(40).required(),
    eabcDBPwd: Joi.string().max(256).required(),
    ecmDBUrl: Joi.string().pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).required(),
    ecmDBDriver: Joi.string().max(256).required(),
    ecmDBDialect: Joi.string().max(256).required(),
    ecmDBUser: Joi.string().max(256).max(40).required(),
    ecmDBPwd: Joi.string().max(256).required(),
    ecmDBEngine: Joi.string().max(256).required(),
    id: Joi.string().required(),
  }),
};

module.exports = {
  createSetting,
  updateSetting,
};
