<template>
  <view class="app">
    <view class="price-box">
      <text>支付金额</text>
      <text class="price">38.88</text>
    </view>

    <view class="pay-type-list">
      <view class="type-item b-b" @click="changePayType(1)">
        <text class="icon yticon icon-weixinzhifu"></text>
        <view class="con">
          <text class="tit">微信支付</text>
          <text>推荐使用微信支付</text>
        </view>
        <label class="radio">
          <radio value="" color="#fa436a" :checked='payType == 1'/>
        </label>
      </view>
      <view class="type-item b-b" @click="changePayType(2)">
        <text class="icon yticon icon-alipay"></text>
        <view class="con">
          <text class="tit">支付宝支付</text>
        </view>
        <label class="radio">
          <radio value="" color="#fa436a" :checked='payType == 2'/>
        </label>
      </view>
      <view class="type-item" @click="changePayType(3)">
        <text class="icon yticon icon-erjiye-yucunkuan"></text>
        <view class="con">
          <text class="tit">预存款支付</text>
          <text>可用余额 ¥198.5</text>
        </view>
        <label class="radio">
          <radio value="" color="#fa436a" :checked='payType == 3'/>
        </label>
      </view>
    </view>

    <text class="mix-btn" @click="confirm">确认支付</text>
  </view>
</template>
<script>
export default {
  data() {
    return {
      payType: 1,
      orderInfo: {},
      orderId: 0,
    };
  },
  onLoad(option) {
    this.orderId = option.order_id
  },
  methods: {
    //选择支付方式
    changePayType(type) {
      this.payType = type;
    },
    //确认支付
    confirm: async function () {
      alert("支付去")
    },
  }
}
</script>

<style lang='scss'>
@import "../../static/scss/pay";
</style>