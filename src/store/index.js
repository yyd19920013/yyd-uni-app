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

// 非Module格式：xxxx
// 使用了Module的格式：ModuleName.xxxx，这里持久化的是Theme Module下面的persistData数据
const PERSIST_PATHS = ['isLoading'];
const { set: setItem, get: getItem, remove: removeItem } = lStore;
const store = new Vuex.Store({
    plugins: [createPersistedState({
        storage: {
            setItem,
            getItem,
            removeItem,
        },
        paths: PERSIST_PATHS,
    })],
    modules,
    state,
    getters,
    actions,
    mutations,
});

export default store;