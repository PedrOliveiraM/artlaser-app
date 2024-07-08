const express = require("express");
const router = express.Router();

const BannerController = require("../controllers/bannerController");

const upload = require("../config/multer");

// criando as rotas
router.post("/", upload.single("image"), BannerController.create);
router.get("/", BannerController.findAll);
router.delete("/:id", BannerController.remove);

module.exports = router;
