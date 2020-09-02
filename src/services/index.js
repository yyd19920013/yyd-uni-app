import vm from 'src/main.js';
import md5 from 'md5';
import { cookie, lStore, sStore, alerts, strToJson, axios, axiosWrap, createStr } from 'js/yydjs.js';

const URL = '/api'; //域名

const API = (config) => {
    config.url = URL + config.url;
    config.method = config.method ? config.method : 'post';
    config.code = 0;
    config.params = `post=${JSON.stringify(config.params)}`;
    config.headers = {
        'token': '',
        'sign': '5736edc08324690890926ff7f831da52',
        'timestamp': +new Date() / 1000,
    };
    return axiosWrap(config);
};

//axios请求示例
const testAxios = (params, success) => {
    return API({
        url: '/myBackground/ports/article.php',
        params,
        success,
    });
};

export {
    URL, //域名
    API, //api请求函数
    testAxios, //axios请求示例
};