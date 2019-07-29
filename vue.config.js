const publicPath = process.env.VUE_APP_BASE_URL || '/'

module.exports = {
  publicPath,
  pluginOptions: {
    chainWebpackRendererProcess: config => {
      config.plugin('define').tap(args => {
        args[0]['IS_ELECTRON'] = true
        return args
      })
    }
  }
}
