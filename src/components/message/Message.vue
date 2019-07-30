<script type="text/jsx">
import { VDialog, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VBtn } from 'vuetify/lib'

export default {
  name: 'message',
  components: {
    VDialog,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VSpacer,
    VBtn
  },
  data () {
    return {
      isShow: false,
      exitState: null
    }
  },
  props: {
    timeout: {
      type: Number,
      default: 0
    },
    message: {
      default: ''
    },
    title: {
      default: ''
    }
  },
  destroyed () {
    if (!this.$el) {
      return
    }
    this.$el.parentElement.removeChild(this.$el)
  },
  watch: {
    isShow (val) {
      if (val) { return }
      this.$nextTick(() => {
        this.hideCallback && this.hideCallback(this.exitState)
        this.$destroy()
      })
    }
  },
  methods: {
    show () {
      this.isShow = true
    },
    hide (state) {
      this.isShow = false
      this.exitState = state
    },
    setHideCallback (hideCallback) {
      this.hideCallback = hideCallback
    }
  },
  render () {
    return (
      <v-dialog value={ this.isShow } on={{ input: e => { this.isShow = e } }} persistent maxWidth="500px">
        <v-card>
          <v-card-title class="headline">{ this.title }</v-card-title>
          <v-card-text>{ this.message }</v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn text on={{ click: () => this.hide(false) }}>取消</v-btn>
            <v-btn text color="primary" on={{ click: () => this.hide(true) }}>确认</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    )
  }
}
</script>

<style scoped>

</style>
