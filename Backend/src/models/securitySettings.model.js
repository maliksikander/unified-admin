const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const securitySettingSchema = mongoose.Schema(
  {
    certificatePath: {
      type: String,
      required: true,
      // trim: true,
    },
    certificateKeypath: {
      type: String,
      required: true,
      // trim: true,
    },
    certificatePassphrase: {
      type: String,
      required: true,
      // trim: true,
    },
    commBypassSSL: {
      type: Boolean,
      required: true,
      // trim: true,
    },
    corsOrigin: {
      type: String,
      required: true,
      // trim: true,
    },
    enableSSL: {
      type: Boolean,
      required: true,
      // trim: true,
    },
    certificateAuthorityPath: {
      type: String,
      required: true,
      // trim: true,
    },
    certificateAuthorityPassphrase: {
      type: String,
      required: true,
      // trim: true,
    },
    keystorePath: {
      type: String,
      required: true,
      // trim: true,
    },
    keystorePwd: {
      type: String,
      required: true,
      // trim: true,
    },
    truststorePath: {
      type: String,
      required: true,
      // trim: true,
    },
    truststorePwd: {
      type: String,
      required: true,
      // trim: true,
    },
    jksKeystorePath: {
      type: String,
      required: true,
      // trim: true,
    },
    jksKeystorePwd: {
      type: String,
      required: true,
      // trim: true,
    },
    jksKeymanagerPwd: {
      type: String,
      required: true,
      // trim: true,
    },
    stompSSLEnabled: {
      type: Boolean,
      required: true,
      // trim: true,
    },
    amqCertificatePath: {
      type: String,
      required: true,
      // trim: true,
    },
    amqCertificatePassphrase: {
      type: String,
      required: true,
      // trim: true,
    },
    minioSSL: {
      type: Boolean,
      required: true,
      // trim: true,
    },
    mongoSSL: {
      type: Boolean,
      required: true,
      // trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
securitySettingSchema.plugin(toJSON);
const SecuritySetting = mongoose.model('SecuritySetting', securitySettingSchema);
module.exports = SecuritySetting;
