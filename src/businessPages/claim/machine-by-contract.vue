<template>
	<view class="content">
		<view class="filter-view">
			<input v-model="searchKey" class="input-style" placeholder="车号或自喷码" />
		</view>
		<view class="item-assigner-list">
			<view v-for="(v,i) in list" :key="i" class="item-container" @click="changeCheck(i)">
				<mycheckbox class="checkbox"  :checked="v.checked" color="#E60000" :disabled="v.disabled" />
				<view class="v-item">
					<view class="item-top">
						<text>车号：{{v.licenseId}}</text>
						<text style="margin-right: 8px;">{{v.stateName}}-{{v.subStateName}}</text>
					</view>
					<view class="item-row">
						<text>品牌：{{v.machineBrand||"--"}}</text>
						<text>自喷码：{{v.printCode||"-"}}</text>
					</view>
				</view>

			</view>

		</view>
		<view class="bottom-view" @click="changeAll">
			<mycheckbox class="checkbox" color="#E60000" :checked="isAllChecked" >全选</mycheckbox>
			<view class="top-right">
				<view class="choosed-view">{{$t('common.choosed')}}：<span>{{chooseAssigners.length}} </span></view>
				<view class="confirm-view" @click="confirm">{{$t('common.confirm')}}</view>
			</view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	var timer;
	export default {
		watch: {
			searchKey(val) {
				if (!val) {
					this.list = [...this.allList];
				} else {
					this.list = []
					this.allList.forEach(o => {
						let is = ((o.licenseId && o.licenseId.indexOf(val.toUpperCase()) !== -1) || (o.printCode && o.printCode.indexOf(
								val.toUpperCase()) !== -1)) ?
							true : false
						if (is) {
							this.list = [...this.list, o]
						}
					})
				}
			}
		},
		data() {
			return {
				list: [],
				disCheckedList: [],
				chooseAssigners: [],
				deltaX: 1,
				isAllChecked: false,
				searchKey: '',
				contractNo: '',
				allList: [],
				contract:null,//从选择合同页面过来时
				isFirst:false//第一步是否是选择合同

			}
		},
		onLoad(options) {
			this.deltaX = options.delta;
			this.disCheckedList = options.choosedList ? JSON.parse(decodeURIComponent(options.choosedList)) : [];
			this.contract = options.contract ? JSON.parse(decodeURIComponent(options.contract)) : null
			this.contractNo = options.contractNo;
			this.isFirst = options.isFirst && options.isFirst == 'true' ? true : false;
			this.getMachineList();
		},
		methods: {
			changeCheck(pos) {
				console.log(this.list,'pos');
				this.list[pos].checked = !this.list[pos].checked;
				this.getCheckedList();
				this.isAllChecked = !this.list.some(o => !o.checked);
				// this.$forceUpdate()
			},
			changeAll(e) {
				this.isAllChecked = !this.isAllChecked;
				if (this.isAllChecked) {
					this.list = this.list.map(o => {
						return {
							...o,
							"checked": this.disCheckedList.some(y => y.licenseId === o.licenseId) ? o.checked : true
						}
					})
					this.getCheckedList();
				} else {
					this.list = this.list.map(o => {
						return {
							...o,
							"checked": this.disCheckedList.some(y => y.licenseId === o.licenseId) ? o.checked : false,
						}
					})
					this.getCheckedList();
				}

			},
			/**
			 * 
			 */
			getMachineList() {
				let param = {
					contractNo: this.contractNo,
					type: 'claim'
				}
				if (this.licenseId) {
					param = {
						...param,
						licenseId: this.licenseId
					}
				}
				if (this.printCode) {
					param = {
						...param,
						printCode: this.printCode
					}
				}
				this.$network
					.getData(this.$url.MACHINE_LIST_BY_CONTRACT, 'GET', param)
					.then(result => {
						this.list = result.map(o => {
							return { ...o,
								checked: false,
								disabled: this.disCheckedList.some(y => y.licenseId === o.licenseId)?true:false
							}
						})
						console.log(this.list)
						this.allList = this.list
					}).catch(err => {});
			},
			getCheckedList() {
				this.allList = this.allList.map(o => {
					return {
						...o,
						// "checked": this.list.some(y => y.licenseId === o.licenseId && y.checked)
						"checked": this.list.some(y => y.licenseId === o.licenseId && y.checked) ? true : false
					}
				})
				console.log(this.allList,'this.allList');

				this.chooseAssigners = [...this.allList.filter(o => {
					return o.checked;
				})];
				
			},
			confirm() {
				//第一次去新建页面
				if (this.isFirst) {
					let params = {
						contract:this.contract,
						machine:this.chooseAssigners,
						type:'claim'
					}
					uni.navigateBack({
						delta:1,
						complete(){
							uni.$emit('choose-contract-machine',params)
						}
					})
				} else {
					uni.$emit("choosedMachines", {
						data: this.chooseAssigners
					})
					uni.navigateBack({
						delta: Number.parseInt(this.deltaX) //此处直接使用变量无效果
					})
				}
				
				
				

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

	.filter-view {
		display: flex;
		flex-direction: row;
		height: 50px;
		line-height: 50px;
		position: fixed;
		align-items: center;
		justify-content: space-between;
		top: 0px;
		left: 0px;
		width: 100%;
		padding-left: 8px;
		background-color: #FFFFFF;
	}

	.input-style {
		background-color: #F7F7F7;
		font-size: $uni-font-size-base;
		border-radius: 4px;
		height: 30px;
		flex: 1;
		line-height: 30px;
		padding: 2px 8px;
	}




	.item-assigner-list {
		margin-top: 56px;
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
		margin-top: 10px;
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
