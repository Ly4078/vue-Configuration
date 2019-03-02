<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  watch:{
    'this.$store.state.token':{
      handler:function(){
        console.log("app_token:",this.$store.state.token)
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
    }
  },
  created() {
    console.log("statestate：",this.$store.state)
    this.init();
  }
};
</script>

<style>
#app {
  position:fixed;
  width: 100%;
  height:100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/* li{ list-style: none;} */
</style>
