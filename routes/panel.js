const express = require('express');
const path = require('path');
const router = express.Router();

// Rota para servir painel.html diretamente da raiz do projeto
router.get('/:token', (req, res) => {
  const token = req.params.token;
  const painelPath = path.resolve(__dirname, '..', 'painel.html');
  console.log(`Servindo painel.html para o token: ${token}`);
  res.sendFile(painelPath);
});

module.exports = router;
