const dotenv = require('dotenv');
const path = require('path');
const Joi = require('@hapi/joi');
// const panelEnv = require('')
dotenv.config({ path: path.join(__dirname, '../../adminPanel.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000).description('Port'),
    isSSL: Joi.boolean().default(false).required().description('HTTPS Flag'),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    LOG_LEVEL: Joi.string().required().description('LOG LEVEL'),
    HTTPS_KEY_PATH: Joi.string().description('HTTPs Key Path'),
    HTTPS_CERTIFICATE_PATH: Joi.string().description('HTTPs Cartificate Path'),
    HTTPS_CERTIFICATE_PASSPHRASE: Joi.string().allow("").description('HTTPs Passphrase'),
    // JWT_SECRET: Joi.string().required().description('JWT secret key'),
    // JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    // JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    // SMTP_HOST: Joi.string().description('server that will send the emails'),
    // SMTP_PORT: Joi.number().description('port to connect to the email server'),
    // SMTP_USERNAME: Joi.string().description('username for email server'),
    // SMTP_PASSWORD: Joi.string().description('password for email server'),
    // EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  Port: envVars.PORT,
  isSSL: envVars.isSSL,
  logLevel: envVars.LOG_LEVEL,
  httpsKeyPath: envVars.HTTPS_KEY_PATH,
  httpsCertPath: envVars.HTTPS_CERTIFICATE_PATH,
  httpsCertPassphrase: envVars.HTTPS_CERTIFICATE_PASSPHRASE,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  // jwt: {
  //   secret: envVars.JWT_SECRET,
  //   accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  //   refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  //   resetPasswordExpirationMinutes: 10,
  // },
  // email: {
  //   smtp: {
  //     host: envVars.SMTP_HOST,
  //     port: envVars.SMTP_PORT,
  //     auth: {
  //       user: envVars.SMTP_USERNAME,
  //       pass: envVars.SMTP_PASSWORD,
  //     },
  //   },
  //   from: envVars.EMAIL_FROM,
  // },
};
