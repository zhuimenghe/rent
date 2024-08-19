<template>
	<view class="machine-fence-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="list-bg-view">
			<list>
				<cell v-for="(item,index) in datalist" :key="index" class="topfence-detail">
					<view class="topfence-detail-input-view">
						<view class="topfence-detail-left">
							<text>{{"车号 "+ item.licenseId}}</text>
						</view>
						<view class="topfence-detail-right" style="color: #E60000;">
							<text class="topfence-detail-input-style">{{ item.stateName || '-'}}-{{item.subStateName || '-'}}</text>
						</view>
					</view>
					<view class="topfence-detail-input-view">
						<view class="topfence-detail-left"><text>型号</text></view>
						<view class="topfence-detail-right">
							<text class="topfence-detail-input-style">{{ item.machineBrand || '-'}}{{item.machineTypeName || '-'}}</text>
						</view>
					</view>
					<view class="topfence-detail-input-view">
						<view class="topfence-detail-left"><text>自喷码</text></view>
						<view class="topfence-detail-right">
							<text class="topfence-detail-input-style">{{ item.printCode || '-' }}</text>
						</view>
					</view>
					<view class="topfence-detail-input-view">
						<view class="topfence-detail-left"><text>区域</text></view>
						<view class="topfence-detail-right">
							<text class="topfence-detail-input-style">{{ item.orgName || '-' }}</text>
						</view>
					</view>
					<view class="topfence-detail-input-view">
						<view class="topfence-detail-left"><text>当前位置</text></view>
						<view class="topfence-detail-right">
							<text class="topfence-detail-input-style">{{ item.address || '-' }}</text>
						</view>
					</view>
					<view class=".topfence-detail-bottom-view" @click="changeAllCheckBox(item,index)" >
						<mycheckbox
						:checked="item.checked" 
						class="checkbox" 
						color="#E60000" />
					</view>
				</cell>
			</list>
		</view>
		<view class="bottom-view">
			<view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
			<view class="bottom-right-view" @click="clicksave"><text>确定</text></view>
		</view>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
export default{
	components:{
		uniLoadMore
	},
	data() {
		return {
			datalist:[],
			dataDic:{},
		}
	},
	onLoad(option){
		this.dataDic = JSON.parse(option.item); 
		uni.showLoading()
		this.loadMachionList();
	},
	methods:{
		loadMachionList(){
			let param={
				fenceId:this.dataDic.id
			}
			this.$network
				.getData(this.$url.MACHINE_FENCE_MACHINE_LIST, 'POST', param)
				.then(result => {
					this.resetListWihtUse(result);
				})
				.catch(err => {
					uni.showToast({
						title:"服务端异常, 请稍后再试",
						icon:"none"
					})
					uni.hideLoading();
				});
		},
		resetListWihtUse(list){
			let filterList = list.map((dict)=>{
				return {
					id:dict.id,
					licenseId:dict.licenseId,
					stateName:dict.stateName,
					subStateName:dict.subStateName,
					machineBrand:dict.machineBrand,
					machineTypeName:dict.machineTypeName,
					printCode:dict.printCode,
					orgName:dict.orgName,
					locationName:dict.locationName,
					address:dict.address,
					checked:false
				}
			})
			this.datalist = this.datalist.concat(filterList);
			uni.stopPullDownRefresh();
			uni.hideLoading();
		},
		changeAllCheckBox(item,index){
			this.datalist[index].checked = !this.datalist[index].checked;
		},
		clickecancle(){
			uni.navigateBack({
				delta: 1
			});
		},
		clicksave(){
			let chooseArr = this.datalist.filter((item)=>{
				return item.checked === true
			})
			if(!chooseArr||chooseArr.length<=0){
				uni.showToast({
					title:"请至少选择一个设备",
					icon:"none"
				})
				return;
			}
			let idarr = chooseArr.map((dict)=>{
				return dict.id;
			})
			let params = {
				fenceId: this.dataDic.id,
				machineIdList: idarr,
				unbind: true
			}
			let urlstr = this.$url.MACHINE_FENCE_BINDING
			this.$network
				.getData(urlstr, 'POST', params)
				.then(result => {
					uni.showToast({
						title:"解绑成功",
						icon:"none"
					})
					uni.$emit('refresh-fence', {
						type:"temp"
					});
					uni.$emit('refreshData-fence', {
						list: this.datalist
					});
					this.clickecancle();
				})
				.catch(err => {
					this.$datestr.printlog()
					uni.showToast({
						title:"服务端异常, 请稍后再试",
						icon:"none"
					})
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		},
	}
}
</script>

<style lang="scss" scoped>
.machine-fence-view{
	display: flex;
	flex-direction: column;
	background: $uni-bg-color-grey;
}
.list-bg-view{
	display: flex;
	flex-direction: column;
	background: #FFFFFF;
	margin-top: 10px;
	margin-bottom: 70px;
}
.topfence-detail{
	display: flex;
	width: 100%;
	flex-direction: column;
	background: #FFFFFF;
	border-bottom-style: solid;
	margin-top: 10px;
	border-bottom-color: #EEEEEE;
	border-bottom-width: 1px;
}
.topfence-detail-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	margin-left: 15px;
	margin-right: 15px;
	margin-top: 10px;
	font-size: $uni-font-size-base;
}
.topfence-detail-left {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.topfence-detail-right {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.topfence-detail-input-style {
	flex: 1;
	text-align: right;
}
.topfence-detail-bottom-view{
	display: flex;
	flex: 1;
	height: 50px;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	
}
.checkbox{
	margin-right: 10px;
	transform: scale(0.8);
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
