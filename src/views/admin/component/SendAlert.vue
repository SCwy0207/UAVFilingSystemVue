<template>
   <div style="padding: 24px;"> 
     <a-form layout="vertical">
       <!-- 通知目标群体或用户名 -->
       <a-form-item label="通知目标群体或用户名 (用英文逗号分隔)">
         <a-select
           v-model:value="selectedTargets"
           mode="tags"
           placeholder="请选择通知对象或输入用户名"
           style="width: 100%;"
           :allow-clear="true"
         >
           <a-select-option value="管理员">管理员</a-select-option>
           <a-select-option value="用户">用户</a-select-option>
           <a-select-option value="ALL">所有人</a-select-option>
         </a-select>
       </a-form-item>

       <!-- 主题输入框 -->
       <a-form-item label="主题">
         <a-input v-model:value="notificationTitle" placeholder="请输入通知主题" />
       </a-form-item>

       <!-- 正文输入框 -->
       <a-form-item label="正文">
         <a-textarea v-model:value="notificationContent" :rows="4" placeholder="请输入通知正文" />
       </a-form-item>

       <!-- 定时发送时间选择 -->
       <a-form-item label="定时发送">
         <a-date-picker v-model:value="scheduledTime" show-time placeholder="选择发送时间" style="width: 100%;" />
       </a-form-item>

       <!-- 发送按钮 -->
       <a-form-item>
         <a-button type="primary" @click="sendNotification">发送</a-button>
       </a-form-item>
     </a-form>
   </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
import {message } from 'ant-design-vue';
import axios from 'axios';

// 绑定表单字段
const selectedTargets = ref([]); // 通知目标群体或手动输入的用户名
const notificationTitle = ref(''); // 主题输入框
const notificationContent = ref(''); // 正文输入框
const scheduledTime = ref(null); // 定时发送的时间选择框

// 获取 Vue 当前实例以获取全局配置
const { proxy } = getCurrentInstance();
const httpUrl = proxy.$httpUrl; // 从全局配置中获取后端的 URL

// 异步发送通知请求
const sendNotification = async () => {
  if (!notificationTitle.value || !notificationContent.value) {
    message.error('请填写完整的通知信息');
    return;
  }

  // 构造要发送的请求数据
  const payload = {
   notifyTargets: selectedTargets.value.join(','), // 目标群体或用户名，逗号分隔
    title: notificationTitle.value,
    content: notificationContent.value,
    scheduledTime: scheduledTime.value ? scheduledTime.value.format('YYYY-MM-DDTHH:mm:ss') : null, // 没有选择时间则为即时发送
  };

  try {
    // 异步发送请求到后端保存接口
    const response = await axios.post(`${httpUrl}/notifications/saveAndSend`, payload);
    if (response.data.code === 200) { // 成功的状态码
      // 可根据需求在成功后清空表单或其他操作
      selectedTargets.value = [];
      notificationTitle.value = '';
      notificationContent.value = '';
      scheduledTime.value = null;
      message.success('通知任务成功部署');
    } else {
      message.error(`通知保存失败: ${response.data.message}`);
    }
  } catch (error) {
    message.error('通知保存失败，请检查网络连接或服务器状态');
  } 

};
</script>

<style scoped>
/* 添加必要的样式 */
</style>
