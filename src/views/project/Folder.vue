<template>
  <v-layout column class="project-view-folder blue-grey lighten-4 pa-2">
    <div class="folder-header project-handle">
      <span class="title no-select">{{ name }}</span>
      <v-btn @click="addNewTask" icon small class="mx-0"><v-icon>mdi-plus</v-icon></v-btn>
      <v-menu offset-y left>
        <template #activator="{ on }">
          <v-btn v-on="on" icon small class="mx-0"><v-icon>mdi-dots-vertical</v-icon></v-btn>
        </template>
        <v-list>
          <v-list-item @click="reconfigFolder">
            <v-list-item-title>{{ $t('projectView.folderMenu.folderConfig') }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="deleteClick">
            <v-list-item-title>{{ $t('projectView.folderMenu.deleteFolder') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <draggable @change="change" v-model="todosProxy" tag="div" v-bind="dragOption" class="ps" style="position: relative;" ref="scrollContainer">
      <v-card v-for="item in todosProxy" @click="clickTodo(item.id)" @contextmenu="contextmenuClick($event, item.id)" flat ripple class="mb-2" :key="item.id">
        <v-card-title class="pa-2">
          <div>
            <div class="subtitle-1 no-select mb-2" style="font-weight: normal;">{{ item.name }}</div>
            <div v-if="item.showExpiredDate" class="subtitle-2" :class="item.expiredDateColor">
              <v-icon small :class="item.expiredDateColor">mdi-calendar</v-icon>
              {{ expiredDateName(item.expiredDate) }}
            </div>
            <div class="subtitle-2">
              <span v-if="item.totalSubtask" class="mr-2" style="font-size: 0.9rem;">
                <v-icon small>mdi-checkbox-marked-circle-outline</v-icon>
                {{ item.reserveSubtask }}/{{ item.totalSubtask }}
              </span>
              <v-icon v-if="item.star" small class="mr-2">mdi-star-outline</v-icon>
              <v-icon v-if="item.comment" small class="mr-2">mdi-comment-outline</v-icon>
              <v-icon v-if="item.attachment" small>mdi-attachment</v-icon>
            </div>
          </div>
        </v-card-title>
      </v-card>
    </draggable>
    <menu-items :menu="menu"></menu-items>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Draggable from 'vuedraggable'
import perfectScrollbarMixin from '@/components/mixins/perfectScrollbarMixin'
import menuMixin from '@/components/mixins/menuMixin'
import message from '@/components/message'
import { todoTransform } from '@/views/lib'

export default {
  name: 'Folder',
  mixins: [perfectScrollbarMixin, menuMixin],
  components: { Draggable },
  data () {
    return {
      todosContent: [],
      snackbar: false
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('user', ['folders', 'todos']),
    ...mapGetters('globalAction', ['paletteShow', 'searchValid']),
    todosProxy: {
      get () {
        const folder = this.folders[this.id]
        if (!folder) {
          return []
        }
        const searchKeyword = this.$store.state.globalAction.palette.input
        let undos = folder.undos.map(t => this.todos[t]).map(todoTransform)
        if (this.searchValid) {
          return undos.filter(todo => todo.name.includes(searchKeyword))
        }
        return undos
      },
      set (val) {
        this.todosContent = [...val]
      }
    },
    dragOption () {
      return {
        animation: 200,
        disabled: false,
        group: 'project-folder',
        ghostClass: 'draggable-ghost'
      }
    }
  },
  created () {
    this.registerMenuItem([
      {
        name: this.$t('projectView.todoMenu.markAsComplete'),
        callback: async id => {
          await this.markTodoAsDone(id)
        }
      },
      {
        name: this.$t('projectView.todoMenu.deleteTask'),
        callback: async (id) => {
          let r = await message({
            title: this.$t('projectView.todoMenu.deleteTask'),
            message: this.$t('projectView.todoMenu.deleteTaskContent')
          })
          r && this.deleteTodo(id)
        }
      }
    ])
  },
  mounted () {
    this.ps = this.getPerfectScrollbarInstance(this.$refs.scrollContainer.$el)
    this.paletteClick = folder => {
      if (folder === this.id) {
        this.addTodo({
          name: this.$store.state.globalAction.palette.input,
          folder
        })
        this.changePaletteShow(false)
      }
    }
    this.$bus.$on('palette-append-click', this.paletteClick)
  },
  beforeDestroy () {
    this.$bus.$off('palette-append-click', this.paletteClick)
  },
  methods: {
    ...mapActions('user', ['modifyFolder', 'modifyTodo', 'deleteFolder', 'addTodo', 'deleteTodo', 'markTodoAsDone']),
    ...mapActions('detailView', ['changeDetailViewVisible', 'changeCurrentTodo']),
    ...mapActions('globalAction', ['startAddingNew', 'changePaletteShow']),
    async change (e) {
      // console.log(e)
      // const undos = this.todosContent.map(t => t.id)
      // this.modifyFolder({ id: this.id, undos })

      if ('moved' in e) {
        const undos = this.todosContent.map(t => t.id)
        this.modifyFolder({ id: this.id, undos })
      } else if ('added' in e) {
        const undos = this.todosContent.map(t => t.id)
        const folder = this.id
        const id = e.added.element.id
        await this.modifyTodo({ id, folder })
        this.modifyFolder({ id: this.id, undos })
      }
    },
    clickTodo (id) {
      this.changeCurrentTodo(id)
      this.changeDetailViewVisible(true)
    },
    async deleteClick () {
      let r = await message({
        title: this.$t('delete'),
        message: this.$t('projectView.folderMenu.deleteFolderContent')
      })
      r && this.deleteFolder(this.id)
    },
    addNewTask () {
      if (this.paletteShow) {
        this.changePaletteShow(false)
      }
      this.startAddingNew({
        placeholder: `${this.name}: ${this.$t('sideBar.subtask.add')}`,
        extra: this.id
      })
    },
    reconfigFolder () {
      this.$bus.$emit('folder-project-reconfig', { type: 'folder', id: this.id })
    },
    expiredDateName (date) {
      if (!date.startsWith('days')) {
        return date
      }
      return this.$t(date)
    }
  }
}
</script>

<style lang="scss" scoped>
.project-view-folder {
  width: 290px;
  max-height: 100%;
  border-radius: 5px;
  overflow: hidden;
  flex: 0 0 auto;

  .folder-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    > span {
      flex: 1 1 auto;
    }
  }
}

.v-card:hover {
  background-color: #ECEFF1;
  cursor: pointer;
}
</style>

<style lang="scss">
.folder-snackbar {
  .v-snack__content {
    padding: 0;
  }
}
</style>
