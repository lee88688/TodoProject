<template>
  <v-layout column style="height: 100%;">
    <v-toolbar flat dense dark color="blue-grey darken-1">
    <!--<v-toolbar flat dense dark color="primary">-->
      <v-toolbar-side-icon @click="switchMiniFolderListView" :class="{ 'toolbar-side-icon-mini': showMiniFolderListView }"></v-toolbar-side-icon>
      <template v-if="!showMiniFolderListView">
        <v-spacer></v-spacer>
        <v-btn @click="addNewClick" icon class="ma-0"><v-icon>mdi-plus</v-icon></v-btn>
<!--        <v-btn icon class="ma-0"><v-icon>mdi-bell-outline</v-icon></v-btn>-->
<!--        <v-btn icon class="ma-0"><v-icon>mdi-tooltip-outline</v-icon></v-btn>-->
        <v-btn @click="startSearch" icon class="ma-0"><v-icon>mdi-folder-search</v-icon></v-btn>
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
        <folder-list v-if="isTodoView" @reconfig="reconfig('folder', $event)"></folder-list>
        <!--projectView-->
        <project-list v-else @reconfig="reconfig('project', $event)"></project-list>
      </v-navigation-drawer>
    </v-flex>
    <v-dialog v-model="add.dialog" max-width="600px">
      <v-card>
        <v-card-title><span class="headline">添加</span></v-card-title>
        <v-tabs v-model="add.activeTab">
          <v-tab :key="0">文件夹</v-tab>
          <v-tab-item>
            <v-card-text>
              <div>
                <v-text-field v-model="add.folderName" :rules="[rules.required]" outline label="文件夹名称" ref="folderName"></v-text-field>
                <v-select v-model="add.folderProject" outline :items="projects" item-value="id" item-text="name" label="选择工程"></v-select>
              </div>
            </v-card-text>
          </v-tab-item>
          <v-tab :key="1">工程</v-tab>
          <v-tab-item>
            <v-card-text>
              <div>
                <v-text-field v-model="add.projectName" :rules="[rules.required]" outline label="工程名称" ref="projectName"></v-text-field>
              </div>
            </v-card-text>
          </v-tab-item>
        </v-tabs>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="add.dialog = false" flat>取消</v-btn>
          <v-btn @click="save" flat color="blue darken-1">保存</v-btn>
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
        dialog: false,
        isAdd: true,
        extra: null
      },
      rules: {
        required: value => !!value || '不能为空！'
      }
    }
  },
  computed: {
    ...mapState('user', ['showMiniFolderListView', 'isTodoView']),
    ...mapGetters('user', ['projectInfo', 'folderInfo']),
    ...mapGetters('projectView', ['projects']),
    switchButtonIcon () {
      return this.isTodoView ? 'mdi-format-list-checks' : 'mdi-view-list'
    },
    addFolderForm () {
      return ['folderName']
    },
    addProjectForm () {
      return ['projectName']
    }
  },
  watch: {
    'add.dialog': function (val) {
      if (!val) {
        this.addFolderForm.forEach(f => this.$refs[f].reset())
        this.addProjectForm.forEach(f => this.$refs[f].reset())
      }
    }
  },
  mounted () {
    this.ps = this.getPerfectScrollbarInstance(this.$refs.folderList.$el)
    this.$bus.$on('folder-project-reconfig', ({ type, id }) => {
      this.reconfig(type, id)
    })
  },
  beforeDestroy () {
    this.$bus.$off('folder-project-reconfig') // remove all 'folder-project-reconfig' event
  },
  methods: {
    ...mapActions('user', ['addFolder', 'switchMiniFolderListView', 'addProject', 'modifyFolder', 'modifyProject']),
    ...mapActions('globalAction', ['startSearch']),
    validateFolderForm () {
      return this.addFolderForm.map(f => this.$refs[f].validate()).every(i => i)
    },
    validateProjectForm () {
      return this.addProjectForm.map(f => this.$refs[f].validate()).every(i => i)
    },
    save () {
      if (this.add.isAdd) {
        this.addNew()
      } else {
        this.modify()
      }
    },
    modify () {
      const { type } = this.add.extra
      if (type === 'folder' && this.validateFolderForm()) {
        const payload = { id: this.add.extra.id, name: this.add.folderName }
        this.add.folderProject && (payload.project = this.add.folderProject)
        this.modifyFolder(payload)
        this.add.dialog = false
      } else if (type === 'project' && this.validateProjectForm()) {
        const payload = { id: this.add.extra.id, name: this.add.projectName }
        this.modifyProject(payload)
        this.add.dialog = false
      }
    },
    addNew () {
      if (this.add.activeTab === 0 && this.validateFolderForm()) {
        const payload = { name: this.add.folderName }
        this.add.folderProject && (payload.project = this.add.folderProject)
        this.addFolder(payload)
        this.add.dialog = false
      } else if (this.add.activeTab === 1 && this.validateProjectForm()) {
        this.addProject({ name: this.add.projectName })
        this.add.dialog = false
      }
    },
    switchButtonClick () {
      if (this.isTodoView) {
        this.$router.push('/project')
      } else {
        this.$router.push('/todo')
      }
    },
    reconfig (type, id) {
      console.log('reconfig')
      if (type === 'folder') {
        const folderInfo = this.folderInfo(id)
        folderInfo.type = 'folder'
        this.add.extra = folderInfo
        // form
        this.add.folderName = folderInfo.name
        folderInfo.project && (this.add.folderProject = folderInfo.project)
        this.add.activeTab = 0
      } else if (type === 'project') {
        const projectInfo = this.projectInfo(id)
        projectInfo.type = 'project'
        this.add.extra = projectInfo
        // form
        this.add.projectName = projectInfo.name
        this.add.activeTab = 1
      }
      this.add.isAdd = false
      this.add.dialog = true
    },
    addNewClick () {
      this.add.isAdd = true
      this.add.dialog = true
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
