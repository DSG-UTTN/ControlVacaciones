import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import VacacionesView from '../views/VacacionesView.vue'
import SalidasView from '../views/SalidasView.vue'
import AdminView from '../views/AdminView.vue'
import AdviceView from '../views/AdviceView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: LoginView },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/vacaciones', component: VacacionesView, meta: { requiresAuth: true } },
  { path: '/salidas', component: SalidasView, meta: { requiresAuth: true } },
  { path: '/admin', component: AdminView, meta: { requiresAuth: true } },
  { path: '/advice', component: AdviceView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
