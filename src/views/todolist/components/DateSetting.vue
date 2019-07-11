<template>
  <div>
    <v-menu offset-y min-width="0" :close-on-content-click="false">
      <template #activator="{ on }">
        <v-btn block flat v-on="on" class="btn-block-align-left"><v-icon class="mr-1">mdi-calendar-multiselect</v-icon>设置日期</v-btn>
      </template>
      <date-picker></date-picker>
    </v-menu>
    <v-layout row>
      <v-btn block flat class="ma-0 btn-block-align-left"><v-icon class="mr-1">mdi-calendar-multiselect</v-icon>设置日期</v-btn>
      <v-btn flat class="min-width-0 ma-0 pa-2"><v-icon>mdi-close</v-icon></v-btn>
    </v-layout>
    <v-layout row>
      <v-btn block flat class="ma-0 btn-block-align-left"><v-icon class="mr-1">mdi-calendar-clock</v-icon>设置提醒事件</v-btn>
      <v-btn flat class="min-width-0 ma-0 pa-2"><v-icon>mdi-close</v-icon></v-btn>
    </v-layout>
    <v-layout row>
      <v-btn block flat class="ma-0 btn-block-align-left"><v-icon class="mr-1">mdi-redo-variant</v-icon>从不重复</v-btn>
      <v-btn flat class="min-width-0 ma-0 pa-2"><v-icon>mdi-close</v-icon></v-btn>
    </v-layout>
  </div>
</template>

<script>
import DateTimePicker from '@/components/DateTimePicker'
import DatePicker from '@/components/DatePicker'

export default {
  name: 'DateSetting',
  components: { DatePicker, DateTimePicker },
  data () {
    return {
      remindDate: '',
      remindTime: '',
      repeatItems: ['day', 'week', 'month', 'year']
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
