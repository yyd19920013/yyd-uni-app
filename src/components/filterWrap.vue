<template>
    <div class="filterWrap">
        <ul class="dataList">
            <li class="tap" v-for="(item,index) in dataList" :key="index" @click="clickFn(item,index)">
                <span>{{item}}</span>
                <imgWrap :className="{icon:true,active:activeIndex==index}" src="icon/img_triangle_down.png" />
            </li>
        </ul>
    </div>
</template>
<script>
import vm from 'src/main';
import imgWrap from 'components/imgWrap';
import { resetData } from 'js/yydjs';

const resetDataFn = resetData({ //需要重置的data属性
    activeIndex: -1,
});

export default {
    data() {
        return Object.assign({}, resetDataFn.data, {

        });
    },

    /*
        例子：
    */

    props: {
        dataList: { //数据列表
            type: Array,
            default: [],
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

            vm.$on('filterWrapSetActiveIndex', this.setActiveIndex);
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);

            vm.$off('filterWrapSetActiveIndex', this.setActiveIndex);
        },
        setActiveIndex(index) {
            this.activeIndex = index;
        },
        clickFn(item, index) {
            this.activeIndex = this.activeIndex != index ? index : -1;
            this.$emit('componentClick', {
                item,
                index,
            });
        },
    },

    components: {
        imgWrap,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.filterWrap {
    @include styleInit;
    /deep/ & {
        height: 100rpx;
        .dataList {
            display: flex;
            width: 100%;
            height: 100rpx;
            background-color: #fff;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 1000;
            li {
                flex: 1;
                display: flex;
                justify-content: center;
                padding: 0 20rpx;
                align-items: center;
                color: #999;
                border-bottom: $border1;
                span {
                    @include multiLine1;
                    max-width: 180rpx;
                    font-size: 24rpx;
                }
                .icon {
                    width: 24rpx;
                    margin: 0 8rpx;
                    transition: .2s transform ease-in;
                    &.active {
                        transform: rotate3d(0, 0, 1, -180deg);
                    }
                }
            }
        }
    }
}

</style>
