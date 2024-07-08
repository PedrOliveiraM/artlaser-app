const Banner = require("../models/Banner");

const fs = require("fs");

exports.create = async (req, res) => {
  try {
    const { imageName } = req.body;
    const file = req.file;

    const banner = new Banner({
      imageName,
      src: file.path,
    });

    await banner.save();

    res.json({ banner, msg: "Banner saved successfully" });
  } catch (error) {
    console.error("Error save picture:", error);
    res.status(500).send({ message: "Error saving picture" });
  }
};

// buscar todas
exports.findAll = async (req, res) => {
  try {
    const banner = await Banner.find();
    res.json(banner);
  } catch (error) {
    res.status(500).send({ message: "Error get banner" });
  }
};

//remover
exports.remove = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).send({ message: "Picture not found" });
    }

    // Excluir a imagem do servidor
    fs.unlinkSync(banner.src);

    // Remover do banco de dados
    await Banner.findByIdAndDelete(req.params.id);

    res.json({ msg: "Banner removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error removing banner" });
  }
};
