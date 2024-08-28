import { createWebHistory, createRouter } from 'vue-router'

import Index from '../views/IndexPage.vue'
import Login from '../views/LoginPage.vue'
import Register from '../views/RegisterPage.vue'
import ACenter from '../views/admin/AdminCenter.vue'
import UserProfile from '../views/admin/component/UserProfileManagement.vue'
import Alert from '../views/admin/component/SendAlert.vue'
import DroneManagement from '../views/admin/component/DroneManagement.vue'

const routes = [
  { path: '/', component: Index , meta:{title:'万智星云'}},
  { path: '/login', component: Login ,meta:{title:'登录'}},
  { path: '/register', component: Register , meta:{title:'注册'}},
  { 
    path: '/ACenter', 
    component: ACenter, 
    meta: { title: '管理中心' },
    children: [
      { path: 'user-profile', component: UserProfile },
      { path: 'alert', component: Alert},
      { path: 'drone-management', component: DroneManagement }
    ]
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

//router设置页面标题
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
   document.title = to.meta.title
  }
   next()
  })

export default router;
