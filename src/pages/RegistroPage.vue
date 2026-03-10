<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="registro-page">
        <!-- Imagem de fundo sutil -->
        <div class="background-image"></div>

        <!-- Container principal -->
        <div class="registro-container">
          <!-- Botão Voltar -->
          <button class="back-button" @click="voltar">
            <span class="material-icons">arrow_back</span>
          </button>

          <!-- Card de Registro -->
          <div class="registro-card">
            <!-- Header -->
            <div class="registro-header">
              <div class="logo">
                <span class="material-icons">school</span>
              </div>
              <h1>Criar conta</h1>
              <p>Junte-se ao EduLink Moçambique</p>
            </div>

            <!-- Progress Bar -->
            <div class="progress-container">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: `${(passoAtual / totalPassos) * 100}%` }"
                ></div>
              </div>
              <div class="steps-indicator">
                <span
                  v-for="n in totalPassos"
                  :key="n"
                  class="step-dot"
                  :class="{
                    active: n <= passoAtual,
                    completed: n < passoAtual
                  }"
                  @click="irParaPasso(n)"
                >
                  <span class="dot-inner"></span>
                </span>
              </div>
              <p class="step-text">Passo {{ passoAtual }} de {{ totalPassos }}</p>
            </div>

            <!-- Formulário -->
            <form @submit.prevent="proximoPasso" class="registro-form">
              <!-- PASSO 1: Tipo de Usuário e Dados Básicos -->
              <transition name="fade" mode="out-in">
                <div v-if="passoAtual === 1" key="passo1" class="step-content">
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
                    <div class="input-field" :class="{ 'field-focused': focusedField === 'nome' }">
                      <span class="material-icons">person_outline</span>
                      <input
                        type="text"
                        v-model="form.nome"
                        placeholder="Seu nome completo"
                        @focus="focusedField = 'nome'"
                        @blur="focusedField = null"
                        required
                      />
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="form-group">
                    <label>Email</label>
                    <div class="input-field" :class="{ 'field-focused': focusedField === 'email' }">
                      <span class="material-icons">mail_outline</span>
                      <input
                        type="email"
                        v-model="form.email"
                        placeholder="seu@email.com"
                        @focus="focusedField = 'email'"
                        @blur="focusedField = null"
                        required
                      />
                    </div>
                  </div>

                  <!-- Telefone -->
                  <div class="form-group">
                    <label>Telefone</label>
                    <div class="input-field" :class="{ 'field-focused': focusedField === 'telefone' }">
                      <span class="material-icons">phone_outlined</span>
                      <input
                        type="tel"
                        v-model="form.telefone"
                        placeholder="84 123 4567"
                        @focus="focusedField = 'telefone'"
                        @blur="focusedField = null"
                        required
                      />
                    </div>
                  </div>
                </div>

                <!-- PASSO 2: Campos Específicos por Tipo -->
                <div v-else-if="passoAtual === 2" key="passo2" class="step-content">
                  <!-- Campos para ESTUDANTE -->
                  <template v-if="form.tipo === 'estudante'">
                    <div class="form-group">
                      <label>Nível de ensino</label>
                      <div class="input-field select-field">
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
                      <div class="input-field">
                        <span class="material-icons">school</span>
                        <input
                          type="text"
                          v-model="form.instituicao"
                          placeholder="Nome da escola"
                        />
                      </div>
                    </div>
                  </template>

                  <!-- Campos para EXPLICADOR -->
                  <template v-else>
                    <div class="form-group">
                      <label>Matérias (selecione uma ou mais)</label>
                      <div class="materias-grid">
                        <button
                          v-for="materia in materiasDisponiveis"
                          :key="materia"
                          type="button"
                          class="materia-btn"
                          :class="{ selected: form.materias.includes(materia) }"
                          @click="toggleMateria(materia)"
                        >
                          {{ materia }}
                        </button>
                      </div>
                    </div>

                    <div class="form-group">
                      <label>Sobre você / Formação</label>
                      <div class="input-field textarea-field">
                        <span class="material-icons">description</span>
                        <textarea
                          v-model="form.descricao"
                          placeholder="Fale um pouco sobre sua formação e experiência..."
                          rows="4"
                        ></textarea>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- PASSO 3: Senha e Termos -->
                <div v-else-if="passoAtual === 3" key="passo3" class="step-content">
                  <!-- Senha -->
                  <div class="form-group">
                    <label>Senha</label>
                    <div class="input-field" :class="{ 'field-focused': focusedField === 'password' }">
                      <span class="material-icons">lock_outline</span>
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        v-model="form.password"
                        placeholder="••••••••"
                        @focus="focusedField = 'password'"
                        @blur="focusedField = null"
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
                    <div class="password-strength" v-if="form.password">
                      <div class="strength-bar">
                        <div
                          class="strength-fill"
                          :class="forcaSenha.class"
                          :style="{ width: forcaSenha.porcentagem + '%' }"
                        ></div>
                      </div>
                      <span class="strength-text">{{ forcaSenha.texto }}</span>
                    </div>
                  </div>

                  <!-- Confirmar senha -->
                  <div class="form-group">
                    <label>Confirmar senha</label>
                    <div class="input-field">
                      <span class="material-icons">lock_outline</span>
                      <input
                        :type="showConfirmPassword ? 'text' : 'password'"
                        v-model="form.password_confirmation"
                        placeholder="••••••••"
                        required
                      />
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
                    <div class="password-match" v-if="form.password_confirmation">
                      <span
                        class="material-icons"
                        :class="senhasCoincidem ? 'match-success' : 'match-error'"
                      >
                        {{ senhasCoincidem ? 'check_circle' : 'error' }}
                      </span>
                      <span :class="senhasCoincidem ? 'match-success' : 'match-error'">
                        {{ senhasCoincidem ? 'Senhas coincidem' : 'Senhas não coincidem' }}
                      </span>
                    </div>
                  </div>

                  <!-- Termos -->
                  <div class="form-group">
                    <label class="checkbox-container">
                      <input type="checkbox" v-model="termos" />
                      <span class="checkmark"></span>
                      <span class="checkbox-text">
                        Li e aceito os <a href="#" @click.prevent>Termos de Uso</a> e
                        <a href="#" @click.prevent>Política de Privacidade</a>
                      </span>
                    </label>
                  </div>
                </div>
              </transition>

              <!-- Navegação entre passos -->
              <div class="step-navigation">
                <button
                  v-if="passoAtual > 1"
                  type="button"
                  class="nav-btn prev-btn"
                  @click="passoAnterior"
                >
                  <span class="material-icons">arrow_back</span>
                  Voltar
                </button>

                <button
                  v-if="passoAtual < totalPassos"
                  type="submit"
                  class="nav-btn next-btn"
                  :disabled="!podeAvancar"
                >
                  Continuar
                  <span class="material-icons">arrow_forward</span>
                </button>

                <button
                  v-if="passoAtual === totalPassos"
                  type="button"
                  class="nav-btn submit-btn"
                  :disabled="loading || !podeFinalizar"
                  @click="handleRegistro"
                >
                  <span v-if="!loading">Criar conta</span>
                  <q-spinner v-else size="20px" color="white" />
                </button>
              </div>
            </form>

            <!-- Link para login -->
            <p class="login-link">
              Já tem uma conta?
              <button type="button" @click="irParaLogin">Entrar</button>
            </p>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import Api from '../services/api.js';

export default {
  name: 'RegistroPage',

  data() {
    return {
      passoAtual: 1,
      totalPassos: 3,
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
        'História', 'Geografia', 'Biologia', 'Inglês',
        'Filosofia', 'Desenho', 'Educação Física', 'TIC'
      ],
      showPassword: false,
      showConfirmPassword: false,
      termos: false,
      loading: false,
      focusedField: null
    };
  },

  computed: {
    // Validação do passo 1
    passo1Valido() {
      return this.form.nome &&
             this.form.email &&
             this.form.telefone &&
             this.form.tipo;
    },

    // Validação do passo 2
    passo2Valido() {
      if (this.form.tipo === 'estudante') {
        return this.form.nivel;
      } else {
        return this.form.materias.length > 0;
      }
    },

    // Validação do passo 3
    passo3Valido() {
      return this.form.password &&
             this.form.password_confirmation &&
             this.senhasCoincidem &&
             this.termos;
    },

    // Controle de avanço
    podeAvancar() {
      if (this.passoAtual === 1) return this.passo1Valido;
      if (this.passoAtual === 2) return this.passo2Valido;
      return false;
    },

    podeFinalizar() {
      return this.passo3Valido;
    },

    senhasCoincidem() {
      return this.form.password === this.form.password_confirmation;
    },

    // Força da senha
    forcaSenha() {
      const senha = this.form.password;
      if (!senha) return { texto: '', porcentagem: 0, class: '' };

      let forca = 0;

      // Comprimento
      if (senha.length >= 6) forca += 20;
      if (senha.length >= 8) forca += 10;

      // Números
      if (/\d/.test(senha)) forca += 20;

      // Letras maiúsculas
      if (/[A-Z]/.test(senha)) forca += 20;

      // Caracteres especiais
      if (/[!@#$%^&*]/.test(senha)) forca += 20;

      // Mix de caracteres
      if (/[a-z]/.test(senha) && /[A-Z]/.test(senha) && /\d/.test(senha) && /[!@#$%^&*]/.test(senha)) {
        forca += 10;
      }

      if (forca <= 30) {
        return { texto: 'Fraca', porcentagem: forca, class: 'fraca' };
      } else if (forca <= 60) {
        return { texto: 'Média', porcentagem: forca, class: 'media' };
      } else if (forca <= 80) {
        return { texto: 'Boa', porcentagem: forca, class: 'boa' };
      } else {
        return { texto: 'Forte', porcentagem: 100, class: 'forte' };
      }
    }
  },

  methods: {
    toggleMateria(materia) {
      const index = this.form.materias.indexOf(materia);
      if (index === -1) {
        this.form.materias.push(materia);
      } else {
        this.form.materias.splice(index, 1);
      }
    },

    voltar() {
      this.$router.push('/');
    },

    proximoPasso() {
      if (this.podeAvancar && this.passoAtual < this.totalPassos) {
        this.passoAtual++;
      }
    },

    passoAnterior() {
      if (this.passoAtual > 1) {
        this.passoAtual--;
      }
    },

    irParaPasso(passo) {
      // Só permite ir para passos já concluídos
      if (passo < this.passoAtual) {
        this.passoAtual = passo;
      }
    },

    async handleRegistro() {
      if (!this.podeFinalizar) return;

      this.loading = true;

      try {
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

        const response = await Api.AuthService.register(userData);

        this.$q.notify({
          type: 'positive',
          message: 'Conta criada com sucesso!',
          position: 'top',
          icon: 'check_circle'
        });

        this.redirecionarPorTipo(response.user.tipo);

      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.message || 'Erro ao criar conta',
          position: 'top',
          icon: 'error'
        });
      } finally {
        this.loading = false;
      }
    },

    redirecionarPorTipo(tipo) {
      const rotas = {
        estudante: '/estudante',
        explicador: '/explicador'
      };
      this.$router.push(rotas[tipo] || '/login');
    },

    irParaLogin() {
      this.$router.push('/login');
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

.registro-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #f5f7fa;
  padding: 16px;
}

/* Imagem de fundo */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  z-index: 0;
}

/* Container principal */
.registro-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 600px;
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

/* Card de registro */
.registro-card {
  background: white;
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
}

/* Header */
.registro-header {
  text-align: center;
  margin-bottom: 24px;
}

.logo {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.logo .material-icons {
  font-size: 36px;
  color: white;
}

.registro-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 6px;
}

.registro-header p {
  font-size: 14px;
  color: #718096;
}

/* Progress Bar */
.progress-container {
  margin-bottom: 30px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.steps-indicator {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.step-dot.active {
  background: #667eea;
  transform: scale(1.1);
}

.step-dot.completed {
  background: #48bb78;
}

.dot-inner {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}

.step-text {
  text-align: center;
  font-size: 13px;
  color: #718096;
  font-weight: 500;
}

/* Transições entre passos */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.step-content {
  min-height: 300px;
}

/* Formulário */
.registro-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
}

/* Seletor de tipo */
.tipo-selector {
  display: flex;
  gap: 8px;
  background: #f7fafc;
  padding: 4px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.tipo-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 8px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #718096;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.tipo-btn .material-icons {
  font-size: 18px;
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

/* Campos de input */
.input-field {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s;
  position: relative;
}

.input-field:focus-within {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-field.field-focused {
  border-color: #667eea;
  background: white;
}

.input-field .material-icons {
  font-size: 18px;
  color: #a0aec0;
}

.input-field input,
.input-field select,
.input-field textarea {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #2d3748;
  outline: none;
  font-family: inherit;
}

.input-field input::placeholder,
.input-field textarea::placeholder {
  color: #a0aec0;
}

.input-field select {
  cursor: pointer;
  width: 100%;
}

.input-field.textarea-field {
  align-items: flex-start;
}

.input-field.textarea-field textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

/* Botão toggle senha */
.password-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.password-toggle:hover {
  background: rgba(102, 126, 234, 0.1);
}

.password-toggle .material-icons {
  font-size: 18px;
  color: #718096;
}

.password-toggle:hover .material-icons {
  color: #667eea;
}

/* Força da senha */
.password-strength {
  margin-top: 8px;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.strength-fill.fraca {
  background: #f56565;
}

.strength-fill.media {
  background: #ed8936;
}

.strength-fill.boa {
  background: #48bb78;
}

.strength-fill.forte {
  background: #38a169;
}

.strength-text {
  font-size: 12px;
  color: #718096;
}

/* Validação de senha */
.password-match {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
}

.match-success {
  color: #48bb78;
}

.match-error {
  color: #f56565;
}

.password-match .material-icons {
  font-size: 16px;
}

/* Grid de matérias */
.materias-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.materia-btn {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 30px;
  background: white;
  color: #4a5568;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.materia-btn:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f7fafc;
}

.materia-btn.selected {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
  color: white;
}

/* Checkbox de termos */
.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked + .checkmark {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
}

.checkbox-container input:checked + .checkmark:after {
  display: block;
}

.checkbox-text {
  font-size: 13px;
  color: #4a5568;
  line-height: 1.5;
}

.checkbox-text a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.checkbox-text a:hover {
  text-decoration: underline;
}

/* Navegação entre passos */
.step-navigation {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.nav-btn {
  flex: 1;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.prev-btn {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.prev-btn:hover {
  background: #edf2f7;
}

.next-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.next-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.submit-btn {
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  width: 100%;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(72, 187, 120, 0.3);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn .material-icons {
  font-size: 18px;
}

/* Link para login */
.login-link {
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: #718096;
}

.login-link button {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px;
}

.login-link button:hover {
  text-decoration: underline;
}

/* Responsividade Mobile */
@media (max-width: 640px) {
  .registro-card {
    padding: 28px 20px;
  }

  .tipo-btn {
    padding: 8px 4px;
    font-size: 12px;
  }

  .tipo-btn .material-icons {
    font-size: 16px;
  }

  .materias-grid {
    gap: 6px;
  }

  .materia-btn {
    padding: 6px 12px;
    font-size: 12px;
  }

  .step-navigation {
    flex-direction: column;
  }

  .checkbox-text {
    font-size: 12px;
  }
}

/* Responsividade Desktop */
@media (min-width: 1025px) {
  .registro-container {
    max-width: 650px;
  }

  .registro-card {
    padding: 48px 48px;
  }

  .registro-header h1 {
    font-size: 28px;
  }

  .tipo-btn {
    padding: 12px 10px;
    font-size: 14px;
  }

  .input-field {
    padding: 14px 16px;
  }

  .input-field input,
  .input-field select,
  .input-field textarea {
    font-size: 15px;
  }

  .nav-btn {
    height: 52px;
    font-size: 15px;
  }
}
</style>
