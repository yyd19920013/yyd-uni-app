<template>
    <div class="doctorList">
        <template v-if="firstLoad">
            <scroll-view v-if="resultDataList.length" class="scrollView" :scroll-y="true" :scroll-top="scrollTop" @scrolltolower="scrolltolowerFn">
                <ul>
                    <li v-for="(item,index) in resultDataList" :key="index">
                        <imgWrap className="avatar" :auto="false" :src="item.avatarFileId?viewImage+item.avatarFileId:'img_head_doctor.png'" />
                        <div class="rightContent" @click="selectDoctor(item,index)">
                            <h3>
                                <span class="span">{{item.doctorName}}</span>
                                <span class="em">{{item.doctorLevelText}}</span>
                                <!-- <span class="i">可挂号</span> -->
                            </h3>
                            <h4>
                                <span class="span">{{item.orgFullName}}</span>
                                <span class="em">{{item.deptName}}</span>
                            </h4>
                            <div class="count">
                                <span class="score">
                                    <imgWrap className="star" src="icon/ic_star_S_red.png" />
                                    <span>{{item.avgScore}}</span>
                                </span>
                                <span class="quantity">
                                    <span class="span">咨询量</span>
                                    <span class="em">{{item.consultNum}}</span>
                                </span>
                            </div>
                            <div class="adept">
                                擅长：{{item.speciality || '暂无'}}
                            </div>
                            <ol class="serverList">
                                <li v-if="onlineItemsJson[item1.itemCode]" v-for="(item1,index1) in item.doctorOnlineItems" :key="index1" :class="{[onlineItemsJson[item1.itemCode].className]:true,active:item1.doctorOnlineExtraId}">
                                    <imgWrap className="icon" :src="item1.doctorOnlineExtraId?onlineItemsJson[item1.itemCode].icon:onlineItemsJson[item1.itemCode].activeIcon" />
                                    <span class="span">{{onlineItemsJson[item1.itemCode].name}}</span>
                                    <span class="em">￥{{item1.price}}</span>
                                </li>
                            </ol>
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
import imgWrap from 'components/imgWrap';
import loadMore from 'components/loadMore';
import listEmpty from 'components/listEmpty';
import { resetData } from 'js/yydjs';
import { viewImage, findDoctors } from 'services';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
    dataList: [],
    innerParams: {
        id: '',
        standardDeptId: '',
        onlineType: '', // 01  图文问诊 02 视频问诊 04复诊配药
        doctorLevel: '',
        sortType: '', // 排序类型  默认按职称排序，  1为接诊量
        page: 1,
        limit: 10
    },
    status: 'loading',
    firstLoad: false,
    networkError: false,
    scrollTop: 0,
});

export default {
    data() {
        return Object.assign({}, resetDataFn.data, {
            apis: {
                findDoctors,
            },
            onlineItemsJson: {
                '01': {
                    name: '图文',
                    className: 'imgText',
                    icon: 'icon/img_tip_photo.png',
                    activeIcon: 'icon/img_tip_photo_gray.png',
                },
                '02': {
                    name: '视频',
                    className: 'video',
                    icon: 'icon/img_tip_video.png',
                    activeIcon: 'icon/img_tip_video_gray.png',
                },
                '04': {
                    name: '复诊',
                    className: 'visit',
                    icon: 'icon/img_tip_medicine.png',
                    activeIcon: 'icon/img_tip_medicine_gray.png',
                },
            },
            viewImage,
        });
    },

    computed: {
        resultDataList() {
            let result = this.dataList.map((item, index) => {
                let { doctorOnlineItems } = item;
                let codeArr = ['01', '02', '04'];
                let itemCodeArr = doctorOnlineItems.map((item1, index1) => {
                    let { itemCode } = item1;

                    return itemCode;
                });

                for (let item2 of codeArr) {
                    if (!~itemCodeArr.indexOf(item2)) {
                        item.doctorOnlineItems.push({ itemCode: item2 });
                    }
                }
                item.doctorOnlineItems.sort((a, b) => {
                    return a.itemCode - b.itemCode;
                });
                return item;
            });

            return result;
        },
    },

    /*
        例子：
        <doctorList />
    */

    props: {
        type: { //服务类型限定为复诊
            type: String,
            default: '',
        },
        apiName: { //指定获取数据的api函数
            type: String,
            default: 'findDoctors',
        },
        isLoadOnce: { //是否只加载一次
            type: Boolean,
            default: false,
        },
    },

    onLoad() { //为保证每次进入都触发，需写在enterFn
        vm.$on('doctorListSetInnerParams', this.setInnerParams);
        vm.$on('doctorListGetFilterList', this.getFilterList);
        this.enterFn();
    },

    onShow() { //为保证每次进入都触发，需写在enterFn
        this.enterFn();
    },

    onHide() { //为保证每次离开都触发，需写在leaveFn
        this.leaveFn();
    },

    onUnload() { //为保证每次离开都触发，需写在leaveFn
        vm.$off('doctorListSetInnerParams', this.setInnerParams);
        vm.$off('doctorListGetFilterList', this.getFilterList);
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
        setInnerParams(params = {}) {
            for (let attr in params) {
                this.innerParams[attr] = params[attr];
            }
        },
        getFilterList() {
            this.status = 'loading';
            this.innerParams.page = 1;
            this.getDataList(null, () => {
                this.dataList = [];
            }, () => {
                this.scrollTop = -1;
                this.scrollTop = 0;
            });
        },
        getDataList(addPageNum = false, startFn, endFn, errFn) {
            let { apis, apiName } = this;
            let api = apis[apiName];

            if (addPageNum) {
                this.innerParams.page++;
            }
            api && api([this.innerParams], (res) => {
                startFn && startFn(res);
                if (res.body) {
                    let { limit } = this.innerParams;
                    let { data } = res.body;
                    let result = data || res.body || [];

                    this.dataList = [].concat(this.dataList, result);
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
        selectDoctor(item, index) {
            let { id } = item;
            let { type } = this;

            if (type == 'homeConsult' || type == 'homeVisit') {
                this.$emit('componentClick', {
                    item,
                    index,
                });
            } else {
                this.$router.navigate({
                    path: '/package/main/doctorHome/doctorHome',
                    query: {
                        id,
                    },
                });
            }
        },
    },

    components: {
        imgWrap,
        loadMore,
        listEmpty,
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.doctorList {
    @include styleInit;
    /deep/ & {
        min-height: 400rpx;
        background-color: #fff;
        position: relative;
        .scrollView {
            height: 100%;
            background-color: #fff;
            ul {
                >li {
                    display: flex;
                    padding: 30rpx;
                    .avatar {
                        min-width: 100rpx;
                        width: 100rpx;
                        height: 100rpx;
                        border-radius: 50%;
                        background-color: $bg;
                    }
                    .rightContent {
                        flex: 1;
                        padding-left: 40rpx;
                        position: relative;
                        h3, h4 {
                            line-height: 60rpx;
                        }
                        h3 {
                            .span, .em {
                                margin-right: 20rpx;
                            }
                            .span {
                                font-size: 32rpx;
                            }
                            .em {
                                color: #999;
                            }
                            .i {
                                padding: 0 10rpx;
                                border: 1px solid $main;
                                color: $main;
                                border-radius: 4rpx;
                            }
                        }
                        h4 {
                            .span, .em {
                                margin-right: 20rpx;
                            }
                            color: #999;
                        }
                        .count {
                            line-height: 60rpx;
                            .score {
                                margin-right: 20rpx;
                                color: $orange;
                                .star {
                                    width: 24rpx;
                                    margin-right: 8rpx;
                                }
                            }
                            .quantity {
                                padding: 10rpx 0;
                                .span {
                                    font-size: 28rpx;
                                    color: #999;
                                }
                            }
                        }
                        .adept {
                            line-height: 40rpx;
                            color: #666;
                        }
                        .serverList {
                            display: flex;
                            padding-top: 20rpx;
                            line-height: 40rpx;
                            li {
                                display: flex;
                                align-items: center;
                                flex: 1;
                                line-height: 40rpx;
                                font-size: 24rpx;
                                .icon {
                                    width: 24rpx;
                                    margin-right: 10rpx;
                                }
                                .span {
                                    color: #999;
                                }
                                .em {
                                    display: none;
                                    color: $orange;
                                }
                                &.active {
                                    .span {
                                        color: #333;
                                    }
                                    .em {
                                        display: block;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

</style>
