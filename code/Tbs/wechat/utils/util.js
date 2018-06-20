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

// 获取当前页面的url并带参数
const getCurrentPageUrl = () => {
  let page = getCurrentPages();
  let current = page[page.length - 1];
  let params = '';
  for (let k in current.options) {
    params += k + '=' + current.options[k] + '&'
  }
  let url = current.route + '?' + params;
  return url;
}

module.exports = {
  formatTime: formatTime,
  getCurrentPageUrl
}