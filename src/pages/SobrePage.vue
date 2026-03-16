<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="sobre-page">
        <!-- Header com navegação -->
        <div class="header">
          <div class="header-container">
            <div class="header-left">
              <div class="logo-wrapper" @click="irParaHome">
                <span class="material-icons logo-icon">school</span>
                <span class="logo-text">EduLink</span>
              </div>
            </div>

            <!-- Menu Desktop -->
            <div class="header-menu desktop-only">
              <router-link to="/sobre" class="active">Sobre</router-link>
              <a href="#" @click.prevent="irParaHomeComPrecos">Preços</a>
            </div>

            <div class="header-right">
              <q-btn flat label="Entrar" class="login-btn-header" @click="irParaLogin" />
              <q-btn
                outline
                label="Criar conta"
                class="register-btn-header"
                @click="irParaRegistro"
              />

              <!-- Menu Mobile -->
              <q-btn flat round dense icon="menu" class="mobile-only" @click="mobileMenu = true" />
            </div>
          </div>
        </div>

        <!-- Mobile Menu Drawer - COM ÍCONES -->
        <q-drawer v-model="mobileMenu" side="right" bordered class="mobile-drawer">
          <div class="drawer-content">
            <div class="drawer-header">
              <span class="material-icons">school</span>
              <span>EduLink</span>
              <q-btn flat round dense icon="close" @click="mobileMenu = false" />
            </div>
            <q-list>
              <q-item clickable v-close-popup to="/" class="menu-item">
                <q-item-section avatar>
                  <q-icon name="home" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Início</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup to="/sobre" class="menu-item">
                <q-item-section avatar>
                  <q-icon name="info" color="blue" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Sobre</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="irParaHomeComPrecos" class="menu-item">
                <q-item-section avatar>
                  <q-icon name="attach_money" color="green" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Preços</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator spaced />

              <q-item clickable v-close-popup @click="irParaLogin" class="menu-item">
                <q-item-section avatar>
                  <q-icon name="login" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Entrar</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="irParaRegistro" class="menu-item">
                <q-item-section avatar>
                  <q-icon name="person_add" color="secondary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Criar conta</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-drawer>

        <!-- Fundo com gradiente animado -->
        <div class="animated-bg">
          <div class="gradient-orb orb1"></div>
          <div class="gradient-orb orb2"></div>
          <div class="gradient-orb orb3"></div>
        </div>

        <!-- Conteúdo principal -->
        <div class="content">
          <!-- Hero Section Sobre -->
          <div class="hero-section">
            <div class="hero-content text-center">
              <div class="badge-wrapper">
                <span class="feature-badge">
                  <span class="material-icons">flag</span>
                  <span>Feito em Moçambique 🇲🇿</span>
                </span>
              </div>

              <h1 class="hero-title">
                Nossa missão é transformar a
                <span class="gradient-text">educação</span>
                em Moçambique
              </h1>

              <p class="hero-subtitle">
                Conectar estudantes a explicadores qualificados, tornando o aprendizado acessível,
                flexível e eficaz para todos os moçambicanos.
              </p>
            </div>

            <div class="hero-image">
              <div class="image-container">
                <img
                  src="https://i.pinimg.com/originals/a4/31/32/a43132e257a903a5191b031446efae2d.jpg"
                  alt="EduLink Hero"
                  class="main-illustration"
                />
              </div>
            </div>
          </div>

          <!-- Nossa História -->
          <div class="historia-section">
            <div class="container">
              <h2 class="section-title">Nossa <span class="gradient-text">História</span></h2>

              <div class="historia-grid">
                <div class="historia-content">
                  <p class="destaque">
                    A EduLink nasceu em 2024 com um sonho: transformar a educação em Moçambique.
                  </p>
                  <p>
                    Tudo começou quando um grupo de jovens moçambicanos percebeu a dificuldade que
                    estudantes de todo o país enfrentavam para encontrar explicadores qualificados e
                    materiais de estudo de qualidade.
                  </p>
                  <p>
                    Hoje, somos a maior plataforma de educação do país, conectando mais de 500
                    estudantes a 50+ explicadores verificados, com mais de 1000 aulas realizadas e
                    uma avaliação média de 4.8 estrelas.
                  </p>
                </div>
                <div class="historia-stats">
                  <div class="stat-card">
                    <span class="stat-number">2024</span>
                    <span class="stat-label">Ano de fundação</span>
                  </div>
                  <div class="stat-card">
                    <span class="stat-number">500+</span>
                    <span class="stat-label">Estudantes</span>
                  </div>
                  <div class="stat-card">
                    <span class="stat-number">50+</span>
                    <span class="stat-label">Explicadores</span>
                  </div>
                  <div class="stat-card">
                    <span class="stat-number">4.8</span>
                    <span class="stat-label">Avaliação</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- NOSSOS VALORES -->
          <div class="valores-section">
            <div class="container">
              <h2 class="section-title">Nossos <span class="gradient-text">Valores</span></h2>

              <!-- Versão Desktop -->
              <div class="valores-grid desktop-view">
                <div class="valor-card" v-for="(valor, index) in valores" :key="'desktop-' + index">
                  <div class="card-icon">
                    <span class="material-icons">{{ valor.icone }}</span>
                  </div>
                  <h3>{{ valor.titulo }}</h3>
                  <p>{{ valor.descricao }}</p>
                </div>
              </div>

              <!-- Versão Mobile (carrossel) -->
              <div class="mobile-carousel mobile-view">
                <div class="carousel-header">
                  <span class="material-icons">swipe</span>
                  <span>Deslize para ver mais</span>
                </div>

                <div class="carousel-container" ref="carouselContainer">
                  <div
                    class="carousel-track"
                    :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
                  >
                    <div
                      class="carousel-slide"
                      v-for="(valor, index) in valores"
                      :key="'mobile-' + index"
                    >
                      <div class="valor-card">
                        <div class="card-icon">
                          <span class="material-icons">{{ valor.icone }}</span>
                        </div>
                        <h3>{{ valor.titulo }}</h3>
                        <p>{{ valor.descricao }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Indicadores de slide -->
                <div class="carousel-indicators">
                  <button
                    v-for="(_, index) in valores"
                    :key="index"
                    class="indicator"
                    :class="{ active: currentSlide === index }"
                    @click="goToSlide(index)"
                  ></button>
                </div>
              </div>
            </div>
          </div>

          <!-- NOSSA EQUIPE -->
          <div class="equipe-section">
            <div class="container">
              <h2 class="section-title">Conheça nossa <span class="gradient-text">equipe</span></h2>

              <!-- Versão Desktop (4 cards) -->
              <div class="equipe-grid desktop-view">
                <div class="membro-card" v-for="membro in equipe" :key="membro.nome">
                  <q-avatar size="120px" class="membro-avatar">
                    <img :src="membro.avatar" />
                  </q-avatar>
                  <h3>{{ membro.nome }}</h3>
                  <p class="cargo">{{ membro.cargo }}</p>
                  <p class="bio">{{ membro.bio }}</p>
                  <div class="social-links">
                    <a href="#" class="social-link">
                      <span class="material-icons">linkedin</span>
                    </a>
                    <a href="#" class="social-link">
                      <span class="material-icons">email</span>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Versão Mobile (2 colunas) -->
              <div class="equipe-mobile-grid mobile-view">
                <div class="mobile-grid-container">
                  <div class="mobile-grid-row" v-for="i in Math.ceil(equipe.length / 2)" :key="i">
                    <div class="mobile-grid-col" v-for="j in 2" :key="j">
                      <div v-if="equipe[(i - 1) * 2 + (j - 1)]" class="membro-card">
                        <q-avatar size="100px" class="membro-avatar">
                          <img :src="equipe[(i - 1) * 2 + (j - 1)].avatar" />
                        </q-avatar>
                        <h3>{{ equipe[(i - 1) * 2 + (j - 1)].nome }}</h3>
                        <p class="cargo">{{ equipe[(i - 1) * 2 + (j - 1)].cargo }}</p>
                        <p class="bio">{{ equipe[(i - 1) * 2 + (j - 1)].bio }}</p>
                        <div class="social-links">
                          <a href="#" class="social-link">
                            <span class="material-icons">linkedin</span>
                          </a>
                          <a href="#" class="social-link">
                            <span class="material-icons">email</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Impacto Social -->
          <div class="impacto-section">
            <div class="container">
              <div class="impacto-content">
                <h2 class="section-title">
                  Nosso <span class="gradient-text">Impacto</span> Social
                </h2>

                <div class="impacto-stats">
                  <div class="impacto-stat">
                    <span class="stat-number">500+</span>
                    <span class="stat-label">Estudantes impactados</span>
                  </div>
                  <div class="impacto-stat">
                    <span class="stat-number">50+</span>
                    <span class="stat-label">Empregos criados</span>
                  </div>
                  <div class="impacto-stat">
                    <span class="stat-number">10</span>
                    <span class="stat-label">Províncias alcançadas</span>
                  </div>
                  <div class="impacto-stat">
                    <span class="stat-number">1000+</span>
                    <span class="stat-label">Horas de aula</span>
                  </div>
                </div>

                <p class="impacto-texto">
                  Acreditamos que a educação é a chave para transformar Moçambique. Por isso,
                  destinamos 10% das nossas aulas para estudantes de escolas públicas e comunidades
                  carentes.
                </p>
              </div>
            </div>
          </div>

          <!-- CTA Final -->
          <div class="cta-section">
            <div class="cta-container">
              <h2 class="cta-title">Faça parte desta história</h2>
              <p class="cta-text">
                Junte-se a nós na missão de transformar a educação em Moçambique
              </p>

              <div class="cta-actions">
                <q-btn class="cta-login-btn pulse-effect" @click="irParaLogin">
                  <span class="btn-content">
                    <span class="material-icons">login</span>
                    <span>Começar agora</span>
                  </span>
                </q-btn>

                <q-btn class="cta-register-btn" @click="irParaRegistro">
                  <span class="btn-content">
                    <span>Criar conta grátis</span>
                    <span class="material-icons">arrow_forward</span>
                  </span>
                </q-btn>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <footer class="footer">
            <div class="footer-container">
              <div class="footer-grid">
                <div class="footer-col">
                  <h4>EduLink</h4>
                  <p>A plataforma #1 de educação em Moçambique</p>
                  <div class="social-links">
                    <a href="#" class="social-link">
                      <span class="material-icons">facebook</span>
                    </a>
                    <a href="#" class="social-link">
                      <span class="material-icons">instagram</span>
                    </a>
                    <a href="#" class="social-link">
                      <span class="material-icons">linkedin</span>
                    </a>
                    <a href="#" class="social-link">
                      <span class="material-icons">youtube_searched_for</span>
                    </a>
                  </div>
                </div>

                <div class="footer-col">
                  <h4>Produto</h4>
                  <ul>
                    <li><a href="#" @click.prevent="irParaHomeComPrecos">Preços</a></li>
                    <li><a href="#">FAQ</a></li>
                    <li><a href="#">Blog</a></li>
                  </ul>
                </div>

                <div class="footer-col">
                  <h4>Empresa</h4>
                  <ul>
                    <li><router-link to="/sobre">Sobre nós</router-link></li>
                    <li><a href="#">Carreiras</a></li>
                    <li><a href="#">Imprensa</a></li>
                  </ul>
                </div>

                <div class="footer-col">
                  <h4>Legal</h4>
                  <ul>
                    <li><a href="#">Termos de uso</a></li>
                    <li><a href="#">Política de privacidade</a></li>
                    <li><a href="#">Cookies</a></li>
                    <li><a href="#">Ajuda</a></li>
                  </ul>
                </div>
              </div>

              <div class="footer-bottom">
                <p>© 2024 EduLink Moçambique. Todos os direitos reservados.</p>
                <div class="footer-flags">
                  <span class="material-icons">flag</span>
                  <span>Feito em Moçambique 🇲🇿</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mobileMenu = ref(false)

// Dados dos valores
const valores = ref([
  {
    icone: 'accessibility_new',
    titulo: 'Acessibilidade',
    descricao:
      'Educação de qualidade deve estar ao alcance de todos, independentemente da localização ou condição financeira.',
  },
  {
    icone: 'verified',
    titulo: 'Qualidade',
    descricao:
      'Selecionamos rigorosamente nossos explicadores e materiais para garantir o melhor aprendizado.',
  },
  {
    icone: 'handshake',
    titulo: 'Confiança',
    descricao:
      'Construímos relações baseadas na transparência e respeito entre estudantes e explicadores.',
  },
  {
    icone: 'emoji_objects',
    titulo: 'Inovação',
    descricao:
      'Buscamos constantemente novas formas de tornar o aprendizado mais eficiente e engajador.',
  },
])

// Dados da equipe
const equipe = ref([
  {
    nome: 'Ana Mondlane',
    cargo: 'CEO & Co-fundadora',
    bio: 'Explicadora há 10 anos, apaixonada por transformar a educação em Moçambique.',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    nome: 'Carlos Tembe',
    cargo: 'CTO & Co-fundador',
    bio: 'Engenheiro de software com experiência em edtech e inovação educacional.',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    nome: 'Maria José',
    cargo: 'Diretora de Operações',
    bio: 'Especialista em gestão educacional e desenvolvimento de currículos.',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    nome: 'João Sitoe',
    cargo: 'Coordenador de Explicadores',
    bio: 'Explicador experiente, responsável pela seleção e treinamento dos profissionais.',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
])

// Controle do carrossel
const currentSlide = ref(0)
const carouselContainer = ref(null)
let touchStartX = 0
let touchEndX = 0
let isDragging = false

// Navegação do carrossel
const nextSlide = () => {
  if (currentSlide.value < valores.value.length - 1) {
    currentSlide.value++
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// Touch events para swipe
const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
  isDragging = true
}

const handleTouchMove = (e) => {
  if (!isDragging) return
  touchEndX = e.touches[0].clientX
}

const handleTouchEnd = () => {
  if (!isDragging) return

  const swipeThreshold = 50
  const diff = touchStartX - touchEndX

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide()
    } else {
      prevSlide()
    }
  }

  isDragging = false
  touchStartX = 0
  touchEndX = 0
}

// Lifecycle hooks
onMounted(() => {
  const container = carouselContainer.value
  if (container) {
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd)
  }
})

onUnmounted(() => {
  const container = carouselContainer.value
  if (container) {
    container.removeEventListener('touchstart', handleTouchStart)
    container.removeEventListener('touchmove', handleTouchMove)
    container.removeEventListener('touchend', handleTouchEnd)
  }
})

// Métodos de navegação
const irParaHome = () => {
  router.push('/')
}

const irParaHomeComPrecos = () => {
  router.push('/#precos')
  setTimeout(() => {
    const element = document.querySelector('.plans-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}

const irParaLogin = () => {
  router.push('/login')
}

const irParaRegistro = () => {
  router.push('/registro')
}
</script>

<style lang="scss" scoped>
// Variáveis
$primary: #667eea;
$secondary: #764ba2;
$gradient: linear-gradient(135deg, $primary 0%, $secondary 100%);
$text-dark: #1a202c;
$text-light: #4a5568;

// Breakpoints
$mobile-max: 640px;
$tablet-min: 641px;
$desktop-min: 1025px;

// Mixins responsivos
@mixin mobile {
  @media (max-width: $mobile-max) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: $tablet-min) and (max-width: 1024px) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: $desktop-min) {
    @content;
  }
}

// Classes de visibilidade
.desktop-view {
  display: block;

  @include mobile {
    display: none !important;
  }
}

.mobile-view {
  display: none;

  @include mobile {
    display: block !important;
  }
}

.desktop-only {
  @include mobile {
    display: none !important;
  }
  @include tablet {
    display: flex !important;
  }
}

.mobile-only {
  @include desktop {
    display: none !important;
  }
  @include tablet {
    display: none !important;
  }
  @include mobile {
    display: block !important;
  }
}

.text-center {
  text-align: center;
}

// Header
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

.header-menu {
  display: flex;
  gap: 32px;

  a {
    color: $text-dark;
    text-decoration: none;
    font-weight: 500;
    font-size: 15px;
    transition: color 0.3s;
    cursor: pointer;

    &:hover,
    &.active {
      color: $primary;
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

// Mobile Drawer melhorado com ícones
.mobile-drawer {
  .drawer-content {
    padding: 20px;
  }

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    span:first-child {
      font-size: 32px;
      color: $primary;
    }

    span:nth-child(2) {
      font-size: 20px;
      font-weight: 700;
      flex: 1;
      margin-left: 10px;
      background: $gradient;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .menu-item {
    border-radius: 10px;
    margin: 4px 8px;
    padding: 12px 16px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba($primary, 0.08);
      transform: translateX(5px);
    }

    .q-item__section--avatar {
      min-width: 40px;

      .q-icon {
        font-size: 24px;
        transition: transform 0.3s ease;
      }
    }

    .q-item__label {
      font-size: 15px;
      font-weight: 500;
    }

    &:hover .q-icon {
      transform: scale(1.1);
    }
  }

  .q-separator {
    margin: 16px 24px;
    background: rgba($primary, 0.2);
  }

  .router-link-active {
    background: rgba($primary, 0.12);

    .q-icon {
      color: $primary !important;
    }

    .q-item__label {
      color: $primary;
      font-weight: 600;
    }
  }
}

// Fundo animado
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
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(100px, -100px) scale(1.1);
  }
  66% {
    transform: translate(-50px, 50px) scale(0.9);
  }
}

// Conteúdo principal
.content {
  position: relative;
  z-index: 1;
  margin-top: 80px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

// Hero Section
.hero-section {
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
    gap: 40px;
  }

  @include tablet {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.hero-content {
  max-width: 600px;

  @include mobile {
    text-align: center;
  }
}

.badge-wrapper {
  margin-bottom: 24px;
}

.feature-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba($primary, 0.1);
  color: $primary;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;

  .material-icons {
    font-size: 18px;
  }
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  color: $text-dark;
  margin: 0 0 20px;

  @include mobile {
    font-size: 36px;
  }

  @include tablet {
    font-size: 42px;
  }
}

.gradient-text {
  background: $gradient;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.hero-subtitle {
  font-size: 18px;
  color: $text-light;
  line-height: 1.6;
  margin: 0;

  @include mobile {
    font-size: 16px;
  }
}

.hero-image {
  position: relative;
  display: flex;
  justify-content: center;
}

.image-container {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.main-illustration {
  width: 100%;
  height: auto;
  animation: floatImage 6s infinite ease-in-out;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

@keyframes floatImage {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

// História Section
.historia-section {
  padding: 80px 0;
  background: white;
}

.historia-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;

  @include mobile {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.historia-content {
  p {
    font-size: 16px;
    line-height: 1.8;
    color: $text-light;
    margin-bottom: 20px;

    &.destaque {
      font-size: 20px;
      font-weight: 600;
      color: $primary;
      margin-bottom: 20px;
    }
  }
}

.historia-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.stat-card {
  text-align: center;
  padding: 30px;
  background: rgba($primary, 0.05);
  border-radius: 16px;

  .stat-number {
    display: block;
    font-size: 36px;
    font-weight: 700;
    color: $primary;
    margin-bottom: 8px;
  }

  .stat-label {
    font-size: 14px;
    color: $text-light;
  }
}

// VALORES SECTION
.valores-section {
  padding: 80px 0;
  background: rgba($primary, 0.02);
}

// Grid Desktop
.valores-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }
}

// CARROSSEL MOBILE
.mobile-carousel {
  width: 100%;
  position: relative;
  padding: 20px 0 40px;
  overflow: hidden;
}

.carousel-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  color: $text-light;
  font-size: 14px;

  .material-icons {
    font-size: 20px;
    color: $primary;
    animation: swipe 1.5s infinite;
  }
}

@keyframes swipe {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
  }
}

.carousel-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  touch-action: pan-y;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.carousel-track {
  display: flex;
  transition: transform 0.3s ease-out;
  will-change: transform;
}

.carousel-slide {
  flex: 0 0 100%;
  padding: 0 15px;
  box-sizing: border-box;
}

// Cards - Versão Mobile
.mobile-carousel .valor-card {
  background: white;
  padding: 25px 20px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  margin: 0 auto;
  max-width: 300px;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .card-icon {
    width: 50px;
    height: 50px;
    background: rgba($primary, 0.1);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;

    .material-icons {
      font-size: 24px;
      color: $primary;
    }
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: $text-dark;
    margin: 0 0 12px;
  }

  p {
    font-size: 13px;
    color: $text-light;
    margin: 0;
    line-height: 1.6;
  }
}

// Cards - Versão Desktop
.valores-grid .valor-card {
  background: white;
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba($primary, 0.1);
    border-color: $primary;
  }

  .card-icon {
    width: 60px;
    height: 60px;
    background: rgba($primary, 0.1);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;

    .material-icons {
      font-size: 30px;
      color: $primary;
    }
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: $text-dark;
    margin: 0 0 12px;
  }

  p {
    font-size: 14px;
    color: $text-light;
    margin: 0;
    line-height: 1.6;
  }
}

// Indicadores do carrossel
.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba($primary, 0.3);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    width: 24px;
    border-radius: 4px;
    background: $gradient;
  }

  &:focus {
    outline: none;
  }
}

// EQUIPE SECTION
.equipe-section {
  padding: 80px 0;
  background: white;
}

// Grid Desktop
.equipe-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }
}

// Grid Mobile (2 colunas)
.equipe-mobile-grid {
  width: 100%;
}

.mobile-grid-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mobile-grid-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.mobile-grid-col {
  width: 100%;
}

// Cards da equipe no mobile
.equipe-mobile-grid .membro-card {
  text-align: center;
  padding: 20px 15px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .membro-avatar {
    margin-bottom: 15px;
    border: 2px solid $primary;

    :deep(img) {
      object-fit: cover;
    }
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: $text-dark;
    margin: 0 0 3px;
    line-height: 1.3;
  }

  .cargo {
    font-size: 12px;
    color: $primary;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .bio {
    font-size: 11px;
    color: $text-light;
    line-height: 1.4;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .social-links {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: auto;

    .social-link {
      width: 28px;
      height: 28px;
      background: rgba($primary, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $primary;
      transition: all 0.3s;

      &:hover {
        background: $primary;
        color: white;
      }

      .material-icons {
        font-size: 14px;
      }
    }
  }
}

// Cards da equipe no desktop
.equipe-grid .membro-card {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;

  .membro-avatar {
    margin-bottom: 20px;
    border: 3px solid $primary;
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: $text-dark;
    margin: 0 0 5px;
  }

  .cargo {
    font-size: 14px;
    color: $primary;
    font-weight: 600;
    margin-bottom: 15px;
  }

  .bio {
    font-size: 14px;
    color: $text-light;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .social-links {
    display: flex;
    justify-content: center;
    gap: 10px;

    .social-link {
      width: 36px;
      height: 36px;
      background: rgba($primary, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $primary;
      transition: all 0.3s;

      &:hover {
        background: $primary;
        color: white;
      }

      .material-icons {
        font-size: 18px;
      }
    }
  }
}

// Impacto Section
.impacto-section {
  padding: 80px 0;
  background: $gradient;
  color: white;
}

.impacto-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;

  .section-title {
    color: white;

    .gradient-text {
      -webkit-text-fill-color: white;
      background: none;
    }
  }
}

.impacto-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin: 40px 0;

  @include mobile {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

.impacto-stat {
  .stat-number {
    display: block;
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .stat-label {
    font-size: 14px;
    opacity: 0.9;
  }
}

.impacto-texto {
  font-size: 18px;
  line-height: 1.8;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

// CTA Section
.cta-section {
  background: rgba($primary, 0.05);
  padding: 80px 24px;

  @include mobile {
    padding: 60px 16px;
  }
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.cta-title {
  font-size: 40px;
  font-weight: 700;
  color: $text-dark;
  margin: 0 0 16px;

  @include mobile {
    font-size: 30px;
  }
}

.cta-text {
  font-size: 18px;
  color: $text-light;
  margin: 0 0 32px;

  @include mobile {
    font-size: 16px;
  }
}

.cta-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 24px;

  @include mobile {
    flex-direction: column;
  }
}

.cta-login-btn {
  height: 60px;
  padding: 0 40px;
  background: $gradient;
  color: white;
  border-radius: 30px;
  font-size: 18px;
  font-weight: 600;

  .btn-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  @include mobile {
    height: 54px;
    font-size: 16px;
  }
}

.cta-register-btn {
  height: 60px;
  padding: 0 40px;
  color: $primary;
  border: 2px solid $primary;
  border-radius: 30px;
  font-size: 18px;
  font-weight: 600;

  .btn-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  @include mobile {
    height: 54px;
    font-size: 16px;
  }
}

.pulse-effect {
  animation: pulseBtn 2s infinite;
  box-shadow: 0 0 0 0 rgba($primary, 0.7);
}

@keyframes pulseBtn {
  0% {
    box-shadow: 0 0 0 0 rgba($primary, 0.7);
  }
  70% {
    box-shadow: 0 0 0 20px rgba($primary, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba($primary, 0);
  }
}

// Footer
.footer {
  background: #1a202c;
  color: white;
  padding: 60px 24px 20px;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  margin-bottom: 40px;

  @include mobile {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }
}

.footer-col {
  h4 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 20px;
    color: white;
  }

  p {
    color: #a0aec0;
    line-height: 1.6;
    margin: 0 0 20px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 12px;

      a {
        color: #a0aec0;
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
          color: white;
        }
      }
    }
  }
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s;

  &:hover {
    background: $primary;
    transform: translateY(-3px);
  }

  .material-icons {
    font-size: 20px;
  }
}

.footer-bottom {
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: $text-dark;
  text-align: center;
  margin: 0 0 50px;

  @include mobile {
    font-size: 28px;
    margin-bottom: 30px;
  }
}
</style>
