<template>
  <view class="container">
    <view class="user-section">
      <view class="user-info-box">
        <view class="portrait-box">
          <image class="portrait" :src="userInfo.avatar || '/static/images/missing-face.png'"></image>
        </view>
        <view class="info-box">
          <text class="username">{{ userInfo.nickname || '游客' }}</text>
        </view>
      </view>
    </view>


    <view class="cover-container">
      <image class="arc" src="/static/images/arc.png"></image>
      <view class="tj-sction">
        <view class="tj-item">
          <text class="num">128.8</text>
          <text>余额</text>
        </view>
        <view class="tj-item">
          <text class="num">0</text>
          <text>优惠券</text>
        </view>
        <view class="tj-item">
          <text class="num">20</text>
          <text>积分</text>
        </view>
      </view>


      <view class="order-section">
        <view class="order-item" hover-class="common-hover" :hover-stay-time="50">
          <view class="badge">123</view>
          <text class="yticon icon-shouye"></text>
          <text>全部订单</text>
        </view>
        <view class="order-item" hover-class="common-hover" :hover-stay-time="50">
          <view class="badge">123</view>
          <text class="yticon icon-daifukuan"></text>
          <text>待付款</text>
        </view>
        <view class="order-item" hover-class="common-hover" :hover-stay-time="50">
          <text class="yticon icon-yishouhuo"></text>
          <text>待收货</text>
        </view>
        <view class="order-item" hover-class="common-hover" :hover-stay-time="50">
          <view class="badge">123</view>
          <text class="yticon icon-shouhoutuikuan"></text>
          <text>退款/售后</text>
        </view>
      </view>
    </view>

    <view class="history-section icon">
      <list-cell icon="icon-iconfontweixin" iconColor="#e07472" title="我的钱包" tips="您的会员还有3天过期"></list-cell>
      <list-cell icon="icon-dizhi" iconColor="#5fcda2" title="地址管理"></list-cell>
      <list-cell icon="icon-share" iconColor="#9789f7" title="分享" tips="邀请好友赢10万大礼"></list-cell>
      <list-cell icon="icon-pinglun-copy" iconColor="#ee883b" title="晒单" tips="晒单抢红包"></list-cell>
      <list-cell icon="icon-shoucang_xuanzhongzhuangtai" iconColor="#54b4ef" title="我的收藏"></list-cell>
      <list-cell icon="icon-shezhi1" iconColor="#e07472" title="设置" border=""></list-cell>
    </view>

  </view>
</template>

<script>
import listCell from '@/components/mix-list-cell';

export default {
  components: {
    listCell
  },
  data() {
    return {
      userInfo: {},
    }
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.userInfo = await this.$api.info();
      console.log(this.userInfo)
    }
  }
}
</script>

<style lang='scss'>
@import "../../static/scss/user";
</style>