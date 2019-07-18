<template>
  <v-list dense class="pa-0">
    <draggable @change="projectsChange" v-model="projectsProxy" tag="div" v-bind="projectDragOption">
      <v-list-tile v-for="item in projectsProxy"
                   @click="projectClick(item.id)"
                   @contextmenu="contextmenuClick"
                   avatar ripple :key="item.id"
                   :class="currentProject === item.id ? 'sidebar-item-selected': ''">
        <v-list-tile-action><v-icon>mdi-folder-multiple-outline</v-icon></v-list-tile-action>
        <v-list-tile-content>{{ item.name }}</v-list-tile-content>
      </v-list-tile>
    </draggable>
    <menu-items :menu="menu"></menu-items>
  </v-list>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import Draggable from 'vuedraggable'
import menuMixin from '@/components/mixins/menuMixin'

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
        name: '工程选项'
      },
      {
        name: '删除工程'
      },
      {
        name: '删除工程及其文件夹'
      }
    ])
  },
  methods: {
    ...mapActions('projectView', ['changeCurrentProject']),
    ...mapActions('user', ['modifyProjectList']),
    projectClick (id) {
      this.changeCurrentProject(id)
    },
    projectsChange () {
      this.modifyProjectList(this.projectsContent.map(item => item.id))
    }
  }
}
</script>
