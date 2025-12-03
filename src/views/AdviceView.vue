<template>
  <div class="max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-slate-800">Consejos Diarios</h1>
    
    <div class="flex gap-4 mb-8">
      <button 
        @click="fetchAdvice" 
        :disabled="loading" 
        class="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Cargando...' : 'Obtener Consejo' }}
      </button>
      <button 
        @click="clearAdvice" 
        v-if="adviceList.length > 0"
        class="px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition shadow-lg shadow-red-500/30"
      >
        Limpiar Todo
      </button>
    </div>

    <div v-if="error" class="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
      {{ error }}
    </div>

    <div class="space-y-4">
      <div v-if="adviceList.length === 0" class="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
        <p class="text-slate-400 italic">No hay consejos guardados. ¡Obtén uno nuevo!</p>
      </div>

      <div v-for="item in adviceList" :key="item.id" class="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex justify-between items-center gap-6 transform hover:-translate-y-1 transition duration-300">
        <blockquote class="text-xl text-slate-700 font-medium italic font-serif">
          "{{ item.advice }}"
        </blockquote>
        <button 
          @click="removeAdvice(item.id)" 
          class="text-slate-300 hover:text-red-500 transition p-2 rounded-full hover:bg-red-50" 
          title="Eliminar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { ref as dbRef, push, set, onValue, remove } from 'firebase/database'

const adviceList = ref([])
const loading = ref(false)
const error = ref(null)

// Cargar consejos guardados al iniciar
onMounted(() => {
  const adviceRef = dbRef(db, 'advice')
  onValue(adviceRef, (snap) => {
    adviceList.value = snap.exists() ? Object.values(snap.val()) : []
  })
})

const fetchAdvice = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('https://api.adviceslip.com/advice')
    if (!res.ok) throw new Error('Error al conectar con la API')
    
    const data = await res.json()
    const newAdvice = data.slip

    // Guardar en Firebase
    const adviceRef = dbRef(db, 'advice')
    
    const newItemRef = push(adviceRef)
    await set(newItemRef, {
      id: newItemRef.key,
      api_id: newAdvice.id,
      advice: newAdvice.advice,
      date: new Date().toISOString()
    })

  } catch (e) {
    console.error(e)
    error.value = 'No se pudo obtener el consejo. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

const removeAdvice = async (id) => {
  try {
    await remove(dbRef(db, `advice/${id}`))
  } catch (e) {
    console.error(e)
    error.value = 'Error al eliminar el consejo.'
  }
}

const clearAdvice = async () => {
  if(!confirm('¿Estás seguro de borrar todos los consejos?')) return
  try {
    await remove(dbRef(db, 'advice'))
  } catch (e) {
    console.error(e)
    error.value = 'Error al limpiar la lista.'
  }
}
</script>
