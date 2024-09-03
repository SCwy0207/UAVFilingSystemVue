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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const email = ref('');
const dynamicCode = ref('');
const isEmailLogin = ref(false);

const login = () => {
  if (isEmailLogin.value) {
    if (!email.value) {
      alert("请输入邮箱");
      return;
    }
    if (!dynamicCode.value) {
      alert("请输入动态码");
      return;
    }
    // 在这里添加邮箱动态码的验证逻辑
  } else {
    if (!username.value) {
      alert("请输入用户名");
      return;
    }
    if (!password.value) {
      alert("请输入密码");
      return;
    }
    // 在这里添加账号密码的验证逻辑
  }
};

const register = () => {
  router.push("/register");
};

const toggleLogin = (loginType) => {
  isEmailLogin.value = (loginType === 'email');
};

const sendDynamicCode = () => {
  // 发送动态码的逻辑
  alert("动态码已发送到您的邮箱！");
};
</script>

<style>
@import '../assets/css/LoginPage/LoginPage.css';
</style>
