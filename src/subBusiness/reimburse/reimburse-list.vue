<template>
	<view class="reimburse-list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view" :style="{top:posTop+'px'}">
			<moreQueryView 
			:isExportList='false'
			:isQueryOrg="false"
			:isQueryState="false" 
			:isQueryTime="true"
			hint="合同名称" 
			@reset='reset' 
			@query="query" 
			@exportExcel="exportExcel" 
			/>
		</view>
		<list class="list-view">
				<cell v-for="(item, index) in datalist" :key="index">
					<businessItemFrame 
					:stateName="item.stateName || ''"
					:showAttachment="true"
					:attachmentNum="item.fileListNum ? item.fileListNum : 0"
					@addPic="goImg(item)"
					>
						<block slot="title">
							<view>{{item.customerName || ""}}-{{item.projectName || ""}}</view>
						</block>
						<block slot="subContent">
							<view class="max-one-line">
								{{item.businessNo?item.businessNo+" | ":''}}{{item.customerSalesmanName|| "-"}}&nbsp;|&nbsp;{{item.orgName|| "-"}}
							</view>
						</block>
						<block slot="content">
							<view>
								<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
									<view class="row-line" style="color: #999999;">
										退款日期：
									</view>
									{{ changestr(item.refundTime) }}
								</view>
								<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
									<view class="row-line" style="color: #999999;">
										退款总额：
									</view>
									￥{{saveTwo(item.total)}}
								</view>
								<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
									<view class="row-line" style="color: #999999;">
										退款方式：
									</view>
									{{item.typeName || ""}}
								</view>
					
							</view>
						</block>
						<block slot="options">
							<view class="row-line">
								<taskBtn :itemData="item" :isBorder="true" />
								<view class="option-btn" @click.stop="editCreate(item)" v-if="ishowupdata(item)">修改</view>
								<view class="option-btn" @click.stop="gotodetail(item)">详情</view>
							</view>
						</block>
					</businessItemFrame>
					
				</cell>
				<view>
					<uni-load-more iconType="auto" :status="morestatus" />
				</view>
			</list>
		
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false" ref="date"
		 themeColor="#E60000" />
	</view>
</template>
<script>
	import filterView from '@/components/common/common-ui/filter-view.vue';
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import labelArrow from '@/components/common/common-ui/label-arrow.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import taskBtn from '@/common/common-method/task_common_btn.vue';
	import moreQueryView from '@/components/common/common-ui/business-query-bar.vue';
	import businessItemFrame from '@/components/common/common-ui/business-item-frame.vue';
	import {mapState} from 'vuex'

	export default {
		components: {
			filterView,
			uniLoadMore,
			labelArrow,
			wPicker,
			taskBtn,
			moreQueryView,
			businessItemFrame
		},
		data() {
			return {
				currentpage: 1,
				datalist: [],
				morestatus: 'loading',
				searchKey: '',
				startTime: '', //筛选的开始时间
				endTime: '', //筛选的结束时间
				pickType: '',
				userid: '',
				totalCount: '100',
				salesmanObj:{}
			};
		},
		computed:{
			...mapState('system',{
				posTop:s=>s.statusBarHeight+s.titleBarHeight,
			}),
		},
		mounted() {
			uni.showLoading();
			this.loaddata();
		},
		created() {
			this.$gxfmethod.statisticData(this.$eventId.Settle_Administrative,"退款管理","退款记录列表");
			uni.getStorage({
				key: this.$savekey.USER_INFO_MEG,
				success: (res) => {
					this.userid = res.data.id;
				}
			});
		},
		methods: {
			reset(val) {
				this.searchKey = "";
				this.salesmanObj = {};
				this.startTime =""
				this.endTime = ""
				this.headerrefresh();
			},
			query(val) {
				console.log(val)
				this.searchKey = val.contractName;
				this.salesmanObj = val.salesmanObj;
				this.startTime  = val.startDate;
				this.endTime = val.endDate;
				this.headerrefresh();
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
			changestr(str) {
				if (str == null) {
					return '';
				}
				return str.split(' ')[0];
			},
			saveTwo(num) {
				return this.$datestr.doubleFloat(num);
			},
			headerrefresh() {
				this.currentpage = 1;
				this.datalist = [];
				this.loaddata();
			},
			footerrefresh() {
				if (this.morestatus == 'noMore') {
					return;
				}
				this.currentpage += 1;
				this.morestatus = 'loading';
				this.loaddata();
			},
			loaddata() {
				let param = {
					current: this.currentpage,
					size: 10,
					contractName: this.searchKey,
					customerSalesman: this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined,
					beginDate:this.startTime? this.startTime+ ' 00:00:00':undefined,
					endDate:this.endTime?this.endTime + ' 23:59:59':undefined
				};
				this.$network
					.getData(this.$url.SETTLE_REIMBURSE_LIST, 'POST', param)
					.then(result => {
						this.datalist = this.datalist.concat(result.records);
						console.log(this.datalist ,'this.datalist ');
						let pages = result.pages;
						if (pages <= this.currentpage) {
							this.morestatus = 'noMore';
						} else {
							this.morestatus = 'more';
						}
						this.totalCount = result.total;
						uni.stopPullDownRefresh();
						uni.hideLoading();
					})
					.catch(err => {
						this.morestatus = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			goToAdd() {
				this.$gxfmethod.statisticData(this.$eventId.Settle_Administrative,"退款管理","新增退款");
				uni.navigateTo({
					url: '/businessPages/invoice/contract-choose?type=refund&state=5,6,7,8&title=选择退款合同&isFirst=true'
				});
			},
			gotodetail(item) {
				let businessNostr = item.businessNo;
				let url = '/businessPages/reimburse/reimburse-detail?businessNo=' + businessNostr;
				uni.navigateTo({
					url: url
				});
			},
			showPick(type) {
				this.pickType = type;
				switch (type) {
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
					case 'startTime':
						this.startTime = val.result;
						break;
					case 'endTime':
						this.endTime = val.result;
						break;
					default:
						break;
				}
				uni.pageScrollTo({
					scrollTop: self.curScrollTop,
					duration: 300
				});
			},
			
			editCreate(item) {
				uni.navigateTo({
					url: '/businessPages/reimburse/creat-reimburse?item=' + encodeURIComponent(JSON.stringify(item)) + "&backType=2"
				});
			},
			exportExcel() {
				uni.showLoading({
					title: '正在下载中,请稍等...',
					mask: true,
				})

				let param = {
					"current": 1,
					"size": this.totalCount,
					contractName: this.searchKey,
					customerSalesman: this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined,
					beginDate: this.startTime != '' ? this.startTime + ' 00:00:00' : undefined,
					endDate: this.endTime != '' ? this.endTime + ' 23:59:59' : undefined,
				};
				let url = this.$gxfmethod.getUrl(this.$url.SETTLE_REIMBURSE_LIST)
				console.log(url)
				let filename = this.$gxfmethod.getFileName("退款记录列表-")
				this.$gxfmethod.downFunc(url, 'POST', param, filename)
			},
			goImg(item){
				let isedit = true;
				if (item.canUploadFile == '0') {
					isedit = false
				} else {
					isedit = true
				}
				uni.navigateTo({
					url: "../../components/common/image-upload/upload_zb_apendix?item=" + encodeURIComponent(JSON.stringify(item)) +
						"&isedit=" + isedit + "&type=userapi" + "&filetype=refund_type"
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	//背景视图
	.reimburse-list-bg {
		display: flex;
		flex: 1;
		width: 100%;
		height: 100%;
		background: $uni-bg-color-grey;
	}



	//列表
	.list-view {
		display: flex;
		flex: 1;
		flex-direction: column;
		background: $uni-bg-color-grey;
		margin-top: calc( 55px);
	}


	.top-view {
		z-index: 100;
		position: fixed;
		display: flex;
		flex-direction: column;
		width: 100%;
		left: 0px;
		margin-bottom: 1px;
		background: #ffffff;
	}
</style>
