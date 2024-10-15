<template>
    <div>
      <!-- 查询框和按钮 -->
      <div style="margin-bottom: 16px;">
        <a-input 
          v-model:value="searchText"
          placeholder="输入通知标题进行查询" 
          style="width: 200px; margin-right: 8px;" 
        />
        <a-button type="primary" @click="handleSearch" html-type="button">查询</a-button>
        <a-button style="margin-left: 8px;" @click="handleReset">重置</a-button>
      </div>
  
      <!-- 通知模态框 -->
    <a-modal
      title="新增通知"
      :open="isNotificationModalVisible"
      @ok="handleAddNotificationOk"
      :confirmLoading="confirmLoading"
      @cancel="handleNotificationModalCancel"
      ok-text="确认"
      cancel-text="取消"
    >
      <a-form :model="notificationForm" layout="vertical" :rules="rules" ref="notificationFormRef">
        <a-form-item label="通知标题" name="title" required>
          <a-input v-model:value="notificationForm.title" placeholder="请输入通知标题" />
        </a-form-item>
        <a-form-item label="通知正文" name="content" required>
          <a-textarea v-model:value="notificationForm.content" placeholder="请输入通知正文" />
        </a-form-item>
        <a-form-item label="通知目标群体或用户名 (用英文逗号分隔)">
  <a-select
    v-model:value="notificationForm.notifyTargets"
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
        <a-form-item label="预定发送时间" name="scheduledTime">
          <a-date-picker v-model:value="notificationForm.scheduledTime" style="width: 100%;" show-time />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑通知模态框 -->
<a-modal
  title="编辑通知"
  :open="isEditNotificationModalVisible"
  @ok="handleEditNotificationOk"
  :confirmLoading="confirmLoading"
  @cancel="handleEditNotificationModalCancel"
>
  <a-form :model="editNotificationForm" layout="vertical">
    <a-form-item label="通知标题">
      <a-input v-model:value="editNotificationForm.title" placeholder="请输入通知标题"/>
    </a-form-item>
    <a-form-item label="通知正文">
      <a-textarea v-model:value="editNotificationForm.content" placeholder="请输入通知正文"/>
    </a-form-item>
    <a-form-item label="通知目标群体或用户名 (用英文逗号分隔)">
  <a-select
    v-model:value="editNotificationForm.notifyTargets"
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
    <a-form-item label="预定发送时间">
  <a-date-picker 
    v-model:value="editNotificationForm.scheduledTime" 
    style="width: 100%;" 
    :disabled="editNotificationForm.isDatePickerDisabled" 
    show-time 
  />
</a-form-item>

  </a-form>
</a-modal>


  
      <!-- 表格 -->
      <a-table 
        :columns="notificationColumns" 
        :data-source="notifications"
        :pagination="{ current: pageNum, pageSize: pageSize, total: total, showSizeChanger: true, showQuickJumper: true ,locale:{
            items_per_page: '条/页',
      jump_to: '跳至',
      page: '页',
      prev_page: '上一页',
      next_page: '下一页',
      prev_5: '向前 5 页',
      next_5: '向后 5 页',
      prev_3: '向前 3 页',
      next_3: '向后 3 页'
        }}"
        
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- 通知操作列 -->
          <template v-if="column.key === 'operation'">
            <span class="table-operation">
              <a @click="editNotification(record)">编辑通知</a>
              <a-dropdown>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="1" @click="confirmDeleteNotification(record)">删除通知</a-menu-item>
                    <a-divider />
                    <a-menu-item key="2" @click="sendNotificationNow(record)">立即发送</a-menu-item>
                  </a-menu>
                </template>
                <a>
                  更多
                  <a-icon :icon="DownOutlined" />
                </a>
              </a-dropdown>
            </span>
          </template>
        </template>
      </a-table>
    </div>
  </template>
  
  <script setup>
  import { ref,getCurrentInstance } from 'vue';
  import axios from 'axios';
  import { Modal } from 'ant-design-vue';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { onMounted } from 'vue';
  import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
  import moment from 'moment';
dayjs.locale('zh-cn'); 

  const isNotificationModalVisible = ref(false);
  const isEditNotificationModalVisible = ref(false);
  const confirmLoading = ref(false);
  const searchText = ref('');
  const pageNum = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  const notifications = ref([]);
  const { proxy } = getCurrentInstance();
const httpUrl = proxy.$httpUrl;
  
  const notificationForm = ref({
    title: '',
    content: '',
    notifyTargets: '',
    scheduledTime: null
  });
  
  const editNotificationForm = ref({
    title: '',
    content: '',
    notifyTargets: '',
    scheduledTime: null,
    isDatePickerDisabled:false,
  });
  
  const notificationColumns = [
  { title: '通知标题', dataIndex: 'title', key: 'title' },
  { title: '通知目标', dataIndex: 'notifyTargets', key: 'notifyTargets' },
  { 
    title: '发送状态', 
    key: 'status', 
    customRender: ({ record }) => {
      return record.displayStatus;  // 显示处理后的状态
    } 
  },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
];

function loadNotifications() {
  axios.post(`${httpUrl}/notifications/listPageTD`, {
    pageNum: pageNum.value,
    pageSize: pageSize.value
  }).then(res => {
    notifications.value = res.data.data.map(notification => {
      // 根据发送状态和时间设置显示内容
      let displayStatus = '';

      if (notification.status === '已发送') {
        displayStatus = `发送时间: ${notification.sendTime}`;
      } else if (notification.status === '待发送') {
        displayStatus = notification.scheduledTime
          ? `预定发送时间: ${notification.scheduledTime}`
          : '未指定预定发送时间';
      }

      return {
        ...notification,
        displayStatus, // 增加显示状态字段
      };
    });
    total.value = res.data.total;
  }).catch(error => {
    console.error('数据加载错误:', error);
  });
}


  function handleTableChange(pagination) {
  // 更新当前页码
  pageNum.value = pagination.current;
  pageSize.value = pagination.pageSize;

  // 重新加载数据
  loadNotifications();
}

  
function handleSearch() {
  // 每次搜索时重置页码为第一页
  pageNum.value = 1;

  // 发起请求，根据 title 进行搜索并分页
  axios.post(`${httpUrl}/notifications/listPageT`, {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    param: {
      title: searchText.value  // 传递搜索条件
    }
  })
  .then(response => {
    // 获取数据
    const titles = response.data.data || [];

    // 更新通知数据
    notifications.value = titles;

    // 更新总数
    total.value = response.data.total || 0;
  })
  .catch(error => {
    console.error('搜索加载错误:', error);
  });
}

  
  function handleReset() {
    searchText.value = '';
    loadNotifications();
  }
  
  function handleAddNotificationOk() {
    // 新增通知的逻辑
  }
  
  
  function editNotification(record) {
  isEditNotificationModalVisible.value = true;
  const isSent = record.status === '已发送';

  if (record.sendTime) {
    // 如果有 sendTime，则将其显示并设置为不可编辑
    editNotificationForm.value = {
        id: record.id,
      title: record.title,
      content: record.content,
      notifyTargets: record.notifyTargets,
      scheduledTime: moment(record.sendTime, 'YYYY-MM-DDTHH:mm:ss'), // 使用 moment 格式化 sendTime
      isDatePickerDisabled: isSent
    };
  } else if (record.scheduledTime) {
    // 如果没有 sendTime，但有 scheduled_time，允许编辑
    editNotificationForm.value = {
        id: record.id,
      title: record.title,
      content: record.content,
      notifyTargets: record.notifyTargets,
      scheduledTime: moment(record.scheduledTime, 'YYYY-MM-DDTHH:mm:ss'), // 使用 moment 格式化 scheduled_time
    };
  } else {
    // 如果都没有，则初始化为空
    editNotificationForm.value = {
        id: record.id,
      title: '',
      content: '',
      notifyTargets: '',
      scheduledTime: null,
      isDatePickerDisabled: false
    };
  }
}
function handleEditNotificationOk() {
  const { title, content, scheduledTime } = editNotificationForm.value;

  // 如果状态为“已发送”
  if (editNotificationForm.value.isDatePickerDisabled) {
    axios.post(`${httpUrl}/notifications/mod`, {
      id: editNotificationForm.value.id, // 确保有id字段
      title,
      content,
    })
    .then(() => {
      isEditNotificationModalVisible.value = false;
      loadNotifications();  // 刷新列表
    })
    .catch((error) => {
      console.error('提交修改错误:', error);
    });
  } else {
    // 状态为“未发送”，提交 scheduledTime
    axios.post(`${httpUrl}/notifications/mod`, {
      id: editNotificationForm.value.id, // 确保有id字段
      title,
      content,
      scheduledTime: scheduledTime ? scheduledTime.format('YYYY-MM-DDTHH:mm:ss') : null,
    })
    .then(() => {
      isEditNotificationModalVisible.value = false;
      loadNotifications();  // 刷新列表
    })
    .catch((error) => {
      console.error('提交修改错误:', error);
    });
  }
}



  
  // 删除通知确认
function confirmDeleteNotification(record) {
  Modal.confirm({
    title: '确认删除',
    content: `你确定要删除通知 "${record.title}" 吗？`,
    okText: '确认',
    cancelText: '取消',
    onOk() {
      deleteNotification(record);
    },
  });
}

// 删除通知逻辑
function deleteNotification(record) {
  axios.get(`${httpUrl}/notifications/delete?id=${record.id}`)
    .then(() => {
      loadNotifications();
    })
    .catch((error) => {
      console.error('删除错误:', error);
    });
}

function handleEditNotificationModalCancel() {
  isEditNotificationModalVisible.value = false;
}

  
  function sendNotificationNow(record) {
    const notifyTargets = record.notifyTargets;
    axios.get(`${httpUrl}/notifications/send?id=${record.id}&notifyTargets=${notifyTargets}`)
    .then(() =>{
      loadNotifications();
    }).catch((error)=>{
      console.error('发送异常:',error)
    })
  }
  
  onMounted(() => {
    loadNotifications();
  });
  </script>
  