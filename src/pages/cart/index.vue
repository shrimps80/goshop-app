<template>

</template>

<script>
export default {
  data() {
    return {}
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      let cartData = await this.$api.cartList();
      console.log(cartData)
    }
  }
}
</script>

<style lang='scss'>
@import "../../static/scss/cart";
</style>