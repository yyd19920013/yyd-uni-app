import Vue from 'vue';
import App from './App';
import Router, { RouterMount } from 'uni-simple-router';
import routes from './router';
import store from './store';
import * as filters from './filters';
import services from 'services';
import uView from './uview-ui';
import commonMixinPlugin from 'plugins/commonMixinPlugin';

App.mpType = 'app';
Vue.config.productionTip = false;
Vue.use(Router);
Vue.use(uView);
Vue.use(commonMixinPlugin);

//初始化
const $Router = new Router({
    routes, //路由表
});

//全局路由前置守卫
$Router.beforeEach((to, from, next) => {
    next();
});

// 全局路由后置守卫
$Router.afterEach((to, from) => {});

//挂载过滤器
for (let attr in filters) {
    Vue.filter(attr, filters[attr]);
}

//挂载网络请求
Vue.prototype.$services = services;

const app = new Vue({
    ...App,
    store,
});

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, '#app');
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif

export {
    app,
    $Router,
};
export default app;