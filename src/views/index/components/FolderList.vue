 <template>
  <v-list dense class="pa-0">
    <v-list-item @click="folderClick('star')"
                 @contextmenu="contextmenuClickDoNothing"
                 avatar ripple
                 :class="currentFolder === 'star' ? 'sidebar-item-selected': ''">
      <v-list-item-action><v-icon>mdi-star-outline</v-icon></v-list-item-action>
      <v-list-item-content>标星</v-list-item-content>
      <v-list-item-action-text>
        <span></span>
      </v-list-item-action-text>
    </v-list-item>
    <v-list-item @click="folderClick('today')"
                 @contextmenu="contextmenuClickDoNothing"
                 avatar ripple
                 :class="currentFolder === 'today' ? 'sidebar-item-selected': ''">
      <v-list-item-action><v-icon>mdi-calendar-today</v-icon></v-list-item-action>
      <v-list-item-content>今天</v-list-item-content>
      <v-list-item-action-text>
        <span></span>
      </v-list-item-action-text>
    </v-list-item>
    <v-list-item @click="folderClick('thisWeek')"
                 @contextmenu="contextmenuClickDoNothing"
                 avatar ripple
                 :class="currentFolder === 'thisWeek' ? 'sidebar-item-selected': ''">
      <v-list-item-action><v-icon>mdi-calendar-week</v-icon></v-list-item-action>
      <v-list-item-content>本周</v-list-item-content>
      <v-list-item-action-text>
        <span></span>
      </v-list-item-action-text>
    </v-list-item>
    <draggable @change="foldersChange" v-model="foldersProxy" tag="div" v-bind="folderDragOption">
      <v-list-item v-for="item in foldersProxy"
                   @click="folderClick(item.id)"
                   @contextmenu="contextmenuClick($event, item.id)"
                   avatar ripple :key="item.id"
                   :class="currentFolder === item.id ? 'sidebar-item-selected': ''">
        <v-list-item-action><v-icon>mdi-format-list-checkbox</v-icon></v-list-item-action>
        <v-list-item-content>{{ item.name }}</v-list-item-content>
        <v-list-item-action-text>
          <span>{{ item.undoNumber }}</span>
        </v-list-item-action-text>
      </v-list-item>
    </draggable>
    <!--menu-->
    <menu-items :menu="menu"></menu-items>
  </v-list>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import Draggable from 'vuedraggable'
import menuMixin from '@/components/mixins/menuMixin'
import message from '@/components/message'

export default {
  name: 'FolderList',
  mixins: [menuMixin],
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
  created () {
    this.registerMenuItem([
      {
        name: '文件夹选项',
        callback: (id) => {
          this.$emit('reconfig', id)
        }
      },
      {
        name: '删除文件夹',
        callback: async (folder) => {
          let r = await message({
            title: '删除',
            message: '是否删除文件夹？'
          })
          r && this.deleteFolder(folder)
        }
      }
    ])
  },
  methods: {
    ...mapActions('todoView', ['changeFolder']),
    ...mapActions('user', ['modifyFolderList', 'deleteFolder']),
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
