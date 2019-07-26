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
    <v-flex grow class="pa-3" style="background-color: #78909C; overflow: hidden;">
      <v-layout column style="height: 100%;">
        <v-flex v-if="canAddNewTodo" shrink>
          <v-text-field @click:append="addNewTodo" @keyup.enter="addNewTodo" v-model="todoName" solo prepend-inner-icon="mdi-plus" append-icon="mdi-send" placeholder="添加新任务"></v-text-field>
        </v-flex>
        <v-flex grow style="overflow: hidden; height: 0; position: relative;" class="ps" ref="scrollContainer">
          <v-list class="transparent">
            <template v-for="item in todosProxy">
              <v-btn v-if="item.name" flat small dark class="min-width-0" :key="item.name">{{ item.name }}</v-btn>
<!--              <v-list-tile v-for="t in item.todos" @click="clickTodo(t.id)"-->
<!--                           :key="t.id" ripple-->
<!--                           class="elevation-1 my-1 todo-item"-->
<!--                           :class="showDetailView && (currentTodo === t.id) ? 'todo-item-selected' : ''">-->
<!--                <v-list-tile-action style="min-width: 0;">-->
<!--                  <v-checkbox @change="clickComplete(t.id, $event)" @click.native.stop="doNothing" :input-value="t.complete"></v-checkbox>-->
<!--                </v-list-tile-action>-->
<!--                <v-list-tile-content>{{ t.name }}</v-list-tile-content>-->
<!--                <v-list-tile-content class="mr-3" style="flex: 0 0 auto;">-->
<!--                  <span style="display: inline-flex;">-->
<!--                    <span v-if="t.showExpiredDate" :class="t.expiredDateColor" class="mr-2">{{ t.expiredDate }}</span>-->
<!--                    <span v-if="t.totalSubtask" class="mr-2" style="display: inline-flex;">-->
<!--                      <v-icon small class="mr-1">mdi-checkbox-marked-circle-outline</v-icon>-->
<!--                      {{ t.reserveSubtask }}/{{ t.totalSubtask }}-->
<!--                    </span>-->
<!--                    <v-icon v-if="t.comment" small class="mr-2">mdi-comment-outline</v-icon>-->
<!--                    <v-icon v-if="t.attachment" small>mdi-attachment</v-icon>-->
<!--                  </span>-->
<!--                </v-list-tile-content>-->
<!--                <star-select @input="clickStar(t.id, $event)" @click.native.stop="doNothing" :value="t.star"></star-select>-->
<!--              </v-list-tile>-->
              <todo-item v-for="t in item.todos" @click="clickTodo" @click:checkbox="clickComplete" @click:star="clickStar" :todo="t" :key="t.id"></todo-item>
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
import StarSelect from '@/components/StarSelect'
import { dateColor } from '@/lib/utils'
import TodoItem from '@/views/todo/TodoItem'

export default {
  name: 'TodoList',
  components: { TodoItem, StarSelect },
  mixins: [perfectScrollbarMixin],
  data () {
    return {
      todoName: ''
    }
  },
  computed: {
    ...mapGetters('todoView', ['todos', 'currentFolderName']),
    ...mapGetters('globalAction', ['searchValid']),
    ...mapState('todoView', ['currentFolder']),
    ...mapState('user', ['currentTodo', 'showDetailView']),
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
          'todos': item.todos.map(t => {
            const { id, name, complete } = t
            const attachment = !t.attachment ? false : (t.attachment.length > 0)
            // subtask
            const totalSubtask = t.subtasks ? t.subtasks.length : 0
            const reserveSubtask = !totalSubtask ? 0 : t.subtasks.filter(s => s.complete).length
            // comment
            const comment = !t.comments ? false : (t.comments.length > 0)
            // expired date
            const showExpiredDate = !!t.expired_date
            const expiredDate = t.expired_date
            const expiredDateColor = dateColor(expiredDate, true)
            // star
            const star = !!t.star
            return { id, name, complete, attachment, totalSubtask, reserveSubtask, comment, showExpiredDate, expiredDate, expiredDateColor, star }
          })
        }
      })
    }
  },
  mounted () {
    this.getPerfectScrollbarInstance(this.$refs.scrollContainer)
  },
  methods: {
    ...mapActions('user', ['addTodo', 'modifyTodo', 'changeDetailViewVisible', 'changeCurrentTodo']),
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
      this.modifyTodo({ id, complete })
    },
    clickStar ({ id, star }) {
      this.modifyTodo({ id, star })
    }
  }
}
</script>

<style scoped>

</style>
