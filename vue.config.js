module.exports = {
  pluginOptions: {
    chainWebpackRendererProcess: config => {
      config.plugin('define').tap(args => {
        args[0]['IS_ELECTRON'] = true
        return args
      })
    }
  }
}
