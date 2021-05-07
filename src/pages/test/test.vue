<template>
    <view class="test">
        <view>这是测试页</view>
        <u-button @click="toHome">回到首页</u-button>
    </view>
</template>
<script>
export default {
    data() {
        return {
            title: 'Hello'
        }
    },

    onShow() {
        console.log(this.$Route.query);
    },

    methods: {
        toHome(){
            this.$Router.push({
                path: '/pages/home/home',
                query: {
                    b: 2,
                },
            });
        },
    },
}
</script>
<style lang="scss" scoped>
.test {
    @include styleInit;
}
</style>