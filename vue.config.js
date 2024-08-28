const { defineConfig } = require('@vue/cli-service');
 
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: 'all',
    host: '0.0.0.0',
    port: 8080,
    https: false,  // 确保使用 HTTP
    client: {
      webSocketURL: {
        protocol: 'ws',
        hostname: 'localhost',
        port: 8080
      }
    }
  }
});