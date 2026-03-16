<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="notfound-page">
        <!-- Header simplificado -->
        <div class="header">
          <div class="header-container">
            <div class="header-left">
              <div class="logo-wrapper" @click="irParaHome">
                <span class="material-icons logo-icon">school</span>
                <span class="logo-text">EduLink</span>
              </div>
            </div>
            <div class="header-right">
              <q-btn flat label="Entrar" class="login-btn-header" @click="irParaLogin" />
              <q-btn outline label="Criar conta" class="register-btn-header" @click="irParaRegistro" />
            </div>
          </div>
        </div>

        <!-- Fundo animado -->
        <div class="animated-bg">
          <div class="gradient-orb orb1"></div>
          <div class="gradient-orb orb2"></div>
          <div class="gradient-orb orb3"></div>
        </div>

        <!-- Conteúdo 404 -->
        <div class="content">
          <div class="notfound-container">
            <div class="notfound-content">
              <div class="error-code">404</div>

              <div class="error-icon">
                <span class="material-icons">search_off</span>
              </div>

              <h1 class="error-title">Página não encontrada</h1>

              <p class="error-message">
                A página que você está procurando pode ter sido removida,
                teve o nome alterado ou está temporariamente indisponível.
              </p>

              <div class="error-actions">
                <q-btn class="home-btn" @click="irParaHome">
                  <span class="btn-content">
                    <span class="material-icons">home</span>
                    <span>Voltar ao início</span>
                  </span>
                </q-btn>

                <q-btn class="login-btn" flat @click="irParaLogin">
                  <span class="btn-content">
                    <span>Fazer login</span>
                    <span class="material-icons">arrow_forward</span>
                  </span>
                </q-btn>
              </div>

              <!-- Sugestões úteis -->
              <div class="suggestions">
                <h3>Você pode estar procurando por:</h3>
                <div class="suggestion-links">
                  <a href="#" @click.prevent="irParaPlanos">📚 Planos de estudo</a>
                  <a href="#" @click.prevent="irParaExplicadores">👨‍🏫 Explicadores</a>
                  <a href="#" @click.prevent="irParaPrecos">💰 Preços</a>
                  <a href="#" @click.prevent="irParaSobre">ℹ️ Sobre nós</a>
                </div>
              </div>
            </div>

            <!-- Ilustração 404 -->
            <div class="notfound-illustration">
              <img src="https://i.pinimg.com/originals/5e/0e/3a/5e0e3a5a8d7b8d9e4f5c6d7e8f9a0b1c.png"
                   alt="404 Illustration"
                   @error="handleImageError">

              <div class="floating-elements">
                <div class="float-item">404</div>
                <div class="float-item">?</div>
                <div class="float-item">!</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer simplificado -->
        <footer class="footer">
          <div class="footer-container">
            <div class="footer-bottom">
              <p>© 2024 EduLink Moçambique. Todos os direitos reservados.</p>
              <div class="footer-flags">
                <span class="material-icons">flag</span>
                <span>Feito em Moçambique 🇲🇿</span>
              </div>
            </div>
          </div>
        </footer>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const irParaHome = () => {
  router.push('/')
}

const irParaLogin = () => {
  router.push('/login')
}

const irParaRegistro = () => {
  router.push('/registro')
}

const irParaPlanos = () => {
  router.push('/#planos')
}

const irParaExplicadores = () => {
  router.push('/#explicadores')
}

const irParaPrecos = () => {
  router.push('/#precos')
}

const irParaSobre = () => {
  router.push('/#sobre')
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/500x400?text=404+Not+Found'
}
</script>

<style lang="scss" scoped>
// Reutilizar variáveis do IndexPage
$primary: #667eea;
$secondary: #764ba2;
$gradient: linear-gradient(135deg, $primary 0%, $secondary 100%);
$text-dark: #1a202c;
$text-light: #4a5568;

// Mixins responsivos
@mixin mobile {
  @media (max-width: 640px) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: 641px) and (max-width: 1024px) {
    @content;
  }
}

// Header (reutilizado do IndexPage)
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include mobile {
    padding: 12px 16px;
  }
}

.header-left {
  .logo-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .logo-icon {
    font-size: 32px;
    background: $gradient;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .logo-text {
    font-size: 22px;
    font-weight: 700;
    background: $gradient;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    @include mobile {
      font-size: 18px;
    }
  }
}

.header-right {
  display: flex;
  gap: 12px;
}

.login-btn-header {
  color: $primary;
  font-weight: 600;
}

.register-btn-header {
  color: $primary;
  border-color: $primary;
  font-weight: 600;

  @include mobile {
    display: none;
  }
}

// Fundo animado (reutilizado)
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.2;

  &.orb1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, $primary, transparent 70%);
    top: -200px;
    right: -200px;
    animation: float 25s infinite;
  }

  &.orb2 {
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, $secondary, transparent 70%);
    bottom: -300px;
    left: -300px;
    animation: float 30s infinite reverse;
  }

  &.orb3 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #ff6b6b, transparent 70%);
    top: 40%;
    left: 50%;
    animation: float 20s infinite 2s;
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(100px, -100px) scale(1.1); }
  66% { transform: translate(-50px, 50px) scale(0.9); }
}

// Conteúdo principal
.content {
  position: relative;
  z-index: 1;
  margin-top: 80px;
  min-height: calc(100vh - 80px - 100px);
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.notfound-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 60px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;

  @include mobile {
    grid-template-columns: 1fr;
    padding: 40px 16px;
    gap: 30px;
    text-align: center;
  }
}

.notfound-content {
  max-width: 500px;

  @include mobile {
    margin: 0 auto;
  }
}

.error-code {
  font-size: 120px;
  font-weight: 800;
  line-height: 1;
  background: $gradient;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;

  @include mobile {
    font-size: 80px;
  }
}

.error-icon {
  margin-bottom: 20px;

  .material-icons {
    font-size: 64px;
    color: $primary;
    opacity: 0.5;

    @include mobile {
      font-size: 48px;
    }
  }
}

.error-title {
  font-size: 36px;
  font-weight: 700;
  color: $text-dark;
  margin: 0 0 20px;

  @include mobile {
    font-size: 28px;
  }
}

.error-message {
  font-size: 18px;
  color: $text-light;
  line-height: 1.6;
  margin: 0 0 30px;

  @include mobile {
    font-size: 16px;
  }
}

.error-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;

  @include mobile {
    flex-direction: column;
  }
}

.home-btn {
  height: 56px;
  padding: 0 32px;
  background: $gradient;
  color: white;
  border-radius: 28px;
  font-size: 16px;
  font-weight: 600;

  .btn-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.login-btn {
  height: 56px;
  padding: 0 32px;
  color: $primary;
  border: 2px solid $primary;
  border-radius: 28px;
  font-size: 16px;
  font-weight: 600;

  .btn-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.suggestions {
  background: rgba($primary, 0.05);
  padding: 24px;
  border-radius: 20px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: $text-dark;
    margin: 0 0 16px;
  }
}

.suggestion-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  a {
    color: $primary;
    text-decoration: none;
    font-size: 15px;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s;
    text-align: center;
    background: white;

    &:hover {
      background: $primary;
      color: white;
      transform: translateY(-2px);
    }
  }
}

.notfound-illustration {
  position: relative;
  display: flex;
  justify-content: center;

  img {
    max-width: 100%;
    height: auto;
    animation: floatImage 6s infinite ease-in-out;
  }
}

@keyframes floatImage {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.float-item {
  position: absolute;
  font-size: 24px;
  font-weight: 700;
  color: $primary;
  opacity: 0.3;
  animation: float 3s infinite;

  &:nth-child(1) {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    bottom: 30%;
    right: 20%;
    animation-delay: 0.5s;
  }

  &:nth-child(3) {
    top: 40%;
    right: 10%;
    animation-delay: 1s;
  }
}

// Footer
.footer {
  background: #1a202c;
  color: white;
  padding: 20px 24px;
  position: relative;
  z-index: 1;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #a0aec0;
  font-size: 14px;

  @include mobile {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}

.footer-flags {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
