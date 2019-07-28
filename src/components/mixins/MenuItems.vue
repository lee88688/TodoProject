<template>
  <v-menu v-model="menu.showMenu" :position-x="menu.x" :position-y="menu.y">
    <v-list>
      <v-list-item v-for="(item, index) in menu.menuItems" @click="itemClick(index)" :key="index">
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'MenuItems',
  props: {
    menu: {
      type: Object
    }
  },
  methods: {
    itemClick (index) {
      const item = this.menu.menuItems[index]
      item.callback && item.callback(this.menu.extra, item)
    }
  }
}
</script>

<style scoped>

</style>
