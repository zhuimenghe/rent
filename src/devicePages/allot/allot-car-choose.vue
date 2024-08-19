<template>
	<view class="choose-bg-view">
		<view class="top-search-view">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input placeholder="请输入自喷码或者设备号" v-model = "keyWord" />
				</view>
			</view>
			<view class="filter-view-style" @click="searchTo">
				<text>搜索</text>
			</view>
		</view>
		<list class="list-style">
			<view class="cell-style" v-for="(item, index) in datalist" :key="index" @click="changeChoosedCheckBox(index, item)" >
				<view class="cell-left-view">
					<view class="cell-view-part title-style">
						<text>车号:{{item.licenseId || "--"}}</text>
					</view>
					<view class="cell-view-part title-style">
						<text>型号:{{item.machineTypeName || "--"}}</text>
					</view>
					<view class="cell-view-part title-style">
						<text>自喷码:{{item.printCode || "-"}}</text>
					</view>
					<view class="cell-view-part title-style">
						<text>区域:{{item.orgName || "--"}}</text>
					</view>
					<view class="cell-view-part title-style">
						<text>状态:{{item.stateName || ""}}-{{item.subStateName || ""}}</text>
					</view>
					<view class="cell-view-part title-style">
						<text>当前位置:{{item.address || "--"}}</text>
					</view>
				</view>
				<view class="cell-right-view">
					<mycheckbox 
					:checked="item.checked" 
					class="checkbox"
					color="#E60000" 
					/>
				</view>
			</view>
			<view><uni-load-more iconType="auto" :status="morestatus" /></view>
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
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				contractList: [],
				datalist: [],
				page: 1,
				orgId: "",
				morestatus:"",
				keyWord:""
			};
		},
		onLoad(options) {
			if (options.machineList) {
				this.contractList = JSON.parse(decodeURIComponent(options.machineList));
			}
			this.orgId = options.orgId
			uni.showLoading();
			this.getdata();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.datalist = [];
			this.getdata();
		},
		//上拉加载
		onReachBottom() {
			console.log(this.morestatus)
			if (this.morestatus == 'noMore') {
				return;
			}
			this.page += 1;
			this.morestatus = 'loading';
			this.getdata();
		},
		methods: {
			searchTo(){
			  this.page = 1;
			  this.datalist = [];
			  this.getdata();
			},
			getdata() {
				let parame = {
					"current": this.page,
					"size": 20,
					"orgId": this.orgId,
					"state":"1",
					keyword:this.keyWord
				};
				this.$network.getData(this.$url.MACHINE_RECORD, "POST", parame).then((result) => {
					this.datalist = this.datalist.concat(result.records);
					this.changeListToCheck()
					let pages = result.pages;
					if (pages <= this.page) {
						this.morestatus = 'noMore';
					} else {
						this.morestatus = 'more';
					}
					uni.stopPullDownRefresh();
					uni.hideLoading();
				}).catch((err) => {
					this.morestatus = 'noMore';
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
			},
			changeListToCheck() {
				this.datalist.map((dict) => {
					return { 
						...dict,
						"checked": false,
					};
				});
				this.resetNetData()
			},
			resetNetData() {
				 this.datalist = this.datalist.map((item) => {
					if(this.contractList.some((o)=>{ return o.licenseId === item.licenseId })){
						return {
							...item,
							checked : true
						}
					}
					return {
						...item,
						checked : false
					}
				});
				uni.hideLoading();
			},
			//已选中
			changeChoosedCheckBox(index, dict) {
				let itemdic = { 
					...dict,
					"checked": !dict.checked
				};
				this.datalist.splice(index,1,itemdic)
				setTimeout(()=> {
					if(itemdic.checked){
						this.Removerepetition(itemdic,true)
					}else{
						this.Removerepetition(itemdic,false)
					}
				}, 10);
			},
			Removerepetition(item,isremove){
				if(isremove){
					this.contractList.push(item)
				}else{
					let index = this.contractList.findIndex((o)=>{
						return o.licenseId === item.licenseId
					})
					this.contractList.splice(index,1)
				}
			},
			clickecancle() {
				uni.navigateBack({
					delta: 1
				});
			},
			//确定按钮
			clicksave() {
				this.$datestr.printlog("clicksave" + JSON.stringify(this.contractList))
				uni.$emit('choose-allot-device', {
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
	.top-search-view{
		position: fixed;
		display: flex;
		flex-direction: row;
		height: 50px;
		width: 100%;
		background: #FFFFFF;
		justify-content: center;
		align-items: center;
		z-index: 991;
	}
	.search-box {
		background: #F7F7F7;
		height: 35px;
		flex: 1;
		line-height: 35px;
		display: flex;
		margin: 8px 16px;
		flex-direction: row;
		padding-left: 16px;
		border-radius: 4px;
		justify-content: flex-start;
		align-items: center;
	}
	.search-icon {
		color: #999999;
		font-size: $uni-font-size-base;
	}
	.search-content {
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 10px;
	}
	.filter-view-style{
		height: 35px;
		width: 60px;
		display: flex;
		background: #eeeeee;
		font-size: 15px;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		border-radius: 5px;
		z-index: 955;
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
		background: #FFFFFF;
		padding-top: 10px;
		padding-bottom: 10px;
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
</style>
