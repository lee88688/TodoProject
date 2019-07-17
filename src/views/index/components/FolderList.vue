<template>
  <v-list dense class="pa-0">
    <v-list-tile avatar ripple @click="folderClick('star')" :class="currentFolder === 'star' ? 'sidebar-item-selected': ''">
      <v-list-tile-action><v-icon>mdi-star-outline</v-icon></v-list-tile-action>
      <v-list-tile-content>标星</v-list-tile-content>
      <v-list-tile-action-text>
        <span>10</span>
      </v-list-tile-action-text>
    </v-list-tile>
    <v-list-tile avatar ripple @click="folderClick('today')" :class="currentFolder === 'today' ? 'sidebar-item-selected': ''">
      <v-list-tile-action><v-icon>mdi-calendar-today</v-icon></v-list-tile-action>
      <v-list-tile-content>今天</v-list-tile-content>
      <v-list-tile-action-text>
        <span>10</span>
      </v-list-tile-action-text>
    </v-list-tile>
    <v-list-tile avatar ripple @click="folderClick('thisWeek')" :class="currentFolder === 'thisWeek' ? 'sidebar-item-selected': ''">
      <v-list-tile-action><v-icon>mdi-calendar-week</v-icon></v-list-tile-action>
      <v-list-tile-content>本周</v-list-tile-content>
      <v-list-tile-action-text>
        <span>10</span>
      </v-list-tile-action-text>
    </v-list-tile>
    <draggable @change="foldersChange" v-model="foldersProxy" tag="div" v-bind="folderDragOption">
      <v-list-tile v-for="item in foldersProxy"
                   @click="folderClick(item.id)"
                   avatar ripple :key="item.id"
                   :class="currentFolder === item.id ? 'sidebar-item-selected': ''">
        <v-list-tile-action><v-icon>mdi-format-list-checkbox</v-icon></v-list-tile-action>
        <v-list-tile-content>{{ item.name }}</v-list-tile-content>
        <v-list-tile-action-text>
          <span>{{ item.undoNumber }}</span>
        </v-list-tile-action-text>
      </v-list-tile>
    </draggable>
  </v-list>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import Draggable from 'vuedraggable'

export default {
  name: 'FolderList',
  components: { Draggable },
  data () {
    return {
      foldersContent: []
    }
  },
  computed: {
    ...mapState('todoView', ['currentFolder']),
    ...mapGetters('todoView', ['folders']),
    foldersProxy: {
      get () {
        return this.folders
      },
      set (val) {
        this.foldersContent = [...val]
      }
    },
    folderDragOption () {
      return {
        animation: 200,
        disabled: false,
        group: 'aside-folder-list',
        ghostClass: 'draggable-ghost'
      }
    }
  },
  methods: {
    ...mapActions('todoView', ['changeFolder']),
    ...mapActions('user', ['modifyFolderList']),
    folderClick (id) {
      if (!id) {
        return
      }
      this.changeFolder(id)
    },
    foldersChange () {
      this.modifyFolderList(this.foldersContent.map(item => item.id))
    }
  }
}
</script>
