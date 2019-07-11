<template>
  <v-icon @click="click">{{ starIconName }}</v-icon>
</template>

<script>
export default {
  name: 'StarSelect',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    starIconName () {
      return this.value ? 'mdi-star' : 'mdi-star-outline'
    }
  },
  methods: {
    click () {
      this.$emit('input', !this.value)
      this.$emit('click')
    }
  }
}
</script>
