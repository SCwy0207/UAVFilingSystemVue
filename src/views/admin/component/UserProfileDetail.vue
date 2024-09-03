<template>
   <div>
     <a @click="showDrawer">
       <a-icon type="plus" /> 详情</a>
     <a-drawer
       title="用户信息详情"
       :width="720"
       :visible="visible"
       :body-style="{ paddingBottom: '100px' }"
       @close="onClose"
     >
       <a-form
         :model="form"
         layout="vertical"
         :rules="rules"
         ref="formRef"
         hide-required-mark
       >
         <!-- 用户头像和用户名 -->
         <a-row :gutter="16" style="margin-bottom: 20px;">
           <a-col :span="24">
             <a-avatar :size="64" icon="user" style="margin-right: 16px" />
             <a-form-item label="用户名" name="username">
               <a-input v-model:value="form.username" placeholder="用户名" disabled />
               <a-input v-model:value="form.password" style="margin-top: 2%;" placeholder="请输入密码" />
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
         <a-table :columns="columns" :data-source="drones" row-key="droneID">
           <template #action="{ record }">
             <span>
               <a @click="editDrone(record)" type="link">修改</a>
               <a @click="deleteDrone(record)" type="link" style="color: red;">删除</a>
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
</template>
<script setup>
import { ref } from "vue";

const formRef = ref(null);
const form = ref({
  username: "", // 新增用户名字段
  password: "", // 新增密码字段
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  gender: "Other",
  dateOfBirth: null,
  bio: "",
});

// fullName 用来存储姓名显示
const fullName = ref("");

// 无人机型号信息表格数据
const drones = ref([
  // 这里可以填充示例数据
  {
    droneID: 1,
    model: "DJI Mavic 2 Pro",
    manufacturer: "DJI",
    productName: "Mavic 2 Pro",
    emptyWeight: 907.0,
    maxTakeoffWeight: 907.0,
    purpose: "摄影",
  },
  {
    droneID: 2,
    model: "Phantom 4 Pro",
    manufacturer: "DJI",
    productName: "Phantom 4 Pro",
    emptyWeight: 1380.0,
    maxTakeoffWeight: 1380.0,
    purpose: "摄影",
  }
]);

const columns = [
  { title: "无人机型号", dataIndex: "model", key: "model" },
  { title: "生产厂商", dataIndex: "manufacturer", key: "manufacturer" },
  { title: "产品名称", dataIndex: "productName", key: "productName" },
  { title: "空机重量 (kg)", dataIndex: "emptyWeight", key: "emptyWeight" },
  { title: "最大起飞重量 (kg)", dataIndex: "maxTakeoffWeight", key: "maxTakeoffWeight" },
  { title: "用途", dataIndex: "purpose", key: "purpose" },
  {
    title: "操作",
    key: "action",
    align: "center",
    scopedSlots: { customRender: 'action' }
  }
];

const rules = {
  email: [{ required: true, message: "请输入邮箱" }],
  phoneNumber: [{ required: false, message: "请输入手机号" }],
  gender: [{ required: true, message: "请选择性别" }],
  dateOfBirth: [{ required: false, message: "请选择出生日期" }],
  bio: [{ required: false, message: "请输入个人简介" }],
};

const visible = ref(false);

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
</script>

