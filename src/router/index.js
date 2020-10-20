import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import index from '../components/index.vue'
import axios from 'axios'

Vue.use(VueRouter)
Vue.prototype.$http = axios

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/index', component: index }
]

const router = new VueRouter({
  routes
})

export default router

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 正常登录，放行
  next()
  // 从login登录，放行
  if (to.path === '/login') return next()
  // 保存token值
  const toToken = window.sessionStorage.getItem('token')
  if (!toToken) return next('/login')
})
