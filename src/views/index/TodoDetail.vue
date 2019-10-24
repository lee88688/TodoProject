<template>
  <transition>
    <v-layout v-show="showDetailView" column style="height: 100%; width: 350px;">
      <v-flex shrink class="todo-detail-header">
        <v-checkbox @change="refresh" hide-details v-model="todo.complete" class="ma-0" style="flex: 0 0 auto;"></v-checkbox>
        <v-text-field v-if="nameEditMode" @blur="nameChange" @keyup.enter="nameChange" v-model="nameProxy" hide-details single-line class="pa-0 ma-0"></v-text-field>
        <div v-else @click="nameClick" class="todo-detail-header-text">{{ todo.name }}</div>
        <star-select @click="refresh" v-model="todo.star"></star-select>
      </v-flex>
      <v-flex grow class="todo-detail-middle ps" style="height: 0; position: relative;" ref="scrollContainer">
        <div>
          <v-subheader style="height: 20px;">{{ $t('sideBar.dateSetting.name') }}</v-subheader>
          <date-setting @input="timeChange" :expired-date="todo.expired_date" :remind-time="todo.remind_time" :repeat="todo.repeat" class="mb-3"></date-setting>
          <v-subheader style="height: 20px;">{{ $t('sideBar.subtask.name') }}</v-subheader>
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
                        :label="$t('sideBar.subtask.add')"
                        class="todo-detail-icon-left-margin mb-3">
          </v-text-field>
          <v-textarea @change="remarkChange"
                      :value="todo.remark"
                      flat hide-details auto-grow prepend-icon="mdi-square-edit-outline"
                      :label="$t('sideBar.remark')"
                      class="mb-3 todo-detail-icon-left-margin">
          </v-textarea>
          <!--<v-btn block depressed text class="btn-block-align-left mb-3"><v-icon class="mr-1">mdi-attachment</v-icon>添加文件</v-btn>-->
          <v-list v-if="showComments" class="transparent">
            <v-subheader style="height: 20px;">{{ $t('sideBar.comment.name') }}</v-subheader>
            <template v-for="(item, index) in todo.comments">
              <v-card flat :key="index" class="transparent">
                <v-layout class="pt-2 pb-0">
                  <v-flex shrink class="pa-2"><v-avatar color="blue lighten-5" size="40px">{{ item.name }}</v-avatar></v-flex>
                  <v-flex grow>
                    <v-card-title class="pa-0">
                      <div>
                        <span class="title">{{ item.content }}</span><br>
                        <span class="subtitle-1 grey--text">{{ item.time }}</span>
                      </div>
                    </v-card-title>
                    <v-card-actions class="pa-0">
                      <v-btn @click="removeComment(index)" text color="red lighten-3" class="ma-0 pa-1 min-width-0">
                        {{ $t('delete') }}
                      </v-btn>
                    </v-card-actions>
                    <v-divider :key="index"></v-divider>
                  </v-flex>
                </v-layout>
              </v-card>
            </template>
          </v-list>
        </div>
      </v-flex>
      <v-flex shrink class="todo-detail-end">
        <v-text-field @click:append="addNewComment"
                      v-model="commentContent" hide-details
                      :label="$t('sideBar.comment.name')"
                      prepend-inner-icon="mdi-comment-processing-outline"
                      append-icon="mdi-send"
                      class="ma-0">
        </v-text-field>
        <div class="todo-detail-bottom-bar">
          <v-btn text class="min-width-0 ma-0 pa-2" @click="closeDetailView"><v-icon>mdi-chevron-double-right</v-icon></v-btn>
          <v-subheader class="no-select">{{ todo.create_time }}</v-subheader>
          <div>
            <!--<v-btn text class="min-width-0 ma-0 pa-2"><v-icon>mdi-sync</v-icon></v-btn>-->
            <v-btn @click="deleteClick" text class="min-width-0 ma-0 pa-2"><v-icon>mdi-delete-outline</v-icon></v-btn>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </transition>
</template>

<script>
import isArray from 'lodash/isArray'
import { mapState, mapActions, mapGetters } from 'vuex'
import DateSetting from '@/views/index/components/DateSetting'
import perfectScrollbarMixin from '@/components/mixins/perfectScrollbarMixin'
import StarSelect from '@/components/StarSelect'
import Subtask from '@/views/index/components/Subtask'
import message from '@/components/message'

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
        comments: [],
        create_time: ''
      },
      subtaskContent: '',
      nameEditMode: false,
      nameContent: '',
      commentContent: ''
    }
  },
  computed: {
    ...mapState('user', ['todos']),
    ...mapState('detailView', ['currentCompleteTodo']),
    ...mapState('detailView', ['showDetailView', 'currentTodo']),
    ...mapGetters('user', ['userInfo']),
    ...mapGetters('detailView', ['isCompleteTodo']),
    currentTodoDetail () {
      if (this.isCompleteTodo) {
        return this.currentCompleteTodo
      }
      return this.todos[this.currentTodo]
    },
    nameProxy: {
      get () {
        return this.todo.name
      },
      set (val) {
        this.nameContent = val
      }
    },
    showComments () {
      return !!(this.todo.comments && this.todo.comments.length)
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
          } else if (isArray(this.todo[k])) {
            this.todo[k].splice(0, this.todo[k].length, ...val[k])
            continue
          }
          this.todo[k] = val[k]
        }
        this.$refs.scrollContainer.scrollTop = 0
        this.ps.update()
      },
      immediate: true
    }
  },
  mounted () {
    this.ps = this.getPerfectScrollbarInstance(this.$refs.scrollContainer)
  },
  methods: {
    ...mapActions('user', ['modifyTodo', 'deleteTodo']),
    ...mapActions('detailView', ['changeDetailViewVisible', 'changeCurrentTodo']),
    enterSubtask () {
      if (!this.subtaskContent) return
      this.todo.subtasks.push({
        complete: false,
        content: this.subtaskContent
      })
      this.subtaskContent = ''
      this.modifyTodo({ id: this.currentTodo, subtasks: this.todo.subtasks })
    },
    subtaskChange (index, val) {
      this.todo.subtasks.splice(index, 1, val)
      this.modifyTodo({ id: this.currentTodo, subtasks: this.todo.subtasks })
    },
    removeSubtask (index) {
      this.todo.subtasks.splice(index, 1)
      this.modifyTodo({ id: this.currentTodo, subtasks: this.todo.subtasks })
    },
    remarkChange (val) {
      this.todo.remark = val
      this.modifyTodo({ id: this.currentTodo, remark: val })
    },
    refresh () {
      this.modifyTodo({
        id: this.currentTodo,
        ...this.todo
      })
    },
    closeDetailView () {
      this.changeDetailViewVisible(false)
      // this.refresh()
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
      const payload = { id: this.currentTodo }
      expiredDate !== undefined && (payload.expired_date = expiredDate)
      remindTime !== undefined && (payload.remind_time = remindTime)
      repeat !== undefined && (payload.repeat = repeat)
      this.modifyTodo(payload)
    },
    nameChange () {
      this.todo.name = this.nameContent
      this.nameEditMode = false
      this.modifyTodo({ id: this.currentTodo, name: this.todo.name })
    },
    addNewComment () {
      if (!this.commentContent) return
      const { comments } = this.todo
      comments.push({
        user: this.userInfo.id,
        name: this.userInfo.name,
        content: this.commentContent,
        time: new Date().toISOString().substr(0, 19).replace('T', ' ')
      })
      this.commentContent = ''
      this.modifyTodo({ id: this.currentTodo, comments })
    },
    removeComment (index) {
      const { comments } = this.todo
      comments.splice(index, 1)
      this.modifyTodo({ id: this.currentTodo, comments })
    },
    async deleteClick () {
      let r = await message({
        title: '删除',
        message: '是否删除当前清单？'
      })
      if (r) {
        this.deleteTodo(this.currentTodo)
        this.changeCurrentTodo('')
        this.changeDetailViewVisible(false)
      }
    },
    nameClick () {
      this.nameEditMode = true
      this.nameProxy = this.todo.name
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

  .todo-detail-bottom-bar {
    height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
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
