<template>
	<view v-if="showPopup" class="uni-popup" @click="onTap">
		<view class="transClass" @click.stop="clear">
			<view class="uni-tip">
				<view class="flow-choose">
					<view class="model-tag"><text>选择退回环节</text></view>
					<view class="processing-staff-item">
						<view class="assign-tag">环节名称</view>
						<view class="assign-container" @click="choosNode">
							<view class="assigners-value">{{ selectedNode.name || '请选择...' }}</view>
							<i class="iconfont iconarrow-right"></i>
						</view>
					</view>
					<view class="remark-item">
						<view>审批意见</view>
						<view class="remark-text">
							<textarea 
							class="textarea"
							:placeholder="$t('common.inputTip')" 
							v-model="passInput" 
							/>
						</view>
					</view>
				</view>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button pop-cancel" @click="clickCancle">取消</text>
					<text class="uni-tip-button pop-confirm" @click="clickOk">确定</text>
				</view>
			</view>
		</view>
		<w-picker
		:selectList="selectList" 
		@confirm="onConfirm" 
		mode="selector" 
		ref="selector"
		themeColor="#E60000" />
	</view>
</template>
<script>
import wPicker from '@/components/common/w-picker/w-picker.vue';
export default {
	components: {
		wPicker
	},
	props: {
		// maskClick
		maskClick: {
			type: Boolean,
			default: true
		},
		itemDataid:{
			type: String,
			default: ''
		},
		procDefId:{
			type: String,
			default: ''
		},
		urlapi:{
			type: String,
			default: ''
		},
		isFilter:{
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			passInput: '',
			selectList:[],
			selectedNode:{},
			//===========================
			showPopup: false,
		};
	},
	created() {
	},
	methods: {
		getBackNode() {
			this.workflowcommon.getProcessNode(this.urlapi,this.procDefId).then((item)=>{
				this.workflowcommon.getBackNode(this.urlapi,this.itemDataid,item).then((list)=>{
					this.selectList = list				
				}).catch(()=>{
					this.$datestr.printlog(error);
				})
			}).catch((error)=>{
				this.$datestr.printlog(error);
			})
		},
		choosNode() {
			this.getBackNode();
			this.$refs.selector.show();
		},
		clear(e) {
			e.stopPropagation();
		},
		open() {
			this.showPopup = true;
			this.$emit('change', {
				show: true
			});
		},
		close(type) {
			this.showTrans = false;
			this.$nextTick(() => {
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.$emit('change', {
						show: false
					});
					this.showPopup = false;
				}, 300);
			});
		},
		onTap() {
			if (!this.maskClick) return;
			this.close();
		},
		clickOk() {
			this.$emit('choosNode', {
				selectArr: this.selectedNode,
				remark:this.passInput
			});
		},
		clickCancle(){
			this.close();
		},
		onConfirm(val) {
			this.selectedNode = val.checkArr;
		},
	}
};
</script>
<style lang="scss" scoped>
.uni-popup {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: $uni-bg-color-mask;
	z-index: 699;
	opacity:1;
}
.transClass {
	position: fixed;
	display: flex;
	flex-direction: column;
	bottom: 0;
	left: 0;
	right: 0;
	top: 0;
	justify-content: center;
	align-items: center;
	opacity: 1;
}
.uni-tip {
	position: relative;
	display: flex;
	flex-direction: column;
	padding: 15px;
	background-color: #ffffff;
	border-radius: 10px;
	width: 300px;
}

.flow-choose {
	display: flex;
	flex: 1;
	flex-direction: column;
	background: #ffffff;
	border-radius: 4px;
	z-index: 500;
}

.model-tag {
	display: flex;
	padding: 10px 0px;
	flex-direction: row;
	justify-content: space-between;
	border-color: $uni-bg-color-grey;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	color: $uni-text-color;
	font-weight: bold;
	font-size: $uni-font-size-base;
	align-items: center;
}

.processing-staff-item {
	padding: 10px 0px;
	margin: 0px 10px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	border-color: $uni-bg-color-grey;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.assign-tag {
	width: 72px;
	min-width: 72px;
}
.assign-container {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}

.remark-item {
	padding: 10px 0px;
	margin: 0px 10px;
	display: flex;
	flex-direction: column;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.textarea {
	background-color: #fbfbfb;
	border-radius: 4px;
	width: calc(100% - 32px);
	height: 72px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	margin-top: 8px;
	padding: 8px;
}
.flow-btns {
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
	z-index: 502;
	padding-bottom:calc(env(safe-area-inset-bottom) - 10px);
}
.cancel-btn {
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

.submit-btn {
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
