import CRUD from '../CRUD'

class Teacher extends CRUD {
  constructor () {
    super()
    this.queryUrl = '/ws/api/user/getTeachers'

    this.queryTeacherUrl = '/ws/api/class/teacherInfo'
  }
  queryStudenEdit () {
    return this.sendGet( this.queryStudenEditUrl)
  }
  // 获取教师里lie'biao
  querylist (params) {
    return this.sendGet(this.queryUrl, params)
  }
  // 获取教师详细信息
  queryTeacherInfo (params) {
    return this.sendGet(this.queryTeacherUrl, params)
  }
  // 学生插班
  studentInsert (params) {
    return this.sendPost(this.studentInsertUrl, params).then(res => {
      this.handleError(res)
      return res
    })
  }
  // 获取学生列表（全部或未分班）
  getStudentList (params) {
    return this.sendGet('/phoenix/eduadmin/scene/wait-class-student-list', params)
  }
  getAddStudentList (params) {
    let obj = {}
    for (var p in params) {
      if (p !== 'status') {
        obj[p] = params[p]
      }
    }
    if (params.status * 1 === 2) {
      obj.status = 2
    }
    return this.sendGet('/phoenix/eduadmin/scene/class-student-list', obj)
  }
}

export default new Teacher()
