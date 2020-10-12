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
      let data = await this.$api.categoryList();
      console.log(data)
    }
  }
}
</script>

<style lang='scss'>
@import "../../static/scss/category";
</style>