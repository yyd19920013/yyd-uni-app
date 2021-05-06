import md5 from 'md5';
import { lStore } from 'js/utils';
import CONFIG_JSON from 'services/config';

const { ENV } = CONFIG_JSON;
const COMMON = CONFIG_JSON[ENV || 'develop'];
// #ifdef H5
const URL = ['localhost', '127.0.0.1'].includes(window.location.hostname) ? '/api' : COMMON.baseUrl; //本地环境用反向代理，线上环境用baseUrl，线上域名和请求地址一致用'/'
// #endif

// #ifdef MP-WEIXIN
const URL = COMMON.baseUrl; //小程序直接用baseUrl
// #endif
const context = require.context('./modules', true, /\.js$/);
let modules = {};

context.keys().forEach((item) => {
    modules = Object.assign({}, modules, context(item));
});

let loadingTimer = null;
let toastShow = false;
const showToast = (config) => {
    let { duration = 2000 } = config;

    toastShow = true;
    clearTimeout(loadingTimer);
    loadingTimer = setTimeout(() => {
        toastShow = false;
        uni.hideLoading();
    }, duration);
    let resultConfig = Object.assign({}, {
        mask: true,
        icon: 'none',
        duration,
    }, config);

    setTimeout(() => {
        uni.showToast(resultConfig);
    });
};
const uniToast = (title, duration) => {
    showToast({
        title: title,
        duration: duration,
    });
};
//uni小程序-网络请求
function uniRequest(config) {
    var config = config || {};
    var errorPromise = {
        then: function () {
            console.error('这是一个无效的then函数，如果要使用promise方式，不要在config对象里配置success、error、finally函数');
            return this;
        },
        catch: function () {
            console.error('这是一个无效的catch函数，如果要使用promise方式，不要在config对象里配置success、error、finally函数');
            return this;
        },
        finally: function () {
            console.error('这是一个无效的finally函数，如果要使用promise方式，不要在config对象里配置success、error、finally函数');
            return this;
        },
    };

    function uniRequestFn(resolve, reject) {
        wx.request({
            url: config.url,
            data: config.params || {},
            header: config.header || {},
            method: config.method && config.method.toUpperCase() || 'GET',
            timeout: 20 * 1000,
            dataType: config.dataType || 'json',
            responseType: config.responseType || 'text',
            success: function (res) {
                if (res.statusCode == '200') {
                    var data = res.data;

                    config.finally && config.finally(data);
                    if (data.code == config.code) {
                        config.success && config.success(data);
                        return resolve && resolve(data);
                    } else {
                        if (!config.noHint) uniToast(data.msg);
                        return reject && reject(data);
                    }
                } else if (res.statusCode == '403') {
                    if (!config.noHint) {
                        if (lStore.get('showLoginModel')) return;
                        lStore.set('showLoginModel', true);
                        setTimeout(() => {
                            lStore.set('showLoginModel', false);
                            wx.showModal({
                                title: '提示', //提示的标题,
                                content: '您的登录会话已失效，请重新登录', //提示的内容,
                                showCancel: false, //是否显示取消按钮,
                                confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                                confirmColor: '#33adff', //确定按钮的文字颜色,
                                success: function (res) {
                                    if (res.confirm) {
                                        wx.navigateTo({
                                            url: '/pages/login/login',
                                        });
                                    }
                                }
                            });
                        }, 500);
                    }
                    config.error && config.error(res);
                    return reject && reject(res);
                } else {
                    uniToast('服务器开了个小差, 请稍后再试!');
                    config.error && config.error(res);
                    return reject && reject(res);
                }
            },
            fail: function (res) {
                config.fail && config.fail(res);
                return reject && reject(res);
            },
            complete: function (res) {
                if (config.loadingShow && !toastShow) {
                    uni.hideLoading();
                }
                config.complete && config.complete(res);
            },
        });
    };

    if (config.loadingShow) {
        uni.showLoading({
            title: '请求中',
            mask: true,
        });
    }
    if (config.success || config.finally) {
        uniRequestFn();
        return errorPromise;
    } else {
        return new Promise(function (resolve, reject) {
            uniRequestFn(resolve, reject);
        });
    }
};

//uni小程序-上传文件
function uniUpload(config) {
    var config = config || {};

    if (config.loadingShow) {
        uni.showLoading({
            title: '请求中',
            mask: true,
        });
    }
    return new Promise((resolve, reject) => {
        var header = config.header || {};

        header['Content-Type'] = 'multipart/form-data';
        wx.uploadFile({
            url: config.url,
            filePath: config.filePath || '',
            name: config.name || '',
            header: header,
            formData: config.formData || {},
            success: function (res) {
                var data = {};
                if (res.data) {
                    data = JSON.parse(res.data);
                }

                if (res.statusCode == '200') {
                    if (data.code == config.code) {
                        return resolve && resolve(data);
                    } else {
                        if (!config.noHint) uniToast(data.msg);
                        return reject && reject(data);
                    }
                } else if (res.statusCode == '403') {
                    if (lStore.get('showLoginModel')) return;
                    lStore.set('showLoginModel', true);
                    setTimeout(() => {
                        lStore.set('showLoginModel', false);
                        wx.showModal({
                            title: '提示', //提示的标题,
                            content: '您的登录会话已失效，请重新登录', //提示的内容,
                            showCancel: false, //是否显示取消按钮,
                            confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                            confirmColor: '#33adff', //确定按钮的文字颜色,
                            success: function (res) {
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: '/pages/login/login',
                                    });
                                }
                            }
                        });
                    }, 500);
                    return reject && reject(res);
                } else {
                    uniToast('服务器开了个小差, 请稍后再试!');
                    return reject && reject(res);
                }
            },
            fail: function (res) {
                reject('服务器开了个小差, 请稍后再试!');
            },
            complete: function (res) {
                if (config.loadingShow && !toastShow) {
                    uni.hideLoading();
                }
                config.complete && config.complete(res);
            },
        });
    });
};
const API = (config) => {
    config.url = URL + config.url;
    config.method = config.method ? config.method : 'post';
    config.code = 0;
    config.headers = {
        'token': '',
        'sign': '',
        'timestamp': +new Date() / 1000,
    };
    return uniRequest(config);
};
/*
    config: {
        url,
        filePath,
        formData,
        name,
    }
*/
const UPLOAD = (config) => {
    config.url = URL + config.url;
    config.header = {
        'X-Access-Token': '',
        'B-Product-Code': '',
        'T-Product-Code': '',
    };
    return uniUpload(config);
};
//axios请求示例
const testAxios = (params, success) => {
    return API({
        url: '/myBackground/ports/article.php',
        params,
        success,
    });
};

const CONFIG = Object.assign({}, COMMON, {
    envName: ENV,
    API, //api请求函数
    UPLOAD, //上传请求函数
    testAxios, //axios请求示例
});
const SERVICES = Object.assign({}, CONFIG, modules);

console.log('当前环境：', ENV);
console.log('当前环境配置：', CONFIG);
console.log('SERVICES', SERVICES);
export {
    showToast,
    uniToast,
};
export default SERVICES;