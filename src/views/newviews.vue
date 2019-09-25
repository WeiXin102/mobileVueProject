<template>
  <div>
    <div class="content">
      <div class="item">采用postcss-pxtorem自适应(默认750设计图)</div>
      <div class="item">VUE_APP_BASEURL={{baseurl}}</div>
      <div class="item" @click="axiosShow=true">封装axios使用方法</div>
      <div class="item" @click="$router.push({ name: 'pdf', params: { pdfSrc }})">pdf组件</div>
      <div class="item" @click="$router.push({ name: 'pdfPagination', params: { pdfSrc }})">pdf组件(带下上按键)</div>
      <div class="item" @click="show=true">短信弹窗</div>
      <div class="item" @click="updataFileShow=true">自定义上传文件框</div>
      <div class="item" @click="$router.push({ name: 'echart'})">Echart-map(中国地图)</div>
      <!-- 组件区域 -->
      <!-- 短信弹出框 -->
      <phoneDialog :_show.sync="show" :phone="phone" :submitCb="callback" :gainCb="gain" />
      <van-dialog
        v-model="updataFileShow"
        title="自定义上传图片演示窗口"
        show-cancel-button
        closeOnClickOverlay
      >
        <updataFile></updataFile>
      </van-dialog>
      <van-dialog
        v-model="axiosShow"
        title="封装axios使用方法"
        show-cancel-button
        closeOnClickOverlay
      >
      <div>组件中使用方法(以post为例):</div>
      <div>* 示例：this.$http.post(url, data, option).then((res)=>{})</div>
      <div>* 使用注意：</div>
      <div> *  - 传参格式：</div>
      <div>*  - url: '/user/userLogin'</div>
      <div>*  - data: object | null</div>
      <div>*  - option: {type: json|formData|multipart, headers: {}}</div>
      <div>*  - url地址对象建议使用单独的js文件管理</div>
      </van-dialog>
    </div>
  </div>
</template>

<script>
import phoneDialog from '@/components/phoneDialog.vue'
import pdf from '@/components/pdf.vue'
import pdfPagination from '@/components/pdfPagination.vue'
import updataFile from '@/components/updataFile.vue'
export default {
  data() {
    return {
      baseurl: process.env.VUE_APP_BASEURL,
      show: false,
      phone: "13145205201",
      pdfSrc: '../../public/JavaScript高级程序设计（第3版）非扫描版.pdf',
      updataFileShow: false,
      axiosShow:false
    }
  },
  components: {
    phoneDialog,
    pdf,
    updataFile,
    pdfPagination
  },
  methods: {
    callback() {
      //点击提交按钮的回调函数
      alert("发送成功！");
    },
    gain(value) {
      //点击验证按钮的回调函数  参数1：value  输入的验证码验证码
      alert('这是验证码回调value：' + value);
    },
  },
  mounted() {
  }
}
</script>

<style lang='scss' scoped>
.content {
  overflow: auto;
  .item {
    margin: 20px auto;
    width: 690px;
    height: 110px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 21px 0px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 31px;
    text-align: center;
    line-height: 110px;
  }
}
</style>