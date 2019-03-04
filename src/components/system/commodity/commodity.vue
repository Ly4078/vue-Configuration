<template>
  <div class="commodity">
    <div class="martop">
      <el-button
        type="success"
        v-for="item in typelist"
        :key="item.id"
        :plain="status==item.id?false:true"
        @click="handtab(item.id)"
      >{{item.label}}</el-button>
    </div>
    <div class="commcont" v-show="status==1 || status==2">
      <el-table v-loading="loading" :height="this.$store.state.tableHeight" :data="goddslist" border style="width: 100%">
        <el-table-column prop="skuName" align="center" label="商品名称"></el-table-column>
        <el-table-column align="center" label="商品图片">
          <template slot-scope="scope">
            <img class="tickimg" :src="scope.row.skuPic" alt>
          </template>
        </el-table-column>
        <el-table-column align="center" label="现价">
          <template slot-scope="scope">{{scope.row.newamout | filtersPrice}}</template>
        </el-table-column>
        <el-table-column align="center" label="原价">
          <template slot-scope="scope">{{scope.row.sellPrice | filtersPrice}}</template>
        </el-table-column>
        <el-table-column prop="newstornum" align="center" label="库存"></el-table-column>
        <el-table-column prop="newstornum" align="center" label="销量"></el-table-column>
        <el-table-column align="center" label="活动">
          <template slot-scope="scope">
            <el-tag v-for="(item,index) in scope.row.actNamess" :key="index">{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handedit(scope.row)" type="primary" size="small">编辑</el-button>
            <el-button
              @click="handlestand(scope.row)"
              type="primary"
              size="small"
            >{{status==1?'下架':'上架'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span class="pagein">
        <el-pagination
          v-show="total>10"
          layout="prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </span>
    </div>
    <div class="commcont" v-show="status==3" v-bind:style="{height: this.$store.state.tableHeight}">
      <div class="child">
        <Upload/>
      </div>
    </div>
    <el-dialog title="编辑商品" :visible.sync="dialogTableVisible" :modal-append-to-body="false" width="80%" top="2%">
      <div class="child" v-if="dialogTableVisible">
        <Upload :id="id" v-on:closedia="closedia"/>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Upload from "@/components/public/upload";
export default {
  name: "commodity",
  data() {
    return {
      id:"",
      page: 1,
      total: 0,
      status: 1,
      loading: false,
      dialogTableVisible:false,
      typelist: [
        {
          label: "出售中商品",
          id: 1
        },
        {
          label: "已下架商品",
          id: 2
        },
        {
          label: "新增商品",
          id: 3
        }
      ],
      goddslist: []
    };
  },
  components: {
    Upload
  },
  watch: {
    status: function() {
      if (this.status == 1 || this.status == 2) {
        this.page = 1;
        this.getgoods();
      }
    }
  },
  filters: {
    filtersPrice(val) {
      if (val) {
        return "￥" + val;
      }
    }
  },
  methods: {
    //切换tab
    handtab(val) {
      this.status = val;
    },
    //获取 出售中/已下架 商品
    getgoods() {
      this.loading = true;
      this.$http
        .get(
          "app/goodsSku/listNew?page=" +
            this.page +
            "&rows=10&spuType=10&status=" +
            this.status +
            "&shopId=" +
            this.$store.state.shopInfo.id
        )
        .then(res => {
          let _list = res.data.data.list;
          this.total = res.data.data.total;
          if (_list.length > 0) {
            for (let i in _list) {
              if (_list[i].actGoodsSkuOuts && _list[i].actGoodsSkuOuts.length) {
                let _outs = _list[i].actGoodsSkuOuts;
                _list[i].actNamess = [];
                _list[i].newstornum = 0;
                for (let j in _list[i].actGoodsSkuOuts) {
                  if (
                    _list[i].actGoodsSkuOuts[j].actId == 41 &&
                    _list[i].actGoodsSkuOuts[j].actInfo.type == 4
                  ) {
                    _list[i].newamout =
                      _list[i].actGoodsSkuOuts[j].goodsPromotionRules.actAmount;
                    break;
                  } else {
                    _list[i].newamout =
                      _list[i].actGoodsSkuOuts[j].goodsPromotionRules.actAmount;
                  }
                }
                for (let j in _list[i].actGoodsSkuOuts) {
                  _list[i].newstornum += _list[i].actGoodsSkuOuts[j].stockNum;
                  _list[i].actNamess.push(
                    _list[i].actGoodsSkuOuts[j].actInfo.actName
                  );
                }
              }
            }
          }
          this.loading = false;
          this.goddslist = _list;
        });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getgoods();
    },
    // 编辑某行商品
    handedit(val) {
      this.id=val.id;
      this.closedia();
    },
    //开启、关闭模态框
    closedia(){
      this.dialogTableVisible=!this.dialogTableVisible;
      if(!this.dialogTableVisible){
        this.id="";
        this.getgoods();
      }
    },
    //上架/下架 商品
    handlestand(val) {
      let _status = 1,
        _Url = "",
        _parms = {};
      if (this.status == 1) {
        _status = 2;
      } else if (status == 2) {
        _status = 1;
      }
      _parms = {
        id: val.id,
        status: _status
      };
      this.$http.post("app/goodsSku/update", _parms).then(res => {
        this.$message.success("操作成功！");
        this.getgoods();
      });
    }
  },
  created() {
    this.getgoods();
  }
};
</script>
<style lang="less">
.commodity {
  width: 98%;
  padding: 1%;
  .martop {
    text-align: left;
    margin-bottom: 14px;
  }
  .commcont {
    overflow-y: auto;
    .tickimg {
      width: 80px;
      height: 80px;
      border-radius: 10px;
    }
    .cell {
      .el-tag {
        margin-right: 14px;
      }
    }
  }
  .pagein {
    margin-top: 10px;
    margin-left: 10px;
    float: right;
  }
}
</style>
