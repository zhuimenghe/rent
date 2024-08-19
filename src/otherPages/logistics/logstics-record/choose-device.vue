<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="buttons" @onNavBarButtonTap="onNavBarButtonTap">选择运输车辆</c-nav-bar-btns>
		<view class="search-top">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content"><input placeholder="请输入车牌号" v-model="licenseId" style="font-size: 14px;" /></view>
			</view>
			<view class="btn-confirm" @click="submit">搜索</view>
		</view>
		<view class="list-sub-view">
			<list class="list-view">
				<cell class="list-view-cell" v-for="(item, index) in datalist" :key="index">
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>车牌号</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.licenseId || '' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>品牌型号</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.type || '' }}</text>
						</view>
					</view>
					<view class="cell-text">
						<view class="cell-text-left fontsubcolor"><text>备注</text></view>
						<view class="cell-text-right fontBlackcolor">
							<text>{{ item.remark || '' }}</text>
						</view>
					</view>
					<view class="operate-container" v-if="isPermissionEdit || isPermissionDelete">
						<view class="delete-view" @click="chooseDevice(item)">选择</view>
						<view class="delete-view" @click="showDialog('update', item)" v-if="isPermissionEdit">修改</view>
						<view class="delete-view" @click="deleteItem(item)" v-if="isPermissionDelete">删除</view>
					</view>
				</cell>
			</list>
		</view>
		<view class="pop-container">
			<uni-popup ref="companyDialog" type="center" :mask-click="false">
				<view class="uni-tip">
					<view class="tip-title">{{ tipTitle }}</view>
					<view v-if="operateType != 'attachment'">
						<view class="row-item">
							<view class="row-tag">
								车牌号
								<span style="color: #FF0000;">*</span>
							</view>
							<input class="input-style" v-model="dialogData.licenseId" placeholder="请输入车牌号..." />
						</view>
						<view class="row-item">
							<view class="row-tag">
								品牌型号
								<span style="color: #FF0000;">*</span>
							</view>
							<input class="input-style" v-model="dialogData.type" placeholder="请输入车辆类型..." />
						</view>
						<view class="col-item">
							<view class="row-tag">备注</view>
							<textarea class="text-style" v-model="dialogData.remark" placeholder="请输入备注..." />
						</view>
					</view>
					<view style="margin-left: -10px;">
						<imgupload
							@uploadfinish="uploadfinish"
							@deleteUrl="deleteUrl"
							:imgFinishlist="dialogData.fileList"
							type="logistics_company"
							uploadType="attachment"
							:maximg="20"
							:isupload="isPermissionEdit"
						/>
					</view>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button pop-cancel" @click="cancelDialog">取消</text>
						<text class="uni-tip-button pop-confirm" @click="confirmDialog">确定</text>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';
export default {
	components: {
		uniLoadMore,
		uniPopup,
		imgupload
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
			datalist: [],
			licenseId: '',
			pickType: '',
			tipTitle: '新建车辆',
			dialogData: {
				licenseId: '',
				remark: '',
				type: '',
				fileList: []
			},
			operateType: 'create',
			itemDic:{},
			isPermissionAdd:true,
			isPermissionEdit:true,
			isPermissionDelete:true
		};
	},
	onPullDownRefresh() {
		this.headerrefresh();
	},
	onLoad(option) {
		this.itemDic = JSON.parse(decodeURIComponent(option.item))
		uni.showLoading();
		this.datalist = [];
		this.loaddata();
		uni.getStorage({
			key: this.$savekey.USER_PRIVILEGES_MEG,
			success: res => {
				this.isPermissionAdd = res.data.some(x => x.value === this.$savekey.PERMISSION_OUR_LOGISTICS_VEHICLE_ADD);
				this.isPermissionEdit = res.data.some(x => x.value === this.$savekey.PERMISSION_OUR_LOGISTICS_VEHICLE_EDIT);
				this.isPermissionDelete = res.data.some(x => x.value === this.$savekey.PERMISSION_OUR_LOGISTICS_VEHICLE_DELETE);
			}
		});
	},
	methods: {
		onNavBarButtonTap() {
			if (!this.isPermissionAdd){
				uni.showToast({
					icon: "none",
					title: "暂无新建车辆权限"
				})
				return
			}
			this.createPop()
		},
		headerrefresh() {
			this.datalist = [];
			this.loaddata();
		},
		submit() {
			uni.showLoading();
			this.datalist = [];
			this.loaddata();
		},
		loaddata() {
			let param = {
				fuzzyParam: this.licenseId,
				companyId:this.itemDic.logisticsProviderType === '2' ? this.itemDic.logisticsCompanyId : undefined,
				logisticsProviderType:this.itemDic.logisticsProviderType
			};
			this.$network
				.getData(this.$url.OUER_LOGISTICES_VEHICLE_LIST, 'GET', param)
				.then(result => {
					this.datalist = [...result];
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		createPop() {
			this.showDialog('create', null);
		},
		hidePop() {
			this.cancelDialog();
		},
		showDialog(type, item) {
			this.operateType = type;
			if (type == 'update') {
				this.dialogData = {
					...item
				};
				this.tipTitle = '修改车辆信息';
			} else if (type == 'create') {
				this.dialogData = {
					licenseId: '',
					remark: '',
					type: '',
					fileList: []
				};
				this.tipTitle = '新增车辆';
			}
			this.$refs.companyDialog.open();
		},
		cancelDialog() {
			this.$refs.companyDialog.close();
		},
		confirmDialog() {
			if (!this.dialogData) {
				return;
			}
			if (!this.dialogData.licenseId) {
				uni.showToast({
					title: '请输入车牌号',
					icon: 'none'
				});
				return;
			}
			if (!this.dialogData.type) {
				uni.showToast({
					title: '请输入车辆型号',
					icon: 'none'
				});
				return;
			}
			uni.showLoading()
			switch (this.operateType) {
				case 'create':
					this.dialogData = {
						...this.dialogData,
						logisticsProviderType:this.itemDic.logisticsProviderType,
						logisticsCompanyId:this.itemDic.logisticsProviderType === '2' ? this.itemDic.logisticsCompanyId : undefined,
					};
					this.dealInfo('POST');
					break;
				case 'update':
					// this.dialogData = {
					// 	...this.dialogData,
					// 	logisticsProviderType:this.itemDic.logisticsProviderType,
					// 	logisticsCompanyId:this.itemDic.logisticsCompanyId
					// };
					this.dealInfo('PUT');
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
			let url = this.$url.OUER_LOGISTICES_VEHICLE_EDIT;
			this.$network
				.getData(url, method, this.dialogData)
				.then(result => {
					this.cancelDialog();
					this.headerrefresh();
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		deleteItem(item) {
			uni.showModal({
				title: '提示',
				content: '确定要删除' + item.licenseId,
				success: res => {
					if (res.confirm) {
						let urlstr = this.$url.DELETE_OUER_LOGISTICES_VEHICLE.replace(/{id}/, item.id);
						this.$network
							.getData(urlstr, 'DELETE', null)
							.then(result => {
								this.headerrefresh();
							})
							.catch(err => {});
					} else if (res.cancel) {
					}
				}
			});
		},
		chooseDevice(item){
			uni.$emit('finishchoose-device', {
				   data: item
			});
			uni.navigateBack({
				delta:1
			})
			
		}
	}
};
</script>

<style lang="scss" scoped>
//背景视图
.content {
	width: 100%;
	background: $uni-bg-color-grey;
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
	top: 0px;
	left: 0px;
	z-index: 100;
	padding-top: 6px;
}

.search-box {
	background: #F7F7F7;
	height: 32px;
	flex: 1;
	line-height: 32px;
	display: flex;
	margin: 0px 8px;
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

.btn-confirm {
	padding: 4px 6px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	font-size: $uni-font-size-base;
	color: #ffffff;
	background-color: $uni-color-primary;
	border-radius: 4px;
	margin: 0px 4px;
}

.select-view {
	flex: 1;
}

//列表的subview
.list-sub-view {
	display: flex;
	flex: 1;
	background: $uni-bg-color-grey;
	margin-top: 44px;
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
	padding: 5px 5px 8px 5px;
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
	min-width: 56px;
	font-size: $uni-font-size-base;
}

.cell-text-right {
	display: flex;
	flex-direction: row;
	margin-top: 5px;
	margin-right: 15px;
	justify-content: flex-end;
	text-align: end;
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

.operate-container {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	margin-right: 10px;
	margin-top: 10px;
	padding-top: 4px;
	font-size: $uni-font-size-base;
	color: $uni-color-primary;
	border-top: 1px solid #eeeeee;
}
.delete-view {
	margin-left: 10px;
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
	padding: 10px 0px;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	border-bottom: 1px solid $uni-bg-color-grey;
}
.col-item {
	display: flex;
	margin-top: 16px;
	flex-direction: column;
	align-items: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
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
.text-style {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	padding: 2px 6px;
	border: 1px solid $uni-bg-color-grey;
	border-radius: 4px;
	height: 45px;
	width: calc(100% - 40px);
	margin-top: 8px;
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
	color: #ffffff;
	margin-left: 8px;
	background: $uni-color-primary;
	border-radius: 4px;
}
</style>
