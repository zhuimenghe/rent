<template>
	<view class="machine-cell">
		<view class="left">
			<view class="header">
				<text style="font-weight: 500; font-size: 14px;">{{machine.printCode || '-'}}</text>
				<text style="margin-left: 10px; font-size: 12px; color: #999999;">{{machine.licenseId}}</text>
			</view>
			<view class="text-cell">

				<text>{{machine.typeName || '-'}}</text>
				<text class="vertical">|</text>

				<text>{{machine.machineHeightName || '-'}}</text>
				<text class="vertical">|</text>

				<text>{{machine.machineBrand || '-'}}</text>
				<text class="vertical">|</text>

				<text>{{machine.machineTypeName || '-'}}</text>
				<text class="vertical">|</text>

				<text>{{machine.driveTypeName || '-'}}</text>

			</view>
		</view>

		<view class="right">
			<text class="check" :class="ischeckOK(machine.workCheckResults) ? 'checkbtnOK' : 'checkbtnError'"
				@click="gotoCheck()">点检</text>

			<view class="delete-btn" @click="delteMachine()" v-if="isEdit">
				<i class="iconfont iconguanbi" style="font-size: 10px; color: #FFFFFF;"></i>
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'machine-cell',
		data() {
			return {}
		},
		props: {
			machine: {
				type: Object,
				default () {
					return {}
				}
			},
			isEdit: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			//点检
			gotoCheck() {
				this.$emit('updateCheckResult', this.machine.licenseId)
				uni.navigateTo({
					url: `/businessPages/workin/check-car-list?item=${encodeURIComponent(JSON.stringify(this.machine.workCheckResults))}${!this.isEdit?'&iscleck=false':''}`
				});

			},
			ischeckOK(checkalllist) {
				if (!checkalllist) {
					return false;
				}
				let list = checkalllist.filter((o) => {
					return o.checked === false
				})
				if (list.length > 0) {
					return false;
				}
				return true;
			},
			delteMachine() {
				this.$emit("delteMachine", this.machine)
			}

		}
	}
</script>

<style lang="scss" scoped>
	.machine-cell {
		position: relative;
		display: flex;
		align-items: center;
		margin: 8px;
		padding-bottom: 12px;

		.left {
			width: calc(100% - 100px);

			.header {
				display: flex;
				align-items: flex-end;
			}
		}

		.right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			width: 100px;
		}

		.vertical {
			margin: 0 4px;
			font-weight: 600;
		}


		.check {
			border-width: 1px;
			border-radius: 3px;
			border-style: solid;
			padding: 0 8px;
			height: 20px;
			line-height: 20px;
			font-size: 12px;
		}

		.checkbtnOK {
			background: #FFFFFF;
			color: #4EC365;
			border-color: #4EC365;

		}

		.checkbtnError {
			background: #FFFFFF;
			color: #FF0000;
			border-color: #FF0000;

		}

		.delete-btn {
			margin-left: 10px;
			background: #000000;
			width: 20px;
			height: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 10px;
		}

		.text-cell {
			font-size: 12px;
			color: #999999;
			line-height: 16px;
		}
	}

	.machine-cell::after {
		position: absolute;
		z-index: 3;
		right: -8px;
		bottom: 0;
		left: 1px;
		height: 1px;
		content: "";
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
</style>
