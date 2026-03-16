import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

// Configuração de debug - mude para false em produção
const DEBUG = process.env.NODE_ENV === 'development'

// Logger condicional
const log = {
  info: (...args) => DEBUG && console.log('🔷', ...args),
  success: (...args) => DEBUG && console.log('✅', ...args),
  warn: (...args) => DEBUG && console.warn('⚠️', ...args),
  error: (...args) => DEBUG && console.error('❌', ...args),
  auth: (...args) => DEBUG && console.log('🔐', ...args),
}

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Guard de navegação - Versão otimizada
  Router.beforeEach(async (to, from) => {
    // Evitar loop na mesma página
    if (to.path === from.path) {
      return true
    }

    log.info('Navegando para:', to.path)

    try {
      // Carregar serviço de autenticação
      let authService
      try {
        const apiModule = await import('../services/api.js')
        authService = apiModule.default?.AuthService

        if (!authService) {
          log.warn('AuthService não disponível')
          return true
        }

        log.success('AuthService carregado')
      } catch (error) {
        log.error('Falha ao carregar AuthService:', error.message)
        return true
      }

      const isAuthenticated = authService.isAuthenticated()
      const userTipo = authService.getUserTipo()

      log.auth('Status:', {
        autenticado: isAuthenticated,
        tipo: userTipo,
        rota: to.path,
      })

      // ===== REGRAS DE NAVEGAÇÃO =====

      // Rotas públicas
      if (to.meta?.publica) {
        // Redirecionar usuários autenticados do login/registro
        if (isAuthenticated && ['/login', '/registro'].includes(to.path)) {
          const destino = userTipo ? `/${userTipo}` : '/'
          log.info(`Usuário autenticado → redirecionando para: ${destino}`)
          return destino
        }
        return true
      }

      // Rotas que requerem autenticação
      if (to.meta?.requerAuth && !isAuthenticated) {
        log.info('Usuário não autenticado → login')
        return '/login'
      }

      // Verificar tipo de usuário
      if (to.meta?.tipo && to.meta.tipo !== userTipo) {
        log.warn(`Tipo incorreto (requer: ${to.meta.tipo}, tem: ${userTipo})`)
        return userTipo ? `/${userTipo}` : '/'
      }

      log.success('Acesso permitido')
      return true
    } catch (error) {
      log.error('Erro no guard:', error)
      return true
    }
  })

  // Log apenas em desenvolvimento
  if (DEBUG) {
    Router.afterEach((to, from) => {
      log.success(`${from.path} → ${to.path}`)
    })

    Router.onError((error) => {
      log.error('Erro de navegação:', error)
    })
  }

  return Router
})
