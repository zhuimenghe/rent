<template>
	<view class=".proceeds-list-bg" >
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view" :style="{top:posTop+'px'}">
			<view class="row-line bg-page" style="padding: 10px;z-index:200">
				<view :class="{ 'unselect-style': selectType != 'proceed', 'select-style': selectType === 'proceed' }" @click="proceedChange('proceed')">
					<text>收款记录</text>
				</view>
				<view :class="{ 'unselect-style': selectType != 'contract', 'select-style': selectType === 'contract' }" @click="proceedChange('contract')">
					<text>合同收款</text>
				</view>
				<view :class="{ 'unselect-style': selectType != 'customer', 'select-style': selectType === 'customer' }" @click="proceedChange('customer')">
					<text>客户收款</text>
				</view>
			</view>
			<moreQueryView 
			:isExportList='false' 
			:isQueryOrg="false" 
			:isQueryState="false" 
			:isQueryTime="true" 
			:hint="hint"
			 @setMore="setMore" 
			 :isControlMore="true" 
			 :isControlShow="isControlShow" 
			 @reset='reset' 
			 @query="query" @exportExcel="exportExcel" >
			 <block>
				 <view class="filter-right-view" style="flex: 1;" @click="changeGroup" v-if="selectType!='customer'">
				 	<mycheckbox :checked="isonly" style="transform: scale(0.8);" />
				 	<text >{{ '不显示已结清' }}</text>
				 	<view class="zw-style" style="transform: scale(0.8);"/>
				 </view>
			 </block>
			 </moreQueryView>
		</view>
		<list class="list-view" v-if="selectType === 'proceed'">
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
							{{item.businessNo}}&nbsp;|&nbsp;{{item.customerSalesmanName}}&nbsp;|&nbsp;{{item.orgName}}
						</view>
					</block>
					<block slot="content">
						<view>
							<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
								<view class="row-line" style="color: #999999;">
									收款日期：
								</view>
								{{ changestr(item.receiptDate) }}
							</view>
							<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
								<view class="row-line" style="color: #999999;">
									收款总额：
								</view>
								￥{{saveTwo(item.total)}}
							</view>
							<view class="row-line" style="text-align: center;height: 20px;margin-right: 2px;">
								<view class="row-line" style="color: #999999;">
									收款方式：
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
			<cell>
				<uni-load-more iconType="auto" :status="morestatus" />
			</cell>
		</list>

		<list class="list-view" v-if="selectType === 'contract'">
			<cell  v-for="(item, index) in datalistContract" :key="index">
				<businessItemFrame :stateName="item.stateName || ''" 
				 :showAttachment="false" :showContent="false" :isShowState="false">
					<block slot="title">
						<view>{{item.customerName || "-"}}-{{item.projectName || "-"}}</view>
					</block>
					<block slot="subContent">
						<view class="max-one-line">
							{{item.customerSalesmanName}}&nbsp;|&nbsp;{{item.orgName}}
						</view>
					</block>
					<block slot="contentList">
						<view>
							 <view class="row-line-between">
								<view style="font-size: 14px;">
									<text style="color: #999999;">收款总额:</text>
									<text style="margin-left:2px;color: #666666;">{{saveTwo(item.collectionTotal)}}</text>
								</view>
								<i class="iconfont" :class="item.expandArrow ? 'iconarrow-up' : 'iconarrow-down'" style="font-size: 15px;" @click.stop="expendArrow(item,index)" ref="expandArrow">
									
								</i>
							</view>
							<view  v-if="item.expandArrow">
								<view  v-for="(itemList, indexList) in item.proceedList" 
								style="background-color: #f5f6f8;padding: 4px;border-radius: 4px;margin-bottom: 4px;">
									<view class="row-line" style="font-size: 13px;line-height: 20px;">
										<text style="color: #999999;">收款日期:</text>
										<text style="margin-left:2px;color: #666666;">{{changestr(itemList.receiptDate)}}</text>
									</view>
									<view class="row-line" style="font-size: 13px;line-height: 20px;">
										<text style="color: #999999;">收款总额:</text>
										<text style="margin-left:2px;color: #666666;">{{saveTwo(itemList.total)}}</text>
									</view>
									<view class="row-line" style="font-size: 13px;line-height: 20px;">
										<text style="color: #999999;">收款方式:</text>
										<text style="margin-left:2px;color: #666666;">{{itemList.typeName || ""}}</text>
									</view>
									<view class="row-line" style="font-size: 13px;line-height: 20px;">
										<text style="color: #999999;">收款单号:</text>
										<text style="margin-left:2px;color: #E60000;" @click.stop="gotodetail(itemList)">{{itemList.businessNo || ""}}</text>
									</view>
									
								</view>
								
							</view>
							
						</view>
					</block>

				</businessItemFrame>
			</cell>
			<cell>
				<uni-load-more iconType="auto" :status="morestatus" />
			</cell>
		</list>

		<list class="list-view" v-if="selectType === 'customer'">
			<cell  v-for="(item, index) in datalistCustom" :key="index">
				<businessItemFrame :stateName="item.stateName || ''" 
				 :showAttachment="false" :showContent="false" :isShowState="false">
					<block slot="title">
						<view>{{item.customerName || "--"}}</view>
					</block>
					<block slot="subContent">
						<view class="max-one-line">
							{{item.customerSalesmanName|| "-"}}&nbsp;|&nbsp;{{item.orgName|| "-"}}
						</view>
					</block>
					<block slot="contentList">
						<view>
							 <view class="row-line-between">
								<view style="font-size: 14px;">
									<text style="color: #999999;">收款总计:</text>
									<text style="margin-left:2px;color: #666666;">{{saveTwo(item.collectionTotal)}}</text>
								</view>
								<i class="iconfont" :class="item.expandArrow ? 'iconarrow-up' : 'iconarrow-down'" style="font-size: 15px;" @click.stop="expendArrow(item,index)" ref="expandArrow">
								
								</i>
							</view>
							<view  v-if="item.expandArrow">
								<view  v-for="(itemList, indexList) in item.proceedList" 
								style="background-color: #f5f6f8;padding: 4px;border-radius: 4px;margin-bottom: 4px;">
									<view class="row-line" style="font-size: 13px;line-height: 20px;">
										<text style="color: #999999;">收款日期:</text>
										<text style="margin-left:2px;color: #666666;">{{changestr(itemList.receiptDate)}}</text>
									</view>
									<view class="row-line" style="font-size: 13px;line-height: 20px;">
										<text style="color: #999999;">收款总额:</text>
										<text style="margin-left:2px;color: #666666;">{{saveTwo(itemList.total)}}</text>
									</view>
									<view class="row-line" style="font-size: 13px;line-height: 20px;">
										<text style="color: #999999;">收款方式:</text>
										<text style="margin-left:2px;color: #666666;">{{itemList.typeName || ""}}</text>
									</view>
									
								</view>
								
							</view>
							
						</view>
					</block>
				
				</businessItemFrame>

			</cell>
			<cell>
				<uni-load-more iconType="auto" :status="morestatus" />
			</cell>
		</list>

	</view>
</template>

<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import taskBtn from '@/common/common-method/task_common_btn.vue';
	import moreQueryView from '@/components/common/common-ui/business-query-bar.vue';
	import businessItemFrame from '@/components/common/common-ui/business-item-frame.vue';
	import {mapState} from 'vuex'
	let timer;
	export default {
		components: {
			uniLoadMore,
			taskBtn,
			moreQueryView,
			businessItemFrame
		},
		data() {
			return {
				currentpage: 1,
				datalist: [],
				datalistContract: [],
				datalistCustom: [],
				morestatus: 'loading',
				searchKey: "",
				startTime: '', //筛选的开始时间
				endTime: '', //筛选的结束时间
				pickType: '',
				selectType: 'proceed',
				isonly: false,
				totalCount: '100',
				salesmanObj: {
					label: '',
					value: ''
				},
				hint: '合同名称',
				isControlShow: false
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
			this.$gxfmethod.statisticData(this.$eventId.Settle_Administrative,"收款管理","合同/客户/收款记录列表");
			uni.getStorage({
				key: this.$savekey.USER_INFO_MEG,
				success: (res) => {
					this.userid = res.data.id;
				}
			});
		},
		methods: {
			setMore(val) {
				this.isControlShow = val
			},
			reset(val) {
				this.isControlShow = false;
				this.searchKey = "";
				this.salesmanObj = {};
				this.startTime = ""
				this.endTime = ""
				this.isonly = false
				this.headerrefresh();
			},
			query(val) {
				this.isControlShow = false;
				this.searchKey = val.contractName;
				this.salesmanObj = val.salesmanObj;
				this.startTime = val.startDate
				this.endTime = val.endDate
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
				this.datalistContract = [];
				this.datalistCustom = [];
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
					contractName: this.selectType != 'customer' && this.searchKey ? this.searchKey : undefined,
					customerName: this.selectType == 'customer' && this.searchKey ? this.searchKey : undefined,
					customerSalesman: this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined,
					queryType: this.selectType,
					contractStateType: this.selectType != 'customer' ? (this.isonly ? '1' : undefined) : undefined,
					beginDate: this.startTime ? this.startTime + ' 00:00:00' : undefined,
					endDate: this.endTime ? this.endTime + ' 23:59:59' : undefined
				};
				let url = this.$url.SETTLE_PROCEEDS_PAGE;
				if (this.selectType === 'contract') {
					url = this.$url.SETTLE_PROCEEDS_CONTRACT_PAGE;
				} else if (this.selectType === 'customer') {
					url = this.$url.SETTLE_PROCEEDS_CUSTOMER_PAGE;
				}
				this.$network
					.getData(url, 'POST', param)
					.then(result => {
						if (this.selectType === 'proceed') {
							this.datalist = this.datalist.concat(result.records);
						} else if (this.selectType === 'contract') {
							this.datalistContract = this.datalistContract.concat(result.records);
						} else if (this.selectType === 'customer') {
							this.datalistCustom = this.datalistCustom.concat(result.records);
						}
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
			gotoContractDetail(item) {
				uni.navigateTo({
					url: '/contractPages/contract/contract-detail?businessNo=' + item.contractNo
				});
			},
			//其他页面跳转过来调用
			businessProceed(type, contractName, salesmanObj, beginDate, endDate) {
				setTimeout(() => {
					uni.$emit('business-query-notify', {
						contractName: contractName,
						salesmanObj: salesmanObj,
						startDate: beginDate,
						endDate: endDate
					})
					console.log(beginDate)
					this.searchKey = contractName;
					this.salesmanObj.label = salesmanObj.label
					this.salesmanObj.value = salesmanObj.value
					this.startTime = beginDate
					this.endTime = endDate
					this.selectType = type;
					this.hint = this.selectType == 'customer' ? '客戶名称' : '合同名称'
					this.headerrefresh()
				}, 100)

			},
			//tab
			proceedChange(type) {
				if (type === this.selectType) {
					return
				}
				this.isControlShow = false;
				uni.showLoading()
				this.searchKey = '';
				this.selectType = type;
				this.currentpage = 1;
				this.salesmanObj = {};
				this.startTime = ""
				this.endTime = ""
				uni.$emit('business-query-notify', {
					contractName: '',
					salesmanObj: {},
					beginDate: "",
					endDate: ""
				})
				this.datalist = [];
				this.datalistContract = [];
				this.datalistCustom = [];
				this.hint = this.selectType == 'customer' ? '客戶名称' : '合同名称'
				this.loaddata();
			},
			//复选框
			changeGroup() {
				uni.showLoading()
				this.isonly = !this.isonly
				this.currentpage = 1;
				this.datalist = [];
				this.datalistContract = [];
				this.datalistCustom = [];
				this.loaddata();
			},
			goToAdd() {
				this.$gxfmethod.statisticData(this.$eventId.Settle_Administrative,"收款管理","新增收款");
				uni.navigateTo({
					url: '/businessPages/invoice/contract-choose?type=proceed&state=5,6,7,8&title=选择收款合同&isFirst=true'
				})
			},
			gotodetail(item) {
				let businessNostr = item.businessNo;
				let url = '/businessPages/proceed/porceeds-detail?businessNo=' + businessNostr;
				uni.navigateTo({
					url: url
				});
			},			
			editCreate(item) {
				uni.navigateTo({
					url: '/businessPages/proceed/creat-proceeds?item=' + encodeURIComponent(JSON.stringify(item)) + "&backType=2"
				});
			},
			expendArrow(item, index) {
				if (this.selectType === 'proceed') {
					this.datalist.splice(index, 1, {
						...item,
						expandArrow: !item.expandArrow
					})
				} else if (this.selectType === 'contract') {
					this.datalistContract.splice(index, 1, {
						...item,
						expandArrow: !item.expandArrow
					})
				} else {
					this.datalistCustom.splice(index, 1, {
						...item,
						expandArrow: !item.expandArrow
					})
				}
			},
			exportExcel() {
				uni.showLoading({
					title: '正在下载中,请稍等...',
					mask: true,
				})

				let param = {
					"current": 1,
					"size": this.totalCount,
					contractName: this.selectType != 'customer' ? this.searchKey : undefined,
					customerName: this.selectType != 'customer' ? undefined : this.searchKey,
					queryType: this.selectType,
					contractStateType: this.selectType != 'customer' ? (this.isonly ? '1' : undefined) : undefined,
					beginDate: this.startTime != '' ? this.startTime + ' 00:00:00' : undefined,
					endDate: this.endTime != '' ? this.endTime + ' 23:59:59' : undefined,
					customerSalesman: this.salesmanObj && this.salesmanObj.value ? this.salesmanObj.value : undefined,
				};
				let urls = this.$url.SETTLE_PROCEEDS_PAGE;
				if (this.selectType === 'contract') {
					urls = this.$url.SETTLE_PROCEEDS_CONTRACT_PAGE;
				} else if (this.selectType === 'customer') {
					urls = this.$url.SETTLE_PROCEEDS_CUSTOMER_PAGE;
				}
				let url = this.$gxfmethod.getUrl(urls)
				console.log(url)
				let filename = this.$gxfmethod.getFileName("收款记录列表-")
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
						"&isedit=" + isedit + "&type=userapi" + "&filetype=proceed_type"
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	//背景视图
	.proceeds-list-bg {
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
		margin-top: calc(108px);
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

	.filter-container {
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 299;
		background: #ffffff;
	}

	.filter-right-view {
		display: flex;
		margin: 10px;
		flex: 1;
		flex-direction: row;
		z-index: 299;
		background: #ffffff;
		font-size: $uni-font-size-sm;
		align-items: center;
	}


	.select-style {
		background: $uni-color-primary;
		font-size: $uni-font-size-sm;
		color: #fffdef;
		align-items: center;
		justify-content: center;
		padding: 4px 5px;
		border-radius: 15px;
		border: 1px solid $uni-color-primary;
		margin-right: 5px;
	}

	.unselect-style {
		background: #ffffff;
		font-size: $uni-font-size-sm;
		color: $uni-color-primary;
		align-items: center;
		justify-content: center;
		padding: 4px 5px;
		border-radius: 15px;
		border: 1px solid $uni-color-primary;
		margin-right: 5px;
	}

	.zw-style {
		display: flex;
		width: 20px;
		height: 20px;
		border-radius: 3px;
	}
	
</style>
