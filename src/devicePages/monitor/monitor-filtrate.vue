<template>
	<view class="contentbg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view>
			<!-- <view class="item-container">
				<view class="item-key">车号/自喷码/品牌</view>
				<view class="radio-container"  style="margin-right: 10px;">
					<input 
					style="border-bottom-style: solid;border-bottom-width: 1px;border-bottom-color: #EEEEEE;height: 40px;"
					v-model="printcode"
					placeholder="请输入车号/自喷码/品牌"
					/>
				</view>
			</view> -->
			<view class="item-container">
				<view class="item-key">租赁状态</view>
				<view class="radio-container">
					<selector ref="rentalradio" 
					@change="rentalonChange" 
					:list="rentalState" 
					:defaultIndex="rentalIndex.id" 
					type="radio" />
				</view>
			</view>
			<view class="item-container">
				<view class="item-key">故障状态</view>
				<view class="radio-container">
					<selector ref="breakdownradio" 
					@change="breakdownonChange" 
					:list="breakdownState" 
					:defaultIndex="breakdownIndex.id" 
					type="radio" />
				</view>
			</view>
			<!-- <view class="item-container">
				<view class="item-key">预警状态</view>
				<view class="radio-container">
					<selector ref="warningradio" 
					@change="warningonChange" 
					:list="warningState" 
					:defaultIndex="warningIndex.id" 
					type="radio" />
				</view>
			</view> -->
			<view class="item-container">
				<view class="item-key">离线状态</view>
				<view class="radio-container"><selector ref="outlineradio" @change="outlineonChange" :list="outlineState" :defaultIndex="outlineIndex.id" type="radio" /></view>
			</view>
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
			// printcode:'',
			rentalIndex: {
				id: -1,
			},
			rentalState: [],
			breakdownIndex: {
				id: -1,
			},
			breakdownState: [
				{
					id: 0,
					text: '无故障',
					dictid: false,
					value: false
				},
				{
					id: 1,
					text: '有故障',
					dictid: true,
					value: true
				}
			],
			warningIndex: {
				id: -1,
			},
			warningState: [],
			outlineIndex: {
				id: -1,
			},
			outlineState: [
				{
					id: 0,
					text: '在线',
					dictid: false,
					value: false
				},
				{
					id: 1,
					text: '离线',
					dictid: true,
					value: true
				}
			]
		};
	},
	onLoad(option) {
		if(option.item){
			let dict = JSON.parse(decodeURIComponent(option.item));
			// if(dict.printCode){
			// 	this.printcode = dict.printCode;
			// }
			if(dict.rentalIndex){
				this.rentalIndex = dict.rentalIndex;
				this.breakdownIndex =  dict.breakdownIndex;
				this.warningIndex =  dict.warningIndex;
				this.outlineIndex =  dict.outlineIndex;
			}
			if(dict.breakdownIndex){
				this.breakdownIndex =  dict.breakdownIndex;
			}
			if(dict.warningIndex){
				this.warningIndex =  dict.warningIndex;
			}
			if(dict.outlineIndex){
				this.outlineIndex =  dict.outlineIndex;
			}
		}
		this.loadrental();
		this.loadwarning();
	},
	methods: {
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
							value: o.value
						};
					});
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		loadwarning() {
			uni.showLoading();
			this.$network
				.loadUserType('monitor_early_warning')
				.then(result => {
					this.warningState = result.map((o, index) => {
						return {
							id: index,
							text: o.label,
							dictid: o.id,
							value: o.value
						};
					});
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		rentalonChange(e) {
			this.rentalIndex =e
		},
		breakdownonChange(e) {
			this.breakdownIndex = e;
		},
		warningonChange(e) {
			this.warningIndex = e;
		},
		outlineonChange(e) {
			this.outlineIndex = e;
		},
		deleteAll() {
			// this.printcode = "";
			this.rentalIndex = {
				id: -1
			};
			this.breakdownIndex = {
				id: -1
			};
			this.warningIndex =  {
				id: -1
			};
			this.outlineIndex =  {
				id: -1
			};
		},
		goback() {
			uni.$emit('filtrate-monitor', {
				// printCode:this.printcode,
				rentalIndex: this.rentalIndex,
				breakdownIndex: this.breakdownIndex,
				warningIndex: this.warningIndex,
				outlineIndex: this.outlineIndex
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
	font-size: $uni-font-size-base;
}
.bottom-view {
	position: absolute;
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
</style>
