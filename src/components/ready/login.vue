<template>
  <div class="login">
    <div class="login_box">
      <div class="box-title">商户管理后台登陆</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号：" prop="mobile">
          <el-input v-model.number="ruleForm.mobile" maxlength="11" placeholder="请输入注册手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="verification" v-show="isverification">
          <el-input v-model="ruleForm.verification" maxlength="4" placeholder="请输入手机验证码"></el-input>
        </el-form-item>
        <el-form-item v-show="isverification">
          <el-button type="primary" @click="submitForm('ruleForm')">登陆</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
        <el-button type="primary" plain @click="getvercode" v-show="!isverification">获取验证码</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
const validmobile = (rule, value, callback) => {
  const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/;
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};

export default {
  name: "Login",
  data() {
    return {
      isverification: "",
      ruleForm: {
        mobile: "",
        verification: ""
      },
      rules: {
        mobile: [
          { required: true, message: "请输入注册手机号", trigger: "blur" },
          {
            type: "number",
            message: "请输入正确的11位手机号码",
            trigger: "change"
          },
          { required: true, trigger: "blur", validator: validmobile } //这里需要用到全局变量
        ],
        verification: [
          { required: true, message: "请输入手机验证码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handtoken() {
      this.$store.commit("setToken", this.msg);
    },
    //点击登陆，校验表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.checkCode();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$store.commit("setUserInfo", {});
      this.$store.commit("setshopInfo", {});
      this.$store.commit("setToken", "");
      localStorage.setItem("TOKEN", "");
      this.isverification = "";
      this.ruleForm.mobile = "";
      this.ruleForm.verification = "";
      this.$refs[formName].resetFields();
    },
    //发送短信验证码
    getvercode() {
      if (this.ruleForm.mobile) {
        let _parms = { shopMobile: this.ruleForm.mobile };
        this.$http
          .post("webApprove/auth/sendForShopAppRegister", _parms)
          .then(res => {
            this.isverification = res.data.data.verifyId;
          });
      }
    },
    //验证短信验证码
    checkCode() {
      if (this.isverification == this.ruleForm.verification) {
        const _Url =
          "webApprove/auth/isVerifyForShopApp?shopMobile=" +
          this.ruleForm.mobile +
          "&smsContent=" +
          this.ruleForm.verification;
        this.$http.get(_Url).then(res => {
          if (res.data.data == 0) {
            this.getuserinfo();
          }
        });
      } else {
        this.ruleForm.verification = "";
        this.$message.error("验证码错误！");
      }
    },
    //获取用户信息
    getuserinfo() {
      this.$http
        .get("webApprove/auth/findUserByMobile?mobile=" + this.ruleForm.mobile)
        .then(res => {
          if (res.data.data) {
            this.$store.commit("setUserInfo", res.data.data);
            this.getToken();
          } else {
            this.adduser();
          }
        });
    },
    //新用户注册
    adduser() {
      let _parms = {
        userName: this.ruleForm.mobile,
        mobile: this.ruleForm.mobile
      };
      this.$http.post("webApprove/auth/addShopAppUser", _parms).then(res => {
        this.$store.commit("setUserInfo", res.data.data);
        this.getToken();
      });
    },
    //获取token
    getToken() {
      let _parms = { userName: this.ruleForm.mobile };
      this.$http.post("webApprove/auth/login", _parms).then(res => {
        const _token = "Bearer " + res.data.data;
        const _shopInfo = this.$store.state.userInfo;
        this.$store.commit("setToken", _token);
        localStorage.setItem("TOKEN", _token);
        if (_shopInfo.shopId) {
          this.getshopInfo();
        } else {
          this.$confirm(
            "该用户暂未绑定商户，是否进入商户入驻流程入驻?",
            "提示",
            {
              confirmButtonText: "进入入驻流程",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              this.$router.push({
                name: "Entering"
              });
            })
            .catch(() => {
              //取消入驻，跳转以官网主页面
            });
        }
      });
    },
    //获取商家信息
    getshopInfo() {
      this.$http
        .get("website/shop/approve/get/" + this.$store.state.userInfo.shopId)
        .then(res => {
          this.$store.commit("setshopInfo", res.data.data);
          this.$router.push({
            name: "Home"
          });
        });
    }
  }
};
</script>
<style lang="less">
.login {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
  background: linear-gradient(90deg, #496eaa, #926cd8, #496eaa);
  .login_box {
    width: 380px;
    min-height: 150px;
    padding: 20px;
    border: 1px solid #38a2dc;
    border-radius: 10px;
    .box-title {
      width: 100%;
      text-align: center;
      font-size: 30px;
      color: #409eff;
      margin-bottom: 20px;
    }
    .el-input__inner {
      color: #409eff;
    }
    .el-form-item__label {
      color: #fff;
    }
  }
}
</style>
