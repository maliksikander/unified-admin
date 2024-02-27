const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const signatureSchema = mongoose.Schema(
    {
        signatureName: {
            type: String,
            required: true,
            unique: true
        },
        channelIdentifer: {
            type: String,
            required: true,
            unique:true
        },
        signatureBody: {
            type: String,
            required: true,
        },
    },{
        timestamps: true
    }
);


// add plugin that converts mongoose to json
signatureSchema.plugin(toJSON);
const signatuesModel = mongoose.model('emailSignatures', signatureSchema);
module.exports = signatuesModel;