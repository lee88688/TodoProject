 <template>
  <v-list dense class="pa-0">
    <v-list-item @click="folderClick('star')"
                 @contextmenu="contextmenuClickDoNothing"
                 ripple
                 :class="currentFolder === 'star' ? 'sidebar-item-selected': ''">
      <v-list-item-action><v-icon>mdi-star-outline</v-icon></v-list-item-action>
      <v-list-item-content>{{ $t('todoView.star') }}</v-list-item-content>
      <v-list-item-action-text>
        <span></span>
      </v-list-item-action-text>
    </v-list-item>
    <v-list-item @click="folderClick('today')"
                 @contextmenu="contextmenuClickDoNothing"
                 ripple
                 :class="currentFolder === 'today' ? 'sidebar-item-selected': ''">
      <v-list-item-action><v-icon>mdi-calendar-today</v-icon></v-list-item-action>
      <v-list-item-content>{{ $t('todoView.today') }}</v-list-item-content>
      <v-list-item-action-text>
        <span></span>
      </v-list-item-action-text>
    </v-list-item>
    <v-list-item @click="folderClick('thisWeek')"
                 @contextmenu="contextmenuClickDoNothing"
                 ripple
                 :class="currentFolder === 'thisWeek' ? 'sidebar-item-selected': ''">
      <v-list-item-action><v-icon>mdi-calendar-week</v-icon></v-list-item-action>
      <v-list-item-content>{{ $t('todoView.thisWeek') }}</v-list-item-content>
      <v-list-item-action-text>
        <span></span>
      </v-list-item-action-text>
    </v-list-item>
    <draggable @change="foldersChange" v-model="foldersProxy" tag="div" v-bind="folderDragOption">
      <v-list-item v-for="item in foldersProxy"
                   @click="folderClick(item.id)"
                   @contextmenu="contextmenuClick($event, item.id)"
                   ripple :key="item.id"
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
        name: this.$t('todoView.folderMenu.folderConfig'),
        callback: (id) => {
          this.$emit('reconfig', id)
        }
      },
      {
        name: this.$t('todoView.folderMenu.deleteFolder'),
        callback: async (folder) => {
          let r = await message({
            title: this.$t('delete'),
            message: this.$t('todoView.folderMenu.deleteFolderDialogContent')
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
