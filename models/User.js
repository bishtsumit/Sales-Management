const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    Default: Date.now,
  },
  previousfollowupDate: {
    type: String,
    required: false,
  },
  nextfollowupDate: {
    type: String,
    required: false,
  },
  followUpstatus: {
    type: String,
    required: false,
    default: "",
  },
  remarks: {
    type: String,
    required: false,
  },
});

// here user is the name of the object with which you want to export the schema
// users is the name of collection in mongoDB
module.exports = user = mongoose.model("users", UserSchema);
