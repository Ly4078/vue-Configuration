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
        this.init();
      }
    }
  },
  methods: {
    init() {
      if (this.$store.state.token) {
        this.$router.push({
          name: "HelloWorld"
        });
      } else if (!this.$store.state.token) {
        this.$router.push({
          name: "Login"
        });
      }
    }
  },
  created() {
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
</style>
