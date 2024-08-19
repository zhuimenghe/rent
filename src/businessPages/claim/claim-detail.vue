<template>
	<view class="content">
		<c-nav-bar-apply :business-key="claimDic.businessKey">索赔详情</c-nav-bar-apply>
		<view class="creat-claime-bg flex-scroll-wrapper">
			<view class="sum-view-bg">
				<view class="model-tag boldstyle">
					<text>客户信息</text>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>合同名称</text></view>
					<view class="cell-input-view-right"  @click="goTo" style="color: #E60000;">
						{{claimDic.customerName||""}}-{{claimDic.projectName}}
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>区域</text></view>
					<view class="cell-input-view-right">
						<text class="text-style">{{claimDic.orgName || ""}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>业务负责人</text></view>
					<view class="cell-input-view-right">
						<text class="text-style">{{claimDic.customerSalesmanName || ""}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>客户名称</text></view>
					<view class="cell-input-view-right">
						<text class="text-style">{{claimDic.customerName || ""}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>索赔联系人</text></view>
					<view class="cell-input-view-right">
						<text class="text-style">{{claimDic.contactName || ""}} </text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>索赔联系人电话</text></view>
					<view class="cell-input-view-right">
						<view class="text-style">
						 <labelPhone :value="claimDic.phoneNum"/></view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>索赔日期</text></view>
					<view class="cell-input-view-right">
						<text class="text-style">{{getDate(claimDic.claimDate) || ""}} </text>
					</view>
				</view>
				
				
			</view>
			<view class="sum-view-bg">
				<view class="model-tag">
					<text class="boldstyle">设备信息</text>
					<view class="tag-right"><text> 总计：{{claimDic.total||"0"}}元</text> </view>

				</view>
				<view class="vehicle-list-container">
					<view v-for="(v,i) in claimDic.claimMachineList" class="v-item-container" :key="i">
						<view class="item-top">
							<view>车号：{{v.licenseId}}</view>
							<view class="top-right">
								<text>{{v.stateName||""}}-{{v.subStateName||""}}</text>
								<!-- <i class="iconfont attachment-icon iconfujian"></i> -->
							</view>

						</view>
						<view class="item-row">
							<text>品牌：{{v.machineBrand||"--"}}</text>
							<text>自喷码：{{v.printCode||"-"}}</text>
						</view>
						<view class="item-row">
							<text>小计：{{v.total||"0"}}元</text>
							<text class="claim-options" @click="showClaimItem(i)">索赔项-></text>
						</view>
					</view>
				</view>
			</view>
      <b-esign-timeline ref="timeline" v-if="isShowEsignTimeline" showExpand :businessNo="claimDic.businessNo"></b-esign-timeline>
			<view class="sum-view-bg">
				<imgupload
				:isupload="false"
				:imgFinishlist='claimDic.fileList'/>
				<textLabelItem tagName="备注" :inputValue="claimDic.remark||'--'" :inputDisabled="true"/>
			</view>

		</view>
    <esign-footer :esignParams="esignParams" ></esign-footer>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
	import labelArrow from '@/components/common/common-ui/label-arrow.vue';
	import imgupload from '@/components/common/image-upload/image-upload.vue';
	import labelPhone from '@/components/common/common-ui/label-phone.vue';
  import esignFooter from "../components/esign-footer.vue";

	export default {
		components: {
			selectLabelItem,
			textLabelItem,
			labelArrow,
			imgupload,
			labelPhone,
      esignFooter
		},
		computed: {
      isShowEsignTimeline(){
        return this.claimDic.signFlow == '1'
      },
      esignParams(){
        return{
          businessState:this.claimDic.state,
          //
          flowStatus:this.claimDic.flowStatus,
          signFlowId:this.claimDic.signFlowId,
          // flowId:this.claimDic.flowId,
          customerType:this.claimDic.customerType,
          customerSalesmanPhoneNum:this.claimDic.customerSalesmanPhoneNum,
          //
          businessType:'claim',
          contactId:this.claimDic.contactId,
          customerId:this.claimDic.customerId,
          customerName:this.claimDic.customerName,
          businessId:this.claimDic.id,
          businessTitle:this.claimDic.customerName + "-" + this.claimDic.projectName + "索赔单",
          businessNo:this.claimDic.businessNo,
          contractNo:this.claimDic.contractNo,
          customerSalesman:this.claimDic.customerSalesman,
          contactName:this.claimDic.contactName,
          customerPhoneNum:this.claimDic.customerPhoneNum,
          orgId:this.claimDic.orgId,
          customerSalesmanName:this.claimDic.customerSalesmanName,
          phoneNum:this.claimDic.phoneNum,
          signFlowTitle:`${this.claimDic.customerName}-${this.claimDic.projectName}`,
        }
      }
		},
		data() {
			return {
        businessNo:'',
				addIndex:0,
				claimDic: {},
			};
		},
    async onShareAppMessage({target,from}) {
      if (from === "button"&&target.dataset.type=='esign') {
        let url = target.dataset.url
        let title = target.dataset.title
        return {
          title,
          imageUrl:"https://test-app-package-sany.oss-cn-beijing.aliyuncs.com/attachment/logo.png", //自定义图片路径 支持PNG及JPG。显示图片长宽比是 5:4。
          path: `/otherPages/esign/webView?url=${encodeURIComponent(url)}&title=${title}`,
        }
      }
    },
    onShow(){
      this.loaddata()
      if(this.$refs.timeline) this.$refs.timeline.init()
    },
		onLoad(option) {
			this.$gxfmethod.statisticData(this.$eventId.Contract_Cxecute,"索赔管理","索赔详情");
      this.businessNo = option.businessNo
			this.$datestr.printlog(key)
			// this.loaddata();
		},
		methods: {
			getDate(time) {
				if (!time) return '';
				return time.split(/\s+/)[0];
			},
			goTo() {
				uni.navigateTo({
					url: '/contractPages/contract/contract-detail?businessNo=' + this.claimDic.contractNo
				});
			},
			loaddata() {
				let param={
					"businessNo":this.businessNo
				}
				this.$network
					.getData(this.$url.CLAIM_DETAIL, 'GET', param)
					.then(result => {
						this.claimDic = result
					})
					.catch(err => {

					});
			},
			showClaimItem(pos) {
				this.addIndex = pos;
				uni.navigateTo({
					url: "./claim-items?isEdit=false&claimList=" + encodeURIComponent(JSON.stringify(this.claimDic.claimMachineList[pos].claimList)) 
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.content {
		position: relative;
		width: 100%;
		height: 100%;
    @include flex(column);
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
		border-bottom: 1px dotted #F0F2F4;
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
		// overflow: hidden;
		// text-overflow: ellipsis;
		// white-space: nowrap;
		// text-align: right;
	}

	.text-style {
		flex: 1;
		text-align: right;
	}

	.input-style {
		text-align: right;
		border-width: 0px 0px 1px 0px;
		border-style: solid;
		border-color: $uni-bg-color-grey;
		width: 140px;
		height: 35px;
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

	// .attachment-icon {
	// 	color: $uni-color-primary;
	// 	font-size: 10px;
	// 	margin-left: 10px;
	// }

	.vehicle-list-container {
		padding: 15px;
	}
	.v-item-container{
		border: 1px dotted #F0F2F4;
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
	.boldstyle{
		font-size: $uni-font-size-lg;
		font-weight: bold;
	}
</style>
