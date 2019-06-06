import Vue from 'vue'
import App from './App.vue'
import Axios from 'axios'
import mavonEditor from 'mavon-editor'
import VueRouter from 'vue-router'
import router from "./router"

Vue.config.productionTip = false
Vue.prototype.$http = Axios

Vue.use(mavonEditor)
Vue.use(VueRouter)

const instance = Axios.create()
instance.defaults.headers.common['Authorization'] = window.localStorage.getItem('token')
                                                    ? window.localStorage.getItem('token')
                                                    : ''

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
