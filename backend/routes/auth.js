const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Banco de dados em memória (substituir por banco real em produção)
const users = [
  {
    id: 1,
    email: 'usuario@teste.com',
    password: '$2a$10$8K1p/a0dL3LKzOWR0Y5Y5.5J5J5J5J5J5J5J5J5J5J5J5J5J5J5J5', // 123456
    name: 'Usuário Teste',
    role: 'user'
  },
  {
    id: 2,
    email: 'admin@euquero.com',
    password: '$2a$10$9L2q/b1eM4MLaZPXS1Z6Z6.6K6K6K6K6K6K6K6K6K6K6K6K6K6K6K', // admin123
    name: 'Administrador',
    role: 'admin'
  }
];

// POST /api/auth/login - Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos'
      });
    }

    // Verificar senha (simplificado para desenvolvimento)
    // Em produção, use: await bcrypt.compare(password, user.password)
    const validPassword = 
      (email === 'usuario@teste.com' && password === '123456') ||
      (email === 'admin@euquero.com' && password === 'admin123');

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar sucesso
    res.json({
      success: true,
      token: token,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar login'
    });
  }
});

// POST /api/auth/register - Registro (opcional)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validações
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Todos os campos são obrigatórios'
      });
    }

    // Verificar se usuário já existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email já cadastrado'
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      role: 'user'
    };

    users.push(newUser);

    // Gerar token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email,
        role: newUser.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token: token,
      name: newUser.name,
      email: newUser.email,
      message: 'Usuário cadastrado com sucesso'
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao processar registro'
    });
  }
});

// GET /api/auth/validate - Validar token
router.get('/validate', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token não fornecido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({
      success: true,
      valid: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      valid: false,
      error: 'Token inválido ou expirado'
    });
  }
});

module.exports = router;
