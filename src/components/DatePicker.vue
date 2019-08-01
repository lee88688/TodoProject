<template>
  <div class="date-time-picker">
    <v-date-picker v-model="date" min-width="0" color="blue-grey darken-1">
      <div class="action-bar">
        <v-btn @click="reset" text class=""><v-icon>mdi-close</v-icon></v-btn>
        <v-btn @click="confirm" text class="ma-0"><v-icon>mdi-check</v-icon></v-btn>
      </div>
    </v-date-picker>
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
  data () {
    return {
      date: ''
    }
  },
  props: {
    value: {
      type: [String, Date],
      required: true
    }
  },
  watch: {
    value () {
      this.reset(true)
    }
  },
  created () {
    this.reset()
  },
  methods: {
    reset (useEvent) {
      const date = this.value ? new Date(this.value) : new Date()
      this.date = date.toISOString().substring(0, 10)
      // this.date = this.value
      if (useEvent) {
        this.$emit('reset')
      }
    },
    confirm () {
      this.$emit('input', this.date)
    }
  }
}
</script>

<style scoped>
.action-bar {
  width: 290px;
  margin: -8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
</style>
