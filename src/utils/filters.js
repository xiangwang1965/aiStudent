// 课程必修类型
export function studentGrade (input) {
  const hash = {
    1: '一年级',
    2: '二年级',
    3: '三年级',
    4: '四年级',
    5: '五年级',
    6: '六年级'
  }
  return hash[input]
}

export function gender (input) {
  const hash = {
    1: '男',
    2: '女',
    3: '未知'
  }
  return hash[input]
}

export default {
  studentGrade,
  gender
}
