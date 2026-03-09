<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Logo e Título -->
      <div class="login-header">
        <div class="logo">
          <span class="material-icons">school</span>
        </div>
        <h1>EduLink Moçambique</h1>
        <p>Faça login para continuar</p>
      </div>

      <!-- Formulário de Login -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Tipo de Usuário -->
        <div class="form-group">
          <label>Entrar como</label>
          <div class="tipo-selector">
            <button
              type="button"
              v-for="tipo in tipos"
              :key="tipo.value"
              class="tipo-btn"
              :class="{ active: form.tipo === tipo.value }"
              @click="form.tipo = tipo.value"
            >
              <span class="material-icons">{{ tipo.icon }}</span>
              <span>{{ tipo.label }}</span>
            </button>
          </div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-group">
            <span class="material-icons">email</span>
            <input
              type="email"
              id="email"
              v-model="form.email"
              placeholder="seu@email.com"
              required
            >
          </div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Senha</label>
          <div class="input-group">
            <span class="material-icons">lock</span>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              placeholder="••••••••"
              required
            >
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
            >
              <span class="material-icons">
                {{ showPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </div>
        </div>

        <!-- Lembrar-me e Esqueci senha -->
        <div class="form-options">
          <label class="checkbox">
            <input type="checkbox" v-model="lembrar">
            <span>Lembrar-me</span>
          </label>
          <button type="button" class="forgot-password" @click="esqueciSenha">
            Esqueceu a senha?
          </button>
        </div>

        <!-- Botão de Login -->
        <button
          type="submit"
          class="login-btn"
          :disabled="loading"
        >
          <span v-if="!loading">Entrar</span>
          <span v-else class="loading-spinner"></span>
        </button>

        <!-- Link para Registro -->
        <p class="register-link">
          Não tem uma conta?
          <button type="button" @click="irParaRegistro">Cadastre-se</button>
        </p>
      </form>

      <!-- Demonstração (apenas desenvolvimento) -->
      <div class="demo-accounts" v-if="showDemo">
        <p>Contas de demonstração:</p>
        <div class="demo-buttons">
          <button @click="preencherDemo('estudante')">
            Estudante (maria@email.com / 123456)
          </button>
          <button @click="preencherDemo('explicador')">
            Explicador (joao@email.com / 123456)
          </button>
          <button @click="preencherDemo('admin')">
            Admin (admin@edulink.co.mz / admin123)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../services/api.js';

export default {
  name: 'LoginPage',

  data() {
    return {
      form: {
        email: '',
        password: '',
        tipo: 'estudante'
      },
      tipos: [
        { value: 'estudante', label: 'Estudante', icon: 'person' },
        { value: 'explicador', label: 'Explicador', icon: 'school' },
        { value: 'admin', label: 'Administrador', icon: 'admin_panel_settings' }
      ],
      showPassword: false,
      lembrar: false,
      loading: false,
      showDemo: true // Mostrar contas demo (remover em produção)
    };
  },

  methods: {
    async handleLogin() {
      // Validação básica
      if (!this.form.email || !this.form.password) {
        this.$q.notify({
          type: 'warning',
          message: 'Preencha todos os campos',
          position: 'top'
        });
        return;
      }

      this.loading = true;

      try {
        // Chamada à API
        const response = await Api.AuthService.login(
          this.form.email,
          this.form.password,
          this.form.tipo
        );

        // Sucesso!
        this.$q.notify({
          type: 'positive',
          message: `Bem-vindo, ${response.user.nome}!`,
          position: 'top',
          timeout: 2000
        });

        // Redirecionar baseado no tipo
        this.redirecionarPorTipo(response.user.tipo);

      } catch (error) {
        // Tratar erro
        const mensagem = error.message || 'Erro ao fazer login';

        this.$q.notify({
          type: 'negative',
          message: mensagem,
          position: 'top',
          timeout: 4000
        });

        // Log do erro (desenvolvimento)
        console.error('Erro no login:', error);
      } finally {
        this.loading = false;
      }
    },

    redirecionarPorTipo(tipo) {
      switch(tipo) {
        case 'estudante':
          this.$router.push('/estudante');
          break;
        case 'explicador':
          this.$router.push('/explicador');
          break;
        case 'admin':
          this.$router.push('/admin');
          break;
        default:
          this.$router.push('/');
      }
    },

    esqueciSenha() {
      this.$q.dialog({
        title: 'Recuperar senha',
        message: 'Função em desenvolvimento. Entre em contato com o suporte.',
        persistent: true
      });
    },

    irParaRegistro() {
      this.$router.push('/registro');
    },

    // Métodos de demonstração
    preencherDemo(tipo) {
      const contas = {
        estudante: {
          email: 'maria@email.com',
          password: '123456',
          tipo: 'estudante'
        },
        explicador: {
          email: 'joao@email.com',
          password: '123456',
          tipo: 'explicador'
        },
        admin: {
          email: 'admin@edulink.co.mz',
          password: 'admin123',
          tipo: 'admin'
        }
      };

      const conta = contas[tipo];
      if (conta) {
        this.form.email = conta.email;
        this.form.password = conta.password;
        this.form.tipo = conta.tipo;

        this.$q.notify({
          type: 'info',
          message: `Conta de ${tipo} preenchida!`,
          position: 'top',
          timeout: 1500
        });
      }
    }
  },

  mounted() {
    // Verificar se já está logado
    if (Api.AuthService.isAuthenticated()) {
      const user = Api.AuthService.getUser();
      if (user) {
        this.redirecionarPorTipo(user.tipo);
      }
    }

    // Esconder contas demo em produção
    if (import.meta.env.PROD) {
      this.showDemo = false;
    }
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.logo .material-icons {
  font-size: 40px;
  color: white;
}

.login-header h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 5px;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

/* Formulário */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

/* Seletor de tipo */
.tipo-selector {
  display: flex;
  gap: 10px;
  background: #f5f5f5;
  padding: 5px;
  border-radius: 12px;
}

.tipo-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tipo-btn .material-icons {
  font-size: 20px;
}

.tipo-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Input group */
.input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.input-group:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-group .material-icons {
  color: #999;
  font-size: 20px;
}

.input-group input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
}

.input-group input::placeholder {
  color: #bbb;
}

.password-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.password-toggle .material-icons {
  color: #999;
  transition: color 0.3s ease;
}

.password-toggle:hover .material-icons {
  color: #667eea;
}

/* Opções do formulário */
.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #666;
}

.checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.forgot-password {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* Botão de login */
.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading spinner */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Link de registro */
.register-link {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 20px;
}

.register-link button {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
}

.register-link button:hover {
  text-decoration: underline;
}

/* Contas demo */
.demo-accounts {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.demo-accounts p {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
  text-align: center;
}

.demo-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-buttons button {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.demo-buttons button:hover {
  background: #e8e8e8;
}

/* Responsividade */
@media (max-width: 480px) {
  .login-container {
    padding: 30px 20px;
  }

  .tipo-btn {
    padding: 10px;
    font-size: 13px;
  }

  .tipo-btn .material-icons {
    font-size: 18px;
  }

  .demo-buttons button {
    font-size: 11px;
  }
}
</style>
