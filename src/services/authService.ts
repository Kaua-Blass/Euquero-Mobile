// Mock de usuários (simulando backend)
const mockUsers = [
  {
    id: 1,
    email: 'usuario@teste.com',
    password: '123456',
    name: 'Usuário Teste'
  },
  {
    id: 2,
    email: 'admin@euquero.com',
    password: 'admin123',
    name: 'Administrador'
  }
];

// Armazenamento temporário de tokens (simulando sessão)
const tokens: { [key: string]: { email: string; expiresAt: number } } = {};

const ONE_MINUTE = 60 * 1000; // 60 segundos em milissegundos

// Função auxiliar para gerar token
function generateToken(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

// Simula delay de rede (opcional)
const simulateNetworkDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Interface de resposta de login
export interface LoginResponse {
  success: boolean;
  username?: string;
  name?: string;
  token?: string;
  expiresAt?: number;
  error?: string;
}

// Interface de resposta de validação de token
export interface ValidateTokenResponse {
  valid: boolean;
  username?: string;
  error?: string;
}

// Serviço de autenticação mockado
export const authService = {
  // Login
  async login(email: string, password: string): Promise<LoginResponse> {
    await simulateNetworkDelay();

    // Validação de campos
    if (!email) {
      return { success: false, error: 'Email missing on payload.' };
    }

    if (!password) {
      return { success: false, error: 'Password missing on payload.' };
    }

    try {
      // Buscar usuário
      const user = mockUsers.find(
        u => u.email === email && u.password === password
      );

      if (user) {
        // Gerar token
        const token = generateToken();
        const expiresAt = Date.now() + ONE_MINUTE;

        // Armazenar token
        tokens[token] = {
          email: user.email,
          expiresAt
        };

        // Salvar no localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.name);

        return {
          success: true,
          username: user.email,
          name: user.name,
          token: token,
          expiresAt: expiresAt
        };
      }

      return { success: false, error: 'Email or password not matches.' };
    } catch (error) {
      return { success: false, error: 'Internal server error.' };
    }
  },

  // Validar token
  async validateToken(token: string): Promise<ValidateTokenResponse> {
    await simulateNetworkDelay(200);

    if (!token) {
      return { valid: false, error: 'Token missing.' };
    }

    const tokenData = tokens[token];

    if (!tokenData) {
      return { valid: false, error: 'Invalid token.' };
    }

    if (Date.now() > tokenData.expiresAt) {
      delete tokens[token];
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      return { valid: false, error: 'Token expired.' };
    }

    return {
      valid: true,
      username: tokenData.email
    };
  },

  // Logout
  async logout(): Promise<{ success: boolean }> {
    await simulateNetworkDelay(200);

    const token = localStorage.getItem('authToken');

    if (token && tokens[token]) {
      delete tokens[token];
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');

    return { success: true };
  },

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Obter dados do usuário
  getUserData(): { email: string; name: string } | null {
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');

    if (email && name) {
      return { email, name };
    }

    return null;
  }
};
