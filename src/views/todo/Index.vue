<template>
  <v-layout column fill-height>
    <v-flex shrink style="width: 100%;">
      <v-toolbar flat dense dark color="blue-grey lighten-1">
        <v-toolbar-title>{{ currentFolderName }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat class="min-width-0"><v-icon>mdi-account-multiple-plus-outline</v-icon></v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-flex>
    <v-flex grow class="pa-3 blue-grey lighten-1" style="overflow: hidden;">
      <v-layout column style="height: 100%;">
        <v-flex v-if="canAddNewTodo" shrink>
          <v-text-field @click:append="addNewTodo" @keyup.enter="addNewTodo" v-model="todoName" solo prepend-inner-icon="mdi-plus" append-icon="mdi-send" placeholder="添加新任务"></v-text-field>
        </v-flex>
        <v-flex grow style="overflow: hidden; height: 0; position: relative;" class="ps" ref="scrollContainer">
          <v-list class="transparent">
            <template v-for="item in todosProxy">
              <v-btn v-if="item.name" flat small dark class="min-width-0" :key="item.name">{{ item.name }}</v-btn>
              <todo-item v-for="t in item.todos" @click="clickTodo" @click:checkbox="clickComplete" @click:star="clickStar" :todo="t" :key="t.id"></todo-item>
            </template>
            <template v-if="!isSpecialFolder">
              <v-btn @click="loadingCompleteTodo" :loading="completeTodo.isLoading" flat small dark class="min-width-0">{{ loadingCompleteBtnName }}</v-btn>
              <todo-item v-for="t in completeTodo.todos" :todo="t" :key="t.id"></todo-item>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import perfectScrollbarMixin from '@/components/mixins/perfectScrollbarMixin'
import TodoItem from '@/views/todo/TodoItem'
import { todoTransform } from '@/views/lib'
import { getArchiveTodos } from '@/lib/indexedDB'

export default {
  name: 'TodoList',
  components: { TodoItem },
  mixins: [perfectScrollbarMixin],
  data () {
    return {
      todoName: '',
      completeTodo: {
        isLoading: false,
        isShow: false,
        todos: []
      }
    }
  },
  computed: {
    ...mapGetters('todoView', ['todos', 'currentFolderName']),
    ...mapGetters('globalAction', ['searchValid']),
    ...mapState('todoView', ['currentFolder']),
    canAddNewTodo () {
      if (this.searchValid) { return false }
      switch (this.currentFolder) {
        case 'star':
          return false
        case 'today':
          return false
        case 'thisWeek':
          return false
        default:
          return true
      }
    },
    todosProxy () {
      return this.todos.map(item => {
        return {
          ...item,
          'todos': item.todos.map(todoTransform)
        }
      })
    },
    isSpecialFolder () {
      return !this.canAddNewTodo
    },
    loadingCompleteBtnName () {
      return this.completeTodo.isShow ? '隐藏已完成任务' : '显示已完成任务'
    }
  },
  mounted () {
    this.getPerfectScrollbarInstance(this.$refs.scrollContainer)
  },
  methods: {
    ...mapActions('user', ['addTodo', 'modifyTodo', 'changeDetailViewVisible', 'changeCurrentTodo', 'markTodoAsDone']),
    addNewTodo () {
      if (!this.todoName) {
        return
      }
      this.addTodo({
        name: this.todoName,
        folder: this.currentFolder
      })
      this.todoName = ''
    },
    clickTodo (id) {
      this.changeCurrentTodo(id)
      this.changeDetailViewVisible(true)
    },
    clickComplete ({ id, complete }) {
      complete && this.markTodoAsDone(id)
    },
    clickStar ({ id, star }) {
      this.modifyTodo({ id, star })
    },
    async loadingCompleteTodo () {
      this.completeTodo.isShow = !this.completeTodo.isShow
      if (!this.completeTodo.isShow) {
        this.completeTodo.todos.splice(0, this.completeTodo.todos.length)
        return
      }
      this.completeTodo.isLoading = true
      const todos = await getArchiveTodos({ folder: this.currentFolder })
      this.completeTodo.todos.push(...todos)
      this.completeTodo.isLoading = false
    }
  }
}
</script>

<style scoped>

</style>
