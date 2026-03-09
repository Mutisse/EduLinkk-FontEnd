<template>
  <q-layout view="hHh LpR fFf" >
    <q-header elevated class="bg-primary text-white" v-if="false">
      <q-toolbar>
        <q-toolbar-title class="row items-center">
          <q-icon name="school" size="md" class="q-mr-sm" />
          <span class="text-weight-bold">EduLink</span>
        </q-toolbar-title>

        <div class="row items-center">
          <q-btn
            flat
            :to="{ path: '/estudante' }"
            :class="{ 'bg-white text-primary': $route.path === '/estudante' }"
            class="q-mx-xs"
            icon="person"
            label="Estudante"
            no-caps
          />
          <q-btn
            flat
            :to="{ path: '/explicador' }"
            :class="{ 'bg-white text-primary': $route.path === '/explicador' }"
            class="q-mx-xs"
            icon="school"
            label="Explicador"
            no-caps
          />
          <q-btn
            flat
            :to="{ path: '/admin' }"
            :class="{ 'bg-white text-primary': $route.path === '/admin' }"
            class="q-mx-xs"
            icon="admin_panel_settings"
            label="Admin"
            no-caps
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'LayoutPadrao'
}
</script>
