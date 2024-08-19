<template>
	<view class="sum-view-bg" style="margin-bottom: 5px;">
		<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
			<view class="cell-input-view-left boldstyle">
				<text>设备信息</text>
			</view>
		</view>
		<list class="workin-dd-list">
			<cell class="workin-dd-list-cell" v-for="(item, index) in dataDic.orders" :key="index">
				<view class="cell-input-view-list">
					<view class="cell-input-view-list-row" style="flex: 2;">
						<view class="cell-input-view-left"><text>类型：</text></view>
						<view class="cell-input-view-right">
							<text class="input-style-list">{{ item.typeName || '--' }}</text>
						</view>
					</view>
					<view class="cell-input-view-list-row">
						<view class="cell-input-view-left"><text>高度：</text></view>
						<view class="cell-input-view-right">
							<text class="input-style-list">{{ item.heightName || '--' }}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view-list">
					<view class="cell-input-view-list-row" style="flex: 2;">
						<view class="cell-input-view-left">租赁方式：</view>
						<view class="cell-input-view-right">
							<text class="input-style-list">{{ item.settlementTypeName || '--' }}</text>
						</view>
					</view>
					<view class="cell-input-view-list-row">
						<view class="cell-input-view-left"><text>数量：</text></view>
						<view class="cell-input-view-right">
							<text class="input-style-list">{{ item.orderNum || '0' }}台</text>
						</view>
					</view>
				</view>
				<view class="cell-bottom-list-row">
					<view @click="gotoDdCar(index, item)" style="margin-left: 20px;" v-if="isedit">
						<text style="text-align: center;color: #E60000;">调度设备({{item.machineList?item.machineList.length:0}})</text>
					</view>
					<view style="margin-left: 20px;" @click="gotoCarDetail(item)">
						<text>设备详情</text>
					</view>
				</view>
			</cell>
		</list>
		<imgupload 
		@uploadfinish="uploadfinish" 
		@deleteUrl="deleteUrl" 
		type="workin_type" 
		uploadType="attachment" 
		maximg="20"
		:imgFinishlist="dataDic.fileList"
		:isupload="isedit"
		/>
		<text-label-item 
		tagName="备注" 
		@ipnuttext="remarkmethod"
		:inputValue="dataDic.comment"
		:inputDisabled="!isedit"
		/>
		
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';
export default{
	components: {
		selectLabelItem,
		textLabelItem,
		labelArrow,
		imgupload
	},
	data(){
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			contractName:"",
			choosetypeArr:[],
			carindex:0,
			workCheckResults:[],
			storeCheckResults:[]
		}
	},
	props: {
		dataDic: {
			type: Object,
			default () {
				return {};
			}
		},
		isedit:{
			type:Boolean,
			default:true
		}
	},
	watch:{
		dataDic(val) {
			console.log(JSON.stringify(val))
		},
	},
	created(){
		//设备
		uni.$on('choose-workincar-emit', usnerinfo => {
			let list = usnerinfo.list;
			let machineList = [];
			let orderslist = this.dataDic.orders
			let choosedict = orderslist[this.carindex];
			list.forEach(item => {
				let dict = {
					licenseId: item.licenseId,
					machineBrand: item.brand,
					machineType: choosedict.typeName,
					machineTypeName: item.typeName,
					printCode: item.printCode,
					machineHeight: item.machineHeight,
					machineHeightName: item.machineHeightName,
					address: item.address,
					orgId:item.orgId,
					orgName:item.orgName,
					workCheckResults: this.getchecklist(choosedict.machineList,item.licenseId),
					storeCheckResults: this.storeCheckResults
				};
				machineList.push(dict);
			});
			choosedict.machineList = machineList;
			orderslist[this.carindex] = choosedict
			let dict = {
				...this.dataDic,
				orders:[...orderslist]
			}
			this.$emit('clickevent', {
				type:"value",
				data:dict
			});
		});
	},
	methods:{
		//时间处理
		changestr(str) {
			if (str == null) {
				if(this.isedit === false){
					return "--"
				}
				return '';
			}
			return str.split(' ')[0];
		},
		//选择调度车辆
		gotoDdCar(index, item) {
			if(this.isedit === false){
				return
			}
			this.carindex = index;
			let list = [];
			this.dataDic.orders.map((o) => {
				if (o.machineList.length > 0) {
					o.machineList.map((o) => {
						list.push(o)
					})
				}
			})
			uni.navigateTo({
				url: './workin-car-choose?item=' + encodeURIComponent(JSON.stringify(item)) + '&enableTime=' + this.changestr(
					this.dataDic.enableDate) + "&carlist=" + encodeURIComponent(JSON.stringify(list))
			});
		},
		gotoCarDetail(item) {
			//调度设备详情列表
			uni.navigateTo({
				url: './workin-car-detaillist?item=' + encodeURIComponent(JSON.stringify(item))
			});
		},
		//上传图片回调
		uploadfinish(val) {
			let list = val.data;
			let dict = {
				...this.dataDic,
				fileList:list
			}
			this.$emit('clickevent', {
				type:"value",
				data:dict
			});
		},
		//删除回调
		deleteUrl(val) {
			let list = val.data;
			let dict = {
				...this.dataDic,
				fileList:list
			}
			this.$emit('clickevent', {
				type:"value",
				data:dict
			});
		},
		//备注
		remarkmethod(val) {
			let dict = {
				...this.dataDic,
				comment:val
			}
			this.$emit('clickevent', {
				type:"value",
				data:dict
			});
		},
	}
}
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
	margin: 10px;
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
	min-height: 24px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.input-style {
	flex: 1;
	text-align: right;
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
	color: $uni-text-color
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
	color: #FFFFFF;
}
.boldstyle {
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-top: 5px;
	margin-bottom: 10px;
}
.workin-dd-list {
	display: flex;
	flex-direction: column;
}

.workin-dd-list-cell {
	display: flex;
	flex-direction: column;
	margin-top: 10px;
	padding: 2px;
	border-color: #eeeeee;
	border-width: 1px;
	border-style: solid;
	border-radius: 10px;
	margin-left: 10px;
	margin-right: 10px;
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

.input-style-list {
	flex: 1;
	text-align: left;
}

.input-style-list-right {
	flex: 1;
	text-align: right;
}

.cell-input-view-left-cell {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.cell-input-view-right-cell {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.cell-bottom-list-row {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	color: $uni-color-primary;
	font-size: $uni-font-size-base;
	padding-right: 5px;
	margin-bottom: 10px;
}
</style>
