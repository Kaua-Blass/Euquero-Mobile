const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Usuários pré-cadastrados
const users = [
  {
    id: 1,
    email: 'usuario@teste.com',
    password: '123456',
    name: 'Usuário Teste',
    role: 'user'
  },
  {
    id: 2,
    email: 'admin@euquero.com',
    password: 'admin123',
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

    // Verificar senha
    if (user.password !== password) {
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
