<template>
	<view class="choose-bg-view">
		<list class="list-style">
			<cell class="cell-style" v-for="(item, index) in datalist" :key="index">
				<view class="celltop">
					<view class="cell-left-view">
						<view class="cell-view-part title-style">
							<text>自喷码:{{ item.printCode || '-' }}</text>
						</view>
						<view class="cell-view-part title-style">
							<text>车号:{{ item.licenseId || '--' }}</text>
						</view>
						<view class="cell-view-part title-style">
							<text>型号:{{ item.machineBrand + item.machineTypeName }}</text>
						</view>
						<view class="cell-view-part title-style">
							<text>点检状态:</text>
							<text :style="{ color: isall(item.storeCheckResults) ? '#4EC365' : '#FEC7CE' }">{{ isall(item.storeCheckResults) ? '正常' : '异常' }}</text>
						</view>
					</view>
					<view class="cell-right-view subtitle-style">
						<text @click="gotocheck(index, item)" v-if="isclick">一键点检</text>
						<i
							class="iconfont item-customdetail iconarrow-right"
							:id="item.isclosed ? 'translate-arrow' : 'translate-arrow-expend'"
							@click="closeorunclose(index, item)"
							ref="expandArrow"
						>
						</i>
					</view>
				</view>
				<view class="celltop" v-for="(itemcheck, indexcheck) in item.storeCheckResults" :key="indexcheck" v-if="item.isclosed" @click="changeAllCheckBox($event, index, item, indexcheck, itemcheck)">
					<view class="cell-left-view  title-style">
						<text>点检内容:{{ itemcheck.content || '' }}</text>
					</view>
					<view class="cell-right-view">
						<mycheckbox 
						:checked="itemcheck.checked" 
						class="checkbox" 
						color="#E60000" 
						:disabled="!isclick"/>
					</view>
				</view>
			</cell>
		</list>
		<view style="width: 100%; height: 80px;" />
		<view class="bottom-view" v-if = 'isclick'>
			<view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
			<view class="bottom-right-view" @click="clicksave"><text>确定</text></view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			contractList: [],
			datalist: [],
			machlist: [],
			isclick:true
		};
	},
	onLoad(options) {
		if(options.iscleck === 'false'){
			this.isclick = false;
		}
		this.machlist = JSON.parse(decodeURIComponent(options.machineList));
		if(this.machlist.length > 0){
			if(this.machlist[0].storeCheckResults != undefined && this.machlist[0].storeCheckResults.length > 0){
				let newpushlist = this.machlist.map(dict => {
					return { ...dict, isclosed: false };
				});
				this.datalist = newpushlist
			}else{
				this.getdata();	
			}
		}else{
		     this.getdata();	
		}
		
	},
	methods: {
		isall(checkalllist){
			return !checkalllist.some(o=> !o.checked);
		},
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
			let pushlist = list.map(o => {
				return {
					id: o.id,
					content: o.content,
					checked: true
				};
			});

			let newpushlist = this.machlist.map(dict => {
				return {
					...dict,
					storeCheckResults: [...pushlist],
					isclosed: false
				};
			});
			this.datalist = [...newpushlist];
			uni.hideLoading();
		},
		gotocheck(index, item) {
			let list = item.storeCheckResults;
			let pushlist = [];
			list.forEach(dict => {
				let itemdic = {
					...{
						id: dict.id,
						content: dict.content,
						checked: true
					}
				};
				pushlist.push(itemdic);
			});
			this.datalist[index].storeCheckResults = pushlist;
		},
		closeorunclose(index, item) {
			item.isclosed = !item.isclosed;
		},
		//可选
		changeAllCheckBox(e, index, dict, indexcheck, itemcheck) {
			if(this.isclick == false){
				return;
			}
			this.datalist = JSON.parse(JSON.stringify(this.datalist));
			this.datalist[index].storeCheckResults[indexcheck].checked = !this.datalist[index].storeCheckResults[indexcheck].checked;
		},
		clickecancle() {
			uni.navigateBack({
				delta: 1
			});
		},
		//确定按钮
		clicksave() {
			uni.$emit('choose-check-store-emit', {
				list: this.datalist
			});
			uni.navigateBack({
				animationDuration: 200
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.choose-bg-view {
	display: flex;
	flex-direction: column;
	flex: 1;
	background: $uni-bg-color-grey;
}
.list-style {
	display: flex;
	flex: 1;
	flex-direction: column;
}
.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	margin-left: 15px;
	margin-right: 15px;
	height: 45px;
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
.input-style {
	flex: 1;
	text-align: right;
}
.cell-style {
	display: flex;
	flex-direction: column;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
	border-bottom-width: 1px;
	margin-left: 10px;
	margin-right: 10px;
	background: #ffffff;
	padding-top: 10px;
	padding-bottom: 10px;
}
.celltop {
	display: flex;
	flex-direction: row;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
	border-bottom-width: 1px;
	background: #ffffff;
	padding-top: 10px;
	padding-left: 10px;
	padding-bottom: 10px;
}
.cell-left-view {
	display: flex;
	flex: 1;
	flex-direction: column;
}
.cell-right-view {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
}
.cell-view-part {
	display: flex;
	flex: 1;
	background: #ffffff;
	margin-left: 10px;
	justify-content: flex-start;
	margin: 5px;
}
.title-style {
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.subtitle-style {
	font-size: $uni-font-size-base;
	color: $uni-color-primary;
}
.checkbox {
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
.item-customdetail {
	align-items: center;
	justify-content: flex-end;
	margin-left: 20px;
}
#translate-arrow {
	font-size: 16px;
	margin-right: 16px;
	transform: rotate(-90deg);
	transition: all 1s;
}
#translate-arrow-expend {
	font-size: 16px;
	margin-right: 16px;
	transform: rotate(90deg);
	transition: all 1s;
}
</style>
