const path = require("path");
const resolve = (dir) => {
    return path.join(__dirname, dir);
};
const CONFIG_JSON = require('./src/services/config.js');
const { ENV } = CONFIG_JSON;
const target = CONFIG_JSON[ENV || 'develop'].baseUrl;

console.log(`当前运行环境：${ENV}`);
console.log(`当前代理地址：${target}`);

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
                target, // 服务器端接口地址
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
                "plugins": resolve('src/plugins'),
                "static": resolve('src/static'),
                "js": resolve('src/static/js'),
                "css": resolve('src/static/css'),
                "images": resolve('src/static/images'),
                "audio": resolve('src/static/audio'),
                "video": resolve('src/static/video'),
            },
        },
    },
};