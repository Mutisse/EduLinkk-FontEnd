<template>
  <div class="registro-page">
    <div class="registro-container">
      <div class="registro-header">
        <div class="logo">
          <span class="material-icons">school</span>
        </div>
        <h1>Criar conta</h1>
        <p>Junte-se ao EduLink Moçambique</p>
      </div>

      <form @submit.prevent="handleRegistro" class="registro-form">
        <!-- Tipo de Usuário -->
        <div class="form-group">
          <label>Você é</label>
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

        <!-- Nome -->
        <div class="form-group">
          <label>Nome completo</label>
          <div class="input-group">
            <span class="material-icons">person</span>
            <input
              type="text"
              v-model="form.nome"
              placeholder="Seu nome"
              required
            >
          </div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label>Email</label>
          <div class="input-group">
            <span class="material-icons">email</span>
            <input
              type="email"
              v-model="form.email"
              placeholder="seu@email.com"
              required
            >
          </div>
        </div>

        <!-- Telefone -->
        <div class="form-group">
          <label>Telefone</label>
          <div class="input-group">
            <span class="material-icons">phone</span>
            <input
              type="tel"
              v-model="form.telefone"
              placeholder="84 123 4567"
              required
            >
          </div>
        </div>

        <!-- Campos específicos para estudante -->
        <template v-if="form.tipo === 'estudante'">
          <div class="form-group">
            <label>Nível de ensino</label>
            <div class="input-group">
              <span class="material-icons">grade</span>
              <select v-model="form.nivel" required>
                <option value="">Selecione</option>
                <option value="8ª Classe">8ª Classe</option>
                <option value="9ª Classe">9ª Classe</option>
                <option value="10ª Classe">10ª Classe</option>
                <option value="11ª Classe">11ª Classe</option>
                <option value="12ª Classe">12ª Classe</option>
                <option value="Ensino Superior">Ensino Superior</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Instituição (opcional)</label>
            <div class="input-group">
              <span class="material-icons">school</span>
              <input
                type="text"
                v-model="form.instituicao"
                placeholder="Nome da escola"
              >
            </div>
          </div>
        </template>

        <!-- Campos específicos para explicador -->
        <template v-if="form.tipo === 'explicador'">
          <div class="form-group">
            <label>Matérias</label>
            <div class="materias-selector">
              <button
                v-for="materia in materiasDisponiveis"
                :key="materia"
                type="button"
                class="materia-btn"
                :class="{ selected: form.materias?.includes(materia) }"
                @click="toggleMateria(materia)"
              >
                {{ materia }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Descrição / Formação</label>
            <div class="input-group">
              <span class="material-icons">description</span>
              <textarea
                v-model="form.descricao"
                placeholder="Fale um pouco sobre você..."
                rows="3"
              ></textarea>
            </div>
          </div>
        </template>

        <!-- Senha -->
        <div class="form-group">
          <label>Senha</label>
          <div class="input-group">
            <span class="material-icons">lock</span>
            <input
              :type="showPassword ? 'text' : 'password'"
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

        <!-- Confirmar senha -->
        <div class="form-group">
          <label>Confirmar senha</label>
          <div class="input-group">
            <span class="material-icons">lock</span>
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="form.password_confirmation"
              placeholder="••••••••"
              required
            >
            <button
              type="button"
              class="password-toggle"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <span class="material-icons">
                {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
          </div>
        </div>

        <!-- Termos -->
        <div class="form-group">
          <label class="checkbox">
            <input type="checkbox" v-model="termos">
            <span>Li e aceito os <a href="#">Termos de Uso</a></span>
          </label>
        </div>

        <!-- Botão de registro -->
        <button
          type="submit"
          class="registro-btn"
          :disabled="loading || !termos"
        >
          <span v-if="!loading">Criar conta</span>
          <span v-else class="loading-spinner"></span>
        </button>

        <!-- Link para login -->
        <p class="login-link">
          Já tem uma conta?
          <button type="button" @click="irParaLogin">Entrar</button>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import Api from '../services/api.js';

export default {
  name: 'RegistroPage',

  data() {
    return {
      form: {
        tipo: 'estudante',
        nome: '',
        email: '',
        telefone: '',
        password: '',
        password_confirmation: '',
        // Estudante
        nivel: '',
        instituicao: '',
        // Explicador
        materias: [],
        descricao: ''
      },
      tipos: [
        { value: 'estudante', label: 'Estudante', icon: 'person' },
        { value: 'explicador', label: 'Explicador', icon: 'school' }
      ],
      materiasDisponiveis: [
        'Matemática', 'Física', 'Química', 'Português',
        'História', 'Geografia', 'Biologia', 'Inglês'
      ],
      showPassword: false,
      showConfirmPassword: false,
      termos: false,
      loading: false
    };
  },

  methods: {
    toggleMateria(materia) {
      if (!this.form.materias) {
        this.form.materias = [];
      }
      const index = this.form.materias.indexOf(materia);
      if (index === -1) {
        this.form.materias.push(materia);
      } else {
        this.form.materias.splice(index, 1);
      }
    },

    async handleRegistro() {
      // Validações
      if (!this.termos) {
        this.$q.notify({
          type: 'warning',
          message: 'Você precisa aceitar os termos de uso'
        });
        return;
      }

      if (this.form.password !== this.form.password_confirmation) {
        this.$q.notify({
          type: 'warning',
          message: 'As senhas não coincidem'
        });
        return;
      }

      if (this.form.tipo === 'explicador' && this.form.materias.length === 0) {
        this.$q.notify({
          type: 'warning',
          message: 'Selecione pelo menos uma matéria'
        });
        return;
      }

      this.loading = true;

      try {
        // Preparar dados
        const userData = {
          nome: this.form.nome,
          email: this.form.email,
          password: this.form.password,
          telefone: this.form.telefone,
          tipo: this.form.tipo
        };

        if (this.form.tipo === 'estudante') {
          userData.nivel = this.form.nivel;
          userData.instituicao = this.form.instituicao;
        } else {
          userData.materias = this.form.materias;
          userData.descricao = this.form.descricao;
        }

        // Chamada à API
        const response = await Api.AuthService.register(userData);

        // Sucesso!
        this.$q.notify({
          type: 'positive',
          message: 'Conta criada com sucesso!',
          position: 'top',
          timeout: 2000
        });

        // Redirecionar baseado no tipo
        this.redirecionarPorTipo(response.user.tipo);

      } catch (error) {
        const mensagem = error.message || 'Erro ao criar conta';

        this.$q.notify({
          type: 'negative',
          message: mensagem,
          position: 'top',
          timeout: 4000
        });

        console.error('Erro no registro:', error);
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
        default:
          this.$router.push('/login');
      }
    },

    irParaLogin() {
      this.$router.push('/login');
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
  }
};
</script>

<style scoped>
.registro-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.registro-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  padding: 40px;
  max-height: 90vh;
  overflow-y: auto;
}

.registro-header {
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

.registro-header h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 5px;
}

.registro-header p {
  color: #666;
  font-size: 14px;
}

.registro-form {
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

.input-group input,
.input-group select,
.input-group textarea {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  font-family: inherit;
}

.input-group select {
  cursor: pointer;
}

.input-group textarea {
  resize: vertical;
  min-height: 60px;
}

.input-group input::placeholder,
.input-group textarea::placeholder {
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

.materias-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 5px;
}

.materia-btn {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
}

.materia-btn.selected {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
}

.checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox a {
  color: #667eea;
  text-decoration: none;
}

.checkbox a:hover {
  text-decoration: underline;
}

.registro-btn {
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

.registro-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.registro-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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

.login-link {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 20px;
}

.login-link button {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
}

.login-link button:hover {
  text-decoration: underline;
}

/* Responsividade */
@media (max-width: 480px) {
  .registro-container {
    padding: 30px 20px;
  }

  .tipo-btn {
    padding: 10px;
    font-size: 13px;
  }

  .tipo-btn .material-icons {
    font-size: 18px;
  }

  .materia-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
