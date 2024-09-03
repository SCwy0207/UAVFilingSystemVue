<template>
  <a-layout style="min-height: 100vh">
    <!-- 菜单区 -->
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">
        <img />
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <pie-chart-outlined />
          <span @click="() => router.push('/ACenter')">我的桌面</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>用户信息管理</span>
            </span>
          </template>
          <a-menu-item key="2" @click="() => router.push('/ACenter/user-profile')">用户管理</a-menu-item>
          <a-menu-item key="3" @click="() => router.push('/ACenter/user-profile-detail')">发布通知</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <team-outlined />
              <span>无人机授权管理</span>
            </span>
          </template>
          <a-menu-item key="4" @click="() => router.push('/ACenter/drone-management')">无人机管理</a-menu-item>
          <a-menu-item key="5">通行管制</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="6">
          <file-outlined />
          <span>操作记录</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- 头部区 -->
    <a-layout>
      <a-layout-header style="background:#282C34; width:100%; padding: 0; display: flex; justify-content: center; align-items: center; position: relative;">
          <h1 style="font-size: 200%; font-family: Arial, Helvetica, sans-serif; color:#fff; margin: 0;">万智星云后台管理系统</h1>
          <div style="position: absolute; right: 3%;">
          <a-popover trigger="click" >
            <template #content>
              <p @click="viewNotifications" style="cursor: pointer;">查看通知</p>
              <p @click="logout" style="cursor: pointer;">退出登录</p>
            </template>
            <a-badge :count="5">
              <a-avatar shape="square" icon="user" style="cursor: pointer;"/>
            </a-badge>
          </a-popover>
          </div>
        </a-layout-header>
  
      <!-- 视窗区 -->
      <a-watermark content="Ant Design Vue">
        <a-layout-content style="margin: 0 16px">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>User</a-breadcrumb-item>
            <a-breadcrumb-item>Bill</a-breadcrumb-item>
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
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { PieChartOutlined, UserOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons-vue';

const router = useRouter();

const viewNotifications = () => {
  router.push('/notifications');
};

const logout = () => {
  router.push('/login');
};

const collapsed = ref(false);
const selectedKeys = ref(['1']);
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
