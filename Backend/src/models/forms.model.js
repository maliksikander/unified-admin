const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const formSchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
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
                valueType: { type: String, enum: ["Alphanum100", "AlphanumSpecial200", "Boolean", "Email", "IP", "Number", "Password", "PhoneNumber", "PositiveNumber", "String50", "String100", "String2000", "StringList", "URL"] },
                attributeType: { type: String, enum: ['INPUT', 'OPTIONS'] },
                isRequired: { type: Boolean },
                categoryOptions: { type: Object }
            },
        ],
    },
    {
        timestamps: true
    }
);


// add plugin that converts mongoose to json
formSchema.plugin(toJSON);
const formsModel = mongoose.model('forms', formSchema);
module.exports = formsModel;
