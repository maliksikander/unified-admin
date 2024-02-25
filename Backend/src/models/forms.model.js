const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const formSchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        formType: {
            type: String,
            enum: ['Questionnaire', 'Survey', 'Wrap-up', 'Pre-chat', 'Other'],
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
        enableSection: {
            type: Boolean,
        },
        enableWeightage: {
            type: Boolean,
        },
        activeVersion: {
            type: String,
            required: true,
        },
        versions: [
            {
                v1: {
                    status: {
                        type: String,
                        enum: ['published', 'unpublished', 'draft']
                    },
                    createdAt: {
                        type: String,
                        required: true,
                    },
                    section: [
                        {
                            sectionId: {
                                type: String,
                                required: true,
                            },
                            sectionName: {
                                type: String,
                                required: true,
                            },
                            sectionWeightage: {
                                type: Number,
                                required: false,
                            },
                            attributes: [
                                {
                                    label: { type: String, required: true },
                                    helpText: { type: String },
                                    key: { type: String },
                                    valueType: { type: String, enum: ["alphaNumeric", "alphaNumericSpecial", "email", "number", "password", "positiveNumber", "url", "phoneNumber", "date", "time", "dateTime", "shortAnswer", "file", "paragraph", "boolean", "mcq", "checkbox", "dropdown", "rating", "nps"] },
                                    attributeType: { type: String, enum: ['INPUT', 'OPTIONS', 'TEXTAREA'] },
                                    isRequired: { type: Boolean },
                                    enableEmoji: { type: Boolean, default: false },
                                    attributeWeightage: { type: Number, default: null },
                                    enableCategory: { type: Boolean, default: false },
                                    allowMultipleSelect: { type: Boolean, default: false },
                                    allowOther: { type: Boolean, default: false },
                                    attributeOptions: { type: Object }
                                },
                            ],
                        }
                    ]
                }
            }
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
