<template>
	<view class="content">
		<view class="item-assigner-list">
			<view class="model-tag"><text>已报停设备</text>
				<i class="iconfont iconarrow-right" :class="isShow ? 'translate-arrow' : 'translate-arrow-expend'" @click="isShow=!isShow"></i></view>
			<view v-if="isShow">
				<view v-for="(v,i) in stopedList" :key="i" class="item-container">
					<mycheckbox class="checkbox" :checked="v.checked" color="#E60000" :disabled="true" />
					<view class="v-item">
						<view class="item-top">
							<text>车号：{{v.licenseId}}</text>
							<!-- <text style="margin-right: 8px;">{{v.stateName}}-{{v.subStateName}}</text> -->
							<text style="margin-right: 8px;">{{v.workOutDate?"已退租":"租赁中"}}</text>
						</view>
						<view class="item-row">
							<text>品牌：{{v.machineBrand||'--'}}</text>
							<text>自喷码：{{v.printCode||'-'}}</text>
						</view>
					</view>

				</view>
			</view>

			<view class="model-tag"><text>可报停设备</text><input v-model="searchKey" class="input-style" placeholder="车号或自喷码" /></view>
			<view v-for="(v,i) in list" :key="i" class="item-container" @click="changeCheck(i)">
				<mycheckbox class="checkbox" :checked="v.checked" color="#E60000" :disabled="v.disabled"  />
				<view class="v-item">
					<view class="item-top">
						<text>车号：{{v.licenseId}}</text>
						<!-- <text style="margin-right: 8px;">{{v.stateName}}-{{v.subStateName}}</text> -->
						<text style="margin-right: 8px;">{{v.workOutDate?"已退租":"租赁中"}}</text>	
					</view>
					<view class="item-row">
						<text>品牌：{{v.machineBrand||"--"}}</text>
						<text>自喷码：{{v.printCode||"-"}}</text>
					</view>
				</view>

			</view>

		</view>
		<view class="bottom-view" @click="changeAll">
			<mycheckbox class="checkbox" color="#E60000" :checked="isAllChecked" >全选</mycheckbox>
			<view class="top-right">
				<view class="choosed-view">{{$t('common.choosed')}}：<span>{{chooseAssigners.length}} </span></view>
				<view class="confirm-view" @click="confirm">{{$t('common.confirm')}}</view>
			</view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	export default {
		watch: {
			searchKey(val) {
				if (!val) {
					this.list = [...this.allList];
				} else {
					this.list = []
					this.allList.forEach(o => {
						let is = ((o.licenseId && o.licenseId.indexOf(val.toUpperCase()) !== -1) || (o.printCode && o.printCode.indexOf(
								val.toUpperCase()) !== -1)) ?
							true : false
						if (is) {
							this.list = [...this.list, o]
						}
					})
				}
			}
		},
		data() {
			return {
				list: [],
				stopedList: [],
				searchKey: "",
				isShow: true,
				disCheckedList: [],
				chooseAssigners: [],
				isAllChecked: false,
				deltaX: 1,
				allList: [],
				contract: null,
				isFirst: false
			}
		},
		onLoad(options) {
			this.deltaX = options.delta;
			if (options.choosedList && options.choosedList.length > 0) {
				this.disCheckedList = JSON.parse(options.choosedList);
			}
			let businessNo = options.businessNo ? options.businessNo : '';
			this.contract = options.contract ? JSON.parse(decodeURIComponent(options.contract)) : null;
			this.isFirst = options.isFirst && options.isFirst == 'true' ? true : false;
			this.getMachineList(options.contractNo, businessNo);
		},
		methods: {
			changeCheck(pos) {
				this.list[pos].checked = !this.list[pos].checked;
				this.chooseAssigners = [...this.list.filter(o => {
					return o.checked;
				})];
				this.isAllChecked = !this.list.some(o => !o.checked)
			},
			changeAll(e) {
				this.isAllChecked = !this.isAllChecked;
				if (this.isAllChecked) {
					this.list = this.list.map(o => {
						return {
							...o,
							"checked": this.disCheckedList.some(y => y.licenseId === o.licenseId && (y.workInId && y.workInId === o.workInId)) ?
								o.checked : true
						}
					})
	
				} else {
					this.list = this.list.map(o => {
						return {
							...o,
							"checked": this.disCheckedList.some(y => y.licenseId === o.licenseId && (y.workInId && y.workInId === o.workInId)) ?
								o.checked : false
						}
					})
				}
				this.chooseAssigners = [...this.list.filter(o => {
					return o.checked;
				})];
			},
			/**
			 * 可选择的审批人列表
			 */
			getMachineList(contractNo, businessNo) {
				let param = {
					contractNo: contractNo,
					type: 'pause'
				}
				this.$network
					.getData(this.$url.MACHINE_LIST_BY_CONTRACT, 'GET', param)
					.then(result => {
						this.stopedList = result.filter(o => {
							return o.subState === "24"
						})

						//排除正在报停的车，包括报停单中占用的车
						let arr = result.filter(o => {
							return o.subState !== "24"
						})
						if (businessNo) {
							this.getOrderMachineList(contractNo, businessNo, arr)
						} else {
							this.dealPauseListData(arr)
						}


					})
					.catch(err => {

					});
			},
			//处理报停车辆
			dealPauseListData(list) {
				this.list = list.map(o => {
					return { ...o,
						checked: false,
						disabled: this.disCheckedList.some(y => y.licenseId === o.licenseId && (y.workInId && y.workInId === o.workInId))
					}
				})
				this.allList = [...this.list]
			},
			getOrderMachineList(contractNo, businessNo, arr) {
				let param = {
					businessNo: businessNo
				}
				this.$network
					.getData(this.$url.PAUSE_DETAIL, 'GET', param)
					.then(result => {
						//获取当前报停单中占用的车
						if (result.machines && result.contractNo === contractNo) {
							let newarr = [...result.machines, ...arr];
							this.dealPauseListData(newarr)

						} else {
							this.dealPauseListData(arr)
						}
					})
					.catch(err => {
						this.dealPauseListData(arr)
					});
			},
			getCheckedList() {
				this.allList = this.allList.map(o => {
					return {
						...o,
						"checked": this.list.some(y => y.licenseId === o.licenseId && (y.workInId && y.workInId === o.workInId) && y.checked) ?
							true : o.checked
					}
				})
				console.log(this.allList)
				this.chooseAssigners = [...this.allList.filter(o => {
					return o.checked;
				})];
			},
			confirm() {
				//第一次去新建页面
				if (this.isFirst) {
					let params = {
						contract:this.contract,
						machine:this.chooseAssigners,
						type:'pause'
					}
					uni.navigateBack({
						delta:1,
						complete(){
							uni.$emit('choose-contract-machine',params)
						}
					})
					
				} else {
					uni.$emit("choosedMachines", {
						data: this.chooseAssigners
					})
					uni.navigateBack({
						delta: Number.parseInt(this.deltaX) //此处直接使用变量无效果
					})
				}


			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		background: $uni-bg-color-grey;
		position: relative;
	}

	.model-tag {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-color: $uni-bg-color-grey;
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		padding: 15px;
		align-items: center;
	}

	.input-style {
		background-color: #FFFFFF;
		font-size: $uni-font-size-base;
		border-radius: 4px;
		height: 30px;
		line-height: 30px;
		width: 120px;
		padding: 2px 8px;
	}

	.item-assigner-list {
		margin-bottom: 56px;
	}

	.item-container {
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
		width: 100%;
		margin-bottom: 8px;
		border-radius: 4px;
	}

	.v-item {
		flex: 1;
	}

	.checkbox {
		transform: scale(0.7);
		margin-right: 10px;
		margin-top: 10px;
	}

	.item-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-color: $uni-bg-color-grey;
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		height: 45px;
		line-height: 45px;
	}

	.item-row {
		display: flex;
		flex-direction: row;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		height: 45px;
		line-height: 45px;
	}

	.item-row text {
		flex: 1;
	}

	.top-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		text-align: center;
	}

	.bottom-view {
		position: fixed;
		display: flex;
		left: 0px;
		right: 0px;
		bottom: 0px;
		height: 48px;
		justify-content: space-between;
		flex-direction: row;
		align-items: center;
		background: #FFFFFF;
		z-index: 100;
		box-shadow: 1px 0px 1px $uni-text-color-gray;
	}

	.choosed-view {
		margin-left: 16px;
		margin-right: 16px;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.choosed-view span {
		color: $uni-color-primary;
		font-size: $uni-font-size-lg;
		margin-left: 4px;
	}

	.confirm-view {
		margin-right: 16px;
		font-size: $uni-font-size-base;
		color: #FFFFFF;
		background-color: $uni-color-primary;
		padding: 5px 10px;
		border-radius: 4px;
	}


	.translate-arrow {
		font-size: 16px;
		margin-right: 16px;
		transform: rotate(-90deg);
		transition: all 1s;
	}
	
	.translate-arrow-expend {
		font-size: 16px;
		margin-right: 16px;
		transform: rotate(90deg);
		transition: all 1s;
	}
</style>
