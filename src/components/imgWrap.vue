<template>
    <image :class="resultClass" :src="resultSrc" :mode="resultMode" :webp="webp" :lazy-load='lazyLoad' :show-menu-by-longpress="showMenuByLongpress" @error="error" @load="loadFn"></image>
</template>
<script>
import { resetData, Type } from 'js/yydjs';

const resetDataFn = resetData({ //需要重置的data属性

});

export default {
    data() {
        return Object.assign({}, resetDataFn.data, {
            show: false,
        });
    },

    computed: {
        resultClass() {
            let { className, show } = this;
            className = Type(className) == 'string' ? {
                [className]: true,
                imgWrap: true,
                show
            } : Object.assign({}, className, { imgWrap: true, show });
            let str = '';

            for (let attr in className) {
                if (className[attr]) {
                    str += `${attr} `;
                }
            }

            return str;
        },
        resultSrc() {
            let { src } = this;
            let isHttpImg = src.indexOf('http') == 0 || src.charAt(0) == '/';

            return src ? (isHttpImg ? src : require(`images/${src}`)) : '';
        },
        resultMode() {
            let { auto, mode } = this;

            return auto ? 'widthFix' : (mode ? mode : 'scaleToFill')
        },
    },

    /*
        例子：
        <imgWrap src="wxShare.png" />
    */

    props: {
        className: { //图片包裹层类名
            type: [String, Object],
            default: '',
        },
        auto: { //图片宽高是否自适应
            type: Boolean,
            default: true,
        },
        width: { //图片宽度
            type: String,
            default: '',
        },
        height: { //图片高度
            type: String,
            default: '',
        },
        border: { //图片边框
            type: String,
            default: '',
        },
        borderRadius: { //图片圆角
            type: String,
            default: '',
        },
        src: { //图片资源地址，写在images/下的地址即可
            type: String,
            default: '',
        },
        mode: { //图片裁剪、缩放的模式
            type: String,
            default: 'scaleToFill',
        },
        webp: { //默认不支持webP格式
            type: Boolean,
            default: false,
        },
        lazyLoad: { //图片懒加载，在即将进入一定范围（上下三屏）时才开始加载
            type: Boolean,
            default: false,
        },
        showMenuByLongpress: { //开启长按图片显示识别小程序码菜单
            type: Boolean,
            default: false,
        },
        error: { //当错误发生时触发，event.detail = {errMsg}
            type: Function,
            default: (ev) => {},
        },
        load: { //当图片载入完毕时触发，event.detail = {height, width}
            type: Function,
            default: (ev) => {},
        },
    },

    onLoad() { //为保证每次进入都触发，需写在enterFn
        this.enterFn();
    },

    onShow() { //为保证每次进入都触发，需写在enterFn
        this.enterFn();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        this.show = false;
        this.leaveFn();
    },

    methods: {
        enterFn() { //onLoad和onShow可能会一起触发，所以需要防止重复触发
            if (this.isEnter) return;
            this.isEnter = true;
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);
        },
        errorFn(ev) {
            let { error } = this;

            error && error(ev);
        },
        loadFn(ev) {
            let { load } = this;

            this.show = true;
            load && load(ev);
        },
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.imgWrap {
    @include styleInit;
    /deep/ & {
        visibility: hidden;
        width: 100rpx;
        height: 100rpx;
        &.show {
            visibility: visible;
        }
    }
}

</style>
