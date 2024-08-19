<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="cell-input-view">
			<view class="cell-input-view-left"><text>是否接受一下消息提醒(不勾选消息也会出现在消息列表中,但不会出现消息推送)</text></view>
		</view>
		<list>
			<cell v-for="(item, index) in dataList" :key="index">
				<view class="cell-input-view" @click="changeAllCheckBox(index, item)">
					<mycheckbox 
					:checked="item.enable" 
					class="checkbox" 
					color="#E60000" 
					/>
					<view class="cell-input-view-left">
						<text>{{ item.messageName }}</text>
					</view>
				</view>
				<view class="lineView" />
				<view style="margin-left: 20px;" v-for="(nextitem, nextindex) in item.itemList" :key="nextindex">
					<view class="cell-input-view" @click="changeItemCheckBox(index, item, nextindex, nextitem)">
						<mycheckbox 
						:checked="nextitem.enable" 
						class="checkbox" 
						color="#E60000" 
						/>
						<view class="cell-input-view-left">
							<text>{{ nextitem.messageName }}</text>
						</view>
					</view>
					<view v-if="dataList.length != index + 1" class="lineView" />
				</view>
				<view class="lineView" />
			</cell>
		</list>
		<view style="width: 100%;height: 80px;" />
		<view class="bottom-view">
			<view class="bottom-text-view" @click="clicksave"><text>确定</text></view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			righticon: 'iconarrow-right',
			dataList: []
		};
	},
	onLoad(option) {
		uni.getStorage({
			key: this.$savekey.USER_INFO_MEG,
			success: (res) => {
				uni.showLoading();
				this.loadData(res.data.id);
			}
		});
	},
	methods: {
		//保存
		clicksave() {
			uni.hideLoading();
			let list = [];
			this.dataList.forEach((o)=>{
				let itemList = o.itemList;
				console.log(JSON.stringify(itemList));
				list = list.concat(itemList);
			})
			this.$network.getData(this.$url.USERINFO_NOTICE_SAVE, 'POST', list).then(result => {	
				uni.navigateBack({
					animationDuration:200
				})
				uni.showToast({
					icon:"none",
					title:"保存成功"
				})
			}).catch(err => {
				uni.showToast({
					icon:"none",
					title:err.msg
				})
			});
		},
		loadData(userid) {
			uni.hideLoading();
			this.$network.getData(this.$url.USERINFO_NOTICE_LIST, 'GET', null).then(result => {	
				this.dealData(result,userid)
				uni.hideLoading();
			}).catch(err => {
				this.dataList = [];
				uni.showToast({
					image:"none",
					title:err.message
				})
			});
		},
		dealData(result,userid){
			if(result.length > 0){
				let dict = {};
				result.forEach((o)=>{
					let typeName = o.typeName;
					let newo = {
						...o,
						userId:userid
					}
					if(dict[typeName]){
						dict[typeName].push(newo)
					}else{
						dict[typeName] = [newo]
					}
				})
				let keyArr = Object.keys(dict);
				this.dataList = keyArr.map((o)=>{
					return {
						messageName:o,
						itemList:dict[o],
						enable:this.isallChoose(dict[o])
					}
				})
				console.log(JSON.stringify(this.dataList));
			}else{
				this.dataList = [];
			}
		},
		changeAllCheckBox(index, item) {
			let list = item.itemList.map(o => {
				return {
					...o,
					enable: !this.dataList[index].enable
				};
			});
			let newitem = {
				...item,
				itemList: list,
				enable: this.isallChoose(list)
			};
			this.dataList.splice(index,1,newitem)
		},
		changeItemCheckBox(index,item,nextindex,nextitem){
			let list = [...item.itemList];
			let newnextitem = {
				...nextitem,
				enable:!nextitem.enable
			}
			list[nextindex] = newnextitem;
			let newitem = {
				...item,
				itemList: [...list],
				enable: this.isallChoose(list)
			};
			this.dataList.splice(index,1,newitem)
		},
		isallChoose(list){
			return list.every((o)=>{
				return o.enable === true
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	display: flex;
	flex-direction: column;
	width: 100%;
	background: #ffffff;
}
.cell-input-view {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	margin: 10px;
	background: #ffffff;
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
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.checkbox {
	transform: scale(0.8);
}
.lineView {
	flex: 1;
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
.bottom-text-view {
	display: flex;
	flex: 1;
	height: 40px;
	border-radius: 20px;
	background: $uni-color-primary;
	font-size: $uni-font-size-lg;
	color: $uni-bg-color-grey;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
	margin-left: 10px;
}
</style>
