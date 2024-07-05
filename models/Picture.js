const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PictureSchema = new Schema({
  imageName: { type: String, required: true },
  src: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  retail: { type: Number, required: true },
  wholesale: { type: Number, required: true },
});

module.exports = mongoose.model("Picture", PictureSchema);