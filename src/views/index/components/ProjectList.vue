<template>
  <v-list dense class="pa-0">
    <draggable @change="projectsChange" v-model="projectsProxy" tag="div" v-bind="projectDragOption">
      <v-list-tile v-for="item in projectsProxy"
                   @click="projectClick(item.id)"
                   avatar ripple :key="item.id"
                   :class="currentProject === item.id ? 'sidebar-item-selected': ''">
        <v-list-tile-action><v-icon>mdi-folder-multiple-outline</v-icon></v-list-tile-action>
        <v-list-tile-content>{{ item.name }}</v-list-tile-content>
      </v-list-tile>
    </draggable>
  </v-list>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import Draggable from 'vuedraggable'

export default {
  name: 'ProjectList',
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
