export const types = {
  CHANGE_PALETTE: 'CHANGE_PALETTE',
  CHANGE_SEARCH_STATUS: 'CHANGE_SEARCH_STATUS'
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
    },
    search: {
      isSearch: false
    }
  },
  getters: {
    paletteShow (state) {
      return state.palette.show
    },
    searchValid (state) {
      return (state.search.isSearch && !!state.palette.input)
    }
  },
  mutations: {
    [types.CHANGE_PALETTE]: function (state, newVal) {
      for (let k in newVal) {
        if (newVal.hasOwnProperty(k) && (k in state.palette)) {
          state.palette[k] = newVal[k]
        }
      }
    },
    [types.CHANGE_SEARCH_STATUS]: function (state, payload) {
      state.search.isSearch = payload.isSearch
    }
  },
  actions: {
    changePaletteInput ({ commit }, newVal) {
      commit(types.CHANGE_PALETTE, { input: newVal })
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
        input: '',
        prependIcon: 'mdi-cloud-search-outline',
        appendIcon: '',
        placeholder: '请输入搜索关键词'
      })
      commit(types.CHANGE_SEARCH_STATUS, { isSearch: true })
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
    },
    clearSearchMode ({ commit, state }) {
      state.search.isSearch && commit(types.CHANGE_SEARCH_STATUS, { isSearch: false })
    }
  }
}
