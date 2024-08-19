<template>
	<view class="map-container">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="buttons" @onNavBarButtonTap="onNavBarButtonTap">选择地点</c-nav-bar-btns>
		<view class="m-box">
			<map id="myMap" class="map-view" scale="15" :circles="circles" @regionchange="regionchange" show-location="true"
			 :latitude="centerLatitude" :longitude="centerLongitude">
				<cover-image class="address-icon" :src="'/static/zl-zb.png'"></cover-image>
			</map>
		</view>
		<view class="setting">
			<view>当前位置：{{ curAddress }}</view>
			<view class="choose-wl" v-if="isshow">选择电子围栏半径：</view>
			<radio-group class="uni-list" @change="radioChange" v-if="isshow">
				<label class="radio">
					<radio value="" color="#E60000" checked="true" />
					无围栏
				</label>
				<label class="radio">
					<radio value="100" color="#E60000"/>
					100m
				</label>
				<label class="radio">
					<radio value="500" color="#E60000"/>
					500m
				</label>
				<label class="radio">
					<radio value="1000" color="#E60000"/>
					1000m
				</label>
			</radio-group>
			<button class="choose-btn" @click="confirmChoose()">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				"buttons": [
						{
								"text": "搜索",
								"type": "none",
								"fontSize": "14px",
								"color": "#E60000",
								"width": "auto"
						}
				],
				centerLatitude: 0,
				centerLongitude: 0,
				currentPoint: {},
				currentRadius: 0,
				circles: [],
				mapCtx: '',
				curAddress: '',
				isshow: false,
				typestr:''
			};
		},
		onLoad: function(option) {
			if (option.showfence === 'true') {
				this.isshow = true;
			}
			if(option.type){
				this.typestr = option.type
			}
			let args = JSON.parse(option.deliveryAddress);
			this.centerLatitude = Number(args.latitude || '0');
			this.centerLongitude = Number(args.longitude || '0');
			this.curAddress = args.address || '';
			this.currentRadius = Number(args.currentRadius || '0');
			uni.$on('getaddressWithSearch', (res) => {
				let addDic = res.item;
				let location = addDic.location;
				let listlocation = location.split(',')
				if (listlocation.length === 2) {
					this.curAddress = addDic.name
					this.currentPoint = {
						latitude: Number(listlocation[1]),
						longitude: Number(listlocation[0])
					}
					this.centerLatitude = Number(listlocation[1]);
					this.centerLongitude = Number(listlocation[0]);
				}
			})
		},
		onUnload() {
			uni.$off('getaddressWithSearch')
		},
		mounted() {
			let self = this;
			// 使用 wx.createMapContext 获取 map 上下文
			self.mapCtx = uni.createMapContext('myMap', self);
			if (this.curAddress == '' || self.centerLatitude == '' || self.centerLongitude == '') {
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						self.currentPoint = {
							latitude: res.latitude,
							longitude: res.longitude
						};
						self.centerLatitude = res.latitude;
						self.centerLongitude = res.longitude;
					}
				});
			} else {
				self.currentPoint = {
					latitude: this.centerLatitude,
					longitude: this.centerLongitude
				};
				self.drawCircle(this.currentRadius);
			}
		},
		methods: {
			onNavBarButtonTap() {
				uni.navigateTo({
					url: "./map-search"
				});
			},
			// getFileLocalPath(fileName) {
			// 	// #ifdef APP-PLUS
			// 	if (uni.getSystemInfoSync().platform === 'android') {
			// 		return "file:/" + plus.io.convertLocalFileSystemURL("_www" + fileName);
			// 	} else {
			// 		return "../../.." + fileName
			// 	}
			// 	// #endif
			// },
			// 改变视野时改变经纬度
			regionchange(e) {
				let vm = this;
				vm.circles = [];
				vm.mapCtx.getCenterLocation({
					type: 'gcj02',
					success: function(res) {
						vm.currentPoint = {
							latitude: res.latitude,
							longitude: res.longitude
						}
						setTimeout(function() {
							vm.pointToAddress(res.latitude, res.longitude);
						}, 100);
						vm.drawCircle(vm.currentRadius);
					},
					fail: function(res) {}
				}); //获取当前地图的中心经纬度

			},
			radioChange(e) {
				let vm = this;
				vm.currentRadius = e.detail.value;
				vm.drawCircle(vm.currentRadius);
			},
			drawCircle(currentRadius) {
				let vm = this;
				vm.circles = [{
					latitude: vm.currentPoint.latitude,
					longitude: vm.currentPoint.longitude,
					color: '#ffffff',
					fillColor: '#E6000022',
					radius: currentRadius,
					strokeWidth: 1
				}];
			},
			confirmChoose() {
				let deliveryAddress = {
					address: this.curAddress,
					latitude: this.currentPoint.latitude,
					longitude: this.currentPoint.longitude,
					currentRadius: this.currentRadius
				};
				uni.$emit("choose-address", {
					data: deliveryAddress,
					type:this.typestr
				});
				console.log(deliveryAddress,this.typestr,'deliveryAddress');
				uni.navigateBack({
					delta: 1
				});
			},
			//将坐标点转换为地理位置信息。
			async pointToAddress(latitude, longitude) {
				this.curAddress = await this.$gxfmethod.pointToAddress(latitude, longitude);
				console.log(this.curAddress,'------')
			}
		}
	};
</script>

<style lang="scss" scoped>
	.map-container {
		width: 100%;
		height: 100vh;
		@include flex(column);
	}

	.m-box {
		width: 100%;
		flex:1;
		overflow: hidden;
		position: relative;
	}

	.map-view {
		width: 100%;
		height: 100%;
	}

	#myMap {
		width: 100%;
		height: 100%;
	}

	.address-icon {
		width: 38rpx;
		height: 40rpx;
		position: absolute;
		top: calc(50% - 40rpx);
		left: 50%;
		margin-bottom: -20upx;
		margin-left: -20upx;
		color: #E60000;
		z-index: 888;
	}

	.setting {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
	}

	.choose-wl {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		color: #666;
		font-size: 22rpx;
	}

	.uni-list {
		width: 100%;
		height: 100rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.radio {
		width: 25%;
		height: 48rpx;
		color: #808080;
		line-height: 48rpx;
		font-size: 22rpx;
	}

	.choose-btn {
		border: 1px solid #E60000;
		background: #E60000;
		color: #fff;
	}
</style>
