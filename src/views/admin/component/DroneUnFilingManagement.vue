<template>
    <div>
      <a-table 
        :columns="droneColumns" 
        :data-source="droneData"
        :pagination="{ pageSize: pageSize, total: total, showSizeChanger: true }"
        @change="handleTableChange"
      >
        <template v-slot:bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a @click="handleApprove(record)">审核通过</a>
            <a @click="handleReject(record)" style="margin-left: 8px;">拒绝</a>
          </template>
          <template v-if="column.key === 'frontphoto'">
            <a-popover title="查看正面照片" trigger="hover">
              <template v-slot:content>
                <img :src="record.frontphoto" alt="正面照片" style="max-width: 200px; max-height: 200px;"  />
              </template>
              <a-button  @click="previewImage(record.frontphoto)">查看图片</a-button>
            </a-popover>
          </template>
          <template v-if="column.key === 'serialphoto'">
            <a-popover title="查看序列号照片" trigger="hover">
              <template v-slot:content>
                <img :src="record.serialphoto" alt="序列号照片" style="max-width: 200px; max-height: 200px;"  />
              </template>
              <a-button @click="previewImage(record.serialphoto)">查看图片</a-button>
            </a-popover>
          </template>
        </template>
      </a-table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, getCurrentInstance } from 'vue';
  import axios from 'axios';
  import { message } from 'ant-design-vue';
  
  const pageSize = ref(10);
  const total = ref(0);
  const droneData = ref([]);
  const { proxy } = getCurrentInstance();
  const httpUrl = proxy.$httpUrl;
  
  const droneColumns = [
    { title: '隶属用户ID', dataIndex: 'userid', key: 'userid' }, 
    { title: '生产厂商', dataIndex: 'manufacturer', key: 'manufacturer' }, 
    { title: '产品名称', dataIndex: 'productname', key: 'productname' },
    { title: '产品型号', dataIndex: 'model', key: 'model' },
    { title: '产品序列号', dataIndex: 'serialnumber', key: 'serialnumber' }, 
    { title: '唯一识别码', dataIndex: 'uniqueid', key: 'uniqueid' }, 
    { title: '备案正面照片', dataIndex: 'frontphoto', key: 'frontphoto' }, 
    { title: '备案序列号照片', dataIndex: 'serialphoto', key: 'serialphoto' }, 
    { title: '操作', key: 'operation' },
  ];
  
  const loadDrones = async () => {
    try {
      const response = await axios.post(`${httpUrl}/drones/filingManagement`);
      droneData.value = response.data.data; 
      total.value = response.data.total;
    } catch (error) {
      console.error('加载无人机数据失败:', error);
    }
  };
  
  const handleApprove = async (record) => {
    try {
      await axios.get(`${httpUrl}/drones/accept`,{
      params: { serialnumber: record.serialnumber }
    });
      message.success('审核通过');
      loadDrones();
    } catch (error) {
      console.error('审核失败:', error);
      message.error('审核失败');
    }
  };
  
  const handleReject = async (record) => {
    console.log(record.serialnumber );
    try {
      await axios.get(`${httpUrl}/drones/refuse`,{
      params: { serialnumber: record.serialnumber }
    });
      message.success('已拒绝');
      loadDrones();
    } catch (error) {
      console.error('拒绝失败:', error);
      message.error('拒绝失败');
    }
  };
  
  const handleTableChange = (pagination, filters, sorter) => {
    console.log('分页:', pagination);
    console.log('过滤器:', filters);
    console.log('排序:', sorter);
  };
  const previewImage = (url) => {
  window.open(url, '_blank'); // 在新标签页打开图片
};
  
  onMounted(loadDrones);
  </script>
  
  <style scoped>
  .table-operation {
    display: flex;
    align-items: center;
  }
  </style>
  