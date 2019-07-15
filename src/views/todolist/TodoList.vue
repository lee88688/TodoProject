<template>
  <v-layout column fill-height>
    <v-flex shrink style="width: 100%;">
      <v-toolbar flat dense dark color="#3a7f93">
      <!--<v-toolbar flat dense dark color="primary">-->
        <v-toolbar-title>{{ currentFolderName }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat class="min-width-0"><v-icon>mdi-account-multiple-plus-outline</v-icon></v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </v-flex>
    <v-flex grow class="pa-3" style="background-color: #3a7f93; overflow: hidden;">
      <v-layout column style="height: 100%;">
        <v-flex shrink>
          <v-text-field solo prepend-inner-icon="mdi-plus" append-icon="mdi-send" placeholder="添加新任务" v-model="todoName" @click:append="addNewTodo"></v-text-field>
        </v-flex>
        <v-flex grow style="overflow: hidden; height: 0; position: relative;" class="ps" ref="scrollContainer">
          <v-list dense class="transparent">
            <template v-for="item in todos">
              <v-btn v-if="item.name" flat small dark class="min-width-0" :key="item.name">{{ item.name }}</v-btn>
              <v-list-tile ripple @click="clickTodo(t.id)" class="elevation-1 my-1" style="background-color: #fafafa; user-select: none;" v-for="t in item.todos" :key="t.id">
                <v-list-tile-action style="min-width: 0;">
                  <v-checkbox @change="clickComplete(t.id, $event)" @click.native.stop="doNothing" :input-value="t.complete"></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>{{ t.name }}</v-list-tile-content>
                <star-select @input="clickStar(t.id, $event)" @click.native.stop="doNothing" :value="t.star"></star-select>
              </v-list-tile>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import perfectScrollbarMixin from '@/components/mixins/perfectScrollbarMixin'
import StarSelect from '@/components/StarSelect'

export default {
  name: 'TodoList',
  components: { StarSelect },
  mixins: [perfectScrollbarMixin],
  data () {
    return {
      todoName: ''
    }
  },
  computed: {
    ...mapGetters('todoView', ['todos', 'currentFolderName']),
    ...mapState('todoView', ['currentFolder'])
  },
  mounted () {
    this.getPerfectScrollbarInstance(this.$refs.scrollContainer)
  },
  methods: {
    ...mapActions('user', ['addTodo', 'modifyTodo', 'changeDetailViewVisible', 'changeCurrentTodo']),
    addNewTodo () {
      if (!this.todoName) {
        return
      }
      this.addTodo({
        name: this.todoName,
        folder: this.currentFolder
      })
      this.todoName = ''
    },
    clickTodo (id) {
      this.changeCurrentTodo(id)
      this.changeDetailViewVisible(true)
    },
    clickComplete (id, complete) {
      this.modifyTodo({ id, complete })
    },
    clickStar (id, star) {
      this.modifyTodo({ id, star })
    },
    doNothing () {}
  }
}
</script>

<style scoped>

</style>
