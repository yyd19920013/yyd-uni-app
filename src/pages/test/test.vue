<template>
	<view class="test">
		这是测试页
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

	},
}
</script>
<style lang="scss" scoped>
.test {
	@include styleInit;
}
</style>