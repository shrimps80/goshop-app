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

            <view @click="clickItem(item)">
              <scroll-view v-if="item.order_items.length > 1" class="goods-box" scroll-x>
                <view v-for="(goodsItem, goodsIndex) in item.order_items" :key="goodsIndex" class="goods-item">
                  <image class="goods-img" :src="imageBaseUrl+goodsItem.image" mode="aspectFill"></image>
                </view>
              </scroll-view>

              <view v-if="item.order_items.length === 1" class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.order_items" :key="goodsIndex">
                <image class="goods-img" :src="imageBaseUrl+goodsItem.image" mode="aspectFill"></image>
                <view class="right">
                  <text class="title clamp">{{ goodsItem.name }}</text>
                  <text class="attr-box">{{ goodsItem.price }} x {{ goodsItem.qty_ordered }}</text>
                  <text class="price">{{ goodsItem.total_payable }}</text>
                </view>
              </view>
            </view>

            <view class="price-box">
              共
              <text class="num">{{ item.total_qty_ordered }}</text>
              件商品 实付款
              <text class="price">{{ item.grand_total }}</text>
            </view>

            <view class="action-box b-t" v-if="item.order_status != 5">
              <button class="action-btn" @click="cancelOrder(item)">取消订单</button>
              <button class="action-btn recom">立即支付</button>
            </view>
          </view>

          <uni-load-more :status="tabItem.loadingType"></uni-load-more>
        </scroll-view>
      </swiper-item>
    </swiper>

  </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more.vue';

export default {
  components: {
    uniLoadMore
  },
  data() {
    return {
      imageBaseUrl: "",
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
      page: 1,
      pageSize: 2, // 每页订单显示数量
    }
  },
  onLoad(option) {
    this.imageBaseUrl = this.$config.imageBaseUrl;
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
      this.loadData("tabChange");
    },
    async loadData(source) {
      let index = this.tabCurrentIndex;
      let navItem = this.navList[index];

      if (source === "tabChange") {
        // 切换初始化
        this.page = 1;
        navItem.orderList = [];
        navItem.loadingType = "more"
      }

      if (navItem.loadingType === 'noMore') {
        return
      }

      let req = {
        page: this.page,
        page_size: this.pageSize,
        order_status: navItem.state,
      }
      let orderList = await this.$api.orderList(req)

      if (orderList.total > 0) {
        for (let i in orderList.orders) {
          navItem.orderList.push(orderList.orders[i])
        }

        //判断是否还有数据， 有改为 more， 没有改为noMore
        if (orderList.orders.length < this.pageSize) {
          navItem.loadingType = 'noMore';
        } else {
          this.page++
        }

      }
    },
    clickItem(item) {
      uni.navigateTo({
        url: `/pages/order/orderDetail?order_id=${item.order_id}`
      })
      console.log(item)
    },
    deleteOrder() {
      this.$common.msg("删除订单")
    },
    cancelOrder() {
      this.$common.msg("取消订单")
    }
  }
}
</script>

<style lang='scss'>
@import "../../static/scss/order";
</style>