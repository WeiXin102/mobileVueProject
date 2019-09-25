<template>
  <div>
    <div class="boardBoxBottomLeftEcharts"  ref="myEchart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import "../../../node_modules/echarts/map/js/china.js"; // 引入中国地图数据
export default {
  data() {
    return {
      chart: null,
      makeloanscnttop: [],
      overduem2allcnttop: [],
      overduem2allamounttop: [],
      amountrdpd30top: [],
      maxAadMin: {},
      timer: null,
      timeFlag: null,
      lastTime: '',
      titleItemData: {},
      sortField: 3,
      myEchart1: null,
      statisticaltype: '2019',
      resetTime: null
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http.post('/api/makeloansStatisticalService/queryMakeloansStatisticalList', { statisticaltype: this.statisticaltype, sortField: this.sortField }, { type: 'formData', headers: {} })
        .then((response) => {
          let { code, data } = response.data
          if (code === '200') {
            this.makeloanscnttopMap(data)
            this.overduem2allcnttopMap(data)
            this.overduem2allamounttopMap(data)
            this.amountrdpd30topMap(data)
          } else {
            this.$message.error(response.data.message);
          }
        })
        .catch(function (error) {
          console.log(error);
        });

    },
    chinaConfigure() {
      let myChart = echarts.init(this.$refs.myEchart); //这里是为了获得容器所在位置
      window.onresize = myChart.resize;
      myChart.setOption({
        // 进行相关配置
        tooltip: {}, // 鼠标移到图里面的浮动提示框
        geo: {
          // 这个是重点配置区
          map: "china", // 表示中国地图
          regions: this.overduem2allcnttop, // 设置单独的样式。
          itemStyle: {
            normal: {
              label: {
                show: true,
                textStyle: {
                  //标签的文本样式
                  fontSize: 18,
                  color: "#035CFF"
                }
              },
              areaColor: "#ffffff",
              borderColor: "#cdcdca", //边框颜色
              borderWidth: 0.5, //边框线宽
              areaStyle: {
              }
            }
          }
        },
        series: [
          {
            type: "scatter",
            coordinateSystem: "geo" // 对应上方配置
          },
          {
            name: "30+单量(单位:笔)", // 浮动框的标题
            type: "map",
            geoIndex: 0,
            data: this.overduem2allcnttop
          }
        ],
        dataRange: {
          orient: "vertical",
          itemWidth: 17, //图形的宽度，即长条的宽度。
          itemHeight: 121, //图形的高度，即长条的高度。
          text: ["高", "低"], // 文本，默认为数值文本
          realtime: false,
          calculable: true,
          left: "10s%",
          max: this.maxAadMin.overduem2allcnttopmax,
          min: parseFloat(this.maxAadMin.overduem2allcnttopmin),
          inRange: {
            color: ["#ffffcb", "#fb8520"]
          },
          textStyle: { color: "white", fontSize: "12px" } //文本样式
        }
      });
    },
    //map放款量
    makeloanscnttopMap(data) {
      this.makeloanscnttop = [];
      this.EchartClassifyChangeData(data, 'makeloanscnttop')
      //获取最大值
      this.findMax(data.maptotal, 'makeloanscnttop')
      //获取最小值
      this.findMin(data.maptotal, 'makeloanscnttop')
    },
    //map30+单量
    overduem2allcnttopMap(data) {
      this.overduem2allcnttop = [];
      this.EchartClassifyChangeData(data, 'overduem2allcnttop')
      //获取最大值
      this.findMax(data.maptotal, 'overduem2allcnttop')
      //获取最小值
      this.findMin(data.maptotal, 'overduem2allcnttop')
    },
    //map30+金额
    overduem2allamounttopMap(data) {
      this.overduem2allamounttop = [];
      this.EchartClassifyChangeData(data, 'overduem2allamounttop')
      //获取最大值
      this.findMax(data.maptotal, 'overduem2allamounttop')
      //获取最小值
      this.findMin(data.maptotal, 'overduem2allamounttop')
    },
    //map rdpd30
    amountrdpd30topMap(data) {
      this.amountrdpd30top = [];
      //重组数据(Echart 对地区名重编辑)
      this.EchartClassifyChangeData(data, 'amountrdpd30top')
      //获取最大值
      this.findMax(data.maptotal, 'amountrdpd30top')
      //获取最小值
      this.findMin(data.maptotal, 'amountrdpd30top')
    },
    /**
    * EchartClassifyChangeData
    * 根据地区重组数据
    * data:数据
    * EchartClassifyName:Echat所需数据分类名
    */
    EchartClassifyChangeData(data, EchartClassifyName) {
      if (EchartClassifyName === 'overduem2allamounttop') {
        data.maptotal.forEach(el => {
          if (el.dealerprovincename == "黑龙") {
            this[EchartClassifyName].push({
              name: '黑龙江',
              value: (Math.round(parseFloat(el[EchartClassifyName] / 10000) * 100) / 100),
              itemStyle: { normal: { areaColor: "#ffffff", label: { show: false } } }
            })
          } else if (el.dealerprovincename == "内蒙") {
            this[EchartClassifyName].push({
              name: '内蒙古',
              value: (Math.round(parseFloat(el[EchartClassifyName] / 10000) * 100) / 100),
              itemStyle: { normal: { areaColor: "#ffffff", label: { show: false } } }
            })
          } else {
            this[EchartClassifyName].push({
              name: el.dealerprovincename,
              value: (Math.round(parseFloat(el[EchartClassifyName] / 10000) * 100) / 100),
              itemStyle: { normal: { areaColor: "#ffffff", label: { show: false } } }
            })
          }
        });
        this[EchartClassifyName].push({
          name: "南海诸岛",
          value: null,
          itemStyle: { normal: { opacity: 0, label: { show: false } } }
        }, {
          name: "台湾",
          value: null,
          itemStyle: { normal: { areaColor: "#ffffff", label: { show: false } } }
        }, {
          name: "香港",
          value: null,
          itemStyle: { normal: { areaColor: "#ffffff", label: { show: false } } }
        }, {
          name: "澳门",
          value: null,
          itemStyle: { normal: { areaColor: "#ffffff", label: { show: false } } }
        })
      } else {
        data.maptotal.forEach(el => {
          if (el.dealerprovincename == "黑龙") {
            this[EchartClassifyName].push({
              name: '黑龙江',
              value: el[EchartClassifyName],
              itemStyle: { normal: { areaColor: "#ffffff", label: { show: false } } }
            })
          } else if (el.dealerprovincename == "内蒙") {
            this[EchartClassifyName].push({
              name: '内蒙古',
              value: el[EchartClassifyName],
              itemStyle: { normal: { areaColor: "#ffffff", label: { show: false } } }
            })
          } else {
            this[EchartClassifyName].push({
              name: el.dealerprovincename,
              value: el[EchartClassifyName],
              itemStyle: { normal: { areaColor: "#ffffff", label: { show: false } } }
            })
          }
        });
        this[EchartClassifyName].push({
          name: "南海诸岛",
          value: null,
          itemStyle: { normal: { opacity: 0, label: { show: false } } }
        }, {
          name: "台湾",
          value: null,
          itemStyle: { normal: { areaColor: "#ffffff", label: { show: false } } }
        }, {
          name: "香港",
          value: null,
          itemStyle: { normal: { areaColor: "#ffffff", label: { show: false } } }
        }, {
          name: "澳门",
          value: null,
          itemStyle: { normal: { areaColor: "#ffffff", label: { show: false } } }
        })
      }
    },
    findMax(data, name) {//查找最大值（map地图使用） 
      if (name === 'overduem2allamounttop') {
        let arr = JSON.parse(JSON.stringify(data))
        let res = arr.sort(function (a, b) {
          return b[name] - a[name]
        })
        this.maxAadMin[name + 'max'] = parseFloat(res[0][name] / 10000).toFixed(3).slice(0, -1)
      } else {
        let arr = JSON.parse(JSON.stringify(data))
        let res = arr.sort(function (a, b) {
          return b[name] - a[name]
        })
        this.maxAadMin[name + 'max'] = parseFloat(res[0][name])
      }
    },
    findMin(data, name) {
      let arr = JSON.parse(JSON.stringify(data))
      let res = arr.sort(function (a, b) {
        return a[name] - b[name]
      })
      this.maxAadMin[name + 'min'] = res[0][name]
    },
  },
  watch: {
    makeloanscnttop: function () {
      this.chinaConfigure()
    }
  }
}
</script>

<style lang='scss' scoped>
.boardBoxBottomLeftEcharts {
  height: 347px;
  width: 606px;
}
</style>