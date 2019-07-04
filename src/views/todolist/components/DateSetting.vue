<template>
  <div>
    <v-menu offset-y min-width="0" :close-on-content-click="false">
      <template #activator="{ on }">
        <v-btn block flat v-on="on" class="btn-block-align-left"><v-icon class="mr-1">mdi-calendar-multiselect</v-icon>设置日期</v-btn>
      </template>
      <date-time-picker></date-time-picker>
    </v-menu>
  </div>
</template>

<script>
import DateTimePicker from '@/components/DateTimePicker'
export default {
  name: 'DateSetting',
  components: { DateTimePicker },
  data () {
    return {
      remindDate: '',
      remindTime: ''
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
