const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const https = require('https');
const fs = require('fs');

const { FormsModel, FormValidationModel, ReasonCodeModel, LocaleSetting } = require('./models');

let server;
const keyPath = config.httpsKeyPath ? config.httpsKeyPath : "httpsFiles/server.key";
const certPath = config.httpsCertPath ? config.httpsCertPath : "httpsFiles/server.cert";
const certPassphrase = config.httpsCertPassphrase ? config.httpsCertPassphrase : "";
const httpsKey = fs.readFileSync(keyPath, 'utf8');
const httpsCert = fs.readFileSync(certPath, 'utf8');
const httpsCredentials = {
  key: httpsKey,
  cert: httpsCert,
  passphrase: certPassphrase
};

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');


  onAppInitializtion();

  if (config.isSSL == true) {
    server = https.createServer(httpsCredentials, app).listen(config.Port, () => {
      logger.info(`Listening to port ${config.Port} on https`);
    });
  }
  else {
    server = app.listen(config.Port, () => {
      logger.info(`Listening to port ${config.Port} on http`);
    });
  }


}).catch(error => logger.error('DB connection Error:', error));

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  }
  else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) { server.close(); }
});

function onAppInitializtion() {
  addFormValidations();
  addWrapUpForm();
  addDefaultReasonCode();
  addDefaultLocaleSetting();
}

async function addFormValidations() {

  try {
    const res = await FormValidationModel.bulkWrite([
      {
        updateOne: {
          filter: { type: 'Alphanum100' },
          update: { regex: "%5Ba-zA-Z0-9%20%5D%7B1,100%7D$" },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { type: 'AlphanumSpecial200' },
          update: { regex: "%5B%20A-Za-z0-9_@.,;:%60~=*'%25$!%5E/#&+()?%7B%7D%3E&lt;%7C-%5D%7B0,200%7D$" },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { type: 'Boolean' },
          update: { regex: "(true%7Cfalse%7C1%7C0)$" },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { type: 'Email' },
          update: { regex: "%5Ba-zA-Z0-9.!#$%25&%E2%80%99*+/=?%5E_%60%7B%7C%7D~-%5D+@%5Ba-zA-Z0-9-%5D+(?:.%5Ba-zA-Z0-9-%5D+)*$" },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { type: 'IP' },
          update: { regex: "((%5Es*(((%5B0-9%5D%7C%5B1-9%5D%5B0-9%5D%7C1%5B0-9%5D%7B2%7D%7C2%5B0-4%5D%5B0-9%5D%7C25%5B0-5%5D).)%7B3%7D(%5B0-9%5D%7C%5B1-9%5D%5B0-9%5D%7C1%5B0-9%5D%7B2%7D%7C2%5B0-4%5D%5B0-9%5D%7C25%5B0-5%5D))s*$)%7C(%5Es*(((%5B0-9A-Fa-f%5D%7B1,4%7D:)%7B7%7D(%5B0-9A-Fa-f%5D%7B1,4%7D%7C:))%7C((%5B0-9A-Fa-f%5D%7B1,4%7D:)%7B6%7D(:%5B0-9A-Fa-f%5D%7B1,4%7D%7C((25%5B0-5%5D%7C2%5B0-4%5Dd%7C1dd%7C%5B1-9%5D?d)(.(25%5B0-5%5D%7C2%5B0-4%5Dd%7C1dd%7C%5B1-9%5D?d))%7B3%7D)%7C:))%7C((%5B0-9A-Fa-f%5D%7B1,4%7D:)%7B5%7D(((:%5B0-9A-Fa-f%5D%7B1,4%7D)%7B1,2%7D)%7C:((25%5B0-5%5D%7C2%5B0-4%5Dd%7C1dd%7C%5B1-9%5D?d)(.(25%5B0-5%5D%7C2%5B0-4%5Dd%7C1dd%7C%5B1-9%5D?d))%7B3%7D)%7C:))%7C((%5B0-9A-Fa-f%5D%7B1,4%7D:)%7B4%7D(((:%5B0-9A-Fa-f%5D%7B1,4%7D)%7B1,3%7D)%7C((:%5B0-9A-Fa-f%5D%7B1,4%7D)?:((25%5B0-5%5D%7C2%5B0-4%5Dd%7C1dd%7C%5B1-9%5D?d)(.(25%5B0-5%5D%7C2%5B0-4%5Dd%7C1dd%7C%5B1-9%5D?d))%7B3%7D))%7C:))%7C((%5B0-9A-Fa-f%5D%7B1,4%7D:)%7B3%7D(((:%5B0-9A-Fa-f%5D%7B1,4%7D)%7B1,4%7D)%7C((:%5B0-9A-Fa-f%5D%7B1,4%7D)%7B0,2%7D:((25%5B0-5%5D%7C2%5B0-4%5Dd%7C1dd%7C%5B1-9%5D?d)(.(25%5B0-5%5D%7C2%5B0-4%5Dd%7C1dd%7C%5B1-9%5D?d))%7B3%7D))%7C:))%7C((%5B0-9A-Fa-f%5D%7B1,4%7D:)%7B2%7D(((:%5B0-9A-Fa-f%5D%7B1,4%7D)%7B1,5%7D)%7C((:%5B0-9A-Fa-f%5D%7B1,4%7D)%7B0,3%7D:((25%5B0-5%5D%7C2%5B0-4%5Dd%7C1dd%7C%5B1-9%5D?d)(.(25%5B0-5%5D%7C2%5B0-4%5Dd%7C1dd%7C%5B1-9%5D?d))%7B3%7D))%7C:))%7C((%5B0-9A-Fa-f%5D%7B1,4%7D:)%7B1%7D(((:%5B0-9A-Fa-f%5D%7B1,4%7D)%7B1,6%7D)%7C((:%5B0-9A-Fa-f%5D%7B1,4%7D)%7B0,4%7D:((25%5B0-5%5D%7C2%5B0-4%5Dd%7C1dd%7C%5B1-9%5D?d)(.(25%5B0-5%5D%7C2%5B0-4%5Dd%7C1dd%7C%5B1-9%5D?d))%7B3%7D))%7C:))%7C(:(((:%5B0-9A-Fa-f%5D%7B1,4%7D)%7B1,7%7D)%7C((:%5B0-9A-Fa-f%5D%7B1,4%7D)%7B0,5%7D:((25%5B0-5%5D%7C2%5B0-4%5Dd%7C1dd%7C%5B1-9%5D?d)(.(25%5B0-5%5D%7C2%5B0-4%5Dd%7C1dd%7C%5B1-9%5D?d))%7B3%7D))%7C:)))(%25.+)?s*$))" },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { type: 'Number' },
          update: { regex: "%5B-+0-9.%5D+$" },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { type: 'Password' },
          update: { regex: "(?=.*%5Ba-z%5D)(?=.*%5BA-Z%5D)(?=.*%5B0-9%5D)%5B%20a-zA-Z0-9%5D%7B8,256%7D" },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { type: 'PositiveNumber' },
          update: { regex: '%5B+%5D?%5B0-9%5D*(%5C.%5B0-9%5D+)?$' },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { type: 'PhoneNumber' },
          update: { regex: "%5B+%5D?(%5B0-9%5D+(?:%5B.%5D%5B0-9%5D*)?%7C.%5B0-9%5D+)$" },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { type: 'String50' },
          update: { regex: ".%7B1,50%7D$" },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { type: 'String100' },
          update: { regex: ".%7B1,100%7D$" },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { type: 'String2000' },
          update: { regex: ".%7B1,2000%7D$" },
          upsert: true
        }
      },
      {
        updateOne: {
          filter: { type: 'URL' },
          update: { regex: "(((%5BA-Za-z%5D%7B2,9%7D:(?:%5C/%5C/)?)(?:%5B%5C-;:&=%5C+%5C$,%5Cw%5D+@)?%5BA-Za-z0-9%5C.%5C-%5D+%7C(?:www%5C.%7C%5B%5C-;:&=%5C+%5C$,%5Cw%5D+@)%5BA-Za-z0-9%5C.%5C-%5D+)((?:%5C/%5B%5C+~%25%5C/%5C.%5Cw%5C-_%5D*)?%5C??(?:%5B%5C-%5C+=&;%25@%5C.%5Cw_%5D*)#?(?:%5B%5C.%5C!%5C/%5C%5C%5Cw%5D*))?)" },
          upsert: true
        }
      },
    ]);
    logger.info(`Form Validation Document Added: ${res.upsertedCount}`);
    logger.info(`Form Validation Document Modified: ${res.modifiedCount}`);
  }

  catch (e) {
    logger.error(`Default Form Validation Error:" ${e}`)
  }
}

async function addWrapUpForm() {

  try {

    let reqBody = {
      _id: mongoose.Types.ObjectId("62d07f4f0980a50a91210bef"),
      formTitle: "WrapUp",
      formDescription: "Wrap Up Form",
      attributes: [
        {
          attributeType: "OPTIONS",
          helpText: "",
          isRequired: true,
          key: "New_Attribute",
          label: "New Attribute",
          valueType: "StringList",
          categoryOptions: {
            isMultipleChoice: true,
            categories: [
              {
                categoryName: "Category1",
                values: [
                  "Option1"
                ]
              }
            ]
          }
        }
      ],
    }

    const form = await FormsModel.findById("62d07f4f0980a50a91210bef");
    if (form == null) {
      await FormsModel.create(reqBody);
      logger.info(`Default Wrap Up Form Added`)
    }
  }
  catch (e) {
    logger.error(`Default Wrap Up Form Validation Error:" ${e}`)
  }
}

async function addDefaultReasonCode() {

  try {
    let reqBody = [
      {
        _id: mongoose.Types.ObjectId("62ffc95cf12b6ccf1594d781"),
        description: "A default log out reason code",
        label: "Out Of Office",
        type: "LOG_OUT",
      },
      {
        _id: mongoose.Types.ObjectId("62ffc9e9f12b6ccf1594d88b"),
        description: "A default not ready reason code",
        label: "Short Break",
        type: "NOT_READY",
      }
    ];

    reqBody.forEach(async (item) => {
      const reasonCode = await ReasonCodeModel.findById(item._id);
      if (reasonCode == null) {
        await ReasonCodeModel.create(item);
        logger.info(`Default Reason Code Added`);

      }
    });

  }

  catch (e) {
    logger.error(`Default Reason Code Error:" ${e}`)
  }
}

async function addDefaultLocaleSetting() {

  try {
    let reqBody =
    {

      timezone: {
        name: "UTC",
        id: 589
      },
      defaultLanguage: {
        code: "en",
        name: "English",
        flag: "data:image/png;base64,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"
      },
      supportedLanguages: [
        {
          code: "en",
          name: "English",
          flag: "data:image/png;base64,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"
        }
      ]

    };

    const localeSetting = await LocaleSetting.find();
    if (localeSetting && localeSetting.length == 0) {
      await LocaleSetting.create(reqBody);
      logger.info(`Default Locale Setting Added`);
    }
  }
  catch (e) {
    logger.error(`Default Locale Setting Error:" ${e}`)
  }
}
