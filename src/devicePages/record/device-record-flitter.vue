<template>
	<view class="contentbg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view>
			<!-- <view class="item-container">
				<view class="item-key">车号/自喷码/品牌</view>
				<view class="radio-container"  style="margin-bottom: 5px;margin-right: 10px;">
					<input 
					style="border-bottom-style: solid;border-bottom-width: 1px;border-bottom-color: #EEEEEE;height: 40px;"
					v-model="printcode"
					placeholder="请输入车号/自喷码/品牌"
					/>
				</view>
			</view> -->
			<view class="item-container">
				<view class="item-key">型号</view>
				<view class="check-view">
					<label class="l-item" v-for="(item,index) in typeState" :key="index" @click="changeMachineItem(item,index)" :style="{'border-color' : item.checked ? '#E60000' : '#EEEEEE'}">
						<view>{{item.brand}}-{{ item.text }}</view>
					</label>
				</view>
			</view>
			<view class="item-container">
				<view class="item-key">租赁状态</view>
				<view class="radio-container">
					<selector ref="rentalradio" @change="rentalonChange" column="2" :list="rentalState" :defaultIndex="rentalIndex.id" type="radio" />
				</view>
			</view>
			<view class="item-container">
				<view class="item-key">区域</view>
				<view class="radio-container">
					<selector ref="eararadio" @change="earaChange" :list="earaState" :defaultIndex="earaIndex.id" type="radio" />
				</view>
			</view>
			<view style="width: 100%;height: 60px;" />
		</view>
		<view class="bottom-view">
			<view class="delete-view bottom-common-style" @click="deleteAll">清除</view>
			<view class="ok-view bottom-common-style" @click="goback">确定</view>
		</view>
	</view>
</template>

<script>
	import selector from '@/components/common/selector/selector.vue';
	export default {
		components: {
			selector
		},
		data() {
			return {
				typeState: [],

				rentalIndex: {
					id: -1,
				},
				rentalState: [],

				earaIndex: {
					id: -1,
				},
				earaState: [],

				// printcode:""
				deviceType: ''
			};
		},
		onLoad(option) {
			this.deviceType = option.deviceType === '-1' ? "" : option.deviceType
			if (option.item) {
				let dict = JSON.parse(decodeURIComponent(option.item));
				if (dict.typeIndex) {
					this.typeState = dict.typeIndex;
				} else {
					this.loadtype();
				}
				if (dict.rentalIndex) {
					this.rentalIndex = dict.rentalIndex;
				}
				if (dict.earaIndex) {
					this.earaIndex = dict.earaIndex;
				}
				// if(dict.printcode){
				// 	this.printcode =  dict.printcode;
				// }
				this.loadeara();
				this.loadrental();
			} else {
				this.loadeara();
				this.loadrental();
				this.loadtype();
			}

		},
		methods: {
			loadeara() {
				uni.showLoading();
				let urlstr = this.$url.ORG_LIST;
				this.$network
					.getData(urlstr, 'GET', null)
					.then(result => {
						let list = result;
						let newlist = this.getChildren(list);
						this.earaState = this.resetId(newlist);
						if(this.earaIndex&&this.earaIndex.value&&!this.earaIndex.id){
							this.earaIndex = this.earaState.find(o=>o.value==this.earaIndex.value)
						}
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			getChildren(data) {
				let arr = [];
				if (data) {
					data.forEach((o, index) => {
						let a = {
							text: o.name,
							dictid: o.name,
							value: o.id,
							children:o.children
						};
						arr = [...arr, a];
						if (o.children && o.children.length > 0) {
							arr = [...arr, ...this.getChildren(o.children)];
						}
					});
				}
				return arr;
			},
			resetId(list) {
				let newlist = [];
				list.forEach((o, index) => {
					let a = {
						...o,
						id: index,
					};
					newlist.push(a)
				});
				return newlist
			},
			// loadeara(){
			// 	uni.showLoading();
			// 	let urlstr = this.$url.USER_ORG_SINGLE;
			// 	this.$network
			// 		.getData(urlstr, 'GET', null)
			// 		.then(result => {
			// 			this.earaState = result.map((o, index) => {
			// 				return {
			// 					id: index,
			// 					text: o.name,
			// 					dictid: o.name,
			// 					value: o.id
			// 				};
			// 			});
			// 			uni.hideLoading();
			// 		})
			// 		.catch(err => {
			// 			uni.hideLoading();
			// 		});
			// },
			loadrental() {
				uni.showLoading();
				this.$network
					.loadUserType('rental_status')
					.then(result => {
						this.rentalState = result.map((o, index) => {
							return {
								id: index,
								text: o.label,
								dictid: o.value,
								value: o.value,
							};
						});
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			loadtype() {
				uni.showLoading();
				let param = {
					deviceType:this.deviceType
				}
				this.$network
					.getData(this.$url.MACHINE_RECORD_TYPE, 'GET', param)
					.then(result => {
						this.typeState = result.map((o, index) => {
							return {
								id: index,
								text: o.name,
								dictid: o.name,
								value: o.id,
								brand:o.brand,
								checked: false
							};
						});
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			changeMachineItem(item, index) {
				this.typeState[index].checked = !this.typeState[index].checked;
				console.log(JSON.stringify(this.typeState))
			},
			rentalonChange(e) {
				this.rentalIndex = e
			},
			earaChange(e) {
				this.earaIndex = e;
			},
			deleteAll() {
				this.loadtype();
				this.rentalIndex = {
					id: -1
				};
				this.earaIndex = {
					id: -1
				};
				// this.printcode =  ""
			},
			goback() {
				uni.$emit('filtrate-record', {
					rentalIndex: this.rentalIndex,
					earaIndex: this.earaIndex,
					typeIndex: this.typeState,
					// printcode: this.printcode
				});
				uni.navigateBack({
					animationDuration: 50
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.contentbg {
		position: relative;
		height: 100%;
		width: 100%;
		background: #ffffff;
	}

	.item-container {
		margin-left: 10px;
		margin-right: 10px;
		flex: 1;
		background: #ffffff;
	}

	.item-container {
		display: flex;
		flex: 1;
		flex-direction: column;
		margin-left: 10px;
		margin-right: 10px;
		background: #ffffff;
	}

	.item-key {
		margin-left: 10px;
		color: $uni-text-color;
		padding-top: 5px;
		font-size: $uni-font-size-lg;
		font-weight: bold;
	}

	.radio-container {
		padding-bottom: 5px;
		margin-left: 10px;
		padding-top: 5px;
		color: $uni-text-color;
		font-size: $uni-font-size-base
	}

	.bottom-view {
		position: fixed;
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 55px;
		bottom: 0px;
		background: #ffffff;
		align-items: center;
		justify-content: space-between;
		box-shadow: 80px 80px 0 0 #999999;
		border-top: $uni-bg-color-grey;
		border-width: 1px;
		border-top-style: solid;
	}

	.delete-view {
		width: 80px;
		background: $uni-bg-color-grey;
		color: #999999;
	}

	.ok-view {
		margin-right: 20px;
		flex: 1;
		background: $uni-color-primary;
		color: #ffffff;
	}

	.bottom-common-style {
		margin-left: 20px;
		height: 45px;
		text-align: center;
		line-height: 45px;
		border-radius: 5px;
		font-size: $uni-font-size-base;
	}

	.check-view {
		display: flex;
		width: 100%;
		margin-top: 1px;
		background: #ffffff;
		flex-direction: row;
		flex-wrap: wrap;
		padding: 8px;
	}

	.l-item {
		display: flex;
		flex-direction: row;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		margin-right: 10px;
		margin-bottom: 10px;
		border-width: 1px;
		border-style: solid;
		border-color: #EEEEEE;
		height: 40px;
		justify-content: center;
		align-items: center;
		padding-left: 10px;
		padding-right: 10px;
		border-radius: 5px;
	}
</style>
