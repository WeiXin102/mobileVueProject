<template>
  <div>
    <div class="shade" v-if="show"></div>
    <div class="dialog" v-if="show">
      <div class="dialog_content">
        <div class="dialog_phone">预留手机号码：{{phone|formatter}}</div>
        <div class="note_box">
          <input type="text" placeholder=" 请输入验证码" v-model="chellengeCode" />
          <button @click="note(gainCb,chellengeCode)" :class="{gray:isGray}">{{content}}</button>
        </div>
      </div>
      <div class="dialog_flag">
        <span @click="cancel">取消</span>
        <span class="bottom_color" @click="affirm(submitCb)">确认</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isGray: false,
      chellengeCode: "",
      content: "获取验证码",
      setInterval: null,
      isShadeShow: null,
      isDialog: null,
      show: null
    };
  },
  props: {
    _show: Boolean,
    phone: String,
    submitCb: Function,
    gainCb: Function
  },
  methods: {
    //滚动事件
    bodyScroll(event) {
      event.preventDefault();
    },
    isShow() {
      if (this.isProhibit) return;
      this.show = true;
      //禁止页面滚动
      document.body.addEventListener("touchmove", this.bodyScroll, {
        passive: false
      });
      document.getElementsByTagName("body")[0].style.position = "fixed";
      document.getElementsByTagName("body")[0].style.width = "100%";
    },
    cancel() {
      clearInterval(this.setInterval);
      this.content = "获取验证码";
      this.show = false;
      this.isGray = false;
      //恢复页面滚动
      document.body.removeEventListener("touchmove", this.bodyScroll, {
        passive: false
      });
      document.getElementsByTagName("body")[0].style.position = "initial";
      this.clearIntervalHand();
    },
    affirm(submitCb) {
      //判断输入框不能为空
      if (this.chellengeCode === "") {
        return alert("输入的内容不能为空");
      }
      this.show = false;
      //恢复页面滚动
      document.body.removeEventListener("touchmove", this.bodyScroll, {
        passive: false
      });
      document.getElementsByTagName("body")[0].style.position = "initial";
      //回调函数
      submitCb();
      this.chellengeCode = "";
      this.clearIntervalHand();
    },
    note(gainCb,chellengeCode) {
      this.chellengeCode = ""
      if (this.content != "获取验证码") return;
      const _this = this;
      let timer = 60;
      this.content = `(${timer}S)`;
      this.isGray = true;
      this.setInterval = setInterval(() => {
        timer--;
        this.content = `(${timer}S)`;
        if (timer == 0) {
          _this.clearIntervalHand();
        }
      }, 1000);
      gainCb(chellengeCode);
    },
    clearIntervalHand() {
      this.content = "获取验证码";
      this.isGray = false;
      clearInterval(this.setInterval);
    }
  },
  filters: {
    // 截取前三后四， 中间四位 ** ** 号代替
    formatter: function(value, row, index) {
      if (value.length < 11) {
        return "";
      }
      var len = value.length;
      var xx = value.substring(3, len - 4);
      var values = value.replace(xx, "****");
      return values;
    }
  },
  watch: {
    show: function(value) {
      this.$emit("update:_show", value);
    },
    _show: function(value) {
      this.show = value;
    }
  }
};
</script>
<style lang='scss' scoped>
.dialog {
  position: absolute;
  left: 50%;
  top: 50%; /*偏移*/
  transform: translate(-50%, -50%);
  background-color: red;
  width: 550px;
  height: 370px;
  background: rgba(255, 255, 255, 1);
  border-radius: 26px;
  overflow: hidden;
  z-index: 1000;

  .dialog_content {
    box-sizing: border-box;
    padding-left: 60px;
    padding-top: 87px;
    .dialog_phone {
      text-align: left;
      font-size: 30px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
    .note_box {
      margin-top: 34px;
      display: flex;
      input {
        width: 240px;
        height: 60px;
        border: 2px solid rgba(221, 221, 221, 1);
        border-radius: 3px;
        font-size: 30px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
      }
      button {
        margin-left: 20px;
        @include button;
        width: 170px;
        height: 60px;
        font-size: 30px;
        color: #fff;
        border-radius: 3px;
        line-height: 60px;
      }
      .gray {
        background: #dddddd;
      }
    }
  }
  .dialog_flag {
    position: absolute;
    bottom: 0;
    display: flex;
    span {
      width: 274px;
      height: 98px;
      display: inline-block;
      text-align: center;
      line-height: 98px;
      border-top: 1px solid #dddddd;
      border-right: 1px solid #dddddd;
      background-color: #fff;
      font-size: 34px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
    .bottom_color {
      color: rgba(8, 141, 252, 1);
    }
  }
}
.shade {
  // width: 100%;
  // height: 100%;
  background: rgba(0, 0, 0, 1);
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
</style>