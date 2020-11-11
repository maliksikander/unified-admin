const Joi = require('@hapi/joi');

const createSetting = {
  body: Joi.object().keys({
    certificatePath: Joi.string().max(256).required(),
    certificateKeypath: Joi.string().max(256).required(),
    certificatePassphrase: Joi.string().max(256).required(),
    corsOrigin: Joi.string().max(40).required(),
    certificateAuthorityPath: Joi.string().max(256).required(),
    certificateAuthorityPassphrase: Joi.string().max(256).required(),
    keystorePath: Joi.string().max(256).required(),
    keystorePwd: Joi.string().max(256).required(),
    truststorePath: Joi.string().max(256).required(),
    truststorePwd: Joi.string().max(256).required(),
    jksKeystorePath: Joi.string().max(256).required(),
    jksKeystorePwd: Joi.string().max(256).required(),
    jksKeymanagerPwd: Joi.string().max(256).required(),
    amqCertificatePath: Joi.string().max(256).required(),
    amqCertificatePassphrase: Joi.string().max(256).required(),
    minioSSL: Joi.boolean().required(),
    mongoSSL: Joi.boolean().required(),
    commBypassSSL: Joi.boolean().required(),
    enableSSL: Joi.boolean().required(),
    stompSSLEnabled: Joi.boolean().required(),
  }),
};
const updateSetting = {
  body: Joi.object().keys({
    certificatePath: Joi.string().max(256).required(),
    certificateKeypath: Joi.string().max(256).required(),
    certificatePassphrase: Joi.string().max(256).required(),
    corsOrigin: Joi.string().max(40).required(),
    certificateAuthorityPath: Joi.string().max(256).required(),
    certificateAuthorityPassphrase: Joi.string().max(256).required(),
    keystorePath: Joi.string().max(256).required(),
    keystorePwd: Joi.string().max(256).required(),
    truststorePath: Joi.string().max(256).required(),
    truststorePwd: Joi.string().max(256).required(),
    jksKeystorePath: Joi.string().max(256).required(),
    jksKeystorePwd: Joi.string().max(256).required(),
    jksKeymanagerPwd: Joi.string().max(256).required(),
    amqCertificatePath: Joi.string().max(256).required(),
    amqCertificatePassphrase: Joi.string().max(256).required(),
    minioSSL: Joi.boolean().required(),
    mongoSSL: Joi.boolean().required(),
    commBypassSSL: Joi.boolean().required(),
    enableSSL: Joi.boolean().required(),
    stompSSLEnabled: Joi.boolean().required(),
    id: Joi.string().required(),

  }),
};

module.exports = {
  createSetting,
  updateSetting,
};
