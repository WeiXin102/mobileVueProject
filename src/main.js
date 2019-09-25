import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Router from 'vue-router'

//解决点击同个路由报错误提示
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI)

//全局导入echart
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

//导入axios
import api from './until/axios.js'
Vue.prototype.$http = api

import { Uploader, Toast, Dialog, Pagination, NavBar } from 'vant'
Vue.use(Uploader)
  .use(Toast)
  .use(Dialog)
  .use(Pagination)
  .use(NavBar)

import time from './assets/common/time'
Vue.filter('timeDate', time)

//postcss-pxtorem 配置自适应
import { pxtorem } from './assets/pxtorem/pxtorem'
pxtorem()

// rem配置
//window.screen.availWidth 返回当前屏幕宽度(空白空间) 
//window.screen.availHeight 返回当前屏幕高度(空白空间) 
//window.screen.width 返回当前屏幕宽度(分辨率值) 
//window.screen.height 返回当前屏幕高度(分辨率值) 
//window.document.body.offsetHeight; 返回当前网页高度 
//window.document.body.offsetWidth; 返回当前网页宽度
// 这个配置可以让 1rem == 100px 自动适应屏幕
// document.getElementsByTagName("html")[0].style.fontSize = 100 * window.screen.width / 750 + 'px';
// document.getElementsByTagName("html")[0].style.fontSize = 100 * window.screen.width / 414 + 'px';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
