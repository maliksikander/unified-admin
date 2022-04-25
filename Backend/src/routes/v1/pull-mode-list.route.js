const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const pullModeListValidation = require('../../validations/pull-mode-list.validation');
const pullModeListController = require('../../controllers/pull-mode-list.controller');


router.get('/', pullModeListController.getPullModeLists);

router.get('/:listID', pullModeListController.getPullModeListByID);

router.put('/:listID', validate(pullModeListValidation.updatePullModeList), pullModeListController.updatePullModeList);

router.post('/', validate(pullModeListValidation.createPullModeList), pullModeListController.createPullModeList);

router.delete('/:listID', pullModeListController.deletePullModeList);

module.exports = router;