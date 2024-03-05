const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const signatureSchema = mongoose.Schema(
    {
        responseName: {
            type: String,
            required: true,
            unique: true
        },
        channelIdentifier: {
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
const emailAutoResponsesModel = mongoose.model('emailAutoResponses', signatureSchema);
module.exports = emailAutoResponsesModel;