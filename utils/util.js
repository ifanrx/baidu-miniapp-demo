const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * QQ 小程序的 Modal 框在 iPhone 测试超过屏幕后无法返回和关闭
 *
 * @example
 *    stringifyEllipse({a: "content very long"}) => "{"a" => "content..."
 *
 * @param {*} data
 * @param {number=} limit
 * @returns {string}
 */
const stringifyEllipse = (data, limit = 50) => JSON.stringify(data).slice(0, limit).concat('...')

export {
  formatTime,
  stringifyEllipse
}
