<template>
  <div class="home">
    <el-container justify="center">
      <el-header>
        <div class="title">享七商户管理平台</div>
        <div class="info">
          <img class="shop_logo" :src="this.$store.state.shopInfo.logoUrl" alt="logo">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{this.$store.state.shopInfo.shopName}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">店铺信息</el-dropdown-item>
              <el-dropdown-item command="b">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu default-active="2" class="el-menu-vertical-demo" @select="handleSelect">
            <el-menu-item v-for="item in menulist" :key="item.id" :index="item.id">
              <router-link :to="item.href">
                <i class="el-icon-menu"></i>
                <span>{{item.label}}</span>
              </router-link>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      menulist: [
        {
          label: "店铺管理",
          href: "/Home/Shop",
          id: "1"
        },
        {
          label: "商品管理",
          href: "/Home/Commodity",
          id: "2"
        },
        {
          label: "营业数据",
          href: "/Home/traffic",
          id: "3"
        },
        {
          label: "营销推广",
          href: "/Home/Marketing",
          id: "4"
        },
        {
          label: "我的动态",
          href: "/Home/moving",
          id: "5"
        },
        {
          label: "我的钱包",
          href: "/Home/Wallet",
          id: "6"
        }
      ]
    };
  },
  methods: {
    //选择我的店铺
    handleCommand(val) {
      if (val == "a") {
        //进入修改店铺信息页面
      } else if (val == "b") {
        //退出登录
        this.$store.commit("setUserInfo", {});
        this.$store.commit("setshopInfo", {});
        this.$store.commit("setToken", "");
        localStorage.setItem("TOKEN", "");
        console.log("aa");
        this.$router.push({ name: "Login" });
      }
    },
    handleSelect(key, keyPath) {
      console.log("key:", key);
      console.log("keyPath:", keyPath);
    }
  },
  created() {
    console.log("store:", this.$store.state);
    if (!this.$store.state.token) {
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style lang="less">
.home {
  width: 100%;
  height: 100%;
  section {
    width: 100%;
    height: 100%;
    header {
      width: 100%;
      padding: 2% 2%;
      background: #409eff;
      display: flex;
      align-items: center; /*垂直居中*/
      justify-content: space-between; /*两端对齐*/
      font-size: 30px;
      color: #fff;
      & > div {
        display: flex;
        align-items: center; /*垂直居中*/
        justify-content: space-between;
        .shop_logo {
          width: 60px;
          height: 60px;
          border-radius: 50px;
          margin: 0 10px;
        }
        .el-dropdown {
          font-size: 30px;
          color: #fff;
          cursor: pointer;
        }
      }
    }
    aside {
      height: 100%;
      border-right: 2px solid #ebebeb;
      background-color: #fff;
      li {
        a {
          text-decoration: none;
          color: #303133;
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .is-active {
        color: #409eff;
        a {
          color: #409eff;
        }
      }
    }
    main {
      float: right;
      font-size: 100px;
      color: red;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
