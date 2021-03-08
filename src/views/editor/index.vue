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
        <el-button class="submit-btn" @click="submit_code">提交</el-button>
        <el-dialog
          title="提交结果"
          :visible.sync="dialogSubmitVisible"
          :close-on-click-modal="false"
          top="2vh"
          style="line-height: 20px;"
        >
          <el-table v-loading="submit_loading" element-loading-background="#fff" element-loading-text="Pending..." :data="gridData" style="margin-bottom: 20px;">
            <el-table-column property="in_date" label="提交时间" width="170" />
            <el-table-column property="result" label="运行结果" />
            <el-table-column property="time" label="消耗时间" />
            <el-table-column property="memory" label="消耗内存" />
            <el-table-column property="language" label="编译器" />
          </el-table>
          <div v-if="!submit_loading">
            <p style="margin: 5px 0;font-size: 16px;">提交代码</p>
            <MonacoEditor v-model="code" :language="selectLanguage" :options="submit_options" theme="vs-dark" style="height: 300px;margin-bottom: 20px;" />
            <p style="margin: 5px 0;font-size: 16px;">编译信息</p>
            <el-input
              v-model="compiler_info"
              type="textarea"
              readonly
              :autosize="{ minRows: 5, maxRows: 10}"
            />
          </div>
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
        <el-dialog title="运行记录" :visible.sync="dialogRunVisible" top="2vh" style="line-height: 20px;">
          <el-table :data="gridData">
            <el-table-column type="expand">
              <template scope="prop">
                <p style="margin: 5px 0;font-size: 16px;">提交代码</p>
                <MonacoEditor v-model="code" :language="showLanguage(prop.row.language)" :options="submit_options" theme="vs-dark" style="height: 300px;margin-bottom: 20px;" />
                <p style="margin: 5px 0;font-size: 16px;">编译信息</p>
                <el-input
                  v-model="compiler_info"
                  type="textarea"
                  readonly
                  :autosize="{ minRows: 5, maxRows: 10}"
                />
              </template>
            </el-table-column>
            <el-table-column property="in_date" label="提交时间" width="170" />
            <el-table-column property="result" label="运行结果" />
            <el-table-column property="time" label="消耗时间" />
            <el-table-column property="memory" label="消耗内存" />
            <el-table-column property="language" label="编译器" />
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
        in_date: '2016-05-02 13:23:43',
        result: '答案正确',
        time: '14ms',
        memory: '2634k',
        language: 'C(gcc)'
      }, {
        in_date: '2016-05-02 13:23:43',
        result: '答案正确',
        time: '14ms',
        memory: '2634k',
        language: 'C(gcc)'
      }],
      submit_loading: false,
      options: [{
        value: 'c',
        label: 'C(gcc)'
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
      submit_options: {
        readOnly: true
      },
      compiler_info: 'a.c: In function ‘main’:\n' +
        'a.c:9:5: warning: ignoring return value of ‘scanf’, declared with attribute warn_unused_result [-Wunused-result]\n' +
        '     scanf("%d %d", &m, &n);\n' +
        '     ^~~~~~~~~~~~~~~~~~~~~~',
      problemTitle: '',
      timeLimit: '',
      memoryLimit: '',
      mavonDescription: '',
      mavonInput: '',
      mavonOutput: '',
      mavonSampleInput: '',
      mavonSampleOutput: '',
      mavonTips: '',
      code: '#include<cstdio>\n' +
        '\n' +
        'int max(int a, int b)//取最大值函数\n' +
        '{\n' +
        '    return a > b ? a : b;\n' +
        '}\n' +
        '\n' +
        'struct Thing\n' +
        '{\n' +
        '    int w;\n' +
        '    int v;\n' +
        '}list[101];\n' +
        '\n' +
        'int dp[101][1001];\n' +
        '\n' +
        'int main()\n' +
        '{\n' +
        '    int s, n;//背包容量和物品总数\n' +
        '    while (scanf("%d%d", &s, &n) != EOF)\n' +
        '    {\n' +
        '        for (int i = 1; i <= n; i++)\n' +
        '        {\n' +
        '            scanf("%d%d", &list[i].w, &list[i].v);//读入每个物品的体积和价值\n' +
        '        }\n' +
        '        for (int i = 0; i <= s; i++) dp[0][i] = 0;//初始化二维数组\n' +
        '        for (int i = 1; i <= n; i++)//循环每个物品，执行状态转移方程\n' +
        '        {\n' +
        '            for (int j = s; j >= list[i].w; j--)\n' +
        '            {\n' +
        '                dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - list[i].w] + list[i].v);\n' +
        '            }\n' +
        '            for (int j = list[i].w - 1; j >= 0; j --)\n' +
        '            {\n' +
        '                dp[i][j] = dp[i - 1][j];\n' +
        '            }\n' +
        '        }\n' +
        '        printf("%d\\n", dp[n][s]);\n' +
        '    }\n' +
        '    return 0;\n' +
        '}'
    }
  },
  computed: {
    showLanguage() {
      return (item) => {
        return this.options.find(t => t.label === item).value
      }
    }
  },
  created() {
    this.getProblemById()
  },
  mounted() {
    // console.log('this is my editor',this.editor);
  },
  methods: {
    submit_code() {
      this.dialogSubmitVisible = true
      this.submit_loading = true
      setTimeout(() => {
        this.submit_loading = false
      }, 2000)
    },
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
.mavon-editor{
  width: calc(100% - 30px);
  margin: 0 0 0 30px;
}
.monaco-editor {
  width: 100%;
  height: 100%;
}
::v-deep .el-textarea__inner{
  background-color: #e5e5e5;
  color: #1c1c1c;
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
