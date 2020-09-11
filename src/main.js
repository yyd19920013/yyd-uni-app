import Vue from 'vue';
import App from './App';
import Router, { RouterMount } from 'uni-simple-router';
import routes from './router';
import store from './store';
import * as filter from './filter';
import uView from './uview-ui';
import mixinPlugin from 'plugins/mixinPlugin';

App.mpType = 'app';
Vue.config.productionTip = false;
Vue.use(Router);
Vue.use(uView);
Vue.use(mixinPlugin);

//初始化
const router = new Router({
    routes, //路由表
});

//全局路由前置守卫
router.beforeEach((to, from, next) => {
    next();
});

// 全局路由后置守卫
router.afterEach((to, from) => {});

//挂载过滤器
for (let attr in filter) {
    Vue.filter(attr, filter[attr]);
}

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

export default app;
export {
    app,
    router,
};