<template>
	<view class="choose-bg-view">
		<c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">选择设备</c-nav-bar-btns>
		<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
			<view class="cell-input-view-left"><text>已选设备({{contractList.length}}/{{dataDic.usedNum || '0'}})</text></view>
		</view>
		<list class="list-style">
			<cell class="cell-style" v-for="(item, index) in contractList" :key="index" @click="changeChoosedCheckBox($event, index, item)" >
				<view class="cell-left-view">
					<view class="cell-view-part title-style">
						<text>{{ item.printCode || '-' }}</text>
						<text style="margin-left: 5px;margin-right: 5px;">|</text>
						<text>{{ item.licenseId || '--' }}</text>
					</view>
					<view class="cell-view-part title-style" style="color: #999999;">
						<text>{{ item.typeName || '-' }}</text>
						<text style="margin-left: 5px;margin-right: 5px;">|</text>
						<text>{{ item.machineHeightName || '--' }}</text>
						<text style="margin-left: 5px;margin-right: 5px;">|</text>
						<text>{{ item.machineBrand || '-' }}</text>
						<text style="margin-left: 5px;margin-right: 5px;">|</text>
						<text>{{ item.machineTypeName || '--' }}</text>
					</view>
					<view class="cell-view-part title-style">
						<text style="flex: 1;">区域:{{ item.orgName || '--' }}</text>
						<text style="flex: 1;">保险状态:{{ item.insuranceStateName || '--' }}</text>
					</view>
					<view class="cell-view-part title-style">
						<text>当前位置:{{ item.address || '--' }}</text>
					</view>
					<view style="font-size: 10px;color: #F5222D; padding: 5px;" v-if='item.disabled'>
						<text>设备启用时间必须晚于上次退场时间【{{changestr(item.lastWorkOutDate)}}】</text>
					</view>
				</view>
				<view class="cell-right-view">
					<mycheckbox 
					:checked="item.checked" 
					class="checkbox" 
					color="#E60000" 
					/>
				</view>
			</cell>
		</list>
		<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
			<view class="cell-input-view-left"><text>可选设备</text></view>
		</view>
		<list class="list-style">
			<cell class="cell-style" v-for="(item, index) in datalist" :key="index">
				<view class="cell-left-view">
					<view class="cell-view-part title-style">
						<text>{{ item.printCode || '-' }}</text>
						<text style="margin-left: 5px;margin-right: 5px;">|</text>
						<text>{{ item.licenseId || '--' }}</text>
					</view>
					<view class="cell-view-part title-style" style="color: #999999;">
						<text>{{ item.typeName || '-' }}</text>
						<text style="margin-left: 5px;margin-right: 5px;">|</text>
						<text>{{ item.machineHeightName || '--' }}</text>
						<text style="margin-left: 5px;margin-right: 5px;">|</text>
						<text>{{ item.machineBrand || '-' }}</text>
						<text style="margin-left: 5px;margin-right: 5px;">|</text>
						<text>{{ item.machineTypeName || '--' }}</text>
					</view>
					<view class="cell-view-part title-style">
						<text style="flex: 1;">区域:{{ item.orgName || '--' }}</text>
						<text style="flex: 1;">保险状态:{{ item.insuranceStateName || '--' }}</text>
					</view>
					<view class="cell-view-part title-style">
						<text>当前位置:{{ item.address || '--' }}</text>
					</view>
					<view style="font-size: 10px;color: #F5222D; padding: 5px;" v-if='item.disabled'>
						<text>设备启用时间必须晚于上次退场时间【{{changestr(item.lastWorkOutDate)}}】</text>
					</view>
				</view>
				<view class="cell-right-view" @click="changeAllCheckBox($event, index, item)">
					<mycheckbox 
					:checked="item.checked" 
					:disabled="item.disabled" 
					class="checkbox" 
					@clickBox="changeAllCheckBox($event, index, item)"
					color="#E60000" 
					/>
				</view>
			</cell>
		</list>
		<view style="width: 100%; height: 80px;" />
		<view class="bottom-view">
			<view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
			<view class="bottom-right-view" @click="clicksave"><text>确定</text></view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	import filterView from '@/components/common/common-ui/filter-view.vue';
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import timeCompare from '@/common/common-method/common-method.js';
	export default {
		components: {
			filterView,
			selectLabelItem
		},
		data() {
			return {
				"navBtns": [
						{
								"text": "筛选",
								"type": "none",
								"fontSize": "14px",
								"color": "#E60000"
						}
				],
				isarrow: false,
				heightDic: {},
				isfilter: false,
				contractList: [],
				datalist: [],
				page: 1,
				dataDic: {},
				isshow: true,
				filterHDic: {},
				filterTDic: {},
				printCode: '',
				isfiltercar: false,
				enableTime: '',
				choosecarlist: []
			};
		},
		onLoad(options) {
			// carlist
			this.dataDic = JSON.parse(decodeURIComponent(options.item));
			this.enableTime = options.enableTime;
			if (this.dataDic.machineList.length > 0) {
				this.heightDic = {
					label: this.dataDic.heightName,
					value: this.dataDic.height
				};
				let typestr = this.dataDic.type || '';
				let heightstr = this.dataDic.height || '';
				let machineType = this.dataDic.machineType || [];
				uni.showLoading()
				this.contractList = [...this.dataDic.machineList]
				this.getdata(typestr, heightstr, machineType, this.contractList);
			} else {
				this.getLeftCarList();
			}
			this.choosecarlist = JSON.parse(decodeURIComponent(options.carlist));
			uni.$on('filter-car-list', usnerinfo => {
				this.filterHDic = usnerinfo.height;
				this.filterTDic = usnerinfo.typelist;
				this.printCode = usnerinfo.printCode;
				this.isfiltercar = true;
				let machineType = [];
				this.filterTDic.map(o => {
					if (o.checked === true) {
						machineType.push(o.id);
					}
				});
				let typestr = this.dataDic.type || '';
				let heightstr = this.filterHDic.value || '';
				setTimeout(()=> {
					uni.showLoading()
					this.getdata(typestr, heightstr, machineType, this.contractList);
				}, 100);
			});
		},
		onUnload() {
			uni.$off('filter-car-list');
		},
		//下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.datalist = [];
			if (this.isfiltercar === true) {
				let machineType = [];
				this.filterTDic.map(o => {
					if (o.checked === true) {
						machineType.push(o.id);
					}
				});
				let typestr = this.dataDic.type || '';
				let heightstr = this.filterHDic.value || '';
				this.getdata(typestr, heightstr, machineType, this.contractList);
			} else {
				let typestr = this.dataDic.type || '';
				let heightstr = this.dataDic.height || '';
				let machineType = this.dataDic.machineType || [];
				this.getdata(typestr, heightstr, machineType, this.contractList);
			}
		},
		//上拉加载
		// onReachBottom() {
		// 	if (this.morestatus == 'noMore') {
		// 		return;
		// 	}
		// 	this.page += 1;
		// 	this.morestatus = 'loading';
		// 	this.getdata();
		// },
		methods: {
			onNavBarButtonTap() {
				if (this.isfiltercar === true) {
					uni.navigateTo({
						url: './check-car-filter?item=' +
							encodeURIComponent(JSON.stringify(this.dataDic)) +
							'&height=' +
							encodeURIComponent(JSON.stringify(this.filterHDic)) +
							'&type=' +
							encodeURIComponent(JSON.stringify(this.filterTDic)) +
							'&printCode=' +
							encodeURIComponent(this.printCode) +
							'&isedit=true'
					});
				} else {
					uni.navigateTo({
						url: './check-car-filter?item=' + encodeURIComponent(JSON.stringify(this.dataDic))
					});
				}
			},
			changestr(time) {
				if (!time) return '';
				return time.split(/\s+/)[0];
			},
			getLeftCarList() {
				uni.showLoading();
				let url = this.$url.WorkIn_Left_Car + "?orderId=" + this.dataDic.id;
				console.log(url)
				this.$network
					.getData(url, 'GET', null)
					.then(result => {
						this.heightDic = {
							label: this.dataDic.heightName,
							value: this.dataDic.height
						};
						let typestr = this.dataDic.type || '';
						let heightstr = this.dataDic.height || '';
						let machineType = this.dataDic.machineType || [];
						uni.showLoading()
						this.getdata(typestr, heightstr, machineType, result);
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			chooseH() {
				this.isarrow = !this.isarrow;
			},
			getdata(typestr, heightstr, machineType, canlist) {
				let param = {
					current: this.page,
					size: "10000",
					state: "1",
					type: typestr,
					height: heightstr,
					machineType: machineType,
					keyword: this.printCode
				};
				this.$network
					.getData(this.$url.WORK_IN_CARCHOOSE_NEW, 'POST', param)
					.then(result => {
						let list = result.records;
						this.changeListToCheck(list, canlist);
						uni.stopPullDownRefresh();
					})
					.catch(err => {
						this.datalist = [];
						this.morestatus = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			changeListToCheck(list, canlist) {
				let pushlist = list.map(dict => {
					return {
						...dict,
						brand: dict.machineBrand,
						checked: false,
					};
				});
				this.resetNetData(pushlist, canlist);
			},
			resetNetData(alllist, partlist) {
				let allDeviceList = [...alllist]
				partlist.forEach(dict => {
					if(alllist.some((o)=>{return o.licenseId === dict.licenseId}) === false){
						allDeviceList.unshift({
							...dict,
						})
					}
				});
				let contractArr = [];
				let allArr = [];
				allDeviceList.forEach(dict => {
					if(partlist.some((o)=>{return o.licenseId === dict.licenseId})  && !(dict.lastWorkOutDate && timeCompare.timedifferent(this.enableTime, this.changestr(dict.lastWorkOutDate)) !==1)){
						let itemDic = {
							...dict,
							checked:true,
							disabled: (dict.lastWorkOutDate && timeCompare.timedifferent(this.enableTime, this.changestr(dict.lastWorkOutDate)) !==
									1) ? true : false
						}
						contractArr.push(itemDic);
					}else{
						let itemDic = {
							...dict,
							checked:false,
							disabled: (dict.lastWorkOutDate && timeCompare.timedifferent(this.enableTime, this.changestr(dict.lastWorkOutDate)) !==
									1) ? true : false
						}
						allArr.push(itemDic);
					}
				});
				this.contractList = [...contractArr]
				let filterAllArr = [];
				allArr.forEach((a)=>{
					if(this.choosecarlist.every((o)=>{return o.licenseId != a.licenseId})){
						filterAllArr.push(a)
					}
				})
				this.datalist = [...filterAllArr];
				setTimeout(()=>{
					uni.hideLoading();
				}, 100);
			},
			//已选中
			changeChoosedCheckBox(e, index, dict) {
				let itemdic = {
					...dict,
					checked: !dict.checked,
				};
				if (dict.checked === true) {
					this.datalist.push(itemdic);
					this.contractList.splice(index, 1);
				}
			},
			//可选
			changeAllCheckBox(e, index, dict) {
				let itemdic = {
					...dict,
					checked: !dict.checked
				};
				if (dict.checked === false) {
					this.contractList.push(itemdic);
					this.datalist.splice(index, 1);
				}
			},
			clickecancle() {
				uni.navigateBack({
					delta: 1
				});
			},
			//确定按钮
			clicksave() {
				let count = this.dataDic.usedNum || 0;
				// if (this.contractList.length > count) {
				// 	uni.showToast({
				// 		icon: 'none',
				// 		title: '选择设备数量不能超过申请数量'
				// 	});
				// 	return;
				// }
				uni.$emit('choose-workincar-emit', {
					list: this.contractList
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
		flex-direction: row;
		border-bottom-color: #eeeeee;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		margin-left: 10px;
		margin-right: 10px;
		background: #ffffff;
		padding-top: 5px;
		padding-bottom: 5px;
	}

	.cell-left-view {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.cell-right-view {
		display: flex;
		width: 50px;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
	}

	.cell-view-part {
		display: flex;
		flex-direction: row;
		background: #ffffff;
		margin:5px 10px 0px 10px;
		justify-content:flex-start;
	}

	.title-style {
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.subtitle-style {
		font-size: $uni-font-size-base;
		color: $uni-text-color-gray;
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

	.filter-top-view {
		position: fixed;
		direction: ltr;
		top: 0;
		height: 50px;
		left: 0;
		right: 0;
		z-index: 100;
		background: #E60000;
		overflow: hidden;
	}

	.search-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		margin-bottom: 1px;
		width: 50%;
		float: left;
		box-sizing: border-box;
	}

	.search-box {
		background: #F7F7F7;
		height: 35px;
		flex: 1;
		line-height: 35px;
		display: flex;
		margin: 8px 5px;
		flex-direction: row;
		padding-left: 5px;
		border-radius: 4px;
		justify-content: flex-start;
		align-items: center;
	}

	.search-icon {
		color: #999999;
		font-size: $uni-font-size-base;
		margin-right: 5px;
	}

	.search-content {
		display: flex;
		flex: 1;
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 5px;
		margin-right: 10px;
	}

	.filter-view-style {
		height: 35px;
		display: flex;
		background: #eeeeee;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		border-radius: 5px;
	}

	#translate-arrow {
		font-size: 16px;
		margin-right: 16px;
		transform: rotate(-90deg);
		transition: all 0.5s;
	}

	#translate-arrow-expend {
		font-size: 16px;
		margin-right: 16px;
		transform: rotate(90deg);
		transition: all 0.5s;
	}
</style>
