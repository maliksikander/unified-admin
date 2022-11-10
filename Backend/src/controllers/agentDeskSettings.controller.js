const catchAsync = require('../utils/catchAsync');
const { agentDeskSettingsService } = require('../services');
const logger = require('../config/logger');
const { v4: uuidv4 } = require("uuid");

const getSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Get agent desk setting`, { className: "agentDeskSettings.controller", methodName: "getSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req, { className: "agentDeskSettings.controller", methodName: "getSettings", CID: coId });

    const result = await agentDeskSettingsService.getSettings(coId);
    res.send(result);

  } catch (error) {
    logger.error(`[ERROR] on agent desk setting api: ` + error , { className: "agentDeskSettings.controller", methodName: "getSettings", CID: coId });
  }
});



const updateSettings = catchAsync(async (req, res) => {
  const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
  res.setHeader("correlationId", coId);
  try {
    logger.info(`Update agent desk setting`, { className: "agentDeskSettings.controller", methodName: "updateSettings", CID: coId });
    logger.debug(`[REQUEST] : %o` + req.body, { className: "agentDeskSettings.controller", methodName: "updateSettings", CID: coId });

    const result = await agentDeskSettingsService.updateSettings(req.body,coId);
    res.send(result);
  } catch (error) {
    logger.error(`[ERROR] on update agent desk settings api: %o` + error, { className: "agentDeskSettings.controller", methodName: "updateSettings", CID: coId });
  } 
});

module.exports = {
  getSettings,
  updateSettings,
};
