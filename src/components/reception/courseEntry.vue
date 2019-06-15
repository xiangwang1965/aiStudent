<template>
  <el-dialog title="课程选择" class="courseEntryDialog" @open="dialogOpen" append-to-body :visible.sync="config.visible" width="1200px" height="580px">
    <div class="searchContent">
      <el-select v-model="searchConfig.brand_id" placeholder="品牌名称" @change="changeBrand">
        <el-option v-for="brand in brandList" :key="brand.id" :value="brand.id" :label="brand.name"></el-option>
      </el-select>
      <el-select v-model="searchConfig.course_type_id" clearable placeholder="课程类型">
        <el-option v-for="courseType in courseTypeList" :key="courseType.id" :value="courseType.id" :label="courseType.course_type_name || courseType.name"></el-option>
      </el-select>
      <el-select v-model="searchConfig.grade_id" clearable placeholder="年级">
        <el-option v-for="grade in gradeList" :key="grade.grade_id || grade.id" :value="grade.grade_id || grade.id" :label="grade.grade_name || grade.name"></el-option>
      </el-select>
      <el-select v-model="searchConfig.class_type_id" clearable placeholder="班型">
        <el-option v-for="level in levelList" :key="level.class_level_id || level.id" :value="level.class_level_id || level.id" :label="level.class_level_name || level.name"></el-option>
      </el-select>
      <el-button style="vertical-align:top;" type="primary" class="cac-button-one el-button--primary el-button--small is-round spc_filter" size="small" round @click="doSelect">筛选</el-button>
      <el-input class="searchInput" v-model="searchConfig.key" @keyup.enter.native="doSelect" placeholder="请输入课程名称">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="doSelect"></i>
      </el-input>
    </div>
    <p style="text-align:right;height:14px;line-height:14px;margin-top:10px;">已选{{selectCourseList.length}}个课程</p>
    <el-table ref="table" class="courseListTable" v-loading="loading" :data="courseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" :selectable="disabledRow" width="40"></el-table-column>
      <el-table-column prop="course_name" label="课程名称" show-overflow-tooltip>

      </el-table-column>
      <el-table-column prop="course_type_name" label="课程类型" show-overflow-tooltip>

      </el-table-column>
      <el-table-column align="center" label="年级" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.grade !== 0">{{scope.row.grade_name}}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="class_type_name" label="班型" show-overflow-tooltip>

      </el-table-column>
      <el-table-column prop="teach_type_name" align="center" label="授课方式" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">双师</span>
          <span v-if="scope.row.type === 2">双师</span>
          <span v-if="scope.row.type === 3">面授</span>
          <span v-if="scope.row.type === 4">AI</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isCharge >= 0" prop="lesson_counts" width="100" align="center" label="讲次" show-overflow-tooltip>

      </el-table-column>
      <el-table-column v-if="isCharge >= 0" align="center" label="收费" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.charge_info.amount.indexOf('待定') >= 0 ? scope.row.charge_info.amount.split('/')[0] : (scope.row.charge_info.amount.split('元')[0] + '元')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination :config="pageConfig" @change="getCourseList"></pagination>
    <div slot="footer">
      <el-button type="primary" size="small" class="cac-button-two cancel-button dialog_cancel_button" round @click="cancelSelect">取 消</el-button>
      <el-button type="primary" size="small" class="cac-button-one dialog_confirm_button" round @click="doneSelectCourse">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import receptionApi from '@/services/reception'
import pagination from '@/components/pagination'
import authUtils from '@/services/auth/utils'
import { requireAgainPage } from '@/utils'
export default {
  props: ['config', 'selectedList'],
  data () {
    return {
      searchConfig: {
        teach_type: '',
        course_type_id: '',
        grade_id: '',
        class_type_id: '',
        key: '',
        brand_id: 1
      },
      pageConfig: {
        page: 1,
        per_page: 8,
        total: 0
      },
      courseList: [],
      teachTypeList: [
        {
          key: 1,
          value: '双师'
        }, {
          key: 2,
          value: '面授'
        }
      ],
      levelList: [],
      gradeList: [],
      courseTypeList: [],
      selectCourseList: [],
      defaultSelectList: [],
      loading: false,
      selectedIdList: [],
      isDefault: true,
      isCharge: authUtils.getUser().permissions.indexOf('enroll_charge'),
      brandList: this.$store.state.brandList
    }
  },
  components: {
    pagination
  },
  computed: {
    isWisroom () {
      return authUtils.getUser().third_part === 'wisroom' ? 1 : -1
    },
    hadSelectNum () {
      let num = this.selectedList.length
      this.selectCourseList.map((o, j) => {
        if (this.selectedIdList.indexOf(o.id) < 0) {
          num = num + 1
        }
      })
      return num
    }
  },
  created () {
    if (authUtils.getUser().brands.indexOf('MS') >= 0 || authUtils.getUser().brands.indexOf('自营双师') >= 0) {
      this.searchConfig.brand_id = 1
    } else {
      this.searchConfig.brand_id = 4
    }
    this.getOptions(false)
  },
  methods: {
    dialogOpen () {
      this.selectedIdList = []
      this.getCourseList()
      this.isDefault = true
    },
    changeBrand () {
      this.getOptions(true)
    },
    getOptions (isNot) {
      let params = {
        type: this.searchConfig.brand_id
      }
      receptionApi.getOptionsByType(params).then(res => {
        this.levelList = res.data.class_type
        this.gradeList = res.data.grade
        this.courseTypeList = res.data.course_types
        if (!isNot) {
          this.getCourseList()
        }
      })
    },
    doSelect () {
      this.pageConfig.page = 1
      this.getCourseList()
    },
    getCourseList (index) {
      let params = {
        page: index && typeof index === 'number' ? index : this.pageConfig.page,
        page_size: this.pageConfig.per_page,
        brand: this.searchConfig.brand_id,
        status: '1,2'
      }
      if (index && typeof index === 'number') {
        this.isDefault = false
      }
      if (this.searchConfig.teach_type !== '') {
        params.teach_type = this.searchConfig.teach_type
      }
      if (this.searchConfig.course_type_id !== '') {
        params.course_type_id = this.searchConfig.course_type_id
      }
      if (this.searchConfig.grade_id !== '') {
        params.grade_id = this.searchConfig.grade_id
      }
      if (this.searchConfig.class_type_id !== '') {
        params.class_type_id = this.searchConfig.class_type_id
      }
      if (this.searchConfig.key !== '') {
        params.key = this.searchConfig.key
      }
      this.loading = true
      receptionApi.getAllCourseList(params).then(res => {
        this.loading = false
        if (res.status_code === 200) {
          this.selectedIdList = []
          res.data.list.map((v, index) => {
            {
              let num = 0
              for (var p = 0; p < this.courseTypeList.length; p++) {
                if (v.course_type === this.courseTypeList[p].id) {
                  num++
                  v.course_type_name = this.courseTypeList[p].course_type_name
                  break
                }
              }
              if (num === 0) {
                v.course_type = 0
                v.course_type_name = '无'
              }
            }
            {
              let num = 0
              for (var j = 0; j < this.gradeList.length; j++) {
                if (this.searchConfig.brand_id === 4) {
                  if (v.grade === this.gradeList[j].id) {
                    num++
                    v.grade_name = this.gradeList[j].name
                    break
                  }
                } else {
                  if (v.grade === this.gradeList[j].grade_id) {
                    num++
                    v.grade_name = this.gradeList[j].grade_name
                    break
                  }
                }
              }
              if (num === 0) {
                v.grade = 0
                v.grade_name = '无'
              }
            }
            for (var k = 0; k < this.teachTypeList.length; k++) {
              if (v.type === this.teachTypeList[k].key) {
                v.teach_type_name = this.teachTypeList[k].value
                break
              } else {
                v.teach_type_name = v.type
              }
            }
            {
              let num = 0
              for (var o = 0; o < this.levelList.length; o++) {
                if (this.searchConfig.brand_id === 4) {
                  if (v.class_type === this.levelList[o].id) {
                    num++
                    v.class_type_name = this.levelList[o].name
                    break
                  }
                } else {
                  if (v.class_type === this.levelList[o].class_level_id) {
                    num++
                    v.class_type_name = this.levelList[o].class_level_name
                    break
                  }
                }
              }
              if (num === 0) {
                v.class_type = 0
                v.class_type_name = '无'
              }
            }
            v.classOrCourse = 'course'
          })
          this.courseList = res.data.list
          this.pageConfig.total = res.data.total_count
          if (requireAgainPage(this.pageConfig) > 0) {
            this.pageConfig.page = requireAgainPage(this.pageConfig)
            this.getCourseList()
          }
          this.$nextTick(() => {
            if (this.selectedList.length > 0) {
              this.courseList.map((v, index) => {
                this.selectedList.map((o, i) => {
                  if (v.id === o[0].id) {
                    this.$refs.table.toggleRowSelection(this.courseList[index], true)
                    this.selectedIdList.push(o[0].id)
                  }
                })
              })
            }
          })
        }
      })
    },
    disabledRow (row, index) {
      let status = true
      let str1 = ''
      this.selectedList.map((o, j) => {
        str1 += o[0].id + ','
      })
      if (str1.indexOf(row.id) >= 0) {
        status = false
      }
      if (this.hadSelectNum >= 5) {
        let str = ''
        this.selectCourseList.map((o, j) => {
          str += o.id + ','
        })
        if (str.indexOf(row.id + ',') < 0) {
          status = false
        }
      }
      return status
    },
    handleSelectionChange (val) {
      this.selectCourseList = val
    },
    cancelSelect () {
      this.$refs.table.clearSelection()
      this.pageConfig.page = 1
      this.config.visible = false
    },
    doneSelectCourse () {
      if (this.selectCourseList.length === 0) {
        this.$message({
          message: '请至少选择一个课程',
          type: 'warning',
          center: true
        })
        return
      }
      let deleteList = []
      this.selectedIdList.map((v, i) => {
        let num = 0
        this.selectCourseList.map((o, j) => {
          if (o.id === v) {
            num = num + 1
          }
        })
        if (num === 0) {
          deleteList.push(v)
        }
      })
      let list = []
      this.selectCourseList.map((v) => {
        list.push([v])
      })
      this.$emit('done', list, deleteList, 'course')
      this.$refs.table.clearSelection()
      this.pageConfig.page = 1
      this.config.visible = false
    }
  }
}
</script>
<style lang="less">
.courseEntryDialog {
  font-size: 12px;
  .el-dialog__header {
    padding: 20px 20px 10px;
    .el-dialog__title {
      font-weight: bold;
    }
  }
  .el-dialog__body {
    padding-top: 0;
    padding-bottom: 10px;
    min-height: 450px;
    .el-table__header-wrapper {
      .el-checkbox {
        display: none;
      }
    }
    .el-table__body-wrapper {
      overflow-x: hidden;
    }
  }
  .searchContent {
    .el-select {
      width: 110px;
    }
    .searchInput {
      float: right;
      width: 220px;
    }
    .el-input__icon {
      line-height: 1;
    }
  }
  .courseListTable {
    margin-top: 10px;
    font-size: 12px;
  }
}
</style>
