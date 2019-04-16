<template>
  <div>
    <van-nav-bar
      title="物流状态"
      left-arrow
      @click-left="back"
      class="main-bk header"
    />
    <div class="content">
      <span class="p-header">快递公司：{{trackingContent.company}}</span>
      <span class="p-header" style="float: right">运单号：{{trackingContent.no}}</span>
      <div>
        <p v-for="item in trackingContent.list" :key="item.datetime">
          <span style="color: #ff4f4f;font-size: 12px">{{item.datetime}}</span><span>{{item.remark}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {BASEURL, API} from '../../assets/js/common.js'
export default {
  data () {
    return {
      trackingContent: {},
      number: '',
      receiverPhone: '',
      companyType: ''
    }
  },
  created () {
    let express = this.$route.params.express
    this.number = express.number
    this.receiverPhone = express.receiverPhone.substring(express.receiverPhone.length - 4) // 截取最后四位
    this.companyType = express.companyType
    this.getExpressStatus()
  },
  methods: {
    getExpressStatus () {
      let url = API + '/show.do?' // 可以提取做公共部分
      let formdata = {
        'cmd': 'queryDeliveryInfo',
        'appName': 3,
        'companyType': this.companyType,
        'number': this.number,
        'receiverPhone': this.receiverPhone
      }
      this.axios.post(BASEURL + url, this.qs.stringify(formdata)).then(res => {
        console.log('Express=>res', res)
        if (res.data.exId) {
          this.$notify(res.data.exDesc)
        } else {
          this.trackingContent = res.data
        }
      })
    },
    back () {
      this.$router.push({name: 'OrdersList'})
    }
  }
}
</script>

<style scoped>
  @import '../../assets/css/mycss.css';
</style>
