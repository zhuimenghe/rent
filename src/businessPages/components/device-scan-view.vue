<template>
	<view>
		<i class="iconfont iconzl--saoma" :style="{color:color,'font-size':fontSize}" @click="scanCode"></i>
		<view class="pop-container">
			<uni-popup ref="choosePop" type="center" :mask-click="true">
				<view class="uni-tip">
					<view class="tip-title">查询到符合类型的订单，请选择</view>
					<view>
						<view v-for="(order,index) in conformList" :key='index' v-if="(index >=(curPage-1)*size)&&index < (curPage*size)"
						 @click="chooseItem(order)">
							<view class="item-content">
								<text class="tag-view tag1">{{ order.typeName || '' }}</text>
								<text class="tag-view tag2">{{ order.heightName || '' }}</text>
								<text class="tag-view tag4">{{ order.settlementTypeName || '' }}</text>
								<text class="tag-view tag4" v-if="order.settlementType != '4'&&order.settlementType != '6'">¥ {{ order.hire || '' }}/{{getType(order)}}</text>
								<text class="tag-view tag4" v-if="order.settlementType === '4' || order.settlementType === '6'">¥ {{ order.hire || '' }}/天
									{{ order.hireMonthly || '' }}/月</text>
							</view>
						</view>
					</view>

					<view class="uni-tip-group-button" v-if="conformList&&conformList.length>size">
						<text class="uni-tip-button " :class="curPage > 1?'pop-confirm':'pop-cancel'" @click="flipPage('pre')">上一页</text>
						<text class="uni-tip-button " :class="curPage * size < conformList.length?'pop-confirm':'pop-cancel'" @click="flipPage('next')">下一页</text>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
	export default {
		name: 'scanView',
		components: {
			uniPopup
		},
		props: {
			color: {
				type: String,
				default: '#E60000'
			},
			fontSize: {
				type: String,
				default: '24px'
			},
			orderList: {
				type: Array,
				default () {
					return []
				}
			},
			bussinessType: {
				type: String,
				default: 'workIn'
			},
			//进场-启用时间
			compareTime: {
				type: String,
				default: ''
			},
			workCheckResults: {
				type: Array,
				default () {
					return []
				}
			},
			machines: {
				type: Array,
				default () {
					return []
				}
			},
			businessNo: {
				type: String,
				default: ''
			},
			contractNo: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				checkList: [], //检修项列表
				conformList: [], //符合设备的订单
				curPage: 1, //页数
				size: 5,
				device: {}
			}
		},
		created() {
			this.getCheckList()
			uni.$on('complete-add', obj => {
				this.showModal('添加成功')
			})

		},
		destroyed() {
			uni.$off('complete-add')
		},
		methods: {
			getType(item) {
				if (item.settlementType === '1') {
					return '天'
				} else if (item.settlementType === '5') {
					return '周'
				} else {
					return '月'
				}

			},
			//翻页
			flipPage(type) {
				switch (type) {
					case 'pre':
						if (this.curPage > 1) {
							this.curPage = this.curPage - 1
						}

						break;
					case 'next':
						if (this.curPage * this.size < this.conformList.length) {
							this.curPage = this.curPage + 1
						}

						break;
					default:
						break;
				}
			},
			showModal(msg) {
				uni.showModal({
					title: '提示',
					content: msg,
					confirmText: '继续扫码',
					success: res => {
						if (res.cancel) {} else {
							this.scanCode()
						}
					}
				});
			},
			getDate(time) {
				if (!time) return '';
				return time.split(/\s+/)[0];
			},
			scanCode() {
				if (!this.compareTime) {
					uni.showToast({
						icon: 'none',
						title: this.bussinessType == 'workIn' ? "请选择启用时间" : "请选择结算时间"
					})
					return
				}
				uni.scanCode({
					success: (res) => {
						let codeResult = res.result;
						let licenseId = this.$datestr.getQueryString('licenseId', codeResult);
						//是否已添加当前设备
						let isRepeat = false
						if (this.bussinessType == 'workIn') {
							if (this.orderList) {
								this.orderList.forEach(o => {
									if (o.machineList.some(x => x.licenseId == licenseId)) {
										isRepeat = true
										return
									}
								})

							}

						}
						if (this.bussinessType == 'workOut') {
							if (this.machines && this.machines.some(x => x.licenseId == licenseId)) {
								isRepeat = true
							}
						}
						if (isRepeat) {
							this.showModal('当前设备已添加')
							return
						}
						if (this.bussinessType == 'workIn') {
							this.getWorkInDeviceData(licenseId)
						} else if (this.bussinessType == 'workOut') {
							this.getWorkOutDevice(licenseId)
						}

					},
					fail: () => {

					}
				});
			},
			getWorkInDeviceData(licenseId) {
				let param = {
					current: 1,
					size: 10,
					state: 1, //1是待租  2是在租
					keyword: licenseId
				};
				this.$network
					.getData(this.$url.WORK_IN_CARCHOOSE_NEW, 'POST', param)
					.then(result => {
						//由于以上数据为车号自喷吗模糊查询，找到当前扫码的车辆
						let device = result.records.find(o => o.licenseId == licenseId);
						if (device) {
							//合同号部位null
							if (device.contractNo) {
								this.showModal('当前设备在其他合同中，不可进场')

							} else {
								if (device.lastWorkOutDate && this.$datestr.timedifferent(this.getDate(this.compareTime), this.getDate(device.lastWorkOutDate)) !==
									1) {
									this.showModal('设备启用时间必须晚于上次退场时间' + this.getDate(device.lastWorkOutDate))

								} else { //处理数据
									device = {
										...device,
										workCheckResults: this.checkList
									}
									this.dealScanDevice(this.orderList, this.machines, device)
								}
							}
						} else {
							this.showModal('当前设备不可进场，请确认设备是否在其他业务中')
						}

					})
					.catch(err => {});
			},

			getWorkOutDevice(licenseId) {
				let param = {
					"workOutNo": this.businessNo,
					"contractNo": this.contractNo
				}
				this.$network
					.getData(this.$url.WORKED_MACHINE_LIST_BY_CONTRACT, 'GET', param)
					.then(result => {
						console.log(result,'getWorkOutDevice');
						if (result && result.some(o => o.licenseId == licenseId)) { //判断设备是否可以退场
							let device = result.find(o => o.licenseId == licenseId);

							//处理当前显示出来的orderList,进行匹配
							let showOrderList = this.orderList.filter(item => {
								return this.getOverNum(item) > 0 && item.usedNum > 0
							})
							if (showOrderList.some(o => o.id == device.contractOrderId)) { //判断可退场设备是否在当前退场单的订单里
								if (!(device.workInDate && this.$datestr.timedifferent(this.getDate(this.compareTime), this.getDate(device.workInDate)) !=
										-1)) {
									this.showModal('设备结算时间不得早于进场时间' + this.getDate(device.workInDate))

								} else { //处理数据
									device = {
										...device,
										workCheckResults: this.checkList
									}
									let machineList = this.machines ? this.machines : [];
									machineList.push(device)
									//进场处理machines
									this.$emit('setScanMachines', machineList)
								}
							} else {
								this.showModal('该设备不在本次退场设备类型列表')
							}

						} else {
							this.showModal('当前设备不在当前合同下或处于不可退场状态')
						}

					})
					.catch(err => {

					});
			},


			/**
			 * 将扫码车辆添加到对应的orderList的item
			 * @param {Object} orderList 合同订单
			 * @param {Object} macines 需要处理的数组
			 * @param {Object} scanDevice 扫码得到的车辆信息
			 */
			dealScanDevice(orderList, machines, scanDevice) {
				let machineList = machines ? machines : []
				//过滤可以进场的订单
				let showOrderList = orderList.filter(o => parseInt(o.usedNum) > 0)
				//扫码车辆可以匹配到通类型和高度的车辆
				let filterList = showOrderList.filter(o => o.type == scanDevice.type && o.height ==
					scanDevice.machineHeight)
				if (filterList.length == 1) { //只查询出来一个符合类型的订单
					orderList = orderList.map(o => {
						if (o.type == scanDevice.type && o.height == scanDevice.machineHeight) {
							o.machineList.push(scanDevice)
						}
						return o
					})
					//进场处理order
					this.$emit('setScanMachines', orderList)

				} else if (filterList.length > 1) { //查詢多个符合类型高度且不同租金的订单
					this.device = scanDevice
					this.conformList = filterList;
					this.$refs.choosePop.open()

				} else {
					if (showOrderList.some(o => o.type == scanDevice.type)) {

						let deviceHeight = Number(scanDevice.machineHeightName.replace(/米/, ''))
						let replaceList = []
						//扫码设备可替换订单中所有小于扫码设备高度的设备
						showOrderList.forEach(o => {
							let orderHeight = Number(o.heightName.replace(/米/, ''))
							if (o.type == scanDevice.type && orderHeight < deviceHeight) {
								replaceList.push(o)
							}
						})
						if (replaceList.length > 0) {
							this.device = scanDevice
							this.conformList = replaceList;
							this.$refs.choosePop.open()
						} else {
							this.showModal('当前设备高度低于进场约定高度，不可进场')
						}


					} else {
						this.showModal('当前设备类型不匹配，不可进场')
					}
				}

			},
			getOverNum(item) {
				if (item.workInNum > 0) {
					return item.workInNum - item.actualNum - item.applyNum;
				}
				return 0;
			},
			//选择订单
			chooseItem(order) {
				let orderList = this.orderList.map(o => {
					if (o.id == order.id) {
						o.machineList.push(this.device)
					}
					return o
				})
				this.$refs.choosePop.close()
				this.curPage = 1
				//进场处理order
				this.$emit('setScanMachines', orderList)
			},
			//获取点检项
			getCheckList() {
				let param = {
					type: 'work'
				};
				this.$network
					.getData(this.$url.GET_CHECK_LISWT, 'GET', param)
					.then(result => {
						this.checkList = result ?
							result.map(o => {
								return {
									id: o.id,
									content: o.content,
									checked: true
								};
							}) : [];
					})
					.catch(err => {});
			},


		}

	}
</script>

<style lang="scss" scoped>
	.pop-container {
		position: relative;
		z-index: 999;
	}

	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding: 15px;
		width: 300px;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		border-radius: 4px;
	}

	.tip-title {
		width: 100%;
		text-align: center;
		padding: 10px;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		font-weight: bold;
		border-bottom: 1px solid $uni-bg-color-grey;
	}

	.item-content {
		border-bottom: 1px solid $uni-bg-color-grey;
		display: flex;
		flex-direction: row;
		padding: 8px 0px;
	}

	.tag-view {
		display: flex;
		flex-direction: row;
		padding: 3px 6px;
		line-height: 16px;
		border-radius: 2px;
		font-size: $uni-font-size-sm;
		justify-content: center;
		align-items: center;
		margin-right: 5px;
		margin-top: 3px;
	}

	.tag1 {
		background: #EEF9E8;
		color: #57C32D;
	}

	.tag2 {
		background: #F9F0FF;
		color: #722ED1;
	}

	.tag3 {
		background: #FFF0E9;
		color: #FB7135;
	}

	.tag4 {
		background: #FFF1F0;
		color: #E60000;
	}

	.tag6 {
		background: #FFF8EE;
		color: #FCA01F;
	}

	.tag5 {
		background: $uni-color-primary;
		color: #FFFFFF;
		margin-left: 10px;
	}



	.uni-tip-group-button {
		display: flex;
		flex-direction: row;
		margin-top: 20px;
	}

	.uni-tip-button {
		flex: 1;
		text-align: center;
		padding: 8px;
		font-size: $uni-font-size-base;
	}

	.pop-cancel {
		margin-right: 8px;
		color: $uni-text-color-gray;
	}

	.pop-confirm {
		margin-right: 8px;
		color: $uni-color-primary;
	}
</style>
