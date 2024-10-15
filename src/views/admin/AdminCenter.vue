<template>
  <div id="AdminCenter">
    <a-layout style="min-height: 100vh">
      <!-- 菜单区 -->
      <a-layout-sider v-model:collapsed="collapsed" collapsible>
        <div class="logo">
          <img>
        </div>
        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
          <a-menu-item key="1">
            <pie-chart-outlined />
            <span @click="() => $router.push('/ACenter/my-desktop')">我的桌面</span>
          </a-menu-item>
          <a-sub-menu key="sub1">
            <template #title>
              <span>
                <user-outlined />
                <span>用户管理</span>
              </span>
            </template>
            <a-menu-item key="2" @click="() => $router.push('/ACenter/user-profile')">用户信息管理</a-menu-item>
            <a-menu-item key="3" @click="() => $router.push('/ACenter/alert')">发布通知</a-menu-item>
            <a-menu-item key="4" @click="() => $router.push('/ACenter/alertBox')">通知管理</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <template #title>
              <span>
                <team-outlined />
                <span>无人机授权管理</span>
              </span>
            </template>
            <a-menu-item key="5" @click="() => $router.push('/ACenter/drone-management')">无人机管理</a-menu-item>
            <a-menu-item key="6" @click="() => $router.push('/ACenter/drone-filing-management')">无人机备案管理</a-menu-item>
            <a-menu-item key="7" @click="()=> $router.push('/ACenter/drone-unfiling-management')">备案审批</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>

      <!-- 头部区 -->
      <a-layout>
        <a-layout-header style="background:#282C34; width:100%; padding: 0; display: flex; justify-content: center; align-items: center; position: relative;">
          <h1 style="font-size: 200%; font-family: Arial, Helvetica, sans-serif; color:#fff; margin: 0;">万智星云后台管理系统</h1>
          <div style="position: absolute; right: 3%;">
          <a-popover trigger="click" >
            <template #content>
              <p @click="logout" style="cursor: pointer;">退出登录</p>
            </template>
            <a-badge :count="null">
              <a-avatar shape="square" icon="user" style="cursor: pointer;"/>
            </a-badge>
          </a-popover>
          </div>
        </a-layout-header>

        <!-- 视窗区 -->
        <a-watermark content="Ant Design Vue">
          <a-layout-content style="margin: 0 16px">
            <a-breadcrumb style="margin: 16px 0">
              <a-breadcrumb-item>{{ roleName }}</a-breadcrumb-item>
              <a-breadcrumb-item>{{ userName }}</a-breadcrumb-item>
            </a-breadcrumb>
            <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
              <router-view />
            </div>
          </a-layout-content>
        </a-watermark>

        <a-layout-footer style="text-align: center; position: relative; bottom: 1%; width: 90%;">
          Design ©2024 Created by Victor Kuo
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted,getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { PieChartOutlined, UserOutlined, TeamOutlined} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import axios from 'axios';

const router = useRouter();
const userName = ref(localStorage.getItem('username') || 'error'); 
const roleId = ref(localStorage.getItem('roleId') || '2'); 
const { proxy } = getCurrentInstance();
const httpUrl = proxy.$httpUrl;

const roleName = computed(() => {
  return roleId.value === '1' ? '管理员' : '用户';
});


const logout = async () => {
  const username = localStorage.getItem('username'); // 从本地存储获取用户名
  try {
    await axios.get(`${httpUrl}/logout`, { params: { username } }); // 发送 GET 请求
    message.success('成功退出登录'); // 可选：显示退出成功的消息
    router.push('/login'); // 跳转到登录页面
  } catch (error) {
    console.error('退出登录失败:', error);
    message.error('退出登录失败'); // 可选：显示错误消息
  }
};


const collapsed = ref(false);
const selectedKeys = ref(['1']);

onMounted(() => {
  router.push('/ACenter/my-desktop');
});
</script>

<style scoped>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
