import axios from 'axios';

// Configuração base
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_tipo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== SERVIÇOS ====================

const AuthService = {
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

  async logout() {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('user_tipo');
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar usuário' };
    }
  },

  async updateProfile(data) {
    try {
      const response = await api.put('/perfil', data);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar perfil' };
    }
  },

  async changePassword(data) {
    try {
      const response = await api.put('/change-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao alterar senha' };
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getUserTipo() {
    return localStorage.getItem('user_tipo');
  }
};

// ==================== ESTUDANTE ====================

const EstudanteService = {
  // Pedidos
  async getPedidos() {
    try {
      const response = await api.get('/estudante/pedidos');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar pedidos' };
    }
  },

  async criarPedido(data) {
    try {
      const response = await api.post('/estudante/pedidos', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao criar pedido' };
    }
  },

  async verPedido(id) {
    try {
      const response = await api.get(`/estudante/pedidos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar pedido' };
    }
  },

  async cancelarPedido(id) {
    try {
      const response = await api.delete(`/estudante/pedidos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao cancelar pedido' };
    }
  },

  async aceitarProposta(propostaId) {
    try {
      const response = await api.post(`/estudante/propostas/${propostaId}/aceitar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao aceitar proposta' };
    }
  },

  async avaliarSessao(pedidoId, data) {
    try {
      const response = await api.post(`/estudante/sessoes/${pedidoId}/avaliar`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao avaliar sessão' };
    }
  },

  // Biblioteca
  async getBiblioteca() {
    try {
      const response = await api.get('/estudante/biblioteca');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar biblioteca' };
    }
  },

  async toggleFavorito(id) {
    try {
      const response = await api.patch(`/estudante/biblioteca/${id}/favorito`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao favoritar' };
    }
  },

  async atualizarProgresso(id, progresso) {
    try {
      const response = await api.patch(`/estudante/biblioteca/${id}/progresso`, { progresso });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar progresso' };
    }
  },

  // Conteúdos (Loja)
  async getConteudos(params = {}) {
    try {
      const response = await api.get('/estudante/conteudos', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar conteúdos' };
    }
  },

  async verConteudo(id) {
    try {
      const response = await api.get(`/estudante/conteudos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao ver conteúdo' };
    }
  },

  async comprarConteudo(id) {
    try {
      const response = await api.post(`/estudante/conteudos/${id}/comprar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao comprar conteúdo' };
    }
  },

  // Carrinho
  async getCarrinho() {
    try {
      const response = await api.get('/estudante/carrinho');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar carrinho' };
    }
  },

  async adicionarAoCarrinho(conteudoId) {
    try {
      const response = await api.post('/estudante/carrinho', { conteudo_id: conteudoId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao adicionar ao carrinho' };
    }
  },

  async removerDoCarrinho(conteudoId) {
    try {
      const response = await api.delete(`/estudante/carrinho/${conteudoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao remover do carrinho' };
    }
  },

  async finalizarCompra() {
    try {
      const response = await api.post('/estudante/carrinho/finalizar');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao finalizar compra' };
    }
  },

  // Feedbacks
  async getMeusFeedbacks() {
    try {
      const response = await api.get('/estudante/meus-feedbacks');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar feedbacks' };
    }
  },

  async enviarFeedback(data) {
    try {
      const response = await api.post('/estudante/feedbacks', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao enviar feedback' };
    }
  }
};

// ==================== EXPLICADOR ====================

const ExplicadorService = {
  // Pedidos Disponíveis
  async getPedidosDisponiveis(params = {}) {
    try {
      const response = await api.get('/explicador/pedidos-disponiveis', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar pedidos' };
    }
  },
  
  // Adicionar no ExplicadorService
async getMinhasPropostas() {
  try {
    const response = await api.get('/explicador/minhas-propostas');
    return response.data;
  } catch (error) {
    console.error('Erro em getMinhasPropostas:', error);
    throw error.response?.data || { message: 'Erro ao buscar propostas' };
  }
},

  async fazerProposta(pedidoId, data) {
    try {
      const response = await api.post(`/explicador/pedidos/${pedidoId}/proposta`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao fazer proposta' };
    }
  },

  async aceitarPedido(pedidoId) {
    try {
      const response = await api.post(`/explicador/pedidos/${pedidoId}/aceitar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao aceitar pedido' };
    }
  },

  // Meus Pedidos
  async getMeusPedidos(params = {}) {
    try {
      const response = await api.get('/explicador/meus-pedidos', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar pedidos' };
    }
  },

  async iniciarSessao(pedidoId) {
    try {
      const response = await api.post(`/explicador/pedidos/${pedidoId}/iniciar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao iniciar sessão' };
    }
  },

  async concluirPedido(pedidoId) {
    try {
      const response = await api.post(`/explicador/pedidos/${pedidoId}/concluir`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao concluir pedido' };
    }
  },

  async agendarSessao(pedidoId, data) {
    try {
      const response = await api.post(`/explicador/pedidos/${pedidoId}/agendar`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao agendar sessão' };
    }
  },

  // Meus Conteúdos
  async getMeusConteudos() {
    try {
      const response = await api.get('/explicador/meus-conteudos');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar conteúdos' };
    }
  },

  async publicarConteudo(formData) {
    try {
      const response = await api.post('/explicador/conteudos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao publicar conteúdo' };
    }
  },

  async editarConteudo(id, data) {
    try {
      const response = await api.put(`/explicador/conteudos/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao editar conteúdo' };
    }
  },

  async toggleConteudoStatus(id) {
    try {
      const response = await api.patch(`/explicador/conteudos/${id}/status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao alterar status' };
    }
  },

  async getEstatisticasConteudo(id) {
    try {
      const response = await api.get(`/explicador/conteudos/${id}/estatisticas`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar estatísticas' };
    }
  },

  // Ganhos
  async getGanhos() {
    try {
      const response = await api.get('/explicador/ganhos');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar ganhos' };
    }
  },

  async solicitarSaque(data) {
    try {
      const response = await api.post('/explicador/saque', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao solicitar saque' };
    }
  }
};

// ==================== ADMIN ====================

const AdminService = {
  // Dashboard
  async getDashboard() {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar dashboard' };
    }
  },

  // Usuários
  async getUsuarios(params = {}) {
    try {
      const response = await api.get('/admin/usuarios', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar usuários' };
    }
  },

  async getUsuario(id) {
    try {
      const response = await api.get(`/admin/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar usuário' };
    }
  },

  async atualizarUsuario(id, data) {
    try {
      const response = await api.put(`/admin/usuarios/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar usuário' };
    }
  },

  async toggleUsuarioStatus(id) {
    try {
      const response = await api.patch(`/admin/usuarios/${id}/status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao alterar status' };
    }
  },

  // Explicadores
  async getExplicadores(params = {}) {
    try {
      const response = await api.get('/admin/explicadores', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar explicadores' };
    }
  },

  async aprovarExplicador(id) {
    try {
      const response = await api.post(`/admin/explicadores/${id}/aprovar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao aprovar explicador' };
    }
  },

  async reprovarExplicador(id) {
    try {
      const response = await api.post(`/admin/explicadores/${id}/reprovar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao reprovar explicador' };
    }
  },

  // Conteúdos
  async getConteudos(params = {}) {
    try {
      const response = await api.get('/admin/conteudos', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar conteúdos' };
    }
  },

  async aprovarConteudo(id) {
    try {
      const response = await api.post(`/admin/conteudos/${id}/aprovar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao aprovar conteúdo' };
    }
  },

  async reprovarConteudo(id) {
    try {
      const response = await api.post(`/admin/conteudos/${id}/reprovar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao reprovar conteúdo' };
    }
  },

  async removerConteudo(id) {
    try {
      const response = await api.delete(`/admin/conteudos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao remover conteúdo' };
    }
  },

  // Transações
  async getTransacoes(params = {}) {
    try {
      const response = await api.get('/admin/transacoes', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar transações' };
    }
  },

  async getResumoFinanceiro() {
    try {
      const response = await api.get('/admin/resumo-financeiro');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar resumo financeiro' };
    }
  },

  // Feedbacks
  async getFeedbacks(params = {}) {
    try {
      const response = await api.get('/admin/feedbacks', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar feedbacks' };
    }
  },

  async responderFeedback(id, resposta) {
    try {
      const response = await api.post(`/admin/feedbacks/${id}/responder`, { resposta });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao responder feedback' };
    }
  },

  async resolverFeedback(id) {
    try {
      const response = await api.patch(`/admin/feedbacks/${id}/resolver`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao resolver feedback' };
    }
  }
};

// ==================== AVALIAÇÕES ====================

const AvaliacaoService = {
  async getRecebidas() {
    try {
      const response = await api.get('/avaliacoes/recebidas');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar avaliações' };
    }
  },

  async getEnviadas() {
    try {
      const response = await api.get('/avaliacoes/enviadas');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar avaliações' };
    }
  },

  async podeAvaliar(pedidoId) {
    try {
      const response = await api.get(`/avaliacoes/pode-avaliar/${pedidoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao verificar' };
    }
  },

  async responder(avaliacaoId, resposta) {
    try {
      const response = await api.post(`/avaliacoes/${avaliacaoId}/responder`, { resposta });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao responder' };
    }
  },

  async getEstatisticasExplicador(explicadorId) {
    try {
      const response = await api.get(`/avaliacoes/explicador/${explicadorId}/estatisticas`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar estatísticas' };
    }
  },

  async getAvaliacao(id) {
    try {
      const response = await api.get(`/avaliacoes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar avaliação' };
    }
  },
  
};

// ==================== HELPERS ====================

const formatarPreco = (valor) => {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    minimumFractionDigits: 0
  }).format(valor);
};

const handleError = (error) => {
  if (error.response) {
    return error.response.data.message || 'Erro no servidor';
  }
  return error.message || 'Erro de conexão';
};

// ==================== EXPORTAÇÃO ÚNICA ====================

export default {
  api,
  AuthService,
  EstudanteService,
  ExplicadorService,
  AdminService,
  AvaliacaoService,
  formatarPreco,
  handleError
};
