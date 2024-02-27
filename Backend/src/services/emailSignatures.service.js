const httpStatus = require('http-status');
const { EmailSignaturesModel} = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');



const getSignatures = async (coId) => {
    const result = await EmailSignaturesModel.find();
    logger.info(`Get Signatute`, { className: "emailSignatures.service", methodName: "getSignatures" , CID: coId });
    logger.debug(`[DATA] %o` + result,  { className: "emailSignatures.service", methodName: "getSignatures", CID: coId });
    return result;
}

const getSignaturesByChannelIdentifier = async (channelIdentifier, coId) => {
    const result = await EmailSignaturesModel.find({ channelIdentifer: channelIdentifier });
    logger.info(`Get Signature by Channel Identifier`, { className: "emailSignatures.service", methodName: "getSignaturesByChannelIdentifier", CID: coId });
    logger.debug(`[DATA] %o` + result, { className: "emailSignatures.service", methodName: "getSignaturesByChannelIdentifier", CID: coId });
    return result;
};


const getSignatureByID = async(id,coId) => {

     if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const result = await EmailSignaturesModel.findById(id);
        if (!result) {
            logger.error(`[NOT_FOUND] Signature not found`, { 
                className: "emailSignatures.service", 
                methodName: "getSignatureByID", 
                CID: coId 
            });
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        logger.info(`Get Signature`, { 
            className: "emailSignatures.service", 
            methodName: "getSignatureByID" , 
            CID: coId 
        });
        logger.debug(`[DATA] %o` + result,  { 
            className: "emailSignatures.service", 
            methodName: "getSignatureByID", 
            CID: coId 
        });

        return result;
    }
    else {
        logger.error(`[BAD_REQUEST] Invalid Request Parameter`, { className: "emailSignatures.service", methodName: "getSignatureByID", CID: coId });
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }
}

const createSignature = async (reqBody,coId) => {
    const result = await EmailSignaturesModel.create(reqBody);
    logger.info(`Create Signatute`, { className: "emailSignatures.service", methodName: "createSignature" , CID: coId });
    logger.debug(`[DATA] %o` + result,  { className: "emailSignatures.service", methodName: "createSignature", CID: coId });
    return result;
};

const checkAlreadyExistingSignateNameOrIdentifier = async (signatureName, channelIdentifer, coId) => {
    try {
        // Use the Mongoose model to query the database
        const result = await EmailSignaturesModel.find({
            $or: [
                { signatureName: signatureName },
                { channelIdentifer: channelIdentifer }
            ]
        });

        // Log the result for debugging purposes
        logger.debug(`[DATA] %o` + result, { className: "emailSignatures.service", methodName: "getSignatureBySignatureNameOrChannelIdentifier", CID: coId });

        return result; // Return the result
    } catch (error) {
        // Log and handle the error
        logger.error(`[ERROR] on get signature by signatureName or channelIdentifer: %o` + error, { className: "emailSignatures.service", methodName: "getSignatureBySignatureNameOrChannelIdentifier", CID: coId });
        throw error; // Rethrow the error for the controller to handle
    }
};
const updateSignature = async(reqBody, coId) => {
    const id = reqBody.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {   //check for id format
        const result = await EmailSignaturesModel.findById(id);
        if (!result) {
            logger.error(`[NOT_FOUND] Email signature not found`, { className: "emailSignatures.service", methodName: "updateSignature", CID: coId });
            throw new ApiError(httpStatus.NOT_FOUND, 'Email signature not found');
        }

        Object.assign(result, reqBody);
        await result.save();
        logger.info(`Update Email signature`, { className: "emailSignatures.service", methodName: "updateSignature" , CID: coId });
        logger.debug(`[DATA] %o` + result,  { className: "emailSignatures.service", methodName: "updateSignature", CID: coId });
        return result;
    }
    else {
        logger.error(`[BAD_REQUEST] Invalid Request Parameter`, { className: "emailSignatures.service", methodName: "updateSignature", CID: coId });
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }
} 
const deleteSignature = async (id , coId) => {

    if (id.match(/^[0-9a-fA-F]{24}$/)) { //check for id format
        const result = await EmailSignaturesModel.findByIdAndDelete(id);
        if (!result) {
            logger.error(`[NOT_FOUND] Signature not found`, { className: "emailSignatures.service", methodName: "deleteSignature", CID: coId });
            throw new ApiError(httpStatus.NOT_FOUND, 'Signature not found');
        }
        logger.info(`Delete Signature`, { className: "emailSignatures.service", methodName: "deleteSignature", CID: coId  });
        logger.debug(`[DATA] %o` + result,  { className: "emailSignatures.service", methodName: "deleteSignature", CID: coId });
        return result;
    }
    else {
        logger.error(`[BAD_REQUEST] Invalid Request Parameter`, { className: "emailSignatures.service", methodName: "deleteSignature", CID: coId });
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Request Parameter');
    }

};

module.exports = {
    getSignatures,
    getSignaturesByChannelIdentifier,
    checkAlreadyExistingSignateNameOrIdentifier,
    getSignatureByID,
    createSignature,
    updateSignature,
    deleteSignature
};
