<template>
  <div class="studentDetailView">
    <div class="breadcrumb clearfix">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/student' }">学生管理</el-breadcrumb-item>
        <el-breadcrumb-item>学生详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <h3 class="baseInfo_title">基本信息</h3>
    <div class="baseInfo_content cac-shadow">
      <el-row>
        <el-col :span="5">
          <div class="grid-content">
            <img class="avatar" :src="params.avatar==='' ? '../../../static/avatar.jpg':params.avatar" /><br/>
            <span class="username">{{params.name}}</span>
          </div>
        </el-col>
        <el-col :span="19">
          <table class="field">
            <thead>
              <th>学生ID</th>
              <th>学生账号</th>
              <th>学生生日</th>
              <th>学生性别</th>
            </thead>
            <tbody>
              <tr>
                <td>{{student_id}}</td>
                <td>{{params.telephone}}</td>
                <td>{{params.birthday}}</td>
                <td>{{params.gender|gender}}</td>
              </tr>
            </tbody>
            <thead>
              <th>学生年级</th>
              <th>家长姓名</th>
              <th>家长电话</th>
              <th>关系</th>
            </thead>
            <tbody>
              <tr>
                <td>{{params.grade}}</td>
                <td>{{params.parent_name}}</td>
                <td>{{params.parent_telephone}}</td>
                <td>{{params.parent_relation}}</td>
              </tr>
            </tbody>
          </table>
        </el-col>
      </el-row>
    </div>
    <el-row class="classInfo_title">
      <el-col :span="2">
        <div class="grid-content">
          <h3 class="class_title">所在班级</h3>
        </div>
      </el-col>
      <!-- <el-button type="primary" @click="newClass(1)" class="cac-button-two create-class" v-if="is_teach">新添加面授班级</el-button>
      <el-button type="primary" @click="newClass(2)" class="cac-button-two create-class" v-if="is_live">新添加双师班级</el-button> -->
      <el-col :span="20">
        <div class="grid-content"></div>
      </el-col>
    </el-row>
    <el-tabs v-model="currentTab">
      <div class="tableTitle">
        <ul>
          <li v-for="(item,i) in ClassOption" :key="i" @click="getAllClass(i)" :class="{'actice_tableTitle':i===type}">{{item}}</li>
        </ul>
      </div>
      <el-table :data="classInfo_all" highlight-current-row style="width: 100%" height="288" border>
        <el-table-column align="center" label="班级名称" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.class_name || '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="teacher_name" label="教师" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.teacher_name || '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="campus_name" label="校区" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="student_count" label="学员数" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="start_end_time" label="课程起止日期" width="200px" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="join_time" label="加入班级时间" width="200px" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column align="center" label="操作" min-width="125px">
          <template slot-scope="scope">
            <el-button type="text" @click="transformClass(scope.row)" :disabled="scope.row.status===3">转班</el-button>
            <el-button type="text" @click="handleDelete(scope.$index,scope.row)" :disabled="scope.row.status===3">退班</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-tabs>
    <el-dialog title="添加班级" :visible.sync="dialogTableVisible" width="1050px" top="5vh">
      <ChooseClass :update="update" v-on:transformParams="doSubmit" :current_id="currentClassId" :class_type="currentClassType"></ChooseClass>
    </el-dialog>
    <!-- 转班 -->
    <el-dialog title="添加班级" :visible.sync="dialogTableVisible1" width="1050px" top="5vh">
      <RadioClass :update="update" v-on:transformParams="doSubmit" :current_id="currentClassId" :class_type="currentClassType"></RadioClass>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import studentApi from '@/services/student'
import receptionApi from '@/services/reception'
import authUtils from '../../services/auth/utils'
import classroomApi from '@/services/classroom'
import ChooseClass from '@/components/chooseClass'
import RadioClass from '@/components/radioClass'
export default {
  data () {
    return {
      currentTab: 'first',
      dialogTableVisible: false,
      dialogTableVisible1: false,
      tableData: [],
      student_id: this.$route.query.id,
      studentvd_id: -1,
      params: {
        grade: '',
        gender: '',
        name: '',
        telephone: '',
        birthday: '',
        parent_name: '',
        parent_relation: '',
        parent_telephone: ''
      },
      classInfo_all: [],
      classInfo_current: [],
      classInfo_history: [],
      ClassOption: ['全部班级', '当前班级', '历史班级'],
      update: false,
      transform: false,
      type: 0,
      editType: 0, // 0是新添加班级 1是转班
      currentClassId: 0,
      currentClassType: 0,
      is_teach: 0,
      is_live: 1,
      canSubmit: true
    }
  },
  components: { ChooseClass: ChooseClass, RadioClass: RadioClass },
  created () {
    this.getUser()
    this.getStudent()
    this.getAllClass(this.type)
  },
  methods: {
    getUser () {
      this.is_teach = authUtils.getUser() && authUtils.getUser().is_teach
      this.is_live = authUtils.getUser() && authUtils.getUser().is_live
    },
    getStudent () {
      let params = {
        'student_id': this.student_id
      }
      studentApi.queryDetail(params).then(res => {
        if (res.ok) {
          this.params = res.data
          this.params.gender = Number(this.params.gender)
        }
      })
    },
    getAllClass (type) {
      this.type = type
      let params = {
        'type': type,
        'student_id': this.student_id
      }
      studentApi.queryClass(params).then(res => {
        if (res.ok) {
          this.classInfo_all = res.data.list
        }
      })
    },
    transformClass (row) {
      this.editType = 1
      this.dialogTableVisible1 = true
      this.currentClassId = row.class_id
      this.currentClassType = row.class_type
      this.update = !this.update
    },
    // 退班
    handleDelete (index, row) {
      this.$confirm('是否确定退出该班级?', '提示', {
        confirmButtonText: '确 定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        cancelButtonText: '取 消',
        cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
      }).then(() => {
        // let params = {
        //   'class_id': row.class_id,
        //   'student_id': this.student_id,
        //   'vd_student_id': this.params.vd_id,
        //   'class_type': row.class_type
        // }
        let params = {
          student_id: this.student_id,
          class_id: row.class_id,
          remark: '退班'
        }
        receptionApi.quitClass(params).then(res => {
          if (res.ok) {
            this.refresh(null)
            EventHub.$emit('updateStudent', true)
            this.$message({
              type: 'success',
              message: '退班成功',
              center: true
            })
          }
        })
        classroomApi.studentDelete(params).then(res => {
          if (res.ok) {
            this.getAllClass(this.type)
            this.$message({
              type: 'success',
              message: '退班成功',
              center: true
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退班',
          center: true
        })
      })
    },
    doSubmit (data) {
      if (this.canSubmit) {
        this.canSubmit = false
        if (this.editType) {
          // 1 转班
          let params = {
            'src_class_id': this.currentClassId,
            'student_id': this.student_id,
            'vd_student_id': this.params.vd_id,
            'tar_class_id': data
          }
          let loadingInstance = this.$loading({
            text: '提交中...'
          })
          if (!params.vd_student_id) {
            params.vd_student_id = 0
          }
          receptionApi.transferClass(params).then(res => {
            setTimeout(() => {
              loadingInstance.close()
              this.canSubmit = true
            }, 500)
            if (res.ok) {
              this.update = !this.update
              this.dialogTableVisible1 = false
              this.getStudent()
            }
          })
        } else {
          // 0新添加班级
          let params = {
            'student_id': this.student_id,
            'vd_student_id': this.params.vd_id,
            'class_type': this.currentClassType,
            'class_ids': data
          }
          let loadingInstance = this.$loading({
            text: '提交中...'
          })
          studentApi.studentInsert(params).then(res => {
            setTimeout(() => {
              loadingInstance.close()
              this.canSubmit = true
            }, 500)
            if (res.ok) {
              this.update = !this.update
              this.getAllClass(this.type)
              this.dialogTableVisible = false
            }
          })
        }
      }
    },
    newClass (type) {
      this.currentClassType = type
      this.editType = 0
      this.dialogTableVisible = true
      this.update = !this.update
    }
  }
}
</script>

<style scoped>
.baseInfo_title {
  height: 61px;
  text-align: left;
  padding-top: 11px;
  font-size: 18px;
  color: #333;
  line-height: 50px;
}

.baseInfo_content .field td,
.baseInfo_content .field th {
  width: 25%;
}

.classInfo_title {
  text-align: left;
  line-height: 38px;
  margin-top: 20px;
}

.tableTitle {
  width: 300px;
  margin-top: 12px;
  margin-bottom: 20px;
}
.tableTitle ul {
  display: flex;
  margin-bottom: 15px;
}
.tableTitle ul li {
  flex: 1;
  font-size: 16px;
  cursor: pointer;
  text-align: left;
}
.tableTitle ul li:active,
.tableTitle ul li:hover {
  color: #3a9cff;
}
.create-class {
  width: 150px;
  text-align: center;
  margin-left: 20px;
}
.class_title {
  font-size: 18px;
  color: #333;
}
.actice_tableTitle {
  color: #3a9cff;
}
</style>
