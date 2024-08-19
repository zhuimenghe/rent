<template>
	<view class="sum-view-bg" style="margin-bottom: 5px;">
		<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #DCDCDC;border-bottom-style: solid;">
			<view class="cell-input-view-left boldstyle"><text>进场信息</text></view>
		</view>
		<select-label-item
		v-if="showassgin"
		tagName="进场交机人" 
		:isRequired="true"
		hint="请选择进场交机人" 
		:value="dataDic.deliveryUserName" 
		:icon="righticon" 
		@clickItemLabel="choosePersonType('workinassign')" 
		:isSelect="isedit"
		/>
		<view class="cell-input-view">
			<view class="cell-input-view-left"><text>交机地点</text><text style="color: #FF0000;">*</text></view>
			<view class="cell-input-view-right">
				<input 
				class="input-style" 
				type="text" 
				v-model="dataDic.deliveryPlace" 
				placeholder="交机地点...." 
				:disabled="!isedit" 
				/>
			</view>
			<i class="iconfont arrow iconzl--zuobiao" @click="chooseAddress" v-if="isedit"></i>
		</view>
		<select-label-item 
		tagName="物流类型" 
		hint="请选择物流方式" 
		:value="dataDic.logisticsTypeName" 
		:icon="righticon"
		@clickItemLabel="chooseType('usetrans')" 
		:isSelect="isedit"
		/>
		<view style="display: flex;flex-direction: column;" v-if="dataDic.logisticsType != '1'">
			<!-- //第三方物流 -->
			<view v-if="dataDic.logisticsType == '2'">
				<select-label-item 
				tagName="物流公司" 
				hint="请选择物流公司" 
				:isRequired="true"
				:value="isedit ? dataDic.
				logisticsCompanyName : dataDic.logisticsCompanyName || '--'"
				:icon="righticon" 
				@clickItemLabel="gotoTrans" 
				:isSelect="isedit"
				/>
				<view v-if="dataDic.logisticsCompanyId" style="display: flex;flex-direction: column;">
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>物流联系人</text><text style="color: #FF0000;">*</text></view>
						<view class="cell-input-view-right">
							<input 
							class="input-style" 
							type="text" 
							v-model="dataDic.logisticsContact" 
							:disabled="!isedit" 
							placeholder="请输入联系人...." 
							/>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>联系人电话</text><text style="color: #FF0000;">*</text></view>
						<view class="cell-input-view-right">
							<input 
							class="input-style" 
							type="number" 
							v-model="dataDic.logisticsPhone" 
							:disabled="!isedit" 
							placeholder="请输入联系人电话...."
							@click="callPhone(dataDic.logisticsPhone)" 
							:style="{color:!isedit?'#E60000':'#333333'}" 
							/>
						</view>
					</view>
				</view>
			</view>
			<!-- //租赁商物流 -->
			<view style="display: flex;flex-direction: column;" v-if="dataDic.logisticsType == '3'">
				<select-label-item 
				tagName="物流车辆" 
				:isRequired="true" 
				hint="请选择物流车辆" 
				:value="getMachineName(dataDic.transportMachine || [])"
				:icon="righticon" 
				@clickItemLabel="goTo('transportMachine')" 
				:isSelect="isedit"
				/>
				<select-label-item 
				tagName="物流司机" 
				:isRequired="true" 
				hint="请选择物流司机" 
				:value="getDriverName(dataDic.transportDriver || [])"
				:icon="righticon" 
				@clickItemLabel="goTo('transportDriver')"
				:isSelect="isedit"/>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left">
					<text>物流运费</text>
					<text style="color: #FF0000;">*</text>
				</view>
				<view class="cell-input-view-right">
					<input 
					class="input-style" 
					type="digit" 
					v-model="dataDic.logisticsCarriage" 
					placeholder="请输入物流运费...." 
					:disabled="!isedit" 
					/>
				</view>
			</view>
			<text-label-item
			tagName="物流备注" 
			@ipnuttext="remarkmethod" 
			:inputValue="dataDic.logisticsRemark ? dataDic.logisticsRemark :''" 
			:inputDisabled="!isedit" 
			/>
		</view>
		<text-label-item
		tagName="备注说明" 
		@ipnuttext="remarkcomment" 
		:inputValue="dataDic.comment ? dataDic.comment :''" 
		:inputDisabled="!isedit" 
		/>
		<view class="cell-input-view">
			<view class="cell-input-view-left"><text>是否安排人员培训</text></view>
			<view class="cell-input-view-right" style="justify-content: flex-end;">
				<switch 
				:disabled="!isedit" 
				color="#E60000" 
				:checked="dataDic.training" 
				@change="chooseType('switch')" 
				/>
			</view>
		</view>
	</view>
</template>

<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
export default {
	components: {
		selectLabelItem,
		textLabelItem,
	},
	data() {
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			choosetypeArr: [],
			
		};
	},
	props: {
		dataDic: {
			type: Object,
			default() {
				return {};
			}
		},
		isedit: {
			type: Boolean,
			default: true
		},
		isLiangXu: {
			type: Boolean,
			default: false
		},
		showassgin: {
			type: Boolean,
			default: true
		},
	},
	watch: {
		'dataDic.logisticsContact'(val) {
			let dict = {
				...this.dataDic,
				logisticsContact: val
			};
			this.$emit('clickevent', {
				type: 'workinvalue',
				data: dict
			});
		},
		'dataDic.logisticsPhone'(val) {
			let dict = {
				...this.dataDic,
				logisticsPhone: val
			};
			this.$emit('clickevent', {
				type: 'workinvalue',
				data: dict
			});
		},
		'dataDic.logisticsCarriage'(val) {
			if(val === null){
				
			}else{
				let dict = {
					...this.dataDic,
					logisticsCarriage: val
				};
				this.$emit('clickevent', {
					type: 'workinvalue',
					data: dict
				});
				setTimeout(() => {
					val = val.replace(/[^\d.]/g, ''); //清除"数字"和"."以外的字符
					val = val.replace(/^\./g, ''); //验证第一个字符是数字
					val = val.replace(/\.{2,}/g, '.'); //只保留第一个, 清除多余的
					val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
					val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
					let dictNew = {
						...this.dataDic,
						logisticsCarriage: val
					};
					this.$emit('clickevent', {
						type: 'workinvalue',
						data: dictNew
					});
				}, 50);
			}
		}
	},
	created() {
		
	},
	methods: {
		callPhone(phone) {
			if (!this.isedit && phone) {
				uni.makePhoneCall({
					phoneNumber: phone,
					success: res => {
						console.log('调用成功!');
					},
					fail: res => {
						console.log('调用失败!');
					}
				});
			}
		},
		//名字
		getMachineName(list){
			let names= list.map(o=>{
				return o.licenseId
			})
			return names.join(',');
		},
		getDriverName(list){
			let names= list.map(o=>{
				return o.name
			})
			return names.join(',');
		},
		//时间
		getYMDHMTime(date) {
			let d = '';
			if (date) {
				d = this.$dateUtil.timeFormatYMDHM(date);
			}
			return d;
		},
		//时间处理
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		//选择物流
		gotoTrans() {
			if (this.isedit) {
				uni.navigateTo({
					url: '/businessPages/workin/trans-company?type=workin'
				});
			}
		},
		//交机人
		choosePersonType(type){
			if(this.isedit){
				setTimeout(()=>{
					this.$emit("clickevent",{
						type:type
					})
				}, 100);
			}
		},
		
		//交机地址
		chooseAddress(type) {
			if(!this.isedit){
				return
			}
			this.addrType = type;
			let addrObj = {
				address: this.dataDic.deliveryPlace ? this.dataDic.deliveryPlace : '',
				latitude: this.dataDic.latitude ? this.dataDic.latitude : '',
				longitude: this.dataDic.longitude ? this.dataDic.longitude : '',
				currentRadius: '0'
			};
			uni.navigateTo({
				url: '/otherPages/map/nvr-map?deliveryAddress=' + JSON.stringify(addrObj) + '&showfence=false&type=workin'
			});
		},
		//车辆/司机
		goTo(type) {
			if(!this.isedit){
				return
			}
			switch (type) {
				case 'transportMachine':
					uni.navigateTo({
						url: '/otherPages/logistics/choose-logistics-vehicle?isEdit=' + this.isedit + '&type=workin&choosedList=' +
							encodeURIComponent(JSON.stringify(this.dataDic.transportMachine ? this.dataDic.transportMachine : []))
					});
					break;
				case 'transportDriver':
					uni.navigateTo({
						url: '/otherPages/logistics/choose-logistics-driver?isEdit=' + this.isedit + '&type=workin&choosedList=' +
							encodeURIComponent(JSON.stringify(this.dataDic.transportDriver ? this.dataDic.transportDriver : []))
					});
					break;
				default:
					break;
			}
		},
		//物流备注
		remarkmethod(val){
			let dict = {
				...this.dataDic,
				logisticsRemark: val
			};
			this.$emit('clickevent', {
				type: 'workinvalue',
				data: dict
			});
		},
		//备注说明
		remarkcomment(val){
			let dict = {
				...this.dataDic,
				comment: val
			};
			this.$emit('clickevent', {
				type: 'workinvalue',
				data: dict
			});
		},
		//回调函数方法
		chooseType(type) {
			if (this.isedit === false) {
				return
			}
			this.$emit("clickevent", {
				type: type
			})
		},
	}
};
</script>

<style lang="scss" scoped>
.sum-view-bg {
	display: flex;
	flex-direction: column;
	margin: 10px;
	margin-bottom: 20px;
	background: #ffffff;
	border-radius: 10px;
	padding-bottom: 10px;
}

.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	padding: 10px;
	font-size: $uni-font-size-base;
	border-bottom: 1px dotted #F0F2F4;
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
	min-height: 24px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.input-style {
	flex: 1;
	text-align: right;
	font-size: $uni-font-size-base;
	padding-right: 10px;
	line-height: 16px;
}
.arrow {
	color: $uni-color-primary;
	font-size: $uni-font-size-lg;
	width: 30px;
	text-align: center;
}
.cell-section-view {
	display: flex;
	flex-direction: column;
	flex: 1;
	border: 1px solid $uni-bg-color-grey;
	border-radius: 4px;
	margin: 2px 4px;
}

.cell-between {
	display: flex;
	margin: 0px 4px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.cell-section-view-width {
	display: flex;
	flex-direction: row;
	flex: 1;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
	align-items: center;
	justify-content: center;
}

.cell-view {
	font-size: $uni-font-size-base;
	font-weight: bold;
	color: $uni-text-color;
}

.cell-input-view-list {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: space-between;
	min-height: 30px;
	font-size: $uni-font-size-base;
}

.cell-input-view-list-row {
	display: flex;
	flex-direction: row;
	flex: 1;
}

.cell-input-view-list-column {
	display: flex;
	flex-direction: column;
	flex: 1;
	margin-left: 4px;
}

.cell-input-view-left-small {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	min-height: 20px;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
}

.add-btn {
	background-color: $uni-color-primary;
	padding: 2px 6px;
	border-radius: 4px;
	color: #ffffff;
}

.boldstyle {
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-top: 5px;
	margin-bottom: 5px;
}

.workin-dd-list {
	display: flex;
	flex-direction: column;
}
</style>
