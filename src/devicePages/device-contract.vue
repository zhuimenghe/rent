<template>
	<view class="choose-bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<list class="list-style">
			<cell class="cell-style" v-for="(item, index) in datalist" :key="index">
				<view @click="backToPre(item)">
					<view class="cell-view-part title-style">
						<text>{{ item.customerName || '' }}-{{ item.projectName ? item.projectName : '' }}</text>
					</view>
					<view class="cell-view-part subtitle-style">
						<text>{{ '业务负责人:' + item.customerSalesmanName }}</text>
					</view>
					<view class="cell-view-part subtitle-style">
						<text>{{ '合同单号:' + item.businessNo }}</text>
					</view>
				</view>
			</cell>
		</list>
		<view class="data-empty" v-if="datalist.length == 0">{{"暂无数据"}}</view>
	</view>
</template>
<script>
export default {
	components: {},
	data() {
		return {
			datalist: [],
		};
	},
	onLoad(options) {
		let title = options.title || '选择合同';
		uni.setNavigationBarTitle({
			title: title
		});
		let beginDate = options.beginDate;
		let endDate = options.endDate;
		let licenseId = options.licenseId;
		console.log(licenseId);
		uni.showLoading();
		this.getdata(beginDate,endDate,licenseId);
	},
	onUnload() {},
	methods: {
		getdata(beginDate,endDate,licenseId) {
			let param = {
				"beginDate":beginDate,
				"endDate":endDate,
				"licenseId":licenseId
			};
			this.$network.getData(this.$url.DEVICE_CONTRACT_LIST, 'POST', param).then(result => {
				let list = result ? result : [];
				this.datalist = this.datalist.concat(list);
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		},
		backToPre(item){
			uni.$emit("choose-contract-device", {
				data: item
			})
			uni.navigateBack({
				animationDuration:200
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.choose-bg-view {
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100%;
	background: $uni-bg-color-grey;
}
.data-empty{
	margin-top: calc(50% - 5px);
	align-self: center;
	font-size: 15px;
	color: #999999;
}
.list-style {
	display: flex;
	width: 100%;
	flex-direction: column;
}

.cell-style {
	display: flex;
	flex-direction: column;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
	border-bottom-width: 1px;
	padding: 10px;
	background: #ffffff;
}

.cell-view-part {
	display: flex;
	flex: 1;
	background: #ffffff;
	margin-left: 10px;
	justify-content: flex-start;
	margin: 5px;
}

.title-style {
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}

.subtitle-style {
	font-size: $uni-font-size-base;
	color: $uni-text-color-gray;
}
</style>
