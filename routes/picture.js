const express = require("express");
const router = express.Router();

const PictureController = require("../controllers/pictureController");

const upload = require("../config/multer");

// criando as rotas
router.post("/", upload.single("image"), PictureController.create);
router.get("/", PictureController.findAll);
router.get("/:id", PictureController.findOne);
router.delete("/:id", PictureController.remove);

module.exports = router;
