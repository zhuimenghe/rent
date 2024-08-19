<template>
	<view class="pause-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="sum-view-bg">
			<view class="model-tag"><text>基本信息</text></view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>应付单号</text></view>
				<view class="cell-input-view-right">
					<text class="text-style">{{ settleDic.businessNo || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>转租公司</text></view>
				<view class="cell-input-view-right">
					<text class="text-style">{{ settleDic.subletCompanyName || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>转租周期</text></view>
				<view class="cell-input-view-right">
					<text class="text-style">{{ getDate(settleDic.beginDate)}}-{{getDate(settleDic.endDate)}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>转租费用</text></view>
				<view class="cell-input-view-right">
					<text class="text-style">{{ totalNum || '0.00' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>已付费用</text></view>
				<view class="cell-input-view-right">
					<input
					class="input-style" 
					type="digit"
					placeholder="请输入已付金额..."
					v-model="settleDic.paidTotal" 
					/>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>剩余应付</text></view>
				<view class="cell-input-view-right">
					<text class="text-style" style="color: #4cd964;" v-if="parseFloat(getleft(settleDic)) < 0">{{ $datestr.doubleFloat(getleft(settleDic)) || '0.00'}}</text>
					<text class="text-style" style="color: #FF0000;" v-else>{{ $datestr.doubleFloat(getleft(settleDic)) || '0.00'}}</text>
				</view>
			</view>
			<text-label-item
			tagName="备注" 
			placeholder="请输入备注..." 
			@ipnuttext="remarkmethod" 
			:inputValue="settleDic.paidRemark" 
			/>
		</view>
		<view class="bottom-view">
			<view class="bottom-left-view" @click="cancleClick">
				<text>取消</text>
			</view>
			<view class="bottom-right-view" @click="checkData">
				<text>确定</text>
			</view>
		</view>
	</view>
</template>
<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';

export default {
	components: {
		selectLabelItem,
		textLabelItem,
		labelArrow,
		imgupload
	},
	data() {
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			settleDic: {
				paidTotal:'',
				paidRemark:''
			},
			totalNum:0
		};
	},
	watch:{
		'settleDic.paidTotal'(val){
			this.settleDic = {
				...this.settleDic,
				paidTotal:val
			};
			setTimeout(()=> {
				val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
				val = val.replace(/^\./g, ""); //验证第一个字符是数字
				val = val.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
				val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
				val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
				this.settleDic = {
					...this.settleDic,
					paidTotal:val
				};
			}, 10);
		}
	},
	onLoad(option) {
		let dict = JSON.parse(decodeURIComponent(option.item));
		this.settleDic = {
			...dict
		}
		let  total = this.$datestr.doubleFloat(this.settleDic.total) || 0
		let  paidTotal = this.$datestr.doubleFloat(this.settleDic.paidTotal) || 0
		this.totalNum = this.$datestr.doubleFloat(parseFloat(total) + parseFloat(paidTotal))
	},
	methods: {
		getleft(item){
			let  paidTotal = this.$datestr.doubleFloat(item.paidTotal) || 0
			return this.$datestr.doubleFloat(parseFloat(this.totalNum) - parseFloat(paidTotal))
		},
		getDate(time) {
			if (!time) {
				return '--';
			}
			let timestr = time.split(/\s+/)[0];
			return timestr.replace(/-/g,'/')
		},
		//备注
		remarkmethod(val) {
			this.settleDic = {
				...this.settleDic,
				paidRemark:val
			};
		},
		//取消按钮
		cancleClick() {
			uni.navigateBack({
				delta: 1
			});
		},
		checkData(){
			if(!this.settleDic.paidTotal || this.settleDic.paidTotal===""  || this.settleDic.paidTotal==="null"){
				uni.showToast({
					title: '请输入已付金额',
					icon: 'none'
				});
				return;
			}
			let allTotal = this.$datestr.doubleFloat(this.getleft(this.settleDic)).toString()
			let param = {
				...this.settleDic,
				total:allTotal,
				businessNo:this.settleDic.businessNo
			}
			uni.showLoading();
			this.$network
				.getData(this.$url.SUBLET_PAY_FINISH, 'PUT', param)
				.then(result => {
					uni.$emit('refresh-sublet-list', {
						type: ''
					});
					uni.showToast({
						title: '修改成功',
						icon: 'none'
					});
					uni.navigateBack({
						animationDuration: 200
					});
					uni.hideLoading();
				})
				.catch(err => {
					uni.showToast({
						title: err.message + "," + err.details[0],
						icon: 'none'
					});
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	position: relative;
	width: 100%;
	height: 100%;
}

.pause-bg {
	display: flex;
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
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	padding: 10px;
	border-bottom:$uni-line-color 1px solid;
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
	align-items: center;
	justify-content: flex-end;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.text-style {
	flex: 1;
	text-align: right;
}

.input-style {
	text-align: right;
	flex: 1;
	margin-left: 40px;
	padding-top: 5px;
	padding-bottom: 5px;
	padding-right: 10px;
	border: 1px solid $uni-bg-color-grey;
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
.line-s {
	margin-top: 5px;
	margin-left: 5px;
	margin-right: 5px;
	height: 1px;
	background: #eeeeee;
}
.model-tag {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border-color: $uni-bg-color-grey;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	padding: 15px;
	align-items: center;
}
</style>
