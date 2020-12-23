<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-light">
          <h4 class="mt-0">分类来源</h4>
          <el-cascader
            ref="cascader"
            v-model="treeVal"
            :options="classifyOptions"
            :props="classifyProps"
            collapse-tags
            clearable
            @change="changeClassify"
          />
          <el-tag
            v-for="tag in classifyTags"
            :key="tag.value"
            style="margin-left: 10px;margin-top:7px;cursor: pointer;"
            closable
            effect="dark"
            type="success"
            @close="handleClose(tag)"
          >
            {{ tag.label }}
          </el-tag>
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-delete"
            style="margin-top:7px;margin-left: 20px;"
            @click="handleCloseAll"
          >清除全部
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-light">
          <el-table
            :data="tableData"
            stripe
            style="width: 100%;"
            :default-sort="{prop: 'problemNum', order: 'ascending'}"
            @sort-change="headerClick"
          >
            <el-table-column prop="problemNum" label="编号" sortable />
            <el-table-column prop="title" label="标题">
              <template slot-scope="scope">
                <el-link type="primary" @click="goEditor(scope.row.problemId)">{{ scope.row.title }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="classifyName" label="来源" />
            <el-table-column prop="accepted" label="AC" sortable />
            <el-table-column prop="submit" label="提交" sortable />
            <el-table-column prop="ratio" label="比例" sortable>
              <template slot-scope="scope">
                <div class="table-block">
                  <span class="demonstration">{{ scope.row.ratio.toFixed(1) }} %</span>
                  <el-slider v-model="scope.row.ratio" disabled />
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="margin-top: 20px;"
            background
            :current-page="currentPage"
            :page-sizes="[10, 25, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getProblemList, getClassifyListCascader } from '@/api/problem'
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      currentPage: 1,
      // 每页的数据
      pageSize: 10,
      totalNum: 0,
      tableData: [],
      sort: 1,
      treeVal: [],

      classifyTags: [],

      classifyProps: { multiple: true },
      classifyOptions: []
    }
  },
  created() {
    this.getProblemList()
    this.getClassifyListCascader()
  },
  methods: {
    goEditor(problemId) {
      this.$router.push({
        path: '/editor',
        query: { problemId: problemId }
      })
    },
    headerClick(event) {
      const params = [['problemNum', 1], ['accepted', 3], ['submit', 5], ['ratio', 7]]
      const sortMap = new Map(params)
      if (event.order === null) {
        this.sort = 0
        this.getProblemList()
        return
      }
      if (event.order === 'descending') {
        sortMap.set(event.prop, sortMap.get(event.prop) + 1)
      }
      this.sort = sortMap.get(event.prop)
      this.getProblemList()
    },
    changeClassify(nodesT) {
      this.classifyTags = []
      const nodes = this.$refs['cascader'].getCheckedNodes(true)
      for (let i = 0; i < nodes.length; i++) {
        let flag = false
        for (let j = 0; j < nodesT.length; j++) {
          if (nodes[i].value === nodesT[j][2]) {
            flag = true
          }
        }
        if (flag) {
          this.classifyTags.push({ value: nodes[i].value, label: nodes[i].label })
        }
      }
      this.getProblemList()
    },
    handleClose(tag) {
      const array = []
      for (let i = 0; i < this.treeVal.length; i++) {
        if (this.treeVal[i][2] !== tag.value) {
          array.push(this.treeVal[i])
        }
      }
      this.treeVal = array
      this.classifyTags.splice(this.classifyTags.indexOf(tag), 1)
      this.getProblemList()
    },
    handleCloseAll() {
      this.classifyTags = []
      this.treeVal = []
      this.getProblemList()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.getProblemList()
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getProblemList()
    },
    getProblemList() {
      let classifyIds = ''
      this.treeVal.forEach(t => {
        classifyIds = classifyIds.concat(t[2] + ',')
      })
      classifyIds.slice(0, classifyIds.length - 1)
      getProblemList({
        current: this.currentPage,
        size: this.pageSize,
        sort: this.sort,
        classifyIdList: classifyIds || null
      }).then(res => {
        this.totalNum = parseInt(res.data.total)
        this.tableData = res.data.records
      })
    },
    getClassifyListCascader() {
      getClassifyListCascader()
        .then(res => {
          this.classifyOptions = res.data
        })
    }
  }
}
</script>

<style scoped lang="scss">

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-light {
    background: #ffffff;
  }
  .grid-content {
    padding: 20px;
    border-radius: 4px;
    min-height: 36px;
  }

  ::v-deep .el-slider .el-slider__runway.disabled .el-slider__bar{
    background-color: #45bce0;
  }
  ::v-deep .table-block{
    height: 50px;
  }
  ::v-deep .el-slider .el-slider__runway{
    margin: 11px 0;
  }
  ::v-deep .el-slider .el-slider__runway.disabled .el-slider__button-wrapper{
    top: -10px;
    height: 26px;
    width: 26px;
  }
  ::v-deep .table-block .el-slider{
    height: 28px;
  }
  ::v-deep .el-table td, .el-table th{
    padding: 5px 0;
  }

</style>
