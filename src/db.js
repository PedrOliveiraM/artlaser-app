const mongoose = require("mongoose");

require("dotenv").config();

mongoose.set("strictQuery", true);

async function main() {
  await mongoose.connect(
    `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@cluster0.wxilqgt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  );
  console.log("Database connected successfully");
}

main().catch((err) => console.log(err));

module.exports = main;