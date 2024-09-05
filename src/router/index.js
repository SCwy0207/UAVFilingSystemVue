import { createWebHistory, createRouter } from 'vue-router';
import axios from 'axios';

import Index from '../views/IndexPage.vue';
import Login from '../views/LoginPage.vue';
import Register from '../views/RegisterPage.vue';
import ACenter from '../views/admin/AdminCenter.vue';
import UserProfile from '../views/admin/component/UserProfileManagement.vue';
import Alert from '../views/admin/component/SendAlert.vue';
import DroneManagement from '../views/admin/component/DroneManagement.vue';
import UCenter from '../views/user/UserCenter.vue';
import MyDeskTop from '../views/admin/component/MyDeskTop.vue';

const routes = [
  { path: '/', component: Index, meta: { title: '万智星云' } },
  { path: '/login', component: Login, meta: { title: '登录' } },
  { path: '/register', component: Register, meta: { title: '注册' } },
  {
    path: '/ACenter',
    component: ACenter,
    meta: { title: '管理中心', requiresAuth: true },
    children: [
      { path: 'my-desktop', component: MyDeskTop, meta: { requiresAuth: true } },
      { path: 'user-profile', component: UserProfile, meta: { requiresAuth: true } },
      { path: 'alert', component: Alert, meta: { requiresAuth: true } },
      { path: 'drone-management', component: DroneManagement, meta: { requiresAuth: true } },
    ],
  },
  {
    path: '/UCenter',
    component: UCenter,
    meta: { title: '用户中心' },
    children: [
      { path: 'user-profile', component: UserProfile },
      { path: 'alert', component: Alert },
      { path: 'drone-management', component: DroneManagement },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局守卫：在每次导航前检查 token
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // 检查是否需要 token 认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');
    
    if (token==null) {
      // 如果没有 token，重定向到登录页面
      next('/login');
    } else {
      try {
        // 通过 router.app.config.globalProperties 获取 httpUrl
        const httpUrl = 'http://localhost:8088';
        // 验证 token 是否有效
        const response = await axios.get(`${httpUrl}/api/verify-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          // token 有效，继续导航
          next();
        } else {
          // token 无效，重定向到登录页面
          next('/login');
        }
      } catch (error) {
        // token 验证失败，重定向到登录页面
        next('/login');
      }
    }
  } else {
    // 不需要 token 认证，直接导航
    next();
  }
});

export default router;
