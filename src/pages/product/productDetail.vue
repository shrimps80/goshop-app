<template>
  <view class="container">
    <view class="carousel">
      <swiper indicator-dots circular="true" duration="400">
        <swiper-item class="swiper-item" v-for="(item,index) in goods.images" :key="index">
          <view class="image-wrapper">
            <image :src="imageBaseUrl + item" class="loaded" mode="aspectFill"></image>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <view class="introduce-section">
      <text class="title">{{ goods.name }}</text>
      <view class="price-box">
        <text class="price-tip">¥</text>
        <text class="price">{{ specSelected.price }}</text>
        <text class="m-price">¥{{ specSelected.old_price }}</text>
        <text class="coupon-tip">7折</text>
      </view>
      <view class="bot-row">
        <text>销量: 108</text>
        <text>库存: 4690</text>
        <text>浏览量: 768</text>
      </view>
    </view>

    <view class="share-section">
      <view class="share-icon">
        <text class="yticon icon-xingxing"></text>
        返
      </view>
      <text class="tit">该商品分享可领49减10红包</text>
      <text class="yticon icon-bangzhu1"></text>
      <view class="share-btn"> 立即分享
        <text class="yticon icon-you"></text>
      </view>
    </view>

    <view class="c-list">
      <view class="c-row b-b" @click="toggleSpec">
        <text class="tit">购买规格</text>
        <view class="con">
          <text class="selected-text">{{ specSelected.sku }}</text>
        </view>
        <text class="yticon icon-you"></text>
      </view>
      <view class="c-row b-b">
        <text class="tit">优惠券</text>
        <text class="con t-r red">领取优惠券</text>
        <text class="yticon icon-you"></text>
      </view>
      <view class="c-row b-b">
        <text class="tit">促销活动</text>
        <view class="con-list">
          <text>新人首单送20元无门槛代金券</text>
          <text>订单满50减10</text>
          <text>订单满100减30</text>
          <text>单笔购买满两件免邮费</text>
        </view>
      </view>
      <view class="c-row b-b">
        <text class="tit">服务</text>
        <view class="bz-list con">
          <text>7天无理由退换货 ·</text>
          <text>假一赔十 ·</text>
        </view>
      </view>
    </view>


    <!-- 评价 -->
    <view class="eva-section">
      <view class="e-header">
        <text class="tit">评价</text>
        <text>(86)</text>
        <text class="tip">好评率 100%</text>
        <text class="yticon icon-you"></text>
      </view>
      <view class="eva-box">
        <image class="portrait" src="http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg"
               mode="aspectFill"></image>
        <view class="right">
          <text class="name">shrimp</text>
          <text class="con">商品收到了，79元两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢</text>
          <view class="bot">
            <text class="attr">购买类型：XL 红色</text>
            <text class="time">2020-01-01 01:01</text>
          </view>
        </view>
      </view>
    </view>

    <view class="detail-desc">
      <view class="d-header">
        <text>图文详情</text>
      </view>
      <rich-text :nodes="desc"></rich-text>
    </view>


    <!-- 底部操作菜单 -->
    <view class="page-bottom">
      <navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
        <text class="yticon icon-xiatubiao--copy"></text>
        <text>首页</text>
      </navigator>
      <navigator url="/pages/cart/index" open-type="switchTab" class="p-b-btn">
        <text class="yticon icon-gouwuche"></text>
        <text>购物车</text>
      </navigator>
      <view class="p-b-btn">
        <text class="yticon icon-shoucang"></text>
        <text>收藏</text>
      </view>

      <view class="action-btn-group">
        <button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
        <button type="primary" class=" action-btn no-border add-cart-btn" @click="toggleSpec">加入购物车</button>
      </view>
    </view>


    <!-- 规格-模态层弹窗 -->
    <view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec">
      <!-- 遮罩层 -->
      <view class="mask"></view>
      <view class="layer attr-content" @click.stop="stopPrevent">
        <view class="a-t">
          <image :src="imageBaseUrl + specSelected.image"></image>
          <view class="right">
            <text class="price">¥{{ specSelected.price }}</text>
            <text class="stock">库存：188件</text>
            <view class="selected">
              已选：
              <text class="selected-text">
                {{ specSelected.sku }}
              </text>
            </view>
          </view>
        </view>
        <view v-for="(item,index) in specList" :key="index" class="attr-list">
          <text>{{ item.name }}</text>
          <view class="item-list">
            <text v-for="(childItem, childIndex) in item.children"
                  :key="childIndex" class="tit"
                  :class="{selected: childItem.selected}"
                  @click="selectSpec(childIndex, index)">
              {{ childItem.content }}
            </text>
          </view>
        </view>
        <button class="btn" @click="addCart">完成</button>
      </view>
    </view>

  </view>
</template>

<script>
export default {
  data() {
    return {
      imageBaseUrl: "",
      productId: 0,
      goods: {},
      desc: "", // 图文详情

      // 规格
      specClass: 'none',
      specList: [],  // 规格选择器
      specSelected: [],
    }
  },
  onLoad(option) {
    this.productId = option.id
    this.imageBaseUrl = this.$config.imageBaseUrl;
    this.loadData();
  },
  //下拉刷新
  onPullDownRefresh() {
    this.loadData();
    uni.stopPullDownRefresh();
  },
  methods: {
    async loadData() {
      let _this = this
      let goods = await _this.$api.productDetail({"product_id": _this.productId})

      _this.goods = goods
      if (goods.spec_description.length > 0) {
        _this.specList = JSON.parse(goods.spec_description);
      }

      //规格 默认选中第一条
      if (goods.spec && goods.spec.length > 0) {
        _this.specSelected = goods.spec[0]
      }

      _this.specList.forEach(item => {
        for (let v in item.children) {
          if (_this.inArray(v, _this.specSelected.spec_value_id)) {
            _this.$set(item.children[v], 'selected', true);
          }
        }
      })

    },
    //规格弹窗开关
    toggleSpec() {
      if (this.specClass === 'show') {
        this.specClass = 'hide';
        setTimeout(() => {
          this.specClass = 'none';
        }, 250);
      } else if (this.specClass === 'none') {
        this.specClass = 'show';
      }
    },
    selectSpec(spec_value_id, index) {
      let list = this.specList[index].children
      // 修改选中
      for (let item in list) {
        this.$set(list[item], 'selected', false);
      }
      this.$set(list[spec_value_id], 'selected', true);

      // 根据规格选中查找规格
      let specSelected = []
      for (let specs in this.specList) {
        for (let child in this.specList[specs].children) {
          if (this.specList[specs].children[child].selected === true) {
            specSelected.push(child)
          }
        }
      }

      // 替换选中规格
      if (this.specList.length === specSelected.length) {
        specSelected.sort(function (a, b) {
          return a - b;
        });
        let specSelectedStr = specSelected.join(",")
        // 查找规格
        let specKey = this.goods.spec.findIndex(sitem => sitem.spec_value_id_str === specSelectedStr)
        if (specKey > -1) {
          this.specSelected = this.goods.spec[specKey]
        }
      }
    },
    //立即购买
    buy() {

    },
    addCart() {
      let req = {
        product_id: this.productId,
        product_spec_id: this.specSelected.product_spec_id,
        nums: 1,
        is_select: true,
        is_plus: true,
      }
      let _this = this
      _this.$api.addCart(req).then(function (res) {
        _this.toggleSpec()
      });
    },
    stopPrevent() {
      // 不写会自动关闭
    },
    inArray(v, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (v == arr[i]) {
          return true;
        }
      }
      return false;
    }
  }
}
</script>

<style lang='scss'>
@import "../../static/scss/productDetail";
</style>