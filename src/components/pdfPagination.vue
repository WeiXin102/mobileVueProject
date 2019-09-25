<template>
  <div>
    <van-nav-bar
      title="pdf组件(带下上按键)"
      left-text="返回"      
      left-arrow
      @click-left="$router.go(-1)"     
    />
    <canvas id="the-canvas"></canvas>
    <van-pagination v-model="currentPage" :page-count="pages" mode="simple" @change="changeNum" />
  </div>
</template>

<script>
import PDFJS from 'pdfjs-dist';
export default {
  data() {
    return {
      pages: [],
      currentPage: 1,
      pdfDoc: null,
      pages: null,
      src: this.pdfsrc || this.$route.params.pdfSrc
    };
  },
  props: {
    pdfsrc: String
  },
  methods: {
    _renderPage(num) {
      this.pdfDoc.getPage(num).then(page => {
        let canvas = document.getElementById("the-canvas");
        let ctx = canvas.getContext("2d");
        let dpr = window.devicePixelRatio || 1;
        let bsr =
          ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio ||
          1;
        let ratio = dpr / bsr;
        let viewport = page.getViewport(
          screen.availWidth / page.getViewport(1).width
        );
        canvas.width = viewport.width * ratio;
        canvas.height = viewport.height * ratio;
        canvas.style.width = viewport.width + "px";
        canvas.style.height = viewport.height + "px";
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        let renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        page.render(renderContext);
      });
    },
    loadFile(url) {
      PDFJS.getDocument(url).then(pdf => {
        this.pdfDoc = pdf;
        this.pages = this.pdfDoc.numPages;
        this.$nextTick(() => {
          this._renderPage(this.currentPage);
        });
      });
    },
    changeNum() {
      this.loadFile(this.src)
    }
  },
  created() {
    this.loadFile(this.src)
  }
};
</script>


<style lang="less" scoped>
</style>