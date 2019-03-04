<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      clientHeight: "600px",
      mainHeight:"872px",
      tableHeight:"732px"
    };
  },
  mounted() {
    this.init();
    // 动态设置背景图的高度为浏览器可视区域高度

    // 首先在Virtual DOM渲染数据时，设置下背景图的高度．
    this.clientHeight = `${document.documentElement.clientHeight}px`;
    // 然后监听window的resize事件．在浏览器窗口变化时再设置下背景图高度．
    const that = this;
    window.onresize = function temp() {
      that.clientHeight = `${document.documentElement.clientHeight}px`;
      that.mainHeight = `${document.documentElement.clientHeight*0.93}px`;
      that.tableHeight=`${document.documentElement.clientHeight*0.93-140}px`;
    };
  },

  watch: {
    clientHeight:function(){
      this.$store.commit("setClientHeight",this.clientHeight);
    },
    mainHeight:function(){
      this.$store.commit("setMainHeight",this.mainHeight);
    },
    tableHeight:function(){
      this.$store.commit("setTableHeight",this.tableHeight);
    },
    "this.$store.state.token": {
      handler: function() {
        console.log("app_token:", this.$store.state.token);
        this.init();
      }
    }
  },
  methods: {
    //状态判断，跳转路由
    init() {
      if (!this.$store.state.token) {
        this.$router.push({
          name: ""
          // name:"Entering"
        });
      }
      this.$store.commit("setClientHeight",this.clientHeight);
      this.$store.commit("setMainHeight",this.mainHeight);
      this.$store.commit("setTableHeight",this.tableHeight);
    }
  },
  created() {
    console.log("statestate：", this.$store.state);
    this.init();
  }
};
</script>

<style>
#app {
  position: fixed;
  width: 100%;
  height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/* li{ list-style: none;} */
</style>
