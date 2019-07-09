<script type="text/jsx">
import { VSnackbar } from 'vuetify/lib'

export default {
  name: 'message',
  components: {
    VSnackbar
  },
  data () {
    return {
      showSnackbar: true
    }
  },
  props: {
    timeout: {
      type: Number,
      default: 0
    },
    message: {
      default: ''
    }
  },
  methods: {
    show () {
      this.showSnackbar = true
    },
    hide () {
      this.showSnackbar = false
    }
  },
  render () {
    return (
      <v-snackbar top={ true } color="#316b7c" timeout={ this.timeout } value={ this.showSnackbar }>
        { this.message }
      </v-snackbar>
    )
  }
}
</script>

<style scoped>

</style>
