<template>
	<view class="bgclass">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="sum-view-bg" @click="gotoRecord">
			<machineHead :dataDic="dataDic" />
		</view>
		<view class="sum-view-bg" v-for="(item,index) in menus" :key="index" v-if="getTitlePraShow(item)">
			<view class="menu-title-container">
				<i class="iconfont title-icon-view" :class="item.icon" :style="{color:item.color}"></i>
				<view class="title-view">{{item.title}}</view>
			</view>
			<view class="menu-children-container">
				<view class="menu-children-item" v-for="(child,i) in item.children" :key="i"
					@click="gotoFunc(child,item)" v-if="getPraShow(child)">
					<view   class="childern-image" :style="{ background: getbgColorLinear(child), 'box-shadow': getShadow(child) }">
						<i class="iconfont icon-img" :class="child.icon" :style="{color:child.color}"></i>
					</view>
					<view  class="childern-title">{{child.title}}</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {isSanyMachine} from '@/common/util/util.js'
	import machineHead from "@/components/common/common-ui/machine-head.vue";
	export default {
		components: {
			machineHead
		},
		data() {
			return {
				menus: [{
					title: '设备维保',
					icon: 'iconshebeiweihu',
					color: '#222831',
					type: 'machine',
					children: [{
						title: '设备保养',
						icon: 'iconxinzengbaoyang',
						color: '#FFFFFF',
						"backgroundColor": "#AFC9FF,#3F8BFF",
						type: '1',
						urlpath: '/devicePages/maintain/create-maintain?isLocal=1&itemmachine=',
						key: 'vehicleMaintainAdd',
						isSanyMachine:true

					}, {
						title: '设备检修',
						icon: 'iconxinzengjianxiu',
						color: '#FFFFFF',
						"backgroundColor":  "#AFC9FF,#3F8BFF",
						type: '2',
						urlpath: '/devicePages/hostling/create-service?isLocal=1&itemmachine=',
						key: 'checkRepairAdd',
						isSanyMachine:true

					}, {
						title: '设备巡检',
						icon: 'iconxinzengxunjian',
						color: '#FFFFFF',
						"backgroundColor": "#AFC9FF,#3F8BFF",
						type: '3',
						urlpath: '/devicePages/polling/create-polling?isLocal=1&itemmachine=',
						key: 'addInspection',
						isSanyMachine:true

					}, {
						title: '设备维修',
						icon: 'iconxinzengweixiu',
						color: '#FFFFFF',
						"backgroundColor":  "#AFC9FF,#3F8BFF",
						type: '',
						urlpath: '/devicePages/repair/create-repair?isLocal=1&itemmachine=',
						key: 'vehicleServiceAdd',
						isSanyMachine:true

					}, {
						title: '电池管理',
						icon: 'icondianchiguanli1',
						color: '#FFFFFF',
						"backgroundColor":  "#AFC9FF,#3F8BFF",
						type: 'licenseId',
						urlpath: '/devicePages/battery/battery-manage?licenseId=',
						key: 'baterryManage',
						isSanyMachine:true

					}]
				}, {
					title: '合同执行',
					icon: 'iconhetongzhihang',
					color: '#222831',
					type: 'contract',
					children: [{
							title: '服务交机',
							icon: 'iconxinzengjiaoji',
							color: '#FFFFFF',
							"backgroundColor": "#FEA736,#FE7C1E",
							type: 'licenseId',
							urlpath: '/businessPages/service/deliver-machine-add?type=add&licenseId=',
							key: 'serviceDeliverAdd',
						isSanyMachine:true

						}, {
							title: '服务接机',
							icon: 'iconxinzengjieji',
							color: '#FFFFFF',
							"backgroundColor": "#FEA736,#FE7C1E",
							type: 'licenseId',
							urlpath: '/businessPages/service/receive-machine-add?type=add&licenseId=',
							key: 'serviceReceiveAdd',
						isSanyMachine:true

						},
						{
							title: '设备报停',
							icon: 'iconxinzengfuwubaoting',
							color: '#FFFFFF',
							"backgroundColor": "#FEA736,#FE7C1E",
							type: 'itemPause',
							urlpath: '/businessPages/claim/claim-choose-contract?delta=-1&item=',
							key: 'addServicePause',
						isSanyMachine:true

						}, {
							title: '设备索赔',
							icon: 'iconxinzengfuwusuopei',
							color: '#FFFFFF',
							"backgroundColor": "#FEA736,#FE7C1E",
							type: 'itemClaim',
							urlpath: '/businessPages/claim/claim-choose-contract?delta=-2&item=',
							key: 'addServiceClaim',
						isSanyMachine:true
							
						}
					]
				}, {
					title: '其他操作',
					icon: 'iconqita',
					color: '#222831',
					type: 'other',
					children: [{
						title: '设备控制',
						icon: 'iconshebeikongzhi',
						color: '#FFFFFF',
						"backgroundColor": "#AFC9FF,#3F8BFF",
						type: 'licenseId',
						urlpath: '/devicePages/control/lock-vehicle?licenseId=',
						key: 'vehicleControl',
						isSanyMachine:true
					}, {
						title: '一键找车',
						icon: 'iconzl--baojing',
						color: '#FFFFFF',
						"backgroundColor": "#AFC9FF,#3F8BFF",
						type: 'pageFind',
						urlpath: '',
						key: 'findMachine',
						isSanyMachine:true
					}, {
						title: '设备监控',
						icon: 'iconshebeijiankong',
						color: '#FFFFFF',
						"backgroundColor": "#AFC9FF,#3F8BFF",
						type: 'licenseIdM',
						urlpath: '/devicePages/monitor/device-monitor-detail?licenseId=',
						key: 'vehicleMonitoring',
						isSanyMachine:true
					}, {
						title: '设备编辑',
						icon: 'iconqianshujilu',
						color: '#FFFFFF',
						"backgroundColor": "#AFC9FF,#3F8BFF",
						type: 'licenseId',
						isSanyMachine:true,
						urlpath: '/devicePages/record/device-record-add?licenseId=',
					}]
				}],
				dataDic: {},
				licenseId:''
			};
		},
		onLoad(option) {
			let licenseId = option.licenseId;
			this.licenseId=option.licenseId
			this.getMachineData(licenseId);
		},
		methods: {
			getTitlePraShow(item) {
				let FuncitemList = item.children;
				let resData = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
				if (resData) {
					let boolList = FuncitemList.map(o => {
						return resData.some(x => x.value === o.key);
					})
					return !boolList.every(e => {
						return e == false
					})
				}
				return true
			},
			getPraShow(item) {
				if(!isSanyMachine(this.licenseId)&&(item.key=='vehicleMonitoring')){
				return false
				}
				let resData = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
				if (resData&&item.key) {
					let isShow = resData.some(x => x.value === item.key);
					return isShow;
				}
				return true
			},
			getbgColorLinear(item) {
				let bgColorstr = item.backgroundColor;
				if (bgColorstr) {
					let arr = bgColorstr.split(',');
					if (arr.length == 2) {
						let fontColor = arr[0];
						let behindColor = arr[1];
						return 'linear-gradient(133deg,' + fontColor + ' 0%,' + behindColor + ' 100%)';
					} else if (arr.length == 1) {
						return arr[0];
					} else {
						return '#3B5AFD';
					}
				} else {
					return '#3B5AFD';
				}
			},
			getShadow(item) {
				let bgColorstr = item.backgroundColor;
				if (bgColorstr) {
					let arr = bgColorstr.split(',');
					if (arr.length == 2) {
						let fontColor = arr[0];
						let behindColor = arr[1];
						return `1px 2px 5px rgba(${this.$datestr.convertHexToRGB(behindColor)},0.42)`;
					} else if (arr.length == 1) {
						return `1px 2px 5px rgba(${this.$datestr.convertHexToRGB(arr[0])},0.42)`;
					} else {
						return `1px 2px 5px rgba(${this.$datestr.convertHexToRGB('#3B5AFD')},0.42)`;
					}
				} else {
					return `1px 2px 5px rgba(${this.$datestr.convertHexToRGB('#3B5AFD')},0.42)`;
				}
			},
			getMachineData(licenseId) {
				uni.showLoading();
				let urlstr = this.$url.MACHINE_RECORD_DETAIL + licenseId;
				this.$network.getData(urlstr, 'GET', null).then(result => {
					this.dataDic = result ? result : {};
					console.log(this.dataDic,'this.dataDic');
					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
				});
			},
			gotoRecord() {
				let urlstr = '/devicePages/record/device-record-detail?licenseId=' + this.dataDic.licenseId;
				uni.navigateTo({
					url: urlstr
				});
			},
			gotoFunc(item, type) {
				if (type.type == 'machine') {
					//维保
					uni.showLoading();
					if (item.type == 'licenseId') {
						this.nextContractPage(item);
					} else {
						this.nextMachinePage(item);
					}
				} else if (type.type == 'contract') {
					//合同
					this.nextContractPage(item);
				} else if (type.type == 'other') {
					if (item.type == "pageFind") {
						this.checkSupportFindMachine();
					} else {
						this.nextContractPage(item);
					}
				}
			},
			//设备维保
			nextMachinePage(item) {
				if (!item.urlpath || item.urlpath == "") {
					uni.navigateTo({
						url: "./developing"
					})
					uni.hideLoading();
				} else {
					let param = {
						current: 1,
						size: 1,
						keyword: this.dataDic.licenseId,
					}
					let url = this.$url.MACHINE_RECORD
					if (item.type != "") {
						url = url + "?type=" + item.type
					}
					this.$network.getData(url, 'POST', param).then(result => {
						uni.hideLoading();
						let records = result.records;
						if (records.length > 0) {
							let url = item.urlpath + encodeURIComponent(JSON.stringify(records[0]));
							if (item.type != "") {
								let dict = records[0];
								if (!dict.bindRules || dict.bindRules === null) {
									console.log(this.getToastText(item.type));
									console.log(item.type)
									uni.showToast({
										title: this.getToastText(item.type),
										icon: "none"
									})
								} else {
									uni.navigateTo({
										url: url
									})
								}
							} else {
								uni.navigateTo({
									url: url
								})
							}
						}
					}).catch(err => {
						uni.hideLoading();
					});
				}
			},
			//合同执行
			nextContractPage(item) {
				if (!item.urlpath || item.urlpath == "") {
					uni.navigateTo({
						url: "./developing"
					})
					uni.hideLoading();
				} else {
					let url = "";
					if (item.type == 'item') {
						url = item.urlpath + encodeURIComponent(JSON.stringify(this.dataDic));
						uni.navigateTo({
							url: url
						})
					} else if (item.type == 'licenseId') {
						url = item.urlpath + this.dataDic.licenseId;
						uni.navigateTo({
							url: url
						})
					}else if (item.type == 'licenseIdM') {
						if(this.dataDic.deviceNum){
							url = item.urlpath + this.dataDic.licenseId;
							uni.navigateTo({
								url: url
							})
						}else{
							uni.showToast({
								icon:'none',
								title:'该设备未安装GPS'
							})
						}
					} else {
						url = item.urlpath + encodeURIComponent(JSON.stringify(this.dataDic));
						uni.showLoading();
						let param = {
							current: this.page,
							size: 1,
							licenseId: this.dataDic.licenseId,
							state: "6,7,8"
						};
						this.$network.getData(this.$url.SEARCH_MACHINECONTRACT_CLAIM, 'POST', param).then(result => {
							let list = result.records;
							if (list.length == 0) {
								uni.showToast({
									icon: 'none',
									title: '该设备暂未关联合同'
								})
								return
							} else {
								uni.navigateTo({
									url: url
								})
							}
							uni.hideLoading();
						}).catch(err => {
							uni.hideLoading();
						});
					}
				}
			},
			//一键找车
			checkSupportFindMachine() {
				uni.showLoading()
				this.$network.getData(this.$url.CHECK_SUPPORT_FIND_MACHINE.replace(/{keyWord}/, this.dataDic.licenseId),
					'GET').then(result => { //查找到车后返回车号
					if (result) {
						uni.showModal({
							title: '提示',
							content: "确定发出找车指令",
							confirmText: '确定',
							success: res => {
								if (res.cancel) {} else {
									this.findMachine(result)
								}
							}
						});
					}
				}).catch(err => {
					uni.showToast({
						icon: "none",
						title: err.details ? err.details[0] : err.message
					})
				});
			},
			findMachine(licenseId) {
				this.$network.getData(this.$url.FIND_MACHINE.replace(/{licenseId}/, licenseId), 'GET').then(result => {
					uni.showToast({
						icon: "none",
						title: '发送成功'
					})
				}).catch(err => {
					uni.showToast({
						icon: "none",
						title: err.details ? err.details[0] : err.message
					})
				});
			},
			//锁车
			//枚举文本
			getToastText(type) {
				let str = ""
				switch (type) {
					case '1':
						str = "请先绑定保养规则后再进行保养"
						break;
					case '2':
						str = "请先绑定检修规则后再进行检修"
						break;
					case '3':
						str = "请先绑定巡检规则后再进行巡检"
						break;
					default:
						break;
				}
				return str
			}
		}
	};
</script>

<style lang="scss" scoped>
	.bgclass {
		width: 100%;
		background-color: $uni-bg-color-grey;
		padding-bottom: 10px;
		overflow-y: hidden;
	}

	.sum-view-bg {
		display: flex;
		flex-direction: column;
		margin: 10px 10px 0px 10px;
		padding: 10px;
		background: #ffffff;
		border-radius: 10px;
	}

	//item
	.menu-title-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		padding: 8rpx 16rpx;
	}

	.title-icon-view {
		font-size: $uni-font-size-base;
		text-align: center;
		color: #222831;
	}

	.title-view {
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		font-weight: bold;
		margin-left: 16rpx;
	}

	.menu-children-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 25%;
		justify-content: center;
	}

	.menu-children-container {
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		align-items: flex-start;
		background-color: #ffffff;
		margin-top: 10rpx;
	}

	.childern-image {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #e9e9e9;
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
	}

	.icon-img {
		text-align: center;
		color: $uni-color-primary;
		font-size: 50rpx;
	}

	.childern-title {
		font-size: $uni-font-size-base;
		margin-top: 10rpx;
		margin-bottom: 20rpx;
		color: $uni-text-color;
	}
</style>
