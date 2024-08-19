<template>
	<view class="content">
		<view class="item-assigner-list">
			<view class="l-item" v-for="(m,pos) in list" :key="pos" @click="changeCheck(pos)">
				<view class="item-name">
					{{m.label}}
				</view>
				<mycheckbox class="checkbox" :checked="m.checked" color="#E60000" />
			</view>
		</view>
		<view class="bottom-view">
			<view class="choosed-view">{{$t('common.choosed')}}：<span>{{choosedList.length}} </span></view>
			<view class="confirm-view" @click="confirm">{{$t('common.confirm')}}</view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				choosedList: [],
				choosedIdList: []
			}
		},
		onLoad(options) {
			if (options.choosedIdList && options.choosedIdList.length > 0) {
				this.choosedIdList = JSON.parse(decodeURIComponent(options.choosedIdList));
			}
			this.loadconstructionTypes();
		},
		methods: {
			changeCheck(pos) {
				this.list[pos].checked = !this.list[pos].checked;
				this.getCheckedList();
				console.log("changeCheck" + JSON.stringify(this.list[pos]))
			},
			//作业内容construction_type
			loadconstructionTypes() {
				this.$network.loadType('construction_type')
					.then(result => {
						this.list = result.map(o => {
							return {
								...o,
								checked: this.choosedIdList.some(y => y === o.value)
							}
						})
						this.getCheckedList();
					})
					.catch(err => {});
			},
			getCheckedList() {
				this.choosedList = [...this.list.filter(o => {
					return o.checked;
				})];
				console.log(JSON.stringify(this.choosedList))
			},
			confirm() {
				console.log("list==" + JSON.stringify(this.choosedList))
				uni.$emit("choosedConstruction", {
					data: this.choosedList
				})
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		background: $uni-bg-color-grey;
		position: relative;
	}

	.item-assigner-list {
		margin-bottom: 56px;
	}

	.l-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 45px;
		background-color: #FFFFFF;
		border-color: $uni-bg-color-grey;
		border-style: solid;
		border-width: 0px 0px 1px 0px;
		align-items: center;
	}

	.item-name {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		margin-left: 16px;
	}

	.checkbox {
		transform: scale(0.7);
		margin-right: 10px;
	}

	.bottom-view {
		position: fixed;
		display: flex;
		left: 0px;
		right: 0px;
		bottom: 0px;
		height: 48px;
		justify-content: flex-end;
		flex-direction: row;
		align-items: center;
		background: #FFFFFF;
		z-index: 100;
		box-shadow: 1px 0px 1px $uni-text-color-gray;
	}

	.choosed-view {
		margin-left: 16px;
		margin-right: 16px;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.choosed-view span {
		color: $uni-color-primary;
		font-size: $uni-font-size-lg;
		margin-left: 4px;
	}

	.confirm-view {
		margin-right: 16px;
		font-size: $uni-font-size-base;
		color: #FFFFFF;
		background-color: $uni-color-primary;
		padding: 5px 10px;
		border-radius: 4px;
	}
</style>
