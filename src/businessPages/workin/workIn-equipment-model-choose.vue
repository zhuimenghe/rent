<template>
	<view class="model-container">
		<list class="workin-dd-list">
			<cell class="workin-dd-list-cell" v-for="(item, index) in listData" :key="index">
				<view class="content-view" @click="changeCheck(index)">
					<view class="cell-input-view-list">
						<view class="cell-input-view-list-row">
							<!-- <view class="cell-input-view-left">类型：</view> -->
							<view class="cell-input-view-right">
								{{ item.typeName || '' }}（{{ item.heightName || '' }}）
							</view>
						</view>

					</view>
					<view class="cell-input-view-list">
						<view class="cell-input-view-list-row">
							<view class="cell-input-view-left">待租/全部：</view>
							<view class="cell-input-view-right">
								{{ item.unRentCount || 0 }}/{{ item.totalCount || 0 }}
							</view>
						</view>
						<view class="cell-input-view-list-row">
							<view class="cell-input-view-left">合同约定数量：</view>
							<view class="cell-input-view-right">
								{{ item.orderNum || 0 }}台
							</view>
						</view>
					</view>
					<mycheckbox class="checkbox" :checked="item.checked" color="#E60000" />
				</view>

			</cell>
		</list>
		<view class="bottom-view">
			<view class="choosed-view">目前已选 ：<span>{{ checkedList.length }} </span>个类型</view>
			<view class="top-right">
				<view class="confirm-view" @click="confirm">{{ $t('common.confirm') }}</view>
			</view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
export default {
	name: 'workIn-equipment-model-choose',
	data() {
		return {
			contractDetailId: "",
			contractNo: "",
			checkedList: [], //选中过的数组
			isAllChecked: false,
			listData: [],
			isShowNum: false,
			dataDic: {}
		}
	},
	onLoad(options) {
		console.log(this.listData, 'listData111');
		uni.getStorage({
			key: this.$savekey.CONFIG_INFO,
			success: (res) => {
				let obj = res.data.find(o => o.code === 'work_in_show_used_num')
				if (obj) {
					this.isShowNum = obj.value === 'true' ? true : false
				}
			}
		});
		this.checkedList = JSON.parse(decodeURIComponent(options.checkedList));
		this.contractDetailId = options.contractDetailId
		this.contractNo = options.contractNo;

		this.getWorkInOrderList();
		console.log(options, 'onLoad');
		this.dataDic = JSON.parse(decodeURIComponent(options.dataDic)) || [];
		// this.listData=this.dataDic.orders||[]
		// 默认选中

	},
	methods: {
		//根据合同获取当前未进场的设备
		getWorkInOrderList() {
			uni.showLoading();
			let param = {
				contractDetailId: this.contractDetailId || '',
				contractNo: this.contractNo || ''
			};
			console.log(JSON.stringify(param));
			let url = this.$url.WORK_IN_ORDER_LEFT;
			this.$network
				.getData(url, 'GET', param)
				.then(result => {
					uni.hideLoading();
					console.log(result, 'result111');
					this.listData = result ? result.map(o => {
						return {
							...o,
							machineList: [],//order里带过来的machine不能用
							// this.checkedList && this.checkedList.some(y => y.id === o.id)
							checked: false
						}
					}) : []
					console.log(this.listData, 'listData111');
					this.isAllChecked = !this.listData.some(o => !o.checked)
					if (this.checkedList.length && this.listData.length) {
						for (let i = 0; i < this.listData.length; i++) {
							for (let j = 0; j < this.checkedList.length; j++) {
								if (this.listData[i].id == this.checkedList[j].id) {
									this.listData[i].checked = true
								}
							}
						}
					}
				})
				.catch(err => {
					uni.hideLoading();
				});


		},
		changeCheck(pos) {
			this.listData[pos].checked = !this.listData[pos].checked;
			this.getCheckedList();
			this.isAllChecked = !this.listData.some(o => !o.checked);
			this.$forceUpdate()
		},
		changeAll(e) {
			this.isAllChecked = !this.isAllChecked;
			if (this.isAllChecked) {
				this.listData = this.listData.map(o => {
					return {
						...o,
						"checked": true
					}
				})
				this.getCheckedList();
			} else {
				this.listData = this.listData.map(o => {
					return {
						...o,
						"checked": false
					}
				})
				this.getCheckedList();
			}

		},
		getCheckedList() {
			this.checkedList = [...this.listData.filter(o => {
				return o.checked;
			})];
			console.log(JSON.stringify(this.checkedList))
		},
		confirm() {
			uni.$emit("choosed-orders-model", {
				data: this.checkedList
			})
			uni.navigateBack({
				delta: 1 //此处直接使用变量无效果
			})

		}
	}
}
</script>

<style lang="scss" scoped>
.model-container {
	width: 100%;
	height: 100%;

}

.tag {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border-color: $uni-bg-color-grey;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	color: $uni-text-color;
	padding-left: 15px;
	padding-bottom: 10px;
	font-size: $uni-font-size-base;
	align-items: center;
}

.workin-dd-list {
	display: flex;
	flex-direction: column;
	margin-bottom: 56px;
	margin-top: 6rpx;
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #181818;
}

.workin-dd-list-cell {
	display: flex;
	flex-direction: row;
	margin: 2px 10px;
	border-color: #eeeeee;
	border-width: 1px;
	border-style: solid;
	border-radius: 4px;
	background-color: #FFFFFF;
	align-items: center;
}

.checkbox {
	transform: scale(0.7);
	margin-right: 4px;
	margin-left: 4px;
	position: absolute;
	right: 20rpx;
	top: 20px
}

.content-view {
	flex: 1;
	position: relative;
	padding-bottom: 5px;
}

.cell-input-view-list {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	margin-left: 5px;
	margin-right: 5px;
	font-size: $uni-font-size-base;
}

.cell-input-view-list-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	min-height: 26px;
	flex: 1;
	padding-left: 3px;
}

.cell-input-view-left {
	width: auto;
	white-space: nowrap;
	font-size: $uni-font-size-sm;
	color: $uni-text-color-gray;

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

.top-right {
	display: flex;
	flex-direction: row;
	align-items: center;
	text-align: center;
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
</style>
