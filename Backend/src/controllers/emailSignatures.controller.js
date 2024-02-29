const catchAsync = require('../utils/catchAsync');
const { emailSignaturesService } = require('../services');
const logger = require('../config/logger');
const { v4: uuidv4 } = require("uuid");

const getSignatures = catchAsync(async (req, res) => {

    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Get signatures`, { className: "emailSignatures.controller", methodName: "getSignatures", CID: coId });

        const channelIdentifier = req.query.channelIdentifer;
        let result;

        if (channelIdentifier) {

            result = await emailSignaturesService.getSignaturesByChannelIdentifier(channelIdentifier, coId);
            if (result.length === 0) {

                return res.status(404).json({
                    status: 404,
                    message: `Email Signature Not Found against channel Identifer: ${channelIdentifier}`,
                    response: []
                });
            }

        } else {

            result = await emailSignaturesService.getSignatures(coId);
        }

        if (result.length === 0) {

            res.status(404).json({
                status: 404,
                message: "No signatures found.",
                response: []
            });
        } else {

            res.status(200).json({
                status: 200,
                message: "OK",
                response: result
            });
        }
    } catch (error) {
        logger.error(`[ERROR] on get email signatures api: %o` + error, { className: "emailSignatures.controller", methodName: "getSignatures", CID: coId });
    }
});

const getSignatureByID = catchAsync(async (req, res) => {
    
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);

    try {
        logger.info(`Get email signature by id`, { className: "emailSignatures.controller", methodName: "getSignatureByID", CID: coId });
        logger.debug(`[REQUEST] %o` + req, { className: "emailSignatures.controller", methodName: "getSignatureByID", CID: coId });

        const id = req.params.signatureId;
        const result = await emailSignaturesService.getSignatureByID(id, coId);

        if (result.length === 0) {

            res.status(404).json({
                status: 404,
                message: `Email Signature not found with this Id ${id}`,
                response: null
            });
        } else {

            res.status(200).json({
                status: 200,
                message: "OK",
                response: result
            });
        }

    } catch (error) {
        logger.error(`[ERROR] on get email signature by id api: %o` + error, { className: "emailSignatures.controller", methodName: "getSignatureByID", CID: coId });
    }
});


const createSignature = catchAsync(async (req, res) => {
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Create emailSignature`, { className: "emailSignature.controller", methodName: "createSignature", CID: coId });
        logger.debug(`[REQUEST] : %o` + req, { className: "emailSignature.controller", methodName: "createSignature", CID: coId });

        const result = await emailSignaturesService.createSignature(req.body, coId);

        res.status(200).json({
            status: 200,
            message: "CREATED",
            response: result
        });
    } catch (error) {
        // Handle duplicate key error for unique constraint violation
        if (error.code === 11000 || error.code === 11001) {

            const errorMessage = getErrorMessageFromDuplicateKeyError(error);

            logger.error(`[ERROR] on Creating Email Signature: ${error}`, {
                className: "emailSignature.controller",
                methodName: "createSignature",
                CID: coId
            });


            res.status(409).json({
                status: 409,
                message: errorMessage,
                response: null
            });
        } else {
            
            logger.error(`[ERROR] on creating Email Signature: %o` + error, { 
                className: "emailSignature.controller", 
                methodName: "createSignature", 
                CID: coId 
            });

            res.status(500).json({
                status: 500,
                message: "Internal Server Error",
                response: null
            });
        }
    }
});

const updateSignature = catchAsync(async (req, res) => {

    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    try {
        logger.info(`Update email signature`, { className: "emailSignature.controller", methodName: "updateSignature", CID: coId });
        logger.info(`[REQUEST] : %o` + req.body, { className: "emailSignature.controller", methodName: "updateSignature", CID: coId });


           const result = await emailSignaturesService.updateSignature(req.body, coId);
           res.status(200).json({
            status: 200,
            message: "Signature Updated Successfully",
            response: result
        });
    } catch (error) {
        logger.error(`[ERROR] on update email signature: %o` + error, { className: "emailSignature.controller", methodName: "updateSignature", CID: coId });
        const errorMessage = getErrorMessageFromDuplicateKeyError(error);

        logger.error(`[ERROR] on Updating Email Signature: ${error}`, {
            className: "emailSignature.controller",
            methodName: "updateSignature",
            CID: coId
        });


        res.status(409).json({
            status: 409,
            message: errorMessage,
            response: null
        });
    }
});

function getErrorMessageFromDuplicateKeyError(error) {
    if (error.keyValue) {
        if (error.keyValue.signatureName) {
            return `Conflict - Signature already exists with name : ${error.keyValue.signatureName}`;
        } else if (error.keyValue.channelIdentifer) {
            return `Conflict - Signature already exists against this channel Identifer : ${error.keyValue.channelIdentifer}`;
        }
    }
    
    return "Conflict - Duplicate key violation";
}


const deleteSignature = catchAsync(async (req, res) => {
    const coId = req.header("correlationId".toLowerCase()) ? req.header("correlationId".toLowerCase()) : uuidv4();
    res.setHeader("correlationId", coId);
    const response = {
        statusCode: "204",
        message: "Signature deleted successfully",
        response: null
    };
    const id = req.params.signatureId
    const result = await emailSignaturesService.deleteSignature(id,coId);
    if (result._id) {
        logger.info(`${response.message}`, { className: "emailSignatures.controller", methodName: "deleteSignature", CID: coId });
        logger.debug(`[REQUEST] : %o` + response, { className: "emailSignatures.controller", methodName: "deleteSignature", CID: coId });
        res.send(response);
    }
    else {
        logger.info(`${response.message}`, { className: "emailSignatures.controller", methodName: "deleteSignature", CID: coId });
        logger.debug(`[REQUEST] : %o` + response, { className: "emailSignatures.controller", methodName: "deleteSignature", CID: coId });
        res.send(result);
    }
});


module.exports = {
    getSignatures,
    getSignatureByID,
    createSignature,
    updateSignature,
    deleteSignature
};
