<template>
  <div class="max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-slate-800">Administrar Solicitudes</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <div class="bg-gradient-to-br from-green-400 to-emerald-600 p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition duration-300">
        <h3 class="text-lg font-medium opacity-90">Vacaciones</h3>
        <p class="text-5xl font-bold mt-2">{{ vacaciones.length }}</p>
      </div>

      <div class="bg-gradient-to-br from-blue-400 to-indigo-600 p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition duration-300">
        <h3 class="text-lg font-medium opacity-90">Salidas</h3>
        <p class="text-5xl font-bold mt-2">{{ salidas.length }}</p>
      </div>
    </div>

    <section class="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-12">
      <div class="p-6 border-b border-slate-100">
        <h2 class="text-xl font-bold text-slate-700">Solicitudes de Vacaciones</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
            <tr>
              <th class="p-4 font-semibold">Empleado</th>
              <th class="p-4 font-semibold">Rango</th>
              <th class="p-4 font-semibold">Motivo</th>
              <th class="p-4 font-semibold">Estado</th>
              <th class="p-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-for="v in vacaciones" :key="v.id" class="hover:bg-slate-50 transition">
              <td class="p-4 font-medium text-slate-800">{{ v.empleado }}</td>
              <td class="p-4 text-slate-600 text-sm">{{ v.fecha_inicio }} <span class="text-slate-400 mx-1">→</span> {{ v.fecha_fin }}</td>
              <td class="p-4 text-slate-600 text-sm max-w-xs truncate" :title="v.motivo">{{ v.motivo }}</td>
              <td class="p-4">
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
              </td>
              <td class="p-4 text-center space-x-2">
                <button 
                  @click="aprobarVac(v.id)" 
                  class="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-200 transition"
                  title="Aprobar"
                >
                  ✓ Aprobar
                </button>
                <button 
                  @click="rechazarVac(v.id)" 
                  class="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition"
                  title="Rechazar"
                >
                  ✕ Rechazar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div class="p-6 border-b border-slate-100">
        <h2 class="text-xl font-bold text-slate-700">Solicitudes de Salidas</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
            <tr>
              <th class="p-4 font-semibold">Empleado</th>
              <th class="p-4 font-semibold">Fecha / Hora</th>
              <th class="p-4 font-semibold">Motivo</th>
              <th class="p-4 font-semibold">Estado</th>
              <th class="p-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-for="s in salidas" :key="s.id" class="hover:bg-slate-50 transition">
              <td class="p-4 font-medium text-slate-800">{{ s.empleado }}</td>
              <td class="p-4 text-slate-600 text-sm">{{ s.fecha }} <span class="text-slate-300 mx-1">|</span> {{ s.hora_salida }}</td>
              <td class="p-4 text-slate-600 text-sm max-w-xs truncate" :title="s.motivo">{{ s.motivo }}</td>
              <td class="p-4">
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
              </td>
              <td class="p-4 text-center space-x-2">
                <button 
                  @click="aprobarSal(s.id)" 
                  class="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-200 transition"
                  title="Aprobar"
                >
                  ✓ Aprobar
                </button>
                <button 
                  @click="rechazarSal(s.id)" 
                  class="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition"
                  title="Rechazar"
                >
                  ✕ Rechazar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { ref as dbRef, onValue, update } from 'firebase/database'

const vacaciones = ref([])
const salidas = ref([])

onMounted(() => {
  onValue(dbRef(db, 'vacaciones'), (snap) => {
    vacaciones.value = snap.exists() ? Object.values(snap.val()) : []
  })

  onValue(dbRef(db, 'salidas'), (snap) => {
    salidas.value = snap.exists() ? Object.values(snap.val()) : []
  })
})

const aprobarVac = (id) => update(dbRef(db, `vacaciones/${id}`), { estado: 'aprobado' })

const rechazarVac = (id) => update(dbRef(db, `vacaciones/${id}`), { estado: 'rechazado' })

const aprobarSal = (id) => update(dbRef(db, `salidas/${id}`), { estado: 'aprobado' })

const rechazarSal = (id) => update(dbRef(db, `salidas/${id}`), { estado: 'rechazado' })
</script>
