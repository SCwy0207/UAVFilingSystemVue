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
        <a-form-item label="型号名称" name="modelname" required>
          <a-input v-model:value="modelForm.modelname" placeholder="请输入型号名称" />
        </a-form-item>
        <a-form-item label="重量" name="weight" required>
          <a-input v-model:value="modelForm.weight" placeholder="请输入重量" />
        </a-form-item>
        <a-form-item label="续航时间" name="batteryLife" required>
          <a-input v-model:value="modelForm.batteryLife" placeholder="请输入续航时间" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 表格 -->
    <a-table 
      :columns="manufacturerColumns" 
      :data-source="data"
      :pagination="{ current: pageNum, pageSize: pageSize, total: total, showSizeChanger: true, showQuickJumper: true }"
      @change="handleTableChange"
      class="components-table-demo-nested"
    >
      <template #expandedRowRender="{ record }">
        <a-table :columns="modelColumns" :data-source="record.models" :pagination="false">
          <template #bodyCell="{ column, record }">
            <!-- 无人机型号的操作列 -->
            <template v-if="column.key === 'operation'">
              <span class="table-operation">
                <a @click="editModel(record)">编辑型号</a>
                <a-dropdown>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="handleAddModel(record)">新增型号</a-menu-item>
                      <a-menu-item @click="deleteModel(record)">删除型号</a-menu-item>
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
      </template>

      <template #bodyCell="{ column, record }">
        <!-- 无人机厂商的操作列 -->
        <template v-if="column.key === 'operation'">
          <span class="table-operation">
            <a @click="editManufacturer(record)">编辑厂商</a>
            <a-dropdown>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="handleAddManufacturer()">新增厂商</a-menu-item>
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
import { DownOutlined } from '@ant-design/icons-vue';

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
  modelname: '',
  weight: '',
  batteryLife: ''
});

const manufacturerColumns = [
  { title: '厂商名称', dataIndex: 'manufacturername', key: 'manufacturername' },
  { title: '隶属国家', dataIndex: 'country', key: 'country' },
  { title: '厂商官网', dataIndex: 'website', key: 'website' },
  { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } },
];

const modelColumns = [
  { title: '型号名称', dataIndex: 'modelname', key: 'modelname' },
  { title: '型号编号', dataIndex: 'modelid', key: 'modelid' },
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
      models: manufacturer.models || [] // 假设厂商数据中包含 models 数组
    }));
    total.value = res.total;
  }).catch(error => {
    console.error('数据加载错误:', error);
  });
}

function handleSearch() {
  pageNum.value = 1;
  loadManufacturers();
}

function handleReset() {
  searchText.value = '';
  loadManufacturers();
}

function handleAddManufacturer() {
  isManufacturerModalVisible.value = true;
}

function handleAddModel(record) {
  // 设置当前选中的厂商 ID
  modelForm.value.manufacturerId = record.id;
  isModelModalVisible.value = true;
}

function handleAddManufacturerOk() {
  manufacturerFormRef.value.validate().then(() => {
    confirmLoading.value = true;
    axios.post(`${httpUrl}/manufacturer/add`, manufacturerForm.value).then(() => {
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

function handleAddModelOk() {
  modelFormRef.value.validate().then(() => {
    confirmLoading.value = true;
    axios.post(`${httpUrl}/model/add`, modelForm.value).then(() => {
      message.success('型号新增成功');
      isModelModalVisible.value = false;
      confirmLoading.value = false;
      loadManufacturers();
    }).catch(error => {
      console.error('新增型号失败:', error);
      confirmLoading.value = false;
    });
  });
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
}

.gradient-button:focus {
  box-shadow: none;
}
</style>
