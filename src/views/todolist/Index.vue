<template>
  <v-container full-height fluid class="pa-0" style="max-height: 100%;">
    <v-layout row fill-height>
      <v-flex class="left-folder-list">
        <folder-list></folder-list>
      </v-flex>
      <v-flex>
        <todo-list></todo-list>
      </v-flex>
      <v-flex class="right-todo-detail">right</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import FolderList from '@/views/todolist/FolderList'
import TodoList from '@/views/todolist/TodoList'
export default {
  components: {
    TodoList,
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
