<template>
  <div class="entering">
      <header>商户入驻</header>
    <div class="settled-progress">
      <el-steps space="33%" :active="stepnum" finish-status="success">
        <el-step v-for="item in stepobj" :key="item.id" :title="item.title"></el-step>
      </el-steps>
    </div>

    <div class="settled-basicinfo ui-width" v-if="stepnum==1">
      <header class="panel-head">
        填写基本信息
        <span>
          （带
          <em style="color:red">*</em>为必填，为了便于审核通过，请如实填写）
        </span>
      </header>
      <div class="shopInfo">
        <el-form ref="shopInfo" :rules="rules" :model="shopInfo" label-width="120px">
          <span class="h2title">客户信息--</span>
          <el-form-item label="商户名称：" prop="shopName">
            <el-input v-model="shopInfo.shopName" placeholder="请输入商户名称"></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="contact">
            <el-input v-model="shopInfo.contact" placeholder="请输入联系人姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="mobile">
            <el-input v-model="shopInfo.mobile" placeholder="请输入联系人电话"></el-input>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-tooltip class="item" effect="dark" content="点击右边图标选择地理定位" placement="top">
              <el-input clear="addinput" v-model="shopInfo.address" placeholder="请输入联系人电话"></el-input>
            </el-tooltip>
            <i class="el-icon-location" @click="openmap"></i>
          </el-form-item>
          <el-form-item label="经营品类：" required>
            <el-col :span="6">
              <el-form-item prop="cateI">
                <el-select v-model="shopInfo.cateI" placeholder="请选择">
                  <el-option
                    v-for="item in catelist"
                    :key="item.id"
                    :label="item.categoryName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1">---</el-col>
            <el-col :span="6">
              <el-form-item prop="cateII">
                <el-select v-model="shopInfo.cateII" multiple size="medium" placeholder="请选择">
                  <el-option
                    v-for="item in ercate"
                    :key="item.id"
                    :label="item.categoryName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <span class="h2title">资质信息--</span>
          <el-form-item label="图片信息：" required>
            <ul class="imgul">
              <el-col :span="5">
                <el-form-item prop="licensePic" v-loading="loading">
                  <li class="imgli">
                    <p>1.营业执照</p>
                    <el-upload
                      class="avatar-uploader"
                      action="#"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                    >
                      <img v-if="shopInfo.licensePic" :src="shopInfo.licensePic" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon" @click="handfile(1)"></i>
                    </el-upload>
                    <div class="legend">点击上传营业执照</div>
                  </li>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item prop="doorPic" v-loading="loading2">
                  <li class="imgli">
                    <p>2.卫生许可证</p>
                    <el-upload
                      class="avatar-uploader"
                      action="#"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                    >
                      <img v-if="shopInfo.doorPic" :src="shopInfo.doorPic" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon" @click="handfile(2)"></i>
                    </el-upload>
                    <div class="legend">点击上传卫生许可证</div>
                  </li>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item prop="healthPic" v-loading="loading3">
                  <li class="imgli">
                    <p>3.门头照</p>
                    <el-upload
                      class="avatar-uploader"
                      action="#"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                    >
                      <img v-if="shopInfo.healthPic" :src="shopInfo.healthPic" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon" @click="handfile(3)"></i>
                    </el-upload>
                    <div class="legend">点击上传门头照</div>
                  </li>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item prop="logoPic" v-loading="loading4">
                  <li class="imgli">
                    <p>4.logo</p>
                    <el-upload
                      class="avatar-uploader"
                      action="#"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                    >
                      <img v-if="shopInfo.logoPic" :src="shopInfo.logoPic" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon" @click="handfile(4)"></i>
                    </el-upload>
                    <div class="legend">点击上传logo</div>
                  </li>
                </el-form-item>
              </el-col>
            </ul>
            <span>
              <br>照片要求：
              <br>
            </span>
            <span>1.图片不大于1MB。
              <br>
            </span>
            <span>2.图片不得有水印、logo有其他网站信息。</span>
          </el-form-item>
          <span class="h2title">其它信息--</span>
          <el-form-item label="营业日：" required>
            <el-col :span="6">
              <el-form-item prop="openstart">
                <el-select v-model="shopInfo.openstart" placeholder="开始时间">
                  <el-option v-for="(item,index) in week" :key="index" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1">---</el-col>
            <el-col :span="6">
              <el-form-item prop="openend">
                <el-select v-model="shopInfo.openend" placeholder="结束时间">
                  <el-option v-for="(item,index) in week" :key="index" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="营业时段：" required>
            <el-col :span="6">
              <el-form-item prop="date1">
                <el-time-picker
                  type="fixed-time"
                  placeholder="选择时间"
                  v-model="shopInfo.date1"
                  style="width: 100%;"
                ></el-time-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">
              <span @click="handday(1)" :class="istoday?'actday':''">今日</span>
              <span @click="handday(2)" :class="!istoday?'actday':''">次日</span>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="date2">
                <el-time-picker
                  type="fixed-time"
                  placeholder="选择时间"
                  v-model="shopInfo.date2"
                  style="width: 100%;"
                ></el-time-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="其它服务：">
            <el-select v-model="shopInfo.otherService" multiple size="medium" placeholder="请选择">
              <el-option v-for="(item,index) in options" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div>
              <el-radio-group v-model="radio">
                <el-radio :label="1">
                  同意
                  <span @click="agreement">《享七商家服务协议》</span>
                </el-radio>
              </el-radio-group>
            </div>
            <el-button type="primary" @click="submitForm('shopInfo')">提交审核</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="settled-basicinfo ui-width" v-if="stepnum==2">
      <div class="review">
        <i class="el-icon-loading"></i>
        店铺入驻申请正在审核中....
        <br>
        <router-link to="/">
          <!-- 前往官网主页面 -->
          <el-button type="primary">返回首页</el-button>
        </router-link>
      </div>
    </div>

    <div class="settled-basicinfo ui-width" v-if="stepnum==3">
      <div class="review">
        <div v-if="status==1">
          <i class="el-icon-success"></i>审核通过
          <br>
          <el-button type="primary" @click="handstatus(1)">登录商户中心</el-button>
        </div>
        <div v-if="status==2">
          <i class="el-icon-error"></i>审核失败
          <br>
          <el-button type="primary" @click="handstatus(2)">重新提交</el-button>
        </div>
      </div>
    </div>

    <el-dialog title="享七商家服务协议" :visible.sync="dialogTableVisible">
      <iframe src="http://www.luhome.top/h5.html" frameborder="0" style="border:1px solid #409EFF;"></iframe>
    </el-dialog>

    <el-dialog title="地图选点定位" :visible.sync="dialogmap" width="80%" top="1%">
      <Maptab v-on:getMapdata="getMapdata"></Maptab>
    </el-dialog>
  </div>
</template>


<script>
import Maptab from "@/components/public/map";
export default {
  name: "entering",
  data() {
    return {
      stepnum: 3,
      status: 2,
      filenum: 1,
      addimg: "../../assets/images/addimg.png",
      imageUrl: "",
      radio: 1,
      dialogTableVisible: false,
      dialogmap: false,
      loading: false,
      loading2: false,
      loading3: false,
      loading4: false,
      istoday: true,
      cateI: "",
      cateII: [],
      stepobj: [
        {
          id: 0,
          title: "填写基本信息",
          description: "请如实填写基本信息"
        },
        {
          id: 1,
          title: "提交审核",
          description: "工作人员会在1至2个工作日完成审核"
        },
        {
          id: 2,
          title: "查看审核结果",
          description: "查看审核结果"
        }
      ],
      week: [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ],
      options: ["停车场", "包间", "WIFI", "音乐"],
      ercate: [],
      catelist: [],
      shopInfo: {
        shopName: "",
        shoptype: "",
        Contact: "",
        mobile: "",
        cateI: "",
        HoursI: "",
        MinutesI: "",
        HoursII: "",
        MinutesII: "",
        cateII: [],
        category: [],
        address: "",
        openstart: "",
        openend: "",
        date1: "",
        date2: "",
        otherService: [],
        licensePic: "",
        doorPic: "",
        logoPic: "",
        smallLogoPic: "",
        healthPic: "",
        city: "",
        locationX: "",
        locationY: "",
        address: ""
      },
      rules: {
        shopName: [
          { required: true, message: "请输入商铺名称", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur"
          },
          {
            validator: function(rule, value, callback) {
              if (/^1[3456789]\d{9}$/.test(value) == false) {
                callback(new Error("请输入正确的手机号"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        address: [
          { required: true, message: "请选择或输入详情地址", trigger: "blur" }
        ],
        category: [
          { required: true, message: "请选择相应经营类别", trigger: "change" }
        ],
        licensePic: [
          {
            required: true,
            message: "请选择营业执照图片上传",
            trigger: "change"
          }
        ],
        doorPic: [
          {
            required: true,
            message: "请选择卫生许可证图片上传",
            trigger: "change"
          }
        ],
        healthPic: [
          { required: true, message: "请选择门头照图片上传", trigger: "change" }
        ],
        logoPic: [
          { required: true, message: "请选择logo图片上传", trigger: "change" }
        ],
        cateI: [
          {
            required: true,
            message: "请选择经营分类一级类别",
            trigger: "change"
          }
        ],
        cateII: [
          {
            required: true,
            message: "请选择经营分类二级类别",
            trigger: "change"
          }
        ],
        openstart: [
          { required: true, message: "请选择营业日开始时间", trigger: "change" }
        ],
        openend: [
          { required: true, message: "请选择营业日结束时间", trigger: "change" }
        ],
        date1: [
          {
            required: true,
            message: "请选择营业时段结束时间",
            trigger: "change"
          }
        ],
        date2: [
          {
            required: true,
            message: "请选择营业时段结束时间",
            trigger: "change"
          }
        ]
      }
    };
  },
  watch: {
    "shopInfo.cateI": {
      handler: function() {
        for (let i in this.catelist) {
          if (this.shopInfo.cateI == this.catelist[i].id) {
            this.shopInfo.cateII = [];
            this.ercate = this.catelist[i].children;
          }
        }
      }
    },
    "shopInfo.cateII": {
      handler: function() {
        if (this.shopInfo.cateII.length > 3) {
          this.shopInfo.cateII.pop();
          this.$message.error("最多选择三个");
        }
      }
    },
    "shopInfo.date1": {
      handler: function() {
        let myDate = new Date(this.shopInfo.date1);
        this.shopInfo.HoursI = myDate.getHours();
        this.shopInfo.MinutesI = myDate.getMinutes();
      }
    },
    "shopInfo.date2": {
      handler: function() {
        let myDate = new Date(this.shopInfo.date2);
        this.shopInfo.HoursII = myDate.getHours();
        this.shopInfo.MinutesII = myDate.getMinutes();
      }
    }
  },
  components: {
    Maptab
  },
  methods: {
    //初始化
    init() {
      this.queryreview();
      // this.getcategory();
    },
    //查询当前审核进度
    queryreview() {
      this.$http
        .get(
          "website/shopEnter/searchByUserId?userId=" +
            this.$store.state.userInfo.id
        )
        .then(res => {
          if (res.data.data && res.data.data.id) {
            if (res.data.data.status == 0) {
              this.stepnum = 2;
            } else if (res.data.data.status == 1 || res.data.data.status == 2) {
              this.stepnum = 3;
            }
            this.status = res.data.data.status;
          } else {
            this.stepnum = 1;
            this.getcategory();
          }
        });
    },
    //审核结果操作
    handstatus(val) {
      if (val == 1) {
        //进入商户系统
      } else if (val == 2) {
        //重新提交
        this.stepnum = 1;
        this.status = 1;
        this.getcategory();
      }
    },
    //获取分类信息
    getcategory() {
      this.$http.get("app/shopCategory/list").then(res => {
        this.catelist = res.data.data;
      });
    },
    //p判斷当前所上传图片字段
    handfile(val) {
      this.filenum = val;
    },
    //图片上传
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      } else {
        if (this.filenum == 1) {
          this.loading = true;
        } else if (this.filenum == 2) {
          this.loading2 = true;
        } else if (this.filenum == 3) {
          this.loading3 = true;
        } else if (this.filenum == 4) {
          this.loading4 = true;
        }
        let _parms = {
          file: file,
          userName: "userName"
        };
        this.$http.post("img/uploadMp4", _parms).then(res => {
          if (this.filenum == 1) {
            this.loading = false;
            this.shopInfo.licensePic = res.data.data.picUrl;
          } else if (this.filenum == 2) {
            this.loading2 = false;
            this.shopInfo.doorPic = res.data.data.picUrl;
          } else if (this.filenum == 3) {
            this.loading3 = false;
            this.shopInfo.healthPic = res.data.data.picUrl;
          } else if (this.filenum == 4) {
            this.loading4 = false;
            this.shopInfo.logoPic = res.data.data.picUrl;
            this.shopInfo.smallLogoPic = res.data.data.smallPicUrl;
          }
        });
      }
      //   return isJPG && isLt2M;
    },
    //显示模态框
    agreement() {
      this.dialogTableVisible = true;
    },
    //选择 今日/次日
    handday(val) {
      if (val == 1) {
        this.istoday = true;
      } else {
        this.istoday = false;
      }
    },
    //打开地图
    openmap() {
      this.dialogmap = true;
    },
    //提交前校验
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveshop();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //保存提交列表
    saveshop() {
      let _parms = {},
        _value = "",
        _shopHours = "",
        _istoday = "",
        _Cate = "",
        _Url = "/api/website/shopEnter/add";
      _istoday = this.istoday ? "" : "次日";
      _shopHours =
        this.shopInfo.openstart +
        "至" +
        this.shopInfo.openend +
        "," +
        this.shopInfo.HoursI +
        ":" +
        this.shopInfo.MinutesI +
        "至" +
        _istoday +
        this.shopInfo.HoursII +
        ":" +
        this.shopInfo.MinutesII;
      for (let i in this.shopInfo.cateII) {
        _Cate += this.shopInfo.cateI + "-" + this.shopInfo.cateII[i] + "|";
      }
      _Cate = _Cate.substring(0, _Cate.length - 1);
      _parms = {
        licensePic: this.shopInfo.licensePic,
        doorPic: this.shopInfo.doorPic,
        mobile: this.shopInfo.mobile,
        locationY: this.shopInfo.locationY,
        logoPic: this.shopInfo.licensePic,
        shopCate: _Cate,
        healthPic: this.shopInfo.healthPic,
        shopHours: _shopHours,
        smallLogoPic: this.shopInfo.licensePic,
        userName: this.$store.state.userInfo.userName,
        address: this.shopInfo.address,
        city: this.shopInfo.city,
        shopName: this.shopInfo.shopName,
        otherService: this.shopInfo.otherService.join(","),
        locationX: this.shopInfo.locationX
      };
      console.log("_parms:", _parms);
      this.$http.post("app/shopEnter/add", _parms).then(res => {
        this.$message.success("提交成功，请等待审核");
        this.queryreview();
      });
    },
    //处理地图返回信息
    getMapdata: function(data) {
      this.shopInfo.city = data.addressComponents.city;
      this.shopInfo.locationX = data.location.lng;
      this.shopInfo.locationY = data.location.lat;
      let _address = data.addressComponents;
      let _town = _address.town ? _address.town : "";
      let _streetNumber = _address._streetNumber ? _address._streetNumber : "";
      this.shopInfo.address =
        _address.province +
        "-" +
        _address.city +
        "-" +
        _address.district +
        "-" +
        _address.street +
        "-" +
        _town +
        "-" +
        _streetNumber;
    }
  },
  created() {
    this.init();
  }
};
</script>

<style lang="less">
.entering {
  width: 60%;
  padding: 0 20% 5% 20%;
  margin: 0 auto;
  height: 100%;
  overflow-y: auto;
  margin-bottom: 200px;
  header{
      width: 100%;
      height: 80px;
      line-height: 80px;
      margin:  0 auto;
      text-align: center;
      font-size: 30px;
      color: #409EFF;
  }
  iframe {
    width: 100%;
    height: 500px;
  }

  .ui-width,
  .shopInfo {
    width: 100%;
    margin: 0 auto;
    .panel-head {
      background: #dedede;
      line-height: 40px;
      text-indent: 1em;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .h2title {
    font-size: 22px;
    padding: 5px 0;
    display: block;
    width: 100%;
    color: #409eff;
    text-align: left;
  }
  .imgli {
    width: 100%;
    min-height: 200px;
    margin: 0 0.5%;
    list-style-type: none;
    cursor: pointer;
    float: left;
    position: relative;
    p {
      text-align: center;
    }
    input {
      width: 95%;
      height: 80%;
      position: relative;
      opacity: 0;
      z-index: 2;
      cursor: pointer;
      background: url("../../assets/images/addimg.png") no-repeat;
    }
    .addimg {
      width: 95%;
      height: 80%;
      margin-top: -200px;
      cursor: pointer;
    }

    .legend {
      position: relative;
      width: 87%;
      top: -57px;
      margin: 0 auto;
      text-align: center;
      background: #bebebe;
      color: #fff;
      border-radius: 0 0 5px 5px;
      opacity: 0.9;
    }
  }
  .el-dialog {
    border: 1px solid #409eff;
  }
  .el-select {
    float: left;
    width: 100%;
  }
  .review {
    width: 100%;
    min-height: 300px;
    text-align: center;
    font-size: 40px;
    padding: 50px 0;
    color: #409eff;
  }
  .el-input {
    width: 90%;
    float: left;
  }
  .el-icon-location {
    width: 50px;
    height: 50px;
    cursor: pointer;
  }
  .el-icon-location:before {
    width: 50px;
    height: 50px;
    color: #409eff;
  }
  .el-step__main {
    text-align: center;
  }
  .line {
    text-align: center;
    span {
      cursor: pointer;
    }
    .actday {
      color: #409eff;
    }
  }
}
</style>



