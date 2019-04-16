<template>
  <div>
    <van-nav-bar
      title="修改信息"
      left-arrow
      @click-left="back"
      class="main-bk"
    />
    <p class="p-header">我的联系方式：</p>
    <van-field
      v-model="companyName"
      type="text"
      label="公司名称："
      placeholder=""
    />
    <van-field
      v-model="name"
      type="text"
      label="姓名："
      placeholder=""
    />
    <van-field
      v-model="phone"
      label="移动电话："
      placeholder=""
    />
    <van-field
      v-model="address"
      label="公司地址："
      placeholder=""
      type="textarea"
      :clearable="true"
    />
    <div class="line"></div>
    <div style="margin-top: 15px">
      <p class="p-header">主营业务：</p>
      <p class="p-header-small" >{{TYPE[1]}}</p>
      <van-checkbox-group v-model="zzResult" class="boxes-group">
        <van-checkbox class="boxes" shape="square"
                      v-for="keyId in zzList"
                      :key="keyId"
                      :name="keyId">
          {{ zzMajor[keyId] }}
        </van-checkbox>
      </van-checkbox-group>
      <p class="p-header-small" >{{TYPE[2]}}</p>
      <van-checkbox-group v-model="szResult" class="boxes-group">
        <van-checkbox class="boxes" shape="square"
                      v-for="keyId in szList"
                      :key="keyId"
                      :name="keyId">
          {{ szMajor[keyId] }}
        </van-checkbox>
      </van-checkbox-group>
    </div>
    <van-button class="bt-bright bt-big" @click="update">修改</van-button>
  </div>
</template>

<script>
// import areaList from '../../assets/js/area'
import {BASEURL, API, pushHistory, CLOTHSTYLE, setSpot} from '../../assets/js/common.js'
export default {
  // components: {areaList},
  data () {
    return {
      TYPE: CLOTHSTYLE,
      companyName: '',
      name: '',
      phone: '',
      address: '',
      allMajor: [],
      szResult: [], // 只有keyId，选中的
      zzResult: [],
      szList: [], // 只有keyId,所有的
      zzList: [],
      szMajor: {}, // [{keyId: keyWord}..]
      zzMajor: {},
      providerInfo: {},
      inquiryId: 0,
      providerId: 0
    }
  },
  created () {
    setSpot('在供应商信息修改页：modify', 'modify=>I am counting!')
    this.providerInfo = JSON.parse(sessionStorage.getItem('providerInfo'))
    this.providerId = sessionStorage.getItem('providerId')
    this.init(this.providerInfo)
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
    // 处理关键字
    getKeyWords (keyIdList, groupId) {
      let tmp = []
      let inquiryId = 7
      let selectMajor = {1: this.zzMajor, 2: this.szMajor}
      if (keyIdList.length > 0) {
        keyIdList.forEach(key => {
          tmp.push({
            'groupId': groupId,
            'keyId': key,
            'keyword': selectMajor[groupId][key],
            'inquiryId': inquiryId
          })
        })
        return tmp
      }
      return tmp // 没有值返回空数组
    },
    update () {
      if (this.providerId <= 0) { // Id异常
        this.$notify('this.providerId:' + String(this.providerId) + '；this.inquiryId:' + String(this.inquiryId))
        return false
      }
      let zzObjList = this.getKeyWords(this.zzResult, 1)
      let szObjList = this.getKeyWords(this.szResult, 2)
      let keywords = zzObjList.concat(szObjList)
      // 修改供应商信息
      let providerInfo = {
        'providerId': this.providerId,
        'companyName': this.companyName,
        'name': this.name,
        'phone': this.phone,
        'address': this.address,
        'keywords': keywords
      }
      sessionStorage.setItem('providerInfo', JSON.stringify(providerInfo)) // 更新供应商信息的缓存
      let url = API + '/show.do?'
      let busiKeywords = []
      this.zzResult.forEach(obj => {
        busiKeywords.push({'keyId': obj})
      })
      this.szResult.forEach(obj => {
        busiKeywords.push({'keyId': obj})
      })
      let provider = {
        'userId': this.providerId,
        'regTel': this.phone,
        'name': this.companyName,
        'address': this.address,
        'linkman': this.name,
        'busiKeywords': busiKeywords
      }
      let formdata = {
        'cmd': 'selfMdfProvider',
        'userId': this.providerId,
        'provider': JSON.stringify(provider)
      }
      this.axios.post(BASEURL + url, this.qs.stringify(formdata)).then(res => {
        if (res.data.exId) {
          this.$notify(res.data.exDesc)
        }
        if (res.data && (res.data.result === 0)) {
          this.$notify(res.data.desc + '数据更新成功！')
          this.$router.push({name: 'Customer'})
        }
      })
    },
    setBaseInfo (data) { // 设置szMajor szList等值
      if (data) {
        data.forEach(major => {
          if (major.groupId === 1) {
            major.list.forEach(obj => {
              this.zzMajor[obj.keyId] = obj.keyword
            })
            major.list.forEach(obj => {
              this.zzList.push(obj.keyId)
            })
          }
          if (major.groupId === 2) {
            major.list.forEach(obj => {
              this.szMajor[obj.keyId] = obj.keyword
            })
            major.list.forEach(obj => {
              this.szList.push(obj.keyId)
            })
          }
        })
      }
      // console.log('this.zzMajor', this.zzMajor)
      // console.log('this.szMajor', this.szMajor)
      // console.log('this.zzList', this.zzList)
      // console.log('this.szList', this.szList)
    },
    init (providerInfo) {
      // 初始化供应商信息
      this.allMajor = this.getMajor()
      this.setDefault(providerInfo)
    },
    setDefault (data) { // 显示在main中获得的供应商缓存信息
      this.companyName = data.companyName
      this.name = data.name
      this.phone = data.phone
      this.address = data.address
      let tmpMajor = data.keywords
      tmpMajor.forEach(major => {
        if (major.groupId === 1) {
          this.zzResult.push(major.keyId)
        }
        if (major.groupId === 2) {
          this.szResult.push(major.keyId)
        }
      })
    },
    getMajor () {
      // 获取所有关键字
      let url = API + '/show.do?cmd=fabricKeywords&groupId=0'
      this.axios.get(url).then(res => {
        if (res.data.exId) {
          this.$notify(res.data.exDesc)
        } else {
          this.allMajor = res.data
          this.setBaseInfo(this.allMajor)
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
