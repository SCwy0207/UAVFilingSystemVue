<template>
    <div id="MyDeskTop">
        <el-row :gutter="16">
    <!-- 用户总数 -->
    <el-col :span="6">
      <el-card shadow="hover" class="stat-card user-card">
        <div class="stat-content">
          <el-icon><User /></el-icon>
          <el-statistic title="用户总数" :value="usersTotal" />
        </div>
      </el-card>
    </el-col>

    <!-- 在线活跃用户数量 -->
    <el-col :span="6">
      <el-card shadow="hover" class="stat-card active-user-card">
        <div class="stat-content">
          <el-icon><Online /></el-icon>
          <el-statistic title="在线活跃用户" :value="inActiveUsers" />
        </div>
      </el-card>
    </el-col>

    <!-- 无人机备案数量 -->
    <el-col :span="6">
      <el-card shadow="hover" class="stat-card drone-card">
        <div class="stat-content">
          <el-icon><Camera /></el-icon>
          <el-statistic title="无人机备案数量" :value="dronesTotal" />
        </div>
      </el-card>
    </el-col>

    <!-- 无人机厂商数量 -->
    <el-col :span="6">
      <el-card shadow="hover" class="stat-card manufacturer-card">
        <div class="stat-content">
          <el-icon><Factory /></el-icon>
          <el-statistic title="无人机厂商数量" :value="manufacturersTotal" />
        </div>
      </el-card>
    </el-col>
  </el-row>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, getCurrentInstance } from 'vue';
  import axios from 'axios';
  import { User, Online, Camera, Factory } from '@element-plus/icons-vue';
  
  const usersTotal = ref(0);
  const inActiveUsers = ref(0); 
  const dronesTotal = ref(0);
  const manufacturersTotal = ref(0);
  const { proxy } = getCurrentInstance();
  const httpUrl = proxy.$httpUrl;
  
  const fetchData = async () => {
    try {
      const usersResponse = await axios.get(`${httpUrl}/users/getUsersTotal`);
      usersTotal.value = usersResponse.data;
      const statusResponse = await axios.get(`${httpUrl}/users/getUsersInActiveTotal`);
      inActiveUsers.value = statusResponse.data;

      const dronesResponse = await axios.get(`${httpUrl}/drones/getDronesTotal`);
      dronesTotal.value = dronesResponse.data;
  
      const manufacturersResponse = await axios.get(`${httpUrl}/manufacturers/getManufacturersTotal`);
      manufacturersTotal.value = manufacturersResponse.data;
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };
  
  onMounted(() => {
    fetchData();
  });
  </script>
  
  <style scoped>
#MyDeskTop{
    height:70vh;
    width:auto;
}

  .el-card {
    padding: 16px;
    background-color: #f5f5f5;
    border-radius: 8px;
  }
  
  </style>
  