<template>
  <v-layout column style="height: 100%;">
    <v-toolbar flat dense dark color="blue-grey darken-1">
    <!--<v-toolbar flat dense dark color="primary">-->
      <v-toolbar-side-icon @click="switchMiniFolderListView" :class="{ 'toolbar-side-icon-mini': showMiniFolderListView }"></v-toolbar-side-icon>
      <template v-if="!showMiniFolderListView">
        <v-spacer></v-spacer>
        <v-btn @click="add.dialog = true" icon class="ma-0"><v-icon>mdi-plus</v-icon></v-btn>
<!--        <v-btn icon class="ma-0"><v-icon>mdi-bell-outline</v-icon></v-btn>-->
<!--        <v-btn icon class="ma-0"><v-icon>mdi-tooltip-outline</v-icon></v-btn>-->
        <v-btn @click="search.snackbar = true" icon class="ma-0"><v-icon>mdi-folder-search</v-icon></v-btn>
        <v-btn @click="switchButtonClick" icon class="ma-0">
          <v-icon>{{ switchButtonIcon }}</v-icon>
        </v-btn>
        <v-btn icon class="ma-0"><v-icon>mdi-dots-vertical</v-icon></v-btn>
      </template>
    </v-toolbar>
    <v-flex grow class="folder-list-container">
      <v-navigation-drawer disable-resize-watcher permanent :mini-variant="showMiniFolderListView" ref="folderList" class="ps">
        <v-divider></v-divider>
        <!--todoView-->
        <folder-list v-if="isTodoView"></folder-list>
        <!--projectView-->
        <project-list v-else></project-list>
      </v-navigation-drawer>
    </v-flex>
    <v-snackbar top color="#316b7c" v-model="search.snackbar" :timeout="0">
      <v-text-field flat dark hide-details color="white" label="输入文件夹名称" v-model="add.name" class="ma-0"></v-text-field>
      <v-btn flat icon class="min-width-0 ma-0" @click="closeAddSnackbar"><v-icon>mdi-close</v-icon></v-btn>
    </v-snackbar>
    <v-dialog v-model="add.dialog" max-width="600px">
      <v-card>
        <v-card-title><span class="headline">添加</span></v-card-title>
        <v-tabs v-model="add.activeTab">
          <v-tab :key="0">文件夹</v-tab>
          <v-tab-item>
            <v-card-text>
              <div>
                <v-text-field v-model="add.folderName" outline label="文件夹名称"></v-text-field>
                <v-select v-model="add.folderProject" outline :items="projects" item-value="id" item-text="name" label="选择工程"></v-select>
              </div>
            </v-card-text>
          </v-tab-item>
          <v-tab :key="1">工程</v-tab>
          <v-tab-item>
            <v-card-text>
              <div>
                <v-text-field v-model="add.projectName" outline label="工程名称"></v-text-field>
              </div>
            </v-card-text>
          </v-tab-item>
        </v-tabs>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="addNew" flat color="blue darken-1">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog persistent width="100px" content-class="elevation-0">
      <div class="child-flex-center" style="height: 100px;">
        <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular>
      </div>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import perfectScrollbarMixin from '@/components/mixins/perfectScrollbarMixin'
import FolderList from '@/views/index/components/FolderList'
import ProjectList from '@/views/index/components/ProjectList'

export default {
  name: 'Sidebar',
  mixins: [perfectScrollbarMixin],
  components: { ProjectList, FolderList },
  data () {
    return {
      mini: false,
      add: {
        activeTab: 0,
        folderName: '',
        folderProject: '',
        projectName: '',
        dialog: false
      },
      search: {
        snackbar: false,
        content: ''
      }
    }
  },
  computed: {
    ...mapState('user', ['showMiniFolderListView', 'isTodoView']),
    ...mapGetters('projectView', ['projects']),
    switchButtonIcon () {
      return this.isTodoView ? 'mdi-format-list-checks' : 'mdi-view-list'
    }
  },
  mounted () {
    this.ps = this.getPerfectScrollbarInstance(this.$refs.folderList.$el)
  },
  methods: {
    ...mapActions('user', ['addFolder', 'switchMiniFolderListView', 'addProject']),
    addNew () {
      if (this.add.activeTab === 0) {
        const payload = { name: this.add.folderName }
        this.add.folderProject && (payload.project = this.add.folderProject)
        this.addFolder(payload)
      } else if (this.add.activeTab === 1) {
        this.addProject({ name: this.add.projectName })
      }
      this.add.folderName = ''
      this.add.projectName = ''
      this.add.dialog = false
    },
    closeAddSnackbar () {
      this.search.snackbar = false
    },
    switchButtonClick () {
      if (this.isTodoView) {
        this.$router.push('/project')
      } else {
        this.$router.push('/todo')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.folder-list-menu-search {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.folder-list-menu-icon {
  padding: 10px 10px;
}

.folder-list-user-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  > div {
    flex: 0 0 auto;
  }
}

.folder-list-container {
  overflow: hidden;
  height: 0;
}

.toolbar-side-icon-mini {
  margin-left: -2px !important;
}
</style>

<style lang="scss">
.flipx-enter-active, .flipx-leave-active {
  transition: transform 0.5s;
}

.flipx-enter, .flipx-leave {
  transform: rotateY(0deg)
}

.flipx-enter-to, .flipx-leave-to {
  transform: rotateY(180deg)
}

.sidebar-item-selected {
  background-color: rgba(0,0,0,0.04);
}
</style>
