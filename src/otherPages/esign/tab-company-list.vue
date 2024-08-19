<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="search-top">
			<flexibleQueryView :isExportList='false' hint1='签章人姓名/手机号' :isQuerykeyWord="true" hint='客户/法人姓名/手机号'
			 :isQuerySalesman="true" :isQueryOrg='true' :isCustomQuery="true" :customList='isRegistList' customHint='是否注册电签'
			 @reset='reset' @query="query" />
			<!-- <view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content"><input placeholder="客户名称" placeholder-class="placeholder-style" v-model="fuzzyParam" /></view>
			</view> -->
		</view>

		<view style="margin-top: 128px;">
			<view v-for="(item,index) in dataList" :key="index" class="item-container">
				<view class="item-row-line">
					<view class="row-tag">客户名称</view>
					<view>{{item.name||'-'}}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">业务负责人</view>
					<view>{{item.salesmanName||'-'}}</view>
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
					<view class="row-tag">签章人</view>
					<view :style="{color:item.contactsList&&item.contactsList.length>0?'#E60000':'#333333'}" @click="queryContact(item)">{{item.contactsList?item.contactsList.length:'0'}}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">区域</view>
					<view>{{item.orgName||'-'}}</view>
				</view>
				<view class="item-view" v-if="item.esignId">
					<view @click="doOperate(item)">
						解除关联
					</view>
					<view @click="getLink(item)" style="margin-left: 10px;" v-if="item.esignId&&!item.verified">
						认证链接
					</view>
				</view>
			</view>
			<view>
				<uni-load-more iconType="auto" :status="morestatus" />
			</view>
		</view>
	</view>
</template>

<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import flexibleQueryView from '@/components/common/common-ui/flexible-query-view.vue';
	export default {
		components: {
			selectLabelItem,
			uniPopup,
			selectView,
			uniLoadMore,
			flexibleQueryView
		},
		data() {
			return {
				likeName: '',
				contactFuzzyParam: "",
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
				],
				salesmanObj: {}

			}
		},
		created() {
			// this.getCompanyData();
		},
		methods: {
			reset(val) {
				this.likeName = '';
				this.contactFuzzyParam = ""
				this.orgDic = {}
				this.isRegistDic = {};
				this.salesmanObj = {};
				this.headerrefresh();

			},
			query(val) {
				//故意放反，字段对的上
				this.likeName = val.fuzzyParam;
				this.contactFuzzyParam = val.keyWord;
				this.orgDic = val.orgObj;
				this.isRegistDic = val.customObj;
				this.salesmanObj = val.salesmanObj;
				this.headerrefresh();
			},
			getLegalInfo(list) {
				if (list && list.length > 0) {
					return list.find(o => o.dutyList && o.dutyList.some(y => y == '1'))
				}
				return null
			},
			headerrefresh() {
				this.curPage = 1;
				this.dataList = []
				this.getCompanyData();
			},
			footerrefresh() {
				if (this.morestatus == 'noMore') {
					return;
				}
				this.curPage += 1;
				this.morestatus = 'loading';
				this.getCompanyData();
			},
			queryContact(item) {
				if (item.contactsList && item.contactsList.length > 0) {
					uni.navigateTo({
						url: './esign-company-contact-list?customerId=' + item.id + '&esignId=' + item.esignId
					})
				}

			},

			doOperate(item) {
				uni.showModal({
					title: '提示',
					content: "确定解除该企业的电签关联",
					confirmText: '确定',
					success: res => {
						if (res.cancel) {} else {
							this.uniBindEsign(item)
						}
					}
				});
			},

			uniBindEsign(item) {
				this.$network.getData(this.$url.ESGIN_UNBIND_CUSTOMER, "PUT", {
					entityId: item.id,
					type: '1'
				}).then((result) => {
					this.headerrefresh()
				}).catch((err) => {})
			},
			//获取认证地址
			getLink(item) {
				this.$network.getData(this.$url.ESGIN_FIND_ORG_LINK.replace(/{orgId}/, item.esignId), "GET").then((result) => {
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
						title: err.details[0] ? err.details[0] : (err.message ? err.message : '')
					})
				})
			},
			//复制数据
			getClipboardData(url) {
				uni.setClipboardData({
					data: url,
					success: () => {
						uni.showToast({
							icon: 'none',
							title: '已复制'
						})
					}
				})
			},
			getCompanyData() {
				let param = {
					size: this.pageSize,
					current: this.curPage,
					type: '1', //个人客户
					likeName: this.likeName ? this.likeName : undefined,
					contactFuzzyParam: this.contactFuzzyParam ? this.contactFuzzyParam : undefined,
					salesman: this.salesmanObj.value != "" ? this.salesmanObj.value : undefined,
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
					.getData(this.$url.LINKMAN_LIST, 'POST', param)
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
			},


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
		width: 340px;
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
		height: 30px;
		line-height: 30px;
		margin-top: 10px;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.row-tag {
		width: 100px;
		min-width: 100px;
		text-align: left;
	}

	.input-style {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		padding: 2px 6px;
		flex: 1;
		height: 30px;
		line-height: 30px;
		border: 1px solid $uni-bg-color-grey;
		border-radius: 4px;
	}

	.text-style {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		padding: 2px 6px;
		height: 35px;
		flex: 1;
		line-height: 35px;
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
