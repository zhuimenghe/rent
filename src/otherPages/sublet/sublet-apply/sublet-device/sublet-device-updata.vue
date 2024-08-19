<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="content-container">
			<p class="title"><span class="line"></span>基本信息</p>
			<view class="sum-view-bg">
				<!-- 
					<view class="cell-input-view">
					<view class="cell-input-view-left">
						<view class="item-head">
							<view class="head-top">
								<view>{{ dataDic.licenseId }}</view>
								<input type="text" v-model="dataDic.licenseId" placeholder="请输入车号"/>
								<text style="font-size: 12px;color: #aaa;margin-left: 8px;font-weight:400">（可编辑）</text>
							</view>
							<view class="head-bottom">
								<text>{{ dataDic.typeName || '--' }}</text>
								|
								<text class="item-text">{{ dataDic.heightName || '--' }}</text>
								|
								<text class="item-text">{{ dataDic.brand || '--' }}</text>
								|
								<text class="item-text">{{ dataDic.machineTypeName || '--' }}</text>
							</view>
						</view>
					</view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ dataDic.subletStateName || '--' }}</text>
					</view>
				</view>
				<view class="line-s" /> 
				-->
				<view class="cell-input-view" @click="gotoDetail()">
					<view class="cell-input-view-left">
						<text>转租单号</text>
					</view>
					<view class="cell-input-view-right">
						<text class="input-style" style="color: #E60000;">{{ dataDic.businessKey || '--' }}</text>
					</view>
					<i class="iconfont iconarrow-right" style="color: #E60000;"></i>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left">
						<text>转租公司</text>
					</view>
					<view class="cell-input-view-right">
						<text class="input-style">
							{{ dataDic.subletCompanyName || '--' }}
						</text>
					</view>
				</view>
				<!-- <view class="cell-input-view">
					<view class="cell-input-view-left">
						<text>实际车号</text>
					</view>
					<view class="cell-input-view-right">
						<input 
						class="input-style" 
						type="text" 
						v-model="dataDic.actualLicenseId" 
						placeholder="请输入实际车号...." 
						/>
					</view>
				</view> -->
				<view class="cell-input-view">
					<view class="cell-input-view-left">
						<text>自喷码<text style="color:#52C41A">（可编辑）</text></text>
					</view>
					<view class="cell-input-view-right">
						<input class="input-style" type="text" v-model="dataDic.printCode" placeholder="请输入车身喷码...." />
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left">
						<text>机号</text>
					</view>
					<view class="cell-input-view-right">
						<text class="input-style">
							{{ dataDic.licenseId }}
						</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left">
						<text>起租日期</text>
					</view>
					<view class="cell-input-view-right">
						<text class="input-style">
							{{ getDateStr(dataDic.actualSubletDate) }}
						</text>
					</view>
				</view>
				<!-- <select-label-item tagName="起租日期" hint="请选择起租日期" :icon="righticon" @clickItemLabel="showdialog('start')" :value="getDate(dataDic.actualSubletDate)" /> -->
				<select-label-item tagName="还租日期" hint="请选择还租日期" :icon="righticon" @clickItemLabel="showdialog('end')" :value="getDate(dataDic.rentBackDate)" />
				<text-label-item tagName="备注" placeholder="请输入备注..." @ipnuttext="remarkmethod" :inputValue="dataDic.remark" bgColor="#F6F6F6" />
			</view>
		</view>
		<view class="bottom-view">
			<view class="bottom-left-view" @click="cancleClick">
				<text>取消</text>
			</view>
			<view class="bottom-right-view" @click="clicksave">
				<text>确定</text>
			</view>
		</view>
		<!-- 类型选择 -->
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false" ref="date" themeColor="#E60000" />
	</view>
</template>
<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
export default {
	components: {
		selectLabelItem,
		textLabelItem,
		wPicker
	},
	data() {
		return {
			addricon: '\ue613',
			righticon: 'iconarrow-right',
			dataDic: {
				licenseId: ''
			},
			type: ""
		};
	},
	onLoad(option) {
		if (option.item) {
			let dict = JSON.parse(decodeURIComponent(option.item));
			this.dataDic = {
				...dict,
				actualSubletDate: dict.subletDate
			}
		}
	},
	methods: {
		//时间
		getDate(time) {
			if (!time) return '';
			return time.split(/\s+/)[0];
		},
		getDateStr(time) {
			if (!time) return '--';
			return time.split(/\s+/)[0];
		},
		//确定按钮
		clicksave() {
			if (this.dataDic.rentBackDate && this.dataDic.rentBackDate != null) {
				if (this.$datestr.timedifferent(this.dataDic.rentBackDate, this.dataDic.actualSubletDate) === -1) {
					uni.showToast({
						icon: 'none',
						title: '还租日期不能早于起租日期'
					});
					return;
				}
			}

			// if (this.dataDic.subletState != '2' && this.dataDic.rentBackDate && this.dataDic.rentBackDate != null && this.dataDic.rentBackDate != '') {
			// 	let rentBackDatestr = this.getDate(this.dataDic.rentBackDate);
			// 	uni.showModal({
			// 		title: '提示',
			// 		content: `您将于${rentBackDatestr}还租此设备，是否继续？`,
			// 		success: res => {
			// 			if (res.cancel) {
			// 			} else {
			// 				this.updataMessage()
			// 				this.returnSubletDevice()
			// 			}
			// 		}
			// 	});
			// } else {
			// 	this.updataMessage()
			// }
			this.updataMessage()
		},
		returnSubletDevice() {
			let urlstr = this.$url.RETURN_SUBLET_DEVICE.replace(/{businessNo}/, this.dataDic.businessKey)
				.replace(/{licenseId}/, this.dataDic.licenseId)
				.replace(/{rentBackDate}/, encodeURI(this.dataDic.rentBackDate));
			this.$network
				.getData(urlstr, 'PUT', null)
				.then(result => {
					this.updataMessage()
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.details ? err.details[0] : err.message
					});
				});
		},
		updataMessage() {
			let urlstr = this.$url.SUBLET_UPDATA_MSG + this.dataDic.businessKey
			this.$network.getData(urlstr, 'PUT', this.dataDic).then(result => {
				uni.$emit('refresh-list', {
					type: ''
				});
				uni.navigateBack({
					delta: 1
				})

			}).catch(err => {
				uni.showToast({
					icon: 'none',
					title: err.details ? err.details[0] : err.message
				});
			});
		},
		cancleClick() {
			uni.navigateBack({
				delta: 1
			})
		},
		//备注
		remarkmethod(val) {
			this.dataDic = {
				...this.dataDic,
				remark: val
			}
		},
		//=--------
		gotoDetail() {
			let businessNostr = this.dataDic.businessKey;
			let url = '../sublet-apply-detail?businessNo=' + businessNostr;
			uni.navigateTo({
				url: url
			});
		},
		showdialog(t) {
			this.type = t;
			this.$refs.date.show();
		},
		onConfirm(val) {
			if (this.type === 'start') {
				this.dataDic = {
					...this.dataDic,
					actualSubletDate: val.result + " 00:00:00"
				}
			} else if (this.type === 'end') {
				this.dataDic = {
					...this.dataDic,
					rentBackDate: val.result + " 23:59:59"
				}
			}
		},

	}
};
</script>

<style lang="scss" scoped>
@import "../../assets/_sublet-styles";

.content {
	display: flex;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}

.content-container {
	display: flex;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}

.sum-view-bg {
	display: flex;
	flex-direction: column;
	flex: 1;
	// margin: 10px;
	background: #ffffff;
	// border-radius: 4px;
	padding-bottom: 10px;
}

.cell-input-view {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	padding: 10px;
	border-bottom: $uni-line-color 1px solid;
	font-size: $uni-font-size-base;
}

.cell-input-view-left {
	display: flex;
	flex-direction: row;
	align-items: center;
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

.bottom-view {
	position: fixed;
	display: flex;
	left: 0px;
	right: 0px;
	bottom: 0px;
	height: 60px;
	justify-content: flex-end;
	flex-direction: row;
	align-items: center;
	background: #ffffff;
	z-index: 100;
}

.bottom-left-view {
	display: flex;
	flex: 1;
	height: 40px;
	border-radius: 20px;
	background: $uni-bg-color-grey;
	font-size: $uni-font-size-lg;
	color: $uni-color-primary;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
	margin-left: 10px;
}

.bottom-right-view {
	display: flex;
	flex: 1;
	height: 40px;
	border-radius: 20px;
	background: $uni-color-primary;
	font-size: $uni-font-size-lg;
	color: #ffffff;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
}

.item-head {
	margin-top: 10px;
}

.head-top {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	font-weight: bold;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.head-bottom {
	display: flex;
	flex-direction: row;
	align-items: center;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
	margin-bottom: 4px;
	margin-top: 4px;
}

.line-s {
	margin-top: 10px;
	margin-bottom: 10px;
	height: 1px;
	background: #eeeeee;
}
</style>
