<template>
  <div id="RegisterPage">
    <img class="imgOne" src="../assets/img/registerPage/RhalfLogo.png" />
    <a-card class="container">
      <h2 style="text-align: center;">用户注册</h2>
      <a-form @submit.prevent="register" layout="vertical">
        <!-- 用户表 -->
        <a-form-item label="电子邮件地址" required>
          <a-input
          v-model:value="email"
            type="email"
            placeholder="请输入电子邮件地址"
            style="width: 60%; margin-right: 2%;"
          />
          <a-input
          v-model:value="SMS"
            placeholder="验证码"
            style="width: 15%; margin-right: 2%;"
          />
          <a-button @click="sendSMSCode" style="width: 20%;">
            发送验证码
          </a-button>
        </a-form-item>

        <a-form-item label="用户名">
          <a-input v-model:value="username" placeholder="请输入用户名" />
        </a-form-item>

        <a-form-item label="密码" required>
          <a-input-password v-model:value="password" placeholder="请输入密码" />
        </a-form-item>

        <a-form-item label="确认密码" required>
          <a-input-password
          v-model:value="confirmPassword"
            placeholder="请再次输入密码"
          />
        </a-form-item>

        <!-- 用户信息表 -->
        <a-form-item label="性别">
          <a-select v-model:value="gender" placeholder="请选择性别">
            <a-select-option value="Male">男</a-select-option>
            <a-select-option value="Female">女</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="出生日期">
          <a-date-picker v-model:value="dob" style="width: 100%;" />
        </a-form-item>

        <a-form-item label="个人简介">
          <a-textarea
          v-model:value="bio"
            rows="4"
            placeholder="请输入个人简介"
            style="resize: none;"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit">
            注册
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <img class="imgTwo" src="../assets/img/registerPage/LhalfLogo.png" />
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router'; 
import axios from 'axios'; 


export default {
  setup() {
    const email = ref("");
    const SMS = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const username = ref("");
    const gender = ref("other");
    const dob = ref("");
    const bio = ref("");

    const { proxy } = getCurrentInstance();
    const $httpUrl = proxy.$httpUrl;

    const router = useRouter();

    const sendSMSCode = () => {
      proxy.$message.success(`验证码已发送到 ${email.value}`);
    };

    const register = async () => {
  if (password.value !== confirmPassword.value) {
    proxy.$message.error("密码与确认密码不匹配");
    return;
  }

  try {
    const userRegistrationResponse = await axios.post(
      `${$httpUrl}/register/userSave`,
      {
        user: {
          email: email.value,
          username: username.value,
          password: password.value,
        },
        userprofile: {
          gender: gender.value,
          dateofbirth: dob.value,
          bio: bio.value,
        }
      }
    );

    if (userRegistrationResponse.data.code === 200) {
      proxy.$message.success("注册成功！");
      router.push("/login");
    } else {
      proxy.$message.error("用户名注册冲突！");
    }
  } catch (error) {
    if (error.response && error.response.data.code === 409) {
      proxy.$message.error("该邮箱或用户名已被注册");
    } else {
      proxy.$message.error("注册失败，请重试");
    }
  }
};


    return {
      email,
      SMS,
      password,
      confirmPassword,
      username,
      gender,
      dob,
      bio,
      sendSMSCode,
      register,
    };
  },
};

</script>


<style scoped>
#RegisterPage {
  background-color: #f4f4f4;
  height: 100vh;
  width: 100vw; /* 确保页面宽度为视口宽度 */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 隐藏超出部分 */
  position: relative; /* 使子元素的绝对定位生效 */
}
#RegisterPage .container {
  width: 100%;
  height: 100vh;
  max-width: 600px;
  padding: 20px;
}
#RegisterPage .imgOne{
  width: 30%;
  height: auto;
  position:absolute;
  margin-top:-50%;
  left: 0;
  opacity: 0.3; /* 透明度 */
}
#RegisterPage .imgTwo{
  width: 20%;
  height: auto;
  position:absolute;
  margin-top:50%;
  right: 0;
  transform: translateX(18%);
  opacity: 0.3; /* 透明度 */
}
</style>
