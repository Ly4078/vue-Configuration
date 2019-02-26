<template>
  <div class="pulMap">
    <div style="margin: 15px 0;">
      <el-input
        placeholder="输入地址查询(城市名+详细地址,如武汉关山大道456号)"
        v-model="address"
        @keyup.enter.native="Inquire"
      >
      </el-input>
      <el-button @click="Inquire">查询</el-button>
    </div>
    <div id="Maptab" class="container">腾讯地图加载中。。。</div>
  </div>
</template>
 

<script>
var geocoder,
  map,
  marker = null;
var markersArray = [];
export default {
  name: "Maptab",
  data() {
    return {
      locationObj: {},
      longitude: 0, //经度
      latitude: 0, //纬度
      address: "", //地址
      city: ""
    };
  },
  mounted() {
    // this.init();
    this.getMyLocation();
  },
  methods: {
    //定位获得当前位置信息
    getMyLocation() {
      var geolocation = new qq.maps.Geolocation(
        "4UTBZ-CN33F-HH7J6-NUU44-J7XT3-MCBB3",
        "MYkey"
      );
      geolocation.getIpLocation(this.showPosition, this.showErr);
    },
    showPosition(position) {
      this.latitude = position.lat;
      this.longitude = position.lng;
      this.city = position.city;
      this.setMap(position.lat, position.lng);
      var latLng = new qq.maps.LatLng(position.lat, position.lng);
      this.getAddress(latLng);
    },
    showErr() {
      this.getMyLocation(); //定位失败再请求定位，测试使用
    },

    setMap(lat, lng) {
      const _this = this;
      //步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
      //设置地图中心点
      var myLatlng = new qq.maps.LatLng(lat, lng);
      //定义工厂模式函数
      var myOptions = {
        zoom: 13, //设置地图缩放级别
        center: myLatlng, //设置中心点样式
        mapTypeId: qq.maps.MapTypeId.ROADMAP //设置地图样式详情参见MapType
      };
      //地址和经纬度之间进行转换服务
      geocoder = new qq.maps.Geocoder();

      //获取dom元素添加地图信息
      map = new qq.maps.Map(document.getElementById("Maptab"), myOptions);
      //生成默认中心点标注
      _this.clearOverlays();
      marker = new qq.maps.Marker({
        position: myLatlng,
        draggable: true,
        map: map
      });
      markersArray.push(marker);

      //点击修改标注位置，获取位置经纬度
      qq.maps.event.addListener(map, "click", function(event) {
        _this.clearOverlays();
        _this.getAddress(event.latLng);
        //新建标注
        marker = new qq.maps.Marker({
          position: event.latLng,
          draggable: true,
          map: map
        });
        markersArray.push(marker);
        //设置Marker停止拖动事件
        qq.maps.event.addListener(marker, "dragend", function(event) {
          _this.getAddress(event.latLng);
        });
      });
    },
    //通过详细地址查询  地址转经纬度
    Inquire() {
      const _this = this;
      geocoder.getLocation(this.address);
      geocoder = new qq.maps.Geocoder({
        //设置服务请求成功的回调函数
        complete: function(result) {
          _this.locationObj = result.detail;
          _this.longitude = result.detail.location.lng; //经度
          _this.latitude = result.detail.location.lat; //纬度
          _this.returnData();
          let _address = result.detail.addressComponents;
          let _town = _address.town ? _address.town : "";
          _this.address =
            _address.country +
            _address.province +
            _address.city +
            _address.district +
            _address.street +
            _town;
          _this.clearOverlays();
          map.setCenter(result.detail.location);
          marker = new qq.maps.Marker({
            map: map,
            draggable: true,
            position: result.detail.location
          });
          markersArray.push(marker);
          //设置Marker停止拖动事件
          qq.maps.event.addListener(marker, "dragend", function(event) {
            _this.getAddress(event.latLng);
          });
        },
        //若服务请求失败，则运行以下函数
        error: function() {
          alert("出错了，请重新输入，注意是城市名+地址（如：武汉光谷广场）");
        }
      });
    },
    //反地址查询  经纬度转地址
    getAddress(location) {
      const _this = this;
      _this.longitude = location.lng; //经度
      _this.latitude = location.lat; //纬度
      geocoder.getAddress(location);
      //设置服务请求成功的回调函数
      geocoder.setComplete(function(result) {
        _this.locationObj = result.detail;
        _this.returnData();
        _this.clearOverlays();
        map.setCenter(result.detail.location);
        let _address = result.detail.addressComponents;
        let _town = _address.town ? _address.town : "";
        _this.address =
          _address.country +
          _address.province +
          _address.city +
          _address.district +
          _address.street +
          _town;
        marker = new qq.maps.Marker({
          map: map,
          draggable: true,
          position: result.detail.location
        });
        markersArray.push(marker);
        //设置Marker停止拖动事件
        qq.maps.event.addListener(marker, "dragend", function(event) {
          _this.getAddress(event.latLng);
        });
      });
      //若服务请求失败，则运行以下函数
      geocoder.setError(function() {
        alert("出错了，请输入正确的经纬度！！！");
      });
    },
    //清除标注
    clearOverlays() {
      if (markersArray.length > 0) {
        if (markersArray) {
          for (let i in markersArray) {
            markersArray[i].setMap(null);
          }
        }
      }
    },
    returnData() {
        console.log("locationObj:",this.locationObj)
        // this.$emit("getMapdata:",'this.locationObj');
        this.$emit('getMapdata',this.locationObj);
    }
  }
};
</script>
<style lang="less">
.pulMap {
  .container {
    width: 100%;
    height: 700px;
    z-index: 300;
    border: 1px solid #409eff;
  }
  .el-input-group__append {
    cursor: pointer;
  }
}
</style>
