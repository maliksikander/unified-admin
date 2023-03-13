const logger = require("../config/logger");
const { v4: uuidv4 } = require("uuid");

const logLevels = ["debug", "info", "error"];
const updateLogLevel = async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  if (!req.params.level) {
    logger.error("Missing Log Level in request", { className: "logLevel.controller", methodName: "updateLogLevel", CID: coId });

    return res.status(400).json({ msg: "Log level Missing" });
  }
  if (logLevels.includes(req.params.level.toLowerCase())) {
    try {
      logger.level = req.params.level.toLowerCase();
      logger.info("Log level changed to " + req.params.level, { className: "logLevel.controller", methodName: "updateLogLevel", CID: coId });
      return res.status(200).json({ msg: "log level updated to: " + req.params.level });
    } catch (err) {
      logger.error("[ERROR Changing Log level] " + err, { className: "logLevel.controller", methodName: "updateLogLevel", CID: coId });
      return res.status(304).json({ status: 304, message: "Error updating Log Level to: " + req.params.level, error: err });
    }
  } else {
    logger.error(`log level ${req.params.level} is not in the defined list of log levels [${logLevels}]`, {
      className: "logLevel.controller",
      methodName: "updateLogLevel",
      CID: coId
    });
    return res.status(400).json({ msg: `log level ${req.params.level} is not in the defined list of log levels [${logLevels}]` });
  }
};

module.exports = { updateLogLevel };
