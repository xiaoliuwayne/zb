<template>
<div>
  <h3 class="main-bk">{{ title }}</h3>
  <van-tabs @click="onClick" color="#1aad19" v-model="active">
    <van-tab title="待接单">
      <van-card v-for="(item,hh) in showDatasWait" :key="hh" @click="goRequirement('w',item)">
        <div slot="thumb">
          <img :src="item.imgUrl" alt="样布图片" class="card-img"/>
        </div>
        <div slot="title">
          <span style="padding-right: 0.3rem">{{item.createTime}}</span>
          <span class="date-span" style="color: red">{{item.expireTime}}</span>
          <span class="date-span">{{item.status}}</span>
        </div>
        <div slot="desc">
          <div style="margin: 5px 0">面料种类：{{item.clothType}}</div>
          <div>说明：{{item.desc}}</div>
        </div>
      </van-card>
    </van-tab>
    <van-tab title="已接单">
      <van-card v-for="(item,gg) in showDatas" :key="gg">
        <div slot="thumb">
          <img :src="item.imgUrl" alt="样布图片" style="" class="card-img"/>
        </div>
        <div slot="title">
          <span style="padding-right: 0.3rem">{{item.createTime}}</span>
          <span class="date-span" style="color: red">{{item.expireTime}}</span>
          <span class="date-span">{{item.status}}</span>
        </div>
        <div slot="desc">
          <div style="margin: 5px 0">面料种类：{{item.clothType}}</div>
          <div>说明：{{item.desc}}</div>
        </div>
        <div slot="footer">
          <span class="card-footer">色卡编号：{{item.colorCode}}</span>
          <span class="card-footer">剪版价：{{item.price}}</span>
          <van-button @click="goRequirement('g',item)" class="bt-bright bt-check" >
            查看
          </van-button>
        </div>
      </van-card>
    </van-tab>
  </van-tabs>
</div>
</template>

<script>
import {STATUS, formatDate, CLOTHSTYLE, BASEURL, API, setSpot} from '../../assets/js/common.js'
export default {
  data () {
    return {
      active: 0, // van-tabs的v-model值是index
      title: '找布买布',
      page: 0,
      pageSize: 50, // 一页20条
      providerId: 0,
      inquiryId: 0,
      showDatas: [],
      showDatasWait: []
    }
  },
  created () {
    setSpot('在需求单列表页：ordersList', 'ordersList=>I am counting!')
    this.providerId = sessionStorage.getItem('providerId')
    this.inquiryId = sessionStorage.getItem('inquiryId') // 该id会不断更新，最初从Mian.vue中获得
    let flag = sessionStorage.getItem('flag')
    if (flag === 'w') {
      this.active = 0
      this.getHttpData(this.active)
    } else { // flag === 'g'
      this.active = 1
      this.getHttpData(this.active)
    }
  },
  methods: {
    getHttpData (responsedId) {
      if (this.providerId <= 0) { // Id异常
        this.$notify('this.providerId:' + String(this.providerId))
        return false
      }
      let url = API + '/show.do?'
      let param = {
        'sendProviderId': this.providerId,
        'responsed': responsedId
      }
      let formData = {
        'cmd': 'queryInquiryList',
        'param': JSON.stringify(param),
        'page': this.page,
        'pageSize': this.pageSize
      }
      this.axios.post(BASEURL + url, this.qs.stringify(formData)).then(
        res => {
          let response = res.data
          if (response.exId) {
            this.$notify(response.exDesc)
          } else {
            this.setShowDatas(response, responsedId)
          }
        }
      ).catch(function (error) {
        console.log('error', error)
      })
    },
    getClothType (keyWords) { // 设置面料种类,一级，二级
      if (keyWords.length > 0) {
        let first = CLOTHSTYLE[keyWords[0].groupId] // rror TypeError: Cannot read property 'groupId' of undefined
        let second = keyWords[0].keyword
        return first + '-' + second
      }
    },
    setShowDatas (response, id) {
      this.showDatas = []
      this.showDatasWait = []
      response.list.forEach(obj => {
        let tmpCreate = formatDate(obj.createTime)
        let tmpExpire = formatDate(obj.expireTime)
        if (id === 1) { // 构造已接单列表
          let colorCode = obj.receiptList[0] ? obj.receiptList[0].colorCardCode : ''
          let price = obj.receiptList[0] ? String(obj.receiptList[0].unitPrice) + '元/米' : '元/米'
          this.showDatas.push({
            'inquiryId': obj.inquiryId,
            'imgUrl': obj.imageList[0],
            'createTime': tmpCreate,
            'expireTime': tmpExpire,
            'status': STATUS[1], // 已接单
            'clothType': this.getClothType(obj.keywords),
            'desc': obj.desc,
            'colorCode': colorCode,
            'price': price,
            'receiptList': obj.receiptList // 包含receiptId
          })
        } else { // 构造未接单列表
          this.showDatasWait.push({
            'inquiryId': obj.inquiryId,
            'imgUrl': obj.imageList[0],
            'createTime': tmpCreate,
            'expireTime': tmpExpire,
            'status': STATUS[0], // 待接单
            'clothType': this.getClothType(obj.keywords),
            'desc': obj.desc
          })
        }
      })
      console.log('this.showDatas', this.showDatas)
      console.log('this.showDatasWait', this.showDatasWait)
    },
    onClick (index, title) {
      console.log('index, title', index, title)
      this.getHttpData(this.active)
    },
    goRequirement (flag, item) {
      let inquiryId = item.inquiryId
      let receiptId = 0
      if (item.hasOwnProperty('receiptList')) { // 已接单的才有
        receiptId = item.receiptList[0].receiptId
      }
      // 设置id缓存, 依据特定记录更新inquiryId
      sessionStorage.setItem('inquiryId', inquiryId)
      // sessionStorage.setItem('oldInquiryId', inquiryId)
      sessionStorage.setItem('receiptId', receiptId)
      sessionStorage.setItem('flag', flag)
      this.$router.push({name: 'Requirement'})
    },
    back () {
      console.log('window.history', window.history)
      this.$router.push({name: 'OrdersList'})
    }
  }
}
</script>

<style scoped>
  @import '../../assets/css/mycss.css';
</style>
