<template>
  <v-layout column class="project-view-folder blue-grey lighten-4 pa-2">
    <div class="folder-header project-handle">
      <span class="title no-select">{{ name }}</span>
      <v-btn @click="addNewTask" icon class="mx-0"><v-icon>mdi-plus</v-icon></v-btn>
      <v-menu offset-y left>
        <template #activator="{ on }">
          <v-btn v-on="on" icon class="mx-0"><v-icon>mdi-dots-vertical</v-icon></v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="reconfigFolder">
            <v-list-item-title>修改文件夹</v-list-item-title>
          </v-list-item>
          <v-list-item @click="deleteClick">
            <v-list-item-title>删除文件夹</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <draggable @change="change" v-model="todosProxy" tag="div" v-bind="dragOption" class="ps" style="position: relative;" ref="scrollContainer">
      <v-card v-for="item in todosProxy" @click="clickTodo(item.id)" @contextmenu="contextmenuClick($event, item.id)" flat ripple class="mb-2" :key="item.id">
        <v-card-title class="pa-2">
          <div>
            <div class="subheading no-select mb-2">{{ item.name }}</div>
            <div>
              <span v-if="item.totalSubtask" class="mr-2" style="font-size: 0.9rem;">
                <v-icon small>mdi-checkbox-marked-circle-outline</v-icon>
                {{ item.reserveSubtask }}/{{ item.totalSubtask }}
              </span>
              <v-icon v-if="item.star" small class="mr-2">mdi-star-outline</v-icon>
              <v-icon v-if="item.showExpiredDate" small class="mr-2">mdi-calendar</v-icon>
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
        let undos = folder.undos.map(todo => {
          const t = this.todos[todo]
          const { id, name } = t
          const attachment = !t.attachment ? false : (t.attachment.length > 0)
          const totalSubtask = t.subtasks ? t.subtasks.length : 0
          const reserveSubtask = !totalSubtask ? 0 : t.subtasks.filter(s => s.complete).length
          const comment = !t.comments ? false : (t.comments.length > 0)
          const showExpiredDate = !!t.expired_date
          const star = !!t.star
          return { id, name, attachment, totalSubtask, reserveSubtask, comment, showExpiredDate, star }
        })
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
        name: '标记为完成'
      },
      {
        name: '删除任务',
        callback: async (id) => {
          let r = await message({
            title: '删除任务',
            content: '是否删除当前任务？'
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
    ...mapActions('user', ['modifyFolder', 'changeDetailViewVisible', 'changeCurrentTodo', 'deleteFolder', 'addTodo', 'deleteTodo']),
    ...mapActions('globalAction', ['startAddingNew', 'changePaletteShow']),
    change () {
      const undos = this.todosContent.map(t => t.id)
      this.modifyFolder({ id: this.id, undos })
    },
    clickTodo (id) {
      this.changeCurrentTodo(id)
      this.changeDetailViewVisible(true)
    },
    async deleteClick () {
      let r = await message({
        title: '删除',
        message: '是否删除文件夹？'
      })
      r && this.deleteFolder(this.id)
    },
    addNewTask () {
      if (this.paletteShow) {
        this.changePaletteShow(false)
      }
      this.startAddingNew({
        placeholder: `${this.name}: 添加新任务`,
        extra: this.id
      })
    },
    reconfigFolder () {
      this.$bus.$emit('folder-project-reconfig', { type: 'folder', id: this.id })
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
