import PerfectScrollbar from 'perfect-scrollbar'

export default {
  created () {
    this.pss = [] // use for taking PerfectScrollbar instances
  },
  beforeDestroy () {
    for (let ps in this.pss) {
      ps.destroy && ps.destroy()
    }
  },
  methods: {
    getPerfectScrollbarInstance (el, option) {
      const ps = new PerfectScrollbar(el, option)
      this.pss.push(ps)
      return ps
    }
  }
}
