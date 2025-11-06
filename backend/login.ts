import express, { Request, Response } from 'express';

const router = express.Router();

// Usuários mockados
const mockUsers = [
  {
    id: 1,
    username: 'usuario@teste.com',
    email: 'usuario@teste.com',
    password: '123456',
    name: 'Usuário Teste'
  },
  {
    id: 2,
    username: 'admin@euquero.com',
    email: 'admin@euquero.com',
    password: 'admin123',
    name: 'Administrador'
  }
];

// Armazenamento temporário de tokens (em produção, use Redis ou banco de dados)
const tokens: { [key: string]: { username: string; expiresAt: number } } = {};

const ONE_MINUTE = 60 * 1000; // 60 segundos em milissegundos

// Endpoint de login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validação de campos
  if (!email) {
    return res.status(401).json({ error: 'Email missing on payload.' });
  }

  if (!password) {
    return res.status(401).json({ error: 'Password missing on payload.' });
  }

  try {
    // Buscar usuário
    const user = mockUsers.find(
      u => (u.email === email || u.username === email) && u.password === password
    );

    if (user) {
      // Gerar token
      const token = generateToken();
      const expiresAt = Date.now() + ONE_MINUTE;

      // Armazenar token
      tokens[token] = {
        username: user.email,
        expiresAt
      };

      return res.status(200).json({
        success: true,
        username: user.email,
        name: user.name,
        token: token,
        expiresAt: expiresAt
      });
    }

    return res.status(400).json({ error: 'Email or password not matches.' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Endpoint para validar token
router.post('/validate-token', (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Token missing.' });
  }

  const tokenData = tokens[token];

  if (!tokenData) {
    return res.status(401).json({ error: 'Invalid token.' });
  }

  if (Date.now() > tokenData.expiresAt) {
    delete tokens[token];
    return res.status(401).json({ error: 'Token expired.' });
  }

  return res.status(200).json({
    valid: true,
    username: tokenData.username
  });
});

// Endpoint de logout
router.post('/logout', (req: Request, res: Response) => {
  const { token } = req.body;

  if (token && tokens[token]) {
    delete tokens[token];
  }

  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

// Função auxiliar para gerar token
function generateToken(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

export default router;
