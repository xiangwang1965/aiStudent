<!-- 选择班级 -->
<template>
  <div id='ChooseClassPage'>
    <div class="searchBar">
      <div class="searchBar__left">
        <!-- 班级名称 -->
        <div class="searchBar__left__top">
          <el-col>
            <el-autocomplete class="inline-input" popper-class="my-autocomplete" label=“name” clearable v-model="params.class_name" :fetch-suggestions="queryClassAsync" placeholder="请输入班级名称" :trigger-on-focus="false" @select="getTeacher"></el-autocomplete>
          </el-col>
          <!-- 授课教师 -->
          <!-- <el-col :span="23">
          <el-autocomplete class="inline-input" popper-class="my-autocomplete" label=“name” clearable v-model="params.teacherName" :fetch-suggestions="querySearchAsync" placeholder="请输入教师姓名或手机号" :trigger-on-focus="false" @select="getTeacher"></el-autocomplete>
        </el-col> -->
          <el-select v-model="params.teacher_id" :placeholder="class_type===1?'主讲老师':'辅导老师'" clearable filterable>
            <el-option v-for="item in optionTeacher" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="params.subject_id" placeholder="班级学科" clearable>
            <el-option v-for="item in optionSubject" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="searchBar__left__bottom">
          <el-select v-model="params.grade_id" placeholder="班级年级" clearable>
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
        </div>
      </div>
      <div class="searchBar__right">
        <el-button class="cac-button-two spc_filter" @click="doSelect">筛选</el-button>
      </div>
    </div>
    <div class="table">
      <!-- <el-radio-group v-model="classes" @change="showSelect"> -->
      <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" ref="multipleTable" :data="classTable" tooltip-effect="dark" height="250" style="width: 100%" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="75" class="allselect"></el-table-column>
        <el-table-column align="center" prop="lesson_time" label="上课时段" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" prop="class_name" label="班级名称" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="grade_name" label="年级" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="subject_name" label="学科"></el-table-column>
        <el-table-column align="center" prop="teacher_name" label="主讲老师" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="level_name" label="班级类型" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="term_name" label="学期" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="campus_name" label="校区" show-overflow-tooltip></el-table-column> -->
        <!-- <el-table-column prop="student_count" label="班级学员数" show-overflow-tooltip></el-table-column> -->
        <!-- <el-table-column prop="status_name" label="上课时段" show-overflow-tooltip></el-table-column> -->
      </el-table>
      <!-- </el-radio-group> -->
      <el-pagination class="userTable__page" prev-text="上一页" next-text="下一页" @current-change="goPage" :page-size="params.page_size" :current-page="params.page" background layout="prev, pager, next" :total="params.total">
      </el-pagination>
    </div>
    <el-button type="primary" @click="doConfirm" size="small" class="cac-button-one confirm_button">确 定</el-button>
  </div>
</template>

<script>
import classroomApi from '@/services/classroom'
export default {
  data () {
    return {
      loading: false,
      params: {
        status: '1,2',
        total: 0,
        page_size: 20,
        page: 1,
        current_student_id: 0
      },
      optionClassType: [],
      optionGrade: [],
      optionSubject: [],
      optionSemester: [],
      optionTeacher: [],
      optionClass: [],
      classTable: [],
      classes: [],
      selectedId: -1,
      trigger: false
    }
  },
  props: ['activeStudent', 'update', 'current_id', 'class_type'],
  watch: {
    // 用户操作成功之后刷新班级
    update () {
      this.$refs.multipleTable.clearSelection()
      //  this.classes = []
    },
    current_id () {
      // 如果转班的学生发生变化，重新刷新数据
      this.params.current_student_id = this.current_id
      this.classes = []
      this.getClass(this.params)
    },
    // 根据双师和面授刷新班级列表
    class_type () {
      this.getClass(this.params)
      this.class_type === 1 ? this.getTeacher() : this.getAssistant()
    }
  },
  created () {
    this.getSubjectOption()
    this.class_type === 1 ? this.getTeacher() : this.getAssistant()
    // this.getClassName()
    this.getClass(this.params)
  },
  methods: {
    // 获取班级
    getClass (params) {
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
      this.getClass(this.params)
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
      this.getClass(this.params)
    },
    handleSelectionChange (value) {
      this.classes = []
      value.forEach(item => {
        this.classes.push(item.class_id)
      })
    },
    // 确认
    doConfirm () {
      var temp = this.classes.join(',')
      this.$emit('transformParams', temp)
    },
    showSelect (val) {
      this.classes = val
    }
  }
}
</script>
<style scoped>

</style>
