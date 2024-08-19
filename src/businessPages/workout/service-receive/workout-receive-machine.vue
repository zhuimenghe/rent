<!-- 交机单列表 -->
<template>
	<view class="content ">
		<view class="filter-view" style="z-index: 600;">
			<view class="line-container ">
				<input v-model="searchKey" class="input-style" placeholder="自喷吗/车号" />
				<view class="more-css" @click="isShowMore = !isShowMore">更多</view>
			</view>
			<view v-if="isShowMore">
				<view class="line-container">
					<view class="select-view"><selectView :value="startDate" hint="开始时间" @clickSelect="showPick('startDate')" /></view>

					<view class="select-view"><selectView :value="endDate" hint="结束时间" @clickSelect="showPick('endDate')" /></view>
				</view>

				<view class="line-container">
					<view class="select-view"><selectView :value="state.label" hint="关联状态" @clickSelect="showPick('state')" /></view>
				</view>
				<view class="line-container">
					<view class="clear btn-all" @click="reset">重置</view>
					<view class="confirm btn-all" @click="query">查询</view>
				</view>
			</view>
		</view>
		<view class="list-container" :style="{ marginBottom: type == 'select' ? '60px' : '0' }">
			<view v-for="(info, index) in dataList" :key="index" @click="gotoInfo(info)">
				<view class="item-container">
					<view class="header">
						<view class="left">
							<view class="date-view">
								<view class="begin-date">{{ info.endDate || '-' }}</view>
								<view class="delivery-user">{{ info.contactName || '-' }}</view>
								<view class="work-state" :style="{ color: info.workState == 0 ? '#E60000' : '#FE931F' }">{{ info.workStateName }}</view>
							</view>
							<view style="width: 100%; display: flex; font-size: 12px; color: #999999; margin-top: 4px;">
								<i v-if="info.deliveryPlace" class="iconfont iconzl--zuobiao" style="color: #E60000; margin-right: 4px;"></i>
								<view v-if="info.deliveryPlace" style="width:calc(100% - 18px); hidden;text-overflow: ellipsis; white-space: nowrap; ">
									{{ info.deliveryPlace }}
								</view>
							</view>
						</view>

						<view class="right"  @click="changeCheckBox(info, index)">
							<mycheckbox :checked="info.checked" class="checkbox"  color="#E60000"></mycheckbox>
						</view>
					</view>
					<view>
						<view v-if="info.dispatchMachines && info.dispatchMachines.length > 0">
							<view class="machine-info">
								<view style="width: calc(100% - 40px);">
									<text style="font-weight: 500; font-size: 14px;">{{ info.dispatchMachines[0].printCode || '-' }}</text>
									<text style="margin-left: 10px; font-size: 12px; color: #999999;">{{ info.dispatchMachines[0].licenseId }}</text>
									<text style="margin-left: 8px; font-size: 12px; color: #999999;">{{ info.dispatchMachines[0].typeName || '-' }}</text>
									<text style="color: #999999; font-size: 12px;">{{ info.dispatchMachines[0].machineHeightName || '-' }}</text>
								</view>

								<view v-if="info.dispatchMachines.length > 1" class="right" style=" display: flex; align-items: center; justify-content: flex-end; width: 40px;">
									<text style="font-size: 12px;  color: #E60000;" v-if="!info.isShowList" @click.stop="infoOpen(info)">展开</text>
									<text style="font-size: 12px; color: #E60000;" v-else @click.stop="infoOpen(info)">折叠</text>
									<i class="iconfont iconarrow-right" :style="{ color: '#E60000' }" v-if="!info.isShowList" @click.stop="infoOpen(info)"></i>
									<i class="iconfont iconarrow-down" :style="{ color: '#E60000' }" v-else @click.stop="infoOpen(info)"></i>
								</view>
							</view>
						</view>
						<view v-if="info.isShowList">
							<view v-for="(machine, i) in info.dispatchMachines" :key="machine.licenseId">
								<view class="machine-info" v-if="i != 0">
									<view>
										<text style="font-weight: 500; font-size: 14px;">{{ machine.printCode || '-' }}</text>
										<text style="margin-left: 10px; font-size: 12px; color: #999999;">{{ machine.licenseId }}</text>
										<text style="margin-left: 8px; font-size: 12px; color: #999999;">{{ machine.typeName || '-' }}</text>
										<text style="color: #999999; font-size: 12px;">{{ machine.machineHeightName || '-' }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view><uni-load-more iconType="auto" :status="status" /></view>
		</view>
		<w-picker 
		mode="date" 
		startYear="2000" 
		endYear="2100" 
		:current="true" 
		@confirm="onConfirm" 
		ref="date" 
		themeColor="#E60000" 
		/>
		<w-picker 
		:selectList="selectList" 
		@confirm="onConfirm" 
		mode="selector" 
		ref="selector" 
		themeColor="#E60000" 
		/>
		<view class="confirm-container">
			<button class="confirm-btn" hover-class="confirm-btn-press" @tap="confirmChoose">{{ $t('common.confirm') }}</button>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import SelectView from '@/components/common/common-ui/selector-view.vue';
var timer;

export default {
	name: 'receive-machine',
	components: {
		uniLoadMore,
		labelArrow,
		wPicker,
		SelectView
	},
	data() {
		return {
			page: 1,
			pageSize: 10,
			status: 'more',
			dataList: [],
			searchKey: null,
			isShowMore: false,
			startDate: null,
			endDate: null,
			salesmanDic: {
				value: null,
				label: '接机联系人'
			},
			state: {
				value: null,
				label: '全部'
			},
			states: [
				{
					value: 0,
					label: '未关联'
				},
				{
					value: 1,
					label: '已关联'
				}
			],
			isShowAdd: true,
			salesmanArr: [],
			selectList: [],
			type: 'list',
			checkList: [],
			selectBills: [],
			contractNo: null
		};
	},
	watch: {
		searchKey: {
			handler(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.refreshheader();
				}, 500);
			}
		}
	},
	onLoad(option) {
		if (option.contractNo) {
			this.contractNo = option.contractNo;
		}
		if (option.selects) {
			this.checkList = JSON.parse(decodeURIComponent(option.selects));
		}
		this.loadMsgList();
		this.getUserLeaders();
	},
	onUnload() {
		uni.$off('update-list');
	},
	onPullDownRefresh() {
		this.page = 1;
		this.dataList = [];
		this.loadMsgList();
	},
	onReachBottom() {
		if (this.status == 'noMore') {
			return;
		}
		this.page += 1;
		this.status = 'loading';
		this.loadMsgList();
	},
	methods: {
		//加载服务人员
		getUserLeaders() {
			let param = {
				showAdmin: false
			};
			this.$network
				.getData(this.$url.USER_LEADERS, 'GET', param)
				.then(result => {
					this.salesmanArr = result.map(o => {
						return {
							label: o.username,
							value: o.id
						};
					});
				})
				.catch(err => {});
		},

		reset() {
			this.searchKey = null;
			this.startDate = null;
			this.endDate = null;
			this.state = {
				label: '全部',
				value: null
			};
			this.salesmanDic = {
				value: null,
				label: '接机联系人'
			};

			this.refreshheader();
		},
		query() {
			this.isShowMore = false;
			this.refreshheader();
		},
		loadMsgList() {
			this.status = 'loading';
			let param = {
				current: this.page,
				size: this.pageSize,
				...(this.startDate
					? {
							beginDate: this.startDate + ' 00:00:00'
					  }
					: {}),
				...(this.endDate
					? {
							endDate: this.endDate + ' 23:59:59'
					  }
					: {}),
				...(this.salesmanDic.value
					? {
							deliveryUser: this.salesmanDic.value
					  }
					: {}),
				...(this.state.value || this.state.value == 0
					? {
							state: this.state.value
					  }
					: {}),
				...(this.searchKey
					? {
							fuzzyParam: this.searchKey
					  }
					: {}),
				...(this.contractNo
					? {
							contractNo: this.contractNo
					  }
					: {})
			};

			console.log(param);

			this.$network
				.getData(this.$url.CONTRACTAPI_DELIVER_FROM_PAGE, 'GET', param)
				.then(result => {
					let list =
						result && result.records
							? result.records.map(o => {
									return {
										...o,
										checked: this.checkList.some(y => y == o.id),
										isShowList: false
									};
							  })
							: [];
					this.dataList = this.dataList.concat(list);

					let pages = result.pages;
					if (pages <= this.page) {
						this.status = 'noMore';
					} else {
						this.status = 'more';
					}
					uni.stopPullDownRefresh();
				})
				.catch(err => {
					this.status = 'noMore';
					uni.stopPullDownRefresh();
				});
		},
		showPick(type) {
			this.pickType = type;
			switch (this.pickType) {
				case 'startDate':
					this.$refs.date.show();
					break;
				case 'endDate':
					this.$refs.date.show();
					break;
				case 'read':
					this.selectList = this.readList;
					this.$refs.selector.show();
					break;
				case 'state':
					this.selectList = this.states;
					this.$refs.selector.show();
					break;
				case 'ssn':
					this.selectList = this.salesmanArr;
					this.$refs.selector.show();
					break;
				default:
					break;
			}
		},
		onConfirm(val) {
			console.log('onConfirm' + this.pickType + val);
			switch (this.pickType) {
				case 'read':
					this.readTag = val.checkArr;
					break;
				case 'state':
					this.state = val.checkArr;
					break;
				case 'startDate':
					this.startDate = val.result;
					break;
				case 'endDate':
					this.endDate = val.result;
					break;
				case 'ssn':
					this.salesmanDic = val.checkArr;
					break;
				default:
					break;
			}
		},
		initData() {
			this.childTypeObj = {};
			this.searchKey = '';
			this.state = {
				label: '全部',
				value: null
			};
			this.salesmanDic = {
				value: '',
				label: '接机联系人'
			};
		},
		refreshheader() {
			this.page = 1;
			this.dataList = [];
			this.ids = [];
			this.loadMsgList();
		},
		refreshhfooter() {
			if (this.status == 'noMore') {
				return;
			}
			this.page += 1;
			this.loadMsgList();
			this.states = 'loading';
		},
		gotoInfo(info) {
			// uni.navigateTo({
			// 	url: "/businessPages/service/receive-machine-add?type=detail&businessNo=" + info.businessNo
			// });
		},
		changeCheckBox(e, i) {
			e.checked = !e.checked;
			this.checkList = [];
			this.dataList.forEach(o=>{
				if(o.checked){
					this.checkList.push(o.id);
				}
			})
		},
		confirmChoose() {
			let selectList = [];
			this.dataList.forEach(o=>{
				if(o.checked){
					selectList.push(o);
				}
			})
			uni.$emit('choose-correlation', selectList);
			uni.navigateBack({
				delta: 1
			});
		},
		goToAdd() {
			uni.navigateTo({
				url: '/businessPages/service/receive-machine-add?type=add'
			});
		},
		infoOpen(info) {
			info.isShowList = !info.isShowList;
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	width: 100%;
	background-color: $uni-bg-color-grey;
}

.filter-view {
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	padding: 4px 8px;
	box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
	position: fixed;
	top: 0px;
	left: 0px;
	width: calc(100% - 16px);
}

.line-container {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
	margin-top: 4px;
	flex: 1;
}

.select-view {
	flex: 1;
}

.input-style {
	background-color: #F7F7F7;
	font-size: $uni-font-size-base;
	border-radius: 4px;
	height: 35px;
	flex: 1;
	line-height: 35px;
	padding: 0px 8px;
	margin-right: 8px;
	margin-left: 4px;
}

.btn {
	color: #ffffff;
	background-color: $uni-color-primary;
	font-size: $uni-font-size-base;
	border-radius: 4px;
	height: 30px;
	width: 60px;
	margin-right: 4px;
	line-height: 30px;
	text-align: center;
}

.more-css {
	display: flex;
	align-items: center;
	justify-content: center;
	padding-left: 8px;
	padding-right: 8px;
	height: 30px;
	background: #ffffff;
	margin-right: 4px;
	border: 1px solid #999999;
	border-radius: 4px;
	font-size: $uni-font-size-base;
	color: #999999;
}

.condition-btn {
	display: flex;
	margin-top: 10px;
	flex-direction: row;
	justify-content: space-between;
	background: #ffffff;
}

.btn-all {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-left: 8px;
	margin-right: 8px;
	padding: 8px;
	text-align: center;
	border-radius: 4px;
	flex: 1;
	color: #ffffff;
	font-size: $uni-font-size-base;
}

.clear {
	background-color: $uni-border-color;
}

.confirm {
	background-color: $uni-color-primary;
}

.list-container {
	margin-top: 68px;
}

// .swiper {
// 	height: 40px;
// 	z-index: 1 !important;

.machine-info {
	line-height: 32px;
	margin-left: 10px;
	width: calc(100% - 20px);
	display: flex;
}

// }

.item-container {
	background-color: #ffffff;
	border-radius: 4px;
	margin: 8px;
	padding: 8px;

	.header {
		display: flex;
		width: 100%;

		.left {
			width: calc(100% - 30px);

			.date-view {
				display: flex;
				font-weight: 500;
				justify-content: space-between;
				font-size: 14px;

				.begin-date {
					width: 170px;
				}

				.delivery-user {
					margin-left: 8px;
				}

				.work-state {
					margin-left: 8px;
					font-weight: 400;
					text-align: end;
				}
			}
		}

		.right {
			height: 50px;
			width: 30px;
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}
	}
}

.checkbox {
	transform: scale(0.8);
}

.confirm-container {
	width: 100%;
	padding-top: 8px;
	padding-bottom:env(safe-area-inset-bottom);
	background-color: #f9f9f9;
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 300;
}

.confirm-btn {
	margin-left: 32px;
	margin-right: 32px;
	height: 36px;
	color: #ffffff;
	background-color: #E60000;
	font-size: 14px;
	align-self: center;
}

.confirm-btn-press {
	margin-left: 32px;
	margin-right: 32px;
	height: 36px;
	color: #ffffff;
	background-color: #E60000;
	opacity: 0.5;
	font-size: 14px;
	align-self: center;
}

//添加按钮
.add-container {
	position: fixed;
	display: flex;
	bottom: 50px;
	right: 20px;
	height: 50px;
	width: 50px;
	border-radius: 50%;
	box-shadow: 0px 0px 10px #E60000;
	justify-content: center;
	align-items: center;
	background-color: $uni-color-primary;
}

.labelstyle {
	color: #ffffff;
	font-size: 30px;
	font-weight: bold;
}
</style>
