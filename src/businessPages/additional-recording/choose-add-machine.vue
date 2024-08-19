<template>
	<view class="choose-bg-view">
		<view class="filter-top-view">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input style="flex: 1;font-size: 14px;" placeholder="请输入自喷码或者车号" v-model="printCode" />
				</view>
			</view> 
			<view class="search-view-style" @click="searchTo">
				<text>搜索</text>
			</view>
			<view class="filter-view-style" @click="gotofilter">
				<text>筛选</text>
			</view>
		</view>
		<list class="list-style">
			<view class="cell-style" v-for="(item, index) in datalist" :key="index" @click="changeAllCheckBox(index, item)" v-if = '!item.disabled'>
				<view class="cell-left-view">
					<view class="cell-view-part title-style">
						<text>{{ item.printCode || '-' }}</text>|<text>{{ item.licenseId || '--' }}</text>
					</view>
					<view class="cell-view-part subtitle-style">
						<text>{{item.brand || "--"}}-{{ item.machineTypeName || '--' }}</text>|<text>{{ item.orgName || '--' }}</text>|<text>{{ item.insuranceStateName || '--' }}</text>
					</view>
					<view class="cell-view-part title-style">
						<text>当前位置:{{ item.address || '--' }}</text>
					</view>
				</view>
				<view class="cell-right-view">
					<mycheckbox 
					:checked="item.checked" 
					:disabled="item.disabled" 
					class="checkbox" 
					color="#E60000" 
					/>
				</view>
			</view>
			<cell><uni-load-more iconType="auto" :status="morestatus" /></cell>
		</list>
		<view style="width: 100%; height: 80px;" />
		<view class="bottom-view">
			<view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
			<view class="bottom-right-view" @click="clicksave"><text>确定({{choosecarlist.length}})</text></view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	import filterView from '@/components/common/common-ui/filter-view.vue';
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			filterView,
			selectLabelItem,
			uniLoadMore
		},
		data() {
			return {
				morestatus: 'more',
				choosecarlist: [],
				datalist: [],
				allcarlist:[],
				page: 1,
				
				dataDic: {},
				isshow: true,
				
				heightDic: {},
				isfilter: false,
				filterHDic: {},
				filterTDic: [],
				printCode: '',
				isfiltercar: false,
				
			};
		},
		onLoad(options) {
			// carlist
			this.dataDic = JSON.parse(decodeURIComponent(options.item));
			this.heightDic = {
				label: this.dataDic.heightName,
				value: this.dataDic.height
			};
			let typestr = this.dataDic.type || '';
			let heightstr = this.dataDic.height || '';
			let machineType = this.dataDic.machineType || [];
			uni.showLoading()
			this.choosecarlist = this.dataDic.machineList || [];
			let allList = JSON.parse(decodeURIComponent(options.carlist));
			allList.forEach((o)=>{
				if(!this.choosecarlist.some(e=>{return e.licenseId === o.licenseId})){
					this.allcarlist.push(o);
				}
			})
			// this.allcarlist = JSON.parse(decodeURIComponent(options.carlist));
			this.getdata(typestr, heightstr, machineType);
			//筛选
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
					this.page = 1;
					this.datalist = [];
					this.getdata(typestr, heightstr, machineType);
				}, 100);
			});
		},
		onUnload() {
			uni.$off('filter-car-list');
		},
		onNavigationBarButtonTap() {
			this.isshow = !this.isshow;
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
				this.getdata(typestr, heightstr, machineType);
			} else {
				let typestr = this.dataDic.type || '';
				let heightstr = this.dataDic.height || '';
				let machineType = this.dataDic.machineType || [];
				this.getdata(typestr, heightstr, machineType);
			}
		},
		//上拉加载
		onReachBottom() {
			if (this.morestatus == 'noMore') {
				return;
			}
			this.page += 1;
			this.morestatus = 'loading';
			if (this.isfiltercar === true) {
				let machineType = [];
				this.filterTDic.map(o => {
					if (o.checked === true) {
						machineType.push(o.id);
					}
				});
				let typestr = this.dataDic.type || '';
				let heightstr = this.filterHDic.value || '';
				this.getdata(typestr, heightstr, machineType);
			} else {
				let typestr = this.dataDic.type || '';
				let heightstr = this.dataDic.height || '';
				let machineType = this.dataDic.machineType || [];
				this.getdata(typestr, heightstr, machineType);
			}
		},
		onNavigationBarButtonTap() {
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
					url: './check-car-filter?item=' + encodeURIComponent(JSON.stringify(this.dataDic)) + '&printCode=' +
						encodeURIComponent(this.printCode)
				});
			}
		},
		methods: {
			searchTo(){
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
					this.getdata(typestr, heightstr, machineType);
				} else {
					let typestr = this.dataDic.type || '';
					let heightstr = this.dataDic.height || '';
					let machineType = this.dataDic.machineType || [];
					this.getdata(typestr, heightstr, machineType);
				}
			},
			gotofilter(){
				if (this.isfiltercar === true) {
					uni.navigateTo({
						url: '/businessPages/workin/check-car-filter?item=' +
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
						url: '/businessPages/workin/check-car-filter?item=' + encodeURIComponent(JSON.stringify(this.dataDic)) + '&printCode=' +
							encodeURIComponent(this.printCode)
					});
				}
			},
			changestr(time) {
				if (!time) return '';
				return time.split(/\s+/)[0];
			},
			getdata(typestr, heightstr, machineType) {
				let param = {
					current: this.page,
					size: 20,
					type: typestr,
					height: heightstr,
					machineType: machineType,
					keyword: this.printCode,
					ignoreState: true
				};
				this.$network
					.getData(this.$url.WORK_INOUT_CARCHOOSE, 'POST', param)
					.then(result => {
						let records = result.records.map((o)=>{
							return {
								...o,
								checked: false,
							}
						});
						let pages = result.pages;
						if (pages <= this.page) {
							this.morestatus = 'noMore';
						} else {
							this.morestatus = 'more';
						}
						this.datalist = this.datalist.concat(records)
						this.changeListToCheck();
						uni.stopPullDownRefresh();
					})
					.catch(err => {
						this.datalist = [];
						this.morestatus = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			changeListToCheck() {
				this.datalist = this.datalist.map(o=>{
					return{
						...o,
						machineTypeName:o.typeName,
						checked: this.choosecarlist.some(a=>{return o.licenseId === a.licenseId}),
						disabled :!this.allcarlist.every((a)=>{return o.licenseId != a.licenseId})
					}
				})
				uni.hideLoading();
			},
			//可选
			changeAllCheckBox(index, dict) {
				let itemdic = {
					...dict,
					checked: !dict.checked
				};
				this.datalist.splice(index, 1,itemdic);
				this.Removerepetition(dict,itemdic.checked)
			},
			Removerepetition(item,isadd){
				if(isadd){
					this.choosecarlist.push(item)
				}else{
					let index = this.choosecarlist.findIndex((o)=>{
						return o.licenseId === item.licenseId
					})
					this.choosecarlist.splice(index,1)
				}
			},
			clickecancle() {
				uni.navigateBack({
					delta: 1
				});
			},
			//确定按钮
			clicksave() {
				uni.$emit('choose-workincar-emit', {
					list: this.choosecarlist
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
		margin-top: 50px;
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
		background: #ffffff;
		margin:5px 10px;
		flex-direction: row;
		line-height: 16px;
	}

	.title-style {
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.subtitle-style {
		font-size: $uni-font-size-sm;
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
		display: flex;
		flex-direction: row;
		top: 0;
		height: 50px;
		left: 0;
		right: 0;
		z-index: 100;
		background: #FFFFFF;
		overflow: hidden;
		align-items: center;
		justify-content: flex-start;
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
		background: #eeeeee;
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

	.search-view-style {
		height: 35px;
		display: flex;
		background: $uni-color-primary;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		border-radius: 5px;
		font-size: $uni-font-size-base;
		color: #FFFFFF;
		padding-left: 10px;
		padding-right: 10px;
	}
	.filter-view-style {
		height: 35px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		border-radius: 5px;
		font-size: $uni-font-size-base;
		color: #222222;
		padding-left: 10px;
		padding-right: 10px;
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
