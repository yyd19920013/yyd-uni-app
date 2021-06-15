module.exports = {
    ENV: process.env.__ENV, //根据命令获取环境
    develop: { //开发
        baseUrl: 'http://yangyd.cn',
    },
    publish: { //正式
        baseUrl: 'http://yangyd.cn',
    },
};