<template>
  <div class="wallet">
    <div class="walltop">
      <div class="topli" v-for="item in navlist" :key="item.id">
        <span>{{item.label}}</span>
        <span>{{item.amount | filterAmout}}</span>
        <el-button
          type="primary"
          :plain="navid==item.id?false:true"
          @click="handtab(item.id)"
        >{{item.buttext}}</el-button>
      </div>
    </div>
    <div class="callcont">
      <el-table
        v-loading="loading"
        :height="this.$store.state.tableHeight"
        :data="voucher"
        border
        style="width: 100%"
      ></el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "wallet",
  data() {
    return {
      navid: 1,
      loading: false,
      voucher: [],
      navlist: [
        {
          label: "钱包余额（元）",
          amount: "0",
          buttext: "钱包明细",
          id: 1
        },
        {
          label: "可提现金额（元）",
          amount: "0",
          buttext: "提现",
          id: 2
        },
        {
          label: "应缴服务费（元）",
          amount: "61.8",
          buttext: "缴纳服务费",
          id: 3
        }
      ]
    };
  },
  filters: {
    filterAmout(val) {
      if (val) {
        return "￥" + val;
      }
    }
  },
  methods: {
    init() {
      this.getbalanceAmount();
      this.getwithdrawAmout();
    },
    //切换tab
    handtab(val) {
      this.navid = val;
    },
    //获取钱包余额
    getbalanceAmount() {
      const _Url =
        "app/account/balance?userId=" + this.$store.state.userInfo.id;
      this.$http.get(_Url).then(res => {
        console.log("balance:", res.data.data);
        this.navlist[0].amount = res.data.data;
      });
    },
    //获取可提现金额
    getwithdrawAmout() {
        let _endTime = this.gettoday("/")
      const _Url =
          "app/so/totalAmount?soStatus=2&isDui=0&shopId=" +
          this.$store.state.userInfo.shopId +
          "&beginTime=2018/01/01&endTime=" +
          _endTime;
        this.$http.get(_Url).then(res => {
          this.navlist[1].amount = res.data.data;
        });
    },
    gettoday(val){
        let myDate = new Date();
      let _year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
      let _month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
      let _day = myDate.getDate(); //获取当前日(1-31)
      let _endTime = _year + val+ _month +val + _day;
      return _endTime;
    }
  },
  created() {
    this.init();
  }
};
</script>
<style lang="less">
.wallet {
  width: 98%;
  padding: 1%;
  .walltop {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    background: #f7f7f7;
    border: 1px solid #ccc;
    padding: 10px 0;
    margin-bottom: 10px;
    .topli {
      width: 33%;
      span:nth-child(2) {
        font-size: 28px;
        color: #ed4343;
        margin-right: 10px;
      }
    }
  }
}
</style>
