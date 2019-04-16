// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './http'
import VueLazyload from 'vue-lazyload'
import 'vant/lib/index.css'
// import querystring from 'querystring'
import qs from 'qs'
import {
  Button,
  Tab,
  Tabs,
  NavBar,
  Uploader,
  Icon,
  RadioGroup,
  Radio,
  Area,
  Checkbox,
  CheckboxGroup,
  Swipe,
  SwipeItem,
  Field,
  AddressEdit,
  Cell,
  CellGroup,
  Card,
  Toast,
  Tag,
  Lazyload,
  Notify,
  PullRefresh,
  List,
  Loading
  // ImagePreview  // 图片预览
} from 'vant'

Vue.use(Button)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(NavBar)
Vue.use(Uploader)
Vue.use(Icon)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Area)
Vue.use(Checkbox).use(CheckboxGroup)
Vue.use(Swipe).use(SwipeItem)
Vue.use(Field)
Vue.use(AddressEdit)
Vue.use(Cell).use(CellGroup)
Vue.use(Toast)
Vue.use(Card)
Vue.use(Tag)
Vue.use(Notify)
Vue.use(Lazyload) // <img v-for="img in imageList" v-lazy="img" >
Vue.use(PullRefresh).use(List)
Vue.use(Loading)

// 依据当前url判断
let url = window.location.host
if (url.indexOf('ts.ebdaowei') !== -1) { // 测试环境
  var _hmt = _hmt || []
  window._hmt = _hmt; // 必须把_hmt挂载到window下，否则找不到
  (function () {
    var hm = document.createElement('script')
    hm.src = 'https://hm.baidu.com/hm.js?f54bf5b56a164fd10c929fbf0623a19a'
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(hm, s)
  })()
}
if (url.indexOf('desk.ebudaowei') !== -1) { // 生产环境
  var _hmtl = _hmt || []
  window._hmtl = _hmtl; // 必须把_hmtl挂载到window下，否则找不到
  (function () {
    var hm = document.createElement('script')
    hm.src = 'https://hm.baidu.com/hm.js?60ae9cc3e0d205ee7728f70d9fc88e32'
    var s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(hm, s)
  })()
}

Vue.config.productionTip = false
Vue.prototype.qs = qs
// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.axios = axios
Vue.prototype.$notify = Notify

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./assets/img/error.png'),
  loading: require('./assets/img/Loading.png'),
  attempt: 3
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  components: { App },
  template: '<App/>'
})
