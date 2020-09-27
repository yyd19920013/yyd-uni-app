import Vue from 'vue';
import { $Router } from 'src/main';
import { resetVueData } from 'js/yydjs';

export default {
    install() {
        Vue.mixin({
            data() {
                return {
                    query: {},
                };
            },
            onLoad(option) {
                this.query = option;
            },
            onShow() {
                let needResetList = ['/pages/test/test'];
                let { path } = this.$Router.$Route;

                if (needResetList.includes(path)) {
                    resetVueData(this);
                }
            },
        });
    },
};