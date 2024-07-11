const Picture = require('../models/Picture');

const fs = require('fs');
/*
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
    const file = req.file; // Aqui está o arquivo enviado pelo Multer

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
    console.error("Error saving picture:", error);
    res.status(500).send({ message: "Error saving picture" });
  }
};*/
exports.create = async (req, res) => {
  try {
    const { title, description, qtdMin, category, retail, wholesale } =
      req.body;
    const file = req.file; // Aqui está o arquivo enviado pelo Multer

    const picture = new Picture({
      imageName: file.filename, // Nome da imagem (se precisar)
      src: file.path, // Caminho da imagem (se precisar)
      title,
      description,
      qtdMin,
      category,
      retail,
      wholesale,
    });

    await picture.save();

    res.json({ picture, msg: 'Picture saved successfully' });
  } catch (error) {
    console.error('Error saving picture:', error);
    res.status(500).send({ message: 'Error saving picture' });
  }
};

// buscar todas
exports.findAll = async (req, res) => {
  try {
    const pictures = await Picture.find();
    res.json(pictures);
  } catch (error) {
    res.status(500).send({ message: 'Error get pictures' });
  }
};

exports.findOne = async (req, res) => {
  try {
    const picture = await Picture.findById(req.params.id);
    res.json(picture);
  } catch (error) {
    res.status(500).send({ message: 'Error get pictures' });
  }
};

// buscar por categoria
exports.findByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const pictures = await Picture.find({
      category: new RegExp(`^${category}$`, 'i'),
    });
    res.json(pictures);
  } catch (error) {
    res.status(500).send({ message: 'Error getting category pictures' });
  }
};
// Buscar pelo nome
// buscar por título
// buscar por título
exports.searchByTitle = async (req, res) => {
  try {
    const searchTerm = req.params.title; // Obtém o termo de pesquisa dos parâmetros da rota
    if (!searchTerm) {
      return res.status(400).send({ message: 'Search term is required' });
    }

    // Cria uma expressão regular para buscar o termo no título, ignorando maiúsculas/minúsculas
    const regex = new RegExp(searchTerm, 'i');

    // Busca no banco de dados por itens cujo título contenha o termo pesquisado
    const pictures = await Picture.find({
      title: regex,
    });

    res.json(pictures);
  } catch (error) {
    res.status(500).send({ message: 'Error searching for pictures' });
  }
};

//remover
exports.remove = async (req, res) => {
  try {
    const picture = await Picture.findById(req.params.id);

    if (!picture) {
      return res.status(404).send({ message: 'Picture not found' });
    }

    // Excluir a imagem do servidor
    fs.unlinkSync(picture.src);

    // Remover do banco de dados
    await Picture.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Picture removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error removing picture' });
  }
};
