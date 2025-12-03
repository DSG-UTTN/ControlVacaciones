<template>
  <div>
    <h1 class="text-3xl font-bold mb-8 text-slate-800">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-500 mb-2 uppercase tracking-wide">Solicitudes de Vacaciones</h3>
        <p class="text-4xl font-bold text-blue-600">{{ totalVacaciones }}</p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-500 mb-2 uppercase tracking-wide">Solicitudes de Salidas</h3>
        <p class="text-4xl font-bold text-emerald-600">{{ totalSalidas }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { ref as dbRef, onValue } from 'firebase/database'

const totalVacaciones = ref(0)
const totalSalidas = ref(0)

onMounted(() => {
  detectarVacaciones()
  detectarSalidas()
})

function detectarVacaciones() {
  const posibles = ['vacaciones', 'Vacaciones', 'Vacas', 'vacas', 'solicitudesVacaciones']

  posibles.forEach((nodo) => {
    onValue(dbRef(db, nodo), (snap) => {
      if (snap.exists()) {
        console.log('Vacaciones encontradas en nodo:', nodo)
        totalVacaciones.value = Object.keys(snap.val()).length
      }
    })
  })
}

function detectarSalidas() {
  const posibles = ['salidas', 'Salidas', 'Salida', 'salida', 'solicitudesSalidas']

  posibles.forEach((nodo) => {
    onValue(dbRef(db, nodo), (snap) => {
      if (snap.exists()) {
        console.log('Salidas encontradas en nodo:', nodo)
        totalSalidas.value = Object.keys(snap.val()).length
      }
    })
  })
}
</script>
