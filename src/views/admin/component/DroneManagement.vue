<template>
  <div>
    <!-- 查询框和按钮 -->
    <div style="margin-bottom: 16px;">
      <a-input 
        v-model:value="searchText"
        placeholder="输入厂商名称进行查询" 
        style="width: 200px; margin-right: 8px;" 
      />
      <a-button type="primary" @click="handleSearch" html-type="button">查询</a-button>
      <a-button style="margin-left: 8px;" @click="handleReset">重置</a-button>
      <a-button class="gradient-button" style="float: right; margin-right: 8px;" @click="handleAddManufacturer">新增厂商</a-button>
    </div>

    <!-- 厂商模态框 -->
    <a-modal
      title="新增厂商"
      :open="isManufacturerModalVisible"
      @ok="handleAddManufacturerOk"
      :confirmLoading="confirmLoading"
      @cancel="handleManufacturerModalCancel"
      ok-text="确认"
      cancel-text="取消"
    >
      <a-form :model="manufacturerForm" layout="vertical" :rules="rules" ref="manufacturerFormRef">
        <a-form-item label="厂商名称" name="manufacturername" required>
          <a-input v-model:value="manufacturerForm.manufacturername" placeholder="请输入厂商名称" />
        </a-form-item>
        <a-form-item label="隶属国家" name="country" required>
          <a-input v-model:value="manufacturerForm.country" placeholder="请输入厂商隶属国家" />
        </a-form-item>
        <a-form-item label="厂商官方网址" name="website" required>
          <a-input v-model:value="manufacturerForm.website" placeholder="请输入厂商官方网址" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 型号模态框 -->
    <a-modal
      title="新增型号"
      :open="isModelModalVisible"
      @ok="handleAddModelOk"
      :confirmLoading="confirmLoading"
      @cancel="handleModelModalCancel"
      ok-text="确认"
      cancel-text="取消"
    >
      <a-form :model="modelForm" layout="vertical" :rules="modelRules" ref="modelFormRef">
        <a-form-item label="型号名称" name="model" required>
          <a-input v-model:value="modelForm.model" placeholder="请输入型号名称" />
        </a-form-item>
        <a-form-item label="注册名称" name="registrationname" required>
          <a-input v-model:value="modelForm.registrationname" placeholder="请输入注册名称" />
        </a-form-item>
        <a-form-item label="是否允许飞行" name="allowflight" required>
          <a-switch v-model:checked="modelForm.allowflight" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 表格 -->
    <a-table 
      :columns="manufacturerColumns" 
      :data-source="data"
      :pagination="{ current: pageNum, pageSize: pageSize, total: total, showSizeChanger: true, showQuickJumper: true ,locale: {
      items_per_page: '条/页',
      jump_to: '跳至',
      page: '页',
      prev_page: '上一页',
      next_page: '下一页',
      prev_5: '向前 5 页',
      next_5: '向后 5 页',
      prev_3: '向前 3 页',
      next_3: '向后 3 页'
    } }"
      @change="handleTableChange"
      @expand="(expanded, record) => expanded && loadDroneTypes(record.manufacturername, record)" 
      class="components-table-demo-nested"
    >

      <template #expandedRowRender="{ record }">
        <a-table 
          :columns="modelColumns" 
          :data-source="record.models" 
          :pagination="false"
        >
          <template #bodyCell="{ column, record }">
            <!-- 自定义是否允许飞行列 -->
            <template v-if="column.key === 'allowflight'">
              <div>
                <span :style="{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', marginRight: '8px', backgroundColor: record.allowflight ? 'green' : 'red' }"></span>
                <a-button  @click="toggleFlightStatus(record)">
                  {{ record.allowflight ? '允许飞行' : '禁止飞行' }}
                </a-button>
              </div>
            </template>
            <template v-if="column.key === 'operation'">
              <span class="table-operation">
                <a @click="editModel(record)">编辑型号</a>
                <a style="margin-left: 8px;" @click="deleteModel(record)">删除型号</a>
              </span>
            </template>
          </template>
        </a-table>
      </template>

      <template #bodyCell="{ column, record }" >
        <!-- 无人机厂商的操作列 -->
        <template v-if="column.key === 'operation'">
          <span class="table-operation">
            <a @click="editManufacturer(record)">编辑厂商</a>
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="handleAddModel(record)">新增型号</a-menu-item>
                  <a-menu-item @click="deleteManufacturer(record)">删除厂商</a-menu-item>
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
import { ref, onMounted, getCurrentInstance } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import {DownOutlined } from '@ant-design/icons-vue';

const isManufacturerModalVisible = ref(false);
const isModelModalVisible = ref(false);
const confirmLoading = ref(false);
const searchText = ref('');
const manufacturerFormRef = ref(null);
const modelFormRef = ref(null);
const { proxy } = getCurrentInstance();
const httpUrl = proxy.$httpUrl;

const data = ref([]);
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);

const manufacturerForm = ref({
  manufacturername: '',
  country: '',
  website: ''
});

const modelForm = ref({
  model: '',
  registrationname: '',
  allowflight: false,
  manufacturerid: ''
});

const manufacturerColumns = [
  { title: '厂商名称', dataIndex: 'manufacturername', key: 'manufacturername' },
  { title: '隶属国家', dataIndex: 'country', key: 'country' },
  { title: '厂商官网', dataIndex: 'website', key: 'website' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } },
];

const modelColumns = [
  { title: '型号名称', dataIndex: 'model', key: 'model' },
  { title: '注册名称', dataIndex: 'registrationname', key: 'registrationname' },
  { title: '是否允许飞行', dataIndex: 'allowflight', key: 'allowflight', scopedSlots: { customRender: 'allowflight' } },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } },
];


function loadManufacturers() {
  axios.post(`${httpUrl}/manufacturers/listPage`, {
      pageNum: pageNum.value,
      pageSize: pageSize.value
  }).then(res => res.data).then(res => {
    data.value = res.data.map((manufacturer, index) => ({
      ...manufacturer,
      key: index,
      models: [] // 初始化 models 为一个空数组，等待加载
    }));
    total.value = res.total;
  }).catch(error => {
    console.error('数据加载错误:', error);
  });
}
// 获取型号数据的方法
function loadDroneTypes(manufacturerName, record) {
  axios.post(`${httpUrl}/manufacturers/postDroneTypesByManufactrername`, null, {
    params: {
      manufacturername: manufacturerName
    }
  }).then(res => {
    if (res.data && res.data.droneTypes) {
      // 更新型号数据
      record.models = res.data.droneTypes.map((model, index) => ({
        ...model,
        key: index,
        allowflight: model.allowflight // 确保 allowflight 是布尔值
      }));
    } else {
      // 处理没有型号数据的情况
      record.models = [];
    }
  }).catch(error => {
    console.error('获取型号数据失败:', error);
  });
}

// 处理新增型号的函数
function handleAddModelOk() {
  modelFormRef.value.validate().then(() => {
    confirmLoading.value = true;
    axios.post(`${httpUrl}/dronetypes/save`, modelForm.value)
      .then(() => {
        message.success('型号新增成功');
        isModelModalVisible.value = false;
        confirmLoading.value = false;
        
        // 找到对应的厂商记录
        const manufacturerRecord = data.value.find(item => item.manufacturername === modelForm.value.manufacturername);

        if (manufacturerRecord) {
          // 重新加载该厂商下的型号数据
          loadDroneTypes(manufacturerRecord.manufacturername, manufacturerRecord);
        } else {
          console.error('无法找到对应的厂商记录');
        }

      })
      .catch(error => {
        console.error('新增型号失败:', error);
        confirmLoading.value = false;
      });
  });
}


function toggleFlightStatus(record) {
  record.allowflight = !record.allowflight;
  axios.get(`${httpUrl}/dronetypes/modAllowflight`,{
    params:{
      model:record.model,
      allowflight:record.allowflight
    }
  }).then(response => {
    if(response.data){
      console.log(record.model+"修改状态成功");
    }else{
      console.log(record.model+"修改状态失败");
    }
  }).catch(error => {
    console.error('Error occurred:', error);
  });
}



function handleSearch() {
  pageNum.value = 1;
  axios.post(`${httpUrl}/manufacturers/listPage`, {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    param: {
      manufacturername: searchText.value
    }
  }).then((response) => {
    const { data: manufacturers, total: totalItems } = response.data || {};
    data.value = manufacturers.map((manufacturer, index) => ({
      ...manufacturer,
      key: index,
      models: [] // 初始化 models 为一个空数组，等待加载
    }));
    total.value = totalItems || 0;
  }).catch((error) => {
    console.error('查询制造商失败:', error);
  });
}


function handleReset() {
  searchText.value = '';
  loadManufacturers();
}


function handleAddManufacturer(){
  console.log('新增按钮被点击');
  isManufacturerModalVisible.value = true;
}

function handleAddManufacturerOk() {
  manufacturerFormRef.value.validate().then(() => {
    confirmLoading.value = true;
    axios.post(`${httpUrl}/manufacturers/save`, manufacturerForm.value).then(() => {
      message.success('厂商新增成功');
      isManufacturerModalVisible.value = false;
      confirmLoading.value = false;
      loadManufacturers();
    }).catch(error => {
      console.error('新增厂商失败:', error);
      confirmLoading.value = false;
    });
  });
}

async function handleAddModel(record) {
  try {
    // 获取厂商名称
    const manufacturerName = record.manufacturername;

    // 根据厂商名称查询对应的manufacturerid
    const response = await axios.get(`${httpUrl}/manufacturers/getManufactureridByManufacturerName`, {
      params: {
        manufacturername: manufacturerName
      }
    });

    if (response.data && response.data.manufacturerid) {
      // 设置modelForm中的manufacturerid
      modelForm.value.manufacturerid = response.data.manufacturerid;

      // 显示型号模态框
      isModelModalVisible.value = true;
    } else {
      message.error('未能找到对应的厂商ID,请检查网络或联系管理员');
    }
  } catch (error) {
    console.error('查询厂商ID失败:', error);
    message.error('查询厂商ID时发生错误');
  }
}



function handleManufacturerModalCancel() {
  isManufacturerModalVisible.value = false;
}

function handleModelModalCancel() {
  isModelModalVisible.value = false;
}

function handleTableChange(pagination) {
  pageNum.value = pagination.current;
  pageSize.value = pagination.pageSize;
  loadManufacturers();
}

function editModel(record) {
  console.log('编辑型号', record);
  // 实现编辑型号的逻辑
}

onMounted(() => {
  loadManufacturers();
});
</script>

<style scoped>
.gradient-button {
  border: none;
  background: linear-gradient(135deg, #6253e1, #04befe);
  color: #fff;
  transition: background 0.3s ease;
  position: relative;
  transform: translateZ(0);
  /* 字体平滑设置 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

.gradient-button:hover {
  background: linear-gradient(135deg, #04befe, #6253e1);
  color: #fff;
}

.gradient-button:focus {
  box-shadow: none;
}
</style>
