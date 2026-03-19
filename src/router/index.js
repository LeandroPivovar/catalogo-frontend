import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import AuthView from '../views/AuthView.vue'
import PendingView from '../views/PendingView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
    meta: { requiresGuest: true }
  },
  {
    path: '/pending',
    name: 'pending',
    component: PendingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../views/AdminLoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('../views/AdminDashboardView.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token');
  let userStatus = localStorage.getItem('userStatus');
  let userRole = localStorage.getItem('userRole');

  if (token === 'undefined' || token === 'null') {
    localStorage.removeItem('token');
    localStorage.removeItem('userStatus');
    localStorage.removeItem('userRole');
    token = null;
    userStatus = null;
    userRole = null;
  }

  const isPending = userStatus === 'pending';
  const isRejected = userStatus === 'rejected';
  const isAdmin = userRole === 'admin';
  const isModelo = userRole === 'modelo';
  const isVisualizador = userRole === 'visualizador';

  // Guard para Admin
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!token || !isAdmin) {
      next({ name: 'admin-login' });
    } else {
      next();
    }
    return;
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({ name: 'auth' });
    } else if (isVisualizador && to.name !== 'home') {
      // Visualizador não tem acesso a rotas protegidas (dashboard, pending)
      next({ name: 'home' });
    } else if ((isPending || isRejected) && to.name !== 'pending') {
      next({ name: 'pending' });
    } else if (isModelo && !isPending && !isRejected && to.name === 'pending') {
      next({ name: 'dashboard' });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (token) {
      if (isVisualizador) {
        next({ name: 'home' });
      } else if (isPending) {
        next({ name: 'pending' });
      } else {
        next({ name: 'dashboard' });
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
