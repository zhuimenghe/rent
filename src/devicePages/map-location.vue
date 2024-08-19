<template>
	<view class="map-container">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="m-box">
			<map class="mapstyle" id="myMap" scale="15" show-location="true" :latitude="centerLatitude" :longitude="centerLongitude" :markers="point">
				<!-- <cover-image class="address-icon" src="/static/zl-zb.png"></cover-image> -->
			</map>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				centerLatitude: 0,
				centerLongitude: 0,
				mapCtx: '',
				curAddress: "",
				point:[{
					latitude:0,
					longitude:0,
					iconPath:"/static/zl-zb.png",
					callout:{
						content:"",
						fontSize:12,
						display:'ALWAYS',
						textAlign:"left"
					}
				}]
			}
		},
		mounted() {
			let self = this;
			// 使用 wx.createMapContext 获取 map 上下文
			self.mapCtx = uni.createMapContext('myMap', self);
			this.$datestr.printlog("mounted")
		
			// self.mapCtx.getCenterLocation({
			// 	success: function(res) {
			// 		self.centerLatitude = res.latitude;
			// 		self.centerLongitude = res.longitude;
			// 		self.mapCtx.moveToLocation();
			// 		this.$datestr.printlog("successsuccesssuccess")
			// 	},
			// 	fail: function(res) {}
			// })

		},
		methods: {

		},
		onLoad: function(option) {
            let latitude = option.latitude;
			let longitude = option.longitude;
			let address = JSON.parse(decodeURIComponent(option.address));
			let self = this;
			self.centerLatitude = latitude;
			self.centerLongitude = longitude;
			self.point[0].latitude = latitude;
			self.point[0].longitude = longitude;
			self.point[0].callout.content = address;
			// plus.maps.Map.geocode(
			// 	option.address, {},
			// 	function(event) { //成功回調
			// 		// {
			// 		// 	"coord": {
			// 		// 		"longitude": 120.18634,
			// 		// 		"latitude": 36.031364
			// 		// 	},
			// 		// 	"address": "山东省青岛市黄岛区艾利(青岛)包装系统产品有限公司",
			// 		// 	"coordType": ""
			// 		// }
			// 		self.centerLatitude = event.coord.latitude;
			// 		self.centerLongitude = event.coord.longitude;
			// 		self.point[0].latitude =event.coord.latitude;
			// 		self.point[0].longitude =event.coord.longitude;
			// 		self.point[0].callout.content =event.address;
			// 		this.$datestr.printlog(JSON.stringify(self.point));
			// 		// return event.address;
			// 	},
			// 	function(e) { //失敗回調
			// 		// return "";
			// 	}
			// );


		}
	}
</script>

<style>
	.map-container {
		width: 100%;
		height: 100vh;
	}
	.mapstyle{
		width: 100%;
		height: 100%;
	}

	.m-box {
		width: 100%;
		height: 100%;
		position: relative;
	}

	#myMap {
		width: 100%;
		height: 100%;
	}

	.address-icon {
		font-family: 'iconfont';
		width: 38rpx;
		height: 40rpx;
		position: absolute;
		top: calc(50% - 40rpx);
		left: 50%;
		z-index: 200000;
		margin-bottom: -20upx;
		margin-left: -20upx;
		color: #E60000;
	}
</style>
