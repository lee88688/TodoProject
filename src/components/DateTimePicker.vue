<template>
  <div class="date-time-picker">
    <v-date-picker min-width="0" v-model="date">
      <v-layout row style="width: 290px; margin: -8px;">
        <v-select v-model="hour" :items="hours" label="时" flat solo hide-details></v-select>
        <div class="px-2 no-select child-flex-center time-colon" style="font-weight: bold;">:</div>
        <v-select v-model="minute" :items="minutes" label="分" flat solo hide-details></v-select>
        <v-btn @click="reset" flat class="min-width-0 ma-0"><v-icon>mdi-close</v-icon></v-btn>
        <v-btn @click="confirm" flat class="min-width-0 ma-0"><v-icon>mdi-check</v-icon></v-btn>
      </v-layout>
    </v-date-picker>
<!--    <v-divider dark></v-divider>-->
  </div>
</template>

<script>
const hours = [...new Array(24).keys()]
const minutes = [...new Array(60).keys()]

export default {
  name: 'DateTimePicker',
  data () {
    return {
      hours,
      minutes,
      date: '',
      hour: 0,
      minute: 0
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
  created () {
    this.reset()
  },
  methods: {
    reset () {
      const dateTime = this.value ? new Date(this.value) : new Date()
      this.hour = dateTime.getHours()
      this.minute = dateTime.getMinutes()
      this.date = dateTime.toISOString().slice(0, 10)
    },
    confirm () {
      const dateTime = new Date(this.date)
      dateTime.setHours(this.hour, this.minute)
      this.$emit('input', dateTime)
    }
  }
}
</script>

<style lang="scss" scoped>
.date-time-picker {
  position: relative;
  overflow: hidden;

  .time-colon {
    z-index: 1;
    background-color: white;
  }
}

.v-btn {
  height: 48px;
  z-index: 1;
  background-color: white;
}
</style>
