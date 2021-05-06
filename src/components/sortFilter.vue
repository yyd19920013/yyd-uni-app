<template>
    <div v-show="show" class="sortFilter" id="sortFilter" @click="maskClose($event)">
        <ul class="wrap">
            <li :class="{active:activeIndex==index}" v-for="(item,index) in dataList" :key="index" @click="clickFn(item,index)">
                <span>
                    {{item.name}}
                </span>
            </li>
        </ul>
    </div>
</template>
<script>
import vm from 'src/main';
import { resetData } from 'js/utils';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
    activeIndex: 0,
});

export default {
    data() {
        return Object.assign({}, resetDataFn.data, {
            dataList: [{
                    name: '综合排序',
                    sortType: '',
                },
                {
                    name: '接诊量',
                    sortType: '1',
                },
                {
                    name: '患者评价',
                    sortType: '2',
                },
            ],
        });
    },

    /*
        例子：
    */

    props: {
        show: { //是否显示
            required: true,
            type: Boolean,
            default: false,
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
        resetDataFn.reset(this);
    },

    methods: {
        enterFn() { //onLoad和onShow可能会一起触发，所以需要防止重复触发
            if (this.isEnter) return;
            this.isEnter = true;
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性

        },
        clickFn(item, index) {
            this.activeIndex = index;
            this.$emit('componentClick', {
                item,
                index,
            });
            this.closeFn();
        },
        closeFn() {
            this.$emit('update:show', false);
            vm.$emit('filterWrapSetActiveIndex', -1);
        },
        maskClose(ev) {
            let { id } = ev.target;

            if (id == 'sortFilter') {
                this.closeFn();
            }
        },
    },
}
</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.sortFilter {
    @include styleInit;
    /deep/ & {
        width: 100%;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 100rpx;
        background-color: rgba(0, 0, 0, .3);
        z-index: 1000;
        .wrap {
            background-color: #fff;
            li {
                padding: 0 30rpx;
                height: $height1;
                line-height: $height1;
                border-bottom: $border1;
                span {
                    display: block;
                    background: no-repeat right center;
                    background-size: 40rpx;
                }
                &.active {
                    span {
                        background-image: url('../images/icon/img_right_.png');
                        color: $main;
                    }
                }
            }
        }
    }
}
</style>