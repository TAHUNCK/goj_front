<template>
  <div ref="box" class="box">
    <div class="left">
      <el-header class="editor-header">
        <el-button style="border: 1px solid #000;color: #000;" @click="back">返回</el-button>
        <el-button plain style="border: 1px solid #fff;color: #000;">
          <i class="el-icon-time time-memory"> {{ timeLimit }}ms</i>
          <i class="el-icon-cpu time-memory" style="margin-left: 30px;"> {{ memoryLimit }}kb</i>
        </el-button>
      </el-header>
      <el-dropdown style="display: none;">
        <el-button style="border: 1px solid #fff;font-size: 20px;margin-left: 30px;">
          A<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item class="dropdown-problem">A : A+B</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <p style="display: inline-block;font-size: 25px;margin: 10px 0 10px 30px;">{{ problemTitle }}</p>
      <p class="mut-title">Description</p>
      <mavon-editor
        :value="mavonDescription"
        class="mavon-editor"
        :subfield="false"
        :default-open="'preview'"
        :editable="false"
        :toolbars-flag="false"
        :ishljs="true"
      />
      <p class="mut-title">Input</p>
      <mavon-editor
        :value="mavonInput"
        class="mavon-editor"
        :subfield="false"
        :default-open="'preview'"
        :editable="false"
        :toolbars-flag="false"
        :ishljs="true"
      />
      <p class="mut-title">Output</p>
      <mavon-editor
        :value="mavonOutput"
        class="mavon-editor"
        :subfield="false"
        :default-open="'preview'"
        :editable="false"
        :toolbars-flag="false"
        :ishljs="true"
      />
      <p class="mut-title">Sample Input</p>
      <mavon-editor
        :value="mavonSampleInput"
        class="mavon-editor"
        :subfield="false"
        :default-open="'preview'"
        :editable="false"
        :toolbars-flag="false"
        :ishljs="true"
      />
      <p class="mut-title">Sample Output</p>
      <mavon-editor
        :value="mavonSampleOutput"
        class="mavon-editor"
        :subfield="false"
        :default-open="'preview'"
        :editable="false"
        :toolbars-flag="false"
        :ishljs="true"
      />
      <p class="mut-title">Tips</p>
      <mavon-editor
        :value="mavonTips"
        class="mavon-editor"
        :subfield="false"
        :default-open="'preview'"
        :editable="false"
        :toolbars-flag="false"
        :ishljs="true"
      />
    </div>
    <div class="right">
      <el-header class="editor-header" style="background-color: #3B3B3B;">
        <el-button class="submit-btn" @click="dialogSubmitVisible = true">提交</el-button>
        <el-dialog width="70%" title="提交结果" :show-close="false" :visible.sync="dialogSubmitVisible">
          <el-table :data="gridData">
            <el-table-column property="date" label="日期" width="150" />
            <el-table-column property="name" label="姓名" width="200" />
            <el-table-column property="address" label="地址" />
          </el-table>
        </el-dialog>
        <el-select v-model="selectLanguage" style="width:100px;" placeholder="请选择" class="select-language">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button class="submit-records" @click="dialogRunVisible = true">提交记录</el-button>
        <el-dialog width="70%" title="运行记录" :visible.sync="dialogRunVisible">
          <el-table :data="gridData">
            <el-table-column property="date" label="日期" width="150" />
            <el-table-column property="name" label="姓名" width="200" />
            <el-table-column property="address" label="地址" />
          </el-table>
        </el-dialog>
      </el-header>
      <!--右侧div内容-->
      <MonacoEditor v-model="code" class="monaco-editor" :language="selectLanguage" theme="vs-dark" />
    </div>
  </div>
</template>

<script>
import MonacoEditor from 'vue-monaco'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { getProblemById } from '@/api/problem'

export default {
  components: {
    MonacoEditor,
    mavonEditor
  },
  data() {
    return {
      gridData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      options: [{
        value: 'c',
        label: 'C'
      }, {
        value: 'cpp',
        label: 'C++'
      }, {
        value: 'java',
        label: 'Java'
      }, {
        value: 'python',
        label: 'Python'
      }],
      dialogRunVisible: false,
      dialogSubmitVisible: false,
      selectLanguage: 'c',
      problemTitle: '',
      timeLimit: '',
      memoryLimit: '',
      mavonDescription: '',
      mavonInput: '',
      mavonOutput: '',
      mavonSampleInput: '',
      mavonSampleOutput: '',
      mavonTips: '',
      code: ''
    }
  },
  created() {
    this.getProblemById()
  },
  mounted() {
    // console.log('this is my editor',this.editor);
  },
  methods: {
    getProblemById() {
      getProblemById(this.$route.query)
        .then(res => {
          this.problemTitle = res.data.title
          this.timeLimit = res.data.timeLimit
          this.memoryLimit = res.data.memoryLimit
          this.mavonDescription = res.data.description
          this.mavonInput = res.data.input
          this.mavonOutput = res.data.output
          this.mavonSampleInput = res.data.sampleInput
          this.mavonSampleOutput = res.data.sampleOutput
          this.mavonTips = res.data.hint
        })
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
*::-webkit-scrollbar{
  display: none;
}
.mavon-editor{
  width: calc(100% - 30px);
  margin: 0 0 0 30px;
}
.monaco-editor {
  width: 100%;
  height: 100%;
}
.submit-records{
  position: absolute;
  top: 10px;
  right: 20px;
  background-color: #6c757d;
  border: 1px solid #6c757d;
  color: #fff;
}
.submit-records:hover{
  background-color: #636b72;
}
.select-language{
  position: absolute;
  right: 130px;
}
.mut-title{
  font-size: 20px;
  font-weight: bolder;
  margin: 10px 0 10px 30px;
}
.time-memory{
  font-size: 17px;
  color: #787878;
  font-weight: bold;
  font-style: italic;
}
.editor-header{
  line-height: 60px;
  padding: 0 30px 0 30px;
}
.submit-btn{
  color: #0acf97;
  border: 1px solid #0acf97;
  background-color: #fff0
}
.submit-btn:hover{
  color: #fff;
  background-color: #0acf97
}
.dropdown-problem{
  color: #000;
  font-size: 18px;
}

.v-note-wrapper{
  min-height: 0px;
}

/* 拖拽相关样式 */
/*包围div样式*/
.box {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  box-shadow: -1px 9px 10px 3px rgba(0, 0, 0, 0.11);
}
/*左侧div样式*/
.left {
  width: calc(50%);  /*左侧初始化宽度*/
  height: 100%;
  background: #FFFFFF;
  float: left;
  overflow: auto;
}
/*右侧div'样式*/
.right {
  float: left;
  width: 50%;   /*右侧初始化宽度*/
  height: 100%;
  background: #fff;
  box-shadow: -1px 1px 1px 1px rgba(0, 0, 0, 0.11);
}

</style>
