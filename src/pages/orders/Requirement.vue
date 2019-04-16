<template>
  <div>
    <van-nav-bar
      title="需求单"
      left-arrow
      @click-left="back"
      class="main-bk header"
    />
    <div class="imgs" >
      <img v-for="(url,kk) in detailData.imgList" :key="kk"  v-lazy="url" alt="布料图片" @click="clickImg($event)">
      <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
    </div>
    <div class="line"></div>
    <p class="p-header">需求说明：</p>
    <div class="desc">
      <van-field
        v-model="detailData.clothType"
        type="text"
        label="面料种类："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="detailData.type"
        type="text"
        label="类型："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="detailData.expireTime"
        type="text"
        label="有效期至："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="detailData.acceptCustomize"
        type="text"
        label="可否定制："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="detailData.desc"
        type="textarea"
        label="面料说明："
        placeholder=""
        :autosize="{minHeight: 70}"
        :readonly="true"
      />
    </div>
    <div class="line"></div>
    <div class="com-info">
      <van-field
        v-model="detailData.companyName"
        type="text"
        label="公司名称："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="detailData.name"
        type="text"
        label="姓名："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="detailData.phone"
        type="text"
        label="移动电话："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="address"
        type="textarea"
        label="收货地址："
        placeholder=""
        :readonly="true"
      />
    </div>
    <div v-if="flag==='w'">
      <van-button class="bt-bright bt-big" @click="go('accept')">我要接这单</van-button>
    </div>
    <div v-else class="req-more">
      <div class="line"></div>
      <p class="p-header">回单信息：</p>
      <van-card>
        <div slot="thumb">
          <img :src="feedBackData.img" alt="样布图片" class="card-img"/>
        </div>
        <div slot="title">
          <span style="">色卡编号：{{feedBackData.colorCode}}</span>
          <span class="req-feedback" style="color: red">{{feedBackData.acceptDate}}</span>
        </div>
        <div slot="desc" style="margin: 15px 0">
          <span>剪版价：{{feedBackData.price}}</span>
          <span class="req-feedback">{{feedBackData.sendSatus}}</span>
        </div>
        <div slot="tags">
          <span>调样价格：{{feedBackData.samplePrice}}</span>
          <span class="req-feedback">
            <van-button class="bt-check bt-bright" @click="goSupplier">
               查看
            </van-button>
          </span>
        </div>
        <div slot="footer" v-if="express.number" style="padding: 20px 0">
          <span style="float: left;line-height: 30px">物流信息：{{express.company}}|{{express.number}}</span>
          <span class="req-feedback">
            <van-button class="bt-check bt-bright" @click="copyNumber">
             复制快递单号
          </van-button>
          </span>
          <!--预留跳转到快递详情-->
          <!--<button class="bt-express">-->
          <!--<router-link :to="{name: 'Express',params: {'express': this.express}}" class="bt-express">-->
          <!--查看快递状态-->
          <!--</router-link>-->
          <!--</button>-->
        </div>
      </van-card>
    </div>
  </div>
</template>

<script>
import {formatDate, CUSTOMIZE, TYPE, CLOTHSTYLE, SENDSTATUS, BASEURL, API, pushHistory, setSpot} from '../../assets/js/common.js'
import {handleClipboard} from '../../assets/js/clipboard'
import BigImg from '../../../src/components/BigImg'

export default {
  components: {'big-img': BigImg},
  data () {
    return {
      showImg: false,
      imgSrc: '',
      detailData: {},
      inquiryId: 0,
      providerId: 0,
      flag: '',
      address: '',
      feedBackData: {
        'img': '',
        'colorCode': '',
        'price': '',
        'samplePrice': '',
        'acceptDate': '',
        'sendSatus': ''
      },
      express: {}
    }
  },
  created () {
    setSpot('在需求单详情页：requirement', 'requirement=>I am counting!')
    this.flag = sessionStorage.getItem('flag')
    this.providerId = sessionStorage.getItem('providerId')
    this.inquiryId = sessionStorage.getItem('inquiryId')
    if (this.flag === 'g') { // 已经接单了，可以获取回单信息
      this.getFeedBackData()
    }
    this.getHttpData(this.inquiryId) // 获取详细需求信息
  },
  mounted () {
    pushHistory()
    // 监听历史记录点, 添加返回事件监听
    window.onpopstate = () => {
      this.$router.push({name: 'OrdersList'})
    }
  },
  methods: {
    goSupplier () {
      this.$router.push({name: 'Supplier'})
    },
    copyNumber () { // 物流单号复制
      handleClipboard(this.express.number, event, () => {
        this.$notify('单号已经复制在剪贴版')
      }, () => {
        this.$notify('单号复制失败！')
      })
    },
    getFeedBackData () { // 获取供应商回单信息
      let url = API + '/show.do?'
      let formdata = {
        'cmd': 'getInquiryReceiptList',
        'userId': this.providerId,
        'page': 0,
        'pageSize': 10,
        'inquiryId': this.inquiryId,
        'status': -1
      }
      if (this.providerId <= 0 || this.inquiryId <= 0) { // Id异常
        this.$notify('this.providerId:' + String(this.providerId) + ',this.inquiryId:' + String(this.inquiryId))
        return false
      }
      this.axios.post(BASEURL + url, this.qs.stringify(formdata)).then(res => {
        if (res.data.exId) {
          this.$notify(res.data.exDesc)
        } else {
          // item.receiptList[0]?item.receiptList[0].colorCardCode||'':''
          this.feedBackData['img'] = res.data.list[0] ? res.data.list[0].imgUrlListValue[0] : require('../../assets/zsi.png')
          this.feedBackData['colorCode'] = res.data.list[0] ? res.data.list[0].colorCardCode : 'ASD00000000'
          this.feedBackData['price'] = String(res.data.list[0].unitPrice) + '/米'
          this.feedBackData['samplePrice'] = String(res.data.list[0].samplePrice) + '/米'
          this.feedBackData['acceptDate'] = formatDate(res.data.list[0].createTime)
          this.feedBackData['sendSatus'] = SENDSTATUS[res.data.list[0].status]
        }
      })
    },
    getHttpData (inquiryId) { // 获取需求详细信息
      let url = API + '/show.do?'
      let formData = {
        'cmd': 'queryInquiryDetail',
        'inquiryId': inquiryId
      }
      if (this.inquiryId <= 0) { // Id异常
        this.$notify('this.inquiryId:' + String(this.inquiryId))
        return false
      }
      this.axios.post(url, this.qs.stringify(formData)).then(
        res => {
          let response = res.data
          if (response.exId) {
            this.$notify(response.exDesc)
            this.back()
          } else {
            this.detailData['imgList'] = response.imageList
            this.detailData['clothType'] = this.getClothType(response.keywords) // response.imageList
            this.detailData['expireTime'] = formatDate(response.expireTime)
            this.detailData['companyName'] = response.companyName
            this.detailData['name'] = response.name
            this.detailData['phone'] = response.phone
            this.detailData['type'] = TYPE[response.type]
            this.detailData['acceptCustomize'] = CUSTOMIZE[response.acceptCustomize]
            this.detailData['desc'] = response.desc
            this.address = response.address
            if (response.trackingNum) { // 如果有物流信息,
              this.express.company = response.deliCom
              this.express.number = response.trackingNum
              this.express.companyType = response.deliType
              this.express.receiverPhone = response.phone
            }
          }
        }
      ).catch(function (error) {
        console.log('error', error)
      })
    },
    back () {
      this.$router.push({name: 'OrdersList'})
    },
    go (mark) {
      if (mark === 'accept') {
        this.$router.push({name: 'Customer'})
      }
    },
    clickImg (e) {
      this.showImg = true
      // 获取当前图片地址
      this.imgSrc = e.currentTarget.src
      // this.imgSrc = e.target.dataset.src
    },
    viewImg () {
      this.showImg = false
    },
    getClothType (keyWords) { // 设置面料种类
      let first = CLOTHSTYLE[keyWords[0].groupId]
      let second = keyWords[0].keyword
      return first + '-' + second
    }
  }
}
</script>

<style scoped>
  @import '../../assets/css/mycss.css';
</style>
