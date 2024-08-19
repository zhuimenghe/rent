<template>
	<view class="claim-items-pop">
		<view class="pop-header-contianer">
			<view class="pop-header">
				<text class="item-name">索赔项目</text>
				<text class="item-price">单价</text>
				<text class="item-num">数量</text>
				<i class="iconfont add-items-icon cell-option iconadd" @click="addItem" v-if="isShow"></i>
			</view>
		</view>
		<scroll-view class="pop-content" scroll-y="true" :style="{'margin-bottom':isEdit?'80px':'0px'}">
			<view class="item-bg-view" v-for="(c,pos) in claimList" :key="pos">
				<view class="pop-items">
					<view class="item-name  item-border">
						<!-- <view class="item-value">{{c.partsName||""}}</view> -->
						<input class="input-num item-value" v-model="c.partsName" :disabled="!((isEdit ||isAdjust)&&c.partsId==='-1')" />
						<i class="iconfont items-icon cell-option iconarrow-right" v-if="isShow" @click="showPick(pos)"></i>
					</view>
					<view class="item-price  item-border ">
						<input class="input-num item-value" type="digit" v-model="c.price" @input="checkPrice($event,pos)" :disabled="!(isEdit || isAdjust)" />
					</view>
					<view class="item-num  item-border ">
						<input class="input-num item-value" type="number" v-model="c.number" @input="inputChange($event,pos)" :disabled="!(isEdit || isAdjust)" />
					</view>
					<i class="iconfont delete-items-icon cell-option iconzl--shanchu" @click="removeItem(pos)" v-if="isShow"></i>
				</view>
				<text-label-item tagName="故障信息" placeholder="请输入故障信息..." @ipnuttext="remarkmethod($event,pos)" :inputValue="c.fault"
				 :inputDisabled="!isShow" />
			</view>

		</scroll-view>
		<view class="pop-btn" v-if="isShow">
			<view class="pop-cancel" @click="cancel">取消</view>
			<view class="pop-confirm" @click="confirm">确定</view>
		</view>
		<w-picker :selectList="selectList" @confirm="onConfirm" v-if="selectList.length != 0" mode="selector" ref="selector"
		 themeColor="#E60000" />
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>

</template>

<script>
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
	export default {
		components: {
			wPicker,
			textLabelItem
		},
		data() {
			return {
				selectList: [], //底部弹窗数组
				curIndex: 0, //点击项
				claimList: [],
				isEdit: true, //是否可编辑
				isAdjust: false,
				isShow: true
			}
		},
		computed: {
			// isShow(){
			// 	if(this.isEdit ||this.isAdjust){
			// 		return true
			// 	}
			// 	return false
			// }
		},
		onLoad(options) {
			console.log("options=" + JSON.stringify(options))
			this.isEdit = options.isEdit === 'true' ? true : false;
			if (options.isAdjust) {
				this.isAdjust = options.isAdjust === 'true' ? true : false;
			}
			if (this.isEdit || this.isAdjust) {
				this.isShow = true;
			} else {
				this.isShow = false;
			}
			let list = JSON.parse(decodeURIComponent(options.claimList));
			if (list.length > 0) {
				this.claimList = [...list]
			} else {
				this.claimList = [{
					"number": 1,
					"partsId": null,
					"partsName": null,
					"price": "0"
				}]
			}
			this.loadClaimItemsData();
		},
		methods: {
			loadClaimItemsData() {
				this.$network.getData(this.$url.CLAIM_ITEM_LIST, "GET", null).then(result => {

					result.forEach(r => {
						this.selectList = [...this.selectList, {
							label: r.name,
							value: r.id,
							price: r.price
						}]

					})
					this.selectList = [
						...this.selectList,
						{
							label: '其他',
							value: '-1',
							price: 0
						}
					]

				})
			},
			inputChange(e, pos) {
				let val = e.detail.value;
				setTimeout(() => {
					let index = val.indexOf(".");
					this.$datestr.printlog("index=" + index)
					if (index !== -1) {
						this.$datestr.printlog("index==" + index)
						this.claimList[pos].number = val.substring(0, index);
					}
				}, 10)
			},
			checkPrice(e, pos) {
				let val = e.detail.value;
				setTimeout(() => {
					//限制小数两位
					if (val.indexOf(".") != -1) {
						var dotIndex = val.indexOf(".");
						if (val.length - 1 - dotIndex > 2) {
							val = val.substr(0, dotIndex + 2 + 1);
							this.claimList[pos].price = val
						}
					}
					if (val.indexOf(".") == 0) {
						val = "0" + val;
						this.claimList[pos].price = val
					}

					//限制0后面非。输入
					if (val.substring(0, 1) == "0" && val.length > 1 && val.substring(1, 2) != ".") {
						val = val.substring(0, 1);
						this.claimList[pos].price = val
						return
					}
					this.claimList[pos].price = val
				}, 10)
			},
			//添加索赔项
			addItem() {
				let newItem = {
					"number": 1,
					"partsId": null,
					"partsName": null,
					"price": "0"
				}
				this.claimList = [...this.claimList, newItem]
			},
			//移除索赔项
			removeItem(pos) {
				this.claimList.splice(pos, 1);
			},
			showPick(pos) {
				if (this.isShow) {
					this.curIndex = pos;
					this.$refs.selector.show();
				}

			},
			/*获取数据完成*/
			/*底部弹窗选择类型*/
			onConfirm(val) {
				//{"checkArr":{"label":"专票","value":1},"defaultVal":[1],"result":"专票"}
				// let isRepeat = false;
				// this.claimList.forEach(o => {
				// 	if (o.partsId !== '-1' && o.partsId === val.checkArr.value) {
				// 		isRepeat = true;
				// 		return;
				// 	}
				// })
				
				if (this.claimList.some(o=>o.partsId !== '-1' && o.partsId === val.checkArr.value)) {
					uni.showToast({
						title: "您已选过该索赔项",
						icon: "none"
					})
					return;
				}

				this.claimList[this.curIndex].partsName = val.checkArr.label
				this.claimList[this.curIndex].partsId = val.checkArr.value
				this.claimList[this.curIndex].price = val.checkArr.price
				console.log("claimList" + JSON.stringify(this.claimList))
				this.claimList = JSON.parse(JSON.stringify(this.claimList))
			},
			cancel() {
				uni.navigateBack({
					delta: 1
				})
			},
			confirm() {

				let isIdNull;
				let isNumZero;
				this.claimList.forEach(o => {
					if (!o.partsId) {
						isIdNull = true;
						return;
					}

					if (o.number <= 0) {
						isNumZero = true;
						return;

					}
				})
				if (isIdNull) {
					uni.showToast({
						title: "您有索赔项未填写",
						icon: "none"
					})
					return;
				}
				if (isNumZero) {
					uni.showToast({
						title: "索赔项数量必须大于0",
						icon: "none"
					})
					return;
				}

				let total = this.claimList.reduce((x, y) => {
					return x + (Number(y.price) * y.number)
				}, 0)
				console.log(JSON.stringify(this.claimList));
				uni.$emit("claimItems", {
					"list": this.claimList,
					"total": total + ""
				})
				uni.navigateBack({
					delta: 1
				})
			},
			//备注
			remarkmethod(e, pos) {
				this.claimList[pos].fault = e
			},
		}
	}
</script>

<style lang="scss" scoped>
	.claim-items-pop {
		width: 100%;
		height: 100%;
		position: relative;
		background-color: $uni-bg-color-grey;
	}

	.pop-header-contianer {
		width: 100%;
		position: fixed;
		top: 0px;
		left: 0px;
		z-index: 100;
	}

	.pop-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		height: 45px;
		line-height: 45px;
		padding: 0px 16px;
		color: $uni-text-color;
		font-size: $uni-font-size-sm;
	}

	.pop-content {
		margin-top: 45px;
		margin-bottom: 80px;
	}

	.item-bg-view {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: flex-start;
	}

	.pop-items {
		display: flex;
		height: 40px;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		color: $uni-text-color;
		font-size: $uni-font-size-sm;
		background-color: #FFFFFF;
		padding: 0px 16px;
	}


	.item-name {
		flex: 3;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.item-value {
		margin-left: 8px;
		margin-right: 8px;
	}

	.item-price {
		display: flex;
		flex-direction: row;
		flex: 3;
		margin-right: 10px;
		align-items: center;
	}

	.item-num {
		flex: 2;
		margin-right: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.input-num {
		padding-top: 2px;
		padding-bottom: 2px;
		color: $uni-text-color;
		font-size: $uni-font-size-sm;
	}

	.cell-option {
		width: auto;
	}

	.add-items-icon {
		color: $uni-color-primary;
		font-size: 14px;
	}

	.item-border {
		border: 1px solid $uni-bg-color-grey;
		border-radius: 4px;
		margin-right: 8px;
		height: 32px;

	}

	.item-no-border {
		margin-right: 8px;
		height: 32px;

	}

	.items-icon {
		color: $uni-text-color-gray;
		font-size: 20px;
	}

	.delete-items-icon {
		color: #DF5000;
		font-size: 14px;
	}

	.pop-btn {
		position: fixed;
		bottom: 0px;
		left: 0px;
		display: flex;
		flex-direction: row;
		background-color: #ffffff;
		height: 72px;
		width: 100%;
		justify-content: space-between;
		padding-bottom:calc(env(safe-area-inset-bottom) - 10px);
	}

	.pop-cancel {
		flex: 1;
		background-color: $uni-border-color;
		margin: 16px 8px 16px 16px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		color: $uni-text-color-gray;
		font-size: 14px;
	}

	.pop-confirm {
		flex: 1;
		background-color: $uni-color-primary;
		margin: 16px 16px 16px 8px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: #ffffff;
		border-radius: 4px;
		font-size: 14px;
	}
</style>
