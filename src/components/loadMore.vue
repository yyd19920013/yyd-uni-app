<template>
    <div :class="resultClass">
        <imgWrap className="loadingIcon" src="loading.gif" />
        <span class="loadingText">{{loadingTextJson[status]}}</span>
    </div>
</template>
<script>
import imgWrap from 'components/imgWrap';
import { resetData } from 'js/yydjs';

const resetDataFn = resetData({ //需要重置的data属性

});

export default {
    data() {
        return Object.assign({}, resetDataFn.data, {
            loadingTextJson: {
                'loading': '正在拼命加载中...',
                'loaded': '我是有底线的',
            },
        });
    },

    computed: {
        resultClass() {
            let { status } = this;
            let className = { loadMore: true, [status]: true };
            let str = '';

            for (let attr in className) {
                if (className[attr]) {
                    str += `${attr} `;
                }
            }

            return str;
        },
    },

    /*
        例子：
        <loadMore :status.sync="status" />
    */

    props: {
        status: { //加载状态，只有'loading'、'loaded'，除此之外的状态不显示
            type: String,
            default: 'loading',
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
    },

    components: {
        imgWrap,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.loadMore {
    @include styleInit;
    /deep/ & {
        display: none;
        justify-content: center;
        align-items: center;
        height: 80rpx;
        line-height: 80rpx;
        .loadingIcon {
            width: 40rpx;
        }
        .loadingText {
            padding-left: 10rpx;
            font-size: 28rpx;
            color: #999;
            position: relative;
        }
        &.loading, &.loaded {
            display: flex;
        }
        &.loaded {
            .loadingIcon {
                display: none;
            }
            .loadingText {
                padding: 0;
                &:before, &:after {
                    content: "";
                    width: 180rpx;
                    height: 1px;
                    background-color: #999;
                    position: absolute;
                    top: 50%;
                }
                &:before {
                    left: -200rpx;
                }
                &:after {
                    right: -200rpx;
                }
            }
        }
    }
}

</style>
