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
		<u-select v-model="show" :list="list"></u-select>
		<u-button @click="show = true">打开</u-button>
		<u-button @click="toTest">去测试页面</u-button>
	</view>
</template>
<script>
import { lStore } from 'js/yydjs';

export default {
	data() {
		return {
			text: '11111',
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
		lStore.set('aaa', '按时大大');
	},

	methods: {
		toTest() {
			this.$Router.push('/pages/test/test');
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
}
</style>