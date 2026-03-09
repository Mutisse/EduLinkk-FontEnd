import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

export default defineRouter(function (/* { store, ssrContext } */) {
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

  // Guard de navegação - Versão corrigida
  Router.beforeEach(async (to, from) => {
    console.log('📍 Navegando para:', to.path)

    try {
      // Tenta importar o serviço de autenticação
      let authService
      try {
        const apiModule = await import('../services/api.js')
        authService = apiModule.default?.AuthService
        console.log('✅ AuthService carregado:', !!authService)
      } catch (importError) {
        console.warn('⚠️ AuthService não disponível:', importError.message)
        return true
      }

      if (!authService) {
        console.log('➡️ Continuando sem autenticação')
        return true
      }

      const isAuthenticated = authService.isAuthenticated()
      const userTipo = authService.getUserTipo()

      console.log('🔐 Status:', {
        autenticado: isAuthenticated,
        tipo: userTipo,
        rota: to.path
      })

      // EVITAR LOOP - se já está na mesma página
      if (to.path === from.path) {
        console.log('⚠️ Mesma página, ignorando')
        return true
      }

      // ========== REGRAS DE NAVEGAÇÃO ==========

      // Caso 1: Rotas públicas (login, registro, index)
      if (to.meta?.publica) {
        // Se está autenticado e tentando acessar login ou registro
        if (isAuthenticated && (to.path === '/login' || to.path === '/registro')) {
          // Se tem tipo definido, vai para rota específica, senão vai para index
          const destino = userTipo ? `/${userTipo}` : '/'
          console.log('➡️ Usuário já autenticado, redirecionando para:', destino)
          return destino
        }
        // Permite acesso a outras páginas públicas (como index)
        console.log('✅ Acesso permitido a página pública')
        return true
      }

      // Caso 2: Rota privada (requer autenticação)
      if (to.meta?.requerAuth && !isAuthenticated) {
        console.log('➡️ Usuário não autenticado, redirecionando para login')
        return '/login'
      }

      // Caso 3: Verifica tipo de usuário para rotas específicas
      if (to.meta?.tipo && to.meta.tipo !== userTipo) {
        console.log(`➡️ Tipo incorreto (requer ${to.meta.tipo}, tem ${userTipo})`)
        // Redireciona para o dashboard apropriado ou index
        return userTipo ? `/${userTipo}` : '/'
      }

      // Caso 4: Tudo ok, permite acesso
      console.log('✅ Acesso permitido')
      return true

    } catch (error) {
      console.error('❌ Erro no guard:', error)
      return true
    }
  })

  Router.onError((error) => {
    console.error('❌ Erro de navegação:', error)
  })

  Router.afterEach((to, from) => {
    console.log('✅ Navegação completa:', from.path, '→', to.path)
  })

  return Router
})
