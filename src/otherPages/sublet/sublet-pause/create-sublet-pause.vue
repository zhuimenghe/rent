<template>
	<view class="pause-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="sum-view-bg">
			<view class="model-tag">
				<text>基本信息</text>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>转租报停单号</text></view>
				<view class="cell-input-view-right">
					<text class="text-style">{{ pauseDic.businessNo || '--' }}</text>
				</view>
			</view>
			<select-label-item
				tagName="转租公司"
				hint="请选转租公司"
				:isRequired="true"
				:value="pauseDic.companyName"
				:icon="righticon"
				@clickItemLabel="gotoContract"
			/>
			<view v-if="pauseDic.companyId">
				<view class="cell-input-view">
					<view class="cell-input-view-left">
						<text>联系人</text>
					</view>
					<view class="cell-input-view-right">
						<input 
						class="input-style" 
						type="text" 
						v-model="pauseDic.contactName" 
						/>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left">
						<text>联系人电话</text>
					</view>
					<view class="cell-input-view-right">
						<input 
						class="input-style" 
						type="text"
						v-model="pauseDic.phoneNum" 
						/>
					</view>
				</view>
			</view>
		</view>
		<view class="sum-view-bg">
			<view class="model-tag">
				<text>设备信息（共{{ pauseDic.machines.length || '0' }}辆，总计{{ pauseDic.total || '0.00' }}元）</text>
				<view class="tag-right">
					<i class="iconfont labelstyle iconadd" @click="addMachine"></i>
				</view>
			</view>
			<view class="vehicle-list-container">
				<view v-for="(v, i) in pauseDic.machines" class="v-item-container" :key="i">
					<view class="item-top">
						<text>车号：{{ v.licenseId }}</text>
						<!-- <view class="top-right">
							<text>{{ v.stateName }}-{{ v.subStateName }}</text>
						</view> -->
					</view>
					<view class="item-row">
						<text>品牌：{{ v.brand || '--' }}</text>
						<text>自喷码：{{ v.printCode || '-' }}</text>
					</view>
					<view class="item-row">
						<tag-select 
						tagName="启用日期" 
						:value="getDate(v.subletDate)" 
						:textColor="textColor" 
						:fontSize="fontSize" 
						:isSelect = 'false'
						/>
						<tag-select 
						tagName="还租日期" 
						:value="getDateStr(v.rentBackDate)" 
						:textColor="textColor" 
						:fontSize="fontSize"
						:isSelect = 'false'
						 />
					</view>
					<view class="item-row">
						<tag-select 
						tagName="报停开始日期" 
						:value="getDate(v.beginDate)" 
						@tap="showPick('beginDate', i)" 
						:textColor="textColor" 
						:fontSize="fontSize" 
						/>
						<tag-select 
						tagName="报停结束日期" 
						:value="getDate(v.endDate)" 
						@tap="showPick('endDate', i)" 
						:textColor="textColor" 
						:fontSize="fontSize"
						 />
					</view>
					<view class="item-row">
						<tag-select 
						tagName="预计报停天数" 
						:value="v.pauseDays || '--'" 
						:isSelect="false" 
						:textColor="textColor" 
						:fontSize="fontSize"
						/>
						<view class="pause-options">
							<tag-input 
							tagName="报停租金(元)" 
							:textColor="textColor" 
							:fontSize="fontSize">
								<input 
								:placeholder="$t('common.inputTip')" 
								type="digit" 
								v-model="v.pauseHire" 
								@input="checkInput($event, i)" 
								/>
							</tag-input>
							<i class="iconfont delete-items-icon iconzl--shanchu" 
							@click="removeMachine(i)" ></i>
						</view>
					</view>
					<view class="line-s" />
				</view>
			</view>
		</view>
		<view class="sum-view-bg">
			<view class="model-tag">
				<text>报停信息</text>
			</view>
			<select-label-item
			tagName="报停类型"
			isRequired="true"
			hint="请选择报停类型"
			:value="pauseDic.pauseCauseName"
			@clickItemLabel="showPick('select')"
			/>
			<imgupload 
			@uploadfinish="uploadfinish" 
			@deleteUrl="deleteUrl" 
			:imgFinishlist="pauseDic.fileList" 
			type="sublet_type" 
			uploadType="attachment" 
			maximg="20" 
			/>
			<text-label-item
			tagName="报停原因" 
			placeholder="请输入报停原因..." 
			@ipnuttext="remarkmethod" 
			:inputValue="pauseDic.reason" 
			/>
		</view>
		<view style="width: 100%;height: 80px;"/>
		<view class="bottom-view">
			<view class="bottom-left-view" @click="cancleClick">
				<text>取消</text>
			</view>
			<view class="bottom-right-view" @click="showalert">
				<text>确定</text>
			</view>
		</view>
		<w-picker
		:selectList="pauseTypes" 
		@confirm="onConfirm" 
		mode="selector" ref="selector" 
		themeColor="#E60000" 
		/>
		<w-picker 
		mode="date" 
		startYear="2000" 
		endYear="3000" 
		:current="true"
		@confirm="onConfirm" 
		:disabledAfter="false" 
		:pickControl="true" 
		ref="date" 
		themeColor="#E60000" 
		/>
	</view>
</template>
<script>
import wPicker from '@/components/common/w-picker/w-picker.vue';
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import calRent from '@/common/util/cal-rent-money.js';
import TagSelect from '@/components/common/uni-tag/tag-select.vue';
import TagInput from '@/components/common/uni-tag/tag-input.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';
import timeCompare from '@/common/common-method/common-method.js';

export default {
	components: {
		wPicker,
		selectLabelItem,
		textLabelItem,
		labelArrow,
		TagSelect,
		TagInput,
		imgupload
	},
	data() {
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			textColor: '#333333',
			fontSize: '14px',
			pauseDic: {
				machines: []
			},
			itemData:null,
			pickType: '',
			curItem: 0,
			addIndex: 0,
			pauseTypes: [],
		};
	},
	onLoad(option) {
		uni.$on('sublet-device-list', (o) => {
			let list = o.list || []
			let oldList = this.pauseDic.machines || []
			this.mixArr(oldList,list)
		});
		uni.$on('sublet-company-list', (o) => {
			let dict = o.item || {}
			this.pauseDic = {
				...this.pauseDic,
				companyId:dict.id,
				companyName:dict.name,
				contactName:dict.contact,
				phoneNum:dict.phone,
			}
		});
		if(option.item){
			this.itemData = JSON.parse(decodeURIComponent(option.item))
			this.loadDetail()
		}else{
			if(option.deviceItem){
				let companyDic = JSON.parse(decodeURIComponent(option.deviceItem))
				this.getCompanyData(companyDic)
			}
			this.getBusinessNo();
		}
		this.loadPauseTypes();
		/*统计*/
		this.$gxfmethod.statisticData(this.$eventId.Sublet_Administrative,"转租报停","新增");
	},
	onUnload() {
		// 取消监听事件
		uni.$off('sublet-device-list');
	},
	methods: {
		/**
		 * 获取单号
		 */
		getBusinessNo() {
			let url = this.$url.CREATE_MACHINE_NO.replace(/{type}/, 'ZZBT');
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					this.pauseDic = {
						...this.pauseDic,
						businessNo: result
					};
				})
				.catch(err => {});
		},
		//修改
		loadDetail(){
			uni.showLoading();
			let param = {
				businessNo: this.itemData.businessNo
			}
			this.$network.getData(this.$url.SUBLET_PAUSE_DETAIL, 'GET', param).then(result => {
				this.pauseDic = { 
					...result,
					id:null
				};
				uni.hideLoading()
			}).catch(err => {
				uni.hideLoading()
			});
		},
		//获取公司详情
		getCompanyData(companyDic){
			uni.showLoading();
			let urlstr = this.$url.SUBLET_CONMPANY_DETAIL.replace(/{subletCompanyId}/, companyDic.companyId);
			this.$network.getData(urlstr, 'GET', null).then(result => {
				let machinesdict = {
					...companyDic,
					beginDate: companyDic.subletDate ? companyDic.subletDate : null, 
				}
				this.pauseDic = {
					...this.pauseDic,
					companyId:result.id,
					companyName:result.name,
					contactName:result.contact,
					phoneNum:result.phone,
					machines:[machinesdict],
				}
				uni.hideLoading()
			}).catch(err => {
				uni.hideLoading()
			});
		},
		mixArr(oldList,newList){
			if(oldList.length>0){
				let mixlist = newList.map((item)=>{
					let filterlist = oldList.filter(o => {
						return o.licenseId === item.licenseId
					});
					if(filterlist.length === 1){
						return filterlist[0];
					}else{
						return {
							...item,
							beginDate: item.subletDate ? item.subletDate : null,
						};
					}
				})
				this.pauseDic = {
					...this.pauseDic,
					machines:mixlist
				}
			}else{
				let Datelist = newList.map((o)=>{
					return{
						...o,
						beginDate: o.subletDate ? o.subletDate : null,
					}
				})
				this.pauseDic = {
					...this.pauseDic,
					machines:Datelist,
				}
			}
		},
		//报停类型
		loadPauseTypes() {
			this.$network
				.loadType('pause_cause')
				.then(result => {
					this.pauseTypes = result;
					if (!this.itemData) {
						if (this.pauseTypes.length > 0) {
							this.pauseDic = { 
								...this.pauseDic, 
								pauseCause: this.pauseTypes[0].value, 
								pauseCauseName: this.pauseTypes[0].label ,
							};
						}
					}
				})
				.catch(err => {});
		},
		calTotal() {
			let total = this.pauseDic.machines.reduce((x, y) => {
				return x + (y.pauseDays ? Number(y.pauseDays) : 0) * (y.pauseHire ? Number(y.pauseHire) : 0);
			}, 0);
			this.pauseDic = {
				...this.pauseDic,
				total : total.toFixed(2)
			};
		},
		//跳入转租公司列表
		gotoContract() {
			let url = './choose-sublet-apply-list';
			uni.navigateTo({
				url: url
			});
		},
		/**
		 * 获取预计报停天数
		 * @param {Object} beginDate
		 * @param {Object} endDate
		 */
		getPauseDays(beginDate, endDate) {
			if (!beginDate || !endDate) {
				return null;
			}
			return calRent.getDaysOfDiffer(beginDate, endDate);
		},
		getDate(time) {
			if (!time) {
				return '';
			}
			return time.split(/\s+/)[0];
		},
		getDateStr(time) {
			if (!time) {
				return '--';
			}
			return time.split(/\s+/)[0];
		},
		/**
		 * 添加报停设备
		 */
		addMachine() {
			if (!this.pauseDic.companyId) {
				uni.showToast({
					icon: 'none',
					title: '请选择转租公司'
				});
				return;
			}
			let itemDic = {
				...this.pauseDic,
				id : this.pauseDic.companyId
			}
			uni.navigateTo({
				url: './choose-sublet-compay-carlist?list=' + encodeURIComponent(JSON.stringify(this.pauseDic.machines)) + '&item=' + encodeURIComponent(JSON.stringify(itemDic)) + '&back=1'
			});
		},
		/**
		 * 删除报停设备
		 */
		removeMachine(i) {
			this.pauseDic.machines.splice(i, 1);
			this.calTotal();
		},
		//备注
		remarkmethod(val) {
			this.pauseDic.reason = val;
		},
		//取消按钮
		cancleClick() {
			uni.navigateBack({
				delta: 1
			});
		},

		//上传图片回调
		uploadfinish(val) {
			let list = val.data;
			this.pauseDic = {
				...this.pauseDic,
				fileList: [...list]
			};
		},
		//删除回调
		deleteUrl(val) {
			let list = val.data;
			this.pauseDic = {
				...this.pauseDic,
				fileList: [...list]
			};
		},
		showalert(){
			uni.showModal({
				title: '提示',
				content: "该操作会影响到转租应付，请知晓",
				success: res => {
					if(res.cancel){
						
					}else{
						this.checkData()
					}
				}
			});
		},
		checkData() {
			// 该操作会影响到转租应付，请知晓
			if (!this.pauseDic.companyId) {
				uni.showToast({
					title: '请选择转租公司',
					icon: 'none'
				});
				return;
			}
			if (!this.pauseDic.machines || (this.pauseDic.machines && this.pauseDic.machines.length <= 0)) {
				uni.showToast({
					title: '请选择设备信息',
					icon: 'none'
				});
				return;
			}
			if (!this.pauseDic.pauseCauseName) {
				uni.showToast({
					title: '请选择报停类型',
					icon: 'none'
				});
				return;
			}
			let mlist = this.pauseDic.machines.map(o => {
				return {
					...o,
					beginDate : this.getDate(o.beginDate) + ' 00:00:00',
					endDate : o.endDate ? (this.getDate(o.endDate) + ' 23:59:00'):null,
				}
			});
			this.pauseDic = {
				...this.pauseDic,
				machines: mlist ,
			};
			this.clicksave()
		},
		//确定按钮
		clicksave() {
			uni.showLoading({
				mask: true
			});
			this.$network
				.getData(this.$url.SUBLET_PAUSE_CREATE, 'POST', this.pauseDic)
				.then(result => {
					uni.$emit('refresh-sublet-list', {
						type: 'pause'
					});
					uni.navigateBack({
						animationDuration: 200
					});
					uni.hideLoading();
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.message ? err.message : err.details[0]
					});
				});
		},
		showPick(type, item) {
			this.pickType = type;
			switch (type) {
				case 'select':
					this.$refs.selector.show();
					break;
				default:
					this.curItem = item;
					this.$refs.date.show();
					break;
			}
		},
		onConfirm(val) {
			switch (this.pickType) {
				case 'beginDate':
					if (this.pauseDic.machines[this.curItem].subletDate &&timeCompare.timedifferent(val.result, this.getDate(this.pauseDic.machines[this.curItem].subletDate)) === -1
					) {
						uni.showToast({
							icon: 'none',
							title: '报停开始时间不得早于车辆起租时间'
						});
						return;
					}
					if (this.pauseDic.machines[this.curItem].rentBackDate &&timeCompare.timedifferent(val.result, this.getDate(this.pauseDic.machines[this.curItem].rentBackDate)) === 1){
						uni.showToast({
							icon: 'none',
							title: '报停开始时间不得晚于还租时间'
						});
						return;
					}
					if (this.pauseDic.machines[this.curItem].endDate && timeCompare.timedifferent(val.result, this.getDate(this.pauseDic.machines[this.curItem].endDate)) === 1) {
						uni.showToast({
							icon: 'none',
							title: '报停开时间不得晚于报停结束时间'
						});
						return;
					}
					this.$refs.date.hide();
					this.pauseDic.machines[this.curItem].endDate = this.getDate(this.pauseDic.machines[this.curItem].endDate);
					this.pauseDic.machines[this.curItem].beginDate = val.result;
					this.pauseDic.machines[this.curItem].pauseDays = this.getPauseDays(
						this.pauseDic.machines[this.curItem].beginDate,
						this.pauseDic.machines[this.curItem].endDate
					);
					this.calTotal();
					break;
				case 'endDate':
					if (this.pauseDic.machines[this.curItem].subletDate && timeCompare.timedifferent(val.result, this.getDate(this.pauseDic.machines[this.curItem].subletDate)) === -1) {
						uni.showToast({
							icon: 'none',
							title: '报停结束时间不得早于车辆起租时间'
						});
						return;
					}
					if (this.pauseDic.machines[this.curItem].rentBackDate && timeCompare.timedifferent(val.result, this.getDate(this.pauseDic.machines[this.curItem].rentBackDate)) === 1) {
						uni.showToast({
							icon: 'none',
							title: '报停结束时间不得晚于车辆还租时间'
						});
						return;
					}
					if (this.pauseDic.machines[this.curItem].beginDate && timeCompare.timedifferent(val.result, this.getDate(this.pauseDic.machines[this.curItem].beginDate)) === -1) {
						uni.showToast({
							icon: 'none',
							title: '报停结束时间不得早于报停开始时间'
						});
						return;
					}
					this.$refs.date.hide();
					this.pauseDic.machines[this.curItem].beginDate = this.getDate(this.pauseDic.machines[this.curItem].beginDate);
					this.pauseDic.machines[this.curItem].endDate = val.result;
					this.pauseDic.machines[this.curItem].pauseDays = this.getPauseDays(
						this.pauseDic.machines[this.curItem].beginDate,
						this.pauseDic.machines[this.curItem].endDate
					);
					this.calTotal();
					break;
				case 'select':
					this.pauseDic.pauseCause = val.checkArr.value;
					this.pauseDic.pauseCauseName = val.checkArr.label;
					break;
			}
		},
		checkInput(e, i) {
			var val = e.target.value;
			setTimeout(() => {
				//限制小数两位
				if (val.indexOf('.') != -1) {
					var dotIndex = val.indexOf('.');
					if (val.length - 1 - dotIndex > 2) {
						val = val.substr(0, dotIndex + 2 + 1);
						this.getInputData(val, i);
					}
				}
				if (val.indexOf('.') == 0) {
					val = '0' + val;
					this.getInputData(val, i);
				}
				//限制0后面非。输入
				if (val.substring(0, 1) == '0' && val.length > 1 && val.substring(1, 2) != '.') {
					val = val.substring(0, 1);
					this.getInputData(val, i);
					return;
				}
				this.getInputData(val, i);
			}, 10);
		},
		getInputData(val, i) {
			this.pauseDic.machines[i].pauseHire = val;
			this.calTotal();
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	position: relative;
	width: 100%;
	height: 100%;
}

.pause-bg {
	display: flex;
	// flex: 1;
	// width: 100%;
	// margin-bottom: 68px;
	flex-direction: column;
	background: $uni-bg-color-grey;
}

.sum-view-bg {
	display: flex;
	flex-direction: column;
	flex: 1;
	// margin: 10px;
	background: #ffffff;
	// border-radius: 4px;
}

.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	padding: 10px;
	border-bottom:$uni-line-color 1px solid;
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
	justify-content: flex-end;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.text-style {
	flex: 1;
	text-align: right;
	font-size: $uni-font-size-base;
}

.input-style {
	text-align: right;
	font-size: $uni-font-size-base;
	// border-width: 0px 0px 1px 0px;
	// border-style: solid;
	// border-color: $uni-bg-color-grey;
	// width: 140px;
	// height: 35px;
}

.model-tag {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border-color: $uni-bg-color-grey;
	border-width: 0px 0px 1px 0px;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	padding: 15px;
	align-items: center;
}

.tag-right,
.top-right {
	display: flex;
	flex-direction: row;
	align-items: center;
	text-align: center;
}

.labelstyle {
	color: $uni-color-primary;
	font-size: 24px;
	margin-left: 10px;
}

// .attachment-icon {
// 	color: $uni-color-primary;
// 	font-size: 14px;
// 	margin-left: 10px;
// }

.delete-items-icon {
	color: #ff0000;
	font-size: 14px;
	margin-left: 10px;
}

.vehicle-list-container {
	padding: 15px;
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
	align-items: center;
	margin-top: 8px;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.item-row tag-select {
	flex: 1;
}

.pause-options {
	flex: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	color: $uni-color-primary;
}

.item-row text {
	flex: 1;
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
.line-s {
	margin-top: 5px;
	margin-left: 5px;
	margin-right: 5px;
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
</style>
