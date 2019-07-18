 <template>
  <v-list dense class="pa-0">
    <v-list-tile @click="folderClick('star')"
                 @contextmenu="contextmenuClickDoNothing"
                 avatar ripple
                 :class="currentFolder === 'star' ? 'sidebar-item-selected': ''">
      <v-list-tile-action><v-icon>mdi-star-outline</v-icon></v-list-tile-action>
      <v-list-tile-content>标星</v-list-tile-content>
      <v-list-tile-action-text>
        <span></span>
      </v-list-tile-action-text>
    </v-list-tile>
    <v-list-tile @click="folderClick('today')"
                 @contextmenu="contextmenuClickDoNothing"
                 avatar ripple
                 :class="currentFolder === 'today' ? 'sidebar-item-selected': ''">
      <v-list-tile-action><v-icon>mdi-calendar-today</v-icon></v-list-tile-action>
      <v-list-tile-content>今天</v-list-tile-content>
      <v-list-tile-action-text>
        <span></span>
      </v-list-tile-action-text>
    </v-list-tile>
    <v-list-tile @click="folderClick('thisWeek')"
                 @contextmenu="contextmenuClickDoNothing"
                 avatar ripple
                 :class="currentFolder === 'thisWeek' ? 'sidebar-item-selected': ''">
      <v-list-tile-action><v-icon>mdi-calendar-week</v-icon></v-list-tile-action>
      <v-list-tile-content>本周</v-list-tile-content>
      <v-list-tile-action-text>
        <span></span>
      </v-list-tile-action-text>
    </v-list-tile>
    <draggable @change="foldersChange" v-model="foldersProxy" tag="div" v-bind="folderDragOption">
      <v-list-tile v-for="item in foldersProxy"
                   @click="folderClick(item.id)"
                   @contextmenu="contextmenuClick($event, item.id)"
                   avatar ripple :key="item.id"
                   :class="currentFolder === item.id ? 'sidebar-item-selected': ''">
        <v-list-tile-action><v-icon>mdi-format-list-checkbox</v-icon></v-list-tile-action>
        <v-list-tile-content>{{ item.name }}</v-list-tile-content>
        <v-list-tile-action-text>
          <span>{{ item.undoNumber }}</span>
        </v-list-tile-action-text>
      </v-list-tile>
    </draggable>
    <!--menu-->
    <menu-items :menu="menu"></menu-items>
  </v-list>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import Draggable from 'vuedraggable'
import menuMixin from '@/components/mixins/menuMixin'

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
        id: '1',
        name: '文件夹选项',
        callback (extra, item) {
          item.name += 1
        }
      },
      {
        id: '2',
        name: '删除文件夹'
      }
    ])
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
