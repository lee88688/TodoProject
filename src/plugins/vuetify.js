import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import zhHans from 'vuetify/es5/locale/zh-Hans'
import en from 'vuetify/es5/locale/en'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { en, 'zh-CN': zhHans },
    current: navigator.language
  },
  icons: {
    iconfont: 'mdi'
  }
})
