/**
 * import api from './api/index.js'
 * Vue.prototype.$http = api
 * ----------------------
 * 组件中使用方法(以post为例):
 * 示例：this.$http.post(url, data, option).then((res)=>{})
 * 使用注意：
 *  - 传参格式：
 *    - url: '/user/userLogin'
 *    - data: object | null
 *    - option: {type: json|formData|multipart, headers: {}}
 *  - url地址对象建议使用单独的js文件管理
 */


// import Vue from 'vue'
//移动端用vant
import { Toast } from 'vant'
//pc端用elementui
// import { Loading } from 'element-ui';
// import { Message } from 'element-ui';

// 引用axios
import axios from 'axios'
//设置了widthCredentials为true的请求中会包含远程域的所有cookie
axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.VUE_APP_BASEURL

//设置响应延迟时间
axios.defaults.timeout = 3000

const pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const removePending = (config) => {
  for (const p in pending) {
    if (pending[p].u === `${config.url}&${config.method}`) { // 当当前请求在数组中存在时执行函数体
      pending[p].f() // 执行取消操作
      pending.splice(p, 1) // 把这条记录从数组中移除
    }
  }
}

const whiteList = []
// 请求拦截
axios.interceptors.request.use((config) => {
  // 设置白名单不拦截
  for (const i of whiteList) {
    if (config.url.indexOf(i) !== -1) {
      return config
    }
  }
  removePending(config) // 在一个ajax发送前执行一下取消操作
  config.cancelToken = new axios.CancelToken((c) => { //请求是pending状态，那么可以直接取消掉 ，`cancelToken`指定可用于取消请求的取消令牌
    // 添加ajax标识
    pending.push({
      u: `${config.url}&${config.method}`,
      f: c//c 用来取消还在padding状态的请求
    })
  })
  // 使用了loading组件 pc端使用 elementui
  // if (Loading) {
  //   config.loading = function () {
  //     let loadingInstance = Loading.service({ fullscreen: true });
  //     setTimeout(() => {
  //       loadingInstance.close();
  //     }, 1000);
  //   }()
  // }
  //移动端使用vant
  if (Toast) {
    config.loading = Toast.loading({
      duration: 3000,       // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      loadingType: 'spinner',
      message: '倒计时 3 秒'
    })
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 回调拦截
axios.interceptors.response.use((res) => {
  res.config.loading
  return res
}, (err) => {
  if (err && err.response) {
    err.response.config.loading
    switch (err.response.status) {
      case 400:
        err.message = '错误请求'
        break
      case 401:
        err.message = '未授权，请重新登录'
        break
      case 403:
        err.message = '没有权限，拒绝访问'
        break
      case 404:
        err.message = '请求错误,未找到该资源'
        break
      case 405:
        err.message = '请求方法未允许'
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器端出错'
        break
      case 501:
        err.message = '网络未实现'
        break
      case 502:
        err.message = '网络错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网络超时'
        break
      case 505:
        err.message = 'http版本不支持该请求'
        break
      default:
        err.message = `连接错误${err.response.status}`
    }
  }
  // 错误处理
  if (err.message) {
    //pc端使用elementui Message
    // Message({
    //   showClose: true,
    //   message: err.message,
    //   type: 'error'
    // });
    //移动端使用vant Toast
    Toast.fail(err.message);
    if (err.response.status === 401) {
      // window.$router.push('/login')
      console.log('401')
    }
  }
  return Promise.reject(err)
})

// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数，移除前后空格
function filterNull(o) {
  for (const key in o) {
    if (o[key] === null) { delete o[key] }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])//递归调用 作用是
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

function apiAxios(method, url, params, option) {
  if (!option) option = {}
  // 根据URL地址对象确定使用什么方式请求
  if (option.type === 'json') {
    if (params) {
      params = filterNull(params)
    }
  } else if (option.type === 'formData') {
    const _params = new URLSearchParams()
    if (params) {
      params = filterNull(params)
      // JSON 转换为 FormData
      Object.keys(params).forEach(key => _params.append(key, params[key]))
      params = _params
    }
  }
  // 封装headers
  const CONTENT_TYPE = {
    json: 'application/json; charset=UTF-8',
    formData: 'application/x-www-form-urlencoded; charset=UTF-8',
    multipart: 'multipart/form-data; charset=UTF-8'
  }
  const headers = {
    'Content-Type': CONTENT_TYPE[option.type]
  }
  if (option.headers) Object.assign(headers, option.headers)
  console.log('method', method, 'url', url, 'headers', headers, "params", params)
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      // headers: headers,
      data: method === 'POST' || method === 'PUT' ? params : null,
      dataType: 'json',
      params: method === 'GET' || method === 'DELETE' ? params : null,
      withCredentials: true
    }).then((res) => {
      const flag = true
      if (flag) {
        resolve(res.data)
      } else {
        reject(res.data)
      }
    }).catch((err) => {
      throw new Error(err)
    })
  })
}

// 返回在vue模板中的调用接口
export default {
  get(url, params, option) {
    return apiAxios('GET', url, params, option)
  },
  post(url, params, option) {
    return apiAxios('POST', url, params, option)
  },
  put(url, params, option) {
    return apiAxios('PUT', url, params, option)
  },
  delete(url, params, option) {
    return apiAxios('DELETE', url, params, option)
  }
}
