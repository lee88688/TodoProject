<template>
  <div class="subtask">
    <v-checkbox @change="input({ complete: $event })" :input-value="complete" hide-details class="ma-0"></v-checkbox>
    <v-text-field @blur="input({ content: tempContent })" v-model="textField" :disabled="complete" single-line flat hide-details class="ma-0 pa-0"></v-text-field>
    <v-btn @click="deleteClick" flat class="min-width-0 ma-0 pa-1"><v-icon>mdi-close</v-icon></v-btn>
  </div>
</template>

<script>
export default {
  name: 'Subtask',
  data () {
    return {
      tempContent: ''
    }
  },
  props: {
    complete: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    }
  },
  computed: {
    textField: {
      get () {
        return this.content
      },
      set (val) {
        this.tempContent = val
      }
    }
  },
  watch: {
    content: {
      handler () {
        this.tempContent = this.content
      },
      immediate: true
    }
  },
  methods: {
    deleteClick () {
      this.$emit('delete')
    },
    input (e) {
      const { complete, content } = this
      this.$emit('input', { complete, content, ...e })
    }
  }
}
</script>

<style lang="scss" scoped>
.subtask {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  > .v-input--checkbox {
    flex: 0 0 auto;
  }
}
</style>
