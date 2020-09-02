import md5 from 'md5';
import { lStore } from 'js/yydjs.js';
import { getCurrentPage, wxToast } from 'js/yydjs';
import store from 'store';

//获取配置
const getConfig = () => {
    const config = {
        dev: {
            ihUrl: 'https://hcnfoshan.bsoft.com.cn',
            wxUrl: 'https://hcnweixin.bsoft.com.cn',
            imgUrl: 'http://hcnfile.bsoft.com.cn/file/upload/image/',
            profile: 'foshandev'
        },
        release: {
            ihUrl: 'https://foshan.bshcn.com.cn',
            wxUrl: 'https://wx.bshcn.com.cn',
            imgUrl: 'http://image.bshcn.com.cn/file/upload/image/',
            profile: 'foshanPro'
        }
    }
    const CONFIG_ENV = process.env.CONFIG_ENV;
    var env = config[CONFIG_ENV];

    return env || config.dev;
}
const config = getConfig();
const IHURL = config.ihUrl; //佛山域名
const WexinURL = config.wxUrl; //微信域名
const { imgUrl, profile } = config;
const viewImage = imgUrl; //图片地址
const ImageURL = imgUrl; //图片地址
const APPID = 'wxc49f70991d742d55'; //小程序ID
const ProductCode = 'hcn.fs-nhqrmyy.patient_mini'; //产品编码
const TenantId = 'hcn.fs-nhqrmyy'; //租户
const RoleId = 'patient'; //角色id
const BMapAppKey = 'eGNntZFy4Carv33KUMWvjwnOgp5lxjYp'; //百度地图小程序appkey
const getAccessToken = () => {
    let userInfo = lStore.get('userInfo') || {};
    let { accessToken = '' } = userInfo;

    return accessToken; //登录token
}

//微信小程序-网络请求
function wxRequest(option) {
    var option = option || {};
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

    function wxRequestFn(resolve, reject) {
        wx.request({
            url: option.url,
            data: option.data || {},
            header: option.header || {},
            method: option.method && option.method.toUpperCase() || 'GET',
            timeout: 20 * 1000,
            dataType: option.dataType || 'json',
            responseType: option.responseType || 'text',
            success: function (res) {
                if (res.statusCode == '200') {
                    var data = res.data;

                    option.finally && option.finally(data);
                    if (data.code == '200') {
                        option.success && option.success(data);
                        return resolve && resolve(data);
                    } else {
                        if (!option.noHint) wxToast(data.msg);
                        return reject && reject(data);
                    }
                } else if (res.statusCode == '403') {
                    if (!option.noHint) {
                        if (lStore.get('showLoginModel')) {
                            return;
                        }
                        store.commit('userInfo/clearUserInfo');
                        lStore.set('showLoginModel', true);
                        setTimeout(() => {
                            lStore.set('showLoginModel', false);
                            let currentPage = getCurrentPage();

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
                    option.error && option.error(res);
                    return reject && reject(res);
                } else {
                    wxToast('服务器开了个小差, 请稍后再试!');
                    option.error && option.error(res);
                    return reject && reject(res);
                }
            },
            fail: function (res) {
                option.fail && option.fail(res);
                return reject && reject(res);
            },
            complete: function (res) {
                wx.hideLoading();
                option.complete && option.complete(res);
            },
        });
    };

    wx.showLoading({
        title: '请求中',
        mask: true,
    });
    if (option.success || option.finally) {
        wxRequestFn();
        return errorPromise;
    } else {
        return new Promise(function (resolve, reject) {
            wxRequestFn(resolve, reject);
        });
    }
};

//微信小程序-上传文件
function wxUpload(option) {
    var option = option || {};

    wx.showLoading({
        title: '请求中',
        mask: true,
    });

    return new Promise((resolve, reject) => {
        var header = option.header || {};
        header["Content-Type"] = "multipart/form-data";
        wx.uploadFile({
            url: option.url,
            filePath: option.filePath || '',
            name: option.name || '',
            header: header,
            formData: option.formData || {},
            success: function (res) {
                var data = {};
                if (res.data) {
                    data = JSON.parse(res.data);
                }

                if (res.statusCode == '200') {
                    if (data.code == '200') {
                        resolve(data);
                    } else {
                        wxToast(data.msg);
                        reject(data.msg);
                    }
                } else if (res.statusCode == '403') {
                    if (lStore.get('showLoginModel')) {
                        return;
                    }
                    store.commit('userInfo/clearUserInfo');
                    lStore.set('showLoginModel', true);
                    setTimeout(() => {
                        lStore.set('showLoginModel', false);
                        let currentPage = getCurrentPage();
                        // if (currentPage.route == 'package/userInfo/login/login' ||
                        //     currentPage.route == 'package/userInfo/login/register') {
                        //     return;
                        // }
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
                    reject('请先登录');
                } else {
                    wxToast('服务器开了个小差, 请稍后再试!');
                    reject('服务器开了个小差, 请稍后再试!');
                }
            },
            fail: function (res) {
                reject('服务器开了个小差, 请稍后再试!');
            },
            complete: function (res) {
                wx.hideLoading();
                console.log('wx.uploadFile.complete', res);
            },
        });
    });
};

const IHRequest = (config) => {
    let [id, method] = config.url.split('/').splice(1, 2);

    config.url = IHURL + '/*.jsonRequest';
    config.header = {
        'X-Access-Token': getAccessToken(),
        'X-Service-Id': id,
        'X-Service-Method': method,
        'B-Product-Code': ProductCode,
        'T-Product-Code': ProductCode,
    };
    return wxRequest(config);
};

const IHRequest1 = (config) => {
    config.url = IHURL + config.url;
    config.header = {
        'X-Access-Token': getAccessToken(),
        'B-Product-Code': ProductCode,
        'T-Product-Code': ProductCode,
        'content-type': `multipart/form-data; boundary=${config.id}`,
    };
    return wxRequest(config);
};

const WexinRequest = (config) => {
    let [id, method] = config.url.split('/').splice(1, 2);

    config.url = WexinURL + '/*.jsonRequest';
    config.header = {
        'X-Access-Token': getAccessToken(),
        'X-Service-Id': id,
        'X-Service-Method': method,
        'B-Product-Code': ProductCode,
        'T-Product-Code': ProductCode,
    };
    return wxRequest(config);
};

// config:{
//  requestPath,
//  filePath,
//  name
//  formData
// }
const IHUpload = (config) => {
    var option = {};
    option.url = IHURL + config.requestPath;
    option.filePath = config.filePath;
    option.formData = config.formData;
    option.name = config.name;
    option.header = {
        'X-Access-Token': getAccessToken(),
        'B-Product-Code': ProductCode,
        'T-Product-Code': ProductCode,
    };
    return wxUpload(option);
};

// config:{
//  requestPath,
//  filePath,
//  name
//  formData
// }
const WexinUpload = (config) => {
    var option = {};
    option.url = WexinURL + config.requestPath;
    option.filePath = config.filePath;
    option.formData = config.formData;
    option.name = config.name;
    option.header = {
        'X-Access-Token': getAccessToken(),
        'B-Product-Code': ProductCode,
        'T-Product-Code': ProductCode,
    };
    return wxUpload(option);
};

/*
    []
*/
const findDic = (data, success) => {
    IHRequest({
        url: '/cas_ih_foshan.wx_multipleDictionaryService/findDic',
        method: 'post',
        data,
        success,
    });
};

export {
    IHURL, //互联网医院域名
    WexinURL, //微信域名
    viewImage, //图片地址
    profile,
    ImageURL,
    APPID, //小程序ID
    ProductCode, //产品编码
    TenantId, //租户
    RoleId, //角色id
    IHRequest, //佛山请求函数(method方式)
    IHRequest1, //佛山请求函数(url方式)
    WexinRequest, //微信请求函数(method方式)
    IHUpload, //佛山图片上传
    WexinUpload, //微信图片上传
    findDic, //查字典
    getAccessToken,
    BMapAppKey
};