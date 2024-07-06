const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BannerSchema = new Schema({
  imageName: { type: String, required: true },
  src: { type: String, required: true },
});

module.exports = mongoose.model("Banner", BannerSchema);
