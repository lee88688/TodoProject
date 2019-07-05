<template>
  <v-layout column fill-height>
    <v-flex shrink style="width: 100%;">
      <v-toolbar flat dense dark color="#3a7f93">
      <!--<v-toolbar flat dense dark color="primary">-->
        <v-toolbar-title>Title</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat class="min-width-0"><v-icon>mdi-account-multiple-plus-outline</v-icon></v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-flex>
    <v-flex grow class="pa-3" style="background-color: #3a7f93; overflow: hidden;">
      <v-layout column style="height: 100%;">
        <v-flex shrink>
          <v-text-field solo prepend-inner-icon="mdi-plus" placeholder="添加新任务"></v-text-field>
        </v-flex>
        <v-flex grow style="overflow: hidden; height: 0; position: relative;" class="ps" ref="scrollContainer">
          <v-list dense class="transparent">
            <v-btn flat small dark class="min-width-0">标星</v-btn>
            <v-list-tile ripple @click="" class="elevation-1 my-1" style="background-color: #fafafa; user-select: none;" v-for="v in arr" :key="v">
              <v-list-tile-action style="min-width: 0;"><v-checkbox></v-checkbox></v-list-tile-action>
              <v-list-tile-content>这个是一个示例</v-list-tile-content>
              <v-list-tile-action><v-icon>mdi-star-outline</v-icon></v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import perfectScrollbarMixin from '@/components/mixins/perfectScrollbarMixin'

export default {
  name: 'TodoList',
  mixins: [perfectScrollbarMixin],
  data () {
    return {
      arr: [1, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 34, 44, 22]
    }
  },
  mounted () {
    this.getPerfectScrollbarInstance(this.$refs.scrollContainer)
  }
}
</script>

<style scoped>

</style>
