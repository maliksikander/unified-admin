const {
  HealthcheckerDetailedCheck,
} = require("nodejs-health-checker/dist/healthchecker/healthchecker");
const { HealthTypes } = require("nodejs-health-checker/dist/interfaces/types");
const nodeOS = require("node-os-utils");
const os = require("os");
const logger = require("../config/logger");

const checkDiskSpace = require("check-disk-space").default;
const mongoose = require("mongoose");
const config = require("../config/config");
function restructure(result) {
  result.status ? (result.status = "UP") : (result.status = "DOWN");
  result.integrations.forEach((integration) => {
    if (integration.name == "selfCheck") {
      integration.details = {};
      integration.details.utilisedDiskSpace =
        integration.status.utilisedDiskSpace;

      integration.details.utilisedMemory = integration.status.utilisedMemory;
      delete integration.status.utilisedMemory;
      delete integration.status.utilisedDiskSpace;
      integration.status = integration.status.status;
    }
  });
  result.components = result.integrations;
  delete result.integrations;
  function changeStatus(result) {
    result.status ? (result.status = "UP") : (result.status = "DOWN");
    delete result.name;
    return result;
  }
  result.components = result.components.reduce(
    (obj, item) => ((obj[item.name] = changeStatus(item)), obj),
    {}
  );
  return result;
}
const checkHealth = async (req, res) => {
  let result = await HealthcheckerDetailedCheck({
    name: "unified-admin-backend",
    version: "v1.0.0",
    integrations: [
      {
        type: HealthTypes.Custom,
        name: "mongo",
        host: config.mongoose.url,
        customCheckerFunction: () => {
          logger.info("custom checker function started for mongoDB", {
            className: "healthCheck.service",
            methodName: "customCheckerFunction",
          });
          return new Promise(async (resolve, reject) => {
            try {
              const db = await mongoose.createConnection(
                config.mongoose.url,
                config.mongoose.options
              );
              db.close(true).then(() => {
                logger.info("mongo Connection closed successfullly ", {
                  className: "healthCheck.service",
                  methodName: "customCheckerFunction",
                });
              });
            } catch (err) {
              console.error(
                "Error occured in mongodb connect " + JSON.stringify(err),
                {
                  className: "healthCheck.service",
                  methodName: "customCheckerFunction",
                }
              );
              return reject(err);
            }
            logger.info("MongoDB Conected successfully", {
              className: "healthCheck.service",
              methodName: "customCheckerFunction",
            });
            return resolve({ status: true, error: null });
          });
        },
      },
      {
        type: HealthTypes.Custom,
        name: "selfCheck",
        host: "unified-admin-backend",
        customCheckerFunction: async () => {
          let stats;
          logger.info("custom checker function started for self-check", {
            className: "healthCheck.service",
            methodName: "customCheckerFunction",
          });
          return new Promise(async (resolve, reject) => {
            try {
              let utilisedDiskSpace;
              //for windows we are checking disk space for C only cz windows has disks
              //the spaces are in MBs
              await checkDiskSpace(
                os.platform().toLowerCase().includes("win") ? "C:" : "/"
              ).then((diskSpace) => {
                utilisedDiskSpace = diskSpace.size - diskSpace.free;
              });
              let utilisedMemory = await nodeOS.mem.used();
              stats = {
                status: true,
                utilisedMemory: Math.round(utilisedMemory.usedMemMb),
                utilisedDiskSpace: Math.round(utilisedDiskSpace / 1000000),
              };
            } catch (err) {
              console.error(
                "Error occured in custom checker function ",
                JSON.stringify(err)
              );
              return reject(err);
            }
            logger.info(
              "Custom checker resolved successfully sending statistics " +
                JSON.stringify(stats),
              {
                className: "healthCheck.controller",
                methodName: "customCheckerFunction",
              }
            );
            resolve({
              status: stats,
              error: null,
            });
          });
        },
      },
    ],
  });
  result = restructure(result);
  return result;
};
module.exports = { checkHealth };
