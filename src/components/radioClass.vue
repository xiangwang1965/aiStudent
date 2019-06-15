<!-- 选择班级 -->
<template>
  <div class='ChooseClassPage'>
    <div class="searchBar">
        <el-input v-model="params.search" placeholder="请输入班级名称"></el-input>
        <el-select v-model="params.teacher_id" :placeholder="class_type===1?'主讲老师':'辅导老师'" clearable filterable>
          <el-option v-for="item in optionTeacher" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="params.subject_id" placeholder="学科" clearable>
          <el-option v-for="item in optionSubject" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>
        <el-select v-model="params.grade_id" placeholder="年级" clearable>
          <el-option v-for="item in optionGrade" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>
        <el-select v-model="params.term_id" placeholder="学期" clearable>
          <el-option v-for="item in optionSemester" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>
        <el-select v-model="params.level" placeholder="班级类型" clearable>
          <el-option v-for="item in optionClassType" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>
        <el-button type="primary" class="cac-button-one spc_filter" round @click="doSelect">筛选</el-button>
    </div>
    <div class="table">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        ref="multipleTable"
        :data="classTable"
        tooltip-effect="dark"
        height="440"
        style="width: 100%"
        @row-click="showSelect"
        highlight-current-row>
        <el-table-column align="left" prop="lesson_time" label="上课时段" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" prop="class_name" label="班级名称" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="grade_name" label="年级" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="subject_name" label="学科"></el-table-column>
        <el-table-column align="center" prop="teacher_name" :label="class_type === 1 ? '主讲老师' : '辅导老师'" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="level_name" label="班级类型" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.level_name || '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="term_name" label="学期" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.term_name || '无'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination :config="{page: params.page,per_page: params.page_size, total: params.total }" @change="getClass"></pagination>
    <div class="footer">
      <el-button type="primary" size="small" round @click="cancel" class="cac-button-two dialog_cancel_button">取 消</el-button>
      <el-button type="primary" size="small" round @click="doConfirm" class="cac-button-one dialog_confirm_button">确 定</el-button>
    </div>
  </div>
</template>

<script>
import classroomApi from '@/services/classroom'
import pagination from '@/components/pagination'
export default {
  data () {
    return {
      loading: false,
      params: {
        status: '1,2',
        total: 0,
        page_size: 20,
        page: 1,
        current_student_id: this.current_id,
        search: ''
      },
      optionClassType: [],
      optionGrade: [],
      optionSubject: [],
      optionSemester: [],
      optionTeacher: [],
      optionClass: [],
      classTable: [],
      classes: '',
      selectedId: -1,
      trigger: false
    }
  },
  props: ['activeStudent', 'update', 'current_id', 'class_type'],
  components: {
    pagination
  },
  watch: {
    // 用户操作成功之后刷新班级
    update () {
      this.classes = ''
    },
    current_id () {
      // 如果转班的学生发生变化，重新刷新数学
      this.params.current_student_id = this.current_id
      this.classes = ''
      this.getClass()
    },
    // 根据双师和面授刷新班级列表
    class_type () {
      this.getClass()
      this.class_type === 1 ? this.getTeacher() : this.getAssistant()
    }
  },
  created () {
    this.getSubjectOption()
    this.class_type === 1 ? this.getTeacher() : this.getAssistant()
    // this.getClassName()
    this.getClass()
  },
  methods: {
    // 获取班级
    getClass (index) {
      let params = {}
      this.params.page = index || this.params.page
      params = this.params
      this.loading = true
      params.class_type = this.class_type
      classroomApi.query(params).then(res => {
        setTimeout(() => {
          this.loading = false
        }, 300)
        if (res.ok) {
          this.classTable = res.data.list
          this.classTable.forEach(item => {
            this.$set(item, 'selected', false)
            typeof (item.start_time) === 'string' && typeof (item.end_time) === 'string' && this.$set(item, 'lesson_time', item.start_time.split(' ')[1].substring(0, 5) + '--' + item.end_time.split(' ')[1].substring(0, 5))
          })
          this.params.total = res.data.total_count
        }
      })
    },
    // 获取所有下拉条件
    getSubjectOption () {
      // 学科
      classroomApi.queryClassOption().then(res => {
        this.optionSubject = res.data.options.subject
        this.optionGrade = res.data.options.grade
        this.optionSemester = res.data.options.term
        this.optionClassType = res.data.options.level
      })
    },
    // 获取助教
    getAssistant () {
      classroomApi.queryAssistant().then(res => {
        this.optionTeacher = res.data
      })
    },
    // 获取老师
    getTeacher () {
      classroomApi.queryTeacher().then(res => {
        this.optionTeacher = res.data
      })
    },
    // 获取班级名称
    getClassName () {
      classroomApi.queryClassName().then(res => {
        this.optionClass = res.data
      })
    },
    // 翻页
    goPage (val) {
      this.params.page = val
      this.getClass()
    },
    querySearchAsync (queryString, cb) {
      let params = {
        'name': queryString
      }
      classroomApi.queryTeacher(params).then(res => {
        res.data.forEach((item, i) => {
          item.value = item.name
          item.address = item.teach_subject
        })
        cb(res.data)
      })
    },
    queryClassAsync (queryString, cb) {
      let params = {
        'class_name': queryString,
        'status': '1,2'
      }
      classroomApi.queryClassName(params).then(res => {
        res.data.forEach((item, i) => {
          item.value = item.class_name
        })
        cb(res.data)
      })
    },
    doSelect () {
      this.params.page = 1
      this.getClass()
    },
    // 确认
    doConfirm () {
      this.$emit('transformParams', this.classes)
    },
    cancel () {
      this.$emit('cancel')
    },
    showSelect (val) {
      this.classes = val.class_id
    }
  }
}
</script>
<style lang="less">
.ChooseClassPage {
  .searchBar {
    text-align: left;
    .el-input {
      width: 120px;
      input {
        width: 120px;
      }
    }
    .el-select {
      width: 110px;
      .el-input {
        width: 110px;
        input {
          width: 110px;
        }
      }
    }
    .el-input, .el-select {
      margin-right: 10px;
    }
  }
  .table {
    margin-top: 10px;
    height: 440px;
    .el-table__body-wrapper {
      tr, td {
        height: 50px;
      }
    }
  }
  .footer {
    text-align: center;
  }
}
</style>
