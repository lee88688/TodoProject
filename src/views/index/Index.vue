<template>
  <v-container full-height fluid class="pa-0" style="max-height: 100%;">
    <v-layout row fill-height>
      <v-flex class="left-folder-list">
        <sidebar></sidebar>
      </v-flex>
      <v-flex style="overflow: hidden;">
        <router-view></router-view>
      </v-flex>
      <v-flex class="right-todo-detail">
        <router-view name="todoDetail"></router-view>
      </v-flex>
<!--      <todo-detail class="right-todo-detail"></todo-detail>-->
    </v-layout>
  </v-container>
</template>

<script>
import Sidebar from '@/views/index/Sidebar'

export default {
  components: {
    Sidebar
  }
}
</script>

<style scoped>
.left-folder-list {
  /*width: 300px;*/
  flex: 0 0 auto;
}

.right-todo-detail {
  /*width: 350px;*/
  flex: 0 0 auto;
}
</style>
