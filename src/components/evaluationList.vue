<template>
    <div class="evaluationList">
        <template v-if="firstLoad">
            <scroll-view v-if="dataList.length" class="scrollView" :scroll-y="true" :scroll-top="scrollTop" @scrolltolower="scrolltolowerFn">
                <ul>
                    <li v-for="(item,index) in dataList" :key="index">
                        <div class="title">
                            <div class="leftContent">
                                <span class="name">{{item.userName}}</span>
                                <div class="starWrap">
                                    <i v-for="(item1,index1) in 5" :key="index1" :class="{active:item.score>index1}"></i>
                                </div>
                            </div>
                            <span>{{item.formatCreateAt}}</span>
                        </div>
                        <div class="main">
                            {{item.content}}
                        </div>
                        <div class="end">
                            <span v-if="item.tagsContext" v-for="(item1,index1) in item.tagsContext" :key="index1">{{item1}}</span>
                        </div>
                    </li>
                </ul>
                <loadMore :status.sync="isLoadOnce?'':status" />
            </scroll-view>
            <listEmpty v-else :networkError="networkError" @clickButton="getFilterList" />
        </template>
    </div>
</template>
<script>
import vm from 'src/main';
import loadMore from 'components/loadMore';
import listEmpty from 'components/listEmpty';
import { resetData, dateFormat0 } from 'js/utils';
import { getComments } from 'services';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
    dataList: [],
    innerParams: ['', 1, 10],
    firstLoad: false,
    networkError: false,
    scrollTop: 0,
});

export default {
    data() {
        return Object.assign({}, resetDataFn.data, {
            apis: {
                getComments,
            },
        });
    },

    /*
        例子：
        <evaluationList v-if="id" :id="id" />
    */

    props: {
        id: { //在线问诊医生id
            required: true,
            type: String,
            default: '',
        },
        apiName: { //指定获取数据的api函数
            type: String,
            default: 'getComments',
        },
        isLoadOnce: { //是否只加载一次
            type: Boolean,
            default: false,
        },
    },

    onLoad() { //为保证每次进入都触发，需写在enterFn
        vm.$on('evaluationListSetInnerParams', this.setInnerParams);
        vm.$on('evaluationListGetFilterList', this.getFilterList);
        this.enterFn();
    },

    onShow() { //为保证每次进入都触发，需写在enterFn
        this.enterFn();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        vm.$off('evaluationListSetInnerParams', this.setInnerParams);
        vm.$off('evaluationListGetFilterList', this.getFilterList);
        this.leaveFn();
    },

    methods: {
        enterFn() { //onLoad和onShow可能会一起触发，所以需要防止重复触发
            if (this.isEnter) return;
            this.isEnter = true;

            this.getDataList(null, (res) => {
                this.firstLoad = true;
                this.$emit('firstLoad', res);
            }, null, (err) => {
                this.firstLoad = true;
            });
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);
        },
        setInnerParams(params = []) {
            for (let i = 0; i < params.length; i++) {
                let item = params[i];

                this.innerParams[i] = item;
            }
        },
        getFilterList() {
            this.status = 'loading';
            this.innerParams[1] = 1;
            this.getDataList(null, () => {
                this.dataList = [];
            }, () => {
                this.scrollTop = -1;
                this.scrollTop = 0;
            });
        },
        getDataList(addPageNum = false, startFn, endFn, errFn) {
            let { apis, apiName, id } = this;
            let api = apis[apiName];

            if (addPageNum) {
                this.innerParams[1]++;
            }
            this.innerParams[0] = id;
            api && api(this.innerParams, (res) => {
                startFn && startFn(res);
                if (res.body) {
                    let limit = this.innerParams[2];
                    let { data } = res.body;
                    let result = data || res.body || [];

                    this.dataList = [].concat(this.dataList, result);
                    this.dataList = this.dataList.map((item, index) => {
                        item.formatCreateAt = dateFormat0(item.createAt, 'yyyy-MM-dd hh:mm');
                        return item;
                    });
                    if (!result.length || result.length < limit) {
                        this.status = 'loaded';
                    }
                }
                endFn && endFn(res);
            }, (err) => {
                this.networkError = true;
                errFn && errFn(err);
            });
        },
        scrolltolowerFn(ev) {
            let { status, isLoadOnce } = this;

            if (status != 'loaded' && !isLoadOnce) {
                this.getDataList(true);
            }
        },
    },

    components: {
        loadMore,
        listEmpty,
    },
}
</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.evaluationList {
    @include styleInit;
    /deep/ & {
        min-height: 400rpx;
        background-color: #fff;
        position: relative;
        li {
            padding: $padding1;
            padding-bottom: 0;
            border-bottom: $border1;
            .title {
                display: flex;
                justify-content: space-between;
                .leftContent {
                    display: flex;
                    .name {
                        color: #999;
                    }
                    .starWrap {
                        @include starWrap('../');
                        padding: 0 20rpx;
                    }
                }
                >span {
                    color: #999;
                }
            }
            .main {
                padding: 20rpx 0;
                line-height: 40rpx;
            }
            .end {
                @include labelList;
            }
        }
    }
}
</style>