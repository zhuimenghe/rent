<template>
	<view class="list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">异常记录</c-nav-bar-btns>
		<c-search-bar placeholder="故障描述" :value="searchKey" @input="searchKeyInput" @clear="onClear" @ok="loaddata(true)">
      <view class="flex margin-tb padding-lr-sm" hover-class="none" :hover-stop-propagation="false">
        <selectView class="flex-sub" :value='startTime' hint='开始时间' @clickSelect="showPick('startTime')" />
        <selectView class="flex-sub" :value='endTime' hint='结束时间' @clickSelect="showPick('endTime')" />
      </view>
			<view class="flex margin-tb padding-lr-sm" hover-class="none" :hover-stop-propagation="false">
        <selectView class="flex-sub" :value='levelObj.label' hint='异常等级' @clickSelect="showPick('level')" />
				<view class="flex-sub" style="padding: 0px 4px;"></view>
        <!-- <selectView class="flex-sub" :value='overObj.label' hint='消除状态' @clickSelect="showPick('over')" /> -->
      </view>
    </c-search-bar>
		<c-loadmore-list scroll-y class="list-sub-view flex-scroll-wrapper" :loadMoreStatus="morestatus" @loadmore="onReachBottom">
      <view class="card" v-for="(item, index) in datalist" :key="index">
				<view class="line ml justify-between">
					<text class="text-lg text-bold">{{item.faultName}}</text>
					<text :class="[levelClasses[item.level]]">{{item.level | levelName}}</text>
				</view>
				<view class="line justify-between">
					<text>故障码：{{item.faultType}}</text>
					<text>持续时长：{{item.duration}}s</text>
				</view>
				<view class="line">发生时间：{{item.startTime}}</view>
				<view class="line">消除时间：{{item.endTime}}</view>
			</view>
    </c-loadmore-list>
    <c-w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="true" ref="date"
		 themeColor="#E60000" />
	</view>
</template>

<script>
	import filterView from '@/components/common/common-ui/filter-view.vue';
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import labelArrow from '@/components/common/common-ui/label-arrow.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import selector from '@/components/common/selector/selector.vue';
	import selectView from '@/components/common/common-ui/selector-view.vue';
import {debounce} from '@/common/util/util';
import { mapState } from 'vuex';
	var timer;
	export default {
		components: {
			filterView,
			uniLoadMore,
			labelArrow,
			wPicker,
			selector,
			selectView
		},
		filters:{
			levelName(l){
				var map = {
					1:'警示',
					2:'轻微故障',
					3:'一般故障',
					4:'严重故障',
				}
				return map[l]
			}
		},
		data() {
			return {
				levelClasses:{
					1:'text-success',
					2:'text-warn',
					3:'text-warn',
					4:'text-error',
				},
				navBtns: [
						{
								// "text": "导出",
								// "type": "none",
								// "fontSize": "14px",
								// "color": "#E60000",
								// "width": "auto"
						}
				],
				//异常等级
				levelList:[{
					label:'警示',
					value:1
				},{
					label:'轻微故障',
					value:2
				},{
					label:'一般故障',
					value:3
				},{
					label:'严重故障',
					value:4
				}],
				levelObj:{},
				//消除状态
				overList:[{
					label:'已消除',
					value:1
				},{
					label:'未消除',
					value:2
				}],
				overObj:{},
				selectList:[],
				licenseId: '',
				currentpage: 1,
				datalist: [],
				morestatus: 'more',

				searchKey: "",
				startTime: '', //筛选的开始时间
				endTime: '', //筛选的结束时间

				pickType: '',
				isshow: false,

				downloadTask: null,
				clearIndex: {
					id: 0,
					text: '未消除',
					value: false
				},
			};
		},
		computed:{
			...mapState('system',['navBarHeight'])
		},
		watch: {
			searchKey: {
				handler(val) {
					if (timer) {
						clearTimeout(timer);
					}
					timer = setTimeout(() => {
						this.searchKey = val;
						this.currentpage = 1;
						this.datalist = [];
						this.loaddata();
					}, 500)
				}
			}
		},
		onLoad(option) {
			uni.showLoading();
			this.licenseId = option.licenseId;
			console.log(this.licenseId)
			// this.startTime =this.$datestr.getDateRange(new Date(), 6, true, 'yyyy-MM-dd')
			// this.endTime = this.$datestr.dateFormat(new Date(), 'yyyy-MM-dd')
			this.loaddata();
		},
		onUnload() {
			if (this.downloadTask) {
				this.downloadTask.abort()
			}
		},
		onPullDownRefresh() {
			this.loaddata(true);
		},
		onReachBottom() {
			if (this.morestatus == 'noMore') {
				return;
			}
			this.currentpage += 1;
			this.morestatus = 'loading';
			this.loaddata();
		},
		methods: {
			searchKeyInput:debounce(function(val){
				this.searchKey = val
				this.loadmore(true)
			},500),
			onClear(){
				this.searchKey = ''
				this.startTime=''
				this.endTime=''
				this.levelObj={}
				this.loaddata(true)
			},
			onNavBarButtonTap() {
				uni.getStorage({
					key: this.$savekey.USER_PRIVILEGES_MEG,
					success: res => {
						let isDownload = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_DEVICE);
						if (isDownload) {
							if (this.datalist.length <= 0) {
								uni.showToast({
									icon: 'none',
									title: "未查到数据,不能导出"
								})
								return
							}
							let headerDic = {
								'Content-Type': 'application/json',
								'Authorization': '',
							};
							let loginMes = uni.getStorageSync(this.$savekey.LOGIN_MEG);
							if (loginMes) {
								let access_token = loginMes.token_type + " " + loginMes.access_token;
								headerDic.Authorization = access_token;
								this.downDocument(headerDic)
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: "暂无导出权限"
							})
						}
					}

				});

			},
			clearChange(e){
				this.clearIndex = e
			},
			downDocument(headerDic) {
				uni.showLoading()
				let url = this.$url.BASE_URL +
					"machineapi/api/machine/monitor/exportExcel/" +
					this.licenseId +
					"/machineMalfunction?keyWord=" +
					this.searchKey
				if (this.startTime != '' && this.endTime != '') {
					let startDate = this.startTime === "" ? "" : this.startTime + " 00:00:00"
					let zystartDate = "&startDate=" + encodeURIComponent(startDate)
					let endDate = this.endTime === "" ? "" : this.endTime + " 23:59:59"
					let zyendDate = "&endDate=" + encodeURIComponent(endDate)
					console.log(zystartDate)
					console.log(zyendDate)
					url = url + zystartDate + zyendDate
				}
				console.log(url)
				if (this.downloadTask) {
					this.downloadTask.abort();
				}
				this.downloadTask = uni.downloadFile({
					url: url,
					header: headerDic,
					success: (res) => {
						console.log(res)
						let filePath = res.tempFilePath;
						uni.openDocument({
              filePath: filePath,
              success: function(res) {
                uni.hideLoading()
              },
              fail: (error) => {
                uni.showToast({
                  icon: "none",
                  title: "导出文档失败"
                })
              }
            });
					},
					fail: (error) => {
						console.log(error)
						uni.showToast({
							icon: "none",
							title: "报表下载失败"
						})
					}
				});
			},
			changestr(str) {
				if (str == null) {
					return '--';
				}
				return str.split(' ')[0];
			},
			getDate(s) {
				if (!s) {
					return "--"
				}
				return this.$datestr.doubleFloat(s / 3600) + '小时';
			},
			async loaddata(refresh=false) {
				if(refresh){
					this.currentpage = 1;
					this.datalist = [];
				}
				let pageSize = 20
				let queryDic = {
					pageNum: this.currentpage,
					pageSize,
					licenseId: this.licenseId,
					keywords: this.searchKey,
					level:this.levelObj ? this.levelObj.value : ''
				};
				if (this.startTime) {
					queryDic = {
						...queryDic,
						startDate: this.startTime,
					}
				}
				if(this.endTime){
					queryDic = {
						...queryDic,
						endDate: this.endTime
					}
				}
				let result = await this.$network.historicalFaults( queryDic)
				this.datalist = this.datalist.concat(result.rows||[]);
				if (result.rows&&result.rows.length<pageSize) {
					this.status = 'noMore';
				} else {
					this.status = 'more';
				}
				uni.stopPullDownRefresh();
				uni.hideLoading();
			},
			searchChange(val) {
				this.searchKey = val.detail.value;
				this.currentpage = 1;
				this.datalist = [];
				this.loaddata();
			},
			//加载时间
			showPick(type) {
				this.pickType = type;
				switch (type) {
					case 'level':
						this.selectList = this.levelList
						this.$refs.selector.show();
						break;
					case 'over':
						this.selectList = this.overList
						this.$refs.selector.show();
						break;
					case 'startTime':
						this.$refs.date.show();
						break;
					case 'endTime':
						this.$refs.date.show();
						break;
					default:
						break;
				}
			},
			onConfirm(val) {
				let self = this;
				switch (this.pickType) {
					case 'level':
						this.levelObj = val.checkArr;
						break;
					case 'over':
						this.overObj = val.checkArr;
						break;
					case 'startTime':
						this.startTime = val.result;
						break;
					case 'endTime':
						this.endTime = val.result;
						break;
					default:
						break;
				}
			},
		}
	};
</script>

<style lang="scss" scoped>
	//背景视图
	.list-bg {
		// display: flex;
		width: 100%;
		height:100%;
		background: $uni-bg-color-grey;
		@include flex(column);
	}

	//列表的subview
	.list-sub-view {
		background: $uni-bg-color-grey;
		// margin-top: 55px;
	}

	//列表cell
	.card {
		margin: 24rpx;
		background: #ffffff;
		border-radius: 6rpx;
		padding:20rpx 24rpx;
		.line{
			@include flex(row,center,normal);
			margin-bottom:16rpx;
			&:last-child{
				margin-bottom:0;
			}
			.ml{
				margin-bottom:20rpx;
			}
		}
	}

</style>
