<template>
	<view class="container">
		<c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">
			设备控制
			<template v-slot:fixed>
				<view class="search-container" v-if="isShowSelect">
					<view class="search-top">
						<view class="select-view">
							<selectView :value="lockStateObj.label" hint="日志类型" @clickSelect="showPick('state')" />
						</view>
						<view class="select-view">
							<selectView :value="createByObj.label" hint="发起人" @clickSelect="showPick('createBy')" />
						</view>
						<view class="export-css" @click="exportExcel" v-if="isExportList"><text>导出</text></view>
					</view>
				</view>
			</template>
		</c-nav-bar-btns>
		<view class="top-container">
			<view class="option-circle" :style="{ 'background-color':'#E60000'}" @click="controlDevice('lock')">批量锁车</view>
			<view class="unlock-container" @click="controlDevice('unlock')">
				<i class="iconfont iconzl--jiesuo" style="color: #52C41A; margin-right: 4px;"></i>
				<text>批量解锁 &nbsp;</text>
				<i class="iconfont iconarrow-right" style="color: #999999;"></i>
			</view>
		</view>
		<view class="filter-container" :style="{ position: positionstr, top: topheight }">
			<view class="sticky-bar">
				<view class="s-record">{{ $t('common.operationLog') }}</view>
			</view>
		</view>
		<view :style="{ 'margin-top': listMarginTop }">
			<view class="list" scrollable="true" show-scrollbar="false">
				<view>
					<view class="item-container" v-for="(item, index) in records" :key="index">
						<view class="item-top">
							<view class="item-left">
								<i class="iconfont item-icon" :class="item.type === 3 ? 'iconzl--suoche' : 'iconzl--jiesuo'" :style="[{ color: item.type === 3 ? '#E60000' : '#52C41A' }]"></i>
								<view class="item-top-middle">
									<view class="item-top-middle-top">
										<view class="item-user">{{ item.createUsername }}</view>
										<view class="item-num">{{ item.type === 3 ? '锁车' : '解锁' }} {{ item.num }} 台</view>
									</view>
									<view class="record-date">{{ item.createTime || '--' }}</view>
								</view>
							</view>
							<view class="item-detail-container">
								<view class="item-detail" @click="changeExpand(index)">
									<view>详情</view>
									<i class="iconfont iconarrow-right" :id="item.isExpand ? 'translate-arrow' : 'translate-arrow-expend'" ref="expandArrow"></i>
								</view>
							</view>
						</view>
						<view v-show="item.isExpand">
							<view v-for="(v, i) in item.machineInfo" :key="i" @click="changeCheckBox($event, index, i)">
								<view class="item-msg">
									<view class="topcarstyle">
										<view class="device-h">
											<view class="license-view">
												<text style="margin-right: 10px;">自喷码:{{ v.printCode || '--' }}</text>
												<text :style="{ color: v.offline ? '#FF0000' : '#4EC365' }">{{ v.offline ? '(离线)' : '(在线)' }}</text>
											</view>
											<view class="license-view">车号:{{ v.licenseId || '-' }}</view>
											<view class="license-view">
												当前状态:
												<text style="font-size: 15px;color: #E60000;">{{ v.lockTypeDesc || '--' }}</text>
											</view>
										</view>
										<mycheckbox :checked="v.checked" class="checkbox"  color="#E60000" />
									</view>
									<scroll-view scroll-x="true" style="margin-left: 10px;margin-right: 10px;">
										<view class="order-state-list">
											<view class="order-state-item" v-for="(step, stepi) in v.processes" :key="stepi">
												<view class="order-item-top" :style="{ color: step.done == true ? '#63a35c' : '#999999' }">
													<view class="order-name">{{ step.desc || '--' }}          </view>
													<view class="line" />

												</view>
												<viwe class="reason" v-if="step.operateMsg" >原因:{{step.operateMsg }}</viwe>
												<view class="order-date">{{ step.opreateDate || '--' }}</view>
											</view>
										</view>
									</scroll-view>
								</view>
							</view>
							
							<view class="btn-container" v-if="item.machineInfo.length > 0">
								<view class="msg-view">
									{{ item.type === 3 ? '锁车' : '解锁' }}成功
									<text style="color: #4EC365;">{{ item.success }}</text>
									台, 等待中
									<text style="color: #F0AD4E;">{{ item.wait }}</text>
									台, {{ item.type === 3 ? '锁车' : '解锁' }}失败
									<text style="color: #FF0000;">{{ item.fail }}</text>
									台
								</view>
								<view class="lock-btn" v-if="isShowLock(item)" @click="doControl(index, true)">
									<i class="iconfont iconzl--suoche" style="margin-right: 2px;"></i>
									<text>锁车</text>
								</view>
								<view class="unlock-btn" v-if="isShowUnlock(item)" @click="doControl(index, false)">
									<i class="iconfont iconzl--jiesuo" style="margin-right: 2px;"></i>
									<text>解锁</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<uni-load-more iconType="auto" :status="status" />
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false" ref="date"
		 themeColor="#E60000" />
		<alertshow ref="alertshow" @clickOk="chlickOK" :dataList="chooseList" :title="showtitle" :msg="showmsg" />

		<alertshow ref="alertshowsubmit" @clickOk="chlickOKs" :dataList="lockList" :title="showtitles" :msg="showmsgs" />
	</view>
</template>

<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import alertshow from '@/components/common/uni-popup/alert-show.vue';
	import selectView from '@/components/common/common-ui/selector-view.vue';
	export default {
		components: {
			uniLoadMore,
			wPicker,
			alertshow,
			selectView
		},
		data() {
			return {
				navBtns: [
						{
								"text": "筛选",
								"type": "none",
								"fontSize": "14px",
						},
						{
								"text": "设备列表",
								"type": "none",
								"fontSize": "14px",
						}
				],
				page: 1,
				status: 'loading',
				isFixed: false,
				positionstr: 'relative',
				topheight: '0px',
				listMarginTop: '0px',
				statusBarHeight: '',
				isShowFilter: false, //是否显示筛选
				startTime: '', //筛选的开始时间
				endTime: '', //筛选的结束时间
				pickType: '', //pick类型
				//数据列表
				records: [], //数据
				selectList: [], //发起人列表
				//弹窗数据
				chooseList: [],
				showtitle: '',
				showmsg: '',
				isopration: false,
				lockList: [],
				showtitles: '',
				showmsgs: '',
				islockOp: false,
				isCanControl: false,
				isExportList: true,
				totalCount: '100',
				isShowSelect: false,
				createByObj: {},
				createByList: [],
				lockStateObj: {},
				lockStateList: [{
						label: '全部',
						value: ''
					},
					{
						label: '解锁',
						value: 'unLock'
					},
					{
						label: '锁车',
						value: 'lock'
					}
				]
			};
		},
		onLoad() {
			const res = uni.getSystemInfoSync();
			const system = res.platform;
			this.statusBarHeight = res.statusBarHeight;
			this.getLockData(false);
			this.loadOwnerList();
			uni.$on('refreshData-log', usnerinfo => {
				this.page = 1;
				this.records = [];
				this.getLockData(false);
			});
			let ps = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
			if (ps && ps.length > 0) {
				this.isCanControl = ps.some(x => x.value === this.$savekey.PERMISSION_MACHINE_LOCK_UNLOCK);
			}
			uni.getStorage({
				key: this.$savekey.USER_PRIVILEGES_MEG,
				success: res => {
					//this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
				}
			});
			/*统计*/
			this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备控制","列表");
		},
		onUnload() {
			uni.$off('refreshData-log');
		},
		methods: {
			onNavBarButtonTap(obj) {
				console.log(obj.index)
				if(obj.index==0){
					this.isShowSelect = !this.isShowSelect
				}else{
					uni.navigateTo({
						url: './all-device-list'
					});
				}
				
			},
			exportExcel() {

				let param = {
					current: 1,
					size: this.totalCount,
					createdBy:this.createByObj&&this.createByObj.value?this.createByObj.value:undefined,
					queryType:this.lockStateObj&&this.lockStateObj.value?this.lockStateObj.value:undefined
				};
				let url = this.$gxfmethod.getUrl(this.$url.CONTROL_LOG_LIST);
				let filename = this.$gxfmethod.getFileName('设备控制记录列表-');
				this.$gxfmethod.downFunc(url, 'POST', param, filename);
			},
			//加载负责人
			loadOwnerList() {
				this.$network
					.getData(this.$url.USER_LEADERS, 'GET', null)
					.then(result => {
						this.createByList = [];
						this.createByList.push({
							label: '全部',
							value: ''
						});
						this.createByList = this.createByList.concat(
							result ?
							result.map(dict => {
								return {
									label: dict.username,
									value: dict.id
								};
							}) : []
						);
					})
					.catch(err => {
					});
			},
			//展开闭合页面
			changeExpand(pos) {
				if (!this.records[pos].isExpand && this.records[pos].machineInfo.length === 0) {
					this.getLockListData(this.records[pos].id, pos);
				}
				this.records[pos].isExpand = !this.records[pos].isExpand;
			},
			//是否显示锁车按钮
			isShowLock(item) {
				if (item.machineInfo) {
					return item.machineInfo.some(i => {
						return i.lockType == '4';
					});
				} else {
					return false;
				}
			},
			//是否显示解锁按钮
			isShowUnlock(item) {
				if (item.machineInfo) {
					return item.machineInfo.some(i => {
						return i.lockType == '3';
					});
				} else {
					return false;
				}
			},
			//选中车辆
			changeCheckBox(event, index, i) {
				this.records[index].machineInfo[i].checked = !this.records[index].machineInfo[i].checked;
			},
			/**
			 * 获得选中设备
			 * @param {Object} i 列表位置
			 */
			getCheckedList(i) {
				return this.records[i].machineInfo.filter(v => {
					return v.checked;
				});
			},
			/**
			 * 解锁/锁车
			 * @param {Object} i 列表位置
			 * @param {Object} isLockDevice true 锁车 false解锁
			 */
			doControl(i, isLockDevice) {
				if (!this.isCanControl) {
					uni.showToast({
						icon: 'none',
						title: '暂无锁车/解锁权限'
					});
					return;
				}
				let checkedList = this.getCheckedList(i);
				if (checkedList.length == 0) {
					uni.showToast({
						title: '请选择需要操作的车辆',
						icon: 'none'
					});
					return;
				}
				let locktype = '3';
				if (isLockDevice == true) {
					locktype = '4';
				} else {
					locktype = '3';
				}
				let isFit = checkedList.filter(item => {
					return item.lockType != locktype;
				});
				this.lockList = checkedList;
				this.islockOp = isLockDevice;

				if (isFit.length > 0) {
					let str1 = isLockDevice ? '已锁车' : '已解锁';
					let str2 = isLockDevice ? '锁车' : '解锁';
					this.showtitle = '存在' + isFit.length + '台设备当前状态为' + str1 + ',无需再次' + str2 + ',其他设备指令正常下发.';
					this.showmsg = '无需下发指令的设备';
					this.chooseList = isFit;
					this.$refs.alertshow.open();
				} else {
					this.cardeal(checkedList, isLockDevice);
				}
			},
			chlickOK() {
				this.$refs.alertshow.close();
				this.cardeal(this.lockList, this.islockOp);
			},
			chlickOKs() {
				this.$refs.alertshowsubmit.close();
				uni.showLoading();
				let arr = this.lockList.map(info => {
					let lisenid = info.licenseId;
					return lisenid;
				});
				let locktype = '3';
				if (this.islockOp == false) {
					locktype = '4';
				} else {
					locktype = '3';
				}
				let parame = {
					licenseIdList: arr,
					operationType: locktype
				};
				this.$network
					.getData(this.$url.CONTROL_LOCKORUNLOCK_LIST, 'POST', parame)
					.then(result => {
						if (arr.length === 1) {
							uni.showToast({
								icon: 'none',
								title: result.message,
								duration: 1500
							});
						} else {
							let success = this.getToastMes('发送指令成功:', result.success || []);
							let offline = this.getToastMes('离线状态:', result.offline || []);
							let ubBind = this.getToastMes('未绑定:', result.ubBind || []);
							let noDataIot = this.getToastMes('未在物联网中查询到可操作的设备:', result.noDataIot || []);
							let noData = this.getToastMes('未找到设备数据:', result.noData || []);
							let commondFail = this.getToastMes('发送指令失败:', result.commondFail || []);
							let error = this.getToastMes('操作的状态错误:', result.error || []);
							let toastMsg = success + offline + ubBind + noDataIot + noData + commondFail + error + '请前往锁车日志中查看';
							uni.showModal({
								title: '提示',
								content: toastMsg,
								showCancel: false
							});
						}
						this.page = 1;
						this.records = [];
						this.getLockData(false);
					})
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.message,
							duration: 1500
						});
					});
			},
			cardeal(itemArr, isLockDevice) {
				if (isLockDevice == false) {
					this.showtitles = '您将对' + itemArr.length + '台设备进行解锁';
					this.showmsgs = '以下为所选设备列表';
				} else {
					this.showtitles = '您将对' + itemArr.length + '台设备进行锁车';
					this.showmsgs = '以下为所选设备列表';
				}
				this.$refs.alertshowsubmit.open();
			},
			getToastMes(msg, list) {
				if (list.length === 0) {
					return '';
				} else {
					return msg + list.length + '台\n';
				}
			},
			showPick(type) {
				this.pickType = type;
				switch (type) {
					case 'state':
						this.selectList = this.lockStateList
						this.$refs.selector.show();
						break;
					case 'createBy':
						this.selectList = this.createByList
						this.$refs.selector.show();
						break;
					case 'startTime':
					case 'endTime':
						this.$refs.date.show();
						break;
					default:
						break;
				}
			},
			//确认pick
			onConfirm(val) {
				switch (this.pickType) {
					case 'state':
						this.lockStateObj = val.checkArr
						break;
					case 'createBy':
						this.createByObj = val.checkArr
						break;
					default:
						break;
				}
				this.isShowSelect = false
				this.page = 1;
				this.records = [];
				this.getLockData(false);
			},
			//获取网络数据
			getLockData(refresh) {
				let parame = {
					current: this.page,
					size: 10,
					createdBy:this.createByObj&&this.createByObj.value?this.createByObj.value:undefined,
					queryType:this.lockStateObj&&this.lockStateObj.value?this.lockStateObj.value:undefined
					
				};
				this.$network
					.getData(this.$url.CONTROL_LOG_LIST, 'POST', parame)
					.then(result => {
						this.records = this.records.concat(result.records);
						this.resetList(refresh);
						let pages = result.pages;
						if (pages <= this.page) {
							this.status = 'noMore';
						} else {
							this.status = 'more';
						}
						uni.stopPullDownRefresh();
						uni.hideLoading();
					})
					.catch(err => {
						this.status = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			// 根据id获取车辆列表
			getLockListData(opid, index) {
				uni.showLoading();
				let url = this.$url.CONTROL_LOG_CARLIST + opid;
				this.$network
					.getData(url, 'GET', null)
					.then(result => {
						this.records[index].machineInfo = this.resetCarWithCheck(result.list);
						this.records[index].success = result.success || 0;
						this.records[index].wait = result.wait || 0;
						this.records[index].fail = result.fail || 0;
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			resetCarWithCheck(list) {
				return list.map(o => {
					return {
						...o,
						checked: false
					};
				});
			},
			resetList(refresh) {
				this.records = this.records.map((item, index) => {
					if (refresh) {
						return {
							...item,
							machineInfo: item.machineInfo || [],
							isExpand: item.isExpand ? true : false
						};
					}
					return {
						...item,
						machineInfo: [],
						isExpand: false
					};
				});
			},
			//页面跳转
			controlDevice(controlType) {
				if (this.isCanControl) {
					uni.navigateTo({
						url: './batch-control?controlType=' + controlType
					});
				} else {
					uni.showToast({
						icon: 'none',
						title: '暂无锁车/解锁权限'
					});
				}
			}
		},
		onPageScroll(e) {
			if (e.scrollTop >= 200) {
				this.positionstr = 'fixed';
				this.topheight = '0px';
				this.margintopH = '0px';
				this.listMarginTop = '50px';
			} else {
				this.positionstr = 'relative';
				this.listMarginTop = '0px';
			}
		},
		onPullDownRefresh() {
			this.page = 1;
			this.records = [];
			this.getLockData(false);
		},
		onReachBottom() {
			if (this.status == 'noMore') {
				return;
			}
			this.page += 1;
			this.status = 'loading';
			this.getLockData(true);
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100%;
		background: $uni-bg-color-grey;
	}

	.top-container {
		background: #ffffff;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 1px;
		padding: 30px 0px 20px 0px;
		background: #ffffff;
	}

	.search-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		margin-bottom: 1px;
		padding: 8px;
		width: calc(100% - 16px);
		// position: fixed;
		top: 0px;
		left: 0px;
		z-index: 950;
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

	.option-circle {
		color: #ffffff;
		background-color: $uni-color-primary;
		width: 100px;
		height: 100px;
		text-align: center;
		line-height: 100px;
		border-radius: 50%;
		font-size: $uni-font-size-lg;
		box-shadow: 0px 0px 15px #E60000;
	}

	.unlock-container {
		margin-top: 20px;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.filter-container {
		display: flex;
		flex-direction: column;
		position: relative;
		width: 100%;
		z-index: 500;
	}

	.condition-tag {
		color: $uni-text-color-gray;
	}

	.filter-condition {
		display: flex;
		flex-direction: column;
		padding: 16px;
		background-color: #ffffff;
		font-size: $uni-font-size-base;
	}

	.filter-content {
		position: absolute;
		top: 40px;
		width: 100%;
		left: 0px;
		box-shadow: 0px 1px #fcfcfc;
		border-radius: 4px;
		font-size: 36px;
		overflow-y: scroll;
	}

	.condition-select {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-top: 8px;
		padding-bottom: 8px;
		margin: 8px 0px;
		align-items: center;
	}

	.condition-btn {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.btn {
		padding: 10px 0px;
		text-align: center;
		border-radius: 4px;
		flex: 1;
		color: #ffffff;
		font-size: $uni-font-size-base;
	}

	.clear {
		background-color: $uni-border-color;
		margin-right: 8px;
	}

	.confirm {
		background-color: $uni-color-primary;
		margin-left: 8px;
	}

	.sticky-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		color: $uni-text-color-grey;
		background-color: #ffffff;
		align-items: center;
		padding-top: 8px;
		padding-bottom: 8px;
		width: 100%;
		z-index: 999;
	}

	.s-record {
		flex: 1;
		margin-left: 16px;
		font-size: $uni-font-size-base;
	}

	.s-record-btn {
		margin-left: 16px;
		margin-right: 10px;
		font-size: $uni-font-size-base;
		background: #E60000;
		color: #ffffff;
		padding: 3px 10px;
		border-radius: 3px;
	}

	.s-sort {
		display: flex;
		flex-direction: row;
		margin-right: 16px;
		align-items: center;
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
		font-size: 36px;
		margin-right: 8px;
		color: $uni-color-primary;
	}

	.item-top-middle-top {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.item-top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		background-color: #ffffff;
		padding: 8px 16px 8px 16px;
		border-radius: 4px 4px 0px 0px;
		margin-bottom: 1rpx;
	}

	.item-user {
		font-size: 14px;
	}

	.item-num {
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;
		margin-left: 8px;
	}

	.item-num span {
		font-size: 13px;
		color: #555555;
	}

	.record-date {
		font-size: $uni-font-size-sm;
		color: $uni-text-color-disable;
	}

	.item-detail-container {
		padding-top: 4px;
		padding-bottom: 4px;
		background-color: #ffffff;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		border-radius: 0px 0px 4px 4px;
	}

	.item-detail {
		font-size: $uni-font-size-sm;
		color: $uni-text-color-gray;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	#translate-arrow {
		font-size: 16px;
		transform: rotate(-90deg);
		transition: all 1s;
	}

	#translate-arrow-expend {
		font-size: 16px;
		transform: rotate(90deg);
		transition: all 1s;
	}

	.item-msg {
		display: flex;
		flex-direction: column;
		background: #ffffff;
	}

	.topcarstyle {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		margin: 10px;
	}

	//橫向佈局
	.device-h {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: flex-start;
	}

	.license-view {
		display: flex;
		flex-direction: row;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		justify-content: flex-start;
		align-items: center;
	}

	.selfprint-view {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		font-size: $uni-font-size-base;
		color: $uni-color-subtitle;
	}

	.order-state-list {
		display: flex;
		flex-direction: row;
		margin-top: 5px;
		margin-bottom: 15px;
	}

	.order-state-item {
		display: flex;
		flex-direction: column;
		font-size: $uni-font-size-sm;
		color: $uni-color-subtitle;
		justify-content: center;
		min-width: 25%;
		margin-top: 5px;
	}

	.order-item-top {
		display: flex;
		flex: 1;
		flex-direction: row;
		align-items: center;
		margin-top: 5px;
		margin-bottom: 5px;
	}

	.line {
		width: 32px;
		height: 1px;
		margin-left: 5px;
		margin-right: 5px;
		background-color: $uni-text-color-disable;
	}

	.order-state-item:last-child .line {
		width: 0px;
	}

	.order-date {
		display: flex;
		margin-top: 5px;
		margin-bottom: 15px;
		font-size: $uni-font-size-xs;
		color: $uni-text-color-disable;
		// justify-content: center;
		align-items: center;
	}

	.state-view {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		font-size: $uni-font-size-sm;
		color: $uni-color-subtitle;
	}

	.state-view span {
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		margin-left: 8px;
	}

	.checkbox {
		transform: scale(0.8);
	}

	.btn-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: #ffffff;
		background-color: #ffffff;
		font-size: $uni-font-size-base;
		margin-top: 1px;
		border-radius: 0px 0px 4px 4px;
	}

	.msg-view {
		display: flex;
		flex: 1;
		margin-left: 10px;
		justify-content: flex-start;
		align-items: center;
		color: $uni-text-color;
		font-size: $uni-font-size-sm;
	}

	.lock-btn {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin: 8px;
		background-color: #E60000;
		padding: 6px 8px;
		border-radius: 4px;
	}

	.unlock-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		margin: 8px;
		background-color: #52c41a;
		padding: 6px 8px;
		border-radius: 4px;
	}
	.reason{
		color: rgb(99, 163, 92);
	}
</style>
