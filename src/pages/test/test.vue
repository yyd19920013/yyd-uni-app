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

	onLoad() {

	},

	methods: {

	},
}
</script>
<style lang="scss" scoped>
.test {
	@include styleInit;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
</style>