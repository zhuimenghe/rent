<template>
	<view class="creat-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle">
					<text>配件信息</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>型号:</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.partsStock ? dataDic.partsStock.partsBasics.modelName : "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>名称</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.partsStock ? dataDic.partsStock.partsBasics.name : "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>类别</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.partsStock ? dataDic.partsStock.partsBasics.category : "--"}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>适用范围</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.partsStock ? dataDic.partsStock.partsBasics.scopeApplication : "--"}}</text>
				</view>
			</view>
			<!-- <view class="cell-input-view">
				<view class="cell-input-view-left"><text>来源</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.partsStock ? dataDic.partsStock.partsSourceName : "--"}}</text>
				</view>
			</view>
			<text-label-item tagName="备注" :inputValue="dataDic.partsStock ?dataDic.partsStock.partsBasics.remark:'--'" :inputDisabled='true' tagColor="#999999"/> -->
		</view>
		<view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle">
					<text>入库记录(最近五次)</text>
				</view>
			</view>
			<view class="list-view-cell" v-for="(item, index) in dataDic.partsStorageLists" :key="index">
				<view class="cell-text">
					<view class="cell-text-left fontBlackcolor" style="color: #000000;">
						<view style="display: flex;flex: 1;flex-direction: column;">
							<view>
								<text>入库单号:{{ item.businessNo || '--' }}</text>
							</view>
						</view>
					</view>
					<view class="cell-text-right fontgreencolor">
						<text>{{ item.stateName || '--' }}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>区域</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.orgName || "--"}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>入库人</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.warehousesName || "--"}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>入库时间</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{changestr(item.storageTime)}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>数量</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.partsNumber || "0"}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>金额</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.partsAmount || "0"}}</text>
					</view>
				</view>
				<view style="display: flex;flex-direction: row;justify-content: flex-end;">
					<view class="bottom-text-right fontdetailcolor" @click="gotodetail('rk',item)">
						<text>详情</text>
					</view>
				</view>
				<view class="line-s" />
			</view>
		</view>
		<view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle">
					<text>出库记录(最近五次)</text>
				</view>
			</view>
			<view class="list-view-cell" v-for="(item, index) in dataDic.partsCollarLists" :key="index">
				<view class="cell-text">
					<view class="cell-text-left fontBlackcolor" style="color: #000000;">
						<view style="display: flex;flex: 1;flex-direction: column;">
							<view>
								<text>出库单号:{{ item.businessNo || '--' }}</text>
							</view>
						</view>
					</view>
					<view class="cell-text-right fontgreencolor">
						<text>{{ item.stateName || '--' }}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>区域</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.orgName || "--"}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>领用人</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{item.leaderName || '--'}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>出库时间</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ changestr(item.collarTime)}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>数量</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.partsNumber || "0"}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>金额</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.partsAmount || "0"}}</text>
					</view>
				</view>
				<view style="display: flex;flex-direction: row;margin-bottom: 5px;justify-content: flex-end;">
					<view class="bottom-text-right fontdetailcolor" @click="gotodetail('ly',item)">
						<text>详情</text>
					</view>
				</view>
				<view class="line-s" />
			</view>
		</view>
		<view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle">
					<text>退回记录(最近五次)</text>
				</view>
			</view>
			<view class="list-view-cell" v-for="(item, index) in dataDic.partsReturnLists" :key="index">
				<view class="cell-text">
					<view class="cell-text-left fontBlackcolor" style="color: #000000;">
						<view style="display: flex;flex: 1;flex-direction: column;">
							<view>
								<text>退回单号:{{ item.businessNo || '--' }}</text>
							</view>
						</view>
					</view>
					<view class="cell-text-right fontgreencolor">
						<text>{{ item.stateName || '--' }}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>区域</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.orgName || "--"}}</text>
					</view>
				</view>
				
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>退回人</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{item.returnUserName || "--"}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>退回时间</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ changestr(item.returnTime)}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>数量</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.partsNumber || "0"}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>金额</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.partsAmount || "0"}}</text>
					</view>
				</view>
				<view class="line-s" />
				<view style="display: flex;flex-direction: row;margin-bottom: 5px;justify-content: flex-end;">
					<view class="bottom-text-right fontdetailcolor" @click="gotodetail('th',item)">
						<text>详情</text>
					</view>
				</view>
				<view class="line-s" />
			</view>
		</view>
		<view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle">
					<text>调拨记录(最近五次)</text>
				</view>
			</view>
			<view class="list-view-cell" v-for="(item, index) in dataDic.partsAllocationLists" :key="index">
				<view class="cell-text">
					<view class="cell-text-left fontBlackcolor" style="color: #000000;">
						<view style="display: flex;flex: 1;flex-direction: column;">
							<view>
								<text>调拨单号:{{ item.businessNo || '--' }}</text>
							</view>
						</view>
					</view>
					<view class="cell-text-right fontgreencolor">
						<text>{{ item.stateName || '--' }}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>调出区域</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.sourceRegionName || "--"}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>调入区域</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.targetRegionName || "--"}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>调拨人</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.transferName || "--"}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>调拨时间</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ changestr(item.allocationTime)}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>数量</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{item.partsNumber || '0'}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>金额</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{item.partsAmount || '0'}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>费用</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{item.cost || "0"}}</text>
					</view>
				</view>
				<view style="display: flex;flex-direction: row;margin-bottom: 5px;justify-content: flex-end;">
					<view class="bottom-text-right fontdetailcolor" @click="gotodetail('db',item)">
						<text>详情</text>
					</view>
				</view>
				<view class="line-s" />
			</view>
		</view>
		<!-- <view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle">
					<text>销售单价调整记录(最近五次)</text>
				</view>
			</view>
			<view class="list-view-cell" v-for="(item, index) in dataDic.partsUnitPrices" :key="index">
				<view class="cell-text">
					<view class="cell-text-left fontBlackcolor" style="color: #000000;">
						<view style="display: flex;flex: 1;flex-direction: column;">
							<view>
								<text>调整单号:{{ item.businessNo || '--' }}</text>
							</view>
						</view>
					</view>
					<view class="cell-text-right fontgreencolor">
						<text>{{ item.stateName || '--' }}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>原金额</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.originalAmount || "--"}}</text>
					</view>
				</view>
				<view class="cell-text">
					<view class="cell-text-left fontsubcolor"><text>调整后金额</text></view>
					<view class="cell-text-right fontBlackcolor">
						<text>{{ item.adjustedAmount || "--"}}</text>
					</view>
				</view>
				<view style="display: flex;flex-direction: row;margin-bottom: 5px;justify-content: flex-end;">
					<view class="bottom-text-right fontdetailcolor" @click="gotodetail('dj',item)">
						<text>详情</text>
					</view>
				</view>
				<view class="line-s" />
			</view>
		</view> -->
		<view style="height: 20px;width: 100%;"/>
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
		labelArrow,
	},
	data(){
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			dataDic:{}
		}
	},
	onLoad(option) {
		let itemDic = JSON.parse(decodeURIComponent(option.item));
		uni.showLoading();
		this.loadData(itemDic.itemNumber,itemDic.orgId);
	},
	methods:{
		loadData(key,orgId){
			let url = this.$url.ACC_INVENTORY_DETAIL + key + "?orgId=" + orgId
			this.$network.getData(url, 'GET', null).then(result => {
				this.dataDic = {
					...result,
				};
				console.log(JSON.stringify(this.dataDic))
				uni.hideLoading()
			}).catch(err => {
				uni.hideLoading()
			});
		},
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		saveTwo(num){
			return this.$datestr.doubleFloat(num);
		},
		gotodetail(type,item){
			let url = ""
			switch (type) {
				case 'rk':
					url = "../acc-storagein/acc-storagein-detail?item="
					break;
				case 'ly':
					url = "../acc-receive/acc-recelive-detail?item="
					break;
				case 'th':
					url = "../acc-back/acc-back-detail?item="
					break;
				case 'db':
					url = "../acc-allot/acc-allot-detail?item="
					break;
				case 'dj':
					url = "./adjust-price-detail?item="
					break;
				default:
					break;
			}
			url = url + encodeURIComponent(JSON.stringify(item))
			uni.navigateTo({
				url: url
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.creat-bg {
	display: flex;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}
.sum-view-bg {
	display: flex;
	flex-direction: column;
	margin: 10px;
	margin-bottom: 20px;
	background: #ffffff;
	border-radius: 10px;
	padding-bottom: 10px;
}
.list-view-cell {
	// margin-left: 5px;
	// margin-right: 5px;
	// margin-top: 5px;
	background: #ffffff;
}
.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	padding: 5px 10px;
	font-size: $uni-font-size-base;
	border-bottom: $uni-line-color 1px solid;
}
.cell-input-view-left {
	display: flex;
	align-items: center;
	min-width: 60px;
	justify-content: flex-start;
	color: $uni-text-color-gray;
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
.boldstyle{
	margin-top: 5px;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-bottom: 10px;
	color: $uni-text-color;
}
.cell-text {
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: center;
	padding: 5px;
	border-bottom: $uni-line-color 1px solid;
}
.cell-text-left {
	display: flex;
	min-width: 50px;
	margin-top: 5px;
	margin-left: 15px;
	justify-content: flex-start;
	align-items: center;
	font-size: $uni-font-size-base;
}
.cell-text-right {
	display: flex;
	flex: 1;
	margin-top: 5px;
	margin-right: 15px;
	margin-left: 10px;
	justify-content: flex-end;
	align-items: center;
	font-size: $uni-font-size-base;
}
.fontBlackcolor {
	color: $uni-text-color;
}
.bottom-text-right {
	display: flex;
	margin-top: 5px;
	margin-right: 15px;
	justify-content: flex-end;
	align-items: center;
	font-size: $uni-font-size-base;
}
.fontdetailcolor {
	color: $uni-color-primary;
	margin-bottom: 10px;
}
.fontgreencolor {
	color: #4cd964;
}
.line-s {
	margin-bottom: 10px;
	height: 5px;
	background: $uni-bg-color-grey;
}
</style>
