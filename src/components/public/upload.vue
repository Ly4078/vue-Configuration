<template>
  <div class="upload">
    <el-form ref="goods" :rules="rules" :model="goods" label-width="180px">
      <el-form-item label="商品主图：" prop="skuPic">
        <div class="uploadbox">
          <el-upload
            v-loading="loading"
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="goods.skuPic" :src="goods.skuPic" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" @click="changefile(1)"></i>
          </el-upload>
          <div class="legend">点击上传其它主图</div>
        </div>
      </el-form-item>
      <el-form-item label="商品轮播图（选填）：">
        <div class="imgbox" v-for="(item,index) in goods.goodsSkuPics" :key="index">
          <img :src="item.url" alt class="avatar">
          <span class="el-icon-delete" @click.stop="handdel(1,index)"></span>
        </div>
        <div class="uploadbox" v-if="goods.goodsSkuPics.length<5">
          <el-upload
            v-loading="loading2"
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus avatar-uploader-icon" @click="changefile(2)"></i>
          </el-upload>
          <div class="legend">点击上传商品轮播图</div>
        </div>
      </el-form-item>
      <el-form-item label="商品名称：" prop="spuName">
        <el-input v-model="goods.spuName" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品类别：" prop="categoryId">
        <el-cascader
          :options="options"
          v-model="goods.categoryId"
          @active-item-change="handleItemChange"
          :props="props"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="商品描述：" prop="title">
        <el-input type="textarea" :rows="2" placeholder="请输入商品描述" v-model="goods.title"></el-input>
      </el-form-item>
      <el-form-item label="商品详情图（选填）：">
        <div class="imgbox" v-for="(item,index) in goods.picUrls" :key="index">
          <img :src="item.url" alt class="avatar">
          <span class="el-icon-delete" @click.stop="handdel(2,index)"></span>
        </div>
        <div class="uploadbox" v-if="goods.picUrls.length<5">
          <el-upload
            v-loading="loading3"
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus avatar-uploader-icon" @click="changefile(3)"></i>
          </el-upload>
          <div class="legend">点击上传商品主图</div>
        </div>
      </el-form-item>
      <el-form-item label="商品原价（元）：" prop="sellPrice">
        <el-input type="number" v-model="goods.sellPrice" placeholder="请输入商品原价（元）"></el-input>
      </el-form-item>
      <el-form-item label="商品库存：" prop="stockNum">
        <el-input type="number" v-model="goods.stockNum" placeholder="请输入商品库存数量"></el-input>
      </el-form-item>
      <el-form-item label="预警库存：" prop="waringStock">
        <el-input type="number" v-model="goods.waringStock" placeholder="请输入商品预警库存"></el-input>
      </el-form-item>
      <el-form-item label="设置秒杀活动：">
        <el-switch v-model="isspike"></el-switch>
      </el-form-item>
      <div v-show="isspike">
        <el-form-item label="秒杀价（元）：">
          <el-input v-model="goods.spike.actAmount" placeholder="请输入商品名称" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="库存（不少于15份）：" prop="spike.stockNum">
          <el-input type="number" v-model="goods.spike.stockNum" placeholder="请输入秒杀商品库存"></el-input>
        </el-form-item>
        <el-form-item label="预警库存：" prop="spike.waringStock">
          <el-input type="number" v-model="goods.spike.waringStock" placeholder="请输入秒杀商品预警库存"></el-input>
        </el-form-item>
        <el-form-item label="使用规则" v-show="goods.spike.ruleDesc.length>0">
          <div class="desc">
            <el-input
              v-for="(item,index) in goods.spike.ruleDesc"
              :key="index"
              v-model="goods.spike.ruleDesc[index].label"
              placeholder="请输入使用规则"
            >
              <template slot="append">
                <div class="el-icon-delete" @click="delrule(1,index)"></div>
              </template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item :label="goods.spike.ruleDesc.length>0?'':'使用规则'">
          <el-button type="primary" plain @click="addrule(1)">
            <i class="el-icon-plus"></i>添加使用规则
          </el-button>
        </el-form-item>
      </div>
      <el-form-item label="设置砍价活动：">
        <el-switch v-model="isspike"></el-switch>
      </el-form-item>
      <div v-show="isbargain">
        <el-form-item label="底价（元）：" prop="bargain.actAmount">
          <el-input type="number" v-model="goods.bargain.actAmount" placeholder="请输入商品砍价后最低价格"></el-input>
        </el-form-item>
        <el-form-item label="库存（不少于15份）：" prop="bargain.stockNum">
          <el-input type="number" v-model="goods.bargain.stockNum" placeholder="请输入砍价商品库存"></el-input>
        </el-form-item>
        <el-form-item label="预警库存：" prop="bargain.waringStock">
          <el-input type="number" v-model="goods.bargain.waringStock" placeholder="请输入砍价商品预警库存"></el-input>
        </el-form-item>
        <el-form-item label="使用规则" v-show="goods.bargain.ruleDesc.length>0">
          <div class="desc">
            <el-input
              v-for="(item,index) in goods.bargain.ruleDesc"
              :key="index"
              v-model="goods.bargain.ruleDesc[index].label"
              placeholder="请输入使用规则"
            >
              <template slot="append">
                <div class="el-icon-delete" @click="delrule(2,index)"></div>
              </template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item :label="goods.bargain.ruleDesc.length>0?'':'使用规则'">
          <el-button type="primary" plain @click="addrule(2)">
            <i class="el-icon-plus"></i>添加使用规则
          </el-button>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm('goods')">保存</el-button>
        <el-button @click="resetForm('goods')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
var valistockNum = (rule, value, callback) => {
  if (value < 15) {
    return callback(new Error("库存不能小于15份"));
  } else {
    callback();
  }
};

export default {
  name: "upload",
  data() {
    var valiAmount = (rule, value, callback) => {
      if (this.goods.sellPrice) {
        if (value > this.goods.sellPrice * 1 - 1) {
          return callback(new Error("底价不能高于原价减1"));
        } else {
          callback();
        }
      } else {
        this.goods.bargain.actAmount = "";
        return callback(new Error("请先填写原价"));
      }
    };
    var valisnum = (rule, value, callback) => {
      let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error("请输入整数！"));
      }
    };
    var checkInt = (rule, value, callback) => {
      let reg = /^\+?[1-9][0-9]*$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error("请输入整数！"));
      }
    };
    return {
      id: "",
      filenum: 1,
      loading: false,
      loading2: false,
      loading3: false,
      isspike: false,
      isbargain: true,
      goods: {
        skuPic: "", //主图
        smallSkuPic: "",
        spuName: "",
        title: "",
        sellPrice: "",
        stockNum: "",
        waringStock: "5",
        categoryId: [],
        picUrls: [],
        goodsSkuPics: [],
        spike: {
          actId: 44,
          actAmount: "1",
          stockNum: "15",
          waringStock: "5",
          isDeleted: 0,
          id: "",
          ruleid: "",
          ruleDesc: []
        },
        bargain: {
          actId: 41,
          actAmount: "",
          stockNum: "15",
          waringStock: "5",
          isDeleted: 0,
          id: "",
          ruleid: "",
          ruleDesc: []
        }
      },
      rules: {
        skuPic: [
          { required: true, message: "请上传商品主图", trigger: "change" }
        ],
        spuName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        categoryId: [
          { required: true, message: "请输入选择类目", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入商品描述", trigger: "blur" }],
        sellPrice: [
          { required: true, message: "请输入商品原价", trigger: "blur" },
          { validator: valisnum, trigger: "change" }
        ],
        stockNum: [
          { required: true, message: "请输入商品库存", trigger: "blur" },
          { validator: valistockNum, trigger: "change" },
          { validator: checkInt, trigger: "blur" }
        ],
        waringStock: [
          { required: true, message: "请输入商品预警库存", trigger: "blur" },
          { validator: checkInt, trigger: "blur" }
        ],
        "spike.stockNum": [
          { required: true, message: "请输入秒杀商品库存", trigger: "blur" },
          { validator: valistockNum, trigger: "change" },
          { validator: checkInt, trigger: "blur" }
        ],
        "spike.waringStock": [
          {
            required: true,
            message: "请输入秒杀商品预警库存",
            trigger: "blur"
          },
          { validator: checkInt, trigger: "blur" }
        ],
        "bargain.actAmount": [
          { required: true, message: "请输入秒杀商品底价", trigger: "blur" },
          { validator: valisnum, trigger: "change" },
          { validator: valiAmount, trigger: "change" }
        ],
        "bargain.stockNum": [
          { required: true, message: "请输入砍价商品库存", trigger: "blur" },
          { validator: valistockNum, trigger: "change" },
          { validator: checkInt, trigger: "blur" }
        ],
        "bargain.waringStock": [
          {
            required: true,
            message: "请输入砍价商品预警库存",
            trigger: "blur"
          },
          { validator: checkInt, trigger: "blur" }
        ]
      },
      props: {
        value: "value",
        children: "cities"
      },
      data: {
        actGoodsSkuInVos: [
          {
            actId: "41",
            categoryId: "",
            goodsPromotionRules: {
              id: "", //.
              actAmount: "",
              ruleDesc: "邀请好友砍价",
              ruleType: "4",
              shopId: ""
            },
            id: "", //.
            isDeleted: 0, //.   0有 1无
            peopleNum: "4",
            ruleDesc: "",
            shopId: "",
            stockNum: "15",
            waringStock: "5"
          },
          {
            actId: "44",
            categoryId: "",
            goodsPromotionRules: {
              id: "", //.
              actAmount: "1.00",
              ruleDesc: "邀请好友秒杀",
              ruleType: "5",
              shopId: ""
            },
            id: "", //.
            isDeleted: 0, //.   0有 1无
            peopleNum: "2",
            ruleDesc: "",
            shopId: "",
            stockNum: "15",
            waringStock: "5"
          }
        ],
        expiryDate: "90",
        goodsSkuPics: "",
        goodsSkuSpecValue: { id: "", specValueId: "23" }, //.
        goodsSpuInVo: {
          brandId: "1",
          categoryId: "",
          goodsSpuDesc: {
            content: "",
            id: "", //.
            title: ""
          },
          goodsSpuSpec: { id: "", specId: "7" }, //.
          spuName: "",
          id: "", //.
          spuType: "10"
        },
        id: "", //.
        skuCode: "", //.
        miniNum: "1",
        sellPrice: "",
        sendType: "2",
        shopId: "",
        singleType: "1",
        skuName: "",
        skuPic: "",
        smallSkuPic: "",
        stockNum: "",
        waringStock: ""
      },
      dishdata: {},
      options: []
    };
  },
  props: {
    id: String
  },
  watch: {
    isspike: function() {
      if (!this.isspike && !this.isbargain) {
        this.isspike = !this.isspike;
        this.$message.warning("商品至少需要参加一个活动");
      }
    },
    isbargain: function() {
      if (!this.isspike && !this.isbargain) {
        this.isbargain = !this.isbargain;
        this.$message.warning("商品至少需要参加一个活动");
      }
    }
  },
  methods: {
    //获取商品数据
    getproductdetails() {
      let _Url = "app/goodsSku/selectDetailBySkuIdNew?id=" + this.id;
      this.$http.get(_Url).then(res => {
        this.dishdata = res.data.data;
        this.conversion();
      });
    },
    //数据转换
    conversion() {
      this.goods.picUrls = [];
      this.goods.goodsSkuPics = [];
      this.goods.spike.ruleDesc = [];
      this.goods.bargain.ruleDesc = [];

      this.data.id = this.dishdata.id;
      this.data.skuCode = this.dishdata.skuCode;
      this.goods.skuPic = this.dishdata.skuPic;
      this.goods.spuName = this.dishdata.skuName;
      this.goods.stockNum = this.dishdata.stockNum;
      this.goods.sellPrice = this.dishdata.sellPrice;
      this.goods.waringStock = this.dishdata.waringStock;
      this.goods.smallSkuPic = this.dishdata.smallSkuPic;
      this.data.goodsSpuInVo.id = this.dishdata.goodsSpuOut.id;
      this.goods.title = this.dishdata.goodsSpuOut.goodsSpuDesc.title;
      this.data.goodsSkuSpecValue.id =  this.dishdata.goodsSkuSpecValues[0].id;
      this.data.goodsSpuInVo.goodsSpuDesc.id = this.dishdata.goodsSpuOut.goodsSpuDesc.id;
      this.data.goodsSpuInVo.goodsSpuSpec.id = this.dishdata.goodsSpuOut.goodsSpecs[0].id;

      if (this.dishdata.goodsCategory && this.dishdata.goodsCategory.parentId) {
        this.goods.categoryId.push(this.dishdata.goodsCategory.parentId);
        this.goods.categoryId.push(this.dishdata.goodsCategory.id);
      } else {
        this.goods.categoryId.push(7);
        this.goods.categoryId.push(this.dishdata.categoryId);
      }

      if (this.dishdata.attachments && this.dishdata.attachments.length) {
        for (let i in this.dishdata.attachments) {
          let _obj = {
            url: this.dishdata.attachments[i].picUrl,
            id: this.dishdata.attachments[i].id
          };
          this.goods.goodsSkuPics.push(_obj);
        }
      }

      if (this.dishdata.goodsSpuOut.goodsSpuDesc.content.length > 0) {
        //匹配图片（g表示匹配所有结果i表示区分大小写）
        const imgReg = /<img.*?(?:>|\/>)/gi;
        //匹配src属性
        const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        let arr = this.dishdata.goodsSpuOut.goodsSpuDesc.content.match(imgReg);
        if (arr && arr.length > 0) {
          for (let i = 0; i < arr.length; i++) {
            let src = arr[i].match(srcReg);
            //获取图片地址
            if (src[1]) {
              let _obj = {
                url: src[1],
                id: ""
              };
              this.goods.picUrls.push(_obj);
            }
          }
        }
      }
      for (let i in this.dishdata.actGoodsSkuOuts) {
        if (this.dishdata.actGoodsSkuOuts[i].actId == 41) {
          this.isbargain = true;
          this.goods.bargain.id = this.dishdata.actGoodsSkuOuts[i].id;
          this.goods.bargain.ruleid = this.dishdata.actGoodsSkuOuts[
            i
          ].goodsPromotionRules.id;
          this.goods.bargain.stockNum = this.dishdata.actGoodsSkuOuts[
            i
          ].stockNum;
          this.goods.bargain.isDeleted = this.dishdata.actGoodsSkuOuts[
            i
          ].isDeleted;
          this.goods.bargain.waringStock = this.dishdata.actGoodsSkuOuts[
            i
          ].waringStock;
          this.goods.bargain.actAmount = this.dishdata.actGoodsSkuOuts[
            i
          ].goodsPromotionRules.actAmount;
          if (this.dishdata.actGoodsSkuOuts[i].ruleDesc) {
            let _arr = [];
            _arr = this.dishdata.actGoodsSkuOuts[i].ruleDesc.split("Œ");
            for (let j in _arr) {
              let _obj = { label: _arr[j] };
              this.goods.bargain.ruleDesc.push(_obj);
            }
          }
        }
        if (this.dishdata.actGoodsSkuOuts[i].actId == 44) {
          this.isspike = true;
          this.goods.spike.id = this.dishdata.actGoodsSkuOuts[i].id;
          this.goods.spike.ruleid = this.dishdata.actGoodsSkuOuts[
            i
          ].goodsPromotionRules.id;
          this.goods.spike.isDeleted = this.dishdata.actGoodsSkuOuts[
            i
          ].isDeleted;
          this.goods.spike.actAmount = this.dishdata.actGoodsSkuOuts[
            i
          ].goodsPromotionRules.actAmount;
          this.goods.spike.stockNum = this.dishdata.actGoodsSkuOuts[i].stockNum;
          this.goods.spike.waringStock = this.dishdata.actGoodsSkuOuts[
            i
          ].waringStock;
          if (this.dishdata.actGoodsSkuOuts[i].ruleDesc) {
            let _arr = [];
            _arr = this.dishdata.actGoodsSkuOuts[i].ruleDesc.split("Œ");
            for (let j in _arr) {
              let _obj = { label: _arr[j] };
              this.goods.spike.ruleDesc.push(_obj);
            }
          }
        }
      }
    },
    //获取类目列表
    getcategory() {
      this.$http
        .get(
          "app/goodsCategory/selectGoodsCategoryByShopCategoryId?shopCategoryId=1"
        )
        .then(res => {
          let _list = res.data.data,
            cate = [];
          for (let i in _list) {
            let _obj = {
              value: _list[i].goodsCategory.id,
              label: _list[i].goodsCategory.categoryName,
              cities: []
            };
            cate.push(_obj);
          }
          this.options = cate;
          let arr = [cate[0].value];
          this.handleItemChange(arr);
        });
    },
    //选中一级类目请求二级类目
    handleItemChange(val) {
      let _this = this,
        ind = 0,
        _Url = "app/goodsCategory/listByParentId?parentId=" + val[0];
      for (let n in _this.options) {
        if (val[0] == this.options[n].value) {
          ind = n;
        }
      }
      setTimeout(_ => {
        _this.$http.get(_Url).then(res => {
          let _list = res.data.data;
          for (let i in _list) {
            let _obj = {
              value: _list[i].id,
              label: _list[i].categoryName
            };
            _this.options[ind].cities.push(_obj);
          }
        });
      }, 300);
    },
    //图片类别
    changefile(val) {
      if (this.loading || this.loading2 || this.loading3) {
        this.$message("请先等待前一张图片上传完成");
      } else {
        this.filenum = val;
      }
    },
    //图片上传
    beforeAvatarUpload(file) {
      if (this.loading || this.loading2 || this.loading3) {
        this.$message("请先等待前一张图片上传完成");
        return;
      }
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
        }
        let _parms = {
          file: file,
          userName: "userName"
        };
        this.$http.post("img/uploadMp4", _parms).then(res => {
          if (this.filenum == 1) {
            this.loading = false;
            this.goods.skuPic = res.data.data.picUrl;
            this.goods.smallSkuPic = res.data.data.smallPicUrl;
          } else if (this.filenum == 2) {
            let _obj = {
              url: res.data.data.picUrl,
              id: res.data.data.id
            };
            this.goods.goodsSkuPics.push(_obj);
            this.loading2 = false;
          } else if (this.filenum == 3) {
            let _obj = {
              url: res.data.data.picUrl,
              id: res.data.data.id
            };
            this.goods.picUrls.push(_obj);
            this.loading3 = false;
          }
        });
      }
    },
    //删除某张图片
    handdel(val, ind) {
      if (val == 1) {
        this.goods.goodsSkuPics.splice(ind, 1);
      } else if (val == 2) {
        this.goods.picUrls.splice(ind, 1);
      }
    },
    //添加使用规则
    addrule(val) {
      let _obj = { label: "" };
      if (val == 1) {
        if (this.goods.spike.ruleDesc.length > 0) {
          if (
            this.goods.spike.ruleDesc[this.goods.spike.ruleDesc.length - 1]
              .label
          ) {
            this.goods.spike.ruleDesc.push(_obj);
          } else {
            this.$message("请先完善上一条规则");
          }
        } else {
          this.goods.spike.ruleDesc.push(_obj);
        }
      } else {
        if (this.goods.bargain.ruleDesc.length > 0) {
          if (
            this.goods.bargain.ruleDesc[this.goods.bargain.ruleDesc.length - 1]
              .label
          ) {
            this.goods.bargain.ruleDesc.push(_obj);
          } else {
            this.$message("请先完善上一条规则");
          }
        } else {
          this.goods.bargain.ruleDesc.push(_obj);
        }
      }
    },
    //删除某行使用规则
    delrule(val, ind) {
      if (val == 1) {
        this.goods.spike.ruleDesc.splice(ind, 1);
      } else if (val == 2) {
        this.goods.bargain.ruleDesc.splice(ind, 1);
      }
    },
    //提交前校验
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message.success("校验通过！");
          this.datatransform();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$emit("closedia");
      return;
      this.$refs[formName].resetFields();
    },
    //数据转换
    datatransform() {
      let _goodsSkuPics = "",
        _content = "",
        _picUrl = "",
        _spirule = "",
        _barrule = "",
        _Url = "";
      
      if (this.goods.goodsSkuPics && this.goods.goodsSkuPics.length > 0) {
        for (let i in this.goods.goodsSkuPics) {
          _goodsSkuPics += this.goods.goodsSkuPics[i].id + ",";
        }
        _goodsSkuPics = _goodsSkuPics.substring(0, _goodsSkuPics.length - 1);
      }
      _content += "<p>" + this.goods.title + "</p>";
      if (this.goods.picUrls && this.goods.picUrls.length > 0) {
        for (let i in this.goods.picUrls) {
          let _img = '<img src="' + this.goods.picUrls[i].url + '">';
          _picUrl += _img;
        }
      }
      _content += _picUrl;

      if (this.goods.spike.ruleDesc.length > 0) {
        for (let i in this.goods.spike.ruleDesc) {
          if (this.goods.spike.ruleDesc[i].label) {
            _spirule += this.goods.spike.ruleDesc[i].label + "Œ";
          }
        }
        _spirule = _spirule.substring(0, _spirule.length - 1);
      }

      if (this.goods.bargain.ruleDesc.length > 0) {
        for (let i in this.goods.bargain.ruleDesc) {
          if (this.goods.bargain.ruleDesc[i].label) {
            _barrule += this.goods.bargain.ruleDesc[i].label + "Œ";
          }
        }
        _barrule = _barrule.substring(0, _barrule.length - 1);
      }
      this.data.goodsSkuPics = _goodsSkuPics;
      this.data.sellPrice = this.goods.sellPrice;
      this.data.shopId = this.$store.state.shopInfo.id;
      this.data.skuName = this.goods.spuName;
      this.data.skuPic = this.goods.skuPic;
      this.data.smallSkuPic = this.goods.smallSkuPic;
      this.data.stockNum = this.goods.stockNum;
      this.data.waringStock = this.goods.waringStock;
      this.data.goodsSpuInVo.categoryId = this.goods.categoryId[1];
      this.data.goodsSpuInVo.spuName = this.goods.spuName;
      this.data.goodsSpuInVo.goodsSpuDesc.title = this.goods.title;
      this.data.goodsSpuInVo.goodsSpuDesc.content = _content;

      if(!this.data.id){
        delete this.data.id;
      }
      if(!this.data.skuCode){
        delete this.data.skuCode;
      }
      if(!this.data.goodsSpuInVo.id){
        delete this.data.goodsSpuInVo.id;
      }
      if(!this.data.goodsSkuSpecValue.id){
        delete this.data.goodsSkuSpecValue.id;
      }
      if(!this.data.goodsSpuInVo.goodsSpuDesc.id){
        delete this.data.goodsSpuInVo.goodsSpuDesc.id;
      }
      if(!this.data.goodsSpuInVo.goodsSpuSpec.id){
        delete this.data.goodsSpuInVo.goodsSpuSpec.id;
      }

      for (let i in this.data.actGoodsSkuInVos) {
        this.data.actGoodsSkuInVos[i].categoryId = this.goods.categoryId[1];
        this.data.actGoodsSkuInVos[i].shopId = this.$store.state.shopInfo.id;
        this.data.actGoodsSkuInVos[
          i
        ].goodsPromotionRules.shopId = this.$store.state.shopInfo.id;
        
        
        if (this.data.actGoodsSkuInVos[i].actId == 41) {
          this.data.actGoodsSkuInVos[i].ruleDesc = _barrule;
          this.data.actGoodsSkuInVos[i].stockNum = this.goods.bargain.stockNum;
          this.data.actGoodsSkuInVos[i].waringStock = this.goods.bargain.waringStock;
          this.data.actGoodsSkuInVos[i].goodsPromotionRules.actAmount = this.goods.bargain.actAmount;
          if (this.goods.bargain.id) {
            this.data.actGoodsSkuInVos[i].id = this.goods.bargain.id;
            this.data.actGoodsSkuInVos[
              i
            ].goodsPromotionRules.id = this.goods.bargain.ruleid;
            if (this.isbargain) {
              this.data.actGoodsSkuInVos[i].isDeleted = 0;
            } else {
              this.data.actGoodsSkuInVos[i].isDeleted = 1;
            }
          } else {
            if (this.isbargain) {
              delete this.data.actGoodsSkuInVos[i].id;
              delete this.data.actGoodsSkuInVos[i].goodsPromotionRules.id;
              delete this.data.actGoodsSkuInVos[i].isDeleted;
            } else {
              delete this.data.actGoodsSkuInVos[i];
            }
          }
        }
        if (this.data.actGoodsSkuInVos[i].actId == 44) {
          this.data.actGoodsSkuInVos[i].ruleDesc = _spirule;
          this.data.actGoodsSkuInVos[i].stockNum = this.goods.spike.stockNum;
          this.data.actGoodsSkuInVos[
            i
          ].waringStock = this.goods.spike.waringStock;
          if (this.goods.spike.id) {
            this.data.actGoodsSkuInVos[i].id = this.goods.spike.id;
            this.data.actGoodsSkuInVos[
              i
            ].goodsPromotionRules.id = this.goods.spike.ruleid;
            if (this.isspike) {
              this.data.actGoodsSkuInVos[i].isDeleted = 0;
            } else {
              this.data.actGoodsSkuInVos[i].isDeleted = 1;
            }
          } else {
            if (this.isspike) {
              delete this.data.actGoodsSkuInVos[i].id;
              delete this.data.actGoodsSkuInVos[i].goodsPromotionRules.id;
              delete this.data.actGoodsSkuInVos[i].isDeleted;
            } else {
              delete this.data.actGoodsSkuInVos[i];
            }
          }
        }
      }

      this.data.json = "json";
      if (this.id) {
        _Url = "app/goodsSku/updateGoodsSkuAndAct";
      } else {
        _Url = "app/goodsSku/addGoodsSkuAndAct";
      }
      this.$http.post(_Url, this.data).then(res => {
        this.$message.success("编辑商品成功!");
        if (this.id) {
          this.$emit("closedia");
        } else {
          this.resetForm("goods");
        }
      });
    }
  },
  created() {
    this.getcategory();
    if(this.id){
        this.getproductdetails();
      }
  }
};
</script>
<style lang="less">
.upload {
  width: 98%;
  height: 98%;
  padding: 1%;
  max-height: 700px;
  overflow-y: auto;
  margin: 0 auto;
  background: #fff;
  .el-form-item__label {
    color: #409eff;
  }
  .el-form-item__content {
    width: 80%;
    display: flex;
    justify-content: flex-start;
    .el-input-group__append {
      font-size: 30px;
      cursor: pointer;
    }
    .el-input-group__append:hover {
      color: #409eff;
    }
    .el-icon-delete:hover {
      color: #409eff;
    }
    .desc {
      width: 100%;
      .el-input {
        margin-bottom: 5px;
      }
    }
    .imgbox {
      width: 160px;
      height: 150px;
      float: left;
      margin-right: 10px;
      border-radius: 16px;
      position: relative;
      .el-icon-delete {
        font-size: 30px;
        position: relative;
        right: -53px;
        top: -162px;
        cursor: pointer;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 16px;
      }
    }
    .uploadbox {
      width: 160px;
      height: 150px;
      float: left;
      border: 1px solid #409eff;
      border-radius: 16px;
      position: relative;
      .avatar-uploader {
        width: 100%;
        height: 100%;
        border-radius: 5px;
        .avatar-uploader-icon {
          font-size: 100px;
          line-height: 150px;
          text-align: center;
        }
      }
      img {
        width: 100%;
        height: 150px;
        border-radius: 16px;
      }
      .legend {
        position: relative;
        top: -42px;
        margin: 0 auto;
        text-align: center;
        background: #bebebe;
        color: #fff;
        border-radius: 0 0 5px 5px;
        opacity: 0.9;
      }
    }
  }
}
</style>
