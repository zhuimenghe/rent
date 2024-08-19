<template>
	<view class="content">
		<view :style="{ 'margin-bottom': isCanEdit ? '56px' : '0px', 'background-color': '#ffffff', 'padding-bottom': '10px','display':'flex','flex-direction':'column'}">
			<view v-for="(item, index) in viewList" :key="index" class="row-item">
				<view class="row-tag">
					{{ item.label }}
					<text style="color: #FF0000;" v-if="showRequired(item)">*</text>
					:
				</view>
				<view v-if="!isEdit" class="right-continer-text">
					<text  class="right-continer-text-text">{{ extendedData[item.prop] ? extendedData[item.prop] : '-' }}</text>
				</view>
				<view v-if="isEdit && item.type == 'textarea'" class="right-continer">
					<textarea
						class="input-style"
						:value="extendedData[item.prop] ? extendedData[item.prop] : ''"
						@input="inputChange($event, item.prop)"
						maxlength="300"
						auto-height="true"
					/>
				</view>
				<view v-if="isEdit && item.type != 'textarea'" class="right-continer">
					<input
						class="input-style"
						:placeholder="item.rules && item.rules.message ? item.rules.message : ''"
						:value="extendedData[item.prop] ? extendedData[item.prop] : ''"
						@input="inputChange($event, item.prop)"
					/>
				</view>
			</view>
		</view>
		<view class="bottom-container" v-if="isCanEdit">
			<view class="btn" @click="doOperate">{{ isEdit ? '取消' : '编辑' }}</view>
			<view class="btn" @click="save">保存</view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
export default {
	props: {
		extendedDataStr: {
			type: String,
			default: ''
		},
		extendTagInfo: {
			type: String,
			default: ''
		},
		contractId: {
			type: String,
			default: ''
		},
		isCanEdit: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		extendedDataStr(val) {
			this.extendedData = JSON.parse(this.extendedDataStr);
			this.orignData = this.extendedData;
		},
		extendTagInfo(val) {
			this.viewList = JSON.parse(this.extendTagInfo);
		}
	},
	data() {
		return {
			orignData: {},
			extendedData: {},
			isEdit: false,
			viewList: []
		};
	},
	created() {
		if (this.extendedDataStr) {
			this.extendedData = JSON.parse(this.extendedDataStr) || {};
			this.orignData = this.extendedData;
		}
		if (this.extendTagInfo) {
			this.viewList = JSON.parse(this.extendTagInfo);
		}
	},
	methods: {
		showRequired(item) {
			if (this.isEdit && item.rules && item.rules.required) {
				return item.rules.required;
			}
			return false;
		},
		inputChange(e, props) {
			this.extendedData[props] = e.target.value;
		},
		doOperate() {
			this.isEdit = !this.isEdit;
			if (!this.isEdit) {
				this.extendedData = this.orignData;
			}
		},
		save() {
			if(!this.extendedData.workInUser || this.extendedData.workInUser == ''){
				uni.showToast({
					title:'请输入进场授权人',
					icon:'none'
				})
				return
			}
			if(!this.extendedData.workInPhone || this.extendedData.workInPhone == ''){
				uni.showToast({
					title:'请输入进场授权人正确的手机号',
					icon:'none'
				})
				return
			}
			if(!this.$datestr.isphonenum(this.extendedData.workInPhone)){
				uni.showToast({
					title:'请输入进场授权人正确的手机号',
					icon:'none'
				})
				return
			}
			if(this.extendedData.workInID && this.extendedData.workInID != ''){
				if (!this.$datestr.isIdCard(this.extendedData.workInID)) {
					uni.showToast({
						icon: 'none',
						title: '请输入进场授权人正确的身份证号'
					});
					return;
				}
			}
			if(!this.extendedData.settleUser || this.extendedData.settleUser == ''){
				uni.showToast({
					title:'请输入结算授权人',
					icon:'none'
				})
				return
			}
			if(!this.extendedData.settlePhone || this.extendedData.settlePhone == ''){
				uni.showToast({
					title:'请输入结算授权人正确的手机号',
					icon:'none'
				})
				return
			}
			if(!this.$datestr.isphonenum(this.extendedData.settlePhone)){
				uni.showToast({
					title:'请输入进场授权人正确的手机号',
					icon:'none'
				})
				return
			}
			if(this.extendedData.settleID && this.extendedData.settleID != ''){
				if (!this.$datestr.isIdCard(this.extendedData.settleID)) {
					uni.showToast({
						icon: 'none',
						title: '请输入结算授权人的正确身份证号'
					});
					return;
				}
			}
			// return
			//成功后
			let param = {
				id: this.contractId,
				extendedData: JSON.stringify(this.extendedData)
			};
			uni.showLoading();
			this.$network
				.getData(this.$url.UPDATE_EXTEND_INFO, 'PUT', param)
				.then(result => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: '保存成功'
					});
					this.isEdit = false;
					this.orignData = this.extendedData;
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: err.message ? err.message : ''
					});
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	width: 100%;
	position: relative;
}

.row-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	background-color: #ffffff;
}

.row-tag {
	margin-left: 10px;
	text-align: left;
	min-width: 100px;
}
.right-continer-text {
	display: flex;
	flex: 1;
	margin-left: 10px;
	padding: 10px;
	
}
.right-continer-text-text{
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	word-wrap:break-word;
	word-break:break-all;
}
.right-continer {
	flex: 1;
	margin-left: 10px;
	padding: 10px;
	border-bottom: 1px dotted $uni-bg-color-grey;
	border-radius: 4px;
}

.input-style {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	// padding: 2px 5px;
	width: 100%;
}

.text-style {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	padding: 2px 0px;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.bottom-container {
	display: flex;
	flex-direction: row;
	justify-content: center;
	position: fixed;
	bottom: 0px;
	left: 0px;
	width: 100%;
	z-index: 200;
	padding-bottom:env(safe-area-inset-bottom);
}

.btn {
	flex: 1;
	background-color: $uni-color-primary;
	color: #ffffff;
	text-align: center;
	margin: 2px 8px;
	border-radius: 4px;
	padding: 8px 0px;
}
</style>
