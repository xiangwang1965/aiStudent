/**
 * 用于日期补0
 * @param { Number } n
 */
export function padZero (n) {
  if (n % 1 === 0 && n < 10) {
    return '0' + n
  } else {
    return n
  }
}

/**
 * 获取最近的一周中的某一天
 * @param { Date } date 日期对象
 * @param { Number } symbol 代表周几的标志 0 每天 1234567 周几
 * @return { Date }
 */
export function getNextWeekday (date, symbol) {
  if (typeof date !== 'object') {
    date = new Date(date)
  }
  let dayOfWeek = date.getDay()
  let offset = 0
  if (symbol === 7) { // 每天就返回课程开始日期
    return date
  }
  if (symbol > dayOfWeek) { // 周几大于今天的周几，最近的一天就是本周内的
    offset = symbol - dayOfWeek
  } else if (symbol < dayOfWeek) { // 最近的一天在下周
    offset = symbol + 7 - dayOfWeek
  }
  return getOffsetDate(offset, date)
}

/**
 * jqueryui的datepicker的string转日期
 * @param { String } offset [-][+]20[y][m][w][d] 表示偏移多少
 * @param { String } date 可选，初始计算的日期，若不传则为现在
 * @return { Date }
 */
export function getOffsetDate (offset, date) {
  date = date ? new Date(date) : new Date()
  var year = date.getFullYear()
  var month = date.getMonth()
  var day = date.getDate()
  var pattern = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g
  var matches = pattern.exec(offset)
  while (matches) {
    switch (matches[2] || 'd') {
      case 'd':
      case 'D':
        day += parseInt(matches[1], 10)
        break
      case 'w':
      case 'W':
        day += parseInt(matches[1], 10) * 7
        break
      case 'm':
      case 'M':
        month += parseInt(matches[1], 10)
        break
      case 'y':
      case 'Y':
        year += parseInt(matches[1], 10)
        break
    }
    matches = pattern.exec(offset)
  }
  var offsetDate = new Date(year, month, day)
  return offsetDate
}

/**
 * 日期格式转换为yyyy-MM-dd
 * @param { Date } date
 * @return { String }
 */
export function formatDate (date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  // var second = date.getSeconds()
  hour = hour >= 10 ? hour : '0' + hour
  minute = minute >= 10 ? minute : '0' + minute
  function formatTen (num) {
    return num > 9 ? (num + '') : ('0' + num)
  }
  return year + '-' + formatTen(month) + '-' + formatTen(day) + ' ' + hour + ':' + minute
}

/**
 * 时间戳转换为日期yyyy.MM.dd
 * @param { Date } date
 * @return { String }
 */
export function formatDay (timeStamp) {
  var date = new Date(timeStamp)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  function formatTen (num) {
    return num > 9 ? (num + '') : ('0' + num)
  }
  return year + '-' + formatTen(month) + '-' + formatTen(day)
}

/**
 * 时间戳转换为时间hh:mm
 * @param { Date } date
 * @return { String }
 */
export function formatTime (timeStamp, secondType) {
  var date = new Date(timeStamp)
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  hour = hour >= 10 ? hour : '0' + hour
  minute = minute >= 10 ? minute : '0' + minute
  second = second >= 10 ? second : '0' + second
  switch (secondType) {
    case 'ss':
      return hour + ':' + minute + ':' + second
    default :
      return hour + ':' + minute
  }
}

/**
 * 日期格式转换为标准时间
 * @param { String } date
 * @return { Date }
 */
export function formatDateTime (datatime) {
  var temp = []
  temp = datatime.split(' ')
  var data = temp[0]
  var time = temp[1]
  var y = data.split('-')[0]
  var mn = data.split('-')[1] - 1
  var d = data.split('-')[2]
  var h = time.split(':')[0]
  var mu = time.split(':')[1]
  var s = time.split(':')[2]
  return new Date(y, mn, d, h, mu, s)
}

/**
 * 生成n位随机数
 * @param { Number }
 * @return { Number }
 */
export function RndNumber (n) {
  var rnd = ''
  for (var i = 0; i < n; i++) {
    rnd += Math.floor(Math.random() * 10)
  }
  return rnd
}

export function getObjectURL (file) {
  var url = null
  if (window.createObjectURL !== undefined) {
    url = window.createObjectURL(file)
  } else if (window.URL !== undefined) {
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL !== undefined) {
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}

export function deleteArray (array, key, value) {
  var index = -1
  if (Array.isArray(array)) {
    array.forEach((item, i) => {
      if (item[key] === value) {
        index = i
      }
    })
  }
  array.splice(index, 1)
  return array
}

export function getStartEnd (start, end) {
  typeof start === 'string' && (start = start.split(' ')[0])
  typeof end === 'string' && (end = end.split(' ')[0])
  return start + '至' + end
}

export function getStartDate (timeStamp) {
  var date = new Date(timeStamp)
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return timeStamp - hour * 60 * 60 * 1000 - minute * 60 * 1000 - second * 1000
}

// 判断图片地址是否为图片，是返回地址，不是返回''
export function imageFormat (imgurl) {
  var ImgObj = new Image()
  ImgObj.src = imgurl
  if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
    return imgurl
  } else {
    return ''
  }
}

// 判断是否为浮点数，浮点数保留两位小数，非浮点数补两个0
export function twoFloatFormat (num) {
  num = isNaN(num * 1) ? 0 : num * 1
  var str = num + ''
  var arr = str.split('.')
  if (!arr[1]) {
    return num + '.00'
  }
  if (arr[1].length === 1) {
    return num + '0'
  }
  if (arr[1].length >= 2) {
    return num.toFixed(2)
  }
}

// 处理参数为空
export const handleQueryNull = function (obj) {
  let newObj = {}
  for (let key in obj) {
    if (obj[key] !== '') {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

// 是否再次请求（请求页码大于返回数据可分页数）
export function requireAgainPage (obj) {
  let count = obj.total || obj.total_count || obj.totalNum
  let page = obj.page
  let perPage = obj.per_page || obj.page_size
  if (page > Math.ceil(count / perPage)) {
    page = Math.ceil(count / perPage)
  } else {
    page = -1
  }
  return page
}

export function readFileAsBase64 (file) {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result.replace(/^data:.+;base64,/, ''))
      }
    })
  }
