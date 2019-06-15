// 将文件读取为 base64
export function readFileAsBase64 (file) {
  var reader = new FileReader()
  reader.readAsDataURL(file)
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result.replace(/^data:.+;base64,/, ''))
    }
  })
}
