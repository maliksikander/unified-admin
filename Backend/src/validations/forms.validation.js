const Joi = require('@hapi/joi');

const createForm = {
    body: Joi.object().keys({
        formType: Joi.string().valid('Questionnaire', 'Survey', 'Wrap-up', 'Pre-conversation', 'Default'),
        formTitle: Joi.string().max(500).required(),
        formDescription: Joi.string().allow('').max(500),
        enableSections: Joi.boolean().required(),
        enableWeightage: Joi.boolean().required(),
        sections: Joi.array().unique((a, b) => a.label === b.label && a.key === b.key).items(
            Joi.object({
                sectionName: Joi.string().required(),
                sectionKey: Joi.string().required(),
                sectionWeightage: Joi.number(),
                attributes: Joi.array().unique((a, b) => a.label === b.label && a.key === b.key).items(
                    Joi.object({
                        attributeType: Joi.string().valid('INPUT', 'OPTIONS', 'TEXTAREA'),
                        valueType: Joi.string().valid("alphaNumeric", "alphaNumericSpecial", "email", "number", "password", "positiveNumber", "url", "phoneNumber", "date", "time", "dateTime", "shortAnswer", "file", "paragraph", "boolean", "mcq", "checkbox", "dropdown", "rating", "nps"),
                        label: Joi.string().required(),
                        key: Joi.string(),
                        isRequired: Joi.boolean().required(),
                        helpText: Joi.string().allow(''),
                        enableEmojis: Joi.boolean(),
                        attributeWeightage: Joi.number(),
                        allowOther: Joi.boolean(),
                        otherInput: Joi.object({
                            attributeType: Joi.string().valid('INPUT', 'OPTIONS', 'TEXTAREA'),
                            valueType: Joi.string().valid("alphaNumeric", "alphaNumericSpecial", "email", "number", "password", "positiveNumber", "url", "phoneNumber", "date", "time", "dateTime", "shortAnswer", "file", "paragraph", "boolean", "mcq", "checkbox", "dropdown", "rating", "nps"),
                            label: Joi.string().required(),
                            key: Joi.string(),
                            isRequired: Joi.boolean().required(),
                            helpText: Joi.string().allow(''),
                        }),
                        fileData: Joi.object({
                            restrictFile: Joi.boolean(),
                            fileExtensions: Joi.array().items(Joi.string()).required(),
                            fileNumber: Joi.number(),
                            fileSize: Joi.number(),
                            destinationFolder: Joi.string(),
                        }),
                        ratingData: Joi.object({
                            ratingType: Joi.string(),
                            minValue: Joi.number(),
                            maxValue: Joi.number(),
                            reverseOrder: Joi.boolean(),
                        }),
                        attributeOptions: Joi.object({
                            enableCategory: Joi.boolean(),
                            allowMultipleSelect: Joi.boolean(),
                            categories: Joi.array().unique((a, b) => a.label == b.label).items(
                                Joi.object({
                                    label: Joi.string().required(),
                                    values: Joi.array().unique((a, b) => a.label == b.label).items(
                                        Joi.object({
                                            label: Joi.string().required(),
                                            value: Joi.string(),
                                            color: Joi.string(),
                                            emoji: Joi.string().allow(''),
                                            emojiStyle: Joi.string().valid('filled', 'outline'),
                                            weightage: Joi.string(),
                                        })
                                    ),
                                })
                            )
                        })
                    })
                )
            })
        )
    }),
};

const updateForm = {
    body: Joi.object().keys({
        id: Joi.string().required(),
        formTitle: Joi.string().max(500).required(),
        formDescription: Joi.string().allow('').max(500),
        attributes: Joi.array().unique((a, b) => a.label === b.label && a.key === b.key).items(
            Joi.object({
                _id: Joi.string(),
                label: Joi.string().required(),
                helpText: Joi.string().allow(''),
                key: Joi.string(),
                valueType: Joi.string().valid("Alphanum100", "AlphanumSpecial200", "Boolean", "Email", "IP", "Number", "Password", "PhoneNumber", "PositiveNumber", "String50", "String100", "String2000", "StringList", "URL"),
                attributeType: Joi.string().valid('INPUT', 'OPTIONS'),
                isRequired: Joi.boolean(),
                categoryOptions: Joi.object().keys({
                    isMultipleChoice: Joi.boolean(),
                    categories: Joi.array().unique((a, b) => a.categoryName == b.categoryName).items(
                        Joi.object({
                            categoryName: Joi.string().required(),
                            values: Joi.array().items(Joi.string()).required(),
                        })
                    )
                })
            })
        )
    }),
};

module.exports = {
    createForm,
    updateForm,
};
