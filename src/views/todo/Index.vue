<template>
  <v-layout column fill-height>
    <v-flex shrink style="width: 100%;">
      <v-toolbar flat dense dark color="blue-grey lighten-1">
        <v-toolbar-title>{{ currentFolderName }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
<!--          <v-btn text class="min-width-0"><v-icon>mdi-account-multiple-plus-outline</v-icon></v-btn>-->
        </v-toolbar-items>
      </v-toolbar>
    </v-flex>
    <v-flex grow class="pa-3 blue-grey lighten-1" style="overflow: hidden;">
      <v-layout column style="height: 100%;">
        <v-flex v-if="canAddNewTodo" shrink>
          <v-text-field @click:append="addNewTodo" @keyup.enter="addNewTodo" v-model="todoName" solo prepend-inner-icon="mdi-plus" append-icon="mdi-send" :placeholder="$t('todoView.addNewTask')"></v-text-field>
        </v-flex>
        <v-flex grow style="overflow: hidden; height: 0; position: relative;" class="ps" ref="scrollContainer">
          <v-list class="transparent">
            <template v-for="(item, index) in todosProxy">
              <v-btn v-if="item.name" text small dark class="min-width-0" :key="item.name + index">{{ item.name }}</v-btn>
              <todo-item v-for="t in item.todos" @click="clickTodo" @click:checkbox="clickComplete" @click:star="clickStar" :todo="t" :key="t.id"></todo-item>
            </template>
            <template v-if="!isSpecialFolder">
              <v-btn @click="clickLoadingCompleteBtn" :loading="completeTodo.isLoading" text small dark class="min-width-0">{{ loadingCompleteBtnName }}</v-btn>
              <todo-item v-for="t in completeTodo.todos" @click="clickCompleteTodo" @click:checkbox="clickIncomplete" :todo="t" :key="t.id" style="opacity: 0.6;"></todo-item>
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
    ...mapGetters('todoView', ['todos']),
    ...mapGetters('globalAction', ['searchValid']),
    ...mapState('todoView', ['currentFolder']),
    ...mapState('user', ['folders']),
    currentFolderName () {
      if (this.searchValid) {
        return this.$t('search')
      }
      switch (this.currentFolder) {
        case 'star':
          return this.$t('todoView.star')
        case 'today':
          return this.$t('todoView.today')
        case 'thisWeek':
          return this.$t('todoView.thisWeek')
      }
      const folder = this.folders[this.currentFolder]
      if (!folder) {
        return ''
      } else {
        return folder.name
      }
    },
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
      return this.completeTodo.isShow ? this.$t('todoView.hideCompleteTask') : this.$t('todoView.displayCompleteTask')
    }
  },
  watch: {
    currentFolder () {
      // hide completeTodo
      this.completeTodo.isShow = false
      this.completeTodo.todos.splice(0, this.completeTodo.todos.length)
      // close detailView
      this.changeDetailViewVisible(false)
    }
  },
  mounted () {
    this.getPerfectScrollbarInstance(this.$refs.scrollContainer)
  },
  methods: {
    ...mapActions('user', ['addTodo', 'modifyTodo', 'markTodoAsDone', 'markTodoAsUndone']),
    ...mapActions('detailView', ['changeDetailViewVisible', 'changeCurrentTodo', 'changeCurrentCompleteTodo']),
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
      this.completeTodo.isLoading = true
      const todos = await getArchiveTodos({ folder: this.currentFolder })
      this.completeTodo.todos.splice(0, this.completeTodo.todos.length, ...todos)
      this.completeTodo.isLoading = false
    },
    async clickLoadingCompleteBtn () {
      this.completeTodo.isShow = !this.completeTodo.isShow
      if (!this.completeTodo.isShow) {
        this.completeTodo.todos.splice(0, this.completeTodo.todos.length)
        return
      }
      await this.loadingCompleteTodo()
    },
    clickCompleteTodo (id) {
      this.changeCurrentCompleteTodo(id)
      this.changeDetailViewVisible(true)
    },
    async clickIncomplete ({ id, complete }) {
      if (id && !complete) {
        await this.markTodoAsUndone(id)
        await this.loadingCompleteTodo()
      }
    }
  }
}
</script>

<style scoped>

</style>
