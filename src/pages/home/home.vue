<template>
	<view class="home">
		<text class="text1">{{`这是首页${text}`}}</text>
		<input placeholder="3222223332" />
		<view class="ul">
			<view class="li">1</view>
			<view class="li">2</view>
		</view>
		{{'2020/9/2'|date('yyyy-MM-dd hh:ss')}}
		{{1.55555555555|toFixed(3)}}
	</view>
</template>
<script>
import { lStore } from 'js/yydjs';

export default {
	data() {
		return {
			text: '11111',
		}
	},

	onShow() {
		console.log(this.$Router);
		console.log(getApp());
		lStore.set('aaa', '按时大大');
	},

	methods: {

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
}
</style>