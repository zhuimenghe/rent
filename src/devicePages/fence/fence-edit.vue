<template>
	<view class="map-container">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">编辑围栏</c-nav-bar-btns>
		<view class="m-box">
			<map id="myMap" class="map-view" scale="15"
			:markers="markers"
			:circles="circles" 
			:polyline="polygons" 
			@regionchange="regionchange" show-location="true" 
			:latitude="centerLatitude" 
			:longitude="centerLongitude">
				<cover-image 
				v-show="!ispolygons" 
				class="address-icon" 
				src="/static/zl-zb.png"/>
			</map>
		</view>
		<view class="setting">
			<view class="choose-wl">围栏名称：</view>
			<view class="cell-right-view">
				<input class="input-style" type="text" v-model="fencename" placeholder="请输入围栏名称...." />
			</view>
			<view class="choose-wl">区域：</view>
			<view class="cell-right-view" @click="getarea">
				<input class="input-style" 
				disabled='disabled' 
				type="text" 
				v-model="orgDic.label" 
				placeholder="请选择区域...." />
				<i class="iconfont gray-arrow" 
				:class="righticon"
				:style="{color:'#999999'}"></i>
			</view>
			<view class="choose-wl">围栏类型：</view>
			<radio-group class="uni-list" @change="radioTypeChange">
				<label class="radio">
					<radio value="0" :checked="!ispolygons" disabled="false"/>
					圆形
				</label>
				<label class="radio" v-if="isupdata">
					<radio value="1" :checked="ispolygons" disabled="false"/>
					自定义
				</label>
			</radio-group>
			<view class="choose-wl" v-if="!ispolygons">围栏半径：</view>
			<radio-group class="uni-list" @change="radioChange" v-if="!ispolygons">
				<label class="radio">
					<radio value="200" :checked="currentRadius == '200'" />
					200m
				</label>
				<label class="radio">
					<radio value="500" :checked="currentRadius == '500'"/>
					500m
				</label>
				<label class="radio">
					<radio value="1000" :checked="currentRadius == '1000'"/>
					1000m
				</label>
				<label class="radio">
					<radio value="2000" :checked="currentRadius == '2000'"/>
					2000m
				</label>
			</radio-group>
			<view class="choose-wl"><text>地址：</text></view>
			<view class="cell-right-view"><text>{{ curAddress }}</text></view>
				<view class="cell-right-view" @click='handleBoxChange'>s
					<mycheckbox 
					:checked="isLockCar" 
					class="checkbox" 
					color="#E60000" 
					/>
					超出围栏是否锁车
				</view>

			<button class="choose-btn" @click="confirmChoose()">确定</button>
		</view>
		<w-picker :selectList="selectList" 
		@confirm="onConfirm" 
		mode="selector" 
		ref="selector"
		 themeColor="#E60000" />
	</view>
</template>

<script>
import wPicker from '@/components/common/w-picker/w-picker.vue';
export default {
	components:{
		wPicker
	},
	data() {
		return {
			isLockCar:false,
			navBtns: [
				{
					"text": "搜索",
					"type": "none",
					"fontSize": "14px",
					"color": "#E60000",
					"width": "auto"
				}
			],
			righticon:"iconarrow-right",

			centerLatitude: 0,
			centerLongitude: 0,


			circles: [],
			polygons:[],
			markers:[],
			ispolygons:false,

			mapCtx: '',
			curAddress: '',
			fencename:'',
			currentPoint: {

			},
			currentRadius: "200",
			dataDic:{},
			type:'',
			isupdata:false,

			selectList:[],
			orgDic:{
				label:'',
				value:','
			}
		};
	},
	onLoad: function(option) {
		let updata = option.updata;
		this.type = option.type;
		if(updata == 'true'){
			let args = JSON.parse(option.item);

			this.dataDic = args;
			this.isLockCar=args.isLockCar?true:false;
			this.isupdata = true
			this.currentPoint = {
				latitude:args.latitude,
				longitude:args.longitude
			}
			this.centerLatitude = this.currentPoint.latitude;
			this.centerLongitude = this.currentPoint.longitude;
			this.fencename = args.name;
			this.curAddress = args.address;
			this.orgDic = {
				label:args.orgName,
				value:args.orgId
			}
			if(this.dataDic.pathType == '1'){
				this.ispolygons = true
				this.currentRadius = 0;
				let list= this.dataDic.pathJsonList;
				if(list.length > 0){
					list.push(list[0]);
				}
				this.polygons = [
					{
						points:list,
						color:'#E6000022',
						width:'2px',
					}
				]
				this.markers = [{
					iconPath:"/static/zl-zb.png",
					latitude:this.currentPoint.latitude,
					longitude:this.currentPoint.longitude,
					id:this.dataDic.id
				}]
			}else{
				this.ispolygons = false;
				this.currentRadius = args.radius || '200';
			}
		}else{

			this.isupdata = false;
			this.ispolygons = false;
			this.loadName();
			uni.getStorage({
				key: this.$savekey.USER_INFO_MEG,
				success: res => {
					this.orgDic = {
						label:this.$gxfmethod.getorgName(res.data),
						value:res.data.orgId
					}
				}
			});
		}
		uni.$on('getaddressWithSearch', (res) => {
			console.log(res)
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
		this.loadEareList();
		/*统计*/
		this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"电子围栏","新增");
	},
	onUnload() {
		uni.$off('getaddressWithSearch')
	},
	mounted() {
		let self = this;
		// 使用 wx.createMapContext 获取 map 上下文
		self.mapCtx = uni.createMapContext('myMap', self);
		if (this.curAddress == '') {
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
			self.drawCircle(self.currentRadius);
		}
	},
	methods: {
		handleBoxChange(){
			this.isLockCar=!this.isLockCar
		},
		onNavBarButtonTap() {
			uni.navigateTo({
				url: "/otherPages/map/map-search"
			});
		},
		loadName(){
			let urlstr = this.$url.MACHINE_FENCE_NAME + 'LSWL';
			this.$network
				.getData(urlstr, 'GET', null)
				.then(result => {
					this.fencename = result;
				})
				.catch(err => {
					uni.showToast({
						title:"服务端异常, 请稍后再试",
						icon:"none"
					})
					uni.hideLoading();
				});
		},
		loadEareList(){
			uni.showLoading();
			let urlstr = this.$url.ORG_LIST;
			this.$network
				.getData(urlstr, 'GET', null)
				.then(result => {
					let list = result;
					this.selectList = this.getChildren(list);
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		getChildren(data) {
			let arr = [];
			if (data) {
				data.forEach(o => {
					let a = {
						value: o.id,
						label: o.name
					};
					arr = [...arr, a];
					if (o.children && o.children.length > 0) {
						arr = [...arr, ...this.getChildren(o.children)];
					} 
				});
			}
			return arr;
		},
		// 改变视野时改变经纬度
		regionchange(e) {
			if(this.ispolygons === true){
				return;
			}
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
		//区域
		getarea(){
			this.$refs.selector.show();
		},
		//类型
		radioTypeChange(e){

		},
		//半径
		radioChange(e) {
			if(this.ispolygons === true){
				uni.showToast({
					title:"App端暂不支持编辑自定义围栏",
					icon:"none"
				})
				return;
			}
			let vm = this;
			vm.currentRadius = e.detail.value;
			vm.drawCircle(vm.currentRadius);
		},
		onConfirm: function(val) {
			this.orgDic = val.checkArr;
		},
		drawCircle(currentRadius) {
			let vm = this;
			vm.circles = [
				{
					latitude: vm.currentPoint.latitude,
					longitude: vm.currentPoint.longitude,
					color: '#ffffff',
					fillColor: '#E6000022',
					radius: currentRadius,
					strokeWidth: 1
				}
			];
		},
		confirmChoose() {
			if(!this.fencename){
				return uni.showToast({title:'围栏名称必填',icon:'none'})
			}
			if(this.isupdata === true){
				this.updataFence();
			}else{
				this.creatFence();
			}
		},
		//编辑
		updataFence(){
			let param = {
				id:this.dataDic.id,
				type:this.dataDic.type,
				pathType:this.dataDic.pathType,
				pathJsonDto:this.dataDic.pathType==1?this.dataDic.pathJsonList:undefined,
				name:this.fencename,
				longitude:this.currentPoint.longitude,
				latitude:this.currentPoint.latitude,
				radius:this.dataDic.pathType!=1?this.currentRadius:this.dataDic.radius,
				orgId:this.orgDic.value,
				address:this.curAddress,
				isLockCar:this.isLockCar?1:0
			}
			this.$datestr.printlog(JSON.stringify(param))
			let urlstr = this.$url.MACHINE_FENCE_UPDATA;
			this.$network
				.getData(urlstr, 'PUT', param)
				.then(result => {
					uni.showToast({
						title:"修改成功",
						icon:"none"
					})
					uni.$emit('refresh-fence', {
						type:"temp"
					});
					uni.navigateBack({
						delta:1
					})
				})
				.catch(err => {
					uni.showToast({
						title:"服务端异常, 请稍后再试",
						icon:"none"
					})
					uni.hideLoading();
				});
		},
		//新增
		creatFence(){
			let param = {
				type:this.type,
				pathType:'0',
				name:this.fencename,
				longitude:this.currentPoint.longitude,
				latitude:this.currentPoint.latitude,
				radius:this.currentRadius,
				orgId:this.orgDic.value,
				address:this.curAddress,
				isLockCar:this.isLockCar?1:0
			}
			let urlstr = this.$url.MACHINE_FENCE_UPDATA;
			this.$network
				.getData(urlstr, 'POST', param)
				.then(result => {
					uni.showToast({
						title:"修改成功",
						icon:"none"
					})
					uni.$emit('refresh-fence', {
						type:"temp"
					});
					uni.navigateBack({
						delta:1
					})
				})
				.catch(err => {
					uni.showToast({
						title:"服务端异常, 请稍后再试",
						icon:"none"
					})
					uni.hideLoading();
				});
		},
		//将坐标点转换为地理位置信息。
		async pointToAddress(latitude, longitude) {
			this.curAddress = await this.$gxfmethod.pointToAddress(latitude, longitude);
		}
	}
};
</script>

<style lang="scss" scoped>
.map-container {
	width: 100%;
}

.m-box {
	width: 100%;
	height: 200px;
	position: relative;
}

.map-view {
	width: 100%;
	height: 200px;
}
.gray-arrow {
		margin-right: 16px;
		margin-left: 4px;
	}
.address-icon {
	font-family: 'iconfont';
	width: 38rpx;
	height: 40rpx;
	position: absolute;
	top: calc(50% - 40rpx);
	left: 50%;
	z-index: 999;
	margin-bottom: -20upx;
	margin-left: -20upx;
	color: #E60000;
}

.setting {
	// position: fixed;
	// top: 200px;
	left: 0;
	right: 0;
	bottom: 0px;
	padding: 30rpx;
	box-sizing: border-box;
	overflow: auto;
}

.choose-wl {
	width: 100%;
	height: 20px;
	line-height: 20px;
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
	margin-top: 10px;
}
.cell-right-view {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	margin-left: 15px;
	margin-right: 15px;
	height: 40px;
	font-size: $uni-font-size-base;
	border-width: 1rpx;
	border-color: #EEEEEE;
	border-style: solid;
}
.input-style {
	flex: 1;
	text-align: left;
	font-size: $uni-font-size-base;
}
</style>