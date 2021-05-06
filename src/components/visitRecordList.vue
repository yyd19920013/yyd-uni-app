<template>
    <div class="visitRecordList">
        <scroll-view class="scrollView" :scroll-y="true" @scrolltolower="scrolltolowerFn">
            <div v-if="!dataList.length&&firstLoad" class="noData">
                未搜索到结果
            </div>
            <template v-else>
                <ul>
                    <li v-for="(item,index) in dataList" :key="index" @click="selectVisitRecord(item,index)">
                        {{item.icdName}}
                    </li>
                </ul>
                <loadMore :status.sync="isLoadOnce?'':status" />
            </template>
        </scroll-view>
    </div>
</template>
<script>
import vm from 'src/main';
import imgWrap from 'components/imgWrap';
import loadMore from 'components/loadMore';
import { resetData } from 'js/utils';
import { findDiseases } from 'services';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
    dataList: [],
    innerParams: {
        pageNo: 1,
        pageSize: 20,
        icdVersion: '',
        keyWord: '',
    },
    status: 'loading',
    firstLoad: false,
});

export default {
    data() {
        return Object.assign({}, resetDataFn.data, {

        });
    },

    /*
        例子：
        <visitRecordList />
    */

    props: {
        isLoadOnce: { //是否只加载一次
            type: Boolean,
            default: false,
        },
    },

    onLoad() { //为保证每次进入都触发，需写在enterFn
        vm.$on('visitRecordListSetInnerParams', this.setInnerParams);
        vm.$on('visitRecordListGetFilterList', this.getFilterList);
        this.enterFn();
    },

    onShow() { //为保证每次进入都触发，需写在enterFn
        this.enterFn();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        vm.$off('visitRecordListSetInnerParams', this.setInnerParams);
        vm.$off('visitRecordListGetFilterList', this.getFilterList);
        this.leaveFn();
    },

    methods: {
        enterFn() { //onLoad和onShow可能会一起触发，所以需要防止重复触发
            if (this.isEnter) return;
            this.isEnter = true;

            this.getDataList(null, (res) => {
                this.firstLoad = true;
                this.$emit('firstLoad', res);
            });
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);
        },
        setInnerParams(params = {}) {
            for (let attr in params) {
                this.innerParams[attr] = params[attr];
            }
        },
        getFilterList() {
            this.status = 'loading';
            this.innerParams.pageNo = 1;
            this.getDataList(false, () => {
                this.dataList = [];
            });
        },
        getDataList(addPageNum = false, endFn) {
            if (addPageNum) {
                this.innerParams.pageNo++;
            }
            findDiseases([this.innerParams], (res) => {
                endFn && endFn(res);
                if (res.body) {
                    let { pageSize } = this.innerParams;
                    let { data } = res.body;
                    let result = data || res.body || [];

                    this.dataList = [].concat(this.dataList, result);
                    if (!result.length || result.length < pageSize) {
                        this.status = 'loaded';
                    }
                }
            });
        },
        scrolltolowerFn(ev) {
            let { status, isLoadOnce } = this;

            if (status != 'loaded' && !isLoadOnce) {
                this.getDataList(true);
            }
        },
        selectVisitRecord(item, index) {
            vm.$emit('visitRecordListSelectVisitRecord', {
                item,
                index,
            });
        },
    },

    components: {
        imgWrap,
        loadMore,
    },
}
</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.visitRecordList {
    @include styleInit;
    /deep/ & {
        background-color: #fff;
        .scrollView {
            height: 100%;
            .noData {
                height: $height1;
                line-height: $height1;
                text-align: center;
                color: #999;
            }
            ul {
                >li {
                    padding: 24rpx $padding1;
                    line-height: 40rpx;
                    border-bottom: $border1;
                    font-size: 24rpx;
                    word-break: break-all;
                }
            }
        }
    }
}
</style>