import isArray from 'lodash/isArray'
import MenuItems from './MenuItems'

export default {
  components: { MenuItems },
  data () {
    return {
      menu: {
        showMenu: false,
        x: 0,
        y: 0,
        extra: null,
        menuItems: []
      }
    }
  },
  methods: {
    contextmenuClick (e, extra) {
      e.preventDefault()
      this.menu.extra = extra
      this.menu.x = e.pageX
      this.menu.y = e.pageY
      this.menu.showMenu = true
    },
    contextmenuClickDoNothing (e) {
      e.preventDefault()
    },
    registerMenuItem (menuItems) {
      // menu item must have `name` attribute
      if (!isArray(menuItems)) {
        console.warn('menuItems is not an array!')
        return
      }
      menuItems.forEach(item => {
        // item is like { id: 'xxx', name: 'xxx', callback: function (extraFromClickedItem, menuItems[i]) { xxx }
        if (!('name' in item)) {
          console.warn('name is not in menu item!')
          return
        }
        this.menu.menuItems.push(item)
      })
    }
  }
}
