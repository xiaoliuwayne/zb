<template>
  <div>
    <van-nav-bar
      title="给客户回样"
      left-arrow
      @click-left="back"
      class="main-bk"
    />
    <div :class="postData.length>4?'upload-img-5':'upload-img-1'">
      <p class="p-header">上传需要找的面料照片：</p>
      <p style="font-size: 12px">请上传要找的完整图案、细节图、尺寸参照图、正反面对比等。(最多5张)</p>
      <div class="posting-uploader">
        <div class="posting-uploader-item" v-for="(item,nn) in postData" :key="nn">
          <img :src="item.content" alt="图片" class="imgPreview" @click="clickImg($event)">
          <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
          <van-loading  v-show="loadingStatus  && (postData.length-1 === nn)" style="padding-left: 15px"/>
          <van-icon name="close" @click="delImg(nn)" class="delte" v-show="!loadingStatus"/>
        </div>
        <van-uploader :after-read="onRead" :accept="'image/*'" v-show="postData.length<=4 || !loadingStatus">
          <img src="../../assets/img/img1.png" alt="等待传图" class="imgPreview" v-show="!loadingStatus">
          <!--<van-loading  v-show="loadingStatus"/>-->
        </van-uploader>
        <van-tag plain type="danger" v-show="loadingStatus" class="imgPreview">在等待图片上传...</van-tag>
      </div>
    </div>
    <div class="line"></div>
    <div class="samp-remark">
      <p class="p-header">回样说明：</p>
      <van-field
        v-model="colorCardCode"
        type="text"
        label="色卡编号："
        placeholder=""
        required
      />
      <van-field
        v-model="unitPrice"
        type="number"
        label="剪版价："
        placeholder=""
        required
      />
      <van-field
        v-model="productName"
        type="text"
        label="品名："
        placeholder=""
      />
      <van-field
        v-model="ingredients"
        type="text"
        label="成份："
        placeholder=""
      />
      <van-field
        v-model="width"
        type="text"
        label="幅宽："
        placeholder=""
      />
      <van-field
        v-model="weight"
        type="text"
        label="克重："
        placeholder=""
      />
      <div class="radio-sty" style="">
        <span class="ver-mid">是否现货：</span>
        <van-radio-group v-model="spotStatus" style="display: flex">
          <van-radio name="0" class="van-radio">现货</van-radio>
          <van-radio name="1">定制</van-radio>
        </van-radio-group>
      </div>
      <div class="radio-sty">
        <span class="ver-mid">调样价格：</span>
        <van-radio-group v-model="sampleStatus" style="display: flex">
          <van-radio name="0">免费</van-radio>
          <van-radio name="1">收费</van-radio>
          <input :disabled="mark" v-model="samplePrice" style="width: 80px;margin: auto 5px;height: 25px" type="number" placeholder="单位：元"/>
        </van-radio-group>
      </div>
      <p class="p-header-small">面料说明：</p>
      <textarea rows="4" cols="25" v-model="description" style="margin-top: 5px" >
      </textarea>
    </div>
    <div class="line"></div>
    <div>
      <p class="p-header">我的联系方式：
        <van-button class="bt-bright bt-check" style="float: right" @click="goModify">
          修改
        </van-button>
      </p>
      <van-field
        v-model="providerInfo.companyName"
        type="text"
        label="供应商名称："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="providerInfo.name"
        type="text"
        label="联系人姓名："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="providerInfo.phone"
        type="text"
        label="移动电话："
        placeholder=""
        :readonly="true"
      />
      <van-field
        v-model="providerInfo.address"
        type="textarea"
        label="公司地址："
        placeholder=""
        :readonly="true"
      />
      <div style="margin: 10px 0"><span class="p-header-small major-sty">主营业务：</span>
        <van-field
          v-for="item in providerKeyWords" :key="item.groupId"
          v-if="item.keywords.length>0"
          v-model="item.keywords"
          type="text"
          :label="clothstyle[item.groupId] + '：'"
          placeholder=""
          :autosize="{minHeight:10}"
          :readonly="true"
        />
      </div>
      <van-button class="bt-bright bt-big" @click="postHttpData" >提交</van-button>
    </div>
  </div>
</template>

<script>
import {CLOTHSTYLE, BASEURL, API, pushHistory, setSpot} from '../../assets/js/common'
import BigImg from '../../../src/components/BigImg'
export default {
  components: {'big-img': BigImg},
  data () {
    return {
      isGo: true,
      showImg: false,
      mgSrc: '',
      loadingStatus: false,
      tmpSaveInput: {},
      inquiryId: 0,
      providerId: 0,
      colorCardCode: '',
      unitPrice: '',
      productName: '',
      ingredients: '',
      width: '',
      weight: '',
      spotStatus: '0',
      sampleStatus: '0',
      samplePrice: '',
      description: '',
      // tmpImgUrlListValue: [],
      imgUrlListValue: [],
      postData: [],
      address: '',
      providerInfo: {},
      providerKeyWords: [],
      clothstyle: {},
      mark: true
    }
  },
  created () {
    setSpot('在创建回单页：customer', 'customer=>I am counting!')
    this.clothstyle = CLOTHSTYLE
    this.providerId = sessionStorage.getItem('providerId')
    this.inquiryId = sessionStorage.getItem('inquiryId')
    // 判断该inquiryId是否已经接单
    this.chooseEntrance()
    // 将保持的记录赋值回去
    if (sessionStorage.getItem('tmpSaveInput')) {
      let tmpSaveInput = JSON.parse(sessionStorage.getItem('tmpSaveInput'))
      this.colorCardCode = tmpSaveInput['colorCardCode']
      this.unitPrice = tmpSaveInput['unitPrice']
      this.productName = tmpSaveInput['productName']
      this.ingredients = tmpSaveInput['ingredients']
      this.width = tmpSaveInput['width']
      this.weight = tmpSaveInput['weight']
      this.spotStatus = tmpSaveInput['spotStatus']
      this.sampleStatus = tmpSaveInput['sampleStatus']
      this.samplePrice = tmpSaveInput['samplePrice']
      this.description = tmpSaveInput['description']
      this.imgUrlListValue = tmpSaveInput['imgUrlListValue']
      this.postData = tmpSaveInput['postData']
      // sessionStorage.removeItem('tmpSaveInput')
    }
    this.providerInfo = JSON.parse(sessionStorage.getItem('providerInfo'))
    // 处理供应商的关键字
    let zzKeyWords = '' // 针织关键字
    let szKeyWords = '' // 梭织关键字
    this.providerInfo.keywords.forEach(obj => {
      if (obj.groupId === 1) {
        zzKeyWords = zzKeyWords + obj.keyword + '  '
      }
      if (obj.groupId === 2) {
        szKeyWords = szKeyWords + obj.keyword + '  '
      }
    })
    if (zzKeyWords) {
      this.providerKeyWords.push({'groupId': 1, 'keywords': zzKeyWords})
    }
    if (szKeyWords) {
      this.providerKeyWords.push({'groupId': 2, 'keywords': szKeyWords})
    }
  },
  mounted () {
    pushHistory()
    // 监听历史记录点, 添加返回事件监听
    window.onpopstate = () => {
      // 输入要返回的上一级路由地址
      this.$router.push({name: 'OrdersList'})
    }
  },
  destroyed () {
  },
  watch: {
    sampleStatus (val) {
      if (val === '1') {
        this.mark = false
      } else {
        this.mark = true
      }
    }
  },
  methods: {
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
    goModify () {
      // 缓存已经填写的回单信息
      this.tmpSaveInput['colorCardCode'] = this.colorCardCode
      this.tmpSaveInput['unitPrice'] = this.unitPrice
      this.tmpSaveInput['productName'] = this.productName
      this.tmpSaveInput['ingredients'] = this.ingredients
      this.tmpSaveInput['width'] = this.width
      this.tmpSaveInput['weight'] = this.weight
      this.tmpSaveInput['spotStatus'] = this.spotStatus
      this.tmpSaveInput['sampleStatus'] = this.sampleStatus
      this.tmpSaveInput['samplePrice'] = this.samplePrice
      this.tmpSaveInput['description'] = this.description
      this.tmpSaveInput['imgUrlListValue'] = this.imgUrlListValue // 显示的图片url
      this.tmpSaveInput['postData'] = this.postData // 显示的图片内容
      sessionStorage.setItem('tmpSaveInput', JSON.stringify(this.tmpSaveInput))
      this.$router.push({name: 'Modify'})
    },
    postHttpData () {
      // console.log('this.providerId', this.providerId)
      // console.log('this.inquiryId', this.inquiryId)
      let idOK = ''
      let imgOK = ''
      let requiredOK = ''
      // 判断id是否异常
      if (this.providerId <= 0 || this.inquiryId <= 0) {
        this.$notify('this.providerId:' + String(this.providerId) + ',this.inquiryId:' + String(this.inquiryId))
      } else { idOK = 'ok' }
      // 判断表单必填数据
      if ((this.colorCardCode === '') || (this.unitPrice === '')) {
        this.$notify('剪版价或者色卡编号没有填写！')
        // alert('剪版价或者色卡编号没有填写！')
      } else { requiredOK = 'ok' }
      // console.log('this.imgUrlListValue', this.imgUrlListValue)
      if ((this.imgUrlListValue.length < this.postData.length) || (this.postData.length === 0) || this.loadingStatus) {
        this.$notify('图片可能未上传完整,请稍后再试！')
      } else { imgOK = 'ok' }
      if (!(idOK && imgOK && requiredOK)) {
        this.isGo = false
      } else { this.isGo = true }
      // 图片数组
      let postImgDatas = []
      this.postData.forEach(file => {
        postImgDatas.push(file.content)
      })
      // 表单数据
      let url = API + '/show.do?'
      let receipt = {
        'inquiryId': this.inquiryId,
        'userId': this.providerId,
        'colorCardCode': this.colorCardCode,
        'unitPrice': this.unitPrice,
        'productName': this.productName,
        'ingredients': this.ingredients,
        'width': this.width,
        'weight': this.weight,
        'spotStatus': this.spotStatus,
        'sampleStatus': this.sampleStatus,
        'samplePrice': this.samplePrice,
        'description': this.description,
        'imgUrlListValue': this.imgUrlListValue
      }
      let formData = {
        'cmd': 'insertInquiryReceipt',
        'receipt': JSON.stringify(receipt)
      }
      if (this.isGo) {
        this.axios.post(BASEURL + url, this.qs.stringify(formData)).then(
          res => {
            let response = res.data
            if (response.exId) {
              this.$notify(response.exDesc)
            } else {
              this.$notify('已提交成功，请等待客户确认并联系您！')
              // 清空表单数据
              this.colorCardCode = ''
              this.unitPrice = 0.0
              this.productName = ''
              this.ingredients = ''
              this.width = ''
              this.weight = ''
              this.spotStatus = '0'
              this.sampleStatus = '0'
              this.samplePrice = 0.0
              this.description = ''
              this.postData = []
              sessionStorage.setItem('flag', 'g') // 接单后指定到已接单ordersList
              sessionStorage.removeItem('tmpSaveInput') // 提交后删除缓存
              this.$router.push({name: 'OrdersList'})
            }
          }
        ).catch(function (error) {
          console.log('error', error)
        })
      }
    },
    delImg (index) {
      // 删除指定下标的图片对象=>页面上显示的
      if (isNaN(index) || index >= this.postData.length) {
        return false
      }
      let tmp = []
      for (let i = 0, len = this.postData.length; i < len; i++) {
        if (this.postData[i] !== this.postData[index]) {
          tmp.push(this.postData[i])
        }
      }
      this.postData = tmp
      // 删除指定下标的图片对象url=>传至后端的url数组
      let tmpImgUrlValues = []
      for (let i = 0, len = this.imgUrlListValue.length; i < len; i++) {
        if (this.imgUrlListValue[i] !== this.imgUrlListValue[index]) {
          tmpImgUrlValues.push(this.imgUrlListValue[i])
        }
      }
      this.imgUrlListValue = tmpImgUrlValues
    },
    startLoading () {
      this.loadingStatus = true
    },
    clickImg (e) {
      this.showImg = true
      // 获取当前图片地址
      this.imgSrc = e.currentTarget.src
    },
    viewImg () {
      this.showImg = false
    },
    onRead (file) { // 上传图片到图片服务器
      // this.$refs.clothImg.src = file.content
      this.postData.push(file)
      let url = API + '/upload?type=99'
      let fd = new FormData()
      fd.append('upImgs', file.file)
      this.loadingStatus = true
      this.axios.post(url, fd, {headers: {
        'Content-Type': 'multipart/form-data'
      }}).then(res => {
        // console.log('onRead=>', res.data)
        if (res.data.desc === 'success') {
          this.imgUrlListValue.push(res.data.urls[0].image)
        }
        this.loadingStatus = false
      }).catch(err => {
        this.loadingStatus = false
        this.postData = []
        this.imgUrlListValue = []
        console.log('onRead=>err：', err)
        this.$notify('网络异常，请重新上传图片！')
      })
    },
    back () {
      // this.$router.push({name: 'OrdersList', params: {'inquiryId': this.inquiryId, 'flag': 'w'}})
      this.$router.push({name: 'OrdersList'})
    }
  }
}
</script>

<style scoped>
  @import '../../assets/css/mycss.css';
</style>
