const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

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
