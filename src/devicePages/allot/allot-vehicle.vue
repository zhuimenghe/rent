<template>
	<view class="container">
    <view style="position:sticky;top:0">
      <c-search-bar placeholder="自喷码/车号" :value="fuzzyParam" @input="searchChange" @clear="reset" @ok="submit">
        <view slot="pre">
          {{ totalNum }}条
        </view>
        <view class="flex margin-top padding-lr-sm" hover-class="none" :hover-stop-propagation="false">
          <selectView  :value="stateObj.label" hint="审批状态" @clickSelect="showPick('state')" class="flex-sub bg-gray light  margin-lr-sm"> </selectView>
          <selectView  :value="orgOldObj.label" hint="调拨前区域" @clickSelect="showPick('orgOld')" class="flex-sub bg-gray light  margin-lr-sm"> </selectView>
          <selectView  :value="orgNewObj.label" hint="调拨后区域" @clickSelect="showPick('orgNew')" class="flex-sub bg-gray light  margin-lr-sm"> </selectView>
        </view>
        <view slot="btns" v-if="isExportList">
          <view style="margin-right:20rpx" @click="exportExcel">导出</view>
        </view>
      </c-search-bar>
    </view>
		<view class="top-container">
			<view class="option-circle" @click="createAllot">我要调拨</view>
		</view>
		<view >
			<list class="list">
				<view class="item-container" v-for="(item,index) in records" :key="index">
					<view class="item-top">
						<view class="item-left">
							<i class="iconfont item-icon icontiaobodan"></i>
							<view class="item-top-middle">
								<view class="item-order-no" style="color: #E60000;" @click="goToDetail(item)">{{item.businessNo}}</view>
								<view class="item-subname">{{item.createName || "--"}}&nbsp;|&nbsp;{{item.stateName}}</view>
							</view>
						</view>
						<view class="item-num"><span style="color: #333333;font-size: 14px;">{{item.machineNum}}</span>台</view>
					</view>
					<view class="item-address-container">
						<view class="item-address-tag">
							<view class="small-circle blue"></view>
							<view class="line"></view>
							<view class="small-circle black"></view>
						</view>
						<view class="item-address-from-to">
							<view class="item-address from">{{item.orgOldNameList[0] || "--"}}</view>
							<view class="item-address-time">{{item.createTime || "--"}}</view>
							<view class="item-address-time" style="color: #333333;">物流费用：￥{{item.logisticsCarriage?getMoney(item.logisticsCarriage) :"0.00"}}</view>
							<view class="item-address-time max-two-line" style="color: #333333;">自喷码：{{getMachines(item.machineAllocationList)}}</view>
							<view class="item-address to">{{item.orgNewName || "--"}}</view>
						</view>
					</view>
					<view class="item-bottom">
						<taskBtn :itemData="item" />
						<view class="item-detail"  @click="editCreate(item)" v-if="ishowupdata(item)">修改</view>
						<view class="item-detail" @click="goToDetail(item)">详情</view>
					</view>
				</view>
			</list>
		</view>

		<view>
			<uni-load-more iconType="auto" :status="status" />
		</view>
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import taskBtn from '@/common/common-method/task_common_btn.vue'
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
  import { debounce } from '@/common/util/util';
	export default {
		components: {
			uniLoadMore,
			taskBtn,
			selectView,
			wPicker
		},
		data() {
			return {
				page: 1,
				pageSize: 10,
				status: 'more',
				topheight: "0px",
				records: [],
				totalNum: 0,
				userid: "",
				isExportList: true,
				totalCount: '100',
				fuzzyParam: '',
				orgOldObj: {},
				orgNewObj: {},
				orgList: [],
				stateObj: {},
				stateList: [],
				selectList: [],
				pickType: ''
			}
		},
		onLoad() {
			this.getAllotData();
			this.loadOrgList();
			this.loadStateTypes();
			uni.$on("refresh-db-list", (o) => {
				this.page = 1;
				this.records = [];
				this.getAllotData();
			})
			uni.$on('refresh-notification-list', obj => {
				this.page = 1;
				this.records = [];
				this.getAllotData();
			})
			uni.getStorage({
				key: this.$savekey.USER_INFO_MEG,
				success: (res) => {
					this.userid = res.data.id;
				}
			});
			uni.getStorage({
				key: this.$savekey.USER_PRIVILEGES_MEG,
				success: (res) => {
					//this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
				}
			})
			/*统计*/
			this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备调拨","列表");
			
		},
		methods: {
      searchChange:debounce(function (val) {
        this.fuzzyParam = val
        this.submit()
      }, 500),
			reset() {
				this.fuzzyParam = ''
				this.stateObj = {}
				this.orgOldObj = {}
				this.orgNewObj = {}
				this.page = 1;
				this.pageSize = 10;
				this.records = [];
				this.getAllotData();
			},
			submit() {
				this.page = 1;
				this.pageSize = 10;
				this.records = [];
				this.getAllotData();
			},
			ishowupdata(item) {
				return this.iscreator(item) && (item.state === '0' || item.state === '3')
			},
			iscreator(item) {
				if (item.createBy === this.userid) {
					return true
				} else {
					return false
				}
			},
			getMoney(money) {
				return this.moneyUtil.dealNumber(money)
			},
			getMachines(machines) {
				let codeList = machines && machines.length > 0 ? machines.map(o => {
					return o.printCode?o.printCode:'-'
				}) : []
				return codeList.length > 0 ? codeList.join(',') : '-'
			},
			editCreate(item) {
				uni.navigateTo({
					url: './create-allot?isUpdate=1&item=' + encodeURIComponent(JSON.stringify(item))
				});
			},
			createAllot() {
				uni.getStorage({
					key: this.$savekey.USER_PRIVILEGES_MEG,
					success: (res) => {
						let isAdd = res.data.some(x => x.value === this.$savekey.PERMISSION_MACHINE_ALLOT_ADD)
						if (isAdd) {
							uni.navigateTo({
								url: './create-allot'
							})
						} else {
							uni.showToast({
								title: '暂无新增调拨权限',
								icon: 'none'
							})
						}
					}
				})

			},
			goToDetail(item) {
				if (item.businessNo) {
					uni.navigateTo({
						url: './allot-detail?businessNo=' + item.businessNo
					})
				}
			},
			//流程审批状态
			loadStateTypes() {
				this.$network
					.loadUserType('business_state')
					.then(result => {
						this.stateList = result;
					})
					.catch(err => {});
			},
			loadOrgList() {
				let _self = this
				this.$network
					.getData(this.$url.ORG_LIST, 'GET', null)
					.then(result => {
						let orgs = result || [];
						orgs.forEach(function dep(o) {
							_self.orgList = [..._self.orgList, {
								"label": o.name,
								"value": o.id
							}];
							if (o.children && o.children.length > 0) o.children.map(dep);
						});
					})
					.catch(err => {});

			},
			showPick(type) {
				this.pickType = type
				switch (type) {
					case 'state':
						this.selectList = this.stateList
						break;
					case 'orgOld':
					case 'orgNew':
						this.selectList = this.orgList
						break;
					default:
						break;
				}
				this.$refs.selector.show();
			},
			onConfirm(val) {
				switch (this.pickType) {
					case 'state':
						this.stateObj = val.checkArr
						break;
					case 'orgOld':
						this.orgOldObj = val.checkArr
						break;
					case 'orgNew':
						this.orgNewObj = val.checkArr
						break;
					default:
						break;
				}
			},
			getAllotData() {
				this.status = "loading";
				let param = {
					"current": this.page,
					"size": this.pageSize,
					fuzzyParam: this.fuzzyParam ? this.fuzzyParam : undefined,
					orgOld: this.orgOldObj && this.orgOldObj.value ? this.orgOldObj.value : undefined,
					orgNew: this.orgNewObj && this.orgNewObj.value ? this.orgNewObj.value : undefined,
					state: this.stateObj && this.stateObj.value ? this.stateObj.value : undefined
				};
				this.$network.getData(this.$url.ALLOT_RECORD_LIST, "POST", param).then((result) => {
					this.records = this.records.concat(result.records);
					this.totalNum = result.total.toString()
					this.totalCount = result.total.toString()

					let pages = result.pages;
					if (pages == this.page) {
						this.status = 'noMore';
					} else {
						this.status = 'more';
					}
					uni.stopPullDownRefresh();
				}).catch((err) => {
					this.status = 'noMore';
					uni.stopPullDownRefresh();
				})
			},
			exportExcel(item) {
				let param = {
					current: 1,
					size: this.totalCount,
					fuzzyParam: this.fuzzyParam ? this.fuzzyParam : undefined,
					orgOld: this.orgOldObj && this.orgOldObj.value ? this.orgOldObj.value : undefined,
					orgNew: this.orgNewObj && this.orgNewObj.value ? this.orgNewObj.value : undefined,
					state: this.stateObj && this.stateObj.value ? this.stateObj.value : undefined
				};
				let url = this.$url.BASE_URL + this.$url.ALLOT_RECORD_LIST + '?isExport=true'
				let filename = this.$gxfmethod.getFileName("设备调拨记录-")
				this.$gxfmethod.downFunc(url, 'POST', param, filename)
			},
		},
		onPullDownRefresh() {
			this.page = 1;
			this.records = [];
			this.getAllotData();
		},
		onReachBottom() {
			this.$datestr.printlog("onReachBottom");
			if (this.status == 'noMore') {
				return;
			}
			this.page += 1;
			this.getAllotData();
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		background: $uni-bg-color-grey;
	}

	// .top-container {
	// 	position: fixed;
	// 	top: 0px;
	// 	left: 0px;
	// 	width: 100%;
	// 	z-index: 400;
	// }
	.top-container {
		background: #FFFFFF;
		width: 100%;
		height: 200px;
		line-height: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.search-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 4px;
		width: 100%;
	}

	.select-view {
		display: flex;
		flex: 1;
		padding-right: 4px;
		flex-direction: row;
		align-items: center;
	}

	.search-box {
		background: #F7F7F7;
		height: 35px;
		flex: 1;
		line-height: 35px;
		display: flex;
		flex-direction: row;
		padding-left: 8px;
		margin-right: 8px;
		border-radius: 4px;
		justify-content: flex-start;
		align-items: center;
	}


	.search-icon {
		color: #999999;
		font-size: $uni-font-size-base;
	}

	.search-content {
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 10px;
		flex: 1;
	}
	.export-css {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 8px;
		padding-right: 8px;
		height: 30px;
		background: #FFFFFF;
		border-radius: 4px;
		border: 1px solid $uni-color-primary;
		margin-left: 5px;
		margin-right: 5px;
		font-size: $uni-font-size-base;
		color: $uni-color-primary;
	}

	.btn-confirm {
		padding: 8px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: $uni-font-size-base;
		color: #FFFFFF;
		background-color: $uni-color-primary;
		border-radius: 4px;
		margin: 0px 4px;
		flex: 1;
	}

	.btn-reset {
		padding: 8px;
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		background-color: $uni-bg-color-grey;
		border-radius: 4px;
		margin: 0px 4px;
	}

	.option-circle {
		color: #FFFFFF;
		background-color: $uni-color-primary;
		width: 100px;
		height: 100px;
		text-align: center;
		line-height: 100px;
		border-radius: 50%;
		font-size: 16px;
		box-shadow: 0px 0px 15px #E60000;
	}

	.sticky-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: $uni-text-color-grey;
		background-color: #FFFFFF;
		align-items: center;
		margin-top: 1px;
		padding-top: 8px;
		padding-bottom: 8px;
		position: sticky;
		position: -webkit-sticky;
		top: 0px;
		left: 0px;
		width: 100%;
		z-index: 500;
	}

	.s-record {
		margin-left: 16px;
		font-size: 14px;
	}

	.s-sort-container {
		display: flex;
		flex-direction: row;
		margin-right: 16px;
		align-items: center;
	}

	.filter-view-style {
		padding: 3px 7px;
		display: flex;
		background: $uni-color-primary;
		font-size: $uni-font-size-base;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		border-radius: 5px;
		z-index: 955;
		color: #FFFFFF;
	}

	.item-container {
		display: flex;
		flex-direction: column;
		margin: 8px;
	}

	.item-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.item-icon {
		font-size: 25px;
		margin-right: 8px;
		color: #FCA01F;
	}

	.item-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background-color: #FFFFFF;
		padding: 8px 16px 8px 16px;
		border-radius: 4px 4px 0px 0px;
	}

	.item-order-no {
		font-size: 14px;
	}

	.item-subname {
		font-size: 12px;
		color: $uni-text-color-gray;
		margin-top: 4px;
	}

	.item-num {
		font-size: 12px;
		color: $uni-text-color-grey;
	}

	.item-address-container {
		background-color: #FFFFFF;
		padding: 0px 16px 0px 16px;
		display: flex;
		flex-direction: row;
	}

	.item-address-tag {
		margin-right: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;

	}

	.small-circle {
		width: 8px;
		height: 8px;
		border-radius: 50%;

	}

	.blue {
		background: $uni-color-primary;
		margin-top: 4px;
	}

	.line {
		width: 1px;
		flex: 1;
		background: #EEEEEE;
	}

	.black {
		background: #000000;
		margin-bottom: 12px;
	}

	.item-address {
		font-size: 14px;
	}

	.item-address-time {
		font-size: 10px;
		color: #AAAAAA;
		margin-top: 2px;
	}

	.to {
		margin-top: 8px;
		margin-bottom: 8px;
	}

	.item-bottom {
		display: flex;
		flex-direction: row;
		padding: 10px;
		margin-top: 1px;
		justify-content: flex-end;
		align-items: center;
		background-color: #FFFFFF;
	}

	.item-detail {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		color: $uni-color-primary;
		font-size: $uni-font-size-base;
		margin-left: 10px;
		// padding: 4px 10px;
		// border-radius: 50px;
		// border: 1px solid $uni-color-primary;
	}
</style>
