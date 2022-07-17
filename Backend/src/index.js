const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const https = require('https');
const fs = require('fs');

const { FormsModel, FormValidationModel } = require('./models');

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
    if (form == null) await FormsModel.create(reqBody);
  }
  catch (e) {
    logger.error(`Default Wrap Up Form Validation Error:" ${e}`)
  }
}