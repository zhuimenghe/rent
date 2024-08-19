<template>
	<view class="bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view">
			<searchHeader 
			:isExportList='isExportList' 
			@reset='reset' 
			@query="query" 
			@exportExcel="exportExcel"
			/>
		</view>
		<list style="margin-top: 40px;">
			<cell class="list-view-cell" v-for="(item,index) in dataList" :key="index">
				<view class="car-message-view">
					<view class="icon-car-right-top">
						<text style="margin-right: 5px;">{{item.printCode || "--"}}</text>|<text style="margin-left: 5px;">{{item.licenseId || "--"}}</text>
					</view>
					<!-- <view class="icon-car-right-bottom">
						<text>{{ item.machineTypeDesc || '--' }}&nbsp;|&nbsp;{{ item.machineHeightDesc || '--' }}&nbsp;|&nbsp;{{ item.machineBrand || '--' }}&nbsp;|&nbsp;{{item.machineTypeName || '--'}}</text>
					</view> -->
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>设备价值</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(item.machineValue).toString()}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>折旧年限(月)</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >{{item.depreciateNumber}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>折旧成本(元/月)</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(item.depreciatePrice).toString()}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>采购日期</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >{{getDate(item.purchaseTime)}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>已折旧成本</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(item.overDepreciatePrice).toString()}}</text>
						</view>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>剩余折旧成本</text></view>
					<view class="cell-input-view-right">
						<view class="cell-input-view-right">
							<text class="input-style" >¥{{moneyUtil.dealNumber(item.waitDepreciatePrice).toString()}}</text>
						</view>
					</view>
				</view>
				<view style="height: 1px;flex: 1;background: #EEEEEE;margin-top: 10px;" v-if="isShowAdd"/>
				<view style="display: flex;flex-direction: row;margin-bottom: 10px;justify-content: flex-end;"  v-if="isShowAdd">
					<view class="all-records-view" @click="upadataMsg(item,index)">
						<text>修改折旧年限</text>
					</view>
				</view>
			</cell>
			<cell>
				<uni-load-more iconType="auto" :status="morestatus" />
			</cell>
		</list>
		<view class="pop-container">
			<uni-popup ref="dialog" type="center" :mask-click="false">
				<view class="uni-tip">
					<!-- <view class="tip-title">修改折旧年限</view> -->
					<view class="tip-title">
						<text style="margin-right: 5px;">{{dialogData.printCode || "--"}}</text>|<text style="margin-left: 5px;">{{dialogData.licenseId || "--"}}</text>
					</view>
					<!-- <view class="row-item">
						<view class="row-tag">自喷码</view>
						<text class="pop-input">{{dialogData.printCode || '--'}}</text>
					</view>
					<view class="row-item">
						<view class="row-tag">车号</view>
						<text class="pop-input">{{dialogData.licenseId || '--'}}</text>
					</view> -->
					<view class="row-item">
						<view class="row-tag">折旧年限(月)<span style="color: #FF0000;">*</span></view>
						<input 
						class="pop-input" 
						type="number"
						v-model="dialogData.depreciateNumber" 
						placeholder="请输入折旧年限(月)..." 
						/>
					</view>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button pop-cancel" @click="cancelDialog">取消</text>
						<text class="uni-tip-button pop-confirm" @click="confirmDialog">确定</text>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import searchHeader from './property_search.vue'
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
export default {
	components: {
		uniLoadMore,
		searchHeader,
		uniPopup
	},
	data() {
		return {
			morestatus: 'more',
			page: 1,
			keyWord:'',
			dataList:[],
			selectList:[],
			isExportList: true,
			isShowAdd:true,
			dialogData:{},
			totalNum:'100'
		}
	},
	watch: {
		'dialogData.depreciateNumber'(val) {
			this.dialogData = {
				...this.dialogData,
				depreciateNumber: val
			};
			setTimeout(()=>{
				this.dialogData = {
					...this.dialogData,
					depreciateNumber: this.$gxfmethod.getIntString(val.toString())
				};
			}, 50);
		},
	},
	onPullDownRefresh() {
		this.headerrefresh()
	},
	onReachBottom() {
		this.footerrefresh();
	},
	onLoad() {
		uni.getStorage({
			key: this.$savekey.USER_PRIVILEGES_MEG,
			success: (res) => {
				this.isShowAdd = res.data.some(x => x.value === this.$savekey. PERMISSION_DEPRECIATION_DEVICE);
				// //this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
			}
		})
		uni.showLoading();
		this.loadData();
	},
	methods: {
		getDate(time) {
			if (!time) {
				return "--";
			}
			return time.split(/\s+/)[0];
		},
		upadataMsg(item,index){
			this.dialogData = {
				...item
			}
			this.$refs.dialog.open()
		},
		loadData(){
			let parame = {
				current: this.page, 
			    size: 10 ,
				keyWord:this.keyWord
			};
			this.$network.getData(this.$url.MACHINE_DEPRECIATION_LIST, 'POST', parame).then(result => {
				this.dataList = this.dataList.concat(result.records);
				let pages = result.pages;
				let total = result.total;
				if (pages <= this.page) {
					this.morestatus = 'noMore';
				} else {
					this.morestatus = 'more';
				}
				this.totalNum = result.total.toString()
				uni.stopPullDownRefresh();
				uni.hideLoading();
			}).catch(err => {
				this.morestatus = 'noMore';
				uni.stopPullDownRefresh();
				uni.hideLoading();
			});
		},
		headerrefresh() {
			this.page = 1;
			this.dataList = [];
			this.loadData();
		},
		footerrefresh() {
			if (this.morestatus == 'noMore') {
				return;
			}
			this.page += 1;
			this.morestatus = 'loading';
			this.loadData();
		},
		cancelDialog(){
			this.$refs.dialog.close()
		},
		confirmDialog(){
			if(this.dialogData.depreciateNumber  == undefined){
				uni.showToast({
					icon:'none',
					title:"请输入折旧期限"
				})
				return;
			}
			if(parseFloat(this.dialogData.depreciateNumber)  <= 0){
				uni.showToast({
					icon:'none',
					title:"折旧期限必须大于0"
				})
				return;
			}
			//保存
			uni.showModal({
				title: '提示',
				content: "是否修改折旧期限?",
				success: res => {
					if (res.confirm) {
						uni.showLoading();
						let param = {
							"licenseId": this.dialogData.licenseId,
							"depreciateNumber": this.dialogData.depreciateNumber,		
						}
						this.$network.getData(this.$url.MACHINE_DEPRECIATION_UPDATE, 'POST', param).then(result => {
							uni.showToast({
								icon: 'none',
								title: "修改成功",
							});	
							setTimeout(()=>{
								this.headerrefresh();
								this.$refs.dialog.close()
							}, 100);
						}).catch(err => {
							this.$refs.dialog.close()
							uni.showToast({
								icon: 'none',
								title: err.message,
								duration: 1500
							});	
						});
					}
				},
			});
		},
		reset(val) {},
		query(val) {
			this.keyWord = val.searchKey;
			this.headerrefresh();
		},
		exportExcel() {
			uni.showLoading({
				title: '正在下载中,请稍等...',
				mask: true,
			})
			let param = {
				current : 1,
				size : this.totalNum,
				keyWord:this.keyWord
			};
			let url = this.$gxfmethod.getUrl(this.$url.MACHINE_DEPRECIATION_LIST)
			console.log(url)
			let filename = this.$gxfmethod.getFileName("折旧成本列表-")
			this.$gxfmethod.downFunc(url, 'POST', param, filename)
		}
	}
};
</script>

<style lang="scss" scoped>
.bg-view {
	display: flex;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}	
.list-view-cell{
	display: flex;
	width: 100%;
	flex-direction: column;
	background: #FFFFFF;
	margin-top: 5px;
	border-bottom-color: #EEEEEE;
	border-bottom-width: 1px;
	border-bottom-style: solid;
}
.car-message-view {
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: flex-start;
	padding: 10px;
	font-size: $uni-font-size-base;
	border-bottom-color: #EEEEEE;
	border-bottom-width: 1px;
	border-bottom-style: solid;
}
.icon-car-right-top{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	margin-left: 10px;
}
.icon-car-right-bottom{
	display: flex;
	margin-top: 5px;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
	margin-left: 10px;
}
.icon-car-right-top-arrow{
	font-size: 15px;
	margin-left: 10px;
	color: $uni-text-color-gray;
}
.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	margin: 5px 10px;
	font-size: $uni-font-size-base;
}
.cell-input-view-left {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-base;
}
.cell-input-view-right {
	display: flex;
	flex: 1;
	margin-left: 15px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.input-style {
	flex: 1;
	text-align: right;
	font-size: $uni-font-size-base;
}
.all-records-view{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	color: $uni-color-primary;
	font-size: $uni-font-size-base;
	margin-right: 10px;
	margin-top: 10px;
}
.top-view {
	z-index: 300;
	position: fixed;
	display: flex;
	flex-direction: column;
	width: 100%;
	top: 0;
	left: 0px;
	margin-bottom: 1px;
	background: #ffffff;
}
.pop-container {
	position: relative;
}

/* 提示窗口 */
.uni-tip {
	display: flex;
	flex-direction: column;
	padding: 15px;
	width: 300px;
	background-color: #fff;
	border-radius: 10px;
}

.tip-title {
	padding: 10px;
	border-width: 0px 0px 1px 0px;
	border-color: $uni-bg-color-grey;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-lg;
	font-weight: bold;
}

.row-item {
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 10px 0px;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	border-bottom: 1px solid $uni-bg-color-grey;
}

.row-tag {
	width: 98px;
	text-align: left;
}
	
.uni-tip-group-button {
	display: flex;
	flex-direction: row;
	margin-top: 20px;
}

.uni-tip-button {
	flex: 1;
	text-align: center;
	padding: 8px;
	font-size: $uni-font-size-base;
}

.pop-cancel {
	margin-right: 8px;
	color: $uni-text-color-gray;
	background: $uni-bg-color-grey;
	border-radius: 4px;
}

.pop-confirm {
	color: #FFFFFF;
	margin-left: 8px;
	background: $uni-color-primary;
	border-radius: 4px;
}
.pop-input {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	padding: 2px 6px;
}
</style>
