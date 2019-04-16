<template>
  <div>
    <h3 class="main-bk">{{ title }}</h3>
    <p>您好！{{provider}}：</p>
    <p>{{companyName}}的{{name}}向您发来了一个面料采购信息！</p>
    <div class="imgs" >
      <!--图片轮播-->
      <!--<van-swipe :autoplay="3000" style="height: 100%;width: 100%">-->
        <!--<van-swipe-item v-for="(url, index) in imageList" :key="index" style="height: 100%;width: 100%;float: left">-->
          <!--&lt;!&ndash;<img v-lazy="url" alt="布料图片" @click="clickImg($event)"/>&ndash;&gt;-->
          <!--<img :src="url" alt="布料图片" @click="clickImg($event)"/>-->
          <!--<big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>-->
        <!--</van-swipe-item>-->
      <!--</van-swipe>-->
      <img v-for="(url,index) in imageList" :key="index" v-lazy="url" alt="布料图片" @click="clickImg($event)">
      <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
    </div>
    <div class="line"></div>
    <div class="desc">
      <van-field
        v-model="type"
        type="text"
        placeholder=""
        label="类型："
        :readonly="true"
      />
      <van-field
        v-model="expireTime"
        type="text"
        label="有效期至："
        :readonly="true"
      />
      <van-field
        v-model="customization"
        type="text"
        label="可否定制："
        placeholder=""
        :readonly="true"
      />
      <!--<p style="font-weight: bolder;margin: 0 15px">面料说明：</p>-->
      <van-field
        v-model="desc"
        type="textarea"
        placeholder=""
        label="面料说明："
        :autosize="{minHeight: 70}"
        :readonly="true"
      />
    </div>
    <div class="line"></div>
    <h4 >请进入“找布买布”，接这一单</h4>
      <van-button @click="accept" style="" class="bt-bright bt-accept">
        接单
     </van-button>
  </div>
</template>

<script>
import BigImg from '../../src/components/BigImg'
import {CUSTOMIZE, TYPE, formatDate, BASEURL, API, setSpot} from '../assets/js/common.js'
// import {CUSTOMIZE, TYPE, formatDate, BASEURL, API} from '../assets/js/common.js'
export default {
  components: {'big-img': BigImg, CUSTOMIZE, TYPE, formatDate},
  data () {
    return {
      title: '找布买布',
      showImg: false,
      imgSrc: '',
      provider: '',
      companyName: '',
      name: '',
      customization: '',
      desc: '',
      type: '',
      expireTime: '',
      providerId: 0,
      inquiryId: 0,
      imageList: []
    }
  },
  created () {
    setSpot('在新需求单页：main', 'main=>I am counting!')
    let code = sessionStorage.getItem('code')
    this.init(code)
  },
  methods: {
    init (code) {
      let url = API + '/show.do?cmd=querySendInfoByCode&code=' + String(code)
      this.axios.get(BASEURL + url).then(res => {
        console.log('main=>init=>res', res)
        let response = res.data
        if (response.exId) {
          this.$notify(response.exDesc)
          this.$router.push('/')
        } else {
          this.provider = response.provider.name
          this.companyName = response.inquiry.companyName
          this.name = response.inquiry.name
          let timestamp = response.inquiry.expireTime
          this.expireTime = formatDate(timestamp)
          let typeId = response.inquiry.type
          this.type = TYPE[typeId]
          let customizationId = response.inquiry.acceptCustomize
          this.customization = CUSTOMIZE[customizationId]
          this.desc = response.inquiry.desc
          this.providerId = response.userId
          this.inquiryId = response.inquiryId
          let imgList = response.inquiry.imageList
          this.imageList = imgList
          // 减少路由传参，使用sessionStorage
          sessionStorage.setItem('providerId', this.providerId)
          sessionStorage.setItem('inquiryId', this.inquiryId)
          // sessionStorage.setItem('oldInquiryId', this.inquiryId)
          sessionStorage.setItem('flag', 'w')
          // 存储供应商的基本信息
          let providerInfo = {
            'providerId': response.userId,
            'companyName': response.provider.name,
            'name': response.provider.linkman,
            'phone': response.provider.regTel,
            'address': response.provider.address,
            'keywords': response.provider.busiKeywords
          }
          sessionStorage.setItem('providerInfo', JSON.stringify(providerInfo))
          this.chooseEntrance()
        }
      }).catch(err => {
        alert('网络异常' + err)
      })
    },
    accept () {
      this.$router.replace({name: 'Customer'})
    },
    chooseEntrance () {
      // 判断是否已经接了该单
      if (this.providerId <= 0 || this.inquiryId <= 0) { // Id异常
        this.$notify('this.providerId:' + String(this.providerId) + '；this.inquiryId:' + String(this.inquiryId))
        return false
      }
      let url = API + '/show.do?'
      let formdata = {
        'cmd': 'getInquiryReceiptList',
        'userId': this.providerId,
        'page': 0,
        'pageSize': 10,
        'inquiryId': this.inquiryId,
        'status': -1
      }
      this.axios.post(BASEURL + url, this.qs.stringify(formdata)).then(res => {
        if (res.data.exId) {
          this.$notify(res.data.exDesc)
        } else {
          let tmpList = res.data.list
          if (tmpList.length > 0) {
            // 已接单，跳到已接单列表
            this.$router.push({name: 'OrdersList'})
          }
        }
      }).catch(function (error) {
        console.log('error', error)
        this.$notify('网络异常，请稍后重试！')
      })
    },
    clickImg (e) {
      this.showImg = true
      // 获取当前图片地址
      this.imgSrc = e.currentTarget.src
      // this.imgSrc = e.target.dataset.src
    },
    viewImg () {
      this.showImg = false
    }
  }
}
</script>

<style scoped>
  @import '../assets/css/mycss.css';
</style>
