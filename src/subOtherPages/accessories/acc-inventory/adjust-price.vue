<template>
	<view class="creat-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<create-step
		processKey="partsUnitPrice"
		@submitApply="clicksave" 
		:orgId="dataDic.orgId" 
		:itemData="backDic" 
		@data-form="getBackData"
		:updateObj="dataDic"
		:isUpdate="isUpdate">
			<view class="sum-view-bg" style="margin-bottom: 5px;">
				<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
					<view class="cell-input-view-left boldstyle">
						<text>配件信息</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>单号:</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{dataDic.businessNo || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>型号:</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{dataDic.partsBasics.modelName || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>名称</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{dataDic.partsBasics.name || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>类别</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{dataDic.partsBasics.category || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>品牌</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{dataDic.partsBasics.brandName || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>适用范围</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{dataDic.partsBasics.scopeApplication || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>来源</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{dataDic.partsSourceName || "--"}}</text>
					</view>
				</view>
				<text-label-item tagName="备注" :inputValue="dataDic.partsBasics.remark" :inputDisabled='true' tagColor="#999999"/>
			</view>
			<view class="sum-view-bg" style="margin-bottom: 5px;">
				<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
					<view class="cell-input-view-left boldstyle">
						<text>价格修改</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>当前销售单价</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{dataDic.originalAmount || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>调整后单价</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" 
						type="number" 
						v-model="dataDic.adjustedAmount"
						placeholder="请输入调整后单价...."
						/>
					</view>
				</view>
				<text-label-item
				tagName="备注" 
				@ipnuttext="remarkmethod"
				:inputValue="dataDic.remark"
				/>
			</view>
		</create-step>
	</view>
</template>

<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import createStep from '@/components/workflow/create-step.vue';
export default{
	components: {
		selectLabelItem,
		textLabelItem,
		labelArrow,
		createStep
	},
	data(){
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			
			backDic: null,
			isUpdate:false,
			dataDic:{}
		}
	},
	watch:{
		'dataDic.adjustedAmount'(val){
			this.dataDic = {
				...this.dataDic,
				"adjustedAmount": val
			}	
			setTimeout(()=> {
				val = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
				val = val.replace(/^\./g, ""); //验证第一个字符是数字
				val = val.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
				val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
				val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
				this.dataDic = {
					...this.dataDic,
					"adjustedAmount": val
				}
			}, 10);
		},
	},
	onLoad(option) {
		if (option.item) {
			//退回编辑,撤回提交
			this.backDic = JSON.parse(decodeURIComponent(option.item))
			this.isUpdate = option.isUpdate ? (option.isUpdate === "1" ? true : false):false
			if(this.isUpdate){
				this.loaddata(this.backDic.businessNo)
			}
		}
		if (option.inventory) {
			let dict = JSON.parse(decodeURIComponent(option.inventory))
			this.dataDic = {
				...dict,
				id:"",
				stockId:dict.id,
				originalAmount:dict.salePrice
			}
			this.getBusinessNo();
		}
	},
	methods:{
		//撤回时获取详情
		loaddata(key) {
			let url = this.$url.ACC_STORAGR_DETAIL + key
			this.$network.getData(url, 'GET', null).then(result => {
				this.dataDic = {
					...result,
				};
			}).catch(err => {});
		},
		// 获取单号
		getBusinessNo() {
			let url = this.$url.CREATE_PART_NO.replace(/{type}/, 'PJDJ')
			this.$network.getData(url, "GET", null).then((result) => {
				this.dataDic = {
					...this.dataDic,
					"businessNo": result,
				}
			}).catch((err) => {})
		},
		// 获取退回后通过dataForm接口获取的数据详情
		getBackData(val) {
			this.dataDic = JSON.parse(val)
		},
		//备注
		remarkmethod(val) {
			this.dataDic = {
				...this.dataDic,
				remark:val
			}
		},
		checkData(){
			if (!this.dataDic.adjustedAmount) {
				uni.showToast({
					title: '请输入调整后价格',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			return Promise.resolve('success');
		},
		clicksave(val){
			uni.showLoading({
				mask: true
			});
			this.$network
				.getData(this.$url.ACC_INVENTORY_UPDATAPRICE + val, 'POST', this.dataDic)
				.then(result => {
					uni.$emit('refresh-acc-list', {
						type: ''
					});
					uni.$emit("refresh-notification-list", {
						type: 'apply'
					})
					uni.navigateBack({
						animationDuration: 200
					});
					uni.hideLoading();
				})
				.catch(err => {
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
					uni.hideLoading();
				});	
		}
	}
}
</script>

<style lang="scss" scoped>
.creat-bg {
	display: flex;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}
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
	margin: 10px;
	font-size: $uni-font-size-base;
}
.cell-input-view-left {
	display: flex;
	align-items: center;
	min-width: 60px;
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
.input-style {
	flex: 1;
	text-align: right;
}
.cell-section-view {
	display: flex;
	flex-direction: column;
	flex: 1;
	border: 1px solid $uni-bg-color-grey;
	border-radius: 4px;
	margin: 2px 4px;
}
.cell-between {
	display: flex;
	margin: 0px 4px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.cell-section-view-width {
	display: flex;
	flex-direction: row;
	flex: 1;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
	align-items: center;
	justify-content: center;
}

.cell-view {
	font-size: $uni-font-size-base;
	font-weight: bold;
	color: $uni-text-color
}
.cell-input-view-list {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: space-between;
	min-height: 30px;
	font-size: $uni-font-size-base;
}

.cell-input-view-list-row {
	display: flex;
	flex-direction: row;
	flex: 1;
}

.cell-input-view-list-column {
	display: flex;
	flex-direction: column;
	flex: 1;
	margin-left: 4px;
}
.cell-input-view-left-small {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	min-height: 20px;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
}
.add-btn {
	background-color: $uni-color-primary;
	padding: 2px 6px;
	border-radius: 4px;
	color: #FFFFFF;
}
.boldstyle {
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-top: 5px;
	margin-bottom: 10px;
}
.workin-dd-list {
	display: flex;
	flex-direction: column;
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
</style>
