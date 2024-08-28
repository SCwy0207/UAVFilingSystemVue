<template>
  <div id="LoginPage">
    <img class="head_Logo" alt="wzEngage" src="../assets/img/loginPage/wzNebula.png" />
    <div class="container">
      <div class="imgcontainer">
        <img alt="wzEngageLogo" src="../assets/img/loginPage/half_wzxyLogo.png" />
      </div>
      <h1>用户登录</h1>
      <div class="changeLogin">
        <span id="accountLogin" class="accountLogin active" @click="toggleLogin('account')">账号密码登录</span>
        <span id="emailLogin" class="emailLogin" @click="toggleLogin('email')">邮箱动态码登录</span>
      </div>
      <div class="changeBox">
        <div id="accountLoginS">
          <!-- 账号密码登录界面 -->
          <form @submit.prevent="login">
            <label for="uname"><b>用户名</b></label>
            <input type="text" placeholder="请输入用户名" v-model="username" required/><br/>
            <label for="psw"><b>密码</b></label>
            <input type="password" placeholder="请输入密码" v-model="password" required/><br/>
            <a href="javascript:void(0);" @click="register">立即注册</a><br /><br /><br/>
            <button type="submit">登录</button>
          </form>
        </div>
        <div id="emailLoginS" v-show="isEmailLogin">
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

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const email = ref('');
    const dynamicCode = ref('');
    const isEmailLogin = ref(false);

    const login = () => {
      if (username.value === "") {
        alert("请输入用户名");
      } else if (password.value === "") {
        alert("请输入密码");
      } else if (username.value === "admin" && password.value === "666666") {
        router.push('/ACenter'); // 使用 Vue Router 进行页面跳转
      } else {
        alert("请输入正确的用户名和密码！");
      }
    };

    const register = () => {
      router.push("/register");
    };

    const toggleLogin = (loginType) => {
      const accountLogin = document.getElementById("accountLogin");
      const emailLogin = document.getElementById("emailLogin");

      if (loginType === 'account') {
        accountLogin.classList.add('active');
        emailLogin.classList.remove('active');
        // 切换到账号密码登录界面
        document.getElementById("accountLoginS").style.display = "block";
        document.getElementById("emailLoginS").style.display = "none";
      } else if (loginType === 'email') {
        accountLogin.classList.remove('active');
        emailLogin.classList.add('active');
        // 切换到邮箱动态码登录界面
        document.getElementById("accountLoginS").style.display = "none";
        document.getElementById("emailLoginS").style.display = "block";
      }
    };

    return {
      username,
      password,
      email,
      dynamicCode,
      isEmailLogin,
      login,
      register,
      toggleLogin,
    };
  }
};
</script>

<style>
@import '../assets/css/LoginPage/LoginPage.css';
</style>
