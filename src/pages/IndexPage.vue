<template>
  <q-layout view="lHh Lpr lFf" container style="height: 100vh">
    <q-page-container>
      <q-page class="flex flex-center">
        <div class="text-center">
          <img
            alt="EduLink Logo"
            src="~assets/quasar-logo-vertical.svg"
            style="width: 200px; height: 200px"
          />
          <q-spinner
            color="primary"
            size="3em"
            :thickness="3"
            class="q-mt-md"
          />
          <p class="text-h6 q-mt-md">Redirecionando...</p>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Api from '../services/api.js'

const router = useRouter()

onMounted(async () => {
  console.log('🏠 IndexPage - Verificando autenticação...')

  try {
    const isAuthenticated = Api.AuthService.isAuthenticated()
    const userTipo = Api.AuthService.getUserTipo()

    console.log('📊 Status:', { isAuthenticated, userTipo })

    if (isAuthenticated && userTipo) {
      console.log('➡️ Redirecionando para:', `/${userTipo}`)
      router.replace(`/${userTipo}`)
    } else {
      console.log('➡️ Redirecionando para: /login')
      router.replace('/login')
    }
  } catch (error) {
    console.error('❌ Erro no IndexPage:', error)
    router.replace('/login')
  }
})
</script>
