<template>
  <transition>
    <v-layout v-show="showDetailView"
              @keyup="refreshTimer"
              column style="height: 100%; width: 350px;">
      <v-flex shrink class="todo-detail-header">
        <v-checkbox @change="refresh" hide-details v-model="todo.complete" class="ma-0" style="flex: 0 0 auto;"></v-checkbox>
        <v-text-field v-if="nameEditMode" @blur="nameChange" @keyup.enter="nameChange" v-model="nameProxy" hide-details single-line class="pa-0 ma-0"></v-text-field>
        <div v-else @click="nameEditMode = true" class="todo-detail-header-text">{{ todo.name }}</div>
        <star-select @click="refresh" v-model="todo.star"></star-select>
      </v-flex>
      <v-flex grow class="todo-detail-middle ps" style="height: 0; position: relative;" ref="scrollContainer">
        <div>
          <date-setting @input="timeChange" :expired-date="todo.expired_date" :remind-time="todo.remind_time" :repeat="todo.repeat"></date-setting>
          <subtask v-for="(item, index) in todo.subtasks"
                   @input="subtaskChange(index, $event)"
                   @delete="removeSubtask(index)"
                   :complete="item.complete"
                   :content="item.content" :key="index"
                   class="todo-detail-icon-left-margin mb-2">
          </subtask>
          <v-text-field @keyup.enter="enterSubtask"
                        v-model="subtaskContent"
                        flat hide-details clearable
                        prepend-icon="mdi-plus"
                        label="添加子任务"
                        class="todo-detail-icon-left-margin mb-2">
          </v-text-field>
          <v-textarea @blur="remarkBlur" v-model="remarkProxy" flat hide-details auto-grow clearable prepend-icon="mdi-square-edit-outline" label="备注" class="todo-detail-icon-left-margin"></v-textarea>
          <v-btn block flat class="btn-block-align-left"><v-icon class="mr-1">mdi-attachment</v-icon>添加文件</v-btn>
        </div>
      </v-flex>
      <v-flex shrink class="todo-detail-end">
        <v-btn flat class="min-width-0 ma-0 pa-2" @click="closeDetailView"><v-icon>mdi-chevron-double-right</v-icon></v-btn>
        <v-subheader class="no-select">{{ todo.create_time }}</v-subheader>
        <div>
          <v-btn flat class="min-width-0 ma-0 pa-2"><v-icon>mdi-sync</v-icon></v-btn>
          <v-btn flat class="min-width-0 ma-0 pa-2"><v-icon>mdi-delete-outline</v-icon></v-btn>
        </div>
      </v-flex>
    </v-layout>
  </transition>
</template>

<script>
import isArray from 'lodash/isArray'
import { mapState, mapActions } from 'vuex'
import DateSetting from '@/views/todolist/components/DateSetting'
import perfectScrollbarMixin from '@/components/mixins/perfectScrollbarMixin'
import StarSelect from '@/components/StarSelect'
import Subtask from '@/views/todolist/components/Subtask'
import { RefreshTimer } from '@/lib/utils'

export default {
  name: 'TodoDetail',
  mixins: [perfectScrollbarMixin],
  components: { Subtask, StarSelect, DateSetting },
  data () {
    return {
      todo: {
        name: '',
        complete: false,
        star: false,
        expired_date: '',
        remind_time: '',
        repeat: '',
        subtasks: [],
        remark: '',
        attachment: [],
        create_time: ''
      },
      subtaskContent: '',
      remarkContent: '',
      nameEditMode: true,
      nameContent: ''
    }
  },
  computed: {
    ...mapState('todoView', ['showDetailView', 'currentTodo']),
    ...mapState('user', ['todos']),
    currentTodoDetail () {
      return this.todos[this.currentTodo]
    },
    remarkProxy: {
      get () {
        return this.todo.remark
      },
      set (val) {
        this.remarkContent = val
      }
    },
    nameProxy: {
      get () {
        return this.todo.name
      },
      set (val) {
        this.nameContent = val
      }
    }
  },
  watch: {
    currentTodoDetail: {
      handler (val) {
        if (!val) { return }
        this.clearTodo()
        for (const k in this.todo) {
          if (val[k] === undefined || val[k] === null) {
            continue
          } else if (k === 'subtasks' || k === 'attachment') {
            this.todo[k].splice(0, this.todo[k].length, ...val[k])
            continue
          }
          this.todo[k] = val[k]
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.ps = this.getPerfectScrollbarInstance(this.$refs.scrollContainer)
    this.rt = new RefreshTimer(this.refresh)
  },
  methods: {
    ...mapActions('todoView', ['changeDetailViewVisible']),
    ...mapActions('user', ['modifyTodo']),
    enterSubtask () {
      this.todo.subtasks.push({
        complete: false,
        content: this.subtaskContent
      })
      this.subtaskContent = ''
    },
    subtaskChange (index, val) {
      this.todo.subtasks.splice(index, 1, val)
    },
    removeSubtask (index) {
      this.todo.subtasks.splice(index, 1)
    },
    remarkBlur () {
      this.todo.remark = this.remarkContent
    },
    refresh () {
      console.log('refresh')
      this.rt.clear()
      this.modifyTodo({
        id: this.currentTodo,
        ...this.todo
      })
    },
    refreshTimer () {
      // console.log('get!!!')
      this.rt.refresh(10)
    },
    closeDetailView () {
      this.changeDetailViewVisible(false)
      this.refresh()
    },
    clearTodo () {
      for (let k in this.todo) {
        if (!this.todo.hasOwnProperty(k)) {
          continue
        }
        switch (typeof this.todo[k]) {
          case 'boolean': {
            this.todo[k] = false
            break
          }
          case 'string': {
            this.todo[k] = ''
            break
          }
          case 'object': {
            if (isArray(this.todo[k])) {
              this.todo[k].splice(0, this.todo[k].length)
            }
            break
          }
          default: {
            this.todo[k] = null
            break
          }
        }
      }
    },
    timeChange ({ expiredDate, remindTime, repeat }) {
      // todo: add store commit
      expiredDate !== undefined && (this.todo.expired_date = expiredDate)
      remindTime !== undefined && (this.todo.remind_time = remindTime)
      repeat !== undefined && (this.todo.repeat = repeat)
    },
    nameChange () {
      // todo: add store commit
      this.todo.name = this.nameContent
      this.nameEditMode = false
    }
  }
}
</script>

<style lang="scss" scoped>
.todo-detail-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  background-color: #ffffff;

  .todo-detail-header-text {
    flex: 1 1 auto;
    font-size: 20px;
    width: 0;
    word-break: break-all;
  }
}

.todo-detail-middle {
  background-color: #fafafa;
}

.todo-detail-end {
  background-color: #ffffff;
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-detail-icon-left-margin {
  margin-left: 16px;
}

/*not use temporarily*/
.todo-detail {
  &-enter-active, &-leave-active {
    transition: 0.5s linear;
  }

  &-enter, &-leave-to {
    width: 0;
  }

  &-enter-to, &-leave {
    width: 350px;
  }
}
</style>
