<template>
  <div class="date-time-picker">
    <v-date-picker min-width="0" v-model="date">
      <div class="action-bar">
        <v-btn @click="reset" flat class="min-width-0 ma-0"><v-icon>mdi-close</v-icon></v-btn>
        <v-btn @click="confirm" flat class="min-width-0 ma-0"><v-icon>mdi-check</v-icon></v-btn>
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
      this.reset()
    }
  },
  methods: {
    reset () {
      this.date = this.value
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
