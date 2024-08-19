<template>
	<view class="sum-view-bg" style="margin-bottom: 5px;">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
			<view class="cell-input-view-left boldstyle"><text>运输车管理</text></view>
			<view class="cell-input-view-right">
				<view class="input-style boldstyle" v-if="isedit">
					<text style="color: #E60000;margin-right: 15px;font-size: 20px;margin-left: 20px;" @click="showDialog('create')">+</text>
				</view>
			</view>
		</view>
		<view class="cell-view" v-for= "(item,index) in dataDic.logisticsMachines" :key = "index">
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>车牌号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{item.licenseId || '--'}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>品牌型号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{item.type || '--'}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>备注</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{item.remark || '--'}}</text>
				</view>
			</view>
			<imgupload
			:imgFinishlist="item.fileList" 
			:isupload="false"
			/>
			<view class="cell-input-view-right-bottom">
				<text class="btn-s1" @click="showDialog('update',item,index)" v-if="isedit">修改</text>
				<text class="btn-s2" @click="deleteItem(index,item)" v-if="isedit">删除</text>
			</view>
			<view class="line-v"/>
		</view>
		<view class="pop-container">
			<uni-popup ref="companyDialog" type="center" :mask-click="false">
				<view class="uni-tip">
					<view class="tip-title">
						{{tipTitle}}
					</view>
					<view class="row-item">
						<view class="row-tag">
							车牌号<span style="color: #FF0000;">*</span>
						</view>
						<input class="input-style" v-model="dialogData.licenseId" placeholder="请输入车牌号..." />
					</view>
					<view class="row-item">
						<view class="row-tag">
							品牌型号<span style="color: #FF0000;">*</span>
						</view>
						<input class="input-style" v-model="dialogData.type" placeholder="请输入品牌型号..." />
					</view>
					<view class="col-item">
						<view class="row-tag">
							备注
						</view>
						<textarea 
						class="text-style" 
						v-model="dialogData.remark" 
						placeholder="请输入备注..." 
						/>
					</view>
					<view style="margin-left: -10px;">
						<imgupload 
						@uploadfinish="uploadfinish" 
						@deleteUrl="deleteUrl" 
						:imgFinishlist="dialogData.fileList" 
						type="logistics_company"
						uploadType="attachment" 
						:maximg="20" 
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
import imgupload from '@/components/common/image-upload/image-upload.vue';
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
export default {
	components: {
		imgupload,
		uniPopup
	},
	data() {
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			tipTitle:'新增车辆信息',
			operateType:'create',
			dialogData:{},
			itemindex:0,
		};
	},
	props: {
		dataDic: {
			type: Object,
			default() {
				return {};
			}
		},
		isedit: {
			type: Boolean,
			default: true
		},
		isupdata: {
			type: Boolean,
			default: false
		},
		isLiangXu: {
			type: Boolean,
			default: false
		},
	},
	created() {
		
	},
	methods: {
		callPhone(phone) {
			if (!this.isedit && phone) {
				uni.makePhoneCall({
					phoneNumber: phone,
					success: res => {
						console.log('调用成功!');
					},
					fail: res => {
						console.log('调用失败!');
					}
				});
			}
		},
		showDialog(type, item,index) {
			this.operateType = type;
			if (type == 'update') {
				this.itemindex = index
				this.dialogData = { 
					...item
				}
				this.tipTitle = "修改车辆信息"
			} else if (type == 'create'){
				this.dialogData = {
					licenseId:'',
					remark:'',
					type:'',
					fileList:[]
				}
				this.tipTitle = "新增车辆"
			}
			this.$refs.companyDialog.open()
		},
		cancelDialog() {
			this.$refs.companyDialog.close()
		},
		confirmDialog() {
			if (!this.dialogData.licenseId) {
				uni.showToast({
					title: "请输入车牌号",
					icon: "none"
				})
				return
			}
			if (!this.dialogData.type) {
				uni.showToast({
					title: "请输入车辆型号",
					icon: "none"
				})
				return
			}
			if(this.operateType === 'create'){
				this.dialogData = {
					...this.dialogData,
					logisticsProviderType:'2'
				}
				if(this.isupdata){
					//数据更新非新建
					uni.showLoading()
					this.dialogData = {
						...this.dialogData,
						logisticsCompanyId:this.dataDic.id
					}
					let url = this.$url.OUER_LOGISTICES_VEHICLE_EDIT;
					this.$network.getData(url, 'POST', this.dialogData).then(result => {
						this.$emit('clickeventupdata', {
							type: 'value',
							data: {}
						});
					}).catch(err => {
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: err.details && err.details[0] ? err.details[0] : err.message ? err.message : ''
						});
					});
				}else{
					//数据新建
					let logisticsMachines = this.dataDic.logisticsMachines || [];
					logisticsMachines.unshift(this.dialogData)
					let dict = {
						...this.dataDic,
						logisticsMachines: [...logisticsMachines]
					};
					this.$emit('clickevent', {
						type: 'value',
						data: dict
					});
				}
			}else{
				if(this.isupdata){
					//修改时候非新增
					uni.showLoading()
					this.dialogData = {
						...this.dialogData,
						logisticsCompanyId:this.dataDic.id
					}
					let url = this.$url.OUER_LOGISTICES_VEHICLE_EDIT;
					this.$network.getData(url, 'PUT', this.dialogData).then(result => {
						this.$emit('clickeventupdata', {
							type: 'value',
							data: {}
						});
					}).catch(err => {
						uni.hideLoading();
						uni.showToast({
							icon: 'none',
							title: err.details && err.details[0] ? err.details[0] : err.message ? err.message : ''
						});
					});
				}else{
					//修改时候新增
					let logisticsMachines = this.dataDic.logisticsMachines || [];
					logisticsMachines.splice(this.itemindex,1,this.dialogData)
					let dict = {
						...this.dataDic,
						logisticsMachines: [...logisticsMachines]
					};
					this.$emit('clickevent', {
						type: 'value',
						data: dict
					});
				}
			}
			this.cancelDialog()
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
		deleteItem(index,item) {
			this.itemindex = index;
			uni.showModal({
				title: '提示',
				content: '确定要删除' + item.licenseId,
				success: (res) => {
					if (res.confirm) {
						if(this.isupdata){
							uni.showLoading()
							let urlstr = this.$url.DELETE_OUER_LOGISTICES_VEHICLE.replace(/{id}/, item.id);
							let param = {
								id : item.id
							}
							this.$network.getData(urlstr, 'DELETE', param).then(result => {
								this.$emit('clickeventupdata', {
									type: 'value',
									data: {}
								});
							}).catch(err => {
								uni.hideLoading();
								uni.showToast({
									icon: 'none',
									title: err.details && err.details[0] ? err.details[0] : err.message ? err.message : ''
								});
							});
						}else{
							let logisticsMachines = this.dataDic.logisticsMachines || [];
							logisticsMachines.splice(this.itemindex,1)
							let dict = {
								...this.dataDic,
								logisticsMachines: [...logisticsMachines]
							};
							this.$emit('clickevent', {
								type: 'value',
								data: dict
							});
						}
					} else if (res.cancel) {}
				}
			});
		
		},
		
	}
};
</script>

<style lang="scss" scoped>
.sum-view-bg {
	display: flex;
	flex-direction: column;
	margin: 10px;
	margin-bottom: 20px;
	background: #ffffff;
	border-radius: 10px;
	padding-bottom: 10px;
}

.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	padding: 10px;
	border-bottom:$uni-line-color 1px dotted;
	font-size: $uni-font-size-base;
}

.cell-input-view-left {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.cell-input-view-right {
	display: flex;
	flex: 1;
	min-height: 24px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.cell-input-view-right-bottom {
	display: flex;
	flex: 1;
	padding: 5px 10px;
	align-items: center;
	justify-content: flex-end;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.btn-s1{
	display: flex;
	padding: 3px 6px;
	border-radius: 3px;
	color: #FFFFFF;
	background: $uni-color-primary;
}
.btn-s2{
	display: flex;
	margin-left: 10px;
	padding: 3px 6px;
	border-radius: 3px;
	color: #FFFFFF;
	background: #FF0000;
}
.input-style {
	flex: 1;
	text-align: right;
	font-size: $uni-font-size-base;
}
.boldstyle {
	font-size: $uni-font-size-lg;
	font-weight: bold;
}
.cell-view{
	display: flex;
	flex-direction: column;
}
.line-v{
	flex: 1;
	margin-top: 5px;
	margin-left: 10px;
	margin-right: 10px;
	height: 1px;
	background: #eeeeee;
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
	margin-top: 5px;
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
.text-style{
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	padding: 2px 6px;
	border: 1px solid $uni-bg-color-grey;
	border-radius: 4px;
	height: 45px;
	width: calc(100% - 15px );
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
	color: #FFFFFF;
	margin-left: 8px;
	background: $uni-color-primary;
	border-radius: 4px;
}
.update-btn{
	padding: 3px 5px;
	border-radius: 3px;
	background: $uni-color-primary;
	color: #FFFFFF;
	font-size: $uni-font-size-base;
	font-weight: normal;
}
</style>
