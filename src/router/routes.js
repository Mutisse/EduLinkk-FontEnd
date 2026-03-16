// src/router/routes.js
const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('pages/IndexPage.vue'),
    meta: { publica: true }, // Página inicial pública que fará o redirecionamento
  },
  {
    path: '/sobre',
    name: 'Sobre',
    component: () => import('pages/SobrePage.vue'),
    meta: { publica: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/LoginPage.vue'),
    meta: { publica: true },
  },
  {
    path: '/registro',
    name: 'Registro',
    component: () => import('pages/RegistroPage.vue'),
    meta: { publica: true },
  },
  {
    path: '/estudante',
    name: 'Estudante',
    component: () => import('pages/EstudantePage.vue'),
    meta: { requerAuth: true, tipo: 'estudante' },
  },
  {
    path: '/explicador',
    name: 'Explicador',
    component: () => import('pages/ExplicadorPage.vue'),
    meta: { requerAuth: true, tipo: 'explicador' },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('pages/AdminPage.vue'),
    meta: { requerAuth: true, tipo: 'admin' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
  // Rota 404 - DEVE SER A ÚLTIMA
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('pages/NotFound.vue'),
    meta: { publica: true },
  },
]

export default routes
