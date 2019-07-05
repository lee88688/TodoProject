<template>
  <v-container full-height fluid class="pa-0" style="max-height: 100%;">
    <v-layout row fill-height>
      <v-flex class="left-folder-list">
        <folder-list></folder-list>
      </v-flex>
      <v-flex>
        <todo-list></todo-list>
      </v-flex>
      <!--<v-flex class="right-todo-detail">-->
        <!--<todo-detail></todo-detail>-->
      <!--</v-flex>-->
      <todo-detail class="right-todo-detail"></todo-detail>
    </v-layout>
  </v-container>
</template>

<script>
import FolderList from '@/views/todolist/FolderList'
import TodoList from '@/views/todolist/TodoList'
import TodoDetail from '@/views/todolist/TodoDetail'
export default {
  components: {
    TodoDetail,
    TodoList,
    FolderList
  }
}
</script>

<style scoped>
.left-folder-list {
  width: 300px;
  flex: 0 0 auto;
}

.right-todo-detail {
  width: 350px;
  flex: 0 0 auto;
}
</style>
