<template>
	<view class="content">
		<c-nav-bar-apply :business-key="pauseDic.businessKey">报停详情</c-nav-bar-apply>
		<view class="pause-bg">
			<view class="sum-view-bg">
				<view class="model-tag boldstyle">
					<text>客户信息</text>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>合同名称</text></view>
					<view class="cell-input-view-right" @click="goTo" style="color: #E60000;">
						{{pauseDic.customerName||""}}-{{pauseDic.projectName}}
					</view>
				</view>
				
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>区域</text></view>
					<view class="cell-input-view-right">
						<text class="text-style">{{pauseDic.orgName || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>业务负责人</text></view>
					<view class="cell-input-view-right">
						<text class="text-style">{{pauseDic.customerSalesmanName || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>客户名称</text></view>
					<view class="cell-input-view-right">
						{{pauseDic.customerName||"--"}}
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>报停联系人</text></view>
					<view class="cell-input-view-right">
						{{pauseDic.contactName||"--"}}
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>报停联系人电话</text></view>
					<view class="cell-input-view-right">
						<labelPhone :value="pauseDic.phoneNum"/>
					</view>
				</view>
			</view>
			<view class="sum-view-bg">
				<view class="model-tag boldstyle">
					<text>设备信息（共{{pauseDic.machines.length||"0"}}辆，总计{{pauseDic.total||'0.00'}}元）</text>

				</view>
				<view class="vehicle-list-container">
					<view v-for="(v,i) in pauseDic.machines" class="v-item-container" :key="i">
						<view class="item-top">
							<text>车号：{{v.licenseId||"--"}}</text>
							<view class="top-right">
								<text>{{v.workOutDate?"已退租":"租赁中"}}</text>
								<!-- <text>{{v.stateName}}-{{v.subStateName}}</text> -->
							</view>

						</view>
						<view class="item-row">
							<text>品牌：{{v.machineBrand||"--"}}</text>
							<text>自喷码：{{v.printCode||"-"}}</text>
						</view>
						<view class="item-row">
							<tag-select tagName="报停开始时间" :value="getDate(v.beginDate)" :isSelect="false" :textColor="textColor"
							 :fontSize="fontSize"></tag-select>
							<tag-select tagName="报停结束时间" :value="getDate(v.endDate)" :isSelect="false" :textColor="textColor" :fontSize="fontSize"></tag-select>

						</view>
						<view class="item-row">
							<tag-select tagName="预计报停天数" :value="v.pauseDays||'--'" :isSelect="false" :textColor="textColor" :fontSize="fontSize"></tag-select>
							<!-- <tag-select tagName="报停租金(元)" :value="v.pauseHire||'--'" :isSelect="false" :textColor="textColor" :fontSize="fontSize"></tag-select> -->
						</view>
					</view>
				</view>
			</view>
			<view class="sum-view-bg">
				<view class="model-tag boldstyle">
					<text>报停信息</text>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>报停类型</text></view>
					<view class="cell-input-view-right">
						{{pauseDic.pauseCauseName||""}}
					</view>
				</view>
				<imgupload :isupload="false" :imgFinishlist='pauseDic.fileList' />
				<text-label-item tagName="报停原因" :inputValue="pauseDic.reason" :inputDisabled="true" />
			</view>
		</view>

    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
	import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
	import TagSelect from "@/components/common/uni-tag/tag-select.vue";
	import imgupload from '@/components/common/image-upload/image-upload.vue';
    import labelPhone from '@/components/common/common-ui/label-phone.vue';
	export default {
		components: {
			textLabelItem,
			TagSelect,
			imgupload,
			labelPhone
		},
		computed: {

		},
		data() {
			return {
				dateIcon: "iconzl--rili",
				companyicon: "iconiconzhengli_zuzhijiagou",
				righticon: "iconarrow-right",
				textColor: "#333333",
				fontSize: "14px",
				pauseDic: {
					machines: [],
				},
			};
		},
		onLoad(option) {
			this.$gxfmethod.statisticData(this.$eventId.Contract_Cxecute,"报停管理","报停详情");
			this.$datestr.printlog("option" + JSON.stringify(option))
			if (option.id) {
				this.loaddata(option.id);
			}
		},
		methods: {
			loaddata(key) {
				let param = {
					businessNo: key
				}
				this.$network
					.getData(this.$url.PAUSE_DETAIL, 'GET', param)
					.then(result => {
						this.pauseDic = result
						this.calTotal();
					})
					.catch(err => {

					});
			},
			getDate(time) {
				if (!time) {
					return "--";
				}
				return time.split(/\s+/)[0];
			},
			calTotal(){
				let total = this.pauseDic.machines.reduce((x, y) => {
					return x + ((y.pauseDays?Number(y.pauseDays):0) * (y.pauseHire?Number(y.pauseHire):0))
				}, 0)
				this.pauseDic.total = total.toFixed(2)
			},
			goTo() {
				uni.navigateTo({
					url: '/contractPages/contract/contract-detail?businessNo=' + this.pauseDic.contractNo
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
		// flex: 1;
		// width: 100%;
		// margin-bottom: 68px;
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

	// .attachment-icon {
	// 	color: $uni-color-primary;
	// 	font-size: 10px;
	// 	margin-left: 10px;
	// }

	.delete-items-icon {
		color: #FF0000;
		font-size: 14px;
		margin-left: 10px;
	}

	.vehicle-list-container {
		padding: 15px;
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
		align-items: center;
		margin-top: 8px;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.item-row tag-select {
		flex: 1;
	}

	.pause-options {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		color: $uni-color-primary;
	}

	.item-row text {
		flex: 1;
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
		background: #FFFFFF;
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
		color: #FFFFFF;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		margin-right: 10px;
	}
	.boldstyle{
		font-size: $uni-font-size-lg;
		font-weight: bold;
	}
</style>
