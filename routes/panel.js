const express = require('express');
const path = require('path');
const router = express.Router();

// Rota para servir painel.html diretamente
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'painel.html'));
});

module.exports = router;
