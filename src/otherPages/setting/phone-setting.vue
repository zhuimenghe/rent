<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view>
			<view class="item-content">{{phoneData.label}}</view>
			<view v-for="(item,index) in phoneData.content" :key="index">
				<view class="item-name">{{item.type}}：</view>
				<view class="item-name">步骤：</view>
				<view class="item-content">{{item.setting}}</view>
				<view class="img-container">
					<view class="img-content" v-for="(img,i) in item.imgs" :key='i'>
						<image class="img-view" :src="img"></image>

					</view>
				</view>

			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				phoneList: [{
						label: '华为手机配置（华为 nova3）',
						value: 'huawei',
						content: [{
							type: '应用启动管理',
							setting: '【设置】->【应用】->【应用启动管理】->关闭【北谷租赁管家】自动管理->打开手动管理允许自启动、允许关联启动、允许后台活动',
							imgs: [
								//'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/huawei/huawei1.png?versionId=CAEQIBiBgMCi197AhxgiIDBlYjk2NTkxN2FkYjQ4YzhiNWU1YWJjZjY1NWE5YmI3'
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/huawei/huawei2.png?versionId=CAEQIBiBgMCd197AhxgiIDRkMTk2NmRmM2MzMzRiZGVhZjM5OWVjZjA0YjBhNjgy',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/huawei/huawei3.png?versionId=CAEQIBiBgICb197AhxgiIGU3MTNiNjUyNzNmYzRlZTQ4ODU0OWFhZDY2NGNmMzg0',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/huawei/huawei4.png?versionId=CAEQIBiBgICy197AhxgiIDBjYzA5NTY3OTJkZDQ5Nzk5Y2IyMTNkZTllZWFlMWIx',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/huawei/huawei5.png?versionId=CAEQIBiBgICs197AhxgiIDE0N2I0YTJhZTAyYzRlZWM4NTY1NjhlYjdiNWViMWVl',
							]
						}]

					},
					{
						label: '红米手机配置（红米5）',
						value: 'hongmi',
						content: [{
								type: '后台运行权限设置',
								setting: '【设置】->【电量和性能】->【应用配置】->【北谷租赁管家】->【无限制】',
								imgs: [
									'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/hongmi/hongmi1.png?versionId=CAEQIBiBgICljOPAhxgiIGY3NGZjMGFmMDI5MjQwNmI4ZTI5Yjg4NTU5NTZlOWEz',
									'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/hongmi/hongmi2.png?versionId=CAEQIBiBgICojOPAhxgiIDEwNzkzOGM1OTM0YjQzZThiMzI2NGY0MWRhYjJjMTIx',
									'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/hongmi/hongmi3.png?versionId=CAEQIBiBgICKjOPAhxgiIDFlZjAwODk2NzU5YzQyMTZiMTFhMzg0MjQzZjM1NmZi',
									'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/hongmi/hongmi4.png?versionId=CAEQIBiBgMDHjOPAhxgiIDUyMjAyYmRlNTQ2ZTQyZjA4Y2NlYmQzNWNkZmI0NzU1',

								]
							},
							// {
							// 	type: '通知',
							// 	setting: '【设置】->【通知和状态栏】->【通知管理】>【北谷租赁管家】->打开【允许通知】',
							// 	imgs: [
							// 		'/static/help/hongmi/hongmi5.png',
							// 		'/static/help/hongmi/hongmi6.png',
							// 		'/static/help/hongmi/hongmi7.png',
							// 		'/static/help/hongmi/hongmi8.png',

							// 	]
							// }
						]
					},
					{
						label: '小米手机配置（MIX2）',
						value: 'xiaomi',
						content: [{
							type: '后台运行权限设置',
							setting: '【安全中心】->【电量】->【应用智能省电】->【北谷租赁管家】->【无限制】',
							imgs: [
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/xiaomi/xiaomi1.png?versionId=CAEQIBiBgMDCn.fAhxgiIGYyYmI5NzAxMzM2NzQyZWZiNWU3ZTk5YzQ0YzFhNzgz',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/xiaomi/xiaomi2.png?versionId=CAEQIBiCgMCYn.fAhxgiIGZhMGEzNjdkYjk3OTQ1YjViNDYxZDNjODUxMGQ2OWI1',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/xiaomi/xiaomi3.png?versionId=CAEQIBiBgMCon.fAhxgiIDZjYzk5ZTdlOGM4ZTRmZGNhZmY2MWM3YzUzYzgyN2Vk',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/xiaomi/xiaomi4.png?versionId=CAEQIBiBgICZn.fAhxgiIDg4MjgwY2YzOWM1MTQ0NmZhYWNmY2JkZjQwMjc4MTRi',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/xiaomi/xiaomi5.png?versionId=CAEQIBiBgMCYn.fAhxgiIDgwYjI2NzI0ZmQ1NjQyZWQ5NDgwMjA0ZjliNTZmYzU0',
							]
						},
						{
							type: '自启动权限',
							setting: '【设置】->【授权管理】->【自启动管理】->打开【北谷租赁管家】开关',
							imgs: [
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/xiaomi/xiaomi6.png?versionId=CAEQIBiBgIDBn.fAhxgiIDNhMDM1YmI4ODdhMjRmOTdiYzUzMzA0YWQ4NTQxM2I2',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/xiaomi/xiaomi7.jpg?versionId=CAEQIBiBgMC.n.fAhxgiIGU3YzNiMThlM2YwZjQ5MDY4Zjg0Yjg2ZjJkMDM2YjUx',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/xiaomi/xiaomi8.jpg?versionId=CAEQIBiBgIDTn.fAhxgiIDlmZGUxOTRiMzNjMTQyY2Q5Y2Q0NzNlYzYxMzNiNGIw',
							]
						}]
					},
					{
						label: '魅族手机配置（魅蓝E2）',
						value: 'meizu',
						content: [{
							type: '后台运行权限设置',
							setting: '【手机管家】->【权限管理】->【后台管理】->【北谷租赁管家】->【允许后台运行】',
							imgs: [
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/meizu/meizu1.png?versionId=CAEQIBiBgICX4.vAhxgiIGYxZjNiZDJhYThhNDQzOTVhMWU5MTIzN2M4NGFjYzA0',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/meizu/meizu2.png?versionId=CAEQIBiBgICa4.vAhxgiIGJlNDI2ZmFjZTI2NTQ0NWZhMThlNWRmMmM3OTg3ZGMz',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/meizu/meizu3.png?versionId=CAEQIBiBgIDr4uvAhxgiIDczZWVkYjA4ZjAyNjRjYmE5MjJkZjAyMWRmMDczOTNk',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/meizu/meizu4.png?versionId=CAEQIBiBgMDb4uvAhxgiIDIzOTQ2Yzc5Mjg0YzRmNWFhYzZhNWUwMDdiNzU0ZWFj',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/meizu/meizu5.png?versionId=CAEQIBiBgMD.4uvAhxgiIDZiMzgzNjdjNjU3MDQ0YmI5Yjc4NzYxYjRmMTExMGY2',

							]
						}]
					},
					{
						label: 'oppo手机配置',
						value: 'oppo',
						content: [{
							type: '后台运行权限设置',
							setting: '【设置】->【电池】->关闭【智能耗电保护（推荐）】->打开【自定义耗电保护】->【北谷租赁管家】->【允许后台运行】',
							imgs: [
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/oppo/oppo1.png?versionId=CAEQIBiBgMDB2fDAhxgiIDQ3YjFkZjg2NzZjZTRmNjQ5NGM0ZTVjNTgwZTFlNzcx',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/oppo/oppo2.png?versionId=CAEQIBiBgMCp1_DAhxgiIDdjMGIxZDc0MTkxNzRjYzU5ODc1OTUwNDFiOWY2MjMx',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/oppo/oppo3.png?versionId=CAEQIBiBgICI2PDAhxgiIGYxYjRhM2NkY2I3NTQzZWI5NTQwNGE0MWFiN2I4YjQ1',

							]
						},
						{
							type: '自启动权限',
							setting: '【手机管家】->【权限隐私】->【自启动管理】->打开【北谷租赁管家】开关',
							imgs: [
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/oppo/oppo4.jpg?versionId=CAEQIBiBgICA2PDAhxgiIGQxZDYxYWM0YzUzNTQ2YmZhYmRiNjQzOGJlMGVlMGNj',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/oppo/oppo5.jpg?versionId=CAEQIBiBgIDq1_DAhxgiIDZlOGIwNjYxNzIxNTQ0ZWNiYzk3MjY4MGJiN2I0MTY1',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/oppo/oppo6.jpg?versionId=CAEQIBiBgMDy1_DAhxgiIGIzNzQzNTc2NzA2MTRjZTI4MTU2ZTFkYjljMjI0ZGMz',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/oppo/oppo7.jpg?versionId=CAEQIBiBgIDl1_DAhxgiIDQ2Y2MxMjA5ZTI5MjQ1NzI4ZTBlMDM1MjVjZmM2ZmQ4',
						
							]
						}]
					},
					{
						label: 'vivo手机配置',
						value: 'vivo',
						content: [{
							type: '自启动权限设置',
							setting: '【i管家】->【应用管理】->【权限管理】->【自启动】->打开【北谷租赁管家】开关',
							imgs: [
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/vivo/vivo1.png?versionId=CAEQIBiBgICH5_TAhxgiIDFlMjdlMTFmMDNjZjQ2ODlhNzhjZWRjODA4Zjk2NTIy',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/vivo/vivo2.png?versionId=CAEQIBiBgICD5_TAhxgiIDMwZTE5NzBhM2FmNjRhMTFhNTAxNTMwMGVmNzUzMTli',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/vivo/vivo3.png?versionId=CAEQIBiBgMDy5vTAhxgiIDgyNWFmNjgyZDE3NzRjODY5YWY5ZmFkOTA3ZWU1ODc2',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/vivo/vivo4.png?versionId=CAEQIBiBgMCH5_TAhxgiIDBjN2ViZDNhODFhMzQ2YzE4ZmI1NjAwMzE3ZDQ3MDMw',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/vivo/vivo5.png?versionId=CAEQIBiBgICG5_TAhxgiIDgxNjAxMjQzMTA5ZDRlZGViYTg1ODg1MmNiNDJkZGY2',

							]
						}]
					},
					{
						label: '三星手机配置(Galaxy C8)',
						value: 'samsung',
						content: [{
							type: '自启动权限设置',
							setting: '【智能管理】->【自动运行应用程序】->打开【北谷租赁管家】开关',
							imgs: [
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/samsung/samsung1.png?versionId=CAEQIBiBgMDk6_fAhxgiIDI0ZWEwYWJkMmViMTRhNzlhMDNjMmU1OGU3Nzg5ZGYw',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/samsung/samsung2.png?versionId=CAEQIBiBgID46_fAhxgiIGUwYzFhOWRmNGJkODQ2NzA4ZWU2MThiMjQ2Mjg1Zjky',
								'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/samsung/samsung3.png?versionId=CAEQIBiBgIDK6_fAhxgiIDRiYzk1NDdhMThiYzRmMjg4ZTE2ZDcxOTFhNjlmZjY0',
					
							]
						}]
					}
				],
				phoneData: {
					label: '华为手机配置',
					value: 'huawei',
					content: [{
						type: '后台运行权限设置',
						setting: '【设置】->【应用】->【应用启动管理】->打开【北谷租赁管家】开关',
						imgs: [
							'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/huawei/huawei1.png?versionId=CAEQIBiBgMCi197AhxgiIDBlYjk2NTkxN2FkYjQ4YzhiNWU1YWJjZjY1NWE5YmI3',
							'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/huawei/huawei2.png?versionId=CAEQIBiBgMCd197AhxgiIDRkMTk2NmRmM2MzMzRiZGVhZjM5OWVjZjA0YjBhNjgy',
							'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/huawei/huawei3.png?versionId=CAEQIBiBgICb197AhxgiIGU3MTNiNjUyNzNmYzRlZTQ4ODU0OWFhZDY2NGNmMzg0',
							'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/huawei/huawei4.png?versionId=CAEQIBiBgICy197AhxgiIDBjYzA5NTY3OTJkZDQ5Nzk5Y2IyMTNkZTllZWFlMWIx',
							// 'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/help/huawei/huawei5.png?versionId=CAEQIBiBgICs197AhxgiIDE0N2I0YTJhZTAyYzRlZWM4NTY1NjhlYjdiNWViMWVl',
						]
					}]
				},
				type: "huawei"
			}
		},
		onLoad(options) {
			console.log("================" + options.type)
			this.type = options.type
			this.phoneData = this.phoneList.find(o => {
				return o.value === this.type
			})
		},
		methods: {
			goTo(item) {
				uni.navigateTo({
					url: './phone-setting?item=?' + decodeURIComponent(JSON.stringify(item))
				})
			}
		}

	}
</script>

<style lang="scss" scoped>
	.content {
		background-color: #FFFFFF;
		width: 100%;
		height: 100%;
	}

	.item-content {
		padding: 4px 8px;
		color: $uni-text-color;
		font-weight: bold;
		font-size: $uni-font-size-base;
	}

	.item-name {
		padding: 4px 8px;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.img-content {
		width: 50%;
		height: 400px;
	}

	.img-view {
		width: 100%;
		height: 400px;
	}

	.img-container {
		width: 100%;
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		align-items: flex-start;

	}
</style>
