<template>
  <v-list-item @click="click(todo.id)"
               ripple class="elevation-1 my-1 todo-item"
               :class="showDetailView && (currentTodo === todo.id) ? 'todo-item-selected' : ''">
    <v-list-item-action style="min-width: 0;">
      <v-checkbox @change="clickComplete(todo.id, $event)" @click.native.stop="doNothing" :input-value="todo.complete"></v-checkbox>
    </v-list-item-action>
    <v-list-item-content>{{ todo.name }}</v-list-item-content>
    <v-list-item-content class="mr-3" style="flex: 0 0 auto;">
                  <span style="display: inline-flex;">
                    <span v-if="todo.showExpiredDate" :class="todo.expiredDateColor" class="mr-2">{{ todo.expiredDate }}</span>
                    <span v-if="todo.totalSubtask" class="mr-2" style="display: inline-flex;">
                      <v-icon small class="mr-1">mdi-checkbox-marked-circle-outline</v-icon>
                      {{ todo.reserveSubtask }}/{{ todo.totalSubtask }}
                    </span>
                    <v-icon v-if="todo.comment" small class="mr-2">mdi-comment-outline</v-icon>
                    <v-icon v-if="todo.attachment" small>mdi-attachment</v-icon>
                  </span>
    </v-list-item-content>
    <star-select @input="clickStar(todo.id, $event)" @click.native.stop="doNothing" :value="todo.star"></star-select>
  </v-list-item>
</template>

<script>
import { mapState } from 'vuex'
import StarSelect from '@/components/StarSelect'

export default {
  name: 'TodoItem',
  components: { StarSelect },
  props: {
    todo: {
      required: true
    }
  },
  computed: {
    ...mapState('user', ['currentTodo', 'showDetailView'])
  },
  methods: {
    doNothing () { /* do not remove this function! */ },
    click (id) {
      this.$emit('click', id)
    },
    clickComplete (id, complete) {
      this.$emit('click:checkbox', { id, complete })
    },
    clickStar (id, star) {
      this.$emit('click:star', { id, star })
    }
  }
}
</script>

<style scoped>
.todo-item-selected {
  background-color: rgba(250, 250, 250, 0.9) !important;
}

.todo-item {
  background-color: white;
  user-select: none;
}
</style>
