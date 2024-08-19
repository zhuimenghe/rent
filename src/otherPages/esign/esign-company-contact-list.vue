<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view>
			<view v-for="(item,index) in dataList" :key="index" class="item-container">
				<view class="item-row-line">
					<view class="row-tag">姓名</view>
					<view>{{item.name||'-'}}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">手机号</view>
					<view>{{item.phoneNum||'-'}}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">身份证号</view>
					<view>{{item.identity||'-'}}</view>
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
					<view class="row-tag">职责</view>
					<view>{{getDutyName(item.dutys)}}</view>
				</view>
				<view class="item-view" v-if="item.esignId">
					<view @click="doOperate(item)">
						解除关联
					</view>
					<view @click="getLink(item)" style="margin-left: 10px;"  v-if="item.esignId&&!item.verified">
						认证链接
					</view>
				</view>

			</view>
		</view>
		<view class="pop-container" v-if="userDetailObj">
			<uni-popup ref="tipDialog" type="center" :mask-click="false">
				<view class="uni-tip">
					<view class="tip-title">
						{{popTitle}}
					</view>
					<view class="row-item">
						<view class="row-tag">
							姓名<span style="color: #FF0000;" v-if="popType!='info'">*</span>
						</view>
						<input :class="popType=='info'?'text-style':'input-style'" v-model="userDetailObj.name" placeholder="请输入姓名..."
						 :disabled="popType=='info'" />
					</view>
					<view class="row-item">
						<view class="row-tag">
							手机号<span style="color: #FF0000;" v-if="popType!='info'">*</span>
						</view>
						<input :class="popType=='info'?'text-style':'input-style'" v-model="userDetailObj.mobileNum" placeholder="请输入手机号..."
						 :disabled="popType=='info'" type="number" />
					</view>
					<view class="row-item">
						<view class="row-tag">
							身份证号<span style="color: #FF0000;" v-if="popType!='info'">*</span>
						</view>
						<input :class="popType=='info'?'text-style':'input-style'" v-model="userDetailObj.idCardNum" placeholder="请输入身份证号..."
						 :disabled="popType=='info'" type="idcard" />
					</view>
					<view class="col-item" v-if="popType!='info'">
						<view>
							联系人职责<span style="color: #FF0000;">*</span>
						</view>
						<view class="duty-container">
							<view v-for="(duty,pos) in userDetailObj.dutys" :key="pos"  @click="chooseDuty(pos)">
								<mycheckbox style="min-width: 80px;align-items: center;margin-top: 4px;" :checked="duty.checked">{{duty.label}}</mycheckbox>
							</view>
						</view>
					</view>
					<view v-if="popType=='info'">
						<view class="row-item">
							<view class="row-tag">
								是否实名
							</view>
							<view class="text-style">{{userDetailObj.verified?'是':'否'}}</view>
						</view>
						<view class="row-item">
							<view class="row-tag">
								授权码
							</view>
							<view class="text-style">{{userDetailObj.code||'--'}}
								<view style="color:#E60000; margin-left: 8px;font-size: 12px;" @click="getClipboardData(userDetailObj.code)">复制</view>
							</view>
						</view>
						<view class="notice"> 注：信息变更后，需要重新实名认证，实名认证通过后会更新该页面信息</view>
					</view>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button pop-cancel" @click="cancelDialog">{{popType!='info'?'关闭':'取消'}}</text>
						<text class="uni-tip-button pop-confirm" @click="confirmDialog" v-if="popType!='info'">确定</text>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import QR from "@/common/util/wxqrcode.js" // 二维码生成器 
	export default {
		components: {
			selectLabelItem,
			uniPopup,
			selectView,
			uniLoadMore,
			wPicker
		},
		data() {
			return {
				selectList: [],
				height: "30px",
				popType: 'info',
				popTitle: '电签信息',
				dataList: [],
				morestatus: 'more',
				pageSize: 20,
				curPage: 1,
				userDetailObj: {
					name: '',
					mobileNum: '',
					idCardNum: '',
				},
				clickIndex: 0,
				customerId: '',
				orgId: "",
				method: 'PUT',
				code: '',
				imageCode: ''

			}
		},
		onLoad(option) {
			this.customerId = option.customerId;
			this.orgId = option.esignId ? option.esignId : null;
			this.getDutyTypes()
		},
		onNavigationBarButtonTap() {
			this.method = 'POST'
			this.popType = 'create';
			this.popTitle = "新增联系人"
			this.userDetailObj = {
					name: '',
					mobileNum: '',
					idCardNum: '',
					dutys: this.selectList && this.selectList.length > 0 ? this.selectList.map(o => {
						return {
							...o,
							checked: false
						}
					}) : []
				},
				this.$refs.tipDialog.open();
		},
		onPullDownRefresh() {
			this.headerrefresh();
		},
		methods: {
			headerrefresh() {
				this.dataList = []
				this.getContactData();
			},
			getDutyName(dutys) {
				if (dutys && dutys.length > 0) {
					let checkedList = dutys.filter(o => o.checked)
					checkedList = checkedList ? checkedList.map(o => {
						return o.label
					}) : []
					return checkedList.length > 0 ? checkedList.join(',') : '-'
				}
				return '-'
			},
			cancelDialog() {
				this.$refs.tipDialog.close();
			},
			confirmDialog() {
				if (!this.userDetailObj.name) {
					uni.showToast({
						icon: "none",
						title: '姓名不能为空'
					})
					return
				}
				if (!this.userDetailObj.mobileNum) {
					uni.showToast({
						icon: "none",
						title: '手机号不能为空'
					})
					return
				}
				if (this.$datestr.isphonenum(this.userDetailObj.mobileNum) === false) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确手机号'
					});
					return;
				}
				if (!this.userDetailObj.idCardNum) {
					uni.showToast({
						icon: "none",
						title: '身份证号不能为空'
					})
					return
				}
				if (this.$datestr.isIdCard(this.userDetailObj.idCardNum) === false) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确身份证号'
					});
					return;
				}

				if (!this.userDetailObj.dutys || !this.userDetailObj.dutys.some(o => o.checked)) {
					uni.showToast({
						icon: "none",
						title: '请选择联系人职责'
					})
					return
				}
				let dutyList = this.userDetailObj.dutys.filter(o => {
					return o.checked
				})
				dutyList = dutyList.map(o => {
					return o.value
				})

				let param = {}
				if (this.method == 'PUT') { //修改
					param = {
						...param,
						...this.dataList[this.clickIndex],
						name: this.userDetailObj.name,
						phoneNum: this.userDetailObj.mobileNum,
						identity: this.userDetailObj.idCardNum,
						customerId: this.customerId,
						dutyList: dutyList
					}
				} else { //新增
					param = {
						name: this.userDetailObj.name,
						phoneNum: this.userDetailObj.mobileNum,
						identity: this.userDetailObj.idCardNum,
						customerId: this.customerId,
						dutyList: dutyList,
						identityCardBehind: [],
						identityCardFront: [],
						updateIdentitFile: false
					}
				}

				this.getUsertInfo(param)
			},
			doOperate(item) {
				uni.showModal({
					title: '提示',
					content: "确定解除该企业联系人的电签关联",
					confirmText: '确定',
					success: res => {
						if (res.cancel) {} else {
							this.uniBindEsign(item)
						}
					}
				});
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
			uniBindEsign(item) {
				this.$network.getData(this.$url.ESGIN_UNBIND_CUSTOMER, "PUT", {
					entityId: item.id,
					type: '3'
				}).then((result) => {
					this.headerrefresh()
				}).catch((err) => {})
			},
			//修改联系人职责
			chooseDuty(pos) {
				this.userDetailObj.dutys[pos].checked = !this.userDetailObj.dutys[pos].checked;
				this.userDetailObj = {
					...this.userDetailObj,
					dutys: this.userDetailObj.dutys
				}
			},
			getDutyTypes() {
				this.$network
					.loadUserType('contact_duty')
					.then(result => {
						this.selectList = result ? result : []
						this.getContactData();
					})
					.catch(err => {
						this.getContactData();
					});
			},

			getUsertInfo(param) {
				this.$network
					.getData(this.$url.LINKMAN_PERSON_CONNECT, this.method, param)
					.then(result => {
						this.$refs.tipDialog.close();
						setTimeout(() => {
							this.headerrefresh()
						}, 100)


					})
					.catch(err => {});
			},
			getContactData() {
				uni.showLoading()
				this.$network
					.getData(this.$url.LINKMAN_COMPANY_LIST + this.customerId, 'GET')
					.then(result => {
						uni.hideLoading();
						uni.stopPullDownRefresh()
						this.dataList = result ? result.map(o => {
							return {
								...o,
								dutys: this.selectList.length > 0 ? this.selectList.map(x => {
									return {
										...x,
										checked: o.dutyList && o.dutyList.some(y => y == x.value) ? true : false
									}
								}) : []
							}
						}) : []

					})
					.catch(err => {
						uni.stopPullDownRefresh()
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
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
		padding-bottom: 4px;
		width: 100%;
		position: fixed;
		top: 44px;
		left: 0px;
		z-index: 100;
		padding-top: 6px;
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

	.duty-container {
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-start;
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

	.col-item {
		display: flex;
		flex-direction: column;
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
