<template>
    <div class="swiperWrap">
        <swiper class="swiper" :indicator-dots="showDot" :indicator-color="dotColor" :indicator-active-color="dotActiveColor" :autoplay="auto" :interval="interval" :duration="duration" :style="{
                width:cWidth+'rpx',
                height:height+'rpx',
            }">
            <block v-for="(item,index) in dataList" :key="index">
                <swiper-item>
                    <img class="img" @click="clickImg(item,index)" :style="{
                            width:cWidth,
                            height:height+'rpx',
                            backgroundImage:'url('+item.src+')',
                        }" />
                </swiper-item>
            </block>
        </swiper>
    </div>
</template>
<script>
import { resetData } from 'js/yydjs';

const resetDataFn = resetData({ //需要重置的data属性

});

export default {
    data() {
        return Object.assign({}, resetDataFn.data, {

        });
    },

    computed: {
        cWidth() {
            return this.width ? `${this.width}rpx;` : '';
        },
    },

    /*
        例子：
        <swiperWrap
            :dataList="[
                {
                    src:'http://pic1.win4000.com/wallpaper/7/53bce10032f18.jpg',
                    link:'../user/user',
                },
                {
                    src:'http://pic1.win4000.com/wallpaper/7/53bce10032f18.jpg',
                    link:'../user/user',
                },
                {
                    src:'http://pic1.win4000.com/wallpaper/7/53bce10032f18.jpg',
                    link:'../user/user',
                },
            ]"
        />
    */

    props: {
        dataList: { //必填
            type: Array,
            required: true,
            default: () => [],
        },
        click: () => {}, //点击图片触发的函数
        showDot: { //是否显示圆点
            type: Boolean,
            default: true,
        },
        dotColor: { //圆点的颜色
            type: String,
            default: 'rgba(255,255,255,0.3)',
        },
        dotActiveColor: { //圆点选中时候的颜色
            type: String,
            default: 'rgba(255,255,255,1)',
        },
        auto: { //是否自动播放
            type: Boolean,
            default: true,
        },
        interval: { //自动播放间隔时间
            type: Number,
            default: 3000,
        },
        duration: { //滚动持续时间
            type: Number,
            default: 500,
        },
        width: { //轮播图宽度
            type: Number,
            default: '100%',
        },
        height: { //轮播图高度
            type: Number,
            default: 150,
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
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);
        },
        clickImg(item, index) {
            if (item.link) {
                wx.navigateTo({
                    url: item.link,
                });
            }

            this.click && this.click(item, index);
        },
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.swiperWrap {
    @include styleInit;
    .swiper, .img {
        width: 100%;
    }
    .img {
        background: url('') no-repeat center top;
        background-size: cover;
    }
}

</style>
