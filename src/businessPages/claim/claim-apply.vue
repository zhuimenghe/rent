<template>
	<view class="convtent">
		<c-nav-bar-apply :business-key="claimDic.businessKey">索赔申请</c-nav-bar-apply>
		<approve-step :itemData="itemData" @data-form="dataForm" :orgId="claimDic.orgId" :businessOwner="claimDic.customerSalesman">
			<view class="creat-claime-bg">
				<view class="sum-view-bg">
					<view class="model-tag boldstyle"><text>客户信息</text></view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>合同名称</text></view>
						<view class="cell-input-view-right">{{ claimDic.customerName || '' }}-{{ claimDic.projectName }}</view>
					</view>

					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>区域</text></view>
						<view class="cell-input-view-right">
							<text class="text-style">{{ claimDic.orgName || '' }}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>业务负责人</text></view>
						<view class="cell-input-view-right">
							<text class="text-style">{{ claimDic.customerSalesmanName || '' }}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>客户名称</text></view>
						<view class="cell-input-view-right">
							<text class="text-style">{{ claimDic.customerName || '' }}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>索赔联系人</text></view>
						<view class="cell-input-view-right">
							<text class="text-style">{{ claimDic.contactName || '' }}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>索赔联系人电话</text></view>
						<view class="cell-input-view-right">
							<view class="text-style"><labelPhone :value="claimDic.phoneNum" /></view>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>索赔日期</text></view>
						<view class="cell-input-view-right">
							<text class="text-style">{{ getDate(claimDic.claimDate) || '' }}</text>
						</view>
					</view>
				</view>
				<view class="sum-view-bg">
					<view class="model-tag">
						<text class="boldstyle">设备信息</text>
						<view class="tag-right">
							<text>总计：{{ claimDic.total || '0' }}元</text>
						</view>
					</view>
					<view class="vehicle-list-container">
						<view v-for="(v, i) in claimDic.claimMachineList" class="v-item-container" :key="i">
							<view class="item-top">
								<text>车号：{{ v.licenseId || '' }}</text>
								<view class="top-right">
									<text>{{ v.stateName || '' }}-{{ v.subStateName || '' }}</text>
									<!-- <i class="iconfont attachment-icon iconfujian"></i> -->
								</view>
							</view>
							<view class="item-row">
								<text>品牌：{{ v.machineBrand || '--' }}</text>
								<text>自喷码：{{ v.printCode || '-' }}</text>
							</view>
							<view class="item-row">
								<text>小计：{{ v.total || '0' }}元</text>
								<text class="claim-options" @click="showClaimItem(i)">索赔项-></text>
							</view>
						</view>
					</view>
				</view>
				<view class="sum-view-bg">
					<imgupload
					:isupload="needuploadFile"
					@uploadfinish="uploadfinish" 
					@deleteUrl="deleteUrl" 
					:imgFinishlist="imgList" 
					type="claim_type" 
					uploadType="attachment" 
					/>
					<text-label-item 
					inputDisabled="true" 
					tagName="备注" 
					:inputValue="claimDic.remark" 
					/>
				</view>
			</view>
		</approve-step>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import approveStep from '@/components/workflow/approve-step.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';
import labelPhone from '@/components/common/common-ui/label-phone.vue';

export default {
	components: {
		selectLabelItem,
		textLabelItem,
		labelArrow,
		approveStep,
		imgupload,
		labelPhone
	},
	computed: {},
	data() {
		return {
			addIndex: 0,
			itemData: {},
			claimDic: {},
			imgList:[],
			needuploadFile:false
		};
	},
	onLoad(option) {
		this.itemData = JSON.parse(decodeURIComponent(option.item));
		console.log(this.itemData);
		this.getUploadFile();
	},
	methods: {
		getDate(time) {
			if (!time) return '';
			return time.split(/\s+/)[0];
		},
		dataForm(val) {
			this.claimDic = JSON.parse(val);
			let flieList = this.claimDic.fileList ? this.claimDic.fileList : [];
			this.imgList = [...flieList];
		},
		getUploadFile(){
			// needuploadFile
			// WORKFLOW_FILE_UPLOAD
			let param={
				"taskId":this.itemData.id,
				"id":"attachment"
			}
			this.$network.getData(this.$url.WORKFLOW_FILE_UPLOAD, 'GET', param).then(result => {
				let list = result ? result : [];
				let dict = list.length > 0 ? list[0] : {};
				console.log(dict);
				this.needuploadFile = dict.readable ? dict.readable : false
				console.log(this.needuploadFile);
			}).catch(err => {
			
			});
		},
		showClaimItem(pos) {
			this.addIndex = pos;
			uni.navigateTo({
				url: './claim-items?claimList=' + encodeURIComponent(JSON.stringify(this.claimDic.claimMachineList[pos].claimList)) + '&isEdit=false'
			});
		},
		//上传图片回调
		uploadfinish(val) {
			let list = val.data;
			this.dealList(list);
		},
		//删除回调
		deleteUrl(val) {
			let list = val.data;
			this.dealList(list);
		},
		dealList(list){
			this.imgList = [...list]
			this.submitFiles();
		},
		submitFiles() {
			uni.showLoading();
			let param = {
				businessNo: this.claimDic.id,
				fileList: this.imgList
			};
			let url = this.$url.CONTRACT_FILELIST_SAVE_USER;
			this.$network.getData(url, 'POST', param).then(result => {
				uni.hideLoading()
			}).catch(err => {
				uni.hideLoading()
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.content {
	position: relative;
	width: 100%;
	height: 100%;
}

.creat-claime-bg {
	display: flex;
	flex: 1;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}

.sum-view-bg {
	display: flex;
	flex-direction: column;
	flex: 1;
	margin: 10px;
	background: #ffffff;
	border-radius: 4px;
}

.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	padding: 10px;
	font-size: $uni-font-size-base;
	border-bottom: 1px dotted #f0f2f4;
}

.cell-input-view-left {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.cell-input-view-right {
	flex: 1;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	margin-left: 10px;
	text-align: end;
}

.text-style {
	flex: 1;
	text-align: right;
}

.model-tag {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border-color: $uni-bg-color-grey;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	padding: 15px;
	align-items: center;
}

.tag-right,
.top-right {
	display: flex;
	flex-direction: row;
	align-items: center;
	text-align: center;
}

.labelstyle {
	color: $uni-color-primary;
	font-size: 20px;
	margin-left: 10px;
}

.attachment-icon {
	color: $uni-color-primary;
	font-size: 10px;
	margin-left: 10px;
}

.vehicle-list-container {
	padding: 15px;
}

.v-item-container {
	border: 1px dotted #f0f2f4;
	border-radius: 4px;
	margin-top: 8px;
	padding: 6px;
}

.item-top {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border-color: $uni-bg-color-grey;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	margin-top: 10px;
	margin-bottom: 10px;
}

.item-row {
	display: flex;
	flex-direction: row;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	margin-top: 10px;
	margin-bottom: 10px;
}

.claim-options {
	color: $uni-color-primary;
}

.item-row text {
	flex: 1;
}

.boldstyle {
	font-size: $uni-font-size-lg;
	font-weight: bold;
}
</style>
