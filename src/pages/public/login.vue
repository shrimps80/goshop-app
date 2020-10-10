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
          <input type="number" :value="mobile" placeholder="请输入手机号码" maxlength="11" data-key="mobile"/>
        </view>
        <view class="input-item">
          <text class="tit">密码</text>
          <input type="password" placeholder="8-18位不含特殊字符的数字、字母组合" placeholder-class="input-empty" maxlength="20" data-key="password"/>
        </view>
      </view>
      <button class="confirm-btn" :disabled="isLogin">登录</button>
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
  methods: {}
}
</script>

<style lang='scss'>
@import "../../static/scss/login";
</style>