const mongoose = require("mongoose");
const schema = mongoose.Schema;

const deviceSchema = new schema({
  date: {
    type: String,
    required: true,
  },
  device: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = device = mongoose.model("devices", deviceSchema);
