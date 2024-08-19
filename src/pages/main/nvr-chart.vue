<template>
	<view>
		<web-view src="/static/assert/day-working-hours.html"></web-view>
		<!-- <web-view src="https://www.echartsjs.com/examples/zh/editor.html?c=custom-profile"></web-view> -->
	</view>
</template>
<script>
	var wv; //计划创建的webview
	export default {
		onReady() {
			// #ifdef APP-PLUS
			var currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
			setTimeout(function() {
				wv = currentWebview.children()[0]
				wv.setStyle({
					top: 30,
					height: 200
				})
			}, 1000); //如果是页面初始化调用时，需要延时一下
			// #endif
		}
	};
</script>

<style>

</style>
