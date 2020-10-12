<template>
  <view class="content">
    <view class="navbar">
      <view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}" @click="tabClick(index)">
        {{ item.text }}
      </view>
    </view>

    <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
      <swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
        <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
          <!-- 空白页 -->
          <view v-if="tabItem.orderList.length === 0" class="empty">
            <view class="empty-tips">
              空空如也
              <navigator class="navigator" url="../index/index" open-type="switchTab">随便逛逛></navigator>
            </view>
          </view>
          <view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item">
            <view class="i-top b-b">
              <text class="time">{{ item.created_at }}</text>
              <text class="state">{{ item.order_status_name }}</text>
              <text v-if="item.order_status===5" class="del-btn yticon icon-iconfontshanchu1" @click="deleteOrder(index)"></text>
            </view>

            <scroll-view v-if="item.order_items.length > 1" class="goods-box" scroll-x>
              <view v-for="(goodsItem, goodsIndex) in item.order_items" :key="goodsIndex" class="goods-item">
                <image class="goods-img" :src="goodsItem.image" mode="aspectFill"></image>
              </view>
            </scroll-view>

          </view>
        </scroll-view>
      </swiper-item>
    </swiper>

  </view>
</template>

<script>
export default {
  data() {
    return {
      tabCurrentIndex: 0,
      navList: [
        {
          state: 0,
          text: '全部',
          loadingType: 'more',
          orderList: []
        },
        {
          state: 1,
          text: '待付款',
          loadingType: 'more',
          orderList: []
        },
        {
          state: 4,
          text: '待收货',
          loadingType: 'more',
          orderList: []
        },
        {
          state: 5,
          text: '退款/售后',
          loadingType: 'more',
          orderList: []
        },
        {
          state: 6,
          text: '待评价',
          loadingType: 'more',
          orderList: []
        }
      ],
    }
  },
  onLoad(option) {
    this.tabCurrentIndex = +option.state;
    this.loadData();
  },
  methods: {
    //顶部tab点击
    tabClick(index) {
      this.tabCurrentIndex = index;
    },
    //swiper 切换
    changeTab(e) {
      this.tabCurrentIndex = e.target.current;
      this.loadData();
    },
    async loadData() {
      let index = this.tabCurrentIndex;
      let navItem = this.navList[index];

      let req = {
        page: 1,
        page_size: 20,
        order_status: navItem.state,
      }
      let orderList = await this.$api.orderList(req)

      if (orderList.total > 0) {
        navItem.orderList = orderList.orders
        //判断是否还有数据， 有改为 more， 没有改为noMore
        if (orderList.orders.length < 20) {
          navItem.loadingType = 'noMore';
        }
      }
    },
    deleteOrder() {
      this.$common.msg("删除订单")
    }
  }
}
</script>

<style lang='scss'>
@import "../../static/scss/order";
</style>