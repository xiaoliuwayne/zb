/**
 * @Project: ZBMB
 * @FileName: common
 * @Author: wayne
 * @Date: 2019/3/27
 */

var CUSTOMIZE = {0: '不接受定制', 1: '接受定制'}
var TYPE = {1: '色卡', 2: '剪版'}
var STATUS = {0: '待接单', 1: '已接单'}
var SPOTSTATUS = {0: '有现货', 1: '无现货'}
var FEEDBACK_SPOTSTATUS = {'0': '现货', '1': '定制'}
var CLOTHSTYLE = {1: '针织', 2: '梭织'}
var SENDSTATUS = {0: '待确认调版', 1: '已确认调版'}

// 生产环境 http://desk.ebudaowei.cn/ebuapi/show.do?
// var BASEURL = 'http://desk.ebudaowei.cn'
// var API = '/ebuapi'

// ts. 测试环境
// var BASEURL = 'http://ts.ebdaowei.com' // 测试环境//////
// var API = '/ebuapi' // 测试环境

// 本地开发环境
var BASEURL = ''
var API = '/tsebuapi' // 开发环境api

function formatDate (timestamp) {
  let date = new Date(timestamp)
  let year = date.getFullYear()
  let month = date.getMonth() + 1 // 月份是从0开始的
  let day = date.getDate()
  let hour = date.getHours()
  let min = date.getMinutes()
  if (hour < 10) {
    hour = '0' + String(hour)
  }
  if (min < 10) {
    min = '0' + String(min)
  }
  // let sec = date.getSeconds()
  let newTime = year + '/' + month + '/' + day + ' ' + hour + ':' + min
  return newTime
}

// talkingData统计平台埋点
function setSpot (sendMsg, logMsg) {
  try {
    console.log(logMsg)
    window.TDAPP.onEvent(sendMsg)
    return true
  } catch (err) {
    console.log(logMsg + '=>err', err)
    return false
  }
}

// 存储当前历史记录点,实现控制手机物理返回键的按钮事件
var pushHistory = function () {
  let state = {
    title: '',
    url: ''
  }
  window.history.pushState(state, state.title, state.url)
}

export {CUSTOMIZE, TYPE, formatDate, STATUS, SPOTSTATUS, CLOTHSTYLE, FEEDBACK_SPOTSTATUS, SENDSTATUS, BASEURL, API, pushHistory, setSpot}
