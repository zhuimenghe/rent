<template>
	<view class="content">
		<view class="cell-input-view">
			<view class="cell-input-view-left">
				<text style="padding: 5px; 0px">{{ dataDic.typeName }}</text>
			</view>
		</view>
		<view class="cell-input-view" style="padding-left: 0px;">
			<select-label-item
			style="display: flex;flex: 1;"
			tagName="设备高度" 
			hint="请选择设备高度" 
			:value="heightDic.label" 
			:icon="righticon"
			@clickItemLabel="chooseHeight" 
			/>
		</view>

		<view class="cell-input-view" style="margin-bottom: 0px;margin-top: 10px;border-bottom-color: #EEEEEE;border-bottom-style: solid;border-bottom-width: 1px;">
			<view class="cell-input-view-left"><text style="padding: 5px; 0px">车号/自喷码</text></view>
		</view>
		<view style="display: flex;background: #FFFFFF;width: 100%;padding:5px 10px;border-bottom-color: #EEEEEE;border-bottom-style: solid;border-bottom-width: 1px;">
			<input style="flex: 1;margin-left: 0px;margin-right: 15px;font-size: 15px;margin-top: 10px;margin-bottom: 5px;"
			 placeholder="车号/自喷码" v-model="printCode" />
		</view>

		<view class="cell-input-view" style="margin-bottom: 0px;margin-top: 10px;">
			<view class="cell-input-view-left"><text>型号</text></view>
		</view>
		<view class="check-view">
			<view class="item-machine-list">
				<view class="l-item" v-for="(m, pos) in typelist" :key="pos" @click="changeMachineItem(m,pos)">
					<mycheckbox :checked="m.checked" color="#E60000" :value="pos">
						<view>{{ m.brand }}-{{ m.name }}</view>
					</mycheckbox>
				</view>
			</view>
		</view>

		<view style="width: 100%;height: 80px;" />
		<view class="bottom-view">
			<view class="bottom-left-view" @click="clickecancle"><text>重置</text></view>
			<view class="bottom-right-view" @click="clicksave"><text>筛选</text></view>
		</view>

		<w-picker style="z-index: 980;" :selectList="heightList" @confirm="dialog" mode="selector" ref="selector" themeColor="#E60000" />
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	export default {
		components: {
			selectLabelItem,
			wPicker
		},
		data() {
			return {
				righticon: 'iconarrow-right',
				dataDic: {},
				heightDic: {},
				heightList: [],
				typelist: [],
				printCode: ""
			};
		},
		onLoad(option) {
			this.dataDic = JSON.parse(decodeURIComponent(option.item));
			console.log(JSON.stringify(this.dataDic));
			if (option.isedit === 'true') {
				this.heightDic = JSON.parse(decodeURIComponent(option.height));
				this.typelist = JSON.parse(decodeURIComponent(option.type));
				this.printCode = decodeURIComponent(option.printCode);
			} else {
				this.heightDic = {
					label: this.dataDic.heightName,
					value: this.dataDic.height
				};
				this.getTypeList(this.dataDic.type, this.dataDic.height);
				this.printCode = option.printCode ? decodeURIComponent(option.printCode) : "";
			}
			this.getTypeHeight(this.dataDic.type);
		},
		methods: {
			//弹窗回调
			dialog(val) {
				this.heightDic = val.checkArr;
			},
			clickecancle() {
				this.heightDic = {
					label: this.dataDic.heightName,
					value: this.dataDic.height
				};
				this.typelist = this.typelist.map(o => {
					return {
						...o,
						checked: false
					};
				});
				this.printCode = "";
				// this.typelist = JSON.parse(JSON.stringify(list));
			},
			clicksave() {
				uni.$emit('filter-car-list', {
					height: this.heightDic,
					typelist: this.typelist,
					printCode: this.printCode
				});
				uni.navigateBack({
					delta: 1
				});
			},
			chooseHeight() {
				if (this.heightList.length > 0) {
					this.$refs.selector.show();
				} else {
					uni.showToast({
						icon: 'none',
						title: '已无可选高度'
					})
				}

			},
			getTypeHeight(type) {
				this.$network
					.loadDic('machine_height')
					.then(result => {
						let list  = result.records.sort((a,b)=>{
							return parseInt(a.value) > parseInt(b.value) ? 1 : -1
						})
						console.log(JSON.stringify(list))
						this.heightList = list.filter(o => {
							return Number(o.value) >= Number(this.dataDic.height);
						});
					})
					.catch(err => {});
			},
			getTypeList(type, height) {
				let url = this.$url.BrandList_WORKIN;
				this.$network
					.getData(url, 'GET', null)
					.then(result => {
						this.typelist = result.map(o => {
							return {
								name: o.name,
								id: o.id,
								brand:o.brand,
								checked: (this.dataDic.machineType && this.dataDic.machineType.some(x => x === o.id)) ? true : false
							};
						});
					})
					.catch(err => {});
			},
			changeMachineItem(item,index) {
				this.typelist.splice(index,1,{
					...item,
					checked: !item.checked
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.cell-input-view {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		padding: 5px 10px;
		background: #ffffff;
		font-size: $uni-font-size-base;
		margin-bottom: 10px;
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

	.check-view {
		display: flex;
		width: 100%;
		margin-top: 1px;
		background: #FFFFFF;
	}

	.item-machine-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 8px;
	}

	.l-item {
		display: flex;
		flex-direction: row;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		margin-right: 16px;
		margin-bottom: 10px;
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
		font-size: $uni-font-size-lg;
		color: #222222;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		margin-right: 10px;
	}
</style>
