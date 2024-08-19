<template>
	<view class="claim-list-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="buttons" @onNavBarButtonTap="onNavBarButtonTap">物流公司</c-nav-bar-btns>
		<view class="top-view">
			<view class="search-container">
				<view class="search-box">
					<i class="iconfont search-icon iconzl--sousuo"></i>
					<view class="search-content">
						<input placeholder="公司名称/联系人/手机号" v-model="searchKey" style="flex:1;font-size: 14px;"/>
					</view>
				</view>
				<view class="export-css" @click="exportExcel" v-if="isExportList">
					<text>导出</text>
				</view>
			</view>
		</view>
		<c-loadmore-list scroll-y class=" flex-scroll-wrapper" :loadMoreStatus="morestatus" @loadmore="footerrefresh">
			<view class="list-view-cell" v-for="(item, index) in datalist" :key="index">
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>公司名称</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.name || "-"}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>联系人</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.contacts || "-"}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>联系电话</text></view>
					<view class="cell-text-right fontBlackcolor">
						<labelPhone :value="item.phoneNum"/>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>创建人</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.createName || "-"}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>创建时间</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ changestr(item.createTime)}}</text>
					</view>
				</view>
				<view class="line-s" />
				<view class="operate-container">
<!-- 						<view class="update-view"  @click="showDialog('update',item)">车辆管理</view>
					<view class="update-view" style="margin-left: 10px;" @click="showDialog('update',item)">司机管理</view>-->						
					<view class="update-view" style="margin-left: 10px;" @click="editCompany(item)" v-if="isPermissionEdit">修改</view>
					<view class="delete-view" style="margin-left: 10px;" @click="deleteItem(item)" v-if="isPermissionDelete">删除</view>
					<view class="delete-view" style="margin-left: 10px;" @click="gotoDetail(item)">详情</view>
				</view>
			</view>
		</c-loadmore-list>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
	import imgupload from '@/components/common/image-upload/image-upload.vue';
	import labelPhone from '@/components/common/common-ui/label-phone.vue';
	var timer;
	export default {
		components: {
			uniLoadMore,
			uniPopup,
			imgupload,
			labelPhone
		},
		data() {
			return {
				"buttons": [
						{
								"text": "新建",
								"type": "none",
								"fontSize": "14px",
								"color": "#E60000"
						}
				],
				currentpage: 1,
				datalist: [],
				morestatus: 'more',
				searchKey: "",
				startTime: '', //筛选的开始时间
				endTime: '', //筛选的结束时间
				pickType: '',
				isshow: false,
				tipTitle: "新建物流公司",
				dialogData: {
					name:'',
					contacts:'',
					phoneNum:''
				},
				operateType: 'create',
				isPermissionAdd:true,
				isPermissionEdit:true,
				isPermissionDelete:true,
				isExportList:true,
				totalCount:'100'
			};
		},
		mounted() {
			uni.showLoading();
			this.loaddata();
		},
		watch: {
			searchKey: {
				handler(val) {
					if(timer){
						clearTimeout(timer);
					}
					timer = setTimeout(() => {
						uni.showLoading()
						this.currentpage = 1;
						this.datalist = [];
						this.loaddata();
					}, 500);
					
				}
			}
		},
		created() {
			uni.getStorage({
				key: this.$savekey.USER_PRIVILEGES_MEG,
				success: res => {
					this.isPermissionAdd = res.data.some(x => x.value === this.$savekey.PERMISSION_LOGISTICS_COMPANY_ADD);
					this.isPermissionEdit = res.data.some(x => x.value === this.$savekey.PERMISSION_LOGISTICS_COMPANY_EDIT);
					this.isPermissionDelete = res.data.some(x => x.value === this.$savekey.PERMISSION_LOGISTICS_COMPANY_DELETE);
					//this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
				}
			});
			uni.$on('refreshData-company', userinfo=>{
				this.currentpage = 1;
				this.datalist = [];
				this.loaddata();
			});
			/*统计*/
			this.$gxfmethod.statisticData(this.$eventId.Logistics_Administrative,"物流公司","列表");
		},
		onPullDownRefresh() {
			this.headerrefresh()
		},
		onReachBottom() {
			this.footerrefresh()
		},
		methods: {
			onNavBarButtonTap() {
				uni.navigateTo({
					url:'/otherPages/logistics/logistics-company/create-company'
				})
				// if(this.isPermissionAdd){
				// 	this.showDialog('create', null)
				// }else{
				// 	uni.showToast({
				// 		icon:'none',
				// 		title:'暂无权限'
				// 	})
				// }
				
			},
			changestr(str) {
				if (str == null) {
					return '-';
				}
				return str.split(' ')[0];
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
					size: 4,
					businessKey: this.searchKey,
				};
				this.$network
					.getData(this.$url.CONTRACT_LOGISTICS_COMPANY_LIST, 'POST', param)
					.then(result => {
						this.datalist = this.datalist.concat(result.records);
						let pages = result.pages;
						this.totalCount = result.total.toString()
						if (pages <= this.currentpage) {
							this.morestatus = 'noMore';
						} else {
							this.morestatus = 'more';
						}
						uni.stopPullDownRefresh();
						uni.hideLoading();
					})
					.catch(err => {
						this.morestatus = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			showDialog(type, item) {
				this.operateType = type;
				if (type !== 'create') {
					this.dialogData = { ...item
					}
					this.tipTitle = "修改物流公司"
				} else {
					this.dialogData = {
						name:'',
						contacts:'',
						phoneNum:''
					}
					this.tipTitle = "新增物流公司"
				}
				this.$refs.companyDialog.open()
			},
			cancelDialog() {
				this.$refs.companyDialog.close()
			},
			confirmDialog() {
				if (!this.dialogData) {
					return
				}
				if (!this.dialogData.name) {
					uni.showToast({
						title: "请填写公司名称",
						icon: "none"
					})
					return
				}
				if (!this.dialogData.contacts) {
					uni.showToast({
						title: "请填写联系人",
						icon: "none"
					})
					return
				}
				if (!this.dialogData.phoneNum) {
					uni.showToast({
						title: "请填写联系电话",
						icon: "none"
					})
					return
				}
				switch (this.operateType) {
					case 'create':
						this.dealInfo('POST')
						break;
					case 'update':
						this.dealInfo('PUT')
						break;
					default:
						break;
				}
			},
			//上传图片回调
			uploadfinish(val) {
				let list = val.data;
				this.dialogData = {
					...this.dialogData,
					fileList: [...list]
				};
			},
			//删除回调
			deleteUrl(val) {
				let list = val.data;
				this.dialogData = {
					...this.dialogData,
					fileList: [...list]
				};
			},
			dealInfo(method) {
				this.$network
					.getData(this.$url.LOGISTICS_URL, method, this.dialogData)
					.then(result => {
						this.cancelDialog();
						this.headerrefresh();
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			editCompany(item){
				let url = "./company-updata?item=" +  encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url:url
				})
			},
			gotoDetail(item){
				let url = "./company-detail?item=" +  encodeURIComponent(JSON.stringify(item)); 
				uni.navigateTo({
					url:url
				})
			},
			deleteItem(item) {
				uni.showModal({
					title: '提示',
					content: '确定要删除' + item.name,
					success: (res)=>{
						if (res.confirm) {
							let urlstr = this.$url.DELETE_LOGISTICS_URL.replace(/{id}/, item.id);
							this.$network
								.getData(urlstr, 'DELETE', null)
								.then(result => {
									uni.showLoading()
									this.headerrefresh()
								})
								.catch(err => {
									uni.showToast({
										title:err.details&&err.details[0]?err.details[0]:'',
										icon:'none'
									})
								});
						} else if (res.cancel) {}
					}
				});
			},
			exportExcel(){
				uni.showLoading({
					title:'正在下载中,请稍等...',
					mask:true,
				})
				// let param = {
				// 	businessKey: this.searchKey,
				// };
				// let url= this.$url.CONTRACT_LOGISTICS_COMPANY_LIST + '?isExport=true&current=1&size='+ this.totalCount
				// let downurl = this.$gxfmethod.forEachObj(url,param)
				// console.log(downurl)
				let param = {
					current : 1,
					size : this.totalCount,
					businessKey: this.searchKey,
				};
				let url= this.$url.BASE_URL + this.$url.CONTRACT_LOGISTICS_COMPANY_LIST + '?isExport=true'
				let filename = this.$gxfmethod.getFileName('物流公司记录列表-');
				this.$gxfmethod.downFunc(url,'POST',param,filename)
			},
		},

	};
</script>

<style lang="scss" scoped>
	//背景视图
	.claim-list-bg {
		@include flex(column);
		width: 100%;
		height: 100%;
		background: $uni-bg-color-grey;
	}

	//添加按钮
	.add-container {
		position: fixed;
		display: flex;
		bottom: 32px;
		right: 16px;
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

	//搜索框
	.search-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		margin-bottom: 1px;
		width: 100%;
		z-index: 100;
		// position: fixed;
		top: 0;
		left: 0px;
	}
	.search-box {
		background: #F7F7F7;
		height: 35px;
		flex: 1;
		line-height: 35px;
		display: flex;
		margin: 8px 16px;
		flex-direction: row;
		padding-left: 16px;
		border-radius: 4px;
		justify-content: flex-start;
		align-items: center;
	}

	.search-icon {
		color: #999999;
		font-size: $uni-font-size-base;
	}

	.search-content {
		display: flex;
		flex: 1;
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 10px;
	}

	//列表的subview
	.list-sub-view {
		display: flex;
		flex: 1;
		background: $uni-bg-color-grey;
		margin-top: 55px;
	}

	//列表
	.list-view {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	//列表cell
	.list-view-cell {
		margin-left: 10px;
		margin-right: 10px;
		margin-top: 5px;
		background: #ffffff;
		border-radius: 4px;
		padding: 5px;
	}

	.cell-text {
		display: flex;
		flex: 1;
		flex-direction: row;
		justify-content: center;
	}

	.cell-text-left {
		display: flex;
		flex: 1;
		margin-top: 5px;
		margin-left: 15px;
		justify-content: flex-start;
		align-items: center;
		font-size: $uni-font-size-base;
	}

	.cell-text-right {
		display: flex;
		margin-top: 5px;
		margin-right: 15px;
		justify-content: flex-end;
		align-items: center;
		font-size: $uni-font-size-base;
	}

	.fontBlackcolor {
		color: $uni-text-color;
	}

	.fontdetailcolor {
		color: $uni-color-primary;
		margin-bottom: 10px;
	}

	.fontgreencolor {
		color: #4cd964;
	}

	.line-s {
		margin-top: 5px;
		margin-left: 10px;
		margin-right: 10px;
		height: 1px;
		background: #eeeeee;
	}

	.operate-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		margin-right: 10px;
		margin-top: 10px;
		font-size: $uni-font-size-base;
		color: $uni-color-primary;
	}

	.fontsubcolor {
		color: $uni-text-color-gray;
	}

	.pop-container {
		position: relative;
	}

	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding: 15px;
		width: 300px;
		background-color: #fff;
		border-radius: 10px;
	}

	.tip-title {
		padding: 10px;
		border-width: 0px 0px 1px 0px;
		border-color: $uni-bg-color-grey;
		border-style: solid;
		color: $uni-text-color;
		font-size: $uni-font-size-lg;
		font-weight: bold;
	}

	.row-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 10px 10px;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		border-bottom: 1px solid $uni-bg-color-grey;
	}

	.row-tag {
		width: 98px;
		text-align: left;
	}

	.input-style {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		padding: 2px 6px;
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
		background: $uni-bg-color-grey;
		border-radius: 4px;
	}

	.pop-confirm {
		color: #FFFFFF;
		margin-left: 8px;
		background: $uni-color-primary;
		border-radius: 4px;
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
	    margin-right: 5px;
		font-size: $uni-font-size-base;
		color: $uni-color-primary;
		border: 1px solid $uni-color-primary;
	}
</style>
