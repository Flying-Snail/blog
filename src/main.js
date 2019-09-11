import Vue from 'vue'
import App from './App.vue'
import Axios from 'axios'
import mavonEditor from 'mavon-editor'
import VueRouter from 'vue-router'
import router from "./router"

Axios.interceptors.request.use(
  config => {
    config.headers.Authorization = window.localStorage.getItem('token')
      ? window.localStorage.getItem('token')
      : ''
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

Vue.config.productionTip = false
Vue.prototype.$http = Axios

Vue.use(mavonEditor)
Vue.use(VueRouter)

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
