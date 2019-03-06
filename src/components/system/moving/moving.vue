<template>
  <div class="moving">
    <div class="movtop">
      <el-button
        v-for="item in navlist"
        type="primary"
        :key="item.id"
        :plain="navid==item.id?false:true"
        @click="handtab(item.id)"
      >{{item.lable}}</el-button>
    </div>
    <div class="movcont" :style="contentHeight">
      <div
        class="contli"
        v-for="(item,index) in topiclist"
        :key="index"
        @click="handtopicitem(item.id)"
      >
        <img class="coverimg" :src="item.homePic" alt="封面图片">
        <img class="play" src="../../../assets/images/Play.png" alt="播放" v-show="item.topicType==2">
        <div class="title">{{item.title}}</div>
        <div class="summary">{{item.summary}}</div>
        <div class="about">
          <span>
            <img class="iconUrlimg" :src="item.iconUrl" alt="头像">
            {{item.nickName}}
          </span>
          <span>
            <img class="icon" src="../../../assets/images/readicon.png" alt="阅读量">
            {{item.hitNum}}&nbsp;&nbsp;
            <img
              class="icon"
              src="../../../assets/images/likeicon.png"
              alt="点赞量"
            >
            {{item.zan}}
          </span>
        </div>
      </div>
    </div>
    <el-dialog
      title="编辑动态"
      :visible.sync="dialogTableVisible"
      :modal-append-to-body="false"
      width="80%"
      top="2%"
    >
      <div class="dia" :style="contentHeight">
        <el-switch
          style="display: block"
          v-model="isarticle"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="文章"
          inactive-text="视频"
        ></el-switch>
        <div class="diaedit">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item :label="isarticle?'文章标题':'视频标题'" prop="title">
              <el-input v-model="ruleForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
          </el-form>
          <div class="edit_container">
            <quill-editor
              v-model="content"
              ref="myQuillEditor"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)"
            ></quill-editor>
            <el-button  type="primary" @click="saveHtml">保存</el-button>
            <el-button  type="primary" @click="cancelHtml">保存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import * as Quill from "quill"; //引入编辑器
export default {
  name: "moving",
  data() {
    return {
      navid: 0,
      page: 1,
      vodeoid: "",
      content: "",
      isarticle: true,
      dialogTableVisible: false,
      editorOption: {},
      ruleForm: {
        title: ""
      },
      contentHeight: {
        height: ""
      },
      topiclist: [],
      navlist: [
        {
          lable: "全部",
          id: 0
        },
        {
          lable: "视频",
          id: 2
        },
        {
          lable: "文章",
          id: 1
        },
        {
          lable: "新增",
          id: 3
        }
      ],
      rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
          ]
      }
    };
  },
  watch:{
    dialogTableVisible:function(){
      if(!this.dialogTableVisible){
        this.ruleForm.title="";
        this.content=""
      }
    }
  },
  methods: {
    //切换tab
    handtab(val) {
      this.navid = val;
      if (val == 3) {
        this.dialogTableVisible = !this.dialogTableVisible;
      } else {
        this.gettopiclist();
      }
    },
    //点击播放视频
    handtopicitem(val) {
      this.vodeoid = val;
      console.log("vodeoid:", this.vodeoid);
    },
    //获取高度
    getHeight() {
      this.contentHeight.height = window.innerHeight - 220 + "px";
    },
    //获取动态列表 topicType=2 视频
    gettopiclist() {
      let _Url =
        "app/topic/myList?shopId=" +
        this.$store.state.shopInfo.id +
        "&page=" +
        this.page +
        "&rows=18";
      if (this.navid == 1 || this.navid == 2) {
        _Url += "&topicType=" + this.navid;
      }
      this.$http.get(_Url).then(res => {
        this.topiclist = res.data.data.list;
      });
    },
    onEditorReady(editor) {
      // 准备编辑器
    },
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件
    saveHtml: function(event) {
      console.log(this.content);
      this.submitForm("ruleForm");
    },
    cancelHtml(){
      this.dialogTableVisible=!this.dialogTableVisible;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  created() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
    this.gettopiclist();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  }
};
</script>

<style lang="less">
.moving {
  width: 98%;
  padding: 1%;
  .movtop {
    text-align: left;
    margin: 5px 0 14px 0;
  }
  .movcont {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    overflow-y: auto;
    background: #fff;
    .contli {
      width: 24%;
      min-width: 235px;
      margin: 0.4%;
      position: relative;
      cursor: pointer;
      .title {
        position: absolute;
        padding: 1px 3px;
        top: 5px;
        left: 5px;
        color: #fff;
        background: #1b435d;
      }
      .summary {
        background: #ccc;
        border-bottom: 1px solid #fff123;
      }
      .play {
        position: absolute;
        padding: 5%;
        top: 50px;
        left: 150px;
        width: 50px;
        height: 50px;
        background: #44515f;
        opacity: 0.7;
        border-radius: 50%;
      }
      .coverimg {
        width: 100%;
        max-height: 200px;
      }
      .about {
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #ccc;
        span {
          line-height: 20px;
        }
        .icon {
          width: 20px;
          height: 20px;
        }
      }
      .iconUrlimg {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
  }
  .dia {
    overflow-y: auto;
    .el-switch{
      margin-bottom: 14px;
    }
    .quill-editor{
      margin-bottom: 20px;
    }
    .ql-container{
      height: 500px;
      overflow-y: auto;
    }
  }
}
</style>
