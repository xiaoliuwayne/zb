<template>
  <div :style="bkImg" class="base-page">
    <div style="text-align:center; margin:3rem 0;">
      <img src="../assets/img/bk/zbmblogo.png" style="width: 30vw;height: 30vw;">
    </div>
    <div class="index-p">
      <span>
        <img src="../assets/img/bk/idea.png" style="width: 3rem; height: 3rem"/>
      </span>
      <span class="index-remind">
        您已获得一个面料采购订单，请将短信中的“提取码”输入下方输入框中，点击“获得订单”查看订单。
      </span>
    </div>
    <input v-model="code" placeholder="输入提取码" class="code-input" type='number'/>
    <div style="text-align:center; padding:30px 0;">
    <van-button @click="sendCode" class="code-send">
      获得订单
    </van-button>
    </div>
    <div class="index-footer">
      <p style="font-weight: bolder">找布买布 平台介绍：</p>
      <p>“找布买布” 服务于面料采购和面料档口，将双方需求进行汇聚到平台中，进行自由交易。</p>
    </div>
  </div>
</template>

<script>
import {setSpot} from '../assets/js/common'
export default {
  data () {
    return {
      code: '',
      bkImg: {
        backgroundImage: 'url(' + require('../assets/img/bk/cloth.png') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      }
    }
  },
  created () {
    setSpot('在提取码输入页：index', 'index=>I am counting!')
    // 防止不小心退出后要重输验证码
    let tmpCode = sessionStorage.getItem('code')
    if (tmpCode) {
      this.code = tmpCode
    } else {
      this.code = ''
    }
    this.enterCounting()
  },
  methods: {
    enterCounting () {
      setSpot('在提取码输入页：index', 'index=>I am counting!')
      // try {
      //   console.log('index=>I am counting!')
      //   window.TDAPP.onEvent('在提取码输入页：index')
      //   console.log('index=>I am counting222!')
      // } catch (err) {
      //   console.log('index=>enterCounting:err', err)
      // }
    },
    sendCode () {
      sessionStorage.setItem('code', String(this.code))
      this.enterCounting()
      if (this.code) {
        this.$router.push({name: 'Main'})
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/css/mycss.css';
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
/* 火狐 */
input{
  -moz-appearance:textfield;
   }

</style>
