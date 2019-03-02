<template>
  <div class="marketing">
    <div class="martop">
      <el-button
        type="success"
        v-for="item in typelist"
        :key="item.id"
        :plain="status==item.id?false:true"
        @click="handtab(item.id)"
      >{{item.label}}</el-button>
    </div>
    <div class="marcont" v-show="status ==1">
      <el-button type="primary" @click="handadd">新增享七券</el-button>
      <el-table v-loading="loading" height="700" :data="voucher" border style="width: 100%">
        <el-table-column prop="goodsSkuCode" align="center" label="编号"></el-table-column>
        <el-table-column prop="goodsSkuName" align="center" label="名称"></el-table-column>
        <el-table-column prop="ruleDesc" align="center" label="说明"></el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime | filtercreateTime}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handledel(scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="marcont" v-show="status ==2">
      <div class="contleft">
        <ul>
          <li v-for="item in actlist" :key="item.id">
            <img :src="item.mainPic" alt>
            <div class="actcont">
              <div class="actName">{{item.actName}}</div>
              <div class="date">活动时间：{{item.startTime}}至{{item.endTime}}</div>
              <div
                :class="item.isAdd==1?'actsign yessign':'actsign nosign'"
              >{{item.isAdd==1?'已报名':'报名'}}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="contright">
          <div class="rtop">主题:{{itemobj.actName}}</div>
          <div class="rdate">活动时间:：{{itemobj.startTime}}至{{itemobj.endTime}}</div>
          <div class="rclaim">
              <div class="cltitle">店铺参与要求</div>
              <div class="clcont">{{itemobj.applyRules}}</div>
          </div>
          <div class="rclaim">
              <div class="cltitle">活动详情</div>
              <div class="clcont">{{itemobj.actDesc}}</div>
          </div>
          <div>
              <div class="cltitle">添加商圈</div>
          </div>
          <div>
              <div class="cltitle">报名商品</div>
          </div>
      </div>
    </div>

    <el-dialog
      :title="isadd?'新增享七券':'编辑享七券'"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :modal-append-to-body="false"
    >
      <div class="diavou">
        <span>满</span>
        <el-input v-model.number="manAmount" placeholder="请输入满额"></el-input>
        <span>减</span>
        <el-select v-model="jianAmount" placeholder="请选择减速额">
          <el-option
            v-for="item in vouchertype"
            :key="item.id"
            :label="item.costPrice"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" v-loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "marketing",
  data() {
    return {
      page: 1,
      status: 1,
      manAmount: "",
      jianAmount: "",
      jianobj: {},
      itemobj:{},
      isadd: true,
      loading: false,
      dialogVisible: false,
      voucher: [],
      actlist: [],
      vouchertype: [],
      typelist: [
        {
          label: "享七券",
          id: 1
        },
        {
          label: "活动",
          id: 2
        }
      ]
    };
  },
  watch: {
    dialogVisible: function() {
      if (!this.dialogVisible) {
        this.manAmount = "";
        this.jianAmount = "";
        this.jianobj = {};
      }
    },
    jianAmount: function() {
      for (let i in this.vouchertype) {
        if (this.jianAmount == this.vouchertype[i].id) {
          this.jianobj = this.vouchertype[i];
        }
      }
    }
  },
  filters: {
    filtercreateTime(val) {
      let unixtimestamp = new Date(val);
      let year = 1900 + unixtimestamp.getYear();
      let month = "0" + (unixtimestamp.getMonth() + 1);
      let date = "0" + unixtimestamp.getDate();
      let hour = "0" + unixtimestamp.getHours();
      let minute = "0" + unixtimestamp.getMinutes();
      let second = "0" + unixtimestamp.getSeconds();
      let _data =
        year +
        "-" +
        month.substring(month.length - 2, month.length) +
        "-" +
        date.substring(date.length - 2, date.length) +
        " " +
        hour.substring(hour.length - 2, hour.length) +
        ":" +
        minute.substring(minute.length - 2, minute.length) +
        ":" +
        second.substring(second.length - 2, second.length);
      return _data;
    }
  },
  methods: {
    //切换tab
    handtab(val) {
      this.status = val;
      this.page = 1;
      if (val == 1) {
        this.getvoucherlist();
      } else if (val == 2) {
        this.getactlist();
      }
    },

    //获取券列表
    getvoucherlist() {
      this.loading = true;
      this.$http
        .get(
          "pnr/selectByShopIdNew?shopId=" +
            this.$store.state.shopInfo.id +
            "&rows=11&page=" +
            this.page
        )
        .then(res => {
          this.voucher = res.data.data;
          this.loading = false;
        });
    },
    //点击删除某条数据
    handledel(val) {
      console.log(val);
      this.$confirm("是否确定删除此条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let _Url = "app/pnr/deleteByIdNew/" + val.id;
          this.$http.get(_Url).then(res => {
            this.$message.success("删除操作成功！");
            this.getvoucherlist();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //点击新增享七券
    handadd() {
      this.dialogVisible = !this.dialogVisible;
      this.isadd = true;
      this.getvouchertype();
    },
    //获取券类型
    getvouchertype() {
      if (this.vouchertype.length < 1) {
        this.$http
          .get(
            "app/goodsSku/listNew?page=1&rows=30&spuType=10&status=1&categoryId=12"
          )
          .then(res => {
            this.vouchertype = res.data.data.list;
          });
      }
    },
    //提交修改
    submit() {
      let reg = /^[0-9]*$/,
        _parms = {};

      if (!reg.test(this.manAmount)) {
        this.$message.error("满额请输入数字");
        this.manAmount = "";
      } else {
        if (this.manAmount < this.jianobj.costPrice) {
          this.$message.error("满额数字应该大于减额数字");
        } else {
          _parms = {
            goodsSkuId: this.jianobj.id,
            goodsSkuCode: this.jianobj.skuCode,
            goodsSkuName: this.jianobj.skuName,
            ruleType: 1,
            ruleDesc:
              "满" + this.manAmount + "减" + this.jianobj.costPrice + "元",
            shopId: this.$store.state.shopInfo.id,
            jianAmount: this.jianobj.costPrice,
            manAmount: this.manAmount
          };
          if (!this.loading) {
            this.loading = true;
            this.$http.post("app/pnr/addNew", _parms).then(res => {
              this.$message.success("操作成功！");
              this.dialogVisible = !this.dialogVisible;
              this.loading = false;
              this.getvoucherlist();
            });
          }
        }
      }
    },
    //关闭模态框
    handleClose() {
      this.dialogVisible = !this.dialogVisible;
    },
    //获取活动列表
    getactlist() {
      this.$http
        .get("app/act/list?type=0&shopId="+this.$store.state.shopInfo.id+"&page=1&rows=10")
        .then(res => {
          this.actlist = res.data.data.list;
          if(this.actlist.length>0){
              this.itemobj=this.actlist[0];
          }
          console.log("actlist:", this.actlist);
        });
    }
  },
  created() {
    this.getvoucherlist();
  }
};
</script>
<style lang="less">
.marketing {
  width: 98%;
  height: 96%;
  padding: 1%;
  .martop {
    text-align: left;
    margin-bottom: 14px;
  }
  .marcont {
    text-align: left;
    height: 92%;
    .contleft {
      min-width: 400px;
      width: 25%;
      height: 100%;
      float: left;
      ul {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        li {
          width: 100%;
          height: 150px;
          position: relative;
          border-radius: 10px;
          img {
            width: 100%;
            height: 100%;
             border-radius: 10px;
          }
          .actcont {
            border-radius: 10px;
            cursor: pointer;
            position: relative;
            top: -155px;
            width: 100%;
            height: 100%;
            color: #fff;
            background-color: rgba(
              0,
              0,
              0,
              0.5
            ); /* IE9、标准浏览器、IE6和部分IE7内核的浏览器(如QQ浏览器)会读懂 */
            
            .actName{
                font-size: 24px;
                padding: 16px;
            }
            .date{
                font-size: 18px;
                padding-left: 16px;
            }
            .actsign{
                float: right;
                margin-top: 10px;
                margin-right: 40px;
                padding: 5px 10px;
                border-radius: 12px;
                border:1px solid #409EFF;
            }
            .nosign{
                background: #F56C6C;
            }
            .yessign{
                background: #909399;
            }
          }
          @media \0screen\,screen\9 {
            /* 只支持IE6、7、8 */
            .actcont {
              background-color: #000;
              filter: Alpha(opacity=50);
              position: static; /* IE6、7、8只能设置position:static(默认属性) ，否则会导致子元素继承Alpha值 */
              *zoom: 1; /* 激活IE6、7的haslayout属性，让它读懂Alpha */
            }
            .actcont>div{
              position: relative; /* 设置子元素为相对定位，可让子元素不继承Alpha值 */
            }
          }
        }
      }
    }
    .contright{
        width: 74%;
        float: right;
        height: 100%;
        overflow-y: auto;
        &>div{
            background: #fff;
            color: #409EFF;
            padding: 1%;
            width: 98%;
            margin-bottom: 10px;
        }
    }
  }
  .diavou {
    .el-input {
      width: 30%;
    }
    .el-select {
      .el-input {
        width: 100%;
      }
    }
  }
}
</style>
