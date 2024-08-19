<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<!-- <view class="cell-input-view" @click="changeCheckBox">
			<mycheckbox
			:checked="allClick" 
			class="checkbox" 
			/>
			<view class="cell-input-view-left">
				<text>{{ '全部' }}</text>
			</view>
		</view>
		<view class="lineView" /> -->
		<list>
			<cell v-for="(item, index) in dataList" :key="index">
				<view class="cell-input-view" @click="changeAllCheckBox(index, item)">
					<mycheckbox 
					:checked="item.checked" 
					class="checkbox" 
					color="#E60000" 
					/>
					<view class="cell-input-view-left">
						<text>{{ item.name }}</text>
					</view>
				</view>
				<view class="lineView" />
				<view style="margin-left: 20px;" v-for="(nextitem, nextindex) in item.child" :key="nextindex">
					<view class="cell-input-view" @click="changeItemCheckBox(index, item, nextindex, nextitem)">
						<mycheckbox 
						:checked="nextitem.checked" 
						class="checkbox" 
						color="#E60000" 
						/>
						<view class="cell-input-view-left">
							<text>{{ nextitem.name }}</text>
						</view>
					</view>
					<view v-if="item.child.length != nextindex + 1" class="lineView" />
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
	data() {
		return {
			righticon: 'iconarrow-right',
			dataList: [],
			allClick:true
		};
	},
	onLoad(option) {
		this.dataList = JSON.parse(decodeURIComponent(option.item))
		this.allClick = this.isallChoose(this.dataList)
	},
	methods: {
		//保存
		clicksave() {
			uni.hideLoading();
			let list = [];
			this.dataList.forEach((o)=>{
				let child = o.child || [];
				child.forEach((o)=>{
					list.push({
						bussDict: o.value,
						checked: o.checked
					})
				})
			})
			this.$network.getData(this.$url.MACHINE_LIVE_CIRCLE_SAVE, 'PUT', list).then(result => {	
				uni.navigateBack({
					animationDuration:200
				})
				uni.$emit('refresh-device-circle', {
				    list: this.dataList
				});
				uni.hideLoading()
			}).catch(err => {
				uni.showToast({
					icon:"none",
					title:err.msg
				})
			});
		},
		changeCheckBox(){
			this.allClick = !this.allClick
			this.dataList.forEach((item,index)=>{
				this.changeAllCheckBox(index, item, this.allClick)
			})
		},
		changeAllCheckBox(index, item,isall) {
			let list = item.child.map(o => {
				return {
					...o,
					checked: isall ? isall : !item.checked
				};
			});
			let newitem = {
				...item,
				child: list,
				checked: this.isclickChoose(list)
			};
			this.dataList.splice(index,1,newitem)
			this.allClick = this.isallChoose(this.dataList)
		},
		changeItemCheckBox(index,item,nextindex,nextitem){
			let list = [...item.child];
			let newnextitem = {
				...nextitem,
				checked:!nextitem.checked
			}
			list[nextindex] = newnextitem;
			let newitem = {
				...item,
				child: [...list],
				checked: this.isclickChoose(list)
			};
			this.dataList.splice(index,1,newitem)
			this.allClick = this.isallChoose(this.dataList)
		},
		isallChoose(list){
			let contactList = [];
			list.forEach(o=>{
				contactList = contactList.concat(o.child);
			})
			console.log(JSON.stringify(contactList))
			return contactList.every((o)=>{
				return o.checked === true
			})
		},
		isclickChoose(list){
			return list.some((o)=>{
				return o.checked === true
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
