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
.ant-divider {
  margin:0 auto;
}
.bold-menu-item{
  font-weight: bold;
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
        style="top:1%;"
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
       <!-- 详情模态框 -->
       <a-drawer
       title="用户信息详情"
       :width="720"
       :visible="visible"
       :body-style="{ paddingBottom: '100px' }"
       @close="onClose"
     >
     <a-form :model="form" layout="vertical" :rules="rules2" ref="formRef" hide-required-mark>
    <!-- 用户信息部分 -->
    <a-row :gutter="16">
      <a-col :span="24">
        <a-avatar :size="64" icon="user" style="margin-right: 16px" />
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="form.username" disabled />
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input v-model:value="form.password" placeholder="请输入密码" />
        </a-form-item>
      </a-col>
    </a-row>

         <!-- 分割线 -->
         <a-divider />

         <!-- 姓名、邮箱、密码等信息 -->
         <a-row :gutter="16">
           <a-col :span="12">
             <a-form-item label="姓名" name="name">
               <a-input v-model:value="fullName" disabled />
             </a-form-item>
           </a-col>
           <a-col :span="12">
             <a-form-item label="性别" name="gender">
               <a-select v-model:value="form.gender" placeholder="请选择性别">
                 <a-select-option value="Male">男</a-select-option>
                 <a-select-option value="Female">女</a-select-option>
                 <a-select-option value="Other">其他</a-select-option>
               </a-select>
             </a-form-item>
           </a-col>
         </a-row>
         <a-row :gutter="16">
           <a-col :span="12">
             <a-form-item label="邮箱" name="email">
               <a-input v-model:value="form.email" placeholder="请输入邮箱" />
             </a-form-item>
           </a-col>
           <a-col :span="12">
             <a-form-item label="手机号" name="phoneNumber">
               <a-input v-model:value="form.phoneNumber" placeholder="请输入手机号" />
             </a-form-item>
           </a-col>
         </a-row>
         <a-row :gutter="16">
           <a-col :span="12">
            <a-form-item label="出生日期" name="dateOfBirth">
  <a-date-picker 
    v-model:value="form.dateOfBirth"
    style="width: 100%"
    :get-popup-container="trigger => trigger.parentNode"
  />
</a-form-item>

           </a-col>
           <a-col :span="12">
             <a-form-item label="个人简介" name="bio">
               <a-textarea
                 v-model:value="form.bio"
                 :rows="4"
                 placeholder="请输入个人简介"
               />
             </a-form-item>
           </a-col>
         </a-row>

         <!-- 无人机型号信息表格 -->
         <a-divider style="margin-top: 20px;" />
    <a-table :columns="columns2" :data-source="drones" row-key="droneID">
      <template #action="{ record }">
        <span>
          <a @click="editDrone(record)" type="link">修改</a>
          <a-divider style="margin: 8px;" />
          <a @click="deleteDrone(record)" type="link">删除</a>
        </span>
      </template>
    </a-table>

       </a-form>
       <div
         :style="{
           position: 'absolute',
           right: 0,
           bottom: 0,
           width: '100%',
           borderTop: '1px solid #e9e9e9',
           padding: '10px 16px',
           background: '#fff',
           textAlign: 'right',
           zIndex: 1,
         }"
       >
         <a-button :style="{ marginRight: '8px' }" @click="onClose">
           取消
         </a-button>
         <a-button type="primary" @click="submitForm">
           提交
         </a-button>
       </div>
     </a-drawer>
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
          <a @click="fetchUserDetails(record.username)">详情</a>
          <a-divider type="vertical" />
          <a style="margin-left: 8px;">删除</a>
          <a-divider type="vertical" />
          <a-dropdown>
          <a class="ant-dropdown-link">
            更多操作
            <down-outlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="notifyUser(record)" class="bold-menu-item">通知用户</a-menu-item>
              <a-divider />
              <a-menu-item key="2" class="bold-menu-item">登录管控
                <a-menu-sub title="" popupOffset="[0, 0]">
            <a-menu-item key="2-1" @click="manageLogin(record, 'allow')" style="font-weight: normal !important;">允许登录</a-menu-item>
            <a-menu-item key="2-2" @click="manageLogin(record, 'forbid')"  style="font-weight: normal !important;">禁止登录</a-menu-item>
          </a-menu-sub>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        </span>
      </template>
    </template>
  </a-table>
   
  </div>
</template>

<script setup>
import moment from 'moment';
import { ref, onMounted, getCurrentInstance } from 'vue';
import axios from 'axios';
import { message } from 'ant-design-vue';
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);
dayjs.locale('zh-cn'); 

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


const formRef = ref(null);

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
    width:150,
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
    title: '角色',
    dataIndex: 'roleid', // 新增的列
    key: 'roleid',
    resizable: true,
    width: 150,
    // 如果需要显示具体的角色名称，而不仅仅是ID，可以在此添加自定义渲染逻辑
    customRender: ({ text }) => {
  if (text === 1) {
    return '管理员';
  } else if (text === 2) {
    return '用户';
  } else {
    return '未知';
  }
},
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
const form = ref({
  username: "",
  password: "", 
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  gender: "Other",
  dateOfBirth: null,
  bio: "",
});
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
  roleid: [{ required: true, message: '请选择角色' }]
});
// fullName 用来存储姓名显示
const fullName = ref("");

// 无人机型号信息表格数据
const drones = ref([
  // 这里可以填充示例数据
  {
    droneID: '',
    model: "",
    manufacturer: "",
    productName: "",
    emptyWeight: '',
    maxTakeoffWeight: '',
    purpose: "",
  }
]);

const columns2 = [
  { title: "无人机型号", dataIndex: "model", key: "model", width: 100 },
  { title: "生产厂商", dataIndex: "manufacturer", key: "manufacturer" },
  { title: "产品名称", dataIndex: "productName", key: "productName" },
  { title: "空机重量 (kg)", dataIndex: "emptyWeight", key: "emptyWeight" ,width: 100},
  { title: "最大起飞重量 (kg)", dataIndex: "maxTakeoffWeight", key: "maxTakeoffWeight", width: 100 },
  { title: "用途", dataIndex: "purpose", key: "purpose" },
  {
    title: "操作",
    key: "action",
    align: "center",
    slots: { customRender: 'action' }
  }
];

const rules2 = {
  email: [{ required: true, message: "请输入邮箱" }],
  phoneNumber: [{ required: false, message: "请输入手机号" }],
  gender: [{ required: true, message: "请选择性别" }],
  dateOfBirth: [{ required: false, message: "请选择出生日期" }],
  bio: [{ required: false, message: "请输入个人简介" }],
};

const visible = ref(false);
const fetchUserDetails = async (username) => {
  try {
    // 获取用户表的信息
    const userResponse = await axios.post(`${httpUrl}/users/searchDetail`, { username });
    const user = userResponse.data;

    // 通过用户名获取用户ID
    const userIdResponse = await axios.get(`${httpUrl}/users/getUserid`, { params: { username } });
    const userId = userIdResponse.data;

    // 获取用户的详细信息
    const userProfileResponse = await axios.post(`${httpUrl}/userprofile/searchProfileByUserid`, userId);
    const userProfile = userProfileResponse.data;
    console.log(userProfile);

    // 获取用户拥有的无人机信息
    const dronesResponse = await axios.post(`${httpUrl}/drones/searchDronesByUserid`, userId);
    const dronesData = dronesResponse.data;
    
    let data=new Date(userProfile[0].dateofbirth);
  console.log(data);
  console.log(userProfile[0].dateofbirth);
    // 将信息存储到 form 和 drones 中
    
    form.value = {
  username: user[0].username,
  password: user[0].password, 
  firstName: userProfile[0].firstname || '',
  lastName: userProfile[0].lastname || '',
  email: user[0].email || '',
  phoneNumber: user[0].phonenumber || '',
  gender: userProfile[0].gender || 'Other',
  dateOfBirth: moment(userProfile[0].dateofbirth),
  bio: userProfile[0].bio || '',
};

    drones.value = dronesData.map(drone => ({
      droneID: drone.droneid,
      model: drone.model,
      manufacturer: drone.manufacturer,
      productName: drone.productname,
      emptyWeight: drone.emptyweight,
      maxTakeoffWeight: drone.maxtakeoffweight,
      purpose: drone.purpose,
    }));

    // 显示模态框
    showDrawer();
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    message.error("获取用户详情失败");
  }
};

const showDrawer = () => {
  visible.value = true;
};

const onClose = () => {
  visible.value = false;
};

const submitForm = () => {
  formRef.value
    .validate()
    .then(() => {
      console.log("form data:", form.value);
      onClose();
    })
    .catch((error) => {
      console.log("error:", error);
    });
};

// 修改无人机信息
const editDrone = (record) => {
  console.log("Edit drone:", record);
  // 在这里实现修改逻辑
};

// 删除无人机信息
const deleteDrone = (record) => {
  console.log("Delete drone:", record);
  // 在这里实现删除逻辑
};

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
        roleid: user.roleid || '未知', 
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

  axios.post(`${httpUrl}/users/listPageT`, {
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
    }).then(() => {
      // 查询刚保存用户的 userid
      return axios.get(`${httpUrl}/users/getUserid`, {
        params: {
          username: userForm.value.username
        }
      });
    }).then(response => {
      // 假设返回的数据包含 userid
      const userId = response.data.userid; // 从查询结果中获取 userid

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

function manageLogin(record, action) {
    console.log('登录管控:', record, action);
    let messageText;
    if (action === 'allow') {
      // 允许登录的逻辑
      messageText = `用户 ${record.username} 已被允许登录`;
    } else if (action === 'forbid') {
      // 禁止登录的逻辑
      messageText = `用户 ${record.username} 已被禁止登录`;
    }
    message.info(messageText);
    // 这里可以添加与后端的交互逻辑，将用户登录状态的更改提交到后端
  }

// function onSubmit() {
//   const formattedDateOfBirth = this.form.dateOfBirth
//     ? this.form.dateOfBirth.toISOString().slice(0, 10)
//     : null;
  
//   // 将处理后的数据提交给后端
//   const payload = {
//     ...this.form,
//     dateOfBirth: formattedDateOfBirth,
//   };

//   // 这里调用提交 API
// }


onMounted(() => {
  loadPost();
  console.log("组件挂载成功");
  console.log("当前数据:",data.value); // 打印当前数据

});
</script>
