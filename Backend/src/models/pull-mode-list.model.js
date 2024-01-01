const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { number } = require('@hapi/joi');

const pullModeListSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        agentSlaDuration: {
            type: Number,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: false,
    }
);


// add plugin that converts mongoose to json
pullModeListSchema.plugin(toJSON);
const PullModeList = mongoose.model('PullModeList', pullModeListSchema);
module.exports = PullModeList;
