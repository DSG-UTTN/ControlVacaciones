<template>
  <div class="flex min-h-screen font-sans bg-slate-100">
    <aside v-if="showSidebar" class="w-64 bg-slate-900 text-white p-6 flex flex-col shadow-xl fixed h-full z-10">
      <h2 class="text-2xl font-bold mb-8 text-blue-400 tracking-tight">VacationControl</h2>
      <nav class="flex flex-col gap-2 flex-1">
        <router-link 
          to="/dashboard" 
          class="nav-link" 
          active-class="active"
        >
          Dashboard
        </router-link>
        <router-link 
          to="/vacaciones" 
          class="nav-link" 
          active-class="active"
        >
          Vacaciones
        </router-link>
        <router-link 
          to="/salidas" 
          class="nav-link" 
          active-class="active"
        >
          Salidas
        </router-link>
        <router-link 
          to="/advice" 
          class="nav-link" 
          active-class="active"
        >
          Consejos
        </router-link>
        <div class="mt-8 border-t border-slate-700 pt-4">
          <router-link 
            to="/admin" 
            class="nav-link text-yellow-400 hover:text-yellow-300" 
            active-class="active"
          >
            Admin Panel
          </router-link>
        </div>
      </nav>

      <button 
        @click="logout" 
        class="mt-auto flex items-center gap-2 text-slate-400 hover:text-white transition px-4 py-2 rounded-lg hover:bg-slate-800"
      >
        <span>🚪</span> Cerrar Sesión
      </button>
    </aside>

    <main :class="['flex-1 p-8 overflow-y-auto', showSidebar ? 'ml-64' : '']">
      <div class="max-w-7xl mx-auto">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const showSidebar = computed(() => route.path !== '/login')

const logout = () => {
  localStorage.removeItem('isAuthenticated')
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  @apply px-4 py-3 rounded-lg text-slate-400 font-medium transition-all duration-200 hover:bg-slate-800 hover:text-white hover:translate-x-1;
}

.nav-link.active {
  @apply bg-blue-600 text-white shadow-lg shadow-blue-900/50;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
