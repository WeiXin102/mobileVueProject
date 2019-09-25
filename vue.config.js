const path = require('path');
module.exports = {
    // baseUrl: './',
    publicPath: './',
    outputDir: 'dist',
    lintOnSave: true,
    runtimeCompiler: true, //关键点在这  
    // 调整内部的 webpack 配置。
    // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/webpack.md
    chainWebpack: () => { },
    configureWebpack: () => { },
    // 配置 webpack-dev-server 行为。
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        // 查阅 https://github.com/vuejs/vue-doc-zh-cn/vue-cli/cli-service.md#配置代理
        proxy: {
            '/public': {
                target: 'http://127.0.0.1:8080',
                pathRewrite: { '^/public': '' }
            },
            '/api': {
                target: 'https://www.easy-mock.com/mock/5d71c1f8fe81895e9d2fa30d/trymock',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
        },
        before: app => { }
    },
    css: {
        loaderOptions: {
            sass: {
                data: `@import "~@/assets/global.scss";`
            }
        }
    }
}