const Picture = require("../models/Picture");

const fs = require("fs");

exports.create = async (req, res) => {
  try {
    const {
      imageName,
      title,
      description,
      qtdMin,
      category,
      retail,
      wholesale,
    } = req.body;

    const file = req.file;

    const picture = new Picture({
      imageName,
      src: file.path,
      title,
      description,
      qtdMin,
      category,
      retail,
      wholesale,
    });

    await picture.save();

    res.json({ picture, msg: "Picture saved successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error save picture" });
  }
};

// buscar todas
exports.findAll = async (req, res) => {
  try {
    const pictures = await Picture.find();
    res.json(pictures);
  } catch (error) {
    res.status(500).send({ message: "Error get pictures" });
  }
};

//remover
exports.remove = async (req, res) => {
  try {
    const picture = await Picture.findById(req.params.id);

    if (!picture) {
      return res.status(404).send({ message: "Picture not found" });
    }

    // Excluir a imagem do servidor
    fs.unlinkSync(picture.src);

    // Remover do banco de dados
    await Picture.findByIdAndDelete(req.params.id);

    res.json({ msg: "Picture removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error removing picture" });
  }
};
