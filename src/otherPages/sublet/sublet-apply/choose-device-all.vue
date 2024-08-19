<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="page-body">
			<list>
				<cell>
					<view v-for="(item, i) in types" :key="i" class="item-container">
						<view class="item-top">
							<view class="item-title">{{ item.typeName }}&nbsp;-&nbsp;{{ item.heightName || '' }}</view>
							<view class="top-right">
								<checkbox-group @change="changeType($event, i, item)">
									<label>
										<checkbox 
										class="checkbox" 
										:checked="item.checked" 
										color="#E60000" 
										:value="i"
										/>
									</label>
								</checkbox-group>
								<i
									class="iconfont iconarrow-right"
									:class="item.isExpand ? 'translate-arrow' : 'translate-arrow-expend'"
									style="{margin-right: 0px;}"
									@click="openMachineList(i)"
									ref="expandArrow"
								>
									
								</i>
							</view>
						</view>
						<view v-if="item.isExpand">
							<checkbox-group @change="changeMachineItem($event, i)" class="item-machine-list">
								<label class="l-item" v-for="(m, pos) in item.list" :key="pos">
									<checkbox class="checkbox" :checked="m.checked" color="#E60000" :value="pos" />
									<view>{{ m.brand }}/{{ m.name }}</view>
								</label>
							</checkbox-group>
						</view>
					</view>
				</cell>
			</list>
		</view>
		<view class="bottom-view">
			<view class="bottom-n-view" @click="changeAll">
				<mycheckbox class="totalNum" color="#E60000" :checked="isAllChecked" >全选</mycheckbox>
				<view class="finsih-btn" @click="finishChoose">选好了</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	components: {},
	data() {
		return {
			types: [],
			selectMachine: [], //选中设备列表
			isAllChecked: false
		};
	},
	onLoad(options) {
		let list = JSON.parse(decodeURIComponent(options.list))
		this.loadMachine(list);
	},
	methods: {
		//类型选择change
		changeType(e, i, item) {
			let selectedValue = e.detail.value;
			if (selectedValue.length > 0) {
				//选中某个类型和高度的数据
				this.types[i].checked = true;
			} else {
				//取消选中
				let list = this.types[i].list.map((o)=>{
					return {
						...o,
						checked:false,
					}
				})
				let dict = {
					...this.types[i],
					checked : false,
					list:list
				}
				this.types.splice(i,1,dict)
			}
			this.getChangeState();
		},
		getChangeState(){
			
		},
		openMachineList(i) {
			this.types[i].isExpand = !this.types[i].isExpand;
		},
		changeAll() {
			this.isAllChecked = !this.isAllChecked;
			this.types = this.types.map(o => {
				return {
					...o,
					list: o.list.map(y => {
						return {
							...y,
							checked: this.isAllChecked
						};
					}),
					checked: this.isAllChecked
				};
			});
		},
		//型号选择change
		changeMachineItem(e, i) {
			let selectedValue = e.detail.value;
			this.$datestr.printlog(e);
			if (selectedValue.length > 0) {
				this.types[i].checked = true;
			} else {
				this.types[i].checked = false;
			}
			this.types[i].list.map(l => {
				l.checked = false;
				return { ...l };
			});
			//标记选中的数据
			selectedValue.forEach(s => {
				this.types[i].list[Number(s)].checked = !this.types[i].list[Number(s)].checked;
			});
		},
		finishChoose() {
			let filterList = this.types.filter((item)=>{
				let list = item.list.filter((o)=>{
					return o.checked
				});
				return item.checked && list.length === 0
			})
			if(filterList.length > 0){
				uni.showToast({
					icon:"none",
					title:"品牌型号为必选项，请检查。。。"
				})
				return
			}
			this.dealData();
		},
		dealData(){
			let finishList = [];
			this.types.forEach((item)=>{
				let list = item.list;
				list.forEach((o)=>{
					if(o.checked){
						finishList.push(o)
					}
				})
			})
			uni.$emit('choose-device-emit', {
				list: finishList
			});
			uni.navigateBack({
				delta: 1
			});
		},
		//加载数据
		loadMachine(alldata) {
			uni.showLoading({
				mask: true
			});
			this.$network
				.getData(this.$url.MACHINE_BRAND_HEIGTH_LIST, 'GET', null)
				.then(result => {
					this.types = [];
					this.$datestr.printlog(JSON.stringify(result));
					result.forEach(o => {
						if (!this.types.some(y => y.height === o.height && y.type === o.type)) {
							let objs = result.filter(y => y.height === o.height && y.type === o.type);
							objs = objs.map(x => {
								x.checked = alldata.some(g => {return g.machineType===x.id});
								return { 
									...x 
								};
							});
							this.types = [
								...this.types,
								{
									type: o.type,
									typeName: o.typeName,
									height: o.height,
									heightName: o.heightName,
									isExpand: true,
									checked: objs.some(g => {return g.checked}),
									list: objs
								}
							];
						}
					});
					this.types.sort(function(x, y) {
						if (x.type < y.type) {
							return -1;
						}
						if (x.type > y.type) {
							return 1;
						}
						if (x.type == y.type) {
							if (x.height < y.height) {
								return -1;
							}
							if (x.height > y.height) {
								return 1;
							}
						}
						return 0;
					});
					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.page-body {
	flex:1;
	overflow: auto;
}

.item-container {
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	margin: 8px;
	border-radius: 4px;
}

.item-top {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border-width: 0px 0px 1px 0px;
	border-color: $uni-bg-color-grey;
	border-style: solid;
	align-items: center;
}

.item-title {
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	padding: 10px;
}

.top-right {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.checkbox {
	transform: scale(0.7);
}

.translate-arrow {
	font-size: 16px;
	margin-right: 16px;
	transform: rotate(-90deg);
	transition: all 500ms;
}

.translate-arrow-expend {
	font-size: 16px;
	margin-right: 16px;
	transform: rotate(90deg);
	transition: all 500ms;
}

.item-machine-list {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	padding: 8px;
}

.l-item {
	display: flex;
	flex-direction: row;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	margin-right: 16px;
}

.bottom-view {
	bottom: 0;
	width: 100%;
	height: 60px;
	background: $uni-bg-color-grey;
	z-index: 100;
	background-color: #ffffff;
}

.bottom-n-view {
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-top: 5px;
	padding: 0px 16px;
	margin-bottom: 5px;
}

.totalNum {
	width: 80px;
	text-align: center;
	color: $uni-text-color;
	font-weight: bold;
	font-size: $uni-font-size-lg;
}

.finsih-btn {
	flex: 1;
	height: 40px;
	text-align: center;
	font-size: $uni-font-size-lg;
	line-height: 40px;
	color: #ffffff;
	align-self: center;
	background: $uni-color-primary;
	border-radius: 5px;
}
</style>
