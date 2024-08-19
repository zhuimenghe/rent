<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-container">
			<unionDeviceQueryView
			:isExportList='false' 
			:isQueryContract="false"
			:isQuerySalesman='false'
			:isQueryOrg='false'
			:isQueryBrand='false'
			:isQueryModel='false'
			:isQueryTime='false'
			hint='品牌/型号'
			@reset='reset' 
			@query="query"  />
		</view>
		<view class="item-assigner-list">
			<view v-for="(v,i) in list" :key="i" class="item-container" @click="changeCheck(i)">
				<mycheckbox class="checkbox" :checked="v.checked" color="#E60000"  />
				<view class="v-item">
					<view class="item-row">
						<text>设备类别：{{v.deviceTypeName||"-"}}</text>
						<text>设备类型：{{v.typeName||"-"}}</text>
					</view>
					<view class="item-row">
						<text>高度：{{v.heightName||"-"}}</text>
						<text>型号：{{v.name||"-"}}</text>
					</view>
					<view class="item-row">
						<text>品牌：{{v.brand||"-"}}</text>
						
					</view>
				</view>

			</view>

		</view>
		<view class="bottom-view" @click="changeAll">
			<mycheckbox class="checkbox" color="#E60000" :checked="isAllChecked" >全选</mycheckbox>
			<view class="top-right">
				<view class="choosed-view">{{$t('common.choosed')}}：<span>{{disCheckedList.length}} </span></view>
				<view class="confirm-view" @click="confirm">{{$t('common.confirm')}}</view>

			</view>
		</view>
	</view>
</template>

<script>
	import timeCompare from '@/common/common-method/common-method.js';
	import unionDeviceQueryView from '@/components/common/common-ui/union-device-query-view.vue';
	export default {
		components:{
			unionDeviceQueryView
		},
		data() {
			return {
				list: [],
				disCheckedList: [],
				isAllChecked: false,
				type:'',
				height:'',
				fuzzyParam:'',
				deviceType:'',
				tonnage:''
			}
		},
		onLoad(options) {
			if (options.choosedList && options.choosedList.length > 0) {
				this.disCheckedList = JSON.parse(decodeURIComponent(options.choosedList));
			}
			this.getMachineList();
		},
		methods: {
			reset() {
				this.type=''
				this.height=''
				this.fuzzyParam=''
				this.deviceType=''
				this.tonnage=''
				this.getMachineList();
			},
			query(val) {
				this.fuzzyParam = val.fuzzyParam;
				this.deviceType=val.sortObj && val.sortObj.value ? val.sortObj.value : '';
				this.tonnage=val.tonnageObj && val.tonnageObj.value ? val.tonnageObj.value : '';
				this.type = val.typeObj && val.typeObj.value ? val.typeObj.value : '';
				this.height = val.heightObj && val.heightObj.value ? val.heightObj.value : '';
				this.getMachineList();
			},
			getDate(time) {
				if (!time) return '';
				return time.split(/\s+/)[0];
			},
			changeCheck(pos) {
				this.list[pos].checked = !this.list[pos].checked;
				this.getCheckedList();
				this.isAllChecked = !this.list.some(o => !o.checked)
			},
			changeAll(e) {
				this.isAllChecked = !this.isAllChecked;
				this.list = this.list.map(o => {
					return {
						...o,
						"checked": this.isAllChecked
					}
				})
				this.getCheckedList();

			},
			/**
			 * 可选择的列表
			 */
			getMachineList() {
				uni.showLoading();
				let param = {
					"current": 1,
					"size": 1000,
					keyWord: this.fuzzyParam?this.fuzzyParam:undefined,
					type: this.type?this.type:undefined,
					height: this.height?this.height:undefined,
					deviceType:this.deviceType?this.deviceType:undefined,
					tonnage:this.tonnage?this.tonnage:undefined,
				}
				this.$network
					.getData(this.$url.PURCHASE_MACHINE_LIST, 'POST', param)
					.then(result => {
						this.list = result.records && result.records.length > 0 ? result.records.map(o => {
							return { ...o,
								checked: this.disCheckedList && this.disCheckedList.some(y => y.machineType === o.id),
							}
						}) : []
						this.isAllChecked = !this.list.some(o => !o.checked)
						uni.hideLoading()
					})
					.catch(err => {
						uni.hideLoading()
					});
			},
			getCheckedList() {
				this.disCheckedList = [...this.list.filter(o => {
					return o.checked;
				})];
			},
			confirm() {
				let self = this;
				uni.$emit("choosedMachines", {
					data: this.disCheckedList
				})
				uni.navigateBack({
					delta: 1 //此处直接使用变量无效果
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
    //顶部时间
	.top-container {
		z-index: 100;
		position: fixed;
		display: flex;
		flex-direction: column;
		width: 100%;
		top: 0;
		left: 0px;
		margin-bottom: 1px;
		background: #ffffff;
	}


	.item-assigner-list {
		margin-top: 64px;
		margin-bottom: 56px;
	}

	.item-container {
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
		width: 100%;
		margin-bottom: 8px;
		border-radius: 4px;
	}

	.v-item {
		flex: 1;
	}

	.checkbox {
		transform: scale(0.7);
		margin-right: 10px;
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
		height: 45px;
		line-height: 45px;
	}

	.item-row {
		display: flex;
		flex-direction: row;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		height: 45px;
		line-height: 45px;
	}

	.item-row text {
		flex: 1;
	}

	.top-right {
		display: flex;
		flex-direction: row;
		align-items: center;
		text-align: center;
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

	.bottom-view {
		position: fixed;
		display: flex;
		left: 0px;
		right: 0px;
		bottom: 0px;
		height: 48px;
		justify-content: space-between;
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
