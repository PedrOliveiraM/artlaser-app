const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const pictureRouter = require('../routes/picture');
const bannerRouter = require('../routes/banner');
const userRouter = require('../routes/user');
const authenticateToken = require('../middleware/authMiddleware');

// Middleware para permitir CORS
app.use(cors());
app.use(express.json());

// Rotas
app.use('/pictures', pictureRouter);
app.use('/banner', bannerRouter);
app.use('/users', userRouter);

// Serve arquivos estáticos da raiz do projeto
app.use(
  '/painel',
  authenticateToken,
  express.static(path.resolve(__dirname, '..', 'painel.html'))
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`${process.env.URL}`);
});
