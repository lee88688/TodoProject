<template>
  <div class="mt-1">
    <!--expire option-->
    <v-layout row>
      <v-menu v-model="datePickerMenu" offset-y min-width="0" :close-on-content-click="false">
        <template #activator="{ on }">
          <v-btn v-on="on" block flat class="ma-0 btn-block-align-left"><v-icon class="mr-1">mdi-calendar-multiselect</v-icon>
            {{ expiredDate || '设置日期' }}
          </v-btn>
        </template>
        <date-picker :value="expiredDate" @input="datePickerInput" @reset="datePickerMenu = false"></date-picker>
      </v-menu>
      <v-btn v-if="expiredDate" @click="clearExpiredDate" flat color="grey lighten-1" class="min-width-0 ma-0 pa-1"><v-icon>mdi-close</v-icon></v-btn>
    </v-layout>
    <template v-if="expiredDate">
      <!--alarm option-->
      <v-layout row>
        <v-menu v-model="dateTimePickerMenu" offset-y min-width="0" :close-on-content-click="false">
          <template #activator="{ on }">
            <v-btn v-on="on" block flat class="ma-0 btn-block-align-left"><v-icon class="mr-1">mdi-calendar-clock</v-icon>
              {{ remindTime || '设置提醒时间' }}
            </v-btn>
          </template>
          <date-time-picker :value="remindTime" @input="dateTimePickerInput" @reset="dateTimePickerMenu = false"></date-time-picker>
        </v-menu>
        <v-btn v-if="remindTime" @click="clearRemindTime" flat color="grey lighten-1" class="min-width-0 ma-0 pa-1"><v-icon>mdi-close</v-icon></v-btn>
      </v-layout>
      <!--repeat option-->
      <v-layout row>
        <v-menu offset-y>
          <template #activator="{ on }">
            <v-btn v-on="on" block flat class="ma-0 btn-block-align-left"><v-icon class="mr-1">mdi-redo-variant</v-icon>
              {{ repeat || '从不重复' }}
            </v-btn>
          </template>
          <v-list>
            <v-list-tile v-for="item in repeatItems" @click="repeatInput(item)" :key="item">
              <v-list-tile-title>{{ item }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-btn v-if="repeat" @click="clearRepeat" flat color="grey lighten-1" class="min-width-0 ma-0 pa-1"><v-icon>mdi-close</v-icon></v-btn>
      </v-layout>
    </template>
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
      repeatItems: ['day', 'week', 'month', 'year'],
      datePickerMenu: false,
      dateTimePickerMenu: false
    }
  },
  props: {
    repeat: {
      type: String,
      default: ''
    },
    expiredDate: {
      type: String,
      default: ''
    },
    remindTime: {
      type: String,
      default: ''
    }
  },
  methods: {
    repeatInput (repeat) {
      this.$emit('input', { repeat })
    },
    datePickerInput (expiredDate) {
      this.datePickerMenu = false
      this.$emit('input', { expiredDate })
    },
    dateTimePickerInput (remindTime) {
      this.dateTimePickerMenu = false
      this.$emit('input', { remindTime })
    },
    clearRepeat () {
      this.$emit('input', { repeat: '' })
    },
    clearExpiredDate () {
      this.$emit('input', { expiredDate: '' })
    },
    clearRemindTime () {
      this.$emit('input', { remindTime: '' })
    }
  }
}
</script>

<style scoped>

</style>
