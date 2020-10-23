import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '../src/assets/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 在挂载之前进行预处理操作
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须return
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
