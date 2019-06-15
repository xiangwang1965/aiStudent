<template>
  <div class="studentEditView" v-loading="loading">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/student' }">学生管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{status==="edit"?"修改学生":"创建学生"}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="createForm cac-shadow">
      <el-form :model="params" :rules="rules" ref="params" size="mini" label-width="100px" class="createForm--form" label-position="top">
        <el-form-item label="学生姓名" prop="name" class="createForm--formItem">
          <el-input v-model.trim="params.name" placeholder="请填写学生姓名" :maxlength="8" class="createForm__input"></el-input>
        </el-form-item>
        <el-form-item label="学生账号(用于登陆学生端)" prop="telephone" class="createForm--formItem">
          <el-input v-model.number="params.telephone" :maxlength="11" placeholder="请填写学员手机号" class="createForm__input"></el-input>
        </el-form-item>
        <el-form-item label="学生所在校区：" prop="campus_id">
          <el-select v-model="params.campus_id" placeholder="请选择所在校区">
            <el-option
              v-for="item in campusList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="家长姓名" class="createForm--formItem">
          <el-input v-model.trim="params.parent_name" :maxlength="8" placeholder="家长姓名" class="createForm__input"></el-input>
        </el-form-item>
        <el-form-item label="关系" class="createForm--formItem">
          <el-input v-model="params.parent_relation" placeholder="与学生关系" class="createForm__input"></el-input>
        </el-form-item>
        <el-form-item label="家长电话" class="createForm--formItem" prop="parent_telephone">
          <el-input v-model.number="params.parent_telephone" :maxlength="11" placeholder="家长电话" class="createForm__input"></el-input>
        </el-form-item>
        <el-form-item label="学生性别" class="createForm--formItem">
          <el-select v-model="params.gender" placeholder="请选择学生性别">
            <el-option v-for="item in optionGender" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学生生日" class="createForm--formItem">
          <el-form-item class="createForm__datePicker">
            <el-date-picker type="date" placeholder="请选择学生生日" v-model="params.birthday" :picker-options="dateOption" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="学生年级" class="createForm--formItem">
          <el-select v-model="params.grade" placeholder="请选择学生年级">
            <el-option v-for="item in optionGrade" :key="item.grade_id" :label="item.grade_name" :value="item.grade_name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="bottom">
        <el-button type="primary" size="small" class="cac-button-two cancle-button cancel_button" round @click="doCancle">取 消</el-button>
        <el-button type="primary" size="small" @click="doCreate('params')" class="cac-button-one confirm_button" round>{{status==="edit"?"确 定":"创 建"}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import studentApi from '@/services/student'
import courseApi from '@/services/platform/course'
import classroomApi from '@/services/classroom'
import receptionApi from '@/services/reception'
export default {
  data () {
    return {
      tableData: [],
      campusList: [],
      loading: false,
      status: this.$route.query.create,
      student_id: this.$route.query.id,
      dateOption: {
        disabledDate: (time) => {
          return time.getTime() > Date.now()
        }
      },
      params: {
        grade: '',
        gender: '',
        name: '',
        telephone: '',
        birthday: '',
        campus_id: '',
        parent_name: '',
        parent_relation: '',
        parent_telephone: ''
      },
      rules: {
        campus_id: [
          { required: true, message: '请选择校区', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[0-9][0-9]\d{8}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        parent_telephone: [
          { pattern: /^1[0-9][0-9]\d{8}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ]
      },
      optionGrade: [],
      optionGender: [
        {
          'value': '男',
          'key': 1
        },
        {
          'value': '女',
          'key': 2
        },
        {
          'value': '未知',
          'key': 3
        }
      ],
      canSubmit: true
    }
  },
  created () {
    classroomApi.queryClassOption().then(res => {
      if (res.ok) {
        this.campusList = res.data.options.campus
      }
    })
    if (this.status === 'edit') {
      this.getStudent()
    }
    this.getOptionsList()
    // this.getGradeList()
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/student') {
      to.meta.keepAlive = false
      this.$destroy()
    } else {
      to.meta.keepAlive = true
      this.$destroy()
    }
    next()
  },
  methods: {
    getOptionsList () {
      receptionApi.getOptionsList().then(res => {
        this.optionGrade = res.data.grade
      })
    },
    getGradeList () {
      let params = {
        school_id: this.schoolId
      }
      courseApi.getGradeList(params).then(res => {
        this.optionGrade = res
      })
    },
    getStudent () {
      let params = {
        'student_id': this.student_id
      }
      studentApi.queryDetail(params).then(res => {
        if (res.ok) {
          this.params = res.data
          this.params.telephone = Number(this.params.telephone)
          // 家长电话只为数字类型
          this.params.parent_telephone = this.params.parent_telephone === '' ? '' : Number(this.params.parent_telephone)
          // gender后台返回0时显示未知
          !this.params.gender && (this.params.gender = 3)
        }
      })
    },
    handleAllDate (val) {
    },
    handleAddClass () {
      this.$dialog.open('classTypeChoose')
    },
    handleDelete (index, row) {
      this.$confirm('是否确定删除该学生?', '提示', {
        confirmButtonText: '确 定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        cancelButtonText: '取 消',
        cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
      }).then(() => {
        this.tableData.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!',
          center: true
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
          center: true
        })
      })
    },
    doCreate (formName) {
      if (this.canSubmit) {
        this.canSubmit = false
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = this.params
            if (this.status === 'create') {
              let loadingInstance = this.$loading({
                text: '创建中...',
                target: '.content_right'
              })
              studentApi.create(params).then(res => {
                setTimeout(() => {
                  loadingInstance.close()
                }, 500)
                this.canSubmit = true
                this.loading = false
                if (res.ok) {
                  this.$router.back()
                }
              })
            } else {
              params.student_id = this.student_id
              let loadingInstance = this.$loading({
                text: '修改中...',
                target: '.content_right'
              })
              studentApi.update(params).then(res => {
                setTimeout(() => {
                  loadingInstance.close()
                }, 500)
                this.canSubmit = true
                this.loading = false
                if (res.ok) {
                  this.$router.back()
                }
              })
            }
          } else {
            this.canSubmit = true
            this.loading = false
            return false
          }
        })
      }
    },
    doCancle () {
      this.$router.back()
    }
  }
}
</script>
<style scoped>
.createForm {
  text-align: left;
  background-color: #fff;
  margin-top: 20px;
  padding: 28px 0 28px 35px;
}
.createForm--form {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
}
.createForm--formItem {
  width: 33%;
}
.createForm__datePicker,
.createForm__input {
  width: 195px;
}
.studentAddClass--title__span:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
.studentAddClass--title--tip {
  color: darkgray;
  font-size: 13px;
}

.bottom {
  text-align: center;
  width: 100%;
  margin-top: 30px;
}
.cancle-button {
  margin-right: 20px;
}
</style>
