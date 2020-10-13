<template>

</template>

<script>
export default {
  data() {
    return {
      orderDetail: {}
    }
  },
  onLoad(option) {
    this.loadData(option.order_id);
  },
  methods: {
    async loadData(orderId) {
      this.orderDetail = await this.$api.orderInfo({order_id: orderId});
      console.log(this.orderDetail)
    }
  }
}
</script>

<style lang='scss'>
@import "../../static/scss/orderDetail";
</style>