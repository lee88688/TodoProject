<template>
  <v-layout column style="height: 100%;">
    <v-toolbar flat dense dark color="#316b7c">
    <!--<v-toolbar flat dense dark color="primary">-->
      <v-toolbar-side-icon @click="switchMiniFolderListView"></v-toolbar-side-icon>
      <template v-if="!showMiniFolderListView">
        <v-spacer></v-spacer>
        <v-btn @click="add.dialog = true" icon class="ma-0"><v-icon>mdi-plus</v-icon></v-btn>
<!--        <v-btn icon class="ma-0"><v-icon>mdi-bell-outline</v-icon></v-btn>-->
<!--        <v-btn icon class="ma-0"><v-icon>mdi-tooltip-outline</v-icon></v-btn>-->
        <v-btn @click="search.snackbar = true" icon class="ma-0"><v-icon>mdi-folder-search</v-icon></v-btn>
        <v-btn icon class="ma-0"><v-icon>mdi-dots-vertical</v-icon></v-btn>
      </template>
    </v-toolbar>
    <v-flex grow class="folder-list-container">
      <v-navigation-drawer disable-resize-watcher permanent :mini-variant="showMiniFolderListView" ref="folderList" class="ps">
        <v-divider></v-divider>
        <v-list dense class="pa-0">
          <v-list-tile avatar ripple @click="folderClick('star')">
            <v-list-tile-action><v-icon>mdi-star-outline</v-icon></v-list-tile-action>
            <v-list-tile-content>标星</v-list-tile-content>
            <v-list-tile-action-text>
              <span>10</span>
            </v-list-tile-action-text>
          </v-list-tile>
          <v-list-tile avatar ripple @click="folderClick('today')">
            <v-list-tile-action><v-icon>mdi-calendar-today</v-icon></v-list-tile-action>
            <v-list-tile-content>今天</v-list-tile-content>
            <v-list-tile-action-text>
              <span>10</span>
            </v-list-tile-action-text>
          </v-list-tile>
          <v-list-tile avatar ripple @click="folderClick('thisWeek')">
            <v-list-tile-action><v-icon>mdi-calendar-week</v-icon></v-list-tile-action>
            <v-list-tile-content>本周</v-list-tile-content>
            <v-list-tile-action-text>
              <span>10</span>
            </v-list-tile-action-text>
          </v-list-tile>
          <v-list-tile avatar ripple v-for="item in folders" @click="folderClick(item.id)" :key="item.id">
            <v-list-tile-action><v-icon>mdi-format-list-checkbox</v-icon></v-list-tile-action>
            <v-list-tile-content>{{ item.name }}</v-list-tile-content>
            <v-list-tile-action-text>
              <span>{{ item.undoNumber }}</span>
            </v-list-tile-action-text>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </v-flex>
    <v-snackbar top color="#316b7c" v-model="search.snackbar" :timeout="0">
      <v-text-field flat dark hide-details color="white" label="输入文件夹名称" v-model="add.name" class="ma-0"></v-text-field>
      <v-btn flat icon class="min-width-0 ma-0" @click="closeAddSnackbar"><v-icon>mdi-close</v-icon></v-btn>
    </v-snackbar>
    <v-dialog v-model="add.dialog" max-width="600px">
      <v-card>
        <v-card-title><span class="headline">添加文件夹</span></v-card-title>
        <v-card-text>
          <div>
            <v-text-field v-model="add.name" outline label="清单名称"></v-text-field>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="addNewFolder" flat color="blue darken-1">保存</v-btn>
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

export default {
  name: 'FolderList',
  mixins: [perfectScrollbarMixin],
  data () {
    return {
      mini: false,
      add: {
        name: '',
        dialog: false
      },
      search: {
        snackbar: false,
        content: ''
      }
    }
  },
  computed: {
    ...mapGetters('todoView', ['folders']),
    ...mapState('user', ['showMiniFolderListView'])
  },
  mounted () {
    this.ps = this.getPerfectScrollbarInstance(this.$refs.folderList.$el)
  },
  methods: {
    ...mapActions('user', ['addFolder', 'switchMiniFolderListView']),
    ...mapActions('todoView', ['changeFolder']),
    addNewFolder () {
      this.addFolder({ name: this.add.name })
      this.add.name = ''
      this.add.dialog = false
    },
    closeAddSnackbar () {
      this.search.snackbar = false
    },
    folderClick (id) {
      if (!id) {
        return
      }
      this.changeFolder(id)
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
  height: 100%;
}
</style>
