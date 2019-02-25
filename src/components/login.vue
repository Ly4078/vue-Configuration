<template>
  <div class="login">
    <div class="login_box">
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      msg: ""
    };
  },
  methods: {
    handtoken() {
      this.$store.commit("setToken", this.msg);
      this.init();
    },
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
  }
};
</script>
<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #496eaa,#926cd8, #496eaa);
  animation: mymove 20s ease infinite;
  -webkit-animation: mymove 20s ease infinite;
  -moz-animation: mymove 20s ease infinite;
}
@keyframes mymove {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 100% 0%;
  }
}
</style>
