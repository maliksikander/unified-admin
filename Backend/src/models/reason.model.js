const mongoose = require("mongoose");
const { toJSON } = require("./plugins");
var autoIncrement = require("mongoose-auto-increment");
const config = require("../config/config");
const logger = require("../config/logger");

const reasonCodeSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    name: {
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
      enum: ["LOGOUT", "NOT_READY"],
    },
  },
  {
    timestamps: false,
  }
);

if (process.env.NODE_ENV !== "test") {
  try {
    var connection = mongoose.createConnection(config.mongoose.url);
    autoIncrement.initialize(connection);
    reasonCodeSchema.plugin(autoIncrement.plugin, {
      model: "ReasonCode",
      field: "code",
      startAt: 0,
      incrementBy: 1,
    });
  } catch (err) {
    logger.error(
      "Error creating mongoose connection for auto increment in reason model" +
        JSON.stringify(err),
      { className: "reason.model", methodName: "createConnection", CID: null }
    );
  }
}

reasonCodeSchema.plugin(toJSON);

// add plugin that converts mongoose to jso
const ReasonCode = mongoose.model("ReasonCode", reasonCodeSchema);
module.exports = ReasonCode;
