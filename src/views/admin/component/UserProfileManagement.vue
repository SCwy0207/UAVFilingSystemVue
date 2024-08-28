<style scoped>
/* 定义渐变按钮的样式 */
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

.gradient-button span {
  position: relative;
  z-index: 1;
}
</style>

<template>
  <div>
    <!-- 查询框和按钮 -->
    <div style="margin-bottom: 16px;">
      <a-input 
        v-model:value="searchText"
        placeholder="输入用户名进行查询" 
        style="width: 200px; margin-right: 8px;" 
      />
      <a-button type="primary" @click="handleSearch" html-type="button">查询</a-button>
      <a-button style="margin-left: 8px;" @click="handleReset">重置</a-button>
      <a-button class="gradient-button" style="float: right;margin-right: 8px;" @click="handleAdd">新增</a-button>
     <!--模态框-->
     <a-modal
        title="新增用户"
        :open="open"
        @ok="handleOk"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel"
        ok-text="确认"
        cancel-text="取消"
      >
        <a-form :model="userForm" layout="vertical" :rules="rules" ref="userFormRef">
          <!-- 必填项 -->
          <a-form-item label="用户名" name="username" required>
            <a-input v-model:value="userForm.username" placeholder="请输入用户名" />
          </a-form-item>

          <a-form-item label="角色" name="roleId" required>
            <a-select v-model:value="userForm.roleId" placeholder="请选择角色">
              <a-select-option value="1">管理员</a-select-option>
              <a-select-option value="2">用户</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="密码" name="password" required>
            <a-input-password v-model:value="userForm.password" placeholder="请输入密码" />
          </a-form-item>

          <a-form-item label="电子邮件" name="email" required>
            <a-input v-model:value="userForm.email" placeholder="请输入电子邮件" />
          </a-form-item>

          <a-form-item label="手机号码" name="phoneNumber">
            <a-input v-model:value="userForm.phoneNumber" placeholder="请输入手机号码" />
          </a-form-item>

          <a-form-item label="姓名" name="fullName">
          <div style="display: flex; gap: 8px;">
            <a-input v-model:value="userForm.lastName" placeholder="姓氏" style="flex: 1;" />
            <a-input v-model:value="userForm.firstName" placeholder="名字" style="flex: 1;" />
          </div>
        </a-form-item>

          <!-- 选填项 -->
          <a-form-item label="性别" name="gender">
            <a-select v-model:value="userForm.gender" placeholder="请选择性别">
              <a-select-option value="Male">男</a-select-option>
              <a-select-option value="Female">女</a-select-option>
              <a-select-option value="Other">其他</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="出生日期" name="dateOfBirth">
            <a-date-picker v-model:value="userForm.dateOfBirth" placeholder="请选择出生日期" />
          </a-form-item>

          <a-form-item label="个人简介" name="bio">
            <a-textarea v-model:value="userForm.bio" placeholder="请输入个人简介" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <a-table 
  :columns="columns" 
  :data-source="data"  
  :pagination="{ 
    current: pageNum, 
    pageSize: pageSize, 
    total: total, 
    showSizeChanger: true,  // 显示改变每页条数的下拉菜单
    showQuickJumper: true,  // 显示快速跳转
    locale: {
      items_per_page: '条/页',
      jump_to: '跳至',
      page: '页',
      prev_page: '上一页',
      next_page: '下一页',
      prev_5: '向前 5 页',
      next_5: '向后 5 页',
      prev_3: '向前 3 页',
      next_3: '向后 3 页'
    }
  }" 
  @change="handleTableChange"
>

    <!-- 表头 -->
    <template #headerCell="{ column }">
      <template v-if="column.key === 'index'">
          <span>序号</span>
      </template>
      <template v-if="column.key === 'username'">
        <span>
          <smile-outlined />
          用户名
        </span>
      </template>
    </template>
  
    <!-- 表格主体 -->
    <template #bodyCell="{ column, record,index }">
      <template v-if="column.key === 'index'">
          <span>{{ (pageNum - 1) * pageSize + index + 1 }}</span>
        </template>
      <template v-if="column.key === 'username'">
        <span>{{ record.username }}</span>
      </template>
      <template v-else-if="column.key === 'name'">
        <a>{{ record.name }}</a>
      </template>
      <template v-else-if="column.key === 'phoneNumber'">
        <span>{{ record.phoneNumber }}</span>
      </template>
      <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag :color="getStatusColor(record.status)">
            {{ getStatusText(record.status) }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a>详情</a>
          <a-divider type="vertical" />
          <a>删除</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            更多操作
            <down-outlined />
          </a>
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
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'; 
const open = ref(false);
const confirmLoading = ref(false);

const { proxy } = getCurrentInstance();
const httpUrl = proxy.$httpUrl;

const data = ref([]);
const pageNum = ref(1);
const pageSize = ref(10); // 每页显示的条数
const total = ref(0); // 总条数
const searchText = ref('');
const userFormRef = ref(null);

const columns = ref([
{
    title: '序号',
    key: 'index',
    width: 60,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '姓名',
    dataIndex: 'name', // 使用合并后的 name 字段
    key: 'name',
    resizable: true,
    width: 150,
  },
  {
    title: '电话号码',
    dataIndex: 'phoneNumber', // 使用处理后的 phoneNumber 字段
    key: 'phoneNumber',
    resizable: true,
    width: 150,
  },
  {
    title: '状态',
    key: 'tags',
    dataIndex: 'status',
    resizable: true,
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
  },
]);
const userForm = ref({
  email: '',
  password: '',
  username: '',
  phoneNumber: '',
  status: 'active',
  roleId: '2',
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: null,
  bio: ''
});
const rules = ref({
  email: [{ required: true, message: '请输入电子邮件', type: 'email' }],
  password: [{ required: true, message: '请输入密码' }],
  username: [{ required: true, message: '请输入用户名' }],
  status: [{ required: true, message: '请选择用户状态' }],
  roleId: [{ required: true, message: '请选择角色' }]
});

function getStatusText(status) {
  switch (status) {
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'suspended':
      return 'Suspended';
    default:
      return 'Unknown';
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'active':
      return 'green';
    case 'inactive':
      return 'volcano';
    case 'suspended':
      return 'geekblue';
    default:
      return 'gray';
  }
}

function loadPost() {
  Promise.all([
    axios.post(`${httpUrl}/users/listPageT`, {
      pageNum: pageNum.value,
      pageSize: pageSize.value
    }).then(res => res.data),

    axios.post(`${httpUrl}/userprofile/listPage`, {
      pageNum: pageNum.value,
      pageSize: pageSize.value
    }).then(res => res.data)
  ]).then(([userRes, userProfileRes]) => {
    if (!userProfileRes || !Array.isArray(userProfileRes)) {
      console.error('User profile data is missing or invalid');
      return;
    }

    const combinedData = userRes.data.map(user => {
    const profile = userProfileRes.find(p => p.userid === user.userid);

      // 检查名字是否包含中文字符
      const isChineseName = /[\u4e00-\u9fa5]/.test(profile?.firstname + profile?.lastname);
      
      const name = isChineseName 
        ? `${profile?.lastname || ''}${profile?.firstname || ''}` 
        : `${profile?.firstname || ''} ${profile?.lastname || ''}`;
        
      return {
        ...user,
        name: name || 'N/A',
        phoneNumber: user.phonenumber || 'N/A',
      };
    });
    
    data.value = combinedData;
    total.value = userRes.total;
    console.log("数据加载完成:", data.value);
  }).catch(error => {
    console.error('数据加载错误:', error);
  });
}






// function loadGet() {
//   axios.get(`${httpUrl}/users/list`, {
//     params: {
//       page: currentPage.value,
//       size: pageSize.value
//     }
//   }).then(res => res.data).then(res => {
//     console.log(res);
//     data.value = res.data; // 更新表格数据
//     totalItems.value = res.total; // 更新总条数
//   });
// }
function handleSearch() {
  // 校验 searchText,约束输入查询格式
  const nonEnglishPattern = /[^a-zA-Z0-9@.\s]/;
  if (nonEnglishPattern.test(searchText.value)) {
    message.error('输入格式错误，请输入英文');
    return; // 阻止后续的查询操作
  }

  // 重置页码到第一页
  pageNum.value = 1;

  axios
    .post(`${httpUrl}/users/listPageT`, {
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      param: {
        username: searchText.value // 使用当前的搜索文本作为查询条件
      }
    })
    .then(userRes => {
      const users = userRes.data.data || [];
      const userIds = users.map(user => user.userid);

      // 如果没有用户返回，直接设置数据为空并返回
      if (userIds.length === 0) {
        data.value = [];
        total.value = 0;
        return;
      }

      // 通过用户ID获取用户的详细资料
      return axios.post(`${httpUrl}/userprofile/listPage`, {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        param: {
          userIds: userIds // 使用从第一个请求获得的 userIds 作为查询条件
        }
      }).then(profileRes => {
        const profiles = profileRes.data || [];

        // 合并用户数据和用户资料
        const combinedData = users.map(user => {
          const profile = profiles.find(p => p.userid === user.userid);

          // 检查名字是否包含中文字符
          const isChineseName = /[\u4e00-\u9fa5]/.test(profile?.firstname + profile?.lastname);

          const name = isChineseName 
            ? `${profile?.lastname || ''}${profile?.firstname || ''}`
            : `${profile?.firstname || ''} ${profile?.lastname || ''}`;

          return {
            ...user,
            name: name || 'N/A',
            phoneNumber: user.phonenumber || 'N/A', // 从用户数据中获取手机号码
          };
        });

        data.value = combinedData;
        total.value = userRes.data.total;
        console.log("数据加载完成:", data.value);
      });
    })
    .catch(error => {
      console.error('数据加载错误:', error);
      message.error('数据加载失败，请稍后重试');
    });
}

function handleAdd() {
  console.log('新增按钮被点击');
  open.value = true;
}
function handleOk() {
  const form = userFormRef.value;
  form.validate().then(() => {
    confirmLoading.value = true;
    
    // 保存用户表数据
    axios.post(`${httpUrl}/users/save`, {
      email: userForm.value.email,
      password: userForm.value.password,
      username: userForm.value.username,
      phonenumber: userForm.value.phoneNumber,
      status: userForm.value.status,
      roleid: userForm.value.roleId
    }).then(response => {
      const userId = response.data.userId; // 假设后端返回了 UserID

      // 保存用户信息表数据
      return axios.post(`${httpUrl}/userprofile/save`, {
        userid: userId,
        firstname: userForm.value.firstName,
        lastname: userForm.value.lastName,
        gender: userForm.value.gender,
        dateofbirth: userForm.value.dateOfBirth,
        bio: userForm.value.bio
      });
    }).then(() => {
      confirmLoading.value = false;
      open.value = false;
      message.success('用户新增成功');
    }).catch(() => {
      confirmLoading.value = false;
      message.error('用户新增失败');
    });
    
  }).catch(() => {
    message.error('请填写完整的必填信息');
  });
}
function handleCancel() {
  console.log('取消按钮');
  open.value = false;
}


function handleReset() {
  searchText.value = '';  // 清空输入框内容
  pageNum.value = 1; // 重置页码
  loadPost();  // 重新加载数据
}


function handleTableChange(pagination) {
  pageNum.value = pagination.current;
  pageSize.value = pagination.pageSize;
  loadPost(); // 重新加载数据
}


onMounted(() => {
  loadPost();
  console.log("组件挂载成功");
  console.log("当前数据:",data.value); // 打印当前数据

});
</script>
