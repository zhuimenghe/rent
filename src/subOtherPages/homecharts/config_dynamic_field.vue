<template>
	<view>
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view style="margin-bottom: 80px;">
			<view v-for="(item, index) in dataList" :key="index">
				<view class="cell-input-view" @click="change(item,index)">
					<mycheckbox :checked="item.isRequest?true:item.checked" class="checkbox" color="#E60000" :disabled="item.isRequest" />
					<text style="margin-left: 10px;">{{ item.label }}</text>
				</view>
			</view>
		</view>
		<view class="bottom-view">
			<view class="bottom-text-view" @click="saveFields"><text>确定</text></view>
		</view>
	</view>
</template>

<script>
	import dynamicFieldsUtil from '@/common/common-method/dynamic-field-util.js'
	export default {
		data() {
			return {
				type: '',
				dataList: [],
				emitType: ''
			}
		},
		onLoad(option) {
			this.type = option.type ? option.type : ''
			this.emitType = option.emitType ? option.emitType : ''
			let list = dynamicFieldsUtil.getFieldsByType(this.type)
			this.dataList = list && list.length > 0 ? list : []
			this.getFields()
		},
		methods: {
			change(item, pos) {
				if (item.isRequest) {
					this.dataList[pos].checked = true
				} else {
					this.dataList[pos].checked = !this.dataList[pos].checked
				}
			},
			getFields() {
				uni.showLoading();
				this.$network
					.getData(this.$url.GET_DYNAMIC_FIELD.replace(/{type}/, this.type), 'GET')
					.then(result => {
						this.dataList = this.dataList.map(o => {
							return {
								...o,
								checked: (!result || !result.fields) ? true : (result.fields.some(x => x == o.value) ? true : false)
							}
						})
						uni.hideLoading()
					})
					.catch(err => {
						uni.hideLoading()
					});
			},

			saveFields() {
				let fields = [];
				this.dataList.map(x => {
					if (x.checked ||x.isRequest) {
						fields.push(x.value)
					}
				})
				let param = {
					fields: fields,
					"key": this.type
				};
				uni.showLoading();
				this.$network
					.getData(this.$url.SAVE_DYNAMIC_FIELD, 'POST', param)
					.then(result => {
						if (this.emitType) {
							uni.$emit(this.emitType)
						}
						uni.navigateBack()
						uni.hideLoading()
					})
					.catch(err => {
						uni.hideLoading()
					});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		width: 100%;
		background: #ffffff;
	}

	.cell-input-view {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		padding: 10px;
		background: #ffffff;
		font-size: $uni-font-size-base;
		border-bottom: 1px solid $uni-bg-color-grey;
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

	.checkbox {
		transform: scale(0.8);
	}

	.lineView {
		flex: 1;
		height: 1px;
		background: #eeeeee;
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
		background: #ffffff;
		z-index: 100;
	}

	.bottom-text-view {
		display: flex;
		flex: 1;
		height: 40px;
		border-radius: 20px;
		background: $uni-color-primary;
		font-size: $uni-font-size-lg;
		color: $uni-bg-color-grey;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		margin-right: 10px;
		margin-left: 10px;
	}
</style>
