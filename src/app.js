const express = require("express");
const cors = require("cors"); // Importe o módulo CORS

const app = express();
require("dotenv").config();
require("./db");

const port = process.env.PORT || 3000;

const pictureRouter = require("../routes/picture");
const bannerRouter = require("../routes/banner");

// Middleware para permitir CORS
app.use(cors());

// Rotas
app.use("/pictures", pictureRouter);
app.use("/banner", bannerRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
