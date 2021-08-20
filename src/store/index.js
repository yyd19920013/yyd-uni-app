import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import { lStore } from 'js/utils';
const context = require.context('./modules', true, /\.js$/);
let modules = {};

context.keys().forEach((item) => {
    let key = item.replace(/(.+\/)|(\.js)/g, '');

    Object.assign(modules, {
        [key]: context(item).default,
    });
});

Vue.use(Vuex);

const state = {
    isLoading: false, //遮罩是否显示loading
    showRefreshBt: false, //遮罩是否显示刷新按钮
    status: '', //服务器错误状态
};

const { set: setItem, get: getItem, remove: removeItem } = lStore;
const store = new Vuex.Store({
    plugins: [createPersistedState({
        storage: {
            setItem,
            getItem,
            removeItem,
        },
        reducer(resState) {
            let blackList = ['status', 'isLoading', 'showRefreshBt']; //加入黑名单的state不会被持久化

            for (let attr in resState) {
                if (blackList.includes(attr)) {
                    delete resState[attr];
                }
            }
            return resState;
        },
    })],
    modules,
    state,
    getters,
    actions,
    mutations,
});

export default store;