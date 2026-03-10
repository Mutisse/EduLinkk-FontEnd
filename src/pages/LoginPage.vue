<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="login-page">
        <!-- Imagem de fundo sutil -->
        <div class="background-image"></div>

        <!-- Container principal -->
        <div class="login-container">
          <!-- Botão Voltar -->
          <button class="back-button" @click="voltar">
            <span class="material-icons">arrow_back</span>
          </button>

          <!-- Card de Login -->
          <div class="login-card">
            <!-- Logo e Título -->
            <div class="login-header">
              <div class="logo">
                <span class="material-icons">school</span>
              </div>
              <h1>EduLink Moçambique</h1>
              <p>Faça login para continuar</p>
            </div>

            <!-- Formulário -->
            <form @submit.prevent="handleLogin">
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
                  />
                </div>
              </div>

              <!-- Senha -->
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
                  />
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

              <!-- Opções -->
              <div class="form-options">
                <label class="checkbox">
                  <input type="checkbox" v-model="lembrar" />
                  <span>Lembrar-me</span>
                </label>
                <button type="button" class="forgot-password" @click="esqueciSenha">
                  Esqueceu a senha?
                </button>
              </div>

              <!-- Botão Login -->
              <button type="submit" class="login-btn" :disabled="loading">
                <span v-if="!loading">Entrar</span>
                <q-spinner v-else size="20px" color="white" />
              </button>

              <!-- Link Registro -->
              <p class="register-link">
                Não tem uma conta?
                <button type="button" @click="irParaRegistro">Cadastre-se</button>
              </p>
            </form>

            <!-- Contas Demo (só desenvolvimento) -->
            <div class="demo-accounts" v-if="showDemo">
              <p>Acesso rápido:</p>
              <div class="demo-buttons">
                <button @click="preencherDemo('estudante')">
                  <span class="material-icons">person</span>
                  Estudante
                </button>
                <button @click="preencherDemo('explicador')">
                  <span class="material-icons">school</span>
                  Explicador
                </button>
                <button @click="preencherDemo('admin')">
                  <span class="material-icons">admin_panel_settings</span>
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
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
      showDemo: import.meta.env.DEV
    };
  },

  methods: {
    async handleLogin() {
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
        const response = await Api.AuthService.login(
          this.form.email,
          this.form.password,
          this.form.tipo
        );

        this.$q.notify({
          type: 'positive',
          message: `Bem-vindo, ${response.user.nome}!`,
          position: 'top'
        });

        this.redirecionarPorTipo(response.user.tipo);
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.message || 'Erro ao fazer login',
          position: 'top'
        });
      } finally {
        this.loading = false;
      }
    },

    redirecionarPorTipo(tipo) {
      const rotas = {
        estudante: '/estudante',
        explicador: '/explicador',
        admin: '/admin'
      };
      this.$router.push(rotas[tipo] || '/');
    },

    voltar() {
      this.$router.push('/');
    },

    esqueciSenha() {
      this.$q.dialog({
        title: 'Recuperar senha',
        message: 'Digite seu email:',
        prompt: {
          model: '',
          type: 'email'
        },
        cancel: true
      }).onOk(email => {
        this.$q.notify({
          type: 'info',
          message: `Instruções enviadas para ${email}`,
          icon: 'mail'
        });
      });
    },

    irParaRegistro() {
      this.$router.push('/registro');
    },

    preencherDemo(tipo) {
      const contas = {
        estudante: { email: 'maria@email.com', password: '123456' },
        explicador: { email: 'joao@email.com', password: '123456' },
        admin: { email: 'admin@edulink.co.mz', password: 'admin123' }
      };

      const conta = contas[tipo];
      if (conta) {
        this.form.email = conta.email;
        this.form.password = conta.password;
        this.form.tipo = tipo;

        this.$q.notify({
          type: 'info',
          message: `Conta de ${tipo} preenchida!`,
          position: 'top'
        });
      }
    }
  },

  mounted() {
    if (Api.AuthService.isAuthenticated()) {
      const user = Api.AuthService.getUser();
      if (user) this.redirecionarPorTipo(user.tipo);
    }
  }
};
</script>

<style scoped>
/* Reset e base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #f5f7fa;
  padding: 16px;
}

/* Imagem de fundo sutil */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  opacity: 0.15;
  z-index: 0;
}

/* Container principal */
.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px; /* Aumentado de 400px para 500px */
  margin: 0 auto;
}

/* Botão voltar */
.back-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 16px;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.back-button:hover {
  background: #f8fafc;
  transform: translateX(-3px);
}

.back-button .material-icons {
  font-size: 20px;
  color: #4a5568;
}

/* Card de login */
.login-card {
  background: white;
  border-radius: 24px;
  padding: 40px 32px; /* Aumentado o padding */
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 72px; /* Aumentado */
  height: 72px; /* Aumentado */
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px; /* Aumentado */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.logo .material-icons {
  font-size: 40px; /* Aumentado */
  color: white;
}

.login-header h1 {
  font-size: 24px; /* Aumentado */
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 8px;
}

.login-header p {
  font-size: 15px; /* Aumentado */
  color: #718096;
}

/* Formulário */
.form-group {
  margin-bottom: 24px; /* Aumentado */
}

.form-group label {
  display: block;
  font-size: 14px; /* Aumentado */
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px; /* Aumentado */
}

/* Seletor de tipo */
.tipo-selector {
  display: flex;
  gap: 12px; /* Aumentado */
  background: #f7fafc;
  padding: 6px; /* Aumentado */
  border-radius: 14px; /* Aumentado */
  border: 1px solid #e2e8f0;
}

.tipo-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* Aumentado */
  padding: 12px 10px; /* Aumentado */
  border: none;
  border-radius: 12px; /* Aumentado */
  background: transparent;
  color: #718096;
  font-size: 14px; /* Aumentado */
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.tipo-btn .material-icons {
  font-size: 20px; /* Aumentado */
}

.tipo-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.tipo-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

/* Inputs */
.input-group {
  display: flex;
  align-items: center;
  gap: 12px; /* Aumentado */
  padding: 14px 16px; /* Aumentado */
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px; /* Aumentado */
  transition: all 0.2s;
}

.input-group:focus-within {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-group .material-icons {
  font-size: 20px; /* Aumentado */
  color: #a0aec0;
}

.input-group input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px; /* Aumentado */
  color: #2d3748;
  outline: none;
}

.input-group input::placeholder {
  color: #a0aec0;
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
  font-size: 20px; /* Aumentado */
  color: #718096;
}

.password-toggle:hover .material-icons {
  color: #667eea;
}

/* Opções */
.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0 28px; /* Ajustado */
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px; /* Aumentado */
  color: #4a5568;
}

.checkbox input {
  width: 18px; /* Aumentado */
  height: 18px; /* Aumentado */
  accent-color: #667eea;
}

.forgot-password {
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px; /* Aumentado */
  font-weight: 500;
  cursor: pointer;
  padding: 0;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* Botão de login */
.login-btn {
  width: 100%;
  height: 52px; /* Aumentado */
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 14px; /* Aumentado */
  font-size: 16px; /* Aumentado */
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Link de registro */
.register-link {
  text-align: center;
  margin-top: 24px; /* Aumentado */
  font-size: 14px; /* Aumentado */
  color: #718096;
}

.register-link button {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px;
  font-size: 14px; /* Aumentado */
}

.register-link button:hover {
  text-decoration: underline;
}

/* Contas demo */
.demo-accounts {
  margin-top: 28px; /* Aumentado */
  padding-top: 24px; /* Aumentado */
  border-top: 1px solid #e2e8f0;
}

.demo-accounts p {
  font-size: 13px; /* Aumentado */
  color: #718096;
  margin-bottom: 14px; /* Aumentado */
  text-align: center;
}

.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* Aumentado */
  justify-content: center;
}

.demo-buttons button {
  display: inline-flex;
  align-items: center;
  gap: 8px; /* Aumentado */
  padding: 10px 20px; /* Aumentado */
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 30px;
  font-size: 13px; /* Aumentado */
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}

.demo-buttons button:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.demo-buttons .material-icons {
  font-size: 18px; /* Aumentado */
  color: #718096;
}

/* ===== RESPONSIVIDADE ===== */

/* Responsividade para mobile */
@media (max-width: 480px) {
  .login-container {
    max-width: 100%;
  }

  .login-card {
    padding: 24px 16px;
  }

  .tipo-btn {
    padding: 8px 4px;
    font-size: 12px;
  }

  .tipo-btn .material-icons {
    font-size: 16px;
  }

  .demo-buttons {
    flex-direction: column;
  }

  .demo-buttons button {
    width: 100%;
    justify-content: center;
  }
}

/* Tablet (641px - 1024px) */
@media (min-width: 641px) and (max-width: 1024px) {
  .login-container {
    max-width: 550px; /* Um pouco maior para tablet */
  }

  .login-card {
    padding: 40px 36px;
  }
}

/* Desktop (1025px+) - Card MAIS LARGO */
@media (min-width: 1025px) {
  .login-container {
    max-width: 600px; /* Aumentado significativamente para desktop */
  }

  .login-card {
    padding: 48px 48px; /* Mais espaçamento interno */
  }

  .login-header h1 {
    font-size: 28px; /* Título maior */
  }

  .login-header p {
    font-size: 16px;
  }

  .tipo-btn {
    padding: 14px 12px;
    font-size: 15px;
  }

  .input-group {
    padding: 16px 18px;
  }

  .input-group input {
    font-size: 16px;
  }

  .login-btn {
    height: 56px;
    font-size: 18px;
  }

  .demo-buttons {
    gap: 12px;
  }

  .demo-buttons button {
    padding: 12px 24px;
    font-size: 14px;
  }
}

/* Desktop grande (1440px+) - Ainda MAIS LARGO */
@media (min-width: 1440px) {
  .login-container {
    max-width: 650px; /* Máximo para telas muito grandes */
  }

  .login-card {
    padding: 56px 56px;
  }
}
</style>
