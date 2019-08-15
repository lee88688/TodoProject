import Vue from 'vue'
import vuetify from '../../plugins/vuetify'
import Main from './Message'

const MessageConstructor = Vue.extend(Main)
let seed = 0

const message = function (option = {}) {
  if (typeof option === 'string') {
    option = {
      message: option
    }
  }
  const id = `message-${seed++}`
  const instance = new MessageConstructor({ propsData: option, vuetify })
  instance.id = id
  instance.$mount()
  document.body.appendChild(instance.$el)
  instance.show()
  return new Promise((resolve) => {
    instance.setHideCallback(state => {
      resolve(state)
    })
  })
}

export default message
