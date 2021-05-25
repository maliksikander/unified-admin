const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const formSchema = mongoose.Schema(
    {
        formTitle: {
            type: String,
            required: true,
        },
        formDescription: {
            type: String,
            required: false,
        },
        attributes: [
            {
                label: { type: String, required: true },
                helpText: { type: String },
                key: { type: String },
                valueType: { type: String, enum: ["IP", "Number", "Password", "PositiveNumber", "String2000", "String50", "String100", "URL", "AlphaNum100", "AlphanumSpecialChars200", "Boolean", "Email", "StringList"] },
                attributeType: { type: String, enum: ['INPUT', 'OPTIONS'] },
                isRequired: { type: Boolean },
                categoryOptions: { type: Object }
            },
        ],
    },
    {
        timestamps: true,
    }
);


// add plugin that converts mongoose to json
formSchema.plugin(toJSON);
const formsModel = mongoose.model('forms', formSchema);
module.exports = formsModel;
