<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-container">
			<view class="top-seccontainer" :style="{ background: bgColor }">
				<view class="status-bar-only"></view>
				<view class="top-bar">
					<view class="top-title" :style="{ color: iconColor }">
						{{titleName}}
					</view>
					<view class="top-right-icon">
						<view class="top-msg " @click="dealToDo('notice')">
							<i class="iconfont right-icon msg-icon iconjinggao6" :style="{ color: iconColor,fontSize:'18px' }"></i>
							<text class="msg-bage">{{ importanceNum>99?'99+':importanceNum }}</text>
						</view>
						<view class="top-msg " @click="dealToDo('remind')">
							<i class="iconfont right-icon msg-icon iconzl--tixing" :style="{ color: iconColor }"></i>
							<text class="msg-bage" style="background-color: #F0AD4E;">{{ remindNum>99?'99+':remindNum }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view>
			<list class="list-container" scrollable="true" show-scrollbar="false">
				<cell>
					<view class="menu-container">
						<view class="menu-tag tag-text">{{ $t('home.menusTitle') }}</view>
						<view class="menu-item-container">
							<view class="menu-item" v-for="(menu, index) in menus" :key="index" @click="goPage(menu)">
								<view class="menu-item-c">
									<i class="iconfont " :class="[menu.icon,isLg?'item-image-lg':'item-image']"  :style="{ color: menu.color }"></i>
									<text class="item-title">{{ menu.subName }}</text>
								</view>

							</view>
						</view>
					</view>
				</cell>
				<cell>
					<view class="schedule-container">
						<view class="schedule-tag tag-text">{{ $t('home.scheduleTitle') }}</view>
						<view class="schedule-content" @click="dealToDo('todo')">
							<view class="schedule-text">
								<text class="text-warning">{{ $t('home.scheduleWarning') }}</text>
								<text class="text-content">{{ $t('home.startTip') }}{{ msgNum }}{{ $t('home.endTip') }}</text>
							</view>
							<view class="schedule-num">
								<text class="text-num">{{ msgNum }}</text>
							</view>
						</view>
					</view>
				</cell>
				<cell>
					<view class="more-function" v-if="!noticeList||noticeList.length<=0"> 更多功能开发中...</view>
					<view class="notice-container" v-if="noticeList.length>0">
						<view class="notice-title-container">
							<view class="notice-tag tag-text">{{ $t('home.noticeTitle') }}</view>
							<view class="more-tag">
								{{ $t('home.more') }}
								<i class="iconfont more-arrow iconarrow-right"></i>
							</view>
						</view>
						<view class="notice-content">
							<view class="notice-item" v-for="(notice, index) in noticeList" :key="index">
								<view class="title-content">
									<view class="hot-tag" v-if="notice.isHot">{{ $t('home.hot') }}</view>
									<view :class="{ 'first-title': notice.isHot, title: !notice.isHot }">{{ notice.content }}</view>
								</view>
								<view class="date">{{ notice.date }}</view>
								<view class="line" />
							</view>
						</view>
					</view>
				</cell>
			</list>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				menus: [],
				msgNum: '0',
				remindNum: 0, //消息提醒接口
				importanceNum:0,//重要通知提醒
				noticeList: [
					// {
					// 		isHot: 'true',
					// 		content: '北谷电子租赁项目正式启动招标计划',
					// 		date: '2019/10/02 15:03:02'
					// 	}

				],
				bgColor: 'rgba(249, 249, 249, 0.0)',
				searchBg: 'rgba(237,238,238, 0.2)',
				iconColor: '#FFFFFF',
				isLg: false,
				titleName: ''
			};
		},
		onShow() {
			this.loadMsgList();
			this.loadUnreadNum();
			this.loadImportanceNum();
		},
		onLoad() {
			uni.getStorage({
				key: 'versonKey',
				success: (res) => {
					if (res.data === 'lgzj') {
						this.isLg = true
					} else {
						this.isLg = false
					}
				}
			});
			this.workflowcommon.iswf("claim").then((iswf) => {
				console.log(iswf)
			})
			// this.loadMsgList();
			// uni.setTabBarItem({
			// 	index: 0,
			// 	text: this.$t('tabs.home')
			// });
			// uni.setTabBarItem({
			// 	index: 1,
			// 	text: "this.$t('tabs.setting')"
			// });
			this.menus = [{
					subName: '转租', //调拨
					icon: 'iconzl--zhuanzu1',
					color: this.isLg ? '#b81d13' : '#E60000',
					// goUrl: '/otherPages/sublet/sublet-apply-list',
					goUrl: 'invoicees/sublet/sublet-tab',
					key: this.$savekey.PERMISSION_SUBLET_MENU
				},
				{
					subName: '物流记录', //索赔
					icon: 'iconzl--wuliujilu',
					color: this.isLg ? '#b81d13' : '#FCA01F',
					goUrl: '/otherPages/logistics/logistics-record',
					key: this.$savekey.PERMISSION_LOGISTICS_RECORD
				},
				{
					subName: '物流公司', //报停
					icon: 'iconzl--wuliugongsi',
					color: this.isLg ? '#b81d13' : '#FB7135',
					goUrl: '/otherPages/logistics/logistics-company-list',
					key: this.$savekey.PERMISSION_LOGISTICS_COMPANY
				},
				{
					subName: '客户管理', //进场
					icon: 'iconzl--kehuguanli--',
					color: this.isLg ? '#b81d13' : '#5A7AE8',
					goUrl: '/otherPages/linkman/custom-admin',
					key: this.$savekey.PERMISSION_CUSTOMER_MANAGER
				},
				{
					subName: '电子围栏', //退场
					icon: 'iconzl--dianziweilan',
					color: this.isLg ? '#b81d13' : '#FCA01F',
					goUrl: '/devicePages/fence/fence-list',
					key: this.$savekey.PERMISSION_MACHINE_FENCE
				},
				{
					subName: '维修',
					icon: 'iconzl--weixiu',
					color: this.isLg ? '#b81d13' : '#FB7135',
					goUrl: '/devicePages/repair/repair-all',
					// goUrl: '/devicePages/repair/repair-list',
					key: this.$savekey.PERMISSION_MACHINE_REPAIR
				},
				{
					subName: '保养',
					icon: 'iconzl--baoyang',
					color: this.isLg ? '#b81d13' : '#5A7AE8',
					goUrl: '/devicePages/maintain/maintain-record-list',
					key: this.$savekey.PERMISSION_MACHINE_REPAIR
				},
				{
					subName: '补液', //巡检
					icon: 'iconzl--buye',
					color: this.isLg ? '#b81d13' : '#E60000',
					goUrl: '/devicePages/infusion/infusion-list',
					key: this.$savekey.PERMISSION_MACHINE_REPAIR
				},
				{
					subName: '设备档案',
					icon: 'iconzl--dangan',
					color: this.isLg ? '#b81d13' : '#5A7AE8',
					goUrl: '/devicePages/record/device-record',
					key: this.$savekey.PERMISSION_MACHINE_ARCHIVES
				}, {
					subName: '设备监控',
					icon: 'iconzl--jiankong',
					color: this.isLg ? '#b81d13' : '#E60000',
					goUrl: '/devicePages/monitor/equipment-monitoring-list',
					key: this.$savekey.PERMISSION_MACHINE_MONTIOR
				},
				{
					subName: '设备控制',
					icon: 'iconzl--kongzhi',
					color: this.isLg ? '#b81d13' : '#FB7135',
					goUrl: '/devicePages/control/lock-vehicle',
					key: this.$savekey.PERMISSION_MACHINE_CONTROL
				},
				{
					subName: '通用审批',
					icon: 'iconzl--tongyongshenpi',
					color: this.isLg ? '#b81d13' : '#FCA01F',
					goUrl: '/businessPages/workflow/common-approve-list',
					key: this.$savekey.PERMISSION_COMMON_APPROVE
				}, {
					subName: '设备检修',
					icon: 'iconprepare-model',
					color: this.isLg ? '#b81d13' : '#FCA01F',
					goUrl: '/devicePages/hostling/hostling-all',
					key: this.$savekey.PERMISSION_STOCK_HOME
				},
				{
					subName: '配件管理',
					icon: 'iconpeijianguanli',
					color: this.isLg ? '#b81d13' : '#FB7135',
					goUrl: '/subOtherPages/accessories/accessories-all',
					key: this.$savekey.PERMISSION_PART_MANAGE
				},
				{
					subName: '设备采购',
					icon: 'iconcaigou',
					color: this.isLg ? '#b81d13' : '#E60000',
					goUrl: '/devicePages/purchase/purchase-record',
					key: this.$savekey.PERMISSION_PURCHASE_MANAGE
				},
				{
					subName: '我方物流',
					icon: 'iconzl--wuliugongsi',
					color: this.isLg ? '#b81d13' : '#5A7AE8',
					goUrl: '/otherPages/logistics/logistics-manage',
					key: this.$savekey.PERMISSION_OUR_LOGISTICS_MANAGE
				},

			]
			//保存菜单信息
			uni.getStorage({
				key: this.$savekey.USER_PRIVILEGES_MEG,
				success: (res) => {
					this.menus = this.menus.filter(o => {
						return !o.key || res.data.some(x => x.value === o.key)
					})
					console.log("menus" + JSON.stringify(this.menus))
				}
			})
			uni.getStorage({
				key: this.$savekey.USER_INFO_MEG,
				success: (res) => {
					this.titleName = res.data.lesseeInfo.tenantName || ''
				}
			})
			// #ifdef APP-PLUS
			this.uploadCid();
			// #endif
			this.getConfigInfo();
		},
		onPageScroll(e) {
			if (e.scrollTop == 0) {
				this.bgColor = 'rgba(249, 249, 249,0)';
				this.iconColor = '#FFFFFF';
				this.searchBg = 'rgba(237,238,238,0.2)';
				return;
			}
			if (e.scrollTop > 44) {
				this.bgColor = 'rgba(249, 249, 249, 1)';
				this.iconColor = '#2f2f2f';
				this.searchBg = 'rgba(237,238,238,1)';
			} else {
				let alphx = e.scrollTop / 44;
				this.bgColor = 'rgba(249, 249, 249,0.5)';
				this.searchBg = 'rgba(237,238,238,0.5)';
			}

		},
		methods: {
			//获取当前配置文件
			getConfigInfo() {
				let param = {
					size: 100,
					current: 1
				}
				this.$network.getData(this.$url.CONFIG_PAGE, "POST", param).then((result) => {
					console.log(result,'homeresult');
					let res = result && result.records && result.records.length > 0 ? result.records.map(o => {
						return {
							id: o.id,
							name: o.name,
							value: o.value,
							code: o.code
						}
					}) : []
					//保存菜单信息
					uni.setStorage({
						key: this.$savekey.CONFIG_INFO,
						data: res,
						success: () => {},
						fail: () => {}
					});
					localStorage.setItem(this.$savekey.CONFIG_INFO,res)
				}).catch((err) => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: err.message
					})

				})
			},
			uploadCid() {
				let clientInfo = plus.push.getClientInfo();//客户端推送标识信息对象
				let url = this.$url.POST_CID.replace(/{cid}/, clientInfo.clientid);
				this.$network.getData(url, "POST", null).then((result) => {

				}).catch((err) => {})
			},
			goPage(menu) {
				uni.navigateTo({
					url: menu.goUrl
				});
			},
			scrollMethod: function(e) {
				this.$datestr.printlog(e);
			},
			getSysDicPages() {
				var param = {};
				this.$network.getData(this.$url.SYS_DIC, "GET", null).then((result) => {
					this.$datestr.printlog("SYS_DIC" + JSON.stringify(result));
					uni.setStorage({
						key: 'sys_dic',
						data: result.records,
						success: () => {
							this.$datestr.printlog('success');
						}
					});

				}).catch((err) => {
					this.$datestr.printlog("result");
				})
			},
			loadMsgList() {
				let query = "?current=1&size=1";
				this.$network.getData(this.$url.TO_DO_LIST + query, "POST", null).then((result) => {
					this.msgNum = result.total;
				}).catch((err) => {})
			},
			loadUnreadNum() {
				this.$network.getData(this.$url.UNREAD_LIST, "GET").then((result) => {
					let list = result ? result.filter(o => {
						return o.noticeType !== '2'
					}) : []
					this.remindNum = list.length > 0 ? list.reduce((x, y) => {
						return x + Number(y.num)
					}, 0) : 0;
					uni.setTabBarBadge({
					  index: 4,
					  text: this.remindNum>99?'99+':this.remindNum+''
					})
				}).catch((err) => {})
			},
			loadImportanceNum() {
				this.$network.getData(this.$url.NOTIFY_UNREAD_COUNT, "GET").then((result) => {
					this.importanceNum = result ? result:0
			
				}).catch((err) => {})
			},
			dealToDo(type) {
				switch (type) {
					case 'remind':
						uni.navigateTo({
							url: '/businessPages/workflow/notification-tabbar?index=3'
						})
						break;
					case 'notice':
						uni.navigateTo({
							url: '/otherPages/notify/importance-notification'
						})

						break;
					case 'todo':
						uni.navigateTo({
							url: '/otherPages/notify/notification-tabbar'
						})
						break;
					default:

						break;
				}

			}
		}
	};
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		background: $uni-bg-color-grey;
	}

	.top-container {
		width: 100%;
		height: 196px;
		background: $uni-color-primary;
	}

	.top-seccontainer {
		width: 100%;
		height: calc(44px + var(--status-bar-height));
		background: #007aff;
		position: fixed;
		z-index: 10000;
	}

	.status-bar-only {
		width: 100%;
		height: var(--status-bar-height);
	}

	.top-bar {
		width: 100%;
		height: 44px;
		padding-left: 15px;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}

	.top-search {
		display: flex;
		flex: 1;
		height: 30px;
		box-sizing: border-box;
		flex-direction: row;
		flex-wrap: nowrap;
		border-radius: 15px;
		background: #edeeee;
	}

	.search-icon {
		width: 15px;
		height: 15px;
		margin-left: 15px;
		margin-top: 7.5px;
		font-size: 15px;
	}

	.top-input {
		flex: 1;
		line-height: 25px;
		margin-left: 5px;
		margin-right: 25px;
		font-size: $uni-font-size-sm;
		color: #ffffff;
	}

	.top-title {
		width: 100%;
		line-height: 25px;
		font-size: $uni-font-size-xl;
		color: #ffffff;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-right: 15px;
	}

	.top-right-icon {
		width: auto;
		height: 25px;
		margin-left: 15px;
		margin-right: 15px;
		align-items: center;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	.right-icon {
		width: 20px;
		height: 20px;
		font-size: 20px;
		line-height: 20px;
		font-weight: 100;
		margin-left: 0px;
	}

	.top-msg {
		align-self: center;
		display: flex;
		flex-direction: row;
	}

	.msg-icon {
		margin-right: 0px;
		margin-left: 8px;
		align-self: center;
	}

	.msg-bage {
		height: 16px;
		width: 16px;
		line-height: 16px;
		font-size: 9px;
		color: #ffffff;
		text-align: center;
		background-color: #ff0000;
		border-radius: 50%;
		transform: translate(-60%, -50%) !important;
	}

	.list-container {
		width: calc(100% - 30px);
		margin: 15px;
		position: absolute;
		top: calc(44px + var(--status-bar-height));
		left: 0px;
		overflow: auto;
	}

	.menu-container {
		width: 100%;
		box-sizing: border-box;
		overflow: auto;
		border-radius: 4px;
		background: #ffffff;
		box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
	}

	.tag-text {
		width: auto;
		height: auto;
		margin-left: 15px;
		padding-top: 16px;
		padding-bottom: 16px;
		font-size: $uni-text-color;
		color: #111111;
	}

	.menu-item-container {
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		min-height: 252px;
		align-items: flex-start;

	}

	.menu-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 25%;
		justify-content: center;
	}

	.menu-item-c {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.item-image {
		width: 25px;
		height: 25px;
		color: $uni-color-primary;
		font-size: 26px;
	}

	.item-image-lg {
		width: 25px;
		height: 25px;
		color: $uni-color-primary;
		font-size: 26px;
		padding: 8px;
		background-color: #f5e4e5;
		border-radius: 4px;
	}

	.item-title {
		font-size: $uni-font-size-sm;
		margin-top: 9px;
		margin-bottom: 20px;
		color: $uni-text-color;
	}

	.schedule-content {
		height: 105px;
		width: 100%;
		box-sizing: border-box;
		overflow: auto;
		border-radius: 4px;
		background: #ffffff;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.schedule-text {
		display: flex;
		flex-direction: column;
		padding-left: 22px;
	}

	.text-warning {
		font-size: 18px;
		font-weight: 500;
		color: #fca01f;
	}

	.text-content {
		font-size: $uni-font-size-sm;
		color: $uni-text-color-gray;
		padding-top: 13px;
	}

	.schedule-num {
		background: #fca01f;
		width: 75px;
		height: 75px;
		border-radius: 20px;
		margin-right: 15px;
		line-height: 75px;
		text-align: center;
	}

	.text-num {
		font-size: 25px;
		color: #ffffff;
		font-weight: 500;
	}

	.more-function {
		width: calc(100% - 16px);
		text-align: center;
		color: $uni-text-color-gray;
		font-size: $uni-font-size-sm;
		padding: 8px;
		margin-top: 24px;
	}

	.notice-title-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.more-tag {
		color: $uni-text-color-gray;
		font-size: $uni-font-size-sm;
		margin-right: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
	}

	.more-arrow {
		font-size: $uni-font-size-lg;
		padding: 0px;
		color: $uni-text-color-gray;
	}

	.notice-content {
		width: 100%;
		box-sizing: border-box;
		overflow: auto;
		border-radius: 4px;
		background: #ffffff;
	}

	.notice-item {
		display: flex;
		flex-direction: column;
		padding-left: 15px;
		padding-top: 15px;
		padding-right: 15px;
	}

	.title-content {
		display: flex;
		flex-direction: row;
	}

	.hot-tag {
		width: 29px;
		height: 16px;
		min-width: 29px;
		font-size: 10px;
		color: #ffffff;
		background: $uni-color-primary;
		align-self: center;
		line-height: 16px;
		text-align: center;
		border-radius: 8px 8px 8px 0px;
		box-sizing: border-box;
	}

	.title {
		font-size: $uni-font-size-base;
	}

	.first-title {
		font-size: $uni-font-size-base;
		margin-left: 9px;
	}

	.date {
		margin-top: 12px;
		color: $uni-text-color-gray;
		opacity: 0.4;
		font-size: $uni-font-size-sm;
	}

	.line {
		width: 100%;
		background: $uni-bg-color-grey;
		opacity: 0.56;
		height: 1px;
		margin-top: 12px;
	}
</style>
