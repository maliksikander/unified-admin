const Joi = require('@hapi/joi');

const createSecuritySetting = {
  body: Joi.object().keys({
    certificatePath: Joi.string().required(),
    certificateKeypath: Joi.string().required(),
    certificatePassphrase: Joi.string().required(),
    commBypassSSL: Joi.boolean().required(),
    corsOrigin: Joi.string().required(),
    enableSSL: Joi.boolean().required(),
    certificateAuthorityPath: Joi.string().required(),
    certificateAuthorityPassphrase: Joi.string().required(),
    keystorePath: Joi.string().required(),
    keystorePwd: Joi.string().required(),
    truststorePath: Joi.string().required(),
    truststorePwd: Joi.string().required(),
    jksKeystorePath: Joi.string().required(),
    jksKeystorePwd: Joi.string().required(),
    jksKeymanagerPwd: Joi.string().required(),
    stompSSLEnabled: Joi.boolean().required(),
    amqCertificatePath: Joi.string().required(),
    amqCertificatePassphrase: Joi.string().required(),
    minioSSL: Joi.boolean().required(),
    mongoSSL: Joi.boolean().required(),
  }),
};
const updateSecuritySetting = {
  body: Joi.object().keys({
    certificatePath: Joi.string().required(),
    certificateKeypath: Joi.string().required(),
    certificatePassphrase: Joi.string().required(),
    commBypassSSL: Joi.boolean().required(),
    corsOrigin: Joi.string().required(),
    enableSSL: Joi.boolean().required(),
    certificateAuthorityPath: Joi.string().required(),
    certificateAuthorityPassphrase: Joi.string().required(),
    keystorePath: Joi.string().required(),
    keystorePwd: Joi.string().required(),
    truststorePath: Joi.string().required(),
    truststorePwd: Joi.string().required(),
    jksKeystorePath: Joi.string().required(),
    jksKeystorePwd: Joi.string().required(),
    jksKeymanagerPwd: Joi.string().required(),
    stompSSLEnabled: Joi.boolean().required(),
    amqCertificatePath: Joi.string().required(),
    amqCertificatePassphrase: Joi.string().required(),
    minioSSL: Joi.boolean().required(),
    mongoSSL: Joi.boolean().required(),
    id: Joi.string().required(),
  }),
};

module.exports = {
  createSecuritySetting,
  updateSecuritySetting,
};
