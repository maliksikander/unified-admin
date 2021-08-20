// const authRoute = require('./auth.route');
// const docsRoute = require('./docs.route');
const express = require('express');
const amqSettingRoute = require('./amqSetting.route');
const databaseSettingRoute = require('./databaseSetting.route');
const displaySettingRoute = require('./displaySetting.route');
const localeSettingRoute = require('./localeSetting.route');
const logSettingRoute = require('./logSetting.route');
const reportSettingRoute = require('./reportSetting.route');
const securitySettingRoute = require('./securitySetting.route');
const formsRoute = require('./forms.route');
const loginRoute = require('./login.route');
const userRoute = require('./user.route');
const formValidationRoute = require('./formValidation.route');
const reasonRoute = require('./reason.route');
const pullModeRoute = require('./pull-mode-list.route');
const router = express.Router();

// router.use('/auth', authRoute);
// router.use('/docs', docsRoute);
router.use('/amq-setting', amqSettingRoute);
router.use('/database-setting', databaseSettingRoute);
router.use('/display-setting', displaySettingRoute);
router.use('/locale-setting', localeSettingRoute);
router.use('/log-setting', logSettingRoute);
router.use('/report-setting', reportSettingRoute);
router.use('/security-setting', securitySettingRoute);
router.use('/forms', formsRoute);
router.use('/formValidation', formValidationRoute);
router.use('/keycloakLogin', loginRoute);
router.use('/users', userRoute);
router.use('/reasons', reasonRoute);
router.use('/pull-mode-list', pullModeRoute);

module.exports = router;
