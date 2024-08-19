<template>
	<view v-if="allDataList&&allDataList.length>0">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view v-for="(item,index) in allDataList" :key="index">
			<view class="item-tag">
				{{item.name}}
			</view>
			<view v-if="item.keyTwoReturnInfos
			    &&item.keyTwoReturnInfos.length>0
			    &&item.keyTwoReturnInfos[0].hits
				&&item.keyTwoReturnInfos[0].hits.length>0"
				style="width: 100%;">
				<view style="width: 100%;" v-for="(info,pos) in item.keyTwoReturnInfos[0].hits" :key="pos" @click="goTo(info,item.keyTwoReturnInfos[0].keyTwo)">
					<itemFrame :title="(info.customerName||'')+'-'+(info.projectName||'')"
						v-if="item.keyTwoReturnInfos[0].keyTwo=='contractManage'">
						<block>
							<view>
								<view v-html="info.contractNo"></view>
								<view class="line-style">业务：<text v-html="info.customerSalesmanName||''"></text>
									| 联系人：<text v-html="info.contatcName||''"></text>&nbsp;<text v-html="info.phoneNum||''"></text></view>
								<view class="line-style">地址：<text v-html="info.deliveryPlace||''"></text></view>
							</view>
						</block>
					</itemFrame>
					<itemFrame v-if="item.keyTwoReturnInfos[0].keyTwo=='vehicleArchives'" :title="info.printCode||'-'"
						:subTitle="info.licenseId||''">
						<block>
							<view class="line-style"><text v-html="info.typeName||''"></text>&nbsp;|&nbsp;
								<text v-html="info.heightName||''"></text>&nbsp;|&nbsp;
								<text v-html="info.driveTypeName||''"></text>&nbsp;|&nbsp;
								<text v-html="info.brand||''"></text>&nbsp;|&nbsp;
								<text v-html="info.name||''"></text>
							</view>
						</block>
					</itemFrame>
					<view v-if="item.key=='permission'">
						<view v-html="info.name" class="item-content"></view>
					</view>
				</view>
				
				<view class="more-style" @click="goMore(item)">
					更多
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	import itemFrame from './item-search.vue';
	export default {
		components: {
			itemFrame
		},
		props: {
			allDataList: {
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {}
		},
		methods: {
			goMore(item) {
				this.$emit('goMore', {
					id:item.key,
					name:item.name
				})
			},
			goTo(info,type){
				this.$emit('goTo', {
					data:info,
					processKey:type
				})
			}
		},

	}
</script>

<style lang="scss" scoped>
	.item-tag {
		font-size: 16px;
		color: #333333;
		padding: 10px;
		font-weight: bold;
	}

	.item-content {
		padding: 8px;
		font-size: 14px;
		color: #333333;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-bottom: 1px solid $uni-line-color;
	}

	.line-style {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		max-width: 75%;
	}

	.more-style {
		color: $uni-color-primary;
		font-size: 14px;
		line-height: 16px;
		padding: 8px;
		text-align: center;
		background-color: #FFFFFF;
	}
</style>
