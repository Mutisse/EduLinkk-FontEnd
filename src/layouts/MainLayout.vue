<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          v-if="authStore.isAuthenticated"
        />

        <q-toolbar-title class="row items-center">
          <span class="material-icons q-mr-sm">school</span>
          <span>EduLink Moçambique</span>
        </q-toolbar-title>

        <!-- Menu do usuário (visível apenas quando logado) -->
        <template v-if="authStore.isAuthenticated">
          <q-btn flat round dense>
            <q-badge color="red" floating v-if="notificacoesNaoLidas > 0">
              {{ notificacoesNaoLidas }}
            </q-badge>
            <span class="material-icons">notifications</span>
            <q-menu>
              <q-list style="min-width: 250px">
                <q-item-label header>Notificações</q-item-label>
                <q-item v-for="n in 3" :key="n" clickable v-close-popup>
                  <q-item-section>
                    <q-item-label>Notificação {{ n }}</q-item-label>
                    <q-item-label caption>Há 5 minutos</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup>
                  <q-item-section class="text-center text-primary">
                    Ver todas
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn flat round dense>
            <span class="material-icons">account_circle</span>
            <q-menu>
              <q-list style="min-width: 150px">
                <q-item clickable v-close-popup to="/perfil">
                  <q-item-section avatar>
                    <span class="material-icons">person</span>
                  </q-item-section>
                  <q-item-section>Meu Perfil</q-item-section>
                </q-item>

                <q-item clickable v-close-popup to="/configuracoes">
                  <q-item-section avatar>
                    <span class="material-icons">settings</span>
                  </q-item-section>
                  <q-item-section>Configurações</q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable v-close-popup @click="logout">
                  <q-item-section avatar>
                    <span class="material-icons text-negative">exit_to_app</span>
                  </q-item-section>
                  <q-item-section class="text-negative">Sair</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>

        <!-- Botão de login (visível apenas quando não logado) -->
        <template v-else>
          <q-btn flat label="Login" to="/login" class="q-mr-sm" />
          <q-btn outline label="Registrar" to="/registro" />
        </template>
      </q-toolbar>
    </q-header>

    <!-- Drawer lateral (visível apenas quando logado) -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="280"
      :breakpoint="500"
      v-if="authStore.isAuthenticated"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <!-- Informações do usuário -->
          <q-item class="q-mb-md">
            <q-item-section avatar>
              <q-avatar size="56px" class="bg-primary text-white">
                <span class="text-h5">{{ userIniciais }}</span>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-h6">{{ userNome }}</q-item-label>
              <q-item-label caption>
                <q-badge :color="userTipoColor" class="q-mt-xs">
                  {{ userTipoLabel }}
                </q-badge>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-mb-md" />

          <!-- Menu items baseado no tipo de usuário -->
          <template v-for="menuItem in menuItems" :key="menuItem.title">
            <q-item-label header class="text-grey-8">
              {{ menuItem.header }}
            </q-item-label>

            <q-item
              v-for="link in menuItem.items"
              :key="link.title"
              clickable
              v-ripple
              :to="link.link"
              :active="link.active"
              exact
            >
              <q-item-section avatar>
                <span class="material-icons">{{ link.icon }}</span>
              </q-item-section>
              <q-item-section>
                {{ link.title }}
              </q-item-section>
              <q-item-section v-if="link.badge" side>
                <q-badge :color="link.badgeColor">{{ link.badge }}</q-badge>
              </q-item-section>
            </q-item>

            <q-separator class="q-my-md" />
          </template>

          <!-- Sair -->
          <q-item clickable v-ripple @click="logout" class="text-negative">
            <q-item-section avatar>
              <span class="material-icons">exit_to_app</span>
            </q-item-section>
            <q-item-section>Sair</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import Api from 'src/services/api.js'

const $q = useQuasar()
const router = useRouter()
const leftDrawerOpen = ref(false)

// Store de autenticação (simulada)
const authStore = {
  isAuthenticated: computed(() => Api.AuthService.isAuthenticated()),
  user: computed(() => Api.AuthService.getUser?.() || null),
  userTipo: computed(() => Api.AuthService.getUserTipo?.() || null)
}

// Dados do usuário
const userNome = computed(() => {
  const user = authStore.user.value
  return user?.nome || 'Usuário'
})

const userIniciais = computed(() => {
  return userNome.value
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const userTipoLabel = computed(() => {
  const tipos = {
    estudante: 'Estudante',
    explicador: 'Explicador',
    admin: 'Administrador'
  }
  return tipos[authStore.userTipo.value] || authStore.userTipo.value
})

const userTipoColor = computed(() => {
  const cores = {
    estudante: 'blue',
    explicador: 'green',
    admin: 'purple'
  }
  return cores[authStore.userTipo.value] || 'grey'
})

// Notificações (exemplo)
const notificacoesNaoLidas = ref(3)

// Menu items baseado no tipo de usuário
const menuItems = computed(() => {
  const tipo = authStore.userTipo.value
  const items = []

  // Dashboard (sempre presente)
  items.push({
    header: 'Principal',
    items: [
      {
        title: 'Dashboard',
        icon: 'dashboard',
        link: `/${tipo || ''}`,
        active: true
      }
    ]
  })

  // Items específicos por tipo
  if (tipo === 'estudante') {
    items.push({
      header: 'Acadêmico',
      items: [
        { title: 'Minhas Disciplinas', icon: 'menu_book', link: '/estudante/disciplinas' },
        { title: 'Meus Explicadores', icon: 'school', link: '/estudante/explicadores' },
        { title: 'Horários', icon: 'schedule', link: '/estudante/horarios' },
        { title: 'Notas', icon: 'grade', link: '/estudante/notas', badge: '3', badgeColor: 'red' }
      ]
    })
    items.push({
      header: 'Financeiro',
      items: [
        { title: 'Mensalidades', icon: 'payments', link: '/estudante/mensalidades' },
        { title: 'Histórico', icon: 'history', link: '/estudante/historico' }
      ]
    })
  } else if (tipo === 'explicador') {
    items.push({
      header: 'Minhas Aulas',
      items: [
        { title: 'Próximas Aulas', icon: 'event', link: '/explicador/proximas' },
        { title: 'Meus Alunos', icon: 'people', link: '/explicador/alunos' },
        { title: 'Materiais', icon: 'folder', link: '/explicador/materiais' },
        { title: 'Disponibilidade', icon: 'access_time', link: '/explicador/disponibilidade' }
      ]
    })
    items.push({
      header: 'Financeiro',
      items: [
        { title: 'Ganhos', icon: 'attach_money', link: '/explicador/ganhos' },
        { title: 'Pagamentos', icon: 'account_balance', link: '/explicador/pagamentos' }
      ]
    })
  } else if (tipo === 'admin') {
    items.push({
      header: 'Administração',
      items: [
        { title: 'Usuários', icon: 'people', link: '/admin/usuarios', badge: '12', badgeColor: 'red' },
        { title: 'Turmas', icon: 'class', link: '/admin/turmas' },
        { title: 'Disciplinas', icon: 'menu_book', link: '/admin/disciplinas' },
        { title: 'Pagamentos', icon: 'payments', link: '/admin/pagamentos' }
      ]
    })
    items.push({
      header: 'Relatórios',
      items: [
        { title: 'Financeiro', icon: 'bar_chart', link: '/admin/relatorios/financeiro' },
        { title: 'Desempenho', icon: 'trending_up', link: '/admin/relatorios/desempenho' }
      ]
    })
  }

  return items
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function logout() {
  $q.dialog({
    title: 'Confirmar',
    message: 'Tem certeza que deseja sair?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await Api.AuthService.logout()

      $q.notify({
        type: 'positive',
        message: 'Logout realizado com sucesso!',
        position: 'top'
      })

      router.push('/login')
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao fazer logout',
        position: 'top'
      })
    }
  })
}

// Verificar autenticação ao montar
onMounted(() => {
  // Se não estiver autenticado e não estiver em rota pública, redireciona
  if (!authStore.isAuthenticated.value && !['/login', '/registro'].includes(router.currentRoute.value.path)) {
    router.push('/login')
  }
})
</script>

<style lang="sass" scoped>
.q-drawer
  .q-item.q-router-link--active
    color: $primary
    background: rgba($primary, 0.1)

    .material-icons
      color: $primary
</style>
