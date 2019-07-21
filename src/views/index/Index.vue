<template>
  <v-container full-height fluid class="pa-0" style="max-height: 100%;">
    <v-layout row fill-height>
      <v-flex class="left-folder-list">
        <sidebar></sidebar>
      </v-flex>
      <v-flex style="overflow: hidden;">
        <router-view></router-view>
      </v-flex>
      <v-flex class="right-todo-detail">
        <router-view name="todoDetail"></router-view>
      </v-flex>
<!--      <todo-detail class="right-todo-detail"></todo-detail>-->
    </v-layout>
    <v-snackbar v-model="palette.show" top color="transparent" :timeout="0" class="folder-snackbar">
      <v-text-field @keyup="paletteKeyUp"
                    @click:append="appendClick"
                    v-model="paletteInput"
                    :prepend-inner-icon="palette.prependIcon"
                    :append-icon="palette.appendIcon"
                    :placeholder="palette.placeholder"
                    solo hide-details autofocus></v-text-field>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Sidebar from '@/views/index/Sidebar'

export default {
  name: 'Index',
  components: {
    Sidebar
  },
  computed: {
    ...mapState('globalAction', ['palette']),
    paletteInput: {
      get () {
        return this.$store.state.globalAction.palette.input
      },
      set (val) {
        this.changePaletteInput(val)
      }
    }
  },
  methods: {
    ...mapActions('globalAction', ['changePaletteInput', 'changePaletteInputKey', 'changePaletteShow', 'clearPaletteExtra']),
    paletteKeyUp (e) {
      // console.log(e)
      this.changePaletteInputKey(e.key)
      if (e.key === 'Escape') {
        this.changePaletteShow(false)
      }
    },
    appendClick () {
      this.$bus.$emit('palette-append-click', this.$store.state.globalAction.palette.extra)
    }
  }
}
</script>

<style scoped>
.left-folder-list {
  /*width: 300px;*/
  flex: 0 0 auto;
}

.right-todo-detail {
  /*width: 350px;*/
  flex: 0 0 auto;
}
</style>
