<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="splash-page">
        <!-- Header com navegação -->
        <div class="header">
          <div class="header-container">
            <div class="header-left">
              <div class="logo-wrapper">
                <span class="material-icons logo-icon">school</span>
                <span class="logo-text">EduLink</span>
              </div>
            </div>

            <!-- Menu Desktop -->
            <div class="header-menu desktop-only">
              <a href="#" @click.prevent>Para Estudantes</a>
              <a href="#" @click.prevent>Para Explicadores</a>
              <a href="#" @click.prevent>Preços</a>
              <a href="#" @click.prevent>Sobre</a>
            </div>

            <div class="header-right">
              <q-btn flat label="Entrar" class="login-btn-header" @click="irParaLogin" />
              <q-btn outline label="Criar conta" class="register-btn-header" @click="irParaRegistro" />

              <!-- Menu Mobile -->
              <q-btn flat round dense icon="menu" class="mobile-only" @click="mobileMenu = true" />
            </div>
          </div>
        </div>

        <!-- Mobile Menu Drawer -->
        <q-drawer v-model="mobileMenu" side="right" bordered class="mobile-drawer">
          <div class="drawer-content">
            <div class="drawer-header">
              <span class="material-icons">school</span>
              <span>EduLink</span>
              <q-btn flat round dense icon="close" @click="mobileMenu = false" />
            </div>
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section>Para Estudantes</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Para Explicadores</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Preços</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>Sobre</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="irParaLogin">
                <q-item-section>Entrar</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="irParaRegistro">
                <q-item-section>Criar conta</q-item-section>
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
          <!-- Hero Section -->
          <div class="hero-section">
            <div class="hero-content">
              <div class="badge-wrapper">
                <span class="feature-badge">
                  <span class="material-icons">stars</span>
                  <span>+500 estudantes ativos em Moçambique</span>
                </span>
              </div>

              <h1 class="hero-title">
                Aprenda com os
                <span class="gradient-text">melhores explicadores</span>
                <br class="desktop-break" />do país
              </h1>

              <p class="hero-subtitle">
                Conectamos você a explicadores qualificados para aulas particulares,
                materiais didáticos e muito mais. Tudo online e adaptado ao seu ritmo.
              </p>

              <div class="hero-actions">
                <q-btn class="cta-primary pulse-effect" @click="irParaRegistro">
                  <span class="btn-content">
                    <span class="material-icons">school</span>
                    <span>Começar grátis</span>
                  </span>
                </q-btn>

                <q-btn class="cta-secondary" @click="irParaLogin">
                  <span class="btn-content">
                    <span>Já tenho conta</span>
                    <span class="material-icons">arrow_forward</span>
                  </span>
                </q-btn>
              </div>

              <div class="hero-stats">
                <div class="stat-item">
                  <span class="stat-number">500+</span>
                  <span class="stat-label">Estudantes</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-number">50+</span>
                  <span class="stat-label">Explicadores</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-number">1000+</span>
                  <span class="stat-label">Aulas realizadas</span>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <span class="stat-number">4.8</span>
                  <span class="stat-label">Avaliação média</span>
                </div>
              </div>
            </div>

            <div class="hero-image">
              <div class="image-container">
                <img src="https://i.pinimg.com/originals/a4/31/32/a43132e257a903a5191b031446efae2d.jpg" alt="EduLink Hero" class="main-illustration" />

                <!-- Cards flutuantes -->
                <div class="floating-card card1">
                  <span class="material-icons">star</span>
                  <span>4.8</span>
                </div>
                <div class="floating-card card2">
                  <span class="material-icons">people</span>
                  <span>500+</span>
                </div>
                <div class="floating-card card3">
                  <span class="material-icons">school</span>
                  <span>50+</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Seção de Benefícios -->
          <div class="benefits-section">
            <h2 class="section-title">
              Por que escolher a
              <span class="gradient-text">EduLink</span>?
            </h2>

            <div class="benefits-grid">
              <div class="benefit-card">
                <div class="card-icon">
                  <span class="material-icons">verified</span>
                </div>
                <h3>Explicadores Verificados</h3>
                <p>Todos os profissionais passam por rigoroso processo de seleção e validação de documentos</p>
              </div>

              <div class="benefit-card">
                <div class="card-icon">
                  <span class="material-icons">payments</span>
                </div>
                <h3>Preços Acessíveis</h3>
                <p>A partir de 500MT por sessão. Pacotes mensais com desconto especial</p>
              </div>

              <div class="benefit-card">
                <div class="card-icon">
                  <span class="material-icons">schedule</span>
                </div>
                <h3>Horário Flexível</h3>
                <p>Marque aulas de acordo com sua disponibilidade. 24/7 online</p>
              </div>

              <div class="benefit-card">
                <div class="card-icon">
                  <span class="material-icons">auto_stories</span>
                </div>
                <h3>Conteúdos Exclusivos</h3>
                <p>Apostilas, exercícios e videoaulas preparadas por especialistas</p>
              </div>
            </div>
          </div>

          <!-- Seção de Planos - CORRIGIDA PARA MOBILE -->
          <div class="plans-section">
            <h2 class="section-title">
              Escolha o plano ideal para
              <span class="gradient-text">você</span>
            </h2>

            <!-- Versão Mobile - Cards em Slide -->
            <div class="mobile-carousel">
              <!-- Indicadores de slide -->
              <div class="carousel-indicators">
                <span
                  v-for="(_, index) in planos"
                  :key="index"
                  class="indicator"
                  :class="{ active: planoAtual === index }"
                  @click="planoAtual = index"
                ></span>
              </div>

              <!-- Cards com scroll horizontal -->
              <div class="cards-scroll">
                <div
                  class="cards-container"
                  ref="planosContainer"
                  @scroll="handlePlanosScroll"
                >
                  <div
                    v-for="(plano, index) in planos"
                    :key="index"
                    class="plan-card-item"
                  >
                    <div class="plan-card" :class="{ popular: plano.popular }">
                      <div class="popular-tag" v-if="plano.popular">MAIS ESCOLHIDO</div>
                      <div class="plan-header">
                        <h3>{{ plano.nome }}</h3>
                        <p>{{ plano.descricao }}</p>
                      </div>
                      <div class="plan-price">
                        <span class="old-price" v-if="plano.oldPrice">{{ plano.oldPrice }}</span>
                        <span class="price">{{ plano.price }}</span>
                        <span class="period" v-if="plano.period">{{ plano.period }}</span>
                      </div>
                      <ul class="plan-features">
                        <li v-for="(feature, fIndex) in plano.features" :key="fIndex">
                          <span class="material-icons check">check_circle</span>
                          <span>{{ feature }}</span>
                        </li>
                      </ul>
                      <q-btn
                        :flat="!plano.popular"
                        class="plan-btn"
                        :class="{ 'popular-btn': plano.popular }"
                        :label="plano.buttonText"
                        @click="irParaRegistro"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Versão Desktop - Grid -->
            <div class="plans-grid desktop-only">
              <div v-for="(plano, index) in planos" :key="index" class="plan-card" :class="{ popular: plano.popular }">
                <div class="popular-tag" v-if="plano.popular">MAIS ESCOLHIDO</div>
                <div class="plan-header">
                  <h3>{{ plano.nome }}</h3>
                  <p>{{ plano.descricao }}</p>
                </div>
                <div class="plan-price">
                  <span class="old-price" v-if="plano.oldPrice">{{ plano.oldPrice }}</span>
                  <span class="price">{{ plano.price }}</span>
                  <span class="period" v-if="plano.period">{{ plano.period }}</span>
                </div>
                <ul class="plan-features">
                  <li v-for="(feature, fIndex) in plano.features" :key="fIndex">
                    <span class="material-icons check">check_circle</span>
                    <span>{{ feature }}</span>
                  </li>
                </ul>
                <q-btn
                  :flat="!plano.popular"
                  class="plan-btn"
                  :class="{ 'popular-btn': plano.popular }"
                  :label="plano.buttonText"
                  @click="irParaRegistro"
                />
              </div>
            </div>
          </div>

          <!-- Seção de Depoimentos - CORRIGIDA PARA MOBILE -->
          <div class="testimonials-section">
            <h2 class="section-title">
              O que nossos
              <span class="gradient-text">alunos</span> dizem
            </h2>

            <!-- Versão Mobile - Cards em Slide -->
            <div class="mobile-carousel">
              <!-- Indicadores de slide -->
              <div class="carousel-indicators">
                <span
                  v-for="(_, index) in depoimentos"
                  :key="index"
                  class="indicator"
                  :class="{ active: depoimentoAtual === index }"
                  @click="depoimentoAtual = index"
                ></span>
              </div>

              <!-- Cards com scroll horizontal -->
              <div class="cards-scroll">
                <div
                  class="cards-container"
                  ref="depoimentosContainer"
                  @scroll="handleDepoimentosScroll"
                >
                  <div
                    v-for="(depoimento, index) in depoimentos"
                    :key="index"
                    class="testimonial-card-item"
                  >
                    <div class="testimonial-card">
                      <div class="testimonial-header">
                        <q-avatar size="56px" class="avatar">
                          <img :src="depoimento.avatar" />
                        </q-avatar>
                        <div class="testimonial-info">
                          <h4>{{ depoimento.nome }}</h4>
                          <div class="rating">
                            <span class="material-icons" v-for="n in 5" :key="n">
                              {{ n <= depoimento.rating ? 'star' : 'star_border' }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p class="testimonial-text">"{{ depoimento.texto }}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Versão Desktop - Grid -->
            <div class="testimonials-grid desktop-only">
              <div v-for="(depoimento, index) in depoimentos.slice(0, 3)" :key="index" class="testimonial-card">
                <div class="testimonial-header">
                  <q-avatar size="56px" class="avatar">
                    <img :src="depoimento.avatar" />
                  </q-avatar>
                  <div class="testimonial-info">
                    <h4>{{ depoimento.nome }}</h4>
                    <div class="rating">
                      <span class="material-icons" v-for="n in 5" :key="n">
                        {{ n <= depoimento.rating ? 'star' : 'star_border' }}
                      </span>
                    </div>
                  </div>
                </div>
                <p class="testimonial-text">"{{ depoimento.texto }}"</p>
              </div>
            </div>
          </div>

          <!-- CTA Final -->
          <div class="cta-section">
            <div class="cta-container">
              <h2 class="cta-title">Pronto para começar sua jornada?</h2>
              <p class="cta-text">
                Junte-se a mais de 500 estudantes que já estão aprendendo com os melhores
              </p>

              <div class="cta-actions">
                <q-btn class="cta-login-btn pulse-effect" @click="irParaLogin">
                  <span class="btn-content">
                    <span class="material-icons">login</span>
                    <span>Fazer Login</span>
                  </span>
                </q-btn>

                <q-btn class="cta-register-btn" @click="irParaRegistro">
                  <span class="btn-content">
                    <span>Criar conta grátis</span>
                    <span class="material-icons">arrow_forward</span>
                  </span>
                </q-btn>
              </div>

              <div class="guarantee">
                <span class="material-icons">verified</span>
                <span>Sem compromisso. Cancele quando quiser.</span>
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
                    <li><a href="#">Para Estudantes</a></li>
                    <li><a href="#">Para Explicadores</a></li>
                    <li><a href="#">Preços</a></li>
                    <li><a href="#">FAQ</a></li>
                  </ul>
                </div>

                <div class="footer-col">
                  <h4>Empresa</h4>
                  <ul>
                    <li><a href="#">Sobre nós</a></li>
                    <li><a href="#">Carreiras</a></li>
                    <li><a href="#">Blog</a></li>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mobileMenu = ref(false)
const planoAtual = ref(0)
const depoimentoAtual = ref(0)
const planosContainer = ref(null)
const depoimentosContainer = ref(null)

// Dados dos planos
const planos = ref([
  {
    nome: 'Experimental',
    descricao: 'Para começar',
    price: 'Grátis',
    oldPrice: null,
    period: null,
    popular: false,
    buttonText: 'Experimentar',
    features: [
      '1 aula experimental',
      'Acesso a 3 materiais',
      'Suporte básico'
    ]
  },
  {
    nome: 'Premium',
    descricao: 'Acesso completo',
    price: '999MT',
    oldPrice: '1.500MT',
    period: '/mês',
    popular: true,
    buttonText: 'Assinar agora',
    features: [
      'Aulas ilimitadas',
      'Biblioteca completa',
      'Suporte prioritário',
      'Certificado de conclusão'
    ]
  },
  {
    nome: 'Básico',
    descricao: 'Para estudos pontuais',
    price: '750MT',
    oldPrice: null,
    period: '/mês',
    popular: false,
    buttonText: 'Começar',
    features: [
      '5 aulas por mês',
      '10 materiais',
      'Suporte por email'
    ]
  }
])

// Dados dos depoimentos
const depoimentos = ref([
  {
    nome: 'Maria Silva',
    avatar: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    texto: 'Consegui melhorar minhas notas em Matemática graças ao EduLink. Os explicadores são muito atenciosos e pacientes!'
  },
  {
    nome: 'João Pedro',
    avatar: 'https://i.pravatar.cc/150?img=2',
    rating: 4,
    texto: 'Plataforma excelente! Conteúdos de qualidade e preço justo. Recomendo a todos que querem aprender de verdade.'
  },
  {
    nome: 'Ana Oliveira',
    avatar: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    texto: 'Meu filho adorou as aulas de Física. Os explicadores sabem como motivar e tornar o aprendizado divertido.'
  },
  {
    nome: 'Carlos Mendes',
    avatar: 'https://i.pravatar.cc/150?img=4',
    rating: 5,
    texto: 'Consegui passar no exame de admissão graças às aulas preparatórias. Muito obrigado!'
  }
])

// Handlers para scroll dos planos
const handlePlanosScroll = () => {
  if (planosContainer.value) {
    const scrollLeft = planosContainer.value.scrollLeft
    const cardWidth = planosContainer.value.offsetWidth
    const newIndex = Math.round(scrollLeft / cardWidth)
    if (newIndex !== planoAtual.value && newIndex >= 0 && newIndex < planos.value.length) {
      planoAtual.value = newIndex
    }
  }
}

// Handlers para scroll dos depoimentos
const handleDepoimentosScroll = () => {
  if (depoimentosContainer.value) {
    const scrollLeft = depoimentosContainer.value.scrollLeft
    const cardWidth = depoimentosContainer.value.offsetWidth
    const newIndex = Math.round(scrollLeft / cardWidth)
    if (newIndex !== depoimentoAtual.value && newIndex >= 0 && newIndex < depoimentos.value.length) {
      depoimentoAtual.value = newIndex
    }
  }
}

// Função para rolar para o card selecionado
const scrollParaCard = (container, index) => {
  if (container) {
    const cardWidth = container.offsetWidth
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    })
  }
}

// Watch para atualizar o scroll quando o índice mudar
const updatePlanoScroll = () => {
  scrollParaCard(planosContainer.value, planoAtual.value)
}

const updateDepoimentoScroll = () => {
  scrollParaCard(depoimentosContainer.value, depoimentoAtual.value)
}

// Detectar resize para mobile/desktop
const isMobile = ref(window.innerWidth <= 640)

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 640
}

onMounted(() => {
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})

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

@mixin desktop {
  @media (min-width: 1025px) {
    @content;
  }
}

// Classes de responsividade
.desktop-only {
  @include mobile {
    display: none !important;
  }
  @include tablet {
    display: none !important;
  }
}

.mobile-only {
  @include desktop {
    display: none !important;
  }
  @include tablet {
    display: none !important;
  }
}

.mobile-carousel {
  @include desktop {
    display: none;
  }
  @include tablet {
    display: none;
  }
}

.desktop-break {
  @include mobile {
    display: none;
  }
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

    &:hover {
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

// Mobile Drawer
.mobile-drawer {
  .drawer-content {
    padding: 20px;
  }

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;

    span:first-child {
      font-size: 32px;
      color: $primary;
    }

    span:nth-child(2) {
      font-size: 20px;
      font-weight: 700;
      flex: 1;
      margin-left: 10px;
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
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(100px, -100px) scale(1.1); }
  66% { transform: translate(-50px, 50px) scale(0.9); }
}

// Conteúdo principal
.content {
  position: relative;
  z-index: 1;
  margin-top: 80px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
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
  margin: 0 0 32px;

  @include mobile {
    font-size: 16px;
  }
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;

  @include mobile {
    flex-direction: column;
  }
}

.cta-primary {
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

.cta-secondary {
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

.pulse-effect {
  animation: pulseBtn 2s infinite;
  box-shadow: 0 0 0 0 rgba($primary, 0.7);
}

@keyframes pulseBtn {
  0% { box-shadow: 0 0 0 0 rgba($primary, 0.7); }
  70% { box-shadow: 0 0 0 20px rgba($primary, 0); }
  100% { box-shadow: 0 0 0 0 rgba($primary, 0); }
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;

  @include mobile {
    justify-content: center;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: $text-dark;

  @include mobile {
    font-size: 24px;
  }
}

.stat-label {
  font-size: 14px;
  color: $text-light;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e2e8f0;

  @include mobile {
    display: none;
  }
}

// Hero Image
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
}

@keyframes floatImage {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.floating-card {
  position: absolute;
  background: white;
  padding: 12px 20px;
  border-radius: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  animation: floatCard 3s infinite;

  .material-icons {
    font-size: 20px;
    color: $primary;
  }

  &.card1 {
    top: 10%;
    right: -10%;
    animation-delay: 0s;
  }

  &.card2 {
    bottom: 20%;
    left: -10%;
    animation-delay: 0.5s;
  }

  &.card3 {
    top: 50%;
    right: -5%;
    animation-delay: 1s;
  }
}

@keyframes floatCard {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

// Seção de Benefícios
.benefits-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 80px 24px;

  @include mobile {
    padding: 60px 16px;
  }
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

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;

  @include mobile {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }
}

.benefit-card {
  background: white;
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid #f0f0f0;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba($primary, 0.1);
    border-color: $primary;
  }

  @include mobile {
    padding: 20px 15px;

    h3 {
      font-size: 16px;
      margin-bottom: 8px;
    }

    p {
      font-size: 13px;
      line-height: 1.4;
    }
  }
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

  @include mobile {
    width: 45px;
    height: 45px;
    margin-bottom: 12px;

    .material-icons {
      font-size: 24px;
    }
  }
}

.benefit-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: $text-dark;
  margin: 0 0 12px;
}

.benefit-card p {
  font-size: 15px;
  color: $text-light;
  margin: 0;
  line-height: 1.6;
}

// Seção de Planos - MOBILE
.plans-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 80px 24px;

  @include mobile {
    padding: 60px 16px;
  }
}

// Indicadores do Carrossel
.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba($primary, 0.3);
  cursor: pointer;
  transition: all 0.3s;

  &.active {
    width: 24px;
    border-radius: 4px;
    background: $primary;
  }
}

// Cards com scroll horizontal
.cards-scroll {
  width: 100%;
  overflow: hidden;
  margin: 0 auto;
}

.cards-container {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  gap: 0;

  &::-webkit-scrollbar {
    display: none;
  }
}

.plan-card-item {
  flex: 0 0 100%;
  scroll-snap-align: start;
  padding: 0 16px;
  box-sizing: border-box;
}

.testimonial-card-item {
  flex: 0 0 100%;
  scroll-snap-align: start;
  padding: 0 16px;
  box-sizing: border-box;
}

// Planos Grid (Desktop)
.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.plan-card {
  background: white;
  border-radius: 32px;
  padding: 40px 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid #f0f0f0;
  position: relative;
  transition: all 0.3s;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba($primary, 0.1);
  }

  &.popular {
    background: $gradient;
    color: white;
    transform: scale(1.05);
    border: none;

    .plan-header h3,
    .plan-header p,
    .price,
    .old-price,
    .period,
    .plan-features li span {
      color: white;
    }

    .plan-features .check {
      color: white;
    }

    .popular-btn {
      background: white;
      color: $primary;
    }
  }

  @include mobile {
    padding: 30px 20px;

    h3 {
      font-size: 22px;
    }

    .price {
      font-size: 32px;
    }

    .plan-features li {
      font-size: 14px;
    }
  }
}

.popular-tag {
  position: absolute;
  top: -12px;
  right: 30px;
  background: #fbbf24;
  color: white;
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;

  @include mobile {
    right: 20px;
    font-size: 11px;
    padding: 4px 12px;
  }
}

.plan-header {
  text-align: center;
  margin-bottom: 30px;

  h3 {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px;
  }

  p {
    font-size: 14px;
    color: $text-light;
    margin: 0;
  }
}

.plan-price {
  text-align: center;
  margin-bottom: 30px;

  .old-price {
    font-size: 16px;
    color: $text-light;
    text-decoration: line-through;
    margin-right: 8px;
  }

  .price {
    font-size: 42px;
    font-weight: 800;
    color: $text-dark;
  }

  .period {
    font-size: 14px;
    color: $text-light;
    margin-left: 4px;
  }
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 30px;

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    font-size: 15px;
    color: $text-light;

    .check {
      color: #48bb78;
      font-size: 20px;
    }
  }
}

.plan-btn {
  width: 100%;
  height: 50px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 16px;

  &.popular-btn {
    background: white;
    color: $primary;
  }

  @include mobile {
    height: 44px;
    font-size: 15px;
  }
}

// Seção de Depoimentos
.testimonials-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 80px 24px;

  @include mobile {
    padding: 60px 16px;
  }
}

// Grid de Depoimentos (Desktop)
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }
}

.testimonial-card {
  background: white;
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid #f0f0f0;
  height: 100%;

  @include mobile {
    padding: 25px 20px;
  }
}

.testimonial-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.avatar {
  border: 3px solid $primary;

  @include mobile {
    width: 48px !important;
    height: 48px !important;
  }
}

.testimonial-info {
  h4 {
    font-size: 18px;
    font-weight: 600;
    color: $text-dark;
    margin: 0 0 5px;

    @include mobile {
      font-size: 16px;
    }
  }

  .rating {
    display: flex;
    gap: 2px;

    .material-icons {
      font-size: 18px;
      color: #fbbf24;

      @include mobile {
        font-size: 16px;
      }
    }
  }
}

.testimonial-text {
  font-size: 15px;
  color: $text-light;
  line-height: 1.6;
  margin: 0;
  font-style: italic;

  @include mobile {
    font-size: 14px;
  }
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

.guarantee {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: $text-light;
  font-size: 14px;

  .material-icons {
    color: #48bb78;
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
</style>
