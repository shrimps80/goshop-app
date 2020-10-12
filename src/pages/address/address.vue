<template>
  <view class="content b-t">
    <view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
      <view class="wrapper">
        <view class="address-box">
          <text v-if="item.is_default" class="tag">默认</text>
          <text class="address">{{ item.address }}</text>
        </view>
        <view class="u-box">
          <text class="name">{{ item.name }}</text>
          <text class="mobile">{{ item.mobile }}</text>
        </view>
      </view>
      <text class="yticon icon-bianji" @click.stop="addAddress('edit', item.address_id)"></text>
    </view>

    <button class="add-btn" @click="addAddress('add')">新增地址</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      addressList: [],
    }
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.addressList = await this.$api.addressList();
    },
    addAddress(type, id = 0) {
      uni.navigateTo({
        url: `/pages/address/addressManage?type=${type}&id=${id}`
      })
    },
    checkAddress(item) {
      this.$common.msg("选中")
    }
  }
}
</script>

<style lang='scss'>
@import "../../static/scss/address";
</style>