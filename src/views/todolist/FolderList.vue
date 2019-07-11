<template>
  <v-layout column style="height: 100%;">
    <v-toolbar flat dense dark color="#316b7c">
    <!--<v-toolbar flat dense dark color="primary">-->
      <v-toolbar-side-icon @click="switchMiniFolderListView"></v-toolbar-side-icon>
      <template v-if="!showMiniFolderListView">
        <v-spacer></v-spacer>
        <v-btn icon class="ma-0" @click="add.snackbar = true"><v-icon>mdi-plus</v-icon></v-btn>
        <v-btn icon class="ma-0"><v-icon>mdi-bell-outline</v-icon></v-btn>
        <v-btn icon class="ma-0"><v-icon>mdi-tooltip-outline</v-icon></v-btn>
        <v-btn icon class="ma-0"><v-icon>mdi-folder-search</v-icon></v-btn>
        <v-btn icon class="ma-0"><v-icon>mdi-dots-vertical</v-icon></v-btn>
      </template>
    </v-toolbar>
    <v-flex grow class="folder-list-container">
      <v-navigation-drawer disable-resize-watcher permanent :mini-variant="showMiniFolderListView" ref="folderList" class="ps">
        <v-divider></v-divider>
        <v-list dense class="pa-0">
          <v-list-tile avatar ripple @click="">
            <v-list-tile-action><v-icon>mdi-star-outline</v-icon></v-list-tile-action>
            <v-list-tile-content>标星</v-list-tile-content>
            <v-list-tile-action>
              <span>10</span>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile avatar ripple @click="">
            <v-list-tile-action><v-icon>mdi-calendar-today</v-icon></v-list-tile-action>
            <v-list-tile-content>今天</v-list-tile-content>
            <v-list-tile-action>
              <span>10</span>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile avatar ripple @click="">
            <v-list-tile-action><v-icon>mdi-calendar-week</v-icon></v-list-tile-action>
            <v-list-tile-content>本周</v-list-tile-content>
            <v-list-tile-action>
              <span>10</span>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile avatar ripple v-for="item in folders" @click="folderClick(item.id)" :key="item.id">
            <v-list-tile-action><v-icon>mdi-format-list-checkbox</v-icon></v-list-tile-action>
            <v-list-tile-content>{{ item.name }}</v-list-tile-content>
            <v-list-tile-action>
              <span>{{ item.undoNumber }}</span>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </v-flex>
    <v-snackbar top color="#316b7c" v-model="add.snackbar" :timeout="0">
      <v-text-field flat dark hide-details color="white" label="输入文件夹名称" v-model="add.name" class="ma-0"></v-text-field>
      <v-btn flat icon class="min-width-0 ma-0" @click="addNewFolder"><v-icon>mdi-check</v-icon></v-btn>
      <v-btn flat icon class="min-width-0 ma-0" @click="closeAddSnackbar"><v-icon>mdi-close</v-icon></v-btn>
    </v-snackbar>
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
        snackbar: false,
        name: ''
      }
    }
  },
  computed: {
    ...mapGetters('todoView', ['folders']),
    ...mapState('todoView', ['showMiniFolderListView'])
  },
  mounted () {
    this.ps = this.getPerfectScrollbarInstance(this.$refs.folderList.$el)
  },
  methods: {
    ...mapActions('user', ['addFolder']),
    ...mapActions('todoView', ['changeFolder', 'switchMiniFolderListView']),
    addNewFolder () {
      this.addFolder({ name: this.add.name })
      this.add.name = ''
      this.closeAddSnackbar()
    },
    closeAddSnackbar () {
      this.add.snackbar = false
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
