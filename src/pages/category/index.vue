<template>
  <view class="content">
    <scroll-view scroll-y class="left-aside">
      <view v-for="item in firstList" :key="item.id" class="f-item b-b" :class="{active: item.id === currentId}" @click="tabtap(item)">
        {{ item.name }}
      </view>
    </scroll-view>
    <scroll-view scroll-with-animation scroll-y class="right-aside">
      <view v-for="item in secondList" :key="item.id" class="s-list" :id="'main-'+item.id">
        <text class="s-item">{{ item.name }}</text>
        <view class="t-list">
          <view @click="navToList(item.id, titem.id)" v-if="titem.pid === item.id" class="t-item" v-for="titem in category[item.id]" :key="titem.id">
            <image :src="titem.icon"></image>
            <text>{{ titem.name }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentId: 0,
      category: [],
      firstList: [],
      secondList: [],
    }
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      let list = await this.$api.categoryList();
      if (list.length > 0) {
        list.forEach(item => {
          if (item.pid === 0) {
            this.firstList.push(item)
          } else {
            if (!this.category[item.pid]) {
              this.category[item.pid] = [];
            }
            this.category[item.pid].push(item)
          }
        });

        this.firstList = this.sortByKey(this.firstList, 'sort')
        this.currentId = this.firstList[0].id
        let secondList = this.category[this.currentId]
        this.secondList = []
        if (secondList) {
          this.secondList = this.sortByKey(secondList, 'sort')
        }
      }
    },
    tabtap(item) {
      this.currentId = item.id;
      let secondList = this.category[this.currentId]
      this.secondList = []
      if (secondList) {
        this.secondList = this.sortByKey(secondList, 'sort')
      }
    },
    sortByKey(array, key) {
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x < y) ? 1 : 0));
      });
    },
    navToList(category_id) {
      uni.navigateTo({
        url: `/pages/product/product?category_id=${category_id}`
      })
    }
  }
}
</script>

<style lang='scss'>
@import "../../static/scss/category";
</style>