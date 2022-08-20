const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
var autoIncrement = require('mongoose-auto-increment');
const config = require('../config/config');
var connection = mongoose.createConnection(config.mongoose.url);
autoIncrement.initialize(connection);

const reasonCodeSchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            required: true,
            enum: ['LOG_OUT', 'NOT_READY']
        }
    },
    {
        timestamps: false,
    }
);

reasonCodeSchema.plugin(autoIncrement.plugin, {
    model: 'ReasonCode',
    field: 'code',
    startAt: 0,
    incrementBy: 1
});

// add plugin that converts mongoose to json
reasonCodeSchema.plugin(toJSON);
const ReasonCode = mongoose.model('ReasonCode', reasonCodeSchema);
module.exports = ReasonCode;
