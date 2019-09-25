<template>
  <div class="box">
    <div class="addimg">
      <span>点击上传</span>
      <input type="file" @change="updata($event)" />
      <img id="viewphoto" src alt />
    </div>
  </div>
</template>

<script>
import { mySelectImage} from "../assets/common/common";
export default {
  data() {
    return {};
  },
  methods: {
    updata(e) {
      mySelectImage(e.target.files[0]);
    }
  }
};
</script>
<style lang='scss' scoped>
.box {  
  .addimg {
     background-image: url("../../public/img/kk.png");
    background-size: 100% 100%;
    width: 100%;
    height: 300px;
    // background-color: pink;
    position: relative;
    text-align: center;
    line-height: 300px;
    input {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      opacity: 0;
      background-color: yellow;
      width: 100%;
      height: 100%;
      z-index: 99;
    }
    span {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }
  #viewphoto {
    width: 100%;
    height: 100%;
  }
}
</style>