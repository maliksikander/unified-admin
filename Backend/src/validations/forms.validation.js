const Joi = require('@hapi/joi');

const createForm = {
    body: Joi.object().keys({
        formTitle: Joi.string().max(500).required(),
        formDescription: Joi.string().allow('').max(500),
        attributes: Joi.array().unique((a, b) => a.label === b.label && a.key === b.key).items(
            Joi.object({
                label: Joi.string().required(),
                helpText: Joi.string().allow(''),
                key: Joi.string(),
                valueType: Joi.string().valid("IP", "Number", "Password", "PositiveNumber", "String2000", "String50", "String100", "URL", "Alphanum100", "AlphanumSpecial200", "Boolean", "Email", "StringList","PhoneNumber"),
                attributeType: Joi.string().valid('INPUT', 'OPTIONS'),
                isRequired: Joi.boolean().required(),
                categoryOptions: Joi.object().keys({
                    isMultipleChoice: Joi.boolean(),
                    categories: Joi.array().items(
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
                valueType: Joi.string().valid("IP", "Number", "Password", "PositiveNumber", "String2000", "String50", "String100", "URL", "Alphanum100", "AlphanumSpecial200", "Boolean", "Email", "StringList","PhoneNumber"),
                attributeType: Joi.string().valid('INPUT', 'OPTIONS'),
                isRequired: Joi.boolean(),
                categoryOptions: Joi.object().keys({
                    isMultipleChoice: Joi.boolean(),
                    categories: Joi.array().items(
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
