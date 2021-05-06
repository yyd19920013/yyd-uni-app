<template>
    <div :class="{selectSourceNumber:true,active:show}" :id="id" @click="maskClose($event)">
        <div class="wrap">
            <div class="title">
                <span class="cancel tap" @click="close">取消</span>
                <h3>{{titleJson[itemCode]}}</h3>
            </div>
            <div v-if="show" class="timeWrap">
                <ul class="dateList">
                    <li v-for="(item,index) in resultDateList" :key="index" :class="{active:dateIndex==index}" @click="selectDate(item,index)">
                        <span class="span">{{item.formatWorkDate}}</span>
                        <span class="em">{{item.formatWeekDay}}</span>
                    </li>
                </ul>
                <ul v-if="showTimeList" class="timeList">
                    <li v-for="(item,index) in resultTimeList" :key="index" :class="{active:timeIndex==index}" @click="selectTime(item,index)">
                        <div class="wrap">
                            <div>
                                {{item.formatStartTime}} - {{item.formatEndTime}}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { resetData, copyJson, soleString32, getWeekName, dateFormat0 } from 'js/utils';
import { findDocReservationsSchduleHyByItemCode } from 'services';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
    showTimeList: true,
    dateList: [],
    dateIndex: 0,
    timeIndex: -1,
});

export default {
    data() {
        let id = soleString32();

        return Object.assign({}, resetDataFn.data, {
            id,
            titleJson: {
                '01': '预约咨询时间',
                '02': '预约咨询时间',
                '04': '预约复诊时间',
            },
        });
    },

    computed: {
        resultDateList() {
            return this.resultDateListFn();
        },
        resultTimeList() {
            return this.resultTimeListFn();
        },
    },

    /*
        例子：
        <selectSourceNumber :show.sync="showSourceNumber1" :doctorOnlineExtraId="id" itemCode="01" @selectTime="selectTime" />
    */

    props: {
        doctorOnlineExtraId: { //在线问诊医生id
            required: true,
            type: [String, Number],
            default: 0,
        },
        itemCode: { //项目code，01图文问诊 02视频问诊 04复诊配药
            required: true,
            type: String,
            default: '01',
        },
        show: { //是否显示
            type: Boolean,
            default: false,
        },
    },

    watch: {
        show(newVal, oldVal) {
            if (newVal != oldVal && !newVal) {
                this.dateIndex = 0;
                this.timeIndex = -1;
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
    },

    methods: {
        enterFn() { //onLoad和onShow可能会一起触发，所以需要防止重复触发
            if (this.isEnter) return;
            this.isEnter = true;

            this.findDocReservationsSchduleHyByItemCodeFn();
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);
        },
        resultDateListFn() {
            let { dateList } = this;
            let result = [];

            result = dateList.map((item, index) => {
                let { workDate } = item;

                item.formatWorkDate = dateFormat0(workDate, 'MM月dd日');
                item.formatWeekDay = getWeekName(workDate, '周');
                return item;
            });
            return result;
        },
        resultTimeListFn() {
            let { dateList, dateIndex } = this;
            let item = dateList[dateIndex] || {};
            let { scheduleHys } = item;
            let result = scheduleHys || [];

            result = result.map((item, index) => {
                let { workDate, startTime, endTime } = item;

                workDate = dateFormat0(workDate, 'yyyy-MM-dd');
                item.fullStartTime = `${workDate} ${startTime}`;
                item.fullEndTime = `${workDate} ${endTime}`;
                startTime = startTime.split(':').splice(0, 2).join(':');
                endTime = endTime.split(':').splice(0, 2).join(':');
                item.formatWorkDate = dateFormat0(workDate, 'MM月dd日');
                item.formatWeekDay = getWeekName(workDate, '周');
                item.formatStartTime = startTime;
                item.formatEndTime = endTime;
                return item;
            });
            return result;
        },
        findDocReservationsSchduleHyByItemCodeFn() {
            let { doctorOnlineExtraId, itemCode } = this;

            findDocReservationsSchduleHyByItemCode([+doctorOnlineExtraId, itemCode], (res) => {
                if (res.body) {
                    this.dateList = res.body;
                    let firstItem1 = this.resultDateListFn()[0] || {};
                    let firstItem2 = this.resultTimeListFn()[0] || {};

                    this.$emit('selectDate', {
                        isFirst: true,
                        itemCode: this.itemCode,
                        item: firstItem1,
                        index: 0,
                    });
                    this.$emit('selectTime', {
                        isFirst: true,
                        itemCode: this.itemCode,
                        item: firstItem2,
                        index: 0,
                    });
                }
            });
        },
        selectDate(item, index) {
            this.dateIndex = index;
            this.timeIndex = -1;

            this.showTimeList = false;
            setTimeout(() => {
                this.showTimeList = true;
            }, 100);
            setTimeout(() => {
                this.$emit('selectDate', {
                    itemCode: this.itemCode,
                    item,
                    index,
                });
            });
        },
        selectTime(item, index) {
            this.timeIndex = index;
            setTimeout(() => {
                this.$emit('selectTime', {
                    itemCode: this.itemCode,
                    item,
                    index,
                });
                this.close();
            });
        },
        close() {
            this.$emit('update:show', false);
        },
        maskClose(ev) {
            let { id } = ev.target;

            if (id == this.id) {
                this.close();
            }
        },
    },
}
</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.selectSourceNumber {
    @include styleInit;
    /deep/ & {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .3);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1000;
        display: none;
        &.active {
            display: block;
        }
        >.wrap {
            width: 100%;
            background-color: #fff;
            position: absolute;
            left: 0;
            bottom: 0;
            .title {
                height: $height1;
                line-height: $height1;
                text-align: center;
                border-bottom: $border1;
                position: relative;
                .cancel {
                    width: 100rpx;
                    color: #999;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
                h3 {
                    padding: 0 100rpx;
                }
            }
            .timeWrap {
                display: flex;
                height: 50vh;
                overflow: hidden;
                .dateList {
                    min-width: 260rpx;
                    width: 260rpx;
                    height: 100%;
                    background-color: $bg;
                    overflow: hidden;
                    overflow-y: auto;
                    li {
                        height: 100rpx;
                        line-height: 100rpx;
                        text-align: center;
                        color: #999;
                        .em {
                            padding-left: 20rpx;
                        }
                        &.active {
                            background-color: #fff;
                            color: #333;
                        }
                    }
                }
                .timeList {
                    flex: 1;
                    padding: 40rpx 0;
                    height: 100%;
                    overflow: hidden;
                    overflow-y: auto;
                    li {
                        display: flex;
                        justify-content: center;
                        padding-bottom: 40rpx;
                        .wrap {
                            width: 300rpx;
                            height: 64rpx;
                            line-height: 62rpx;
                            text-align: center;
                            font-size: 24rpx;
                            background-color: $bg;
                            color: #666;
                            border: $border1;
                            border-radius: 32rpx;
                        }
                        &:last-of-type {
                            padding-bottom: 0;
                        }
                        &.active {
                            .wrap {
                                background-color: $blueBg;
                                color: $main;
                                border-color: $main;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>