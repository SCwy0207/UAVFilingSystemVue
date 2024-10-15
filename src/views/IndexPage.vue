<template>
   <a-layout>
     <!-- 顶部导航栏 -->
     <a-layout-header class="header">
       <div class="logo">
         <img src="@/assets/logo.png" alt="无人机备案系统" />
         <span class="logo-text">无人机备案系统</span>
       </div>
       <a-menu mode="horizontal" theme="dark" defaultSelectedKeys="home">
         <a-menu-item key="home">首页</a-menu-item>
         <a-menu-item key="notification">通知公告</a-menu-item>
         <a-menu-item key="policy">政策法规</a-menu-item>
         <a-menu-item key="search">信息查询</a-menu-item>
         <a-menu-item key="support">技术支持</a-menu-item>
       </a-menu>
       <div class="auth-icons">
            <router-link to="/login" class="auth-link">
              <span>登录/注册</span>
              <UserOutlined alt="登录/注册" />
            </router-link>
       </div>
     </a-layout-header>
 
     <!-- 内容主体 -->
     <a-layout-content class="content">
       <div class="banner">
         <a-carousel autoplay effect="fade">
           <div><img src="@/assets/DJI.jpg" alt="无人机" class="banner-image" /></div>
           <div><img src="@/assets/DJI2.jpg" alt="无人机" class="banner-image" /></div>
           <div><img src="@/assets/DJI3.jpg" alt="无人机" class="banner-image" /></div>
           <div><img src="@/assets/DJI4.jpg" alt="无人机" class="banner-image" /></div>
         </a-carousel>
         <div class="overlay-content">
           <h1>欢迎来到无人机备案系统</h1>
           <p>获取最新的无人机政策和技术支持</p>
         </div>
       </div>
 
       <!-- <div class="news-section">
         <h2>最新新闻</h2>
         <ul>
           <li v-for="(news, index) in newsList" :key="index">
             <a :href="news.link">{{ news.title }}</a>
           </li>
         </ul>
       </div> -->
     </a-layout-content>
 
     <!-- 页脚 -->
     <a-layout-footer class="footer">
       无人机备案系统 2024 Created by Victor Kuo
     </a-layout-footer>
   </a-layout>
</template>

 
 <script setup>
//  import { ref } from 'vue';
 import { UserOutlined } from '@ant-design/icons-vue';  // 引入图标
 
//  const newsList = ref([
//    { title: '无人机备案指南发布', link: '#' },
//    { title: '无人机飞行新规定', link: '#' },
//    { title: '最新无人机技术研讨会', link: '#' },
//    { title: '无人机管理系统升级', link: '#' }
//  ]);
 </script>
 
 <style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #003366;
  padding: 0 50px;
  position: fixed;
  width: 100%;
  z-index: 1000;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 50px;
  margin-right: 50px;
}

.logo-text {
  font-size: 24px;
  color: white;
}

.auth-icons {
  font-size: 20px;
  color: white;
}

.auth-link {
  color: white;
  text-decoration: none;
}

.auth-link .anticon {
  color: white;
}

.content {
  margin-top: 80px;
  padding: 50px;
  background-color: #f0f2f5;
  text-align: center;
}

.banner {
  position: relative;
  height: 550px;
}

.banner-image {
  width: 100%;
  height: 550px;
  object-fit: cover;
  border-radius: 10px;
}

.overlay-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
}

.overlay-content h1 {
  font-size: 48px;
  font-weight: bold;
}

.overlay-content p {
  font-size: 24px;
  margin-top: 20px;
}

.news-section {
  text-align: left;
  max-width: 800px;
  margin: 0 auto;
}

.news-section h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.news-section ul {
  list-style: none;
  padding: 0;
}

.news-section li {
  font-size: 18px;
  margin-bottom: 10px;
}

.news-section a {
  color: #003366;
  text-decoration: none;
}

.news-section a:hover {
  text-decoration: underline;
}

.footer {
  text-align: center;
  background-color: #003366;
  color: white;
  padding: 20px 0;
  margin-top: 50px;
}
</style>
