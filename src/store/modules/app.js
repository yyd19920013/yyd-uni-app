const state = {
    version: '1.0.0',
};

const getters = {
    VERSION({ version }) {
        return `v${version}`;
    },
};

const mutations = {
    CHANGE_VERSION: (state, version) => {
        state.version = version;
    },
};

const actions = {
    changeVersion({ commit }) {
        setTimeout(() => {
            commit('CHANGE_VERSION', '1.1.1');
        }, 3000);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};