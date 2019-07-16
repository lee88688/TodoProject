<template>
  <div class="project-view blue-grey lighten-5">
    <draggable @change="change" v-model="foldersProxy" v-bind="dragOption" class="folder-list pa-2 ps" ref="scrollContainer">
      <folder class="mr-2" v-for="item in foldersProxy" :id="item.id" :name="item.name" :key="item.id"></folder>
    </draggable>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import Draggable from 'vuedraggable'
import Folder from './Folder'
import perfectScrollbarMixin from '@/components/mixins/perfectScrollbarMixin'

export default {
  name: 'Project',
  mixins: [perfectScrollbarMixin],
  components: { Folder, Draggable },
  data () {
    return {
      foldersContent: []
    }
  },
  computed: {
    ...mapGetters('projectView', ['currentProjectFolders']),
    ...mapState('projectView', ['currentProject']),
    foldersProxy: {
      get () {
        return this.currentProjectFolders
      },
      set (val) {
        this.foldersContent = [...val]
      }
    },
    dragOption () {
      return {
        animation: 200,
        disabled: false,
        group: 'project',
        ghostClass: 'draggable-ghost',
        handle: '.project-handle'
      }
    }
  },
  mounted () {
    this.ps = this.getPerfectScrollbarInstance(this.$refs.scrollContainer.$el)
  },
  methods: {
    ...mapActions('user', ['modifyProject']),
    change (e) {
      if (e.moved) {
        const folders = this.foldersContent.map(item => item.id)
        this.modifyProject({ folders, id: this.currentProject })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.project-view {
  height: 100%;
  max-width: 100%;
  overflow: hidden;

  .folder-list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100%;

    position: relative;

    &::after {
      content: '';
      height: 100%;
      border-right: 1px solid transparent;
    }
  }
}
</style>
