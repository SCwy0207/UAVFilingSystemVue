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
              <router-link to="ACenter">管理员</router-link>
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
  export default {
    data() {
      return {
        username: '',
        password: '',
        email: '',
        dynamicCode: '',
        isEmailLogin: false
      };
    },
    methods: {
       login() {
              var username = document.getElementsByName("username")[0];
              var pass = document.getElementsByName("userpassword")[0];
              if (username.value == "") {
                  alert("请输入用户名");
              } else if(pass.value  == "") {
                  alert("请输入密码");
                  } else if(username.value == "admin" && pass.value == "666666"){
                      window.location.href="index.html";
                      } else {
                          alert("请输入正确的用户名和密码！")
                          }
          },
          register(){
            this.$router.push("/register");
          },
          toggleLogin(loginType) {
                      var accountLogin = document.getElementById("accountLogin");
                      var emailLogin = document.getElementById("emailLogin");
                      
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
                  }
    }
  };
  </script>
  
  <style>
  @import '../assets/css/LoginPage/LoginPage.css';
  </style>
  