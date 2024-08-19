<template>
	<view style="width: 100%;" v-if="allDataList&&allDataList.length>0">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view style="width: 100%;" v-for="(info,pos) in allDataList" :key="pos"
			@click="goTo(info,keyTwo)">
			<itemFrame :title="(info.customerName||'')+'-'+(info.projectName||'')"
				v-if="keyTwo=='contractManage'">
				<block>
					<view>
						<view v-html="info.contractNo"></view>
						<view class="line-style">业务：<text v-html="info.customerSalesmanName||'-'"></text>
							|&nbsp;联系人：<text v-html="info.contactName||''"></text>&nbsp;<text v-html="info.phoneNum||''"></text></view>
						<view class="line-style">地址：<text v-html="info.deliveryPlace||'-'"></text></view>
					</view>
				</block>
			</itemFrame>
			<itemFrame v-if="keyTwo=='vehicleArchives'" :title="info.printCode||'-'"
				:subTitle="info.licenseId||''">
				<block>
					<view class="line-style"><text v-html="info.typeName||'-'"></text>&nbsp;|&nbsp;
						<text v-html="info.heightName||'-'"></text>&nbsp;|&nbsp;
						<text v-html="info.driveTypeName||'-'"></text>&nbsp;|&nbsp;
						<text v-html="info.brand||'-'"></text>&nbsp;|&nbsp;
						<text v-html="info.name||'-'"></text>
					</view>
				</block>
			</itemFrame>
			<view v-if="keyOne=='permission'">
				<view v-html="info.name" class="item-content"></view>
			</view>
		</view>
		<view>
			<uni-load-more iconType="auto" :status="moreStatus" />
		</view>

	</view>
</template>

<script>
	import itemFrame from './item-search.vue';
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			itemFrame,
			uniLoadMore
		},
		props: {
			allDataList: {
				type: Array,
				default () {
					return []
				}
			},
			//是否分层级
			isHierarchy: {
				type: Boolean,
				default: true
			},
			moreStatus:{
				type:String,
				default:'loading'
			},
			keyOne:{
				type:String,
				default:''
			},
			keyTwo:{
				type:String,
				default:''
			}
		},
		data() {
			return {
			}
		},
		methods: {
			goMore(item) {
				this.$emit('goMore', {
					id: item.keyOne,
					name: item.name
				})
			},
			goTo(info, type) {
				this.$emit('goTo', {
					data: info,
					processKey: type
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
		text-align: center;
		// width: 100%;
	}
</style>
