export const types = {
  CHANGE_PALETTE: 'CHANGE_PALETTE'
}

export default {
  namespaced: true,
  state: {
    palette: {
      show: false,
      prependIcon: 'mdi-cloud-search-outline',
      appendIcon: '',
      placeholder: '',
      input: '',
      inputKey: '',
      extra: ''
    }
  },
  getters: {
    paletteShow (state) {
      return state.palette.show
    }
  },
  mutations: {
    [types.CHANGE_PALETTE]: function (state, newVal) {
      for (let k in newVal) {
        if (newVal.hasOwnProperty(k) && (k in state.palette)) {
          state.palette[k] = newVal[k]
        }
      }
    }
  },
  actions: {
    changePaletteInput ({ commit }, newVal) {
      commit(types.CHANGE_PALETTE, { input: newVal })
    },
    changePaletteInputKey ({ commit }, newVal) {
      commit(types.CHANGE_PALETTE, { inputKey: newVal })
    },
    changePaletteShow ({ commit }, newVal) {
      commit(types.CHANGE_PALETTE, { show: newVal })
    },
    clearPaletteExtra ({ commit }) {
      commit(types.CHANGE_PALETTE, { extra: '' })
    },
    startSearch ({ commit }) {
      commit(types.CHANGE_PALETTE, {
        show: true,
        prependIcon: 'mdi-cloud-search-outline',
        appendIcon: '',
        placeholder: '请输入搜索关键词'
      })
    },
    startAddingNew ({ commit }, { placeholder, extra }) {
      commit(types.CHANGE_PALETTE, {
        show: true,
        prependIcon: 'mdi-plus',
        appendIcon: 'mdi-send',
        placeholder,
        input: '',
        extra
      })
    }
  }
}
