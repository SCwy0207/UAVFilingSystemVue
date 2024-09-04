import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/global.css'
import * as Icons from '@ant-design/icons-vue';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import axios from 'axios'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';


// 创建应用实例
const app = createApp(App);

// 全局挂载 axios
app.config.globalProperties.$axios = axios;

//设置全局变量HttpURL
app.config.globalProperties.$httpUrl = 'http://localhost:8088';

// 使用 Ant Design Vue 插件
app.use(Antd);

//使用elementPlus
app.use(ElementPlus);

// 使用路由
app.use(router);

Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key]);
  });

// 挂载应用
app.mount('#app');

