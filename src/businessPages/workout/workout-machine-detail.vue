<template>
	<view class="">
		<list class="list-style">
			<cell class="cell-style" v-for="(item, index) in datalist" :key="index">
				<view class="cell-left-view">
					<view class="cell-view-part title-style">
						<view class="replace-view">
							<text>自喷码:{{ item.printCode || '-' }}</text>
							<view class="replace-text" v-if="item.replace">【替】</view>
						</view>
					</view>
					<view class="cell-view-part title-style">
						<view>车号：{{item.licenseId||"-"}}</view>
						
					</view>
					<view class="cell-view-part title-style">
						<text>型号:{{item.machineBrand ||"-"}}-{{item.machineTypeName||"-"}}</text>
					</view>
				</view>
				<!-- <view class="cell-right-view" v-if="isshow" @click="gotocheck">
					<text>点检</text>
				</view> -->
			</cell>
		</list>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				datalist: [],
				isshow: false,
				height: ""
			};
		},
		onLoad(options) {
			this.height = options.height;
			this.datalist = JSON.parse(decodeURIComponent(options.machineList));
			this.datalist = this.datalist.map(o => {
				return {
					...o,
					replace: this.height !== o.machineHeight
				}
			})

		},
		methods: {

		}
	};
</script>

<style lang="scss" scoped>
	.choose-bg-view {
		display: flex;
		flex-direction: column;
		flex: 1;
		background: $uni-bg-color-grey;
	}

	.list-style {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.replace-view {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.replace-text {
		color: $uni-color-primary;
		font-size: $uni-font-size-base;
		margin-left: 5px;
	}

	.cell-style {
		display: flex;
		flex-direction: row;
		border-bottom-color: #eeeeee;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		margin-left: 10px;
		margin-right: 10px;
		background: #FFFFFF;
		padding-top: 10px;
		padding-bottom: 10px;
	}

	.cell-left-view {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.cell-right-view {
		display: flex;
		width: 50px;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		font-size: $uni-font-size-base;
		color: $uni-color-primary;
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
