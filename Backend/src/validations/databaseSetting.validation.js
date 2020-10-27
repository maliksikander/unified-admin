const Joi = require('@hapi/joi');

const createDatabaseSetting = {
  body: Joi.object().keys({
    mongoUrl: Joi.string().required(),
    eabcDBUrl: Joi.string().required(),
    eabcDBDriver: Joi.string().required(),
    eabcDBDialect: Joi.string().required(),
    eabcDBUser: Joi.string().required(),
    eabcDBPwd: Joi.string().required(),
    ecmDBUrl: Joi.string().required(),
    ecmDBDriver: Joi.string().required(),
    ecmDBDialect: Joi.string().required(),
    ecmDBUser: Joi.string().required(),
    ecmDBPwd: Joi.string().required(),
    ecmDBEngine: Joi.string().required(),
  }),
};
const updateDatabaseSetting = {
  body: Joi.object().keys({
    mongoUrl: Joi.string().required(),
    eabcDBUrl: Joi.string().required(),
    eabcDBDriver: Joi.string().required(),
    eabcDBDialect: Joi.string().required(),
    eabcDBUser: Joi.string().required(),
    eabcDBPwd: Joi.string().required(),
    ecmDBUrl: Joi.string().required(),
    ecmDBDriver: Joi.string().required(),
    ecmDBDialect: Joi.string().required(),
    ecmDBUser: Joi.string().required(),
    ecmDBPwd: Joi.string().required(),
    ecmDBEngine: Joi.string().required(),
    id: Joi.string().required(),
  }),
};

module.exports = {
  createDatabaseSetting,
  updateDatabaseSetting,
};
