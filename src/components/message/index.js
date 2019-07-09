import Vue from 'vue'
import Main from './message'

const MessageConstructor = Vue.extend(Main)
let seed = 0

const Message = function (option = {}) {
  if (typeof option === 'string') {
    option = {
      message: option
    }
  }
  const id = `message-${seed++}`
  const instance = new MessageConstructor({ propsData: option })
  instance.id = id
  instance.$mount()
  document.body.appendChild(instance.$el)
  return instance
}

export default Message
