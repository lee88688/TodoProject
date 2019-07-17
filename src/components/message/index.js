import Vue from 'vue'
import Main from './Message'

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
  instance.show()
  return new Promise((resolve, reject) => {
    instance.setHideCallback(state => {
      if (state === true) {
        resolve()
      } else {
        reject(new Error())
      }
    })
  })
}

export default Message
