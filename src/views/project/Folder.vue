<template>
  <v-layout column class="project-view-folder blue-grey lighten-4 pa-2">
    <div class="folder-header project-handle">
      <span class="title no-select">{{ name }}</span>
      <v-btn icon class="mx-0"><v-icon>mdi-dots-vertical</v-icon></v-btn>
    </div>
    <draggable @change="change" v-model="todosProxy" tag="div" v-bind="dragOption" class="ps" style="position: relative;" ref="scrollContainer">
      <v-card v-for="item in todosProxy" @click="clickTodo(item.id)" flat ripple class="mb-2" :key="item.id">
        <v-card-title class="pa-2">
          <div>
            <div class="subheading no-select mb-2">{{ item.name }}</div>
            <div>
              <span v-if="item.totalSubtask" class="mr-2">
                <v-icon small>mdi-checkbox-marked-circle-outline</v-icon>
                {{ item.reserveSubtask }}/{{ item.totalSubtask }}
              </span>
              <v-icon v-if="item.star" small class="mr-2">mdi-star-outline</v-icon>
              <v-icon v-if="item.expiredDate" small class="mr-2">mdi-calendar</v-icon>
              <v-icon v-if="item.comment" small class="mr-2">mdi-comment-outline</v-icon>
              <v-icon v-if="item.attachment" small>mdi-attachment</v-icon>
            </div>
          </div>
        </v-card-title>
      </v-card>
    </draggable>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Draggable from 'vuedraggable'
import perfectScrollbarMixin from '@/components/mixins/perfectScrollbarMixin'

export default {
  name: 'Folder',
  mixins: [perfectScrollbarMixin],
  components: { Draggable },
  data () {
    return {
      todosContent: []
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
    todosProxy: {
      get () {
        const folder = this.folders[this.id]
        if (!folder) {
          return []
        }
        return folder.undos.map(todo => {
          const t = this.todos[todo]
          const { id, name } = t
          const attachment = !t.attachment ? false : (t.attachment.length > 0)
          const totalSubtask = t.subtasks ? t.subtasks.length : 0
          const reserveSubtask = !totalSubtask ? 0 : t.subtasks.filter(s => s.complete).length
          const comment = !t.comments ? false : (t.comments.length > 0)
          const expiredDate = !!t.expired_date
          const star = !!t.star
          return { id, name, attachment, totalSubtask, reserveSubtask, comment, expiredDate, star }
        })
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
  mounted () {
    this.ps = this.getPerfectScrollbarInstance(this.$refs.scrollContainer.$el)
  },
  methods: {
    ...mapActions('user', ['modifyFolder', 'changeDetailViewVisible', 'changeCurrentTodo']),
    change () {
      const undos = this.todosContent.map(t => t.id)
      this.modifyFolder({ id: this.id, undos })
    },
    clickTodo (id) {
      this.changeCurrentTodo(id)
      this.changeDetailViewVisible(true)
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
