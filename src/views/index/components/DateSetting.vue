<template>
  <div class="mt-1">
    <!--expire option-->
    <v-layout>
      <v-menu v-model="datePickerMenu" offset-y min-width="0" :close-on-content-click="false">
        <template #activator="{ on }">
          <v-btn v-on="on" text :color="expiredDateColor" class="ma-0 btn-block-align-left"><v-icon class="mr-1">mdi-calendar-multiselect</v-icon>
            {{ expiredDate || $t('sideBar.dateSetting.expiredDate') }}
          </v-btn>
        </template>
        <date-picker :value="expiredDate" @input="datePickerInput" @reset="datePickerMenu = false"></date-picker>
      </v-menu>
      <v-btn v-if="expiredDate" @click="clearExpiredDate" text color="grey lighten-1" class="min-width-0 ma-0 pa-1"><v-icon>mdi-close</v-icon></v-btn>
    </v-layout>
    <template v-if="expiredDate">
      <!--alarm option-->
      <v-layout>
        <v-menu v-model="dateTimePickerMenu" offset-y min-width="0" :close-on-content-click="false">
          <template #activator="{ on }">
            <v-btn v-on="on" depressed text class="ma-0 btn-block-align-left" :color="remindTimeColor"><v-icon class="mr-1">mdi-calendar-clock</v-icon>
              {{ remindTime || $t('sideBar.dateSetting.remindTime') }}
            </v-btn>
          </template>
          <date-time-picker :value="remindTime" @input="dateTimePickerInput" @reset="dateTimePickerMenu = false"></date-time-picker>
        </v-menu>
        <v-btn v-if="remindTime" @click="clearRemindTime" depressed text color="grey lighten-1" class="min-width-0 ma-0 pa-1"><v-icon>mdi-close</v-icon></v-btn>
      </v-layout>
      <!--repeat option-->
      <v-layout>
        <v-menu offset-y>
          <template #activator="{ on }">
            <v-btn v-on="on" depressed text class="ma-0 btn-block-align-left"><v-icon class="mr-1">mdi-redo-variant</v-icon>
              {{ repeat || $t('sideBar.dateSetting.repeatDefault') }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="item in repeatItems" @click="repeatInput(item)" :key="item">
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn v-if="repeat" @click="clearRepeat" depressed text color="grey lighten-1" class="min-width-0 ma-0 pa-1"><v-icon>mdi-close</v-icon></v-btn>
      </v-layout>
    </template>
  </div>
</template>

<script>
import DateTimePicker from '@/components/DateTimePicker'
import DatePicker from '@/components/DatePicker'
import { dateColor } from '@/views/lib'

export default {
  name: 'DateSetting',
  components: { DatePicker, DateTimePicker },
  data () {
    return {
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
  computed: {
    expiredDateColor () {
      return dateColor(this.expiredDate)
    },
    remindTimeColor () {
      return dateColor(this.remindTime)
    },
    repeatItems () {
      return [
        this.$t('sideBar.dateSetting.repeatOption.day'),
        this.$t('sideBar.dateSetting.repeatOption.week'),
        this.$t('sideBar.dateSetting.repeatOption.month'),
        this.$t('sideBar.dateSetting.repeatOption.year')
      ]
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
