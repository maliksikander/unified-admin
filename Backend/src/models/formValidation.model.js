const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const formValidationSchema = mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
        },
        regex: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: false,
    }
);


// add plugin that converts mongoose to json
formValidationSchema.plugin(toJSON);
const formValidationModel = mongoose.model('formValidations', formValidationSchema);
module.exports = formValidationModel;
