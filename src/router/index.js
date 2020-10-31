import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import index from '../components/index.vue'
import welcome from '../components/welcome.vue'
import users from '../components/users/users.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import categories from '../components/goods/categories.vue'
import params from '../components/goods/params.vue'
import goods from '../components/goods/goods.vue'
import addgoods from '../components/goods/addgoods.vue'
import axios from 'axios'

Vue.use(VueRouter)
Vue.prototype.$http = axios

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/index',
    component: index,
    redirect: '/welcome',
    children:
    [{ path: '/welcome', component: welcome },
      { path: '/users', component: users },
      { path: '/rights', component: rights },
      { path: '/roles', component: roles },
      { path: '/categories', component: categories },
      { path: '/params', component: params },
      { path: '/goods', component: goods },
      { path: '/goods/add', component: addgoods }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

// 路由导航守卫
router.beforeEach((to, from, next) => {
  // 从登陆页面过来 直接放行
  if (to.path === '/login') return next()
  // 获取token值
  const toToken = window.sessionStorage.getItem('token')
  if (!toToken) return next('/login')
  next()
})
