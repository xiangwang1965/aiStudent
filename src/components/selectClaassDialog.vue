<template>
  <el-dialog title="班级选择" class="classEntryDialog" append-to-body :visible.sync="config.visible" @open="dialogOpen" width="1050px">
    <div class="searchContent">
      <el-select v-model="searchConfig.teach_type" clearable placeholder="授课方式">
        <el-option v-for="teachType in teachTypeList" :key="teachType.key" :value="teachType.key" :label="teachType.value"></el-option>
      </el-select>
      <el-select v-model="searchConfig.course_type_id" clearable placeholder="课程类型">
        <el-option v-for="courseType in courseTypeList" :key="courseType.id" :value="courseType.id" :label="courseType.course_type_name"></el-option>
      </el-select>
      <el-select v-model="searchConfig.grade_id" clearable placeholder="年级">
        <el-option v-for="grade in gradeList" :key="grade.grade_id" :value="grade.grade_id" :label="grade.grade_name"></el-option>
      </el-select>
      <el-select v-model="searchConfig.class_type_id" clearable placeholder="班型">
        <el-option v-for="level in levelList" :key="level.class_level_id" :value="level.class_level_id" :label="level.class_level_name"></el-option>
      </el-select>
      <el-button type="primary" class="cac-button-one" size="mini" round @click="getClassList">筛选</el-button>
      <el-input class="searchInput" v-model="searchConfig.key" @keyup.enter.native="getClassList" placeholder="课程、班级名称、授课老师">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="getClassList"></i>
      </el-input>
    </div>
    <p style="text-align:right;">已选{{selectClassList.length}}个班级</p>
    <el-table ref="table" class="classListTable" v-loading="loading" :data="classList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="class_name" label="班级名称" show-overflow-tooltip>

      </el-table-column>
      <el-table-column prop="course_name" label="课程名称" show-overflow-tooltip>

      </el-table-column>
      <el-table-column label="人数">
        <template slot-scope="scope">
          <span>{{scope.row.students_count}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="course_type_name" label="课程类型" show-overflow-tooltip>

      </el-table-column>
      <el-table-column prop="grade_name" label="年级" show-overflow-tooltip>

      </el-table-column>
      <el-table-column prop="class_type_name" label="班型" show-overflow-tooltip>

      </el-table-column>
      <el-table-column prop="teacher_name" label="授课老师" show-overflow-tooltip>

      </el-table-column>
      <el-table-column prop="teach_type_name" label="授课方式" show-overflow-tooltip>

      </el-table-column>
      <el-table-column prop="campus_name" label="校区" show-overflow-tooltip>

      </el-table-column>
      <el-table-column prop="start_time" label="开课时间" width="220" align="center" show-overflow-tooltip>

      </el-table-column>
    </el-table>
    <pagination :config="pageConfig" @change="getClassList"></pagination>
    <div slot="footer">
      <el-button type="primary" size="small" class="cac-button-two cancel-button dialog_cancel_button" round @click="cancelSelect">取 消</el-button>
      <el-button type="primary" size="small" class="cac-button-one dialog_confirm_button" round @click="doneSelectClass">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import receptionApi from '@/services/reception'
  import courseApi from '@/services/platform/course'
  import classroomApi from '@/services/classroom'
  import pagination from '@/components/pagination'
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
          key: ''
        },
        pageConfig: {
          page: 1,
          per_page: 8,
          total: 0
        },
        classList: [],
        teachTypeList: [],
        levelList: [],
        gradeList: [],
        courseTypeList: [],
        selectClassList: [],
        loading: false,
        selectedIdList: []
      }
    },
    components: {
      pagination
    },
    created () {
      this.getOptions()
      this.getClassLevelList()
      this.getGradeList()
    },
    methods: {
      dialogOpen () {
        this.getOptions()
      },
      getOptions () {
        classroomApi.queryClassOption().then(res => {
          this.teachTypeList = res.data.options.class_type
          receptionApi.getOptionsList().then(res => {
            this.courseTypeList = res.data.course_types
            this.levelList = res.data.class_type
            this.gradeList = res.data.grade
            this.getClassList()
          })
        })
      },
      getClassLevelList () {
        let params = {
          school_id: this.schoolId
        }
        courseApi.getClassLevelList(params).then(res => {
          this.levelList = res
        })
      },
      getGradeList () {
        let params = {
          school_id: this.schoolId
        }
        courseApi.getGradeList(params).then(res => {
          this.gradeList = res
        })
      },
      getClassList (index) {
        let params = {
          page: index && typeof index === 'number' ? index : this.pageConfig.page,
          page_size: this.pageConfig.per_page
        }
        if (this.searchConfig.teach_type) {
          params.teach_type = this.searchConfig.teach_type
        }
        if (this.searchConfig.course_type_id) {
          params.course_type_id = this.searchConfig.course_type_id
        }
        if (this.searchConfig.grade_id) {
          params.grade_id = this.searchConfig.grade_id
        }
        if (this.searchConfig.class_type_id) {
          params.class_type_id = this.searchConfig.class_type_id
        }
        if (this.searchConfig.key) {
          params.key = this.searchConfig.key
        }
        this.loading = true
        receptionApi.getInClassList(params).then(res => {
          this.loading = false
          if (res.status_code === 200) {
            res.data.list.map((v, index) => {
              switch (v.course_type) {
                case 1:
                  v.course_type_name = '长期班'
                  break
                case 2:
                  v.course_type_name = '短期班'
                  break
                case 3:
                  v.course_type_name = '体验班'
                  break
                default:
                  v.course_type_name = '未知'
              }
              for (var j = 0; j < this.gradeList.length; j++) {
                if (v.grade === this.gradeList[j].grade_id) {
                  v.grade_name = this.gradeList[j].grade_name
                  break
                } else {
                  v.grade_name = v.grade
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
              this.levelList.map((o, i) => {
                if (v.class_type === o.class_level_id) {
                  v.class_type_name = o.class_level_name
                }
              })
              v.classOrCourse = 'class'
            })
            this.classList = res.data.list
            this.pageConfig.total = res.data.total_count
            if (requireAgainPage(this.pageConfig) > 0) {
              this.pageConfig.page = requireAgainPage(this.pageConfig)
              this.getClassList()
            }
            this.$nextTick(() => {
              if (this.selectedList.length > 0) {
                this.classList.map((v, index) => {
                  this.selectedList.map((o, i) => {
                    if (v.id === o.id) {
                      this.$refs.table.toggleRowSelection(this.classList[index], true)
                      this.selectedIdList.push(o.id)
                    }
                  })
                })
              }
            })
          }
        })
      },
      handleSelectionChange (val) {
        this.selectClassList = val
      },
      cancelSelect () {
        this.$refs.table.clearSelection()
        this.pageConfig.page = 1
        this.config.visible = false
      },
      doneSelectClass () {
        if (this.selectClassList.length === 0) {
          this.$message({
            message: '请至少选择一个班级',
            type: 'warning',
            center: true
          })
          return
        }
        let deleteList = []
        this.selectedIdList.map((v, i) => {
          let num = 0
          this.selectClassList.map((o, j) => {
            if (o.id === v) {
              num = num + 1
            }
          })
          if (num === 0) {
            deleteList.push(v)
          }
        })
        this.$emit('done', this.selectClassList, deleteList)
        this.$refs.table.clearSelection()
        this.pageConfig.page = 1
        this.config.visible = false
      }
    }
  }
</script>
<style lang="less">
.classEntryDialog {
  font-size: 12px;
  .el-dialog__header {
    padding: 20px 20px 10px;
    .el-dialog__title {
      font-weight: bold;
    }
  }
  .el-dialog__body {
    padding-top: 0;
    min-height: 450px;
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
  .classListTable {
    margin-top: 10px;
    font-size: 12px;
  }
}
</style>
