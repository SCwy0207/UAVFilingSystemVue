<template>
  <div id="LoginPage">
    <img class="head_Logo" alt="wzEngage" src="../assets/img/loginPage/wzNebula.png" />
    <div class="container">
      <div class="imgcontainer">
        <img alt="wzEngageLogo" src="../assets/img/loginPage/half_wzxyLogo.png" />
      </div>
      <h1>用户登录</h1>
      <div class="changeLogin">
        <span :class="['accountLogin', isEmailLogin ? '' : 'active']" @click="toggleLogin('account')">账号密码登录</span>
        <span :class="['emailLogin', isEmailLogin ? 'active' : '']" @click="toggleLogin('email')">邮箱动态码登录</span>
      </div>
      <div class="changeBox">
        <div v-show="!isEmailLogin">
          <!-- 账号密码登录界面 -->
          <form @submit.prevent="login">
            <label for="uname"><b>&nbsp;用户名</b></label>
            <input type="text" placeholder="请输入用户名" v-model="username" required/><br/>
            <label for="psw"><b>&nbsp;密码</b></label>
            <input type="password" placeholder="请输入密码" v-model="password" required/><br/>
            <a href="javascript:void(0);" style="text-decoration:none;" @click="register">&nbsp;立即注册</a><br /><br /><br/>
            <button type="submit">登录</button>
          </form>
        </div>
        <div v-show="isEmailLogin">
          <!-- 邮箱动态码登录界面 -->
          <form @submit.prevent="login">
            <label for="email"><b>邮箱</b></label>
            <input type="text" placeholder="请输入邮箱" v-model="email" required/><br/>
            <label for="code"><b>动态码</b></label>
            <div class="sendCodeContainer">
              <input type="text" placeholder="请输入动态码" v-model="dynamicCode" required/>
              <button class="sendCode" type="button" @click="sendDynamicCode">发送动态码</button>
            </div>
            <a href="javascript:void(0);">立即注册</a><br /><br /><br />
            <button type="submit">登录</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance} from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';  // 确保安装了 axios 库

const router = useRouter();
const username = ref('');
const password = ref('');
const email = ref('');
const roleid=ref('')
const dynamicCode = ref('');
const isEmailLogin = ref(false);
const { proxy } = getCurrentInstance();
const httpUrl = proxy.$httpUrl;

const login = async () => {
  try {
    let response;
    if (isEmailLogin.value) {
      if (!email.value) {
        alert("请输入邮箱");
        return;
      }
      if (!dynamicCode.value) {
        alert("请输入动态码");
        return;
      }
      // 发送邮箱动态码登录请求（根据后端接口的实现进行调整）
      response = await axios.post('/auth/login', {
        email: email.value,
        dynamicCode: dynamicCode.value
      });
    } else {
      if (!username.value) {
        alert("请输入用户名");
        return;
      }
      if (!password.value) {
        alert("请输入密码");
        return;
      }
      // 发送用户名密码登录请求
      response = await axios.post(`${httpUrl}/login`, {
        username: username.value,
        password: password.value
      });
    }
    // 处理登录成功的逻辑
    const token = response.data.token;  // 获取返回的 token
    localStorage.setItem('username',username.value);
    localStorage.setItem('token', token);  // 保存 token
    localStorage.setItem('roleId',roleid);
    router.push('/ACenter');  // 登录成功后跳转到首页或其他页面
  } catch (error) {
    console.error(error);
    alert("登录失败，请检查用户名、密码或动态码。");
  }
};

const register = () => {
  router.push("/register");
};

const toggleLogin = (loginType) => {
  isEmailLogin.value = (loginType === 'email');
};

const sendDynamicCode = async () => {
  if (!email.value) {
    alert("请输入邮箱");
    return;
  }
  try {
    await axios.post('/auth/sendDynamicCode', { email: email.value });
    alert("动态码已发送到您的邮箱！");
  } catch (error) {
    console.error(error);
    alert("发送动态码失败，请稍后重试。");
  }
};
</script>


<style>
@import '../assets/css/LoginPage/LoginPage.css';
</style>
