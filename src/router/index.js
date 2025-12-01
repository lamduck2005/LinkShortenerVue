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
