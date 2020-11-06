const mongoose = require("mongoose");
const schema = mongoose.Schema;

const fileSchema = new schema({
  destination: {
    type: String,
    required: false,
  },
  encoding: { type: String, required: false },
  fieldname: { type: String, required: false },
  filename: { type: String, required: false },
  mimetype: { type: String, required: false },
  originalname: { type: String, required: false },
  path: { type: String, required: false },
  size: { type: Number, required: false },
});

const RatingSchema = new mongoose.Schema({
  text: {
    type: String,
    required: false,
  },
  rate: {
    type: Number,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
});

const websiteSchema = new schema({
  description: {
    type: String,
    required: true,
  },
  sitename: {
    type: String,
    required: true,
  },
  files: [fileSchema],
  ratings: [RatingSchema],
});

module.exports = website = mongoose.model("websites", websiteSchema);
