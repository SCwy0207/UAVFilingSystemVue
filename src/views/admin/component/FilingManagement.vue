<template>
      <!-- 查询框和按钮 -->
      <div style="margin-bottom: 16px;">
        <a-input 
          v-model:value="searchText"
          placeholder="输入用户名进行查询" 
          style="width: 200px; margin-right: 8px;" 
        />
        <a-button type="primary" @click="handleSearch">查询</a-button>
        <a-button style="margin-left: 8px;" @click="handleReset">重置</a-button>
  
      <!-- 无人机信息表格 -->
      <a-table 
        :columns="columns" 
        :data-source="droneData" 
        :pagination="{ 
          current: pageNum, 
          pageSize: pageSize, 
          total: total, 
          showSizeChanger: true, 
          showQuickJumper: true 
        }" 
        @change="handleTableChange"
      >
        <template v-slot:bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            <span>{{ (pageNum - 1) * pageSize + index + 1 }}</span>
          </template>
          <template v-else-if="column.key === 'username'">
            <span>{{ record.username }}</span>
          </template>
          <template v-else-if="column.key === 'manufacturer'">
            <span>{{ record.manufacturer }}</span>
          </template>
          <template v-else-if="column.key === 'productname'">
            <span>{{ record.productname }}</span>
          </template>
          <template v-else-if="column.key === 'model'">
            <span>{{ record.model }}</span>
          </template>
          <template v-else-if="column.key === 'serialnumber'">
            <span>{{ record.serialnumber }}</span>
          </template>
          <template v-else-if="column.key === 'serialPhoto'">
            <a-popover title="身份信息照片" trigger="hover">
              <template v-slot:content>
                <img :src="record.serialphoto" alt="正面照片" style="max-width: 200px; max-height: 200px;" />
              </template>
              <a-button @click="previewImage(record.serialphoto)">查看图片</a-button>
            </a-popover>
          </template>
          <template v-else-if="column.key === 'action'">
            <span>
              <a @click="deleteFiling(record)" type="link">删除备案</a>
            </span>
          </template>
        </template>
      </a-table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, getCurrentInstance} from 'vue';
  import axios from 'axios';
  import { message } from 'ant-design-vue';
  
  const searchText = ref('');
  const pageNum = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  const droneData = ref([]);
  const { proxy } = getCurrentInstance();
const httpUrl = proxy.$httpUrl;
  
  // 表头
  const columns = [
    { title: '序号', dataIndex: 'index', key: 'index' },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '生产厂商', dataIndex: 'manufacturer', key: 'manufacturer' },
    { title: '产品名称', dataIndex: 'productname', key: 'productname' },
    { title: '产品型号', dataIndex: 'model', key: 'model' },
    { title: '产品序列号', dataIndex: 'serialnumber', key: 'serialnumber' },
    { title: '身份信息照片', dataIndex: 'serialPhoto', key: 'serialPhoto' },
    { title: '操作', key: 'action' },
  ];
  
  // 查询无人机数据
  const loadDrones = async () => {
  try {
    // 第一次请求获取无人机数据
    const response = await axios.post(`${httpUrl}/drones/FilingDrones`, {
      params: {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
      },
    });

    const drones = response.data.data;
    total.value = response.data.total;

    // 获取所有用户ID
    const userIds = drones.map(drone => drone.userid);
    // 使用 Promise.all 并行请求每个 userId 对应的 username
    const usernameRes = await Promise.all(userIds.map(id =>
      axios.get(`${httpUrl}/users/getUsernameByUserid`, { params: { userid: id } })
    ));

    // 将每个请求到的 username 添加到 drones 数据中
    usernameRes.forEach((res, index) => {
      drones[index].username = res.data.username || '未知用户';  // 如果用户名不存在则显示 '未知用户'
    });

    // 更新无人机数据到表格
    droneData.value = drones;
  } catch (error) {
    console.error('加载无人机数据失败:', error);
    message.error('加载无人机数据失败，请重试');
  }
};



  
  // 查询按钮处理
  const handleSearch = () => {
    pageNum.value = 1; // 重置为第一页
    loadDrones();
  };
  
  // 重置按钮处理
  const handleReset = () => {
    searchText.value = '';
    loadDrones();
  };


  const previewImage = (url) => {
  window.open(url, '_blank'); // 在新标签页打开图片
};

const deleteFiling=async (record)=>{
  try {
        const confirmResult = window.confirm(`确认删除序列号为 ${record.serialnumber} 的备案吗？`);
        if (!confirmResult) {
            return;
        }

        const response = await axios.get(`${httpUrl}/drones/delete`, {
            params: {
                droneid:record.droneid
            }
        });

        if (response.data === 'true' || response.data === true) {
            message.success('删除成功');
            loadDrones(); // 刷新表格数据
        } else {
            message.error('删除失败');
        }
    } catch (error) {
        console.error('删除备案失败:', error);
        message.error('删除备案失败，请重试');
    }

}

  
  onMounted(loadDrones);
  </script>
  
  <style scoped>
  .gradient-button {
    background: linear-gradient(to right, #4CAF50, #81C784);
    color: white;
  }
  </style>
  