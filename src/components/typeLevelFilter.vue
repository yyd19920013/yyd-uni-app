<template>
    <div v-show="show" class="typeLevelFilter" id="typeLevelFilter" @click="maskClose($event)">
        <div class="wrap">
            <div class="main">
                <div class="typeWrap">
                    <div class="title">
                        服务类型
                    </div>
                    <div class="main">
                        <span :class="{active:activeIndex1==index}" v-for="(item,index) in typeList" :key="index" @click="typeClick(item,index)">{{item.name}}</span>
                    </div>
                </div>
                <div class="levelWrap">
                    <div class="title">
                        医生职称
                    </div>
                    <div class="main">
                        <span :class="{active:activeIndex2==index}" v-for="(item,index) in levelList" :key="index" @click="levelClick(item,index)">{{item.name}}</span>
                    </div>
                </div>
            </div>
            <div class="end">
                <ol>
                    <li class="tap" @click="resetFn">重置</li>
                    <li class="tap" @click="confirmFn">确定</li>
                </ol>
            </div>
        </div>
    </div>
</template>
<script>
import vm from 'src/main';
import { resetData } from 'js/yydjs';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
    typeList: [{
            name: '不限',
            onlineType: '',
        },
        // {
        //     name: '挂号',
        //     onlineType: '05',
        // },
        {
            name: '复诊',
            onlineType: '04',
        },
        {
            name: '图文',
            onlineType: '01',
        },
        {
            name: '视频',
            onlineType: '02',
        },
    ],
    activeIndex1: 0,
    activeIndex2: 0,
});

export default {
    data() {
        return Object.assign({}, resetDataFn.data, {
            typeIndexJson: {
                '99': 0,
                '05': 1,
                '04': 2,
                '01': 3,
                '02': 4,
            },
            levelList: [{
                    name: '不限',
                    doctorLevel: '',
                },
                {
                    name: '主任医师',
                    doctorLevel: '231',
                },
                {
                    name: '副主任医师',
                    doctorLevel: '232',
                },
                {
                    name: '主治医师',
                    doctorLevel: '233',
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
        type: { //服务类型限定为复诊
            type: String,
            default: '',
        },
        itemCode: { //服务类型code
            type: String,
            default: '',
        },
    },

    watch: {
        type(newVal, oldVal) {
            if (newVal != oldVal) {
                this.setVisitType();
            }
        },
        itemCode(newVal, oldVal) {
            if (newVal != oldVal) {
                this.setDefaultIndex();
            }
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
        setVisitType() {
            let { type } = this;

            if (type == 'homeConsult') {
                this.typeList = [{
                        name: '图文',
                        onlineType: '01',
                    },
                    {
                        name: '视频',
                        onlineType: '02',
                    }
                ];
            } else if (type == 'homeVisit') {
                this.typeList = [{
                    name: '复诊',
                    onlineType: '04',
                }];
            }
            this.activeIndex1 = 0;
            this.confirmFn();
        },
        setDefaultIndex() {
            let { itemCode } = this;

            if (itemCode) {
                let activeIndex = this.typeIndexJson[itemCode];

                this.activeIndex1 = activeIndex;
                this.confirmFn();
            }
        },
        closeFn() {
            this.$emit('update:show', false);
            vm.$emit('filterWrapSetActiveIndex', -1);
        },
        maskClose(ev) {
            let { id } = ev.target;

            if (id == 'typeLevelFilter') {
                this.closeFn();
            }
        },
        typeClick(item, index) {
            this.activeIndex1 = index;
        },
        levelClick(item, index) {
            this.activeIndex2 = index;
        },
        resetFn() {
            this.activeIndex1 = 0;
            this.activeIndex2 = 0;
        },
        confirmFn() {
            let { typeList, levelList, activeIndex1: index1, activeIndex2: index2 } = this;
            let item1 = typeList[index1] || {};
            let item2 = levelList[index2] || {};

            this.$emit('componentClick', {
                index1,
                item1,
                index2,
                item2,
            });
            this.closeFn();
        },
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.typeLevelFilter {
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
            >.main {
                .typeWrap, .levelWrap {
                    padding: 15rpx 30rpx;
                    border-bottom: $border1;
                    .title {
                        line-height: 60rpx;
                        font-size: 24rpx;
                        color: #999;
                    }
                    .main {
                        span {
                            display: inline-block;
                            min-width: 150rpx;
                            height: 56rpx;
                            line-height: 56rpx;
                            text-align: center;
                            background-color: $bg;
                            font-size: 24rpx;
                            color: #666;
                            border-radius: 4rpx;
                            margin-right: 20rpx;
                            margin-bottom: 20rpx;
                            &.active {
                                background-color: $main;
                                color: #fff;
                            }
                        }
                    }
                }
            }
            >.end {
                display: flex;
                justify-content: flex-end;
                padding: 20rpx 30rpx;
                height: 96rpx;
                ol {
                    display: flex;
                    width: 300rpx;
                    height: 56rpx;
                    line-height: 56rpx;
                    text-align: center;
                    li {
                        flex: 1;
                        font-size: 24rpx;
                        color: #fff;
                        &:first-of-type {
                            background-color: $yellow;
                            border-radius: 28rpx 0 0 28rpx;
                        }
                        &:last-of-type {
                            background-color: $main;
                            border-radius: 0 28rpx 28rpx 0;
                        }
                    }
                }
            }
        }
    }
}

</style>
