const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Rota para criação de usuário
router.post('/create', UserController.create);

// Rota para verificar se existe no banco
router.post('/login', UserController.login);

// Exporte as rotas
module.exports = router;
