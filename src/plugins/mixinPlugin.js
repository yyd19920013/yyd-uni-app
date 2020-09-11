import Vue from 'vue';
import { resetVueData } from 'js/yydjs';

export default {
    install() {
        Vue.mixin({
            onShow() {
                resetVueData(this);
            },
        });
    },
};