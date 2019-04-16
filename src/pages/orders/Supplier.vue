<template>
  <div>
    <van-nav-bar
      title="供应商回样单"
      left-arrow
      @click-left="back"
      class="main-bk"
    />
    <div class="imgs" >
      <img v-for="(url,kk) in  showData.imgList" :key="kk" v-lazy="url" alt="布料图片" @click="clickImg($event)">
      <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
    </div>
    <div class="line"></div>
    <p style="font-weight: bolder;font-size: 18px">回样说明：</p>
    <div class="desc">
      <van-field
        v-model="showData.colorCode"
        type="text"
        label="色卡编号："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="showData.productName"
        type="text"
        label="品名："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="showData.ingredients"
        type="text"
        label="成分："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="showData.width"
        type="text"
        label="幅宽："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="showData.weight"
        type="text"
        label="克重："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="showData.price"
        type="text"
        label="剪版价："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="showData.inStock"
        type="text"
        label="是否现货："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="showData.samplePrice"
        type="tel"
        label="调样价格："
        placeholder="免费"
        :readonly="true"
      />
      <van-field
        v-model="showData.desc"
        type="textarea"
        label="面料说明："
        placeholder=""
        :autosize="{minHeight: 70}"
        :readonly="true"
      />
    </div>
    <div class="line"></div>
    <p class="p-header">供应商信息：</p>
    <div class="com-info">
      <van-field
        v-model="comInfo.companyName"
        type="text"
        label="公司名称："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="comInfo.name"
        type="text"
        label="姓名："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="comInfo.phone"
        type="text"
        label="移动电话："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="comInfo.address"
        type="textarea"
        label="收货地址："
        placeholder=""
        :readonly="true"
      />
    </div>
  </div>
</template>

<script>
import BigImg from '../../../src/components/BigImg'
import {BASEURL, API, SPOTSTATUS, pushHistory, setSpot} from '../../assets/js/common.js'
export default {
  components: {BigImg},
  data () {
    return {
      showImg: false,
      imgSrc: '',
      showData: {},
      receiptId: 0,
      comInfo: {}
    }
  },
  created () {
    setSpot('在供应商回单信息页：supplier', 'supplier=>I am counting!')
    // 供应商信息使用缓存(or使用响应返回的数据/res.data.rawMaterialProvider属性)
    this.comInfo = JSON.parse(sessionStorage.getItem('providerInfo'))
    this.receiptId = sessionStorage.getItem('receiptId')
    // 回单信息
    this.showData = {
      'desc': '',
      'samplePrice': 0.0,
      'inStock': '',
      'price': 0.0,
      'weight': '',
      'width': '',
      'ingredients': '',
      'productName': '',
      'colorCode': '',
      'imgList': []
    }
    this.getFeedBackDetail()
  },
  mounted () {
    pushHistory()
    // 监听历史记录点, 添加返回事件监听
    window.onpopstate = () => {
      // 输入要返回的上一级路由地址
      this.$router.push({name: 'OrdersList'})
    }
  },
  methods: {
    getFeedBackDetail () { // 获取供应商回单信息详情
      if (this.receiptId <= 0) { // Id异常不操作
        this.$notify('this.receiptId:' + String(this.receiptId) + '; 请联系管理员！')
        return false
      }
      let url = API + '/show.do?'
      let queryDatas = {
      }
      let formdata = {
        'cmd': 'queryInquiryReceipt',
        'queryDatas': JSON.stringify(queryDatas),
        'receiptId': this.receiptId
      }
      this.axios.post(BASEURL + url, this.qs.stringify(formdata)).then(res => {
        if (res.data.exId) {
          this.$notify(res.data.exDesc)
        } else {
          this.setShowData(res.data)
        }
      })
    },
    setShowData (data) {
      this.showData['desc'] = data.description
      this.showData['samplePrice'] = String(data.samplePrice) + '元/米'
      this.showData['inStock'] = SPOTSTATUS[data.spotStatus]
      this.showData['price'] = String(data.unitPrice) + '元/米'
      this.showData['weight'] = data.weight
      this.showData['width'] = data.width
      this.showData['ingredients'] = data.ingredients
      this.showData['productName'] = data.productName
      this.showData['colorCode'] = data.colorCardCode
      this.showData['imgList'] = data.imgUrlListValue
    },
    back () {
      this.$router.push({name: 'OrdersList'})
    },
    clickImg (e) {
      this.showImg = true
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
  @import '../../assets/css/mycss.css';
</style>
