const path = require("path");
const resolve = (dir) => {
    return path.join(__dirname, dir);
}

module.exports = {
    transpileDependencies: ['uni-simple-router'],
    publicPath: './', //基本路径
    lintOnSave: false, //eslint校验
    devServer: {
        host: 'localhost',
        port: 8088,
        open: true,
        proxy: {
            '/api': { //这里最好有一个 /
                target: 'http://yangyd.cn', // 服务器端接口地址
                //如果要代理 websockets，配置这个参数
                ws: false,
                // 如果是https接口，需要配置这个参数
                changeOrigin: true, //是否跨域
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                "@": resolve("src"),
                "src": resolve('src'),
                "components": resolve('src/components'),
                "pages": resolve('src/pages'),
                'package': resolve('src/package'),
                "router": resolve('src/router'),
                "store": resolve('src/store'),
                "services": resolve('src/services'),
                "static": resolve('src/static'),
                "js": resolve('src/static/js'),
                "css": resolve('src/static/css'),
                "images": resolve('src/static/images'),
            },
        },
    },
};