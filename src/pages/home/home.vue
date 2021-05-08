<template>
    <view class="home">
        <text class="text1">{{`这是首页${text}`}}</text>
        <input placeholder="请输入" />
        <view class="ul">
            <view class="li">1</view>
            <view class="li">2</view>
        </view>
        <u-select v-model="show" :list="list"></u-select>
        <u-button @click="show = true">打开</u-button>
        <u-button @click="toTest">去测试页面</u-button>
        <text>{{'2020/9/2'|date('yyyy-MM-dd hh:ss')}}</text>
        <text>{{1.55555555555|toFixed(3)}}</text>
        <u-button @click="uniToast('这是提示')">弹出提示</u-button>
        <u-button @click="count++">增加{{count}}</u-button>
        <u-button @click="getList">请求接口数据</u-button>
    </view>
</template>
<script>
import { lStore, uniToast } from 'js/utils';

export default {
    data() {
        return {
            count: 0,
            text: '测试',
            show: false,
            list: [{
                    value: '1',
                    label: '江'
                },
                {
                    value: '2',
                    label: '湖'
                }
            ],
        }
    },

    onShow() {
        console.log(this.$Router);
        console.log(getApp());
        lStore.set('var', '测试');
    },

    methods: {
        toTest() {
            this.$Router.push({
                path: '/pages/test/test',
                query: {
                    a: 1,
                },
            });
        },
        async getList() {
            let res = await this.$services.testAxios({ pageIndex: 1, pageSize: 10 });

            console.log(res);
        },
    },
}
</script>
<style lang="scss" scoped>
.home {
    @include styleInit;
    padding: 0 50rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .ul {
        .li {
            border-bottom: 1px solid #ddd;
            &:last-of-type {
                border-bottom-color: transparent;
            }
        }
    }
}
</style>