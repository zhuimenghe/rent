<template>
	<view v-if="showPopup" class="uni-popup"  @click="onTap">
		<view class="transClass" @click.stop="clear">
			<view class="uni-tip">
				<view class="flow-choose">
					<view class="model-tag"><text>选择处理人员</text></view>
					<view class="processing-staff-item">
						<view class="assign-tag">处理人员<text v-if="require" style="color: #FF0000;">*</text></view>
						<view class="assign-container" @click="chooseAssign">
							<view class="assigners-value">{{ assignees || '请选择...' }}</view>
							<i class="iconfont iconarrow-right"></i>
						</view>
					</view>
					<view class="remark-item">
						<view>审批意见</view>
						<view class="remark-text">
							<textarea :placeholder="$t('common.inputTip')" v-model="passInput" />
						</view>
					</view>
				</view>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button pop-cancel" @click="clickCancle">取消</text>
					<text class="uni-tip-button pop-confirm" @click="clickOk">确定</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	components: {
	},
	props: {
		require:{
			type: Boolean,
			default: false
		},
		// maskClick
		maskClick: {
			type: Boolean,
			default: true
		},
		orgId:{//业务Id
			type: String,
			default: ""
		}
	},
	data() {
		return {
			assignees: '',
			alist: [],
			passInput: '',
			//===========================
			showPopup: false,
		};
	},
	created() {
		uni.$on("choosedAssign", obj => {
			this.alist = obj.data;
			let choosedList = [];
			this.alist.forEach(o => {
				choosedList.push(o.username)
			})
			this.assignees = choosedList.join(",")
		})
		
	},
	methods: {
		chooseAssign() {
			uni.navigateTo({
				url: '/businessPages/workflow/choose-assigner?choosedList=' + JSON.stringify(this.alist)
			})
		},
		clear(e) {
			// TODO nvue 取消冒泡
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
			if(this.require&&this.alist.length==0){
				uni.showToast({
					icon:'none',
					title: '处理人员不能为空',
					duration: 2000
				});
				return;
			}else{
				this.$emit('getAssignList', {
				selectArr: this.alist,
				remark:this.passInput
			});
			}
		},
		clickCancle(){
			this.close();
		}
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
	z-index: 399;
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
