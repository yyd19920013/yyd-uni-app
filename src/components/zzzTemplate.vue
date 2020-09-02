<template>
    <div class="name">
    </div>
</template>
<script>
import { resetData } from 'js/yydjs';

const resetDataFn = resetData({ //需要重置的data属性
    isEnter: false,
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
        },
        leaveFn() { //onHide和onUnload只会触发一个，如果是onHide可能需要重置data属性
            resetDataFn.reset(this);
        },
    },
}

</script>
<style lang="scss" scoped>
@import '~css/public.scss';

.name {
    @include styleInit;
    /deep/ & {}
}

</style>
