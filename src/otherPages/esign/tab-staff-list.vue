<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="search-top">
			<flexibleQueryView :isExportList='false' hint='姓名/用户名/手机号/角色' :isQuerySalesman="false" :isQueryOrg='true'
			 :isCustomQuery="true" :customList='isRegistList' customHint='是否关联电签' @reset='reset' @query="query" />

			<!-- <view class="select-view">
				<selectView :value='orgDic.label||""' hint='区域' @clickSelect="showPick" />
			</view>
			<view class="search-box">
				<view class="search-content"><input placeholder="姓名/用户名/手机号/角色" placeholder-class="placeholder-style" v-model="fuzzyParam" /></view>
			</view>
			<view class="btn-reset" @click="reset">重置</view> -->
		</view>

		<view style="margin-top: 128px;">
			<view v-for="(item,index) in dataList" :key="index" class="item-container">
				<view class="item-row-line">
					<view class="row-tag">用户名</view>
					<view>{{item.ssn||'-'}}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">姓名</view>
					<view>{{item.username||'-'}}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">手机号</view>
					<view>{{item.phoneNum||'-'}}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">关联电签账号</view>
					<view>{{item.esignId?'已关联':'未关联'}}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">实名状态</view>
					<view>{{item.verified?'已实名':'未实名'}}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">角色</view>
					<view>{{item.roleIdNameList?item.roleIdNameList.join(","):'-'}}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">区域</view>
					<view>{{item.orgName||'-'}}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">身份证号</view>
					<view>{{item.identity||'-'}}</view>
				</view>
				<view class="item-view" v-if="item.esignId">
					<view @click="doOperate(item)">
						解除关联
					</view>
					<view @click="getLink(item)"  style="margin-left: 10px;" v-if="item.esignId&&!item.verified">
						认证链接
					</view>
				</view>

			</view>
			<view>
				<uni-load-more iconType="auto" :status="morestatus" />
			</view>
		</view>
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
	</view>
</template>

<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import QR from "@/common/util/wxqrcode.js" // 二维码生成器 
	import flexibleQueryView from '@/components/common/common-ui/flexible-query-view.vue';
	export default {
		components: {
			selectLabelItem,
			uniPopup,
			selectView,
			uniLoadMore,
			wPicker,
			flexibleQueryView
		},
		data() {
			return {
				fuzzyParam: '',
				selectList: [],
				dataList: [],
				morestatus: 'more',
				pageSize: 20,
				curPage: 1,
				orgDic: {},
				isRegistDic: {},
				isRegistList: [{
						label: '全部',
						value: ''
					},
					{
						label: '是',
						value: true
					},
					{
						label: '否',
						value: false
					}
				]

			}
		},
		created() {
			// this.getStaffData();
			this.getOrgList();
		},
		methods: {
			reset(val) {
				this.fuzzyParam = '';
				this.orgDic = {}
				this.isRegistDic = {};
				this.headerrefresh();

			},
			query(val) {
				this.fuzzyParam = val.fuzzyParam;
				this.orgDic = val.orgObj;
				this.isRegistDic = val.customObj;
				this.headerrefresh();
			},
			showPick() {
				this.$refs.selector.show();
			},
			onConfirm(val) {
				this.orgDic = val.checkArr;
				this.headerrefresh();
			},
			// reset() {
			// 	this.orgDic = {}
			// 	this.fuzzyParam = ''
			// 	this.headerrefresh();
			// },
			headerrefresh() {
				this.curPage = 1;
				this.dataList = []
				this.getStaffData();
			},
			footerrefresh() {
				if (this.morestatus == 'noMore') {
					return;
				}
				this.curPage += 1;
				this.morestatus = 'loading';
				this.getStaffData();
			},
			//获取认证地址
			getLink(item) {
				this.$network.getData(this.$url.ESGIN_FIND_USER_LINK.replace(/{userId}/, item.esignId), "GET").then((result) => {
					if (result && result.url) {
						uni.showModal({
							title: '认证链接',
							content: result.url,
							confirmText: "复制",
							showCancel: false,
							success: res => {
								if (res.confirm) {
									this.getClipboardData(result.url)
								}
							}
						});
					} else {
						uni.showToast({
							icon: 'none',
							title: '暂无认证链接'
						})
					}

				}).catch((err) => {
					uni.showToast({
						icon: 'none',
						title: err.details[0]?err.details[0]:(err.message?err.message:'')
					})
				})
			},
			//复制数据
			getClipboardData(code) {
				uni.setClipboardData({
					data: code,
					success: () => {
						uni.showToast({
							icon: 'none',
							title: '已复制'
						})
					}
				})
			},
			doOperate(item) {
				uni.showModal({
					title: '提示',
					content: "确定解除该员工的电签关联",
					confirmText: '确定',
					success: res => {
						if (res.cancel) {} else {
							this.uniBindEsign(item)
						}
					}
				});
			},
			uniBindEsign(item) {
				this.$network.getData(this.$url.ESGIN_UNBIND_STAFF, "PUT", {
					entityId: item.id
				}).then((result) => {
					this.headerrefresh()
				}).catch((err) => {})
			},
			getOrgList() {
				let _self = this
				this.$network.getData(this.$url.ORG_ALL, "GET").then((result) => {
					if (result && result.length > 0) {
						result.forEach(function dep(o) {
							_self.selectList = [..._self.selectList, {
								value: o.id,
								label: o.name,
								children: o.children
							}];
							if (o.children && o.children.length > 0) o.children.map(dep);
						})
					}
				}).catch((err) => {})
			},

			getStaffData() {
				let param = {
					showAdmin: false,
					size: this.pageSize,
					current: this.curPage,
					fuzzyParam: this.fuzzyParam,
					pageSort: 'username asc'
				}
				if (this.orgDic && this.orgDic.value) {
					param = {
						...param,
						orgId: this.orgDic.value
					}
				}
				if (this.isRegistDic && this.isRegistDic.value !== '' && this.isRegistDic.value != undefined) {
					param = {
						...param,
						isRegist: this.isRegistDic.value
					}
				}
				uni.showLoading()
				this.$network
					.getData(this.$url.STAFF_LIST, 'POST', param)
					.then(result => {
						this.dataList = this.dataList.concat(result.records);
						let pages = result.pages;
						if (pages <= this.curPage) {
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
			}

		}


	}
</script>

<style lang="scss" scoped>
	.content {
		background-color: $uni-bg-color-grey;
		position: relative;
	}

	.search-top {
		z-index: 100;
		position: fixed;
		display: flex;
		flex-direction: column;
		width: 100%;
		top: 44px;
		left: 0px;
		margin-bottom: 1px;
		box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
	}

	.search-box {
		background: #F7F7F7;
		height: 35px;
		flex: 3;
		line-height: 35px;
		display: flex;
		margin: 0px 4px;
		flex-direction: row;
		padding-left: 4px;
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

	.select-view {
		flex: 2;
	}

	.btn-confirm {
		padding: 0px 6px;
		height: 35px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: $uni-font-size-base;
		color: #FFFFFF;
		background-color: $uni-color-primary;
		border-radius: 4px;
		margin: 0px 4px;
	}

	.btn-reset {
		padding: 0px 6px;
		height: 35px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		background-color: $uni-bg-color-grey;
		border-radius: 4px;
		margin: 0px 4px;
	}

	.item-container {
		background-color: #FFFFFF;
		margin-bottom: 4px;
		border-radius: 4px;
	}

	.item-row-line {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		min-height: 30px;
		padding: 0px 10px;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.item-view {
		height: 45px;
		width: calc(100% - 20px);
		margin: 10px 10px 0px 10px;
		border-top: 1px solid $uni-bg-color-grey;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		color: $uni-color-primary;
		font-size: $uni-font-size-base;
	}


	/* 提示窗口 */

	.pop-container {
		position: relative;
	}


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
		height: 40px;
		line-height: 40px;
		margin-top: 10px;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.row-tag {
		width: 85px;
		min-width: 85px;
		text-align: left;
	}

	.input-style {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		padding: 2px 6px;
		border: 1px solid $uni-bg-color-grey;
		border-radius: 4px;
	}

	.text-style {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		padding: 2px 6px;
		height: 40px;
		line-height: 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.uni-tip-group-button {
		display: flex;
		flex-direction: row;
		margin-top: 20px;
	}

	.notice {
		color: #FCA01F;
		font-size: $uni-font-size-sm;
		background-color: #FFF8EE;
		padding: 4px 10px;
		margin: 10px 0px;

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
</style>
