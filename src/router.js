import VueRouter from "vue-router"
import Container from './pages/Container.vue'
import Preview from './pages/Preview.vue'

export default new VueRouter({
  routes: [
    {
      path: '/',
      component: Container,
    },
    {
      path: '/posts',
      component: Container,
    },
    {
      path: '/preview/:id',
      component: Preview,
    },
  ]
})