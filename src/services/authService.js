const API_BASE_URL = 'http://localhost:3000/api';                   

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Armazenar token para sessões persistentes
        localStorage.setItem('token', data.token);
        return { success: true, name: data.name };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      throw new Error('Erro de conexão');
    }
  },
};