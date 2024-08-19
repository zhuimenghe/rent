<template>
	<view class="custom-bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<!-- <view class="add-container" @click="gotocreat" v-if="isPermissionAdd">
			<i class="iconfont labelstyle">&#xe601;</i>
		</view> -->
		<view class="top-search-view">
			<queryView :isExportList='isExportList' @query="query" hint="客户名称/联系人/手机号" @exportExcel="exportExcel" />
			<!-- <view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input placeholder="客户名称/联系人/手机号" v-model="searchKey" style="font-size: 14px;" />
				</view>
			</view>
			<view class="filter-view-style" @click="searchTo">
				<text>搜索</text>
			</view>
			<view class="filter-view-style" @click="exportExcel" v-if="isExportList">
				<text>导出</text>
			</view> -->
		</view>
		<list class="list-view">
			<cell v-for="(item,index) in datalist" :key='index' class='list-view-cell'>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text style="color: #000000;">{{ item.name || '-' }}</text></view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>业务负责人</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.salesmanName || '-' }}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>首次合作月</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ changestr(item.firstSignDate )}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>联系人</text></view>
					<view class="cell-input-view-right" style="color: #E60000;" @click="searchLink(item,index)">
						<text class="input-style">{{ getContactsName(item)}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>区域</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.orgName || '-' }}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>客户地址</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.address || '-' }}</text>
					</view>
				</view>


				<view class="cell-bottom-view">
					<view class="btn-view style-tilte-one" style="width: 80px;" @click="goToOverdue(item)">
						<text>逾期记录</text>
					</view>
					<view class="btn-view style-tilte-two" @click="editfence(item,index)" v-if="isPermissionEdit">
						<text>修改</text>
					</view>
					<view class="btn-view style-tilte-three" @click="deleteFence(item,index)" v-if="isPermissionDelete">
						<text>删除</text>
					</view>
				</view>
			</cell>
			<cell>
				<uni-load-more iconType="auto" :status="morestatus" />
			</cell>
		</list>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import queryView from '@/components/common/common-ui/query-view.vue';
	import badgeview from '@/components/common/image-upload/badge-icon.vue'
	export default {
		components: {
			uniLoadMore,
			queryView,
			badgeview
		},
		data() {
			return {
				page: 1,
				datalist: [],
				morestatus: 'more',
				searchKey: '',
				isExportList: false,
				totalCount: '100',
				salesmanObj:{}
			};
		},
		props: {
			isPermissionAdd: {
				type: Boolean,
				default: true
			},
			isPermissionEdit: {
				type: Boolean,
				default: true
			},
			isPermissionDelete: {
				type: Boolean,
				default: true
			}
		},
		created() {
			uni.getStorage({
				key: this.$savekey.USER_PRIVILEGES_MEG,
				success: (res) => {
					//this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
				}
			})
			uni.showLoading();
			this.loaddata();
		},
		methods: {
			goImg(item) {
				let isedit = this.isuser(item)
				uni.navigateTo({
					url: "../../../components/common/image-upload/upload_zb_apendix?item=" + encodeURIComponent(JSON.stringify(item)) +
						"&isedit=" + isedit + "&type=userapi" + "&filetype=other_attachments"
				})
			},
			isuser(item) {
				if (item.canUploadFile == '0') {
					return false
				} else {
					return true
				}
			},
			query(val) {
				console.log(val)
				this.searchKey = val.keyWord;
				this.salesmanObj = val.salesmanObj;
				this.refreshheader();
			},
			changestr(str) {
				if (str == null) {
					return '--';
				}
				return str.split(' ')[0];
			},
			loaddata() {
				let dict = {
					current: this.page,
					size: 20,
					type: '1',
					keyWord: this.searchKey?this.searchKey:undefined,
					salesman:this.salesmanObj.value?this.salesmanObj.value:undefined
				};
				this.$network
					.getData(this.$url.LINKMAN_LIST, 'POST', dict)
					.then(result => {
						this.datalist = this.datalist.concat(result.records);
						let pages = result.pages;
						let total = result.total;
						if (this.page == 1 && (result && result.records && result.records.length <= 0)) {
							this.morestatus = 'noMore';
						} else {
							if (pages == this.page) {
								this.morestatus = 'noMore';
							} else {
								this.morestatus = 'more';
							}
						}
						this.totalCount = result.total.toString()
						uni.stopPullDownRefresh();
						uni.hideLoading();
					})
					.catch(err => {
						this.morestatus = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			refreshheader() {
				this.page = 1;
				this.datalist = [];
				this.loaddata();
			},
			refreshhfooter() {
				if (this.morestatus == 'noMore') {
					return;
				}
				this.page += 1;
				this.loaddata();
				this.morestatus = 'loading';
			},
			gotocreat() {
				uni.navigateTo({
					url: './company-creat?edit=false'
				});
			},
			getContactsName(item) {
				return item.contactsList && item.contactsList.length > 0 ? item.contactsList.map(o => o.name).join(',') : '-'
			},
			goToOverdue(item) {
				uni.navigateTo({
					url: "/otherPages/overdue/overdue-record?type=customer&customerId=" + item.id
				})
			},
			//查看联系人
			searchLink(item, index) {
				let url = './linkman-company-list?item=' + encodeURIComponent(JSON.stringify(item)) + "&isedit=true";
				uni.navigateTo({
					url: url
				});
			},
			//编辑
			editfence(item, index) {
				uni.navigateTo({
					url: './company-creat?item=' + encodeURIComponent(JSON.stringify(item)) + '&edit=true'
				});
			},
			//删除
			deleteFence(item, index) {
				uni.showModal({
					title: '提示',
					content: '确定删除该客户么?',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading();
							let urlstr = this.$url.LINKMAN_PERSON_DELETE + item.id;
							this.$network
								.getData(urlstr, 'DELETE', null)
								.then(result => {
									this.refreshheader();
								})
								.catch(err => {
									uni.hideLoading();
									uni.showToast({
										title: err.message,
										icon: "none"
									})

								});
						}
					}
				});
				return
			},
			searchTo() {
				this.refreshheader();
			},
			exportExcel() {
				uni.showLoading({
					title: '正在下载中,请稍等...',
					mask: true,
				})
				// let param = {
				// 	type: '1',
				// 	keyWord:this.searchKey,
				// };
				// let url= this.$url.LINKMAN_LIST + '?isExport=true&current=1&size='+ this.totalCount
				// let downurl = this.$gxfmethod.forEachObj(url,param)
				// console.log(downurl)

				let param = {
					"current": 1,
					"size": this.totalCount,
					type: '1',
					keyWord: this.searchKey,
				};
				let url = this.$gxfmethod.getUrl(this.$url.LINKMAN_LIST)
				console.log(url)
				let filename = this.$gxfmethod.getFileName("企业联系人记录-")
				this.$gxfmethod.downFunc(url, 'POST', param, filename)
			},
		}
	};
</script>

<style lang="scss" scoped>
	.custom-bg-view {
		display: flex;
		width: 100%;
		flex-direction: column;
	}

	.add-container {
		position: fixed;
		display: flex;
		bottom: 60px;
		right: 20px;
		height: 40px;
		width: 40px;
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

	.top-search-view {
		z-index: 100;
		position: fixed;
		display: flex;
		flex-direction: column;
		width: 100%;
		top: 50px;
		left: 0px;
		margin-bottom: 1px;
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
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 10px;
	}

	.filter-view-style {
		height: 35px;
		width: 60px;
		display: flex;
		background: $uni-color-primary;
		font-size: $uni-font-size-base;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		border-radius: 5px;
		color: #FFFFFF;
	}

	.list-view {
		margin-top: 100px;
		display: flex;
		flex-direction: column;
	}

	.list-view-cell {
		display: flex;
		width: 100%;
		flex-direction: column;
		background: #FFFFFF;
		border-bottom-style: solid;
		margin-top: 10px;
		border-bottom-color: #EEEEEE;
		border-bottom-width: 1px;
	}

	.cell-input-view {
		display: flex;
		flex-direction: row;
		flex: 1;
		align-items: center;
		justify-content: flex-start;
		margin-left: 15px;
		margin-right: 15px;
		margin-top: 10px;
		font-size: $uni-font-size-base;
	}

	.cell-input-view-left {
		display: flex;
		align-items: center;
		min-width: 78px;
		justify-content: flex-start;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.cell-input-view-right {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: flex-start;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.input-style {
		flex: 1;
		text-align: right;
	}

	.cell-bottom-view {
		display: flex;
		flex: 1;
		height: 50px;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		margin-bottom: 10px;

	}

	.btn-view {
		display: flex;
		border-radius: 5px;
		margin-right: 10px;
		width: 60px;
		height: 30px;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: $uni-font-size-base;
	}

	.style-tilte-one {
		background: #E60000;
		color: #FFFFFF;

	}

	.style-tilte-two {
		background: #FE931F;
		color: #EEEEEE;

	}

	.style-tilte-three {
		background: #FFFCF7;
		color: #F9C0C8;

	}
</style>
