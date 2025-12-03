<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-slate-800">Bienvenido</h1>
        <p class="text-slate-500 mt-2">Inicia sesión para continuar</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Usuario</label>
          <input 
            v-model="username" 
            type="text" 
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="Ingresa tu usuario"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="error" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
          {{ error }}
        </div>

        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
        >
          Iniciar Sesión
        </button>
      </form>
      
      <div class="mt-6 text-center text-xs text-slate-400">
        <p>Credenciales de prueba: admin / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  if (username.value === import.meta.env.VITE_ADMIN_USERNAME && password.value === import.meta.env.VITE_ADMIN_PASSWORD) {
    localStorage.setItem('isAuthenticated', 'true')
    router.push('/dashboard')
  } else {
    error.value = 'Credenciales incorrectas'
  }
}
</script>
