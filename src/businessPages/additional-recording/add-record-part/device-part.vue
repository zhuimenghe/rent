<template>
	<view class="sum-view-bg" style="margin-bottom: 5px;">
		<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #DCDCDC;border-bottom-style: solid;">
			<view class="cell-input-view-left boldstyle">
				<text>车辆信息</text>
			</view>
		</view>
		<list class="workin-dd-list">
			<cell class="workin-dd-list-cell" v-for="(item, index) in dataDic.orderList" :key="index">
				<view class="cell-input-view-machine">
					<view class="cell-input-view-machine-left">
						<text class="tag-view tag1">{{ item.typeName || '' }}</text>
						<text class="tag-view tag2">{{ item.heightName || '' }}</text>
						<text class="tag-view tag3">{{ item.usedNum || '0' }}台</text>
						<text class="tag-view tag4">{{ item.settlementTypeName || '' }}</text>
						<text class="tag-view tag4" v-if="item.settlementType != '4'">¥ {{ item.hire || '' }}/{{getType(item)}}</text>
						<text class="tag-view tag4" v-if="item.settlementType === '4'">¥ {{ item.hire || '' }}/天 {{ item.hireMonthly || '' }}/月</text>
					</view>
					<view class="cell-input-view-machine-right" v-if="isedit">
						<text class="tag-view tag5" @click="gotoDdCar(index, item)">{{ '调度' }}</text>
					</view>
				</view>
				<view class="cell-input-view-machine-list" v-for="(mitem, mindex) in item.machineList" :key="mindex" >
					<view class="cell-input-view-machine-list-head">
						<view class="head-top">自喷码: {{ mitem.printCode || '-' }}</view>
						<view class="head-bottom">
							<text>{{ mitem.machineBrand || '--' }}-{{ mitem.machineTypeName || '--' }} | {{ mitem.licenseId || '--' }}</text>
						</view>
					</view>
					<view class="cell-input-view-list-row">
						<view class="time-view" style="margin-right: 10px;" :style="{'border-width':isedit?'1px':'0px'}"  @click="chooseType('workintime',index,mindex)">
							<text>进场启用时间</text>
							<view class="time-view-lab">
								<input 
								:disabled="true" 
								class="time-view-lab-left"
								placeholder="选择进场启用时间" 
								:value="changestr(mitem.beginDate)"
								/>
								<i class="iconfont time-view-lab-right iconzl--rili" v-if="isedit"></i>
							</view>
						</view>
						<view class="time-view" style="margin-left: 10px;" :style="{'border-width':isedit?'1px':'0px'}" @click="chooseType('workouttime',index,mindex)">
							<text>退场结算时间</text>
							<view class="time-view-lab">
								<input 
								:disabled="true" 
								class="time-view-lab-left"
								placeholder="选择退场结算时间" 
								:value="changestr(mitem.endDate)"
								/>
								<i class="iconfont time-view-lab-right iconzl--rili" v-if="isedit"></i>
							</view>
						</view>
					</view>
					<view class="cell-input-view-list-btn" v-if="isedit" >
						<text 
						class="tag-view checkbtnError" 
						@click="deleteCar(index, item,mindex, mitem)">删除</text>
					</view>
				</view>
			</cell>
		</list>
	</view>
</template>

<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import labelArrow from '@/components/common/common-ui/label-arrow.vue';
export default{
	components: {
		selectLabelItem,
		textLabelItem,
		labelArrow
	},
	data(){
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			contractName:"",
			choosetypeArr:[],
			typeindx:0,
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
		},
		isLiangXu: {
			type: Boolean,
			default: false
		},
	},
	watch:{
		dataDic(val) {
		},
	},
	created(){
		this.getdata();
		//设备
		uni.$on('choose-workincar-emit', usnerinfo => {
			let list = usnerinfo.list;
			let machineList = [];
			let orderslist = this.dataDic.orderList
			let choosedict = orderslist[this.typeindx];
			let oldmachineList = [...choosedict.machineList]
			list.forEach(item => {
				let filterArr = oldmachineList.filter((x)=>{
					return x.licenseId === item.licenseId;
				});
				if(filterArr.length > 0){
					machineList.push(filterArr[0]);
				}else{
					let dict = {
						...item,
						licenseId: item.licenseId,
						machineBrand: item.brand,
						typeName: choosedict.typeName,
						machineTypeName: item.machineTypeName,
						printCode: item.printCode,
						machineHeight: item.machineHeight,
						machineHeightName: item.machineHeightName,
						address: item.address,
						orgId:item.orgId,
						orgName:item.orgName,
						beginDate:choosedict.beginDate ? choosedict.beginDate : '',
						endDate:choosedict.endDate ? choosedict.endDate : '',
						workCheckResults: this.getchecklist(choosedict.machineList,item.licenseId),
						storeCheckResults: this.storeCheckResults
					};
					machineList.push(dict);
				}
			});
			choosedict.machineList = machineList;
			orderslist[this.typeindx] = choosedict
			let dict = {
				...this.dataDic,
				orderList:[...orderslist],
			}
			this.$emit('clickevent', {
				type:"value",
				data:dict
			});
		});
		//点检项
		uni.$on('choose-check-emit', usnerinfo => {
			let list = usnerinfo.list;
			let orderslist = this.dataDic.orders
			let choosedict = orderslist[this.typeindx];
			let machineList = choosedict.machineList;
			let machineDict = machineList[this.carindex]
			let newItemDict = {
				...machineDict,
				workCheckResults: [...list],
			}
			machineList.splice(this.carindex,1,newItemDict)
			let orderDic = {
				...choosedict,
				machineList:[...machineList]
			}
			orderslist.splice(this.typeindx,1,orderDic)
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
		getType(item){
			if(item.settlementType === '1'){
				return '天'
			}else if(item.settlementType === '5'){
				return '周'
			}else{
				return '月'
			}
		},
		getchecklist(oldList,str){
			if(oldList){
				console.log(JSON.stringify(oldList))
				let filterlist = oldList.filter(o => {
					return o.licenseId === str;
				});
				if(filterlist.length === 1){
					return filterlist[0].workCheckResults
				}
			}
			return this.workCheckResults;
		},
		//时间处理
		changestr(str) {
			if (str == null) {
				if(this.isedit === false){
					return ""
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
			this.typeindx = index;
			let list = [];
			this.dataDic.orderList.map((o) => {
				if (o.machineList.length > 0) {
					o.machineList.map((o) => {
						list.push(o)
					})
				}
			})
			let chooseList = item.machineList || [];
			uni.navigateTo({
				url: './choose-add-machine?item=' + encodeURIComponent(JSON.stringify(item)) + "&carlist=" + encodeURIComponent(JSON.stringify(list))
			});
		},
		//点检
		gotoCheckCar(index, item,mindex,mitem) {
			if(this.isedit === false){
				uni.navigateTo({
					url: "./check-car-list?item=" + encodeURIComponent(JSON.stringify(mitem.workCheckResults)) + '&iscleck=false'
				 })
				return
			}
			this.typeindx = index;
			this.carindex = mindex;
			uni.navigateTo({
				url: './check-car-list?item=' + encodeURIComponent(JSON.stringify(mitem.workCheckResults))
			});
		},
		deleteCar(index, item,mindex, mitem){
			let orderslist = this.dataDic.orderList;
			let machineList = item.machineList;
			machineList.splice(mindex,1)
			let orderDic = {
				...item,
				machineList:[...machineList]
			}
			orderslist.splice(index,1,orderDic)
			let dict = {
				...this.dataDic,
				orderList:[...orderslist]
			}
			this.$emit('clickevent', {
				type:"value",
				data:dict
			});
		},
		chooseType(type,index,mindex){
			if(this.isedit === false){
				return
			}
			this.$emit("clickevent",{
				type:type,
				index:index,
				mindex:mindex
			})
		},
		//=---==-
		//进场点检
		getdata() {
			uni.showLoading();
			let param = {
				type: 'work'
			};
			this.$network
				.getData(this.$url.GET_CHECK_LISWT, 'GET', param)
				.then(result => {
					let list = result;
					this.changeListToCheck(list);
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		changeListToCheck(list) {
			this.workCheckResults = list.map(o => {
				return {
					id: o.id,
					content: o.content,
					checked: true
				};
			});
			uni.hideLoading();
		},
		ischeckOK(checkalllist){
			if(!checkalllist){
				return false;
			}
			let list = checkalllist.filter((o)=>{
				return o.checked === false
			})
			if(list.length > 0){
				return false;
			}
			return true;
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
	padding: 0px 5px 5px 2px;
	margin-left: 10px;
	margin-right: 10px;
	background: #FFFFFF;
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
//---------车辆新
.cell-input-view-machine{
	display: flex;
	margin-top: 5px;
	margin-bottom: 5px;
	flex-direction: row;
	justify-content: flex-start;
	background: #FFFFFF;
	padding-bottom: 5px;
	border-bottom: 1px solid #EEEEEE;
}
.cell-input-view-machine-left{
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
}
.cell-input-view-machine-right{
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
}
.tag-view{
	display: flex;
	padding: 3px 5px;
	border-radius: 3px;
	font-size: $uni-font-size-sm;
	justify-content: center;
	align-items: center;
	margin-right: 5px;
	margin-top: 3px;
}
.tag1{
	background: #EEF9E8;
	color: #57C32D;
}
.tag2{
	background: #EEEEEE;
	color: #999999;
}
.tag3{
	background: #FFF6E7;
	color: #FAB045;
}
.tag4{
	background: #FFF1F0;
	color: #E60000;
}
.tag5{
	background: $uni-color-primary;
	color: #FFFFFF;
    margin-left: 10px;
}
.cell-input-view-machine-list{
	display: flex;
	flex-direction: column;
	padding: 5px 10px;
	border: 1px dotted #f3f3f3;
	margin-top: 5px;
	border-radius: 4px;
}

.cell-input-view-machine-list-head{
	display: flex;
	flex-direction: column;
	font-size: $uni-font-size-base;
	color: #222831;
}
.head-top {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	font-weight: bold;
}
.head-bottom {
	display: flex;
	flex-direction: row;
	align-items: center;
	color: $uni-text-color;
	font-size: $uni-font-size-sm;
	margin-bottom: 4px;
	margin-top: 4px;
}
.text-color{
	color: $uni-text-color-gray;
	font-size: $uni-font-size-base;
}
.cell-input-view-list-btn{
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	padding-bottom: 5px;
	margin-top: 5px;
}
.delbtn{
	margin-left: 20px;
	background: #FFFFFF;
	color: #FEC7CE;
	border-color: #FEC7CE;
	border-width: 1px;
	border-style: solid;
}
.checkbtnOK{
	background: #FFFFFF;
	color: #4EC365;
	border-color: #4EC365;
	border-width: 1px;
	border-style: solid;
}
.checkbtnError{
	background: #FFFFFF;
	color: #FF0000;
	border-color: #FF0000;
	border-width: 1px;
	border-style: solid;
}
.time-view{
	display: flex;
	flex-direction: column;
	font-size: $uni-font-size-sm;
	color: $uni-text-color-gray;
	border-bottom:  1px solid $uni-line-color;
}
.time-view-lab{
	display: flex;
	flex: 1;
	flex-direction: row;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	align-items: center;
	justify-content: flex-start;
}
.time-view-lab-left{
	display: flex;
	flex: 1;
	margin:5px 0px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.time-view-lab-right{
	width: 20px;
	text-align: right;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
</style>
