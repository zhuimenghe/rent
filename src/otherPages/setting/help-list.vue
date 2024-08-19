<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="introduce-view">{{helpData.introduce}}</view>
		<view v-for="(item,index) in helpData.phoneList" :key="index">
			<view class="item-content" @click="goTo(item)">{{item.label}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				helpData:{
					introduce:"部分手机系统会关闭后台运行权限或自启动权限，导致用户收不到审批通知或消息提醒。要想正常地收到消息，需要开启应用的保护。由于android手机型号较多，以下列举了华为、红米、小米、魅族、oppo、vivo、三星手机系统的设置方法，其他品牌手机，可以参考这些品牌配置。",
					phoneList:[{
						label:'华为手机配置',
						value:'huawei'
					},
					{
						label:'红米手机配置',
						value:'hongmi'
					},
					{
						label:'小米手机配置',
						value:'xiaomi'
					},
					{
						label:'魅族手机配置',
						value:'meizu'
					},
					{
						label:'oppo手机配置',
						value:'oppo'
					},
					{
						label:'vivo手机配置',
						value:'vivo'
					},
					{
						label:'三星手机配置',
						value:'samsung'
					}]
				}
			}
		},
		methods:{
			goTo(item){
				uni.navigateTo({
					url:'./phone-setting?type='+item.value
				})
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.content{
		background-color: #FFFFFF;
		width: 100%;
		height: 100%;
	}
	.introduce-view{
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		padding:16px 8px ;
	}
	.item-content{
		padding: 4px 8px;
		color: #007AFF;
		font-size: $uni-font-size-base;
		text-decoration: underline;
	}
	
</style>
