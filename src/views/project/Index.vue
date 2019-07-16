<template>
  <div class="project-view">
    <draggable v-model="arr" v-bind="dragOption" class="folder-list pa-2 ps" ref="scrollContainer">
      <folder class="mr-2" v-for="item in [1, 2, 3, 4, 5]" :key="item.id"></folder>
    </draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import Folder from './Folder'
import perfectScrollbarMixin from '@/components/mixins/perfectScrollbarMixin'

export default {
  name: 'Project',
  mixins: [perfectScrollbarMixin],
  components: { Folder, Draggable },
  data () {
    return {
      arr: [1, 2, 3, 4, 5, 6].map(item => ({ id: item }))
    }
  },
  computed: {
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
