<template>
  <view class="container">
    <!-- 空白页 -->
    <view v-if="cartList.length===0" class="empty">
      <image src="/static/images/emptyCart.jpg" mode="aspectFit"></image>
      <view class="empty-tips">
        空空如也
        <navigator class="navigator" url="../index/index" open-type="switchTab">随便逛逛></navigator>
      </view>
    </view>
    <view v-else>

      <view class="cart-list">
        <block v-for="(item, index) in cartList" :key="item.cart_id">
          <view class="cart-item" :class="{'b-b': index!==cartList.length-1}">
            <view class="image-wrapper">
              <image
                  :src="imageBaseUrl+item.image"
                  :class="[item.loaded]"
                  mode="aspectFill"
                  lazy-load
                  @load="onImageLoad('cartList', index)"
                  @error="onImageError('cartList', index)"
                  @click="navToDetailPage(item.product_id)"
              ></image>
              <view class="yticon icon-xuanzhong2 checkbox" :class="{checked: item.checked}" @click="check('item', index)"></view>
            </view>
            <view class="item-right">
              <text class="clamp title">{{ item.product_name }}</text>
              <text class="attr">{{ item.spec_name }}</text>
              <text class="price">¥{{ item.price }}</text>
              <uni-number-box
                  class="step"
                  :min="1"
                  :max="item.stock"
                  :value="item.num>item.stock?item.stock:item.num"
                  :isMax="item.num>=item.stock?true:false"
                  :isMin="item.num===1"
                  :index="index"
                  @eventChange="numberChange"
              ></uni-number-box>
            </view>
            <view class="item-del">
              <text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
              <text class="price">¥{{ item.product_amount }}</text>
            </view>
          </view>
        </block>
      </view>

      <!-- 底部菜单栏 -->
      <view class="action-section">
        <view class="checkbox">
          <image :src="allChecked?'/static/images/selected.png':'/static/images/select.png'" mode="aspectFit" @click="check('all')"></image>
          <view class="clear-btn" :class="{show: allChecked}" @click="clearCart">清空</view>
        </view>
        <view class="total-box">
          <text class="price">¥{{ cartData.amount }}</text>
          <text class="coupon">
            已优惠
            <text>{{ cartData.promotion }}</text>
            元
          </text>
        </view>
        <button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
      </view>

    </view>
  </view>
</template>

<script>
import uniNumberBox from '@/components/uni-number-box.vue'

export default {
  components: {
    uniNumberBox
  },
  data() {
    return {
      imageBaseUrl: this.$config.imageBaseUrl,
      allChecked: false, //全选状态  true|false
      cartData: {},
      cartList: [],
    }
  },
  onLoad() {
    this.loadData();
  },
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData() {
      let list = await this.$api.cartList()
      this.cartData = list
      this.cartList = list.products
    },
    //监听image加载完成
    onImageLoad(key, index) {
      this.$set(this[key][index], 'loaded', 'loaded');
    },
    //监听image加载失败
    onImageError(key, index) {
      this[key][index].image = '/static/images/errorImage.jpg';
    },
    //选中状态处理
    check: function (type, index) {
      let _this = this
      let params

      if (type === 'item') {
        _this.cartList[index].checked = !_this.cartList[index].checked;
        params = [{
          "cart_id": _this.cartList[index].cart_id,
          "is_select": _this.cartList[index].checked ? 1 : 0,
        }]
      } else {
        const checked = !_this.allChecked
        const list = _this.cartList;
        list.forEach(item => {
          item.checked = checked;
        })
        _this.allChecked = checked;
        params = _this.cartList.map(function (item) {
          return {
            "cart_id": item.cart_id,
            "is_select": item.checked ? 1 : 0,
          }
        })
      }

      _this.$api.checkedCart({cart_checked: JSON.stringify(params)}).then(function (res) {
        _this.cartData = res
        _this.cartList = res.products
      })
    },
    //数量
    numberChange(data) {
      let _this = this
      _this.cartList[data.index].num = data.number;
      let req = {
        product_id: _this.cartList[data.index].product_id,
        product_spec_id: _this.cartList[data.index].product_spec_id,
        nums: data.number,
        is_select: _this.cartList[data.index].checked,
        is_plus: false,
      }
      _this.$api.addCart(req).then(function (res) {
        _this.cartData = res
        _this.cartList = res.products
      })
    },
    //删除
    deleteCartItem: function (index) {
      let id = this.cartList[index].cart_id

      let req = {
        is_all: 0,
        cart_ids: JSON.stringify([id])
      }

      let _this = this
      this.$api.delCart(req).then(function (res) {
        _this.cartData = res
        _this.cartList = res.products
      })
    },
    //清空
    clearCart: function () {
      let req = {
        is_all: 1,
        cart_ids: JSON.stringify([])
      }
      let _this = this
      uni.showModal({
        content: '清空购物车？',
        success: (e) => {
          if (e.confirm) {
            _this.$api.delCart(req)
            _this.cartList = [];
          }
        }
      })
    },
    //buy
    createOrder() {
      let list = this.cartList;
      let goodsData = [];
      list.forEach(item => {
        if (item.checked) {
          goodsData.push({
            cart_id: item.cart_id,
            product_id: item.product_id,
            product_spec_id: item.product_spec_id,
            num: item.num
          })
        }
      })
      uni.navigateTo({
        url: `/pages/order/createOrder?data=${JSON.stringify(goodsData)}`
      })
    },
    navToDetailPage(product_id) {
      uni.navigateTo({
        url: `/pages/product/productDetail?id=${product_id}`
      })
    }
  }
}
</script>

<style lang='scss'>
@import "../../static/scss/cart";
</style>