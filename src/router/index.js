import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomePage.vue'),
    },
    {
      path: '/admin',
      component: () => import('../pages/admin/AdminLayout.vue'),
      //childen sẽ hiện trong routerview của AdminLayout.vue
      children: [
        {
          path: '',
          name: 'admin',
          component: () => import('../pages/admin/AdminDashboardPage.vue'),
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('../pages/admin/AdminUsersPage.vue'),
        },
        {
          path: 'snippets',
          name: 'admin-snippets',
          component: () => import('../pages/admin/AdminSnippetsPage.vue'),
        },
      ],
    },
    {
      path: '/me',
      name: 'profile',
      component: () => import('../pages/ProfilePage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../pages/SignupPage.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../pages/AboutPage.vue'),
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import('../pages/NotFoundPage.vue'),
      props: route => ({ query: route.query })
    },
    {
      path: '/expired',
      name: 'expired',
      component: () => import('../pages/ExpiredPage.vue'),
      props: route => ({ query: route.query })
    },
    {
      path: '/unlock/:shortCode',
      name: 'unlock',
      component: () => import('../pages/UnlockPage.vue'),
      props: true
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      redirect: '/not-found'
    }
  ],
})

export default router
