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
        attributes: {
            type: Array,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


// add plugin that converts mongoose to json
formSchema.plugin(toJSON);
const formsModel = mongoose.model('forms', formSchema);
module.exports = formsModel;
