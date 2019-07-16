<template>
  <v-layout column class="project-view-folder blue-grey lighten-4 pa-2">
    <div class="folder-header project-handle">
      <span class="title no-select">title</span>
      <v-btn icon class="mx-0"><v-icon>mdi-dots-vertical</v-icon></v-btn>
    </div>
    <draggable v-model="arr" tag="div" v-bind="dragOption" class="ps" style="position: relative;" ref="scrollContainer">
      <v-card flat ripple class="mb-2" v-for="item in arr" :key="item.order">
        <v-card-title class="pa-2">
          <div>
            <div class="subheading no-select">这个是todo的标题{{ item.order }}</div>
          </div>
        </v-card-title>
      </v-card>
    </draggable>
  </v-layout>
</template>

<script>
import Draggable from 'vuedraggable'
import perfectScrollbarMixin from '@/components/mixins/perfectScrollbarMixin'

export default {
  name: 'Folder',
  mixins: [perfectScrollbarMixin],
  components: { Draggable },
  data () {
    return {
      arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15].map(item => ({ order: item, name: item })),
      drag: false
    }
  },
  computed: {
    dragOption () {
      return {
        animation: 200,
        disabled: false,
        group: 'project-folder',
        ghostClass: 'draggable-ghost'
      }
    }
  },
  mounted () {
    this.ps = this.getPerfectScrollbarInstance(this.$refs.scrollContainer.$el)
  },
}
</script>

<style lang="scss" scoped>
.project-view-folder {
  width: 290px;
  max-height: 100%;
  border-radius: 5px;
  overflow: hidden;
  flex: 0 0 auto;

  .folder-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    > span {
      flex: 1 1 auto;
    }
  }
}

.v-card:hover {
  background-color: #ECEFF1;
  cursor: pointer;
}
</style>
