const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: 'all',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    client: {
      webSocketURL: {
        protocol: 'ws',
        hostname: 'localhost',
        port: 8080
      }
    }
  },
  configureWebpack: {
    // Define global feature flags
    plugins: [
      new webpack.DefinePlugin({
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(true),
        __VUE_OPTIONS_API__: JSON.stringify(true), // 保留 Vue 2 风格的 API
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false), // 禁用生产环境的 devtools
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false), // 设置你的功能标志
      })
    ]
  }
})
