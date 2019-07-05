<template>
  <v-layout column style="height: 100%;">
    <v-flex shrink class="todo-detail-header">
      <!--<div>-->
      <!--</div>-->
      <v-checkbox hide-details class="ma-0" style="flex: 0 0 auto;"></v-checkbox>
      <div class="todo-detail-header-text">tt</div>
      <v-btn icon class="ma-0"><v-icon>mdi-star-outline</v-icon></v-btn>
    </v-flex>
    <v-flex grow class="todo-detail-middle ps" style="height: 0; position: relative;" ref="scrollContainer">
      <div>
        <date-setting></date-setting>
        <v-text-field flat hide-details clearable prepend-icon="mdi-plus" label="添加子任务" class="todo-detail-icon-left-margin mb-2"></v-text-field>
        <v-textarea flat hide-details auto-grow clearable prepend-icon="mdi-square-edit-outline" label="备注" class="todo-detail-icon-left-margin"></v-textarea>
        <v-btn block flat class="btn-block-align-left"><v-icon class="mr-1">mdi-attachment</v-icon>添加文件</v-btn>
      </div>
    </v-flex>
    <v-flex shrink class="todo-detail-end">
      <v-btn flat class="min-width-0 ma-0 pa-2"><v-icon>mdi-chevron-double-right</v-icon></v-btn>
      <v-subheader class="no-select">测试问题</v-subheader>
      <v-btn flat class="min-width-0 ma-0 pa-2"><v-icon>mdi-delete-outline</v-icon></v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import DateSetting from '@/views/todolist/components/DateSetting'
import perfectScrollbarMixin from '@/components/mixins/perfectScrollbarMixin'

export default {
  name: 'TodoDetail',
  mixins: [perfectScrollbarMixin],
  components: { DateSetting },
  mounted () {
    this.ps = this.getPerfectScrollbarInstance(this.$refs.scrollContainer)
  }
}
</script>

<style lang="scss" scoped>
.todo-detail-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  background-color: #ffffff;

  .todo-detail-header-text {
    flex: 1 1 auto;
    font-size: 20px;
    width: 0;
    word-break: break-all;
  }
}

.todo-detail-middle {
  background-color: #fafafa;
}

.todo-detail-end {
  background-color: #ffffff;
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-detail-icon-left-margin {
  margin-left: 16px;
}
</style>
