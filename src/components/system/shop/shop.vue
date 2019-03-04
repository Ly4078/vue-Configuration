<template>
  <div class="shop">
    <div class="martop">
      <el-button
        type="success"
        v-for="item in typelist"
        :key="item.id"
        :plain="status==item.id?false:true"
        @click="handtab(item.id)"
      >{{item.label}}</el-button>
      <el-button type="primary" @click="handadd" v-show="status==2">添加店员</el-button>
    </div>
    <div class="shopcnets" v-show="status==1">
      <Entering :edit="edit" v-bind:style="{height: this.$store.state.tableHeight}"/>
    </div>
    <div class="shopcnets" v-show="status==2">
      <el-table v-loading="loading" :height="this.$store.state.tableHeight" :data="clerklist" border style="width: 100%">
        <el-table-column prop="nickName" align="center" label="昵称"></el-table-column>
        <el-table-column align="center" label="用户头像">
          <template slot-scope="scope">
            <img class="tickimg" :src="scope.row.iconUrl" alt>
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册号码">
          <template slot-scope="scope">{{scope.row.mobile | filtersphone}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.id==admin.cashierId">管理员</el-tag>
            <el-button @click="handdel(scope.row)" type="primary" size="small" v-show="scope.row.id!=admin.cashierId">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="添加店员"
        :visible.sync="dialogVisible"
        :modal-append-to-body="false"
        width="30%"
      >
        <el-input v-model="addmobile" :autofocus="true" placeholder="请输入店员的注册手机号"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="determine">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Entering from "@/components/ready/entering";
export default {
  name: "shop",
  data() {
    return {
      edit:"edit",
      addmobile: "",
      status: 1,
      loading: false,
      dialogVisible: false,
      admin: {},
      clerklist: [],
      typelist: [
        {
          label: "商铺管理",
          id: 1
        },
        {
          label: "店员管理",
          id: 2
        }
      ]
    };
  },
  components: {
    Entering
  },
  watch: {
    dialogVisible: function() {
      if (!this.dialogVisible) {
        this.addmobile = "";
      }
    }
  },
  filters: {
    filtersphone(val) {
      return val.substr(0, 3) + "****" + val.substr(7);
    }
  },
  methods: {
    //切换tab
    handtab(val) {
      this.status = val;
    },
    //查询管理员
    // GET /app/shopCashier/adminByShopId?shopId=35
    getadmin() {
      const _Url =
        "app/shopCashier/adminByShopId?shopId=" + this.$store.state.shopInfo.id;
      this.$http.get(_Url).then(res => {
        this.admin = res.data.data;
        this.getclerklist();
      });
    },
    //查询店员列表
    getclerklist() {
      const _Url =
        "app/user/listForShopId?shopId=" + this.$store.state.shopInfo.id;
      this.loading = true;
      this.$http.get(_Url).then(res => {
        this.loading = false;
        this.clerklist = res.data.data;
      });
    },
    //点击添加店员按钮
    handadd() {
      this.dialogVisible = !this.dialogVisible;
    },
    //点击确定添加店员按钮
    determine() {
      if (this.addmobile) {
        const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (reg.test(this.addmobile)) {
          this.finduser();
        } else {
          this.addmobile = "";
          this.$message.error("手机号输入错误，请重新输入!");
        }
      } else {
        this.$message.error("请输入店员的注册手机号!");
      }
    },
    //查询当前用户是否已是别家店员
    finduser() {
      const _Url = "app/auth/findUserByMobile?mobile=" + this.addmobile;
      this.$http.get(_Url).then(res => {
        if (res.data.data.shopId) {
          this.addmobile = "";
          this.$message.error("该用户已经是其他店铺核销员，请检查手机号!");
        } else {
          this.addHxUser();
        }
      });
    },
    //添加店员
    addHxUser() {
      let _parms = {
        mobile: this.addmobile,
        shopId: this.$store.state.shopInfo.id
      };
      this.$http.post("app/user/addHxUser", _parms).then(res => {
        this.$message.success("添加成功！");
        this.handadd();
        this.getclerklist();
      });
    },
    //删除某个店员
    handdel(val) {
      this.$confirm("确定要删除此店员?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let _parms = {
            shopId: this.$store.state.shopInfo.id,
            mobile: val.mobile
          };
          this.$http.post("app/user/deleteHxUser", _parms).then(res => {
            this.$message.success("删除成功！");
            this.getclerklist();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除操作"
          });
        });
    }
  },
  created() {
    this.getadmin();
  }
};
</script>
<style lang="less">
.shop {
  width: 98%;
  height: 96%;
  padding: 1%;
  .martop {
    text-align: left;
    margin-bottom: 14px;
  }

  .shopcnets {
    padding: 1%;
    background: #fff;
    .el-cascader{
      float: left;
    }
    .tickimg {
      width: 80px;
      height: 80px;
      border-radius: 10px;
    }
    .entering{
      width: 100%;
      padding: 0;
      margin: 0;
    }
  }
}
</style>
