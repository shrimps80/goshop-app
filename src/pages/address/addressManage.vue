<template>
  <view class="content">
    <view class="row b-b">
      <text class="tit">联系人</text>
      <input class="input" type="text" v-model="addressData.name" placeholder="收货人姓名"/>
    </view>
    <view class="row b-b">
      <text class="tit">手机号</text>
      <input class="input" type="text" v-model="addressData.mobile" placeholder="收货人手机号码"/>
    </view>
    <view class="row b-b">
      <text class="tit">省市区</text>
      <input class="input" :value="pickerValue" readonly @focus="showThreePicker" placeholder="请选择"/>
      <area-picker ref="areaPicker" :areaId="areaId" :defaultIndex="defaultIndex" @onConfirm="onConfirm" class="fsz26"/>
    </view>
    <view class="row b-b">
      <text class="tit">地址</text>
      <input class="input" type="text" v-model="addressData.address" placeholder="详细地址"/>
    </view>
    <view class="row b-b">
      <text class="tit">门牌号</text>
      <input class="input" type="text" v-model="addressData.room_number" placeholder="楼号、门牌"/>
    </view>

    <view class="row default-row">
      <text class="tit">设为默认</text>
      <switch :checked="addressData.is_default" color="#fa436a" @click="changeSwitch()"/>
    </view>
    <button class="add-btn" @click="confirm">提交</button>
  </view>
</template>

<script>
import areaPicker from '@/components/areaPicker.vue'

export default {
  components: {
    areaPicker
  },
  data() {
    return {
      areaId: 110111,
      pickerValue: '',
      defaultIndex: [0, 0, 0],
      addressData: {},
    }
  },
  onLoad(option) {
    this.init();

    let title = '新增收货地址';
    if (option.type === 'edit') {
      title = '编辑收货地址'
      this.loadData(option.id)
    }

    uni.setNavigationBarTitle({
      title
    })
  },
  methods: {
    init() {
      let _this = this
      this.$api.getAreaList().then(function (res) {
        _this.$common.set("areaList", res.areas)
      });
    },
    async loadData(id) {
      this.addressData = await this.$api.addressDetail({address_id: id})
      this.areaId = this.addressData.code_coun
      this.pickerValue = this.addressData.code_city_name + " " + this.addressData.code_coun_name + " " + this.addressData.code_prov_name
    },
    // 省市区联动初始化
    showThreePicker() {
      this.$refs.areaPicker.showPicker();
    },
    onConfirm(e) {
      let data = this.addressData;
      this.pickerValue = e[0].name + " " + e[1].name + " " + e[2].name
      data.code_prov = e[0].id
      data.code_city = e[1].id
      data.code_coun = e[2].id
    },
    changeSwitch() {
      this.addressData.is_default = !this.addressData.is_default;
    },
    right() {
      let res = {};
      if (!this.addressData.name) {
        res.status = false;
        res.msg = '请填写收货人姓名';
      } else if (!/^1\d{10}$/gi.test(this.addressData.mobile)) {
        res.status = false;
        res.msg = '手机号格式不正确';
      } else if (!this.addressData.code_prov || !this.addressData.code_city || !this.addressData.code_coun) {
        res.status = false;
        res.msg = '请选择省市区';
      } else if (!this.addressData.address) {
        res.status = false;
        res.msg = '请输入详细地址';
      } else if (!this.addressData.room_number) {
        res.status = false;
        res.msg = '请填写门牌号信息';
      } else {
        res.status = true;
      }
      return res;
    },
    confirm() {
      let right = this.right()
      if (!right.status) {
        this.$common.msg(right.msg)
        return
      }
      if (!this.addressData.is_default) {
        this.addressData.is_default = false
      }

      let res
      if (this.addressData.address_id > 0) {
        // 编辑
        res = this.$api.addressEdit(this.addressData)
      } else {
        // 新增
        res = this.$api.addressAdd(this.addressData)
      }
      this.$common.msg(res.message)

      setTimeout(() => {
        uni.navigateTo({
          url: `/pages/address/address`
        })
      }, 800)
    }
  }
}
</script>

<style lang='scss'>
@import '../../static/scss/addressManage';
</style>