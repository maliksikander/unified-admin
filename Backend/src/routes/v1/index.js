const express = require('express');
// const authRoute = require('./auth.route');
// const userRoute = require('./user.route');
// const docsRoute = require('./docs.route');
const amqSettingRoute = require('./amqSetting.route');
const databaseSettingRoute = require('./databaseSetting.route');
const displaySettingRoute = require('./displaySetting.route');
const localeSettingRoute = require('./localeSetting.route');
const logSettingRoute = require('./logSetting.route');
const reportSettingRoute = require('./reportSetting.route');
const securitySettingRoute = require('./securitySetting.route');
// const angularRoute = require('../../angular.route');

const router = express.Router();

// router.use('/auth', authRoute);
// router.use('/users', userRoute);
// router.use('/docs', docsRoute);
router.use('/amq-setting', amqSettingRoute);
router.use('/database-setting', databaseSettingRoute);
router.use('/display-setting', displaySettingRoute);
router.use('/locale-setting', localeSettingRoute);
router.use('/log-setting', logSettingRoute);
router.use('/report-setting', reportSettingRoute);
router.use('/security-setting', securitySettingRoute);

// router.use('/amq-settings', angularRoute);
////
// angularRouter.use('/amq-settings', angularRoutes);

module.exports = router;
