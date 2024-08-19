
<template>
	<view class="creat-invoice-bg">
		<view class="sum-view-bg">
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>标题</text>
				</view>
				<view class="cell-input-view-right">
					<input class="input-style" 
					type="text" 
					v-model="title" 
					placeholder="请输入标题...." 
					/>
				</view>
			</view>
			
			<text-label-item
			tagName="内容" 
			placeholder="请输入内容..." 
			@ipnuttext="remarkmethod"
			:inputValue="remark"
			/>
			<!-- 上传图片 -->
			<imgupload 
			@uploadfinish="uploadfinish" 
			@deleteUrl="deleteUrl"
			type="invoice_type" 
			uploadType="attachment"
			maximg="20"
			:imgFinishlist="fileList"
			/>
		</view>
		<view class="bottom-view">
			<view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
			<view class="bottom-right-view" @click="clicksave"><text>提交</text></view>
		</view>
		
		<alertPopup 
		ref="aletrview" 
		@getAssignList="getAssignList" 
		:mask-click="true" 
		/>
		
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
import imgupload from '@/components/common/image-upload/image-upload.vue';
import alertPopup from '@/components/common/uni-popup/alert-pop.vue';
export default {
	components: {
		selectLabelItem,
		textLabelItem,
		alertPopup,
		imgupload
	},
	data() {
		return {
			businessNo:'',
		    title:"",//标题
			remark:"",//备注
			orgId:"",
			applicantId:'',
			fileList:[],//图片列表
			
			backType: -1,
			backDic: {},
			backDicDetail: {},
		};
	},
	onLoad(option) {
	    uni.getStorage({
	    	key: this.$savekey.USER_INFO_MEG,
	    	success: (res)=>{
	    		this.orgId = res.data.orgId;
				this.applicantId = res.data.id;
	    	}
	    });
		if (option.backType === "1" || option.backType === "2") {
			//退回1撤回2
			this.backType = Number(option.backType);
			this.backDic = JSON.parse(decodeURIComponent(option.item));
			this.loaddata(this.backDic.businessNo)
		} else {
			this.getBusinessNo()
		}
	},
	methods: {
		getBusinessNo() {
			let url = this.$url.CREATE_BUSINESS_NO.replace(/contractapi/, "contractapi").replace(/{type}/, 'TY')
			this.$network.getData(url, "GET", null).then((result) => {
				this.businessNo = result;
			}).catch((err) => {
		
			})
		},
		loaddata(key) {
			let param = {
				businessNo: key
			};
			this.$network
				.getData(this.$url.COMMON_APPROVE_DETAIL, 'GET', param)
				.then(result => {
					this.dealData(result);
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		dealData(result) {
			this.businessNo = result.businessNo;
			this.backDicDetail = result;
			this.title = result.approveName;
			this.remark = result.content;
			this.orgId = result.orgId;
			this.applicantId = result.applicantId;
			this.fileList = result.fileList;
			console.log("33333333");
		},
		remarkmethod(val){
			this.$datestr.printlog(val);
			this.remark = val;
		},
		//上传图片回调
		uploadfinish(val){
			let list= val.data;
			this.fileList = list;
		},
		//删除回调
		deleteUrl(val){
			let list= val.data;
			this.fileList = list;
		},
		//取消按钮
		clickecancle(){
			uni.navigateBack({
				delta: 1
			})
		},
		//确定按钮
		clicksave(){
			if(this.title === ""){
				uni.showToast({
					icon:"none",
					title:"请输入标题"
				});
				return;
			}
			if(this.remark === ""){
				uni.showToast({
					icon:"none",
					title:"请输入内容"
				});
				return;
			}
			this.httprequestData();
		},
		httprequestData() {
			uni.showLoading({
				mask: true
			});
			this.workflowcommon.iswf('commonApprove').then((iswf) => {
				if (iswf) {
					this.workflowcommon
						.getFirstNodeUser('contractapi', 'commonApprove', this.orgId, null)
						.then(showToast => {
							this.$datestr.printlog(showToast)
							if (showToast) {
								this.$refs.aletrview.open();
								uni.hideLoading();
							} else {
								if (this.backType === 1) {
									//退回
									this.thoughSaveData([], '');
								} else {
									let assnstr = this.workflowcommon.submitData(false, []);
									this.submitSaveData(assnstr);
								}
							}
						})
						.catch(error => {
							uni.hideLoading();
							uni.showToast({
								icon: "none",
								title: error.message
							});
						});
				} else {
					if (this.backType === 1) {
						//退回
						this.thoughSaveData([], '');
					} else {
						this.submitSaveData("");
					}
				}
			})
		
		},
		//弹窗提示返回
		getAssignList(val) {
			let alist = val.selectArr;
			if (this.backType === 1) {
				//退回
				let asList = alist.map(o => {
					return o.id
				})
				this.thoughSaveData(asList, '');
			} else {
				let assnstr = this.workflowcommon.submitData(true, alist);
				this.submitSaveData(assnstr);
			}
		},
		submitSaveData(val) {
			let datestr = this.$datestr.getnowDate();
			let savedic = {
				"businessNo": this.businessNo,
				"approveName": this.title,
				"content": this.remark,
				fileList: this.fileList,
				orgId: this.orgId,
				applicantId: this.applicantId,
				applicationTime:datestr
			}
		
			let url = this.$url.COMMON_APPROVE_CREATE + val;
			this.$network.getData(url, 'POST', savedic).then(result => {
					uni.$emit('refresh-approve-list', {
						type: "refresh-approve-list"
					});
					uni.$emit("refresh-notification-list", {
						type: 'apply'
					})
					uni.navigateBack({
						animationDuration: 200
					});
					uni.hideLoading()
				})
				.catch(err => {
					uni.hideLoading()
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
				});
		},
		thoughSaveData(val, inputstr) {
			let datestr = this.$datestr.getnowDate();
			let savedic = {
				...this.backDicDetail,
				"businessNo": this.businessNo,
				"approveName": this.title,
				"content": this.remark,
				fileList: this.fileList,
				orgId: this.orgId,
				applicantId: this.applicantId,
				applicationTime:datestr
			}
			uni.showLoading({
				mask: true
			});
			let jsonstr = JSON.stringify(savedic);
			this.workflowcommon
				.passapply('contractapi', val, inputstr, jsonstr, this.backDic.procDefId, this.backDic.procInstId, this.backDic
					.id)
				.then(showToast => {
					uni.$emit("refresh-notification-list", {
						type: 'wait'
					})
					uni.navigateBack({
						animationDuration: 100
					});
					uni.hideLoading();
				})
				.catch(error => {
					uni.hideLoading();
					uni.showToast({
						icon: "none",
						title: error.message
					});
		
				});
		},
		
	}
};
</script>

<style lang="scss" scoped>
.creat-invoice-bg {
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
	margin-bottom: 70px;
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
.bottom-view{
	position: fixed;
	display: flex;
	left: 0px;
	right: 0px;
	bottom: 0px;
	height: 60px;
	justify-content: flex-end;
	flex-direction: row;
	align-items: center;
	background: #FFFFFF;
	z-index: 100;
}
.bottom-left-view{
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
.bottom-right-view{
	display: flex;
	flex: 1;
    height: 40px;
    border-radius: 20px;
    background: $uni-color-primary;
    font-size: $uni-font-size-lg;
    color: #FFFFFF;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
}
</style>
