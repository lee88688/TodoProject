<template>
  <v-list dense class="pa-0">
    <draggable @change="projectsChange" v-model="projectsProxy" tag="div" v-bind="projectDragOption">
      <v-list-item v-for="item in projectsProxy"
                   @click="projectClick(item.id)"
                   @contextmenu="contextmenuClick($event, item.id)"
                   avatar ripple :key="item.id"
                   :class="currentProject === item.id ? 'sidebar-item-selected': ''">
        <v-list-item-action><v-icon>mdi-folder-multiple-outline</v-icon></v-list-item-action>
        <v-list-item-content>{{ item.name }}</v-list-item-content>
      </v-list-item>
    </draggable>
    <menu-items :menu="menu"></menu-items>
  </v-list>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import Draggable from 'vuedraggable'
import menuMixin from '@/components/mixins/menuMixin'
import message from '@/components/message'

export default {
  name: 'ProjectList',
  mixins: [menuMixin],
  components: { Draggable },
  data () {
    return {
      projectsContent: []
    }
  },
  computed: {
    ...mapState('projectView', ['currentProject']),
    ...mapGetters('projectView', ['projects']),
    projectsProxy: {
      get () {
        return this.projects
      },
      set (val) {
        this.projectsContent = [...val]
      }
    },
    projectDragOption () {
      return {
        animation: 200,
        disabled: false,
        group: 'aside-project-list',
        ghostClass: 'draggable-ghost'
      }
    }
  },
  created () {
    this.registerMenuItem([
      {
        name: '工程选项',
        callback: project => {
          this.$emit('reconfig', project)
        }
      },
      {
        name: '删除工程',
        callback: async (project) => {
          let r = await message({
            title: '删除',
            message: '是否删除该项目？'
          })
          r && this.deleteProject({ project, deleteSubs: false })
        }
      },
      {
        name: '删除工程及其文件夹',
        callback: async (project) => {
          let r = await message({
            title: '删除',
            message: '是否删除该项目及其文件夹？'
          })
          r && this.deleteProject({ project, deleteSubs: true })
        }
      }
    ])
  },
  methods: {
    ...mapActions('projectView', ['changeCurrentProject']),
    ...mapActions('user', ['modifyProjectList', 'deleteProject']),
    projectClick (id) {
      this.changeCurrentProject(id)
    },
    projectsChange () {
      this.modifyProjectList(this.projectsContent.map(item => item.id))
    }
  }
}
</script>
