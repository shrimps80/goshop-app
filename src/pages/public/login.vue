<template>
  <view class="container">
    <view class="left-bottom-sign"></view>
    <view class="back-btn yticon icon-zuojiantou-up"></view>
    <view class="right-top-sign"></view>
    <!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
    <view class="wrapper">
      <view class="left-top-sign">LOGIN</view>
      <view class="welcome">
        欢迎回来！
      </view>
      <view class="input-content">
        <view class="input-item">
          <text class="tit">手机号码</text>
          <input
              type="number"
              :value="mobile"
              placeholder="请输入手机号码"
              maxlength="11"
              data-key="mobile"
              @input="inputChange"
          />
        </view>
        <view class="input-item">
          <text class="tit">密码</text>
          <input
              type="password"
              placeholder="8-18位不含特殊字符的数字、字母组合"
              placeholder-class="input-empty"
              maxlength="20"
              data-key="password"
              @input="inputChange"
          />
        </view>
      </view>
      <button class="confirm-btn" :disabled="isLogin" @click="toLogin">登录</button>
      <view class="forget-section">
        忘记密码?
      </view>
    </view>
    <view class="register-section">
      还没有账号?
      <text>马上注册</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      mobile: '',
      password: '',
      isLogin: false
    }
  },
  onLoad() {

  },
  methods: {
    inputChange(e) {
      const key = e.currentTarget.dataset.key;
      this[key] = e.detail.value;
    },
    // 验证手机号
    rightMobile() {
      let res = {};
      if (!this.mobile) {
        res.status = false;
        res.msg = '请输入手机号';
      } else if (!/^1\d{10}$/gi.test(this.mobile)) {
        res.status = false;
        res.msg = '手机号格式不正确';
      } else if (!this.password) {
        res.status = false;
        res.msg = '请输入密码';
      } else {
        res.status = true;
      }
      return res;
    },
    async toLogin() {
      let right = this.rightMobile()
      if (!right.status) {
        this.$common.msg(right.msg)
        return
      }
      this.isLogin = true
      const {mobile, password} = this;
      const sendData = {
        mobile,
        password
      };
      const res = await this.$api.login(sendData);
      if (res.code < 0) {
        this.$common.msg(res.message)
        this.isLogin = false
        return
      }
      this.$common.set("user_token", res.data.token);
      uni.switchTab({
        url: `/pages/user/index`
      });
    }
  }
}
</script>

<style lang='scss'>
@import "../../static/scss/login";
</style>