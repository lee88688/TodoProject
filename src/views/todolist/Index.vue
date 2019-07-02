<template>
  <v-container full-height fluid class="pa-0">
    <v-layout row fill-height>
      <v-flex class="left-folder-list">
        <folder-list></folder-list>
      </v-flex>
      <v-flex>center</v-flex>
      <v-flex class="right-todo-detail">right</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import FolderList from '@/views/todolist/FolderList'
export default {
  components: {
    FolderList
  }
}
</script>

<style scoped>
.left-folder-list, .right-todo-detail {
  width: 300px;
  flex: 0 0 auto;
}
</style>
