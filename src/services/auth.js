// src/services/auth.js
import api from './api';

const AuthService = {
  // Login
  async login(email, password, tipo) {
    try {
      const response = await api.post('/login', { email, password, tipo });
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user_tipo', response.data.user.tipo);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao fazer login' };
    }
  },

  // Registro
  async register(userData) {
    try {
      const response = await api.post('/register', userData);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user_tipo', response.data.user.tipo);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao registrar' };
    }
  },

  // Logout
  async logout() {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_tipo');
    }
  },

  // Usuário atual
  async getCurrentUser() {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar usuário' };
    }
  },

  // Atualizar perfil
  async updateProfile(data) {
    try {
      const response = await api.put('/perfil', data);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar perfil' };
    }
  },

  // Alterar senha
  async changePassword(data) {
    try {
      const response = await api.put('/change-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao alterar senha' };
    }
  },

  // Verificar se está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  // Pegar usuário do storage
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Pegar tipo do usuário
  getUserTipo() {
    return localStorage.getItem('user_tipo');
  }
};

export default AuthService;
