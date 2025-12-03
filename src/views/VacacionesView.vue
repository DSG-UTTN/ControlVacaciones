<template>
  <div>
    <h1 class="text-3xl font-bold mb-8 text-slate-800">Solicitar Vacaciones</h1>

    <div class="grid lg:grid-cols-2 gap-12">
      <!-- Form Section -->
      <div>
        <form @submit.prevent="enviar" class="bg-white p-8 rounded-xl shadow-md border border-slate-200">
          <h2 class="text-xl font-semibold mb-6 text-slate-700">Nueva Solicitud</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">Empleado</label>
              <input 
                v-model="empleado" 
                placeholder="Nombre completo" 
                class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">Desde</label>
                <input 
                  type="date" 
                  v-model="inicio" 
                  class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">Hasta</label>
                <input 
                  type="date" 
                  v-model="fin" 
                  class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">Motivo</label>
              <textarea 
                v-model="motivo" 
                placeholder="Describe el motivo..." 
                rows="3"
                class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              ></textarea>
            </div>
          </div>
          
          <div v-if="errorMsg" class="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {{ errorMsg }}
          </div>
          
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
          >
            {{ isSubmitting ? 'Enviando...' : 'Enviar Solicitud' }}
          </button>
        </form>
      </div>

      <!-- List Section -->
      <div>
        <h2 class="text-xl font-semibold mb-6 text-slate-700">Mis Solicitudes</h2>
        
        <div v-if="lista.length === 0" class="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
          <p class="text-slate-400">No hay solicitudes registradas</p>
        </div>

        <ul v-else class="space-y-4">
          <li v-for="v in lista" :key="v.id" class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition duration-200">
            <div class="flex justify-between items-start mb-2">
              <span class="font-bold text-slate-800">{{ v.empleado }}</span>
              <span 
                class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                :class="{
                  'bg-yellow-100 text-yellow-700': v.estado === 'pendiente',
                  'bg-green-100 text-green-700': v.estado === 'aprobado',
                  'bg-red-100 text-red-700': v.estado === 'rechazado'
                }"
              >
                {{ v.estado }}
              </span>
            </div>
            <div class="text-sm text-slate-500 flex items-center gap-2 mb-2">
              <span>📅 {{ v.fecha_inicio }}</span>
              <span>→</span>
              <span>{{ v.fecha_fin }}</span>
            </div>
            <p class="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">{{ v.motivo }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { ref as dbRef, push, set, onValue } from 'firebase/database'

const empleado = ref('')
const inicio = ref('')
const fin = ref('')
const motivo = ref('')
const lista = ref([])
const isSubmitting = ref(false)
const errorMsg = ref('')

onMounted(() => {
  const vacRef = dbRef(db, 'vacaciones')
  onValue(vacRef, (snap) => {
    lista.value = snap.exists() ? Object.values(snap.val()) : []
  })
})

const enviar = () => {
  errorMsg.value = ''
  
  // 1. Input Validation
  if (!empleado.value.trim() || !inicio.value || !fin.value) {
    errorMsg.value = 'Por favor completa todos los campos obligatorios.'
    return
  }

  const startDate = new Date(inicio.value)
  const endDate = new Date(fin.value)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (startDate < today) {
    errorMsg.value = 'La fecha de inicio no puede ser en el pasado.'
    return
  }

  if (endDate <= startDate) {
    errorMsg.value = 'La fecha de fin debe ser posterior a la fecha de inicio.'
    return
  }

  if (motivo.value.length > 500) {
    errorMsg.value = 'El motivo es demasiado largo (máx 500 caracteres).'
    return
  }

  // 2. Secure Error Handling & State Management
  isSubmitting.value = true
  
  const vacRef = dbRef(db, 'vacaciones')
  const nuevo = push(vacRef)

  set(nuevo, {
    id: nuevo.key,
    empleado: empleado.value.trim(), // Sanitize
    fecha_inicio: inicio.value,
    fecha_fin: fin.value,
    motivo: motivo.value.trim(), // Sanitize
    estado: 'pendiente',
    timestamp: Date.now()
  })
    .then(() => {
      alert('Solicitud enviada correctamente')
      // Reset form
      empleado.value = ''
      inicio.value = ''
      fin.value = ''
      motivo.value = ''
    })
    .catch((err) => {
      // Log technical error for devs
      console.error('Firebase Write Error:', err)
      // Show generic message to user
      errorMsg.value = 'Ocurrió un error al procesar tu solicitud. Intenta más tarde.'
    })
    .finally(() => {
      isSubmitting.value = false
    })
}
</script>
