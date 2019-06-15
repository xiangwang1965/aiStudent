/**
 * 生成pdf查看所需的参数
 * 参数详见 http://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf
 * @param { Object } params pagemode | scrollbar | toolbar | statusbar | navpanes
 */
export function genParams (params) {
  let str = '#'
  for (var i in params) {
    str += i + '='
    str += params[i] + '&'
  }
  return str.slice(0, -1)
}

export default {
  genParams
}
