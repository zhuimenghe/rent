<template>
	<view class="creat-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view style="padding-bottom: 70px;">
			<view class="sum-view-bg">
				<view class="cell-input-view tilte-view-sub">
					<view class="cell-input-view-left boldstyle"><text>设备信息</text></view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>自喷码</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{dataDic.printCode || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view" @click="goDetailCar(dataDic.licenseId)">
					<view class="cell-input-view-left"><text>车号</text></view>
					<view class="cell-input-view-right" style="color: #E60000;">
						<text class="input-style">{{dataDic.licenseId || "--"}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>设备信息</text></view>
					<view class="cell-input-view-right">
						<text
							class="input-style">{{ dataDic.machineTypeDesc || '--' }}&nbsp;|&nbsp;{{ dataDic.machineHeightDesc|| '--' }}&nbsp;|&nbsp;{{ dataDic.machineBrand || '--' }}&nbsp;|&nbsp;{{dataDic.machineTypeName || '--'}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>上次更换时间</text></view>
					<view class="cell-input-view-right">
						<text
							class="input-style">{{dataDic.lastUpdateDate?getDate(dataDic.lastUpdateDate): "--"}}</text>
					</view>
				</view>
			</view>
			<view class="sum-view-bg">
				<view class="cell-input-view tilte-view-sub">
					<view class="cell-input-view-left boldstyle"><text>充电器信息</text></view>
				</view>
				<view v-if="dataDic.chargerDto">
					<view class="d-info">
						<view class="info-cell">
							<view class="info-cell-key">名称</view>
							<view class="info-cell-value">
								{{dataDic.chargerDto.name}}
							</view>
						</view>
						<view class="info-cell">
							<view class="info-cell-key">品牌</view>
							<view class="info-cell-value">
								{{dataDic.chargerDto.brand}}
							</view>
						</view>
						<view class="info-cell">
							<view class="info-cell-key">型号</view>
							<view class="info-cell-value">
								{{dataDic.chargerDto.modelName}}
							</view>
						</view>
						<view class="info-cell">
							<view class="info-cell-key">更换时间<span style="color: #FF0000;">*</span></view>
							<view class="info-cell-value">
								<view class="item-input-style" @click="showTimePick('charger')">
									<i class="iconfont iconzl--rili" style="color: #999999;"></i>
									<text style="margin-left: 2px;">
										{{getDate(dataDic.chargerDto.updateDate)}}
									</text>
								</view>
							</view>
						</view>
					</view>
					<text-label-item tagName="备注" :inputDisabled="false" :inputValue="dataDic.chargerDto.remark"
						@ipnuttext="inputRemark($event,'charger')" />
				</view>

			</view>
			<view class="sum-view-bg">
				<view class="cell-input-view tilte-view-sub">
					<view class="cell-input-view-left boldstyle"><text>电池信息</text></view>
				</view>
				<view v-for="(item, index) in dataDic.batteryDtoList" :key="index" class="cell-view">
					<view class="d-info">
						<view class="info-cell">
							<view class="info-cell-key">序号
								<businessTips tips='电池所在位置排序标志' />
							</view>
							<view class="info-cell-value">
								#{{item.placeNum}}
							</view>
						</view>
						<view class="info-cell">
							<view class="info-cell-key">名称</view>
							<view class="info-cell-value">
								{{item.name}}
							</view>
						</view>
						<view class="info-cell">
							<view class="info-cell-key">品牌</view>
							<view class="info-cell-value">
								{{item.brand}}
							</view>
						</view>
						<view class="info-cell">
							<view class="info-cell-key">型号</view>
							<view class="info-cell-value">
								{{item.modelName}}
							</view>
						</view>
						<view class="info-cell">
							<view class="info-cell-key">序列号</view>
							<view class="info-cell-value">
								<view class="item-input-style">
									<input style="vertical-align:middle" :value="item.seriesNum"
										@input="inputSeries($event,index)" />
								</view>

							</view>
						</view>
						<view class="info-cell">
							<view class="info-cell-key">更换时间<span style="color: #FF0000;">*</span></view>
							<view class="info-cell-value" @click="showTimePick('battery',index)">
								<view class="item-input-style">
									<i class="iconfont iconzl--rili" style="color: #999999;"></i>
									<text style="margin-left: 2px;">
										{{getDate(item.updateDate)}}
									</text>
								</view>

							</view>
						</view>
					</view>
					<text-label-item tagName="备注" :inputDisabled="false" :inputValue="item.remark"
						@ipnuttext="inputRemark($event,'battery',index)" />

				</view>
			</view>

		</view>


		<view class="flow-btns">
			<view class="cancel-btn" @click="cancel"><text>取消</text></view>
			<view class="submit-btn" @click="submit"><text>保存</text></view>
		</view>


		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm"
			:disabledAfter="false" ref="date" themeColor="#E60000" />
	</view>
</template>

<script>
	import labelArrow from '@/components/common/common-ui/label-arrow.vue';
	import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	export default {
		components: {
			labelArrow,
			textLabelItem,
			wPicker
		},
		data() {
			return {
				licenseId: '',
				dataDic: {},
				pickType: '',
				curIndex: 0,
				operateType: 'add'
			}
		},
		onLoad(option) {
			this.licenseId = option.licenseId ? option.licenseId : ''
			this.getBatteryDetail();
			uni.$on('choose-battery-part', data => {
				let obj = data.partsBasics ? data.partsBasics : null
				let itemObj = obj ? {
					"basicId": obj.id,
					"brand": obj.brandName,
					"modelName": data.modelName,
					"name": obj.name,
					"seriesNum": '',
					"remark": '',
					"updateDate": '',
					"placeNum": 1
				} : null
				switch (this.pickType) {
					case 'battery':
						if (this.operateType == 'change') {
							this.dataDic.batteryDtoList[this.curIndex] = {
								...itemObj,
								placeNum: this.dataDic.batteryDtoList[this.curIndex].placeNum
							}
							this.dataDic = {
								...this.dataDic,
								batteryDtoList: this.dataDic.batteryDtoList
							}
						} else {
							this.dataDic.batteryDtoList = this.dataDic.batteryDtoList ? [...this.dataDic
								.batteryDtoList, {
									...itemObj,
									placeNum: this.dataDic.batteryDtoList ? (this.dataDic.batteryDtoList
										.length + 1) : 1
								}
							] : [{
								...itemObj,
								placeNum: this.dataDic.batteryDtoList ? (this.dataDic.batteryDtoList
									.length + 1) : 1
							}]
						}

						break;
					case 'charger':
						this.dataDic.chargerDto = itemObj
						break;
					default:
						break;
				}
			})
		},
		onUnload() {
			uni.$off('choose-battery-part')
		},
		methods: {
			getDate(time) {
				if (!time)
					return null
				return time.split(/\s+/)[0];
			},
			goDetailCar(liseceid) {
				let urlstr = "/devicePages/record/device-record-detail?licenseId=" + liseceid
				uni.navigateTo({
					url: urlstr
				})
			},
			getBatteryDetail() {
				let param = {
					licenseId: this.licenseId
				}
				this.$network
					.getData(this.$url.BATTERY_DETAIL_URL, 'GET', param)
					.then(result => {
						this.dataDic = {
							...result,
							oldBatteryDtoList: result.batteryDtoList ? JSON.parse(JSON.stringify(result
								.batteryDtoList)) : null,
							oldChargerDto: result.chargerDto ? {
								...result.chargerDto
							} : null,
						}
					})
					.catch(err => {

					});
			},
			inputRemark(val, type, pos) {
				switch (type) {
					case 'battery':
						this.dataDic.batteryDtoList[pos].remark = val
						break;
					case 'charger':
						this.dataDic.chargerDto.remark = val
						break;
					default:
						break;
				}
			},
			inputSeries(e, pos) {
				this.dataDic.batteryDtoList[pos].seriesNum = e.target.value;

			},
			showTimePick(type, pos) {
				this.pickType = type
				this.curIndex = pos
				//整组替换时，不可编辑
				this.$refs.date.show()

			},
			onConfirm(val) {
				switch (this.pickType) {
					case 'battery':
						this.dataDic.batteryDtoList[this.curIndex].updateDate = val.result + ' 00:00:00'
						break;
					case 'charger':
						this.dataDic.chargerDto.updateDate = val.result + ' 00:00:00'
						break;
					default:
						break;
				}
			},
			checkData() {
				let isSame = true
				let ochager = this.dataDic.oldChargerDto;
				let charger = this.dataDic.chargerDto
				//校验充钱器信息
				if (ochager && charger) { //都不为null
					if (!(ochager.basicId == charger.basicId && this.getDate(ochager.updateDate) == this.getDate(charger
							.updateDate))) {
						isSame = false
					}
				} else if (!(!ochager && !chager)) { //不都为null
					isSame = false
				}
				//校验电池信息
				if (this.dataDic.batteryDtoList.length == this.dataDic.oldBatteryDtoList.length) { //新老电池块数一致
					for (let i = 0; i < this.dataDic.oldBatteryDtoList.length; i++) {
						let x = this.dataDic.oldBatteryDtoList[i];
						isSame = this.dataDic.batteryDtoList.some(y => x.placeNum == y.placeNum && x.basicId == y
							.basicId && this.getDate(
								x.updateDate) ==
							this.getDate(y.updateDate) &&
							x.seriesNum == y.seriesNum)

					}
				} else { //长度不一致时
					isSame = false
				}

			},
			cancel() {
				uni.navigateBack({
					animationDuration: 200
				})
			},
			submit() {
				let submitObj = {
					...this.dataDic,
					licenseId: this.dataDic.licenseId,
					batteryDtoList: this.dataDic.batteryDtoList,
					oldBatteryDtoList: this.dataDic.oldBatteryDtoList,
					chargerDto: this.dataDic.chargerDto,
					oldChargerDto: this.dataDic.oldChargerDto
				}
				if ((submitObj.chargerDto && !submitObj.chargerDto.updateDate)) {
					uni.showToast({
						icon: 'none',
						title: '请选择充电器的更换时间'
					})
					return;
				}
				if ((submitObj.batteryDtoList && submitObj.batteryDtoList.length > 0 && submitObj.batteryDtoList.some(o =>
						!o.updateDate))) {
					uni.showToast({
						icon: 'none',
						title: '请选择电池的更换时间'
					})
					return;
				}
				this.$network
					.getData(this.$url.BATTERY_EDIT, 'PUT', submitObj)
					.then(result => {
						uni.$emit('refresh-battery-list')
						uni.navigateBack({
							animationDuration: 200
						})
					})
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.details[0] ? err.details[0] : (err.message ? err.message : '')
						})
					});
			}





		}
	}
</script>

<style lang="scss" scoped>
	.creat-bg {
		display: flex;
		width: 100%;
		flex-direction: column;
		background: $uni-bg-color-grey;
	}

	.sum-view-bg {
		display: flex;
		flex-direction: column;
		margin: 10px;
		margin-bottom: 10px;
		background: #ffffff;
		border-radius: 10px;
		padding-bottom: 10px;
	}

	.cell-view {
		display: flex;
		flex-direction: column;
		border-width: 1px;
		border-color: #eeeeee;
		border-style: solid;
		border-radius: 5px;
		margin: 10px;
	}

	.cell-input-view-row {
		display: flex;
		flex-direction: row;
		flex: 1;
		align-items: center;
		justify-content: flex-start;
		font-size: $uni-font-size-base;
	}

	.cell-input-view {
		display: flex;
		flex-direction: row;
		flex: 1;
		align-items: center;
		justify-content: space-between;
		margin: 10px;
		font-size: $uni-font-size-base;
	}

	.cell-input-view-cell {
		display: flex;
		flex-direction: column;
		flex: 1;
		margin: 10px;
		font-size: $uni-font-size-base;
		background: $uni-bg-color-grey;
	}

	.tilte-view-sub {
		border-bottom-width: 1px;
		border-bottom-color: #eeeeee;
		border-bottom-style: solid;
	}

	.cell-input-view-left {
		display: flex;
		flex-direction: row;
		min-width: 50px;
		align-items: center;
		justify-content: flex-start;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.cell-input-view-right {
		display: flex;
		flex: 1;
		margin-left: 10px;
		align-items: center;
		justify-content: flex-end;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.input-style {
		flex: 1;
		flex-wrap: wrap;
		text-align: right;
		font-size: $uni-font-size-base;
		margin-right: 10px;
	}

	.item-input-style {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 2px;
		text-align: left;
		font-size: $uni-font-size-base;
		margin-right: 10px;
		border: 1px solid $uni-bg-color-grey;
		border-radius: 2px;
		min-height: 24px;
		line-height: 24px;

	}

	.boldstyle {
		margin-top: 5px;
		font-size: $uni-font-size-lg;
		font-weight: bold;
		margin-bottom: 10px;
		color: $uni-text-color;
	}

	.d-info {
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		align-items: flex-start;
		padding: 8px;
	}

	.info-cell {
		width: 50%;
		padding-bottom: 8px;
	}

	.info-cell-key {
		color: $uni-text-color-gray;
		font-size: $uni-font-size-sm;
		display: flex;
		flex-flow: row;
		align-items: center;
	}

	.info-cell-value {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		margin-top: 4px;
		min-height: 24px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.middle-option {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		font-size: $uni-font-size-base;
		padding: 8px;
	}

	.top-line {
		padding: 8px 0px;
		border-width: 1px 0px 0px 0px;
		border-color: $uni-bg-color-grey;
		border-style: solid;
	}

	.icon-text {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.flow-btns {
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
		padding-bottom:calc(env(safe-area-inset-bottom) - 10px);
	}

	.cancel-btn {
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

	.submit-btn {
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
</style>
