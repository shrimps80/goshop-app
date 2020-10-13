<template>
  <view class="content">
    <view class="navbar">
      <view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
        综合排序
      </view>
      <view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
        销量优先
      </view>
      <view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
        <text>价格</text>
        <view class="p-box">
          <text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang"></text>
          <text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang xia"></text>
        </view>
      </view>
    </view>

    <view class="goods-list">
      <view v-for="(item, index) in productList" :key="index" class="goods-item" @click="navToDetailPage(item.product_id)">
        <view class="image-wrapper">
          <image :src="imageBaseUrl + item.image" mode="aspectFill"></image>
        </view>
        <text class="title clamp">{{ item.name }}</text>
        <view class="price-box">
          <text class="price">{{ item.price }}</text>
          <text>已售 9999</text>
        </view>
      </view>
    </view>

    <uni-load-more :status="loadingType"></uni-load-more>
  </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more.vue';

export default {
  components: {
    uniLoadMore,
  },
  data() {
    return {
      imageBaseUrl: "",
      filterIndex: 0,
      priceOrder: 0, //1 价格从低到高 2价格从高到低
      loadingType: 'more',
      productList: [],
      page: 1,
      pageSize: 20,
    }
  },
  onLoad(options) {
    this.imageBaseUrl = this.$config.imageBaseUrl;
    this.loadData();
  },
  onPageScroll(e) {

  },
  onPullDownRefresh() {
    //下拉刷新
    this.loadData('refresh');
    uni.stopPullDownRefresh();
  },
  onReachBottom() {
    //加载更多
    this.loadData();
  },
  methods: {
    async loadData(type) {
      if (type === "refresh") {
        // 切换初始化
        this.page = 1;
        this.productList = [];
        this.loadingType = "more"
      }

      if (this.loadingType === 'noMore') {
        return
      }

      let req = {
        page: this.page,
        page_size: this.pageSize,
      }
      let products = await this.$api.productList(req);

      if (products.length > 0) {
        for (let i in products) {
          this.productList.push(products[i])
        }

        //判断是否还有数据， 有改为 more， 没有改为noMore
        if (products.length < this.pageSize) {
          this.loadingType = 'noMore';
        } else {
          this.page++
        }
      }

      if (type === 'refresh') {
        uni.hideLoading()
      }
    },
    tabClick(index) {
      if (this.filterIndex === index && index !== 2) {
        return;
      }

      this.filterIndex = index;

      if (index === 2) {
        this.priceOrder = this.priceOrder === 1 ? 2 : 1;
      } else {
        this.priceOrder = 0;
      }

      this.loadData('refresh');

      uni.pageScrollTo({
        duration: 300,
        scrollTop: 0
      })

      uni.showLoading({
        title: '正在加载'
      })
    },
    navToDetailPage(id) {
      uni.navigateTo({
        url: `/pages/product/productDetail?id=${id}`
      })
    },
  }
}
</script>

<style lang='scss'>
@import "../../static/scss/product";
</style>