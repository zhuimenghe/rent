<template>
	<view class="choose-bg-view">
		<view class="list-style">
			<view class="celltop-top">
				<view class="cell-left-view">
					<view class="cell-view-part title-style">
						<text>点检状态:</text>
						<text :style="{ color: isall() ? '#E60000' : '#ff0000' }">{{ isall() ? '正常' : '异常' }}</text>
					</view>
				</view>
				<view class="cell-right-view subtitle-style">
					<text @click="gotocheck" v-if="isclick">一键点检</text>
				</view>
			</view>
			<view class="celltop" v-for="(item, index) in datalist.workCheckResults" :key="index">
				<view class="cellview" @click="changeAllCheckBox(index)">
					<view class="cell-left-view  title-style">
						<text>点检内容:{{ item.content || '' }}</text>
					</view>
					<view class="cell-right-view">
						<mycheckbox :checked="item.checked" class="checkbox" color="#E60000"
						 :disabled="!isclick" />
					</view>
				</view>
				<text-label-item
				:inputDisabled="!isclick"
				tagName="备注" 
				placeholder="请输入备注..." 
				@ipnuttext="checkremark($event,index)" 
				:isRequired="false" 
				:inputValue="item.remark" 
				/>
			</view>
		</view>
		<view style="width: 100%; height: 80px;" />
		<view class="bottom-view" v-if="isclick">
			<view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
			<view class="bottom-right-view" @click="clicksave"><text>确定</text></view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
	export default {
		components: {
			textLabelItem
		},
		data() {
			return {
				datalist: {},
				isclick: true,
				itemIndex:"0",
				mitemIndex:"0"
			};
		},
		onLoad(options) {
			if (options.iscleck === 'false') {
				this.isclick = false;
			}
			if(options.index){
				this.itemIndex = options.index
			}
			if(options.mindex){
				this.mitemIndex = options.mindex
			}
			this.datalist = options.machine ? JSON.parse(decodeURIComponent(options.machine)) : {};
			console.log(JSON.stringify(this.datalist))
		},
		methods: {
			checkremark(e, index){
				let list = [...this.datalist.workCheckResults];
				let item = {
					...list[index],
					remark : e,
				};
				list.splice(index,1,item)
				this.datalist = {
					...this.datalist,
					workCheckResults:[...list]
				}
			},
			isall() {
				if (!this.datalist.workCheckResults)
					return false;
				return !this.datalist.workCheckResults.some(o => !o.checked);
			},
			gotocheck() {
				this.datalist.workCheckResults = this.datalist.workCheckResults ? this.datalist.workCheckResults.map(o => {
					return {
						...o,
						checked: true
					}
				}) : [];
			},
			//可选
			changeAllCheckBox(index) {
				if (this.isclick == false) {
					return;
				}
				this.datalist.workCheckResults[index].checked = !this.datalist.workCheckResults[index].checked;
				this.datalist = {
					...this.datalist,
					workCheckResults: this.datalist.workCheckResults
				}
			},
			clickecancle() {
				uni.showModal({
					title: '提示',
					content: '取消退出将不会保存点检项',
					success: res => {
						if (res.confirm) {
							uni.navigateBack({
								delta: 1
							});
						}
					}

				});
			},
			//确定按钮
			clicksave() {
				uni.$emit('choose-check-emit', {
					data: this.datalist,
					index:this.itemIndex,
					mindex:this.mitemIndex
				});
				uni.navigateBack({
					animationDuration: 200
				});
			}
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

	.cell-input-view {
		display: flex;
		flex-direction: row;
		flex: 1;
		align-items: center;
		justify-content: flex-start;
		margin-left: 15px;
		margin-right: 15px;
		height: 45px;
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

	.cell-style {
		display: flex;
		flex-direction: column;
		border-bottom-color: #eeeeee;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		margin-left: 10px;
		margin-right: 10px;
		background: #ffffff;
		padding-top: 10px;
		padding-bottom: 10px;
	}

	.celltop-top {
		display: flex;
		flex-direction: row;
		border-bottom-color: #eeeeee;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		background: #ffffff;
		padding-top: 10px;
		padding-left: 10px;
		padding-bottom: 10px;
	}
	.celltop {
		display: flex;
		flex-direction: column;
		border-bottom-color: #eeeeee;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		background: #ffffff;
		padding-top: 10px;
		padding-left: 10px;
		padding-bottom: 10px;
	}
	.cellview{
		display: flex;
		flex-direction: row;
		background: #ffffff;
	}

	.cell-left-view {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.cell-right-view {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
	}

	.cell-view-part {
		display: flex;
		flex-direction: row;
		align-items: center;
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
		color: $uni-color-primary;
	}

	.checkbox {
		transform: scale(0.8);
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
		color: #ffffff;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		margin-right: 10px;
	}

	.item-customdetail {
		align-items: center;
		justify-content: flex-end;
		margin-left: 20px;
	}

	#translate-arrow {
		font-size: 16px;
		margin-right: 16px;
		transform: rotate(-90deg);
		transition: all 1s;
	}

	#translate-arrow-expend {
		font-size: 16px;
		margin-right: 16px;
		transform: rotate(90deg);
		transition: all 1s;
	}
</style>
