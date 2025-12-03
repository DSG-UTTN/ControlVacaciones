<template>
  <div>
    <h1 class="text-3xl font-bold mb-8 text-slate-800">Solicitar Salida</h1>

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
                <label class="block text-sm font-medium text-slate-600 mb-1">Fecha</label>
                <input 
                  type="date" 
                  v-model="fecha" 
                  class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">Hora Salida</label>
                <input 
                  type="time" 
                  v-model="horaSalida" 
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
          <p class="text-slate-400">No hay salidas registradas</p>
        </div>

        <ul v-else class="space-y-4">
          <li v-for="s in lista" :key="s.id" class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition duration-200 flex flex-col gap-3 border-l-4 border-l-blue-500">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                {{ s.empleado.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1">
                <div class="flex justify-between items-center">
                  <strong class="text-slate-800">{{ s.empleado }}</strong>
                  <span 
                    class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    :class="{
                      'bg-yellow-100 text-yellow-700': s.estado === 'pendiente',
                      'bg-green-100 text-green-700': s.estado === 'aprobado',
                      'bg-red-100 text-red-700': s.estado === 'rechazado'
                    }"
                  >
                    {{ s.estado }}
                  </span>
                </div>
              </div>
            </div>

            <div class="pl-14 space-y-2">
              <div class="flex items-center gap-4 text-sm text-slate-500">
                <div class="flex items-center gap-1">
                  <span>📅</span>
                  <span>{{ s.fecha }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span>⏰</span>
                  <span>{{ s.hora_salida }}</span>
                </div>
              </div>
              
              <div class="bg-slate-50 p-3 rounded-lg text-sm text-slate-600">
                {{ s.motivo }}
              </div>
            </div>
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
const fecha = ref('')
const horaSalida = ref('')
const motivo = ref('')
const lista = ref([])
const isSubmitting = ref(false)
const errorMsg = ref('')

const cargar = () => {
  onValue(dbRef(db, 'salidas'), (snap) => {
    lista.value = snap.exists() ? Object.values(snap.val()) : []
  })
}

const enviar = () => {
  errorMsg.value = ''

  // 1. Input Validation
  if (!empleado.value.trim() || !fecha.value || !horaSalida.value) {
    errorMsg.value = 'Por favor completa todos los campos obligatorios.'
    return
  }

  const selectedDate = new Date(fecha.value)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (selectedDate < today) {
    errorMsg.value = 'La fecha no puede ser en el pasado.'
    return
  }

  if (motivo.value.length > 500) {
    errorMsg.value = 'El motivo es demasiado largo (máx 500 caracteres).'
    return
  }

  // 2. Secure Error Handling
  isSubmitting.value = true

  const salRef = dbRef(db, 'salidas')
  const nuevo = push(salRef)

  set(nuevo, {
    id: nuevo.key,
    empleado: empleado.value.trim(), // Sanitize
    fecha: fecha.value,
    hora_salida: horaSalida.value,
    motivo: motivo.value.trim(), // Sanitize
    estado: 'pendiente',
    timestamp: Date.now()
  })
    .then(() => {
      alert('Salida registrada correctamente ✔')
      // Reset form
      empleado.value = ''
      fecha.value = ''
      horaSalida.value = ''
      motivo.value = ''
    })
    .catch((err) => {
      console.error('Firebase Write Error:', err)
      errorMsg.value = 'Ocurrió un error al registrar la salida. Intenta más tarde.'
    })
    .finally(() => {
      isSubmitting.value = false
    })
}

onMounted(cargar)
</script>
