const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Configurações do JWT
const JWT_SECRET = process.env.JWT_SECRET; // Obtenha a chave secreta das variáveis de ambiente

// Criar usuário (com hash de senha)
exports.create = async (req, res) => {
  try {
    const { userName, password, email, isAdmin, cpf } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userName,
      password: hashedPassword,
      email,
      isAdmin,
      cpf,
    });

    await user.save();

    res.json({ user, msg: 'User saved successfully' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Error saving user', error });
  }
};

// Login de usuário (autenticação)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ userName: username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Gerar um token JWT
    const token = jwt.sign(
      { id: user._id, userName: user.userName },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token }); // Retorne o token para o frontend
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error });
  }
};

// Middleware para proteger rotas
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do cabeçalho Authorization
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};
