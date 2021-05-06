<template>
    <div class="deptFilter">
        <ul class="deptList1">
            <li :class="{active:activeIndex1==index}" v-for="(item,index) in deptList1" :key="index" @click="select1(item,index)">
                <span>{{item.stardardDeptName}}</span>
            </li>
        </ul>
        <ul class="deptList2">
            <li :class="{active:activeIndex2==index}" v-for="(item,index) in deptList2" :key="index" @click="select2(item,index)">
                <span>{{item.stardardDeptName}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
import vm from 'src/main';
import { resetData } from 'js/utils';
import { getFirstDeptList, getSecondDeptList } from 'services';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
    deptList1: [],
    deptList2: [],
    activeIndex1: 0,
    activeIndex2: -1,
});

export default {
    data() {
        return Object.assign({}, resetDataFn.data, {

        });
    },

    /*
        例子：
    */

    props: {},

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

            this.getFirstDeptListFn();
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);
        },
        getFirstDeptListFn() {
            getFirstDeptList([], (res) => {
                if (res.body) {
                    let { activeIndex1 } = this;
                    let defaultItem = res.body[activeIndex1];

                    this.deptList1 = res.body;
                    if (defaultItem) {
                        this.select1(defaultItem, activeIndex1);
                    }
                }
            });
        },
        select1(item, index) {
            let { stardardDeptId } = item;

            this.activeIndex1 = index;
            getSecondDeptList([stardardDeptId], (res) => {
                if (res.body) {
                    this.deptList2 = res.body;
                }
            });
        },
        select2(item, index) {
            this.activeIndex2 = index;
            let { activeIndex1: index1, activeIndex2: index2, deptList1, deptList2 } = this;
            let item1 = deptList1[index1];
            let item2 = deptList2[index2];

            vm.$emit('deptFilterClick', {
                index1,
                index2,
                item1,
                item2,
            });
            this.$router.back(1);
        },
    },
}
</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.deptFilter {
    @include styleInit;
    /deep/ & {
        display: flex;
        height: 100vh;
        .deptList1 {
            flex: 3.5;
            background-color: $bg;
            li {
                @include multiLine1;
                padding: 0 30rpx;
                line-height: $height2;
                text-align: center;
                span {
                    display: block;
                    border-bottom: $border1;
                }
                &.active {
                    font-size: 32rpx;
                    background-color: #fff;
                    span {
                        border-color: transparent;
                    }
                }
            }
        }
        .deptList2 {
            flex: 6.5;
            background-color: #fff;
            li {
                @include multiLine1;
                padding-left: 30rpx;
                line-height: $height1;
                span {
                    display: block;
                    border-bottom: $border1;
                }
                &.active {
                    color: $main;
                }
            }
        }
    }
}
</style>