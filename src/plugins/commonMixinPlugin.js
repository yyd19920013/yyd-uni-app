import Vue from 'vue';
import { $Router } from 'src/main';
import { resetVueData, showToast, uniToast } from 'js/utils';

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
                try{
                    let needResetList = ['/pages/test/test'];
                    let { path } = this.$Route;

                    if (needResetList.includes(path)) {
                        resetVueData(this);
                    }
                }catch(e){}
            },
            methods:{
                showToast,
                uniToast,
            },
        });
    },
};
