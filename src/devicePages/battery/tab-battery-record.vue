<template>
	<view class="bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-view">
			<flexibleQueryView
				:isExportList="isExportList"
				hint="自喷码/车号/电池类型/电池品牌型号"
				:haveMore="false"
				@reset="reset"
				@query="query"
				:defaultFuzzyParam="licenseId"
				@exportExcel="exportExcel"
			/>
		</view>
		<list style="margin-top: 44px;">
			<cell v-for="(item, index) in datalist" :key="index">
				<view class="list-view-cell">
					<view class="car-message-view">
						<i class="iconfont icon-car" :class="cartype[item.machineType] || typedefault" :style="{ color: item.state == '1' ? '#4EC365' : '#F7AB2F' }"></i>
						<view class="icon-car-right">
							<view class="icon-car-right-top">
								<text style="font-size: 17px;font-weight: bold;">{{ item.printCode ? item.printCode : '-' }}</text>
								<text style="margin-left: 5px;color: #999999;;font-size: 14px">{{ item.licenseId ? item.licenseId : '--' }}</text>
							</view>
							<view class="icon-car-right-bottom">
								<text>{{ item.machineTypeDesc || '--' }}</text>
								<text style="margin-left: 3px;margin-right: 3px;">|</text>
								<text>{{ item.machineHeightDesc || '--' }}</text>
								<text style="margin-left: 3px;margin-right: 3px;">|</text>
								<text>{{ item.machineBrand || '--' }}</text>
								<text style="margin-left: 3px;margin-right: 3px;">|</text>
								<text>{{item.machineTypeName || '--'}}</text>
								<!-- <text style="margin-left: 3px;margin-right: 3px;">|</text>
								<text>{{item.driveTypeName || '--'}}</text> -->
							</view>
						</view>
						<view class="type-style" :style="{ 'color':item.operationType=='delete'?'#4EC365':'#E60000'}">{{item.operationTypeName || '--'}}</view>
						<!-- <badgeview
						:num='item.fileListNum' 
						@addPic="goImg(item)" 
						/> -->
					</view>
					<view class="cell-input-view" v-if="item.type == 'battery'">
						<view class="cell-input-view-left"><text>电池</text></view>
						<view class="cell-input-view-right">
							<text class="input-style">{{item.batteryBrand || '--' }}&nbsp;|&nbsp;{{item.batteryTypeDesc || '--'}}</text>
						</view>
					</view>
					<view class="cell-input-view"  v-if="item.type == 'battery'">
						<view class="cell-input-view-left"><text>初次使用</text></view>
						<view class="cell-input-view-right">
							<view class="cell-input-view-right">
								<text class="input-style">{{ getDate(item.firstUseDate) }}</text>
							</view>
						</view>
					</view>
					<view class="cell-input-view"  v-if="item.type == 'battery'">
						<view class="cell-input-view-left"><text>生产时间</text></view>
						<view class="cell-input-view-right">
							<view class="cell-input-view-right">
								<text class="input-style">{{ getDate(item.produceDate) }}</text>
							</view>
						</view>
					</view>
					<view class="cell-input-view"  v-if="item.type == 'battery'">
						<view class="cell-input-view-left"><text>{{item.operationTypeName}}</text></view>
						<view class="cell-input-view-right">
							<text class="input-style">{{getDate(item.createTime) }}&nbsp;|&nbsp;{{item.installerName || '--'}}</text>
						</view>
					</view>
					<!-- 充电器 -->
					<view class="cell-input-view" v-if="item.type == 'charge'">
						<view class="cell-input-view-left"><text>充电器</text></view>
						<view class="cell-input-view-right">
							<text class="input-style">{{item.batteryBrand || '--' }}</text>
							<!-- &nbsp;|&nbsp;{{item.batteryType || '--'}} -->
						</view>
					</view>
					<view class="cell-input-view"  v-if="item.type == 'charge'">
						<view class="cell-input-view-left"><text>{{item.operationTypeName}}</text></view>
						<view class="cell-input-view-right">
							<text class="input-style">{{getDate(item.createTime) }}&nbsp;|&nbsp;{{item.installerName || '--'}}</text>
						</view>
					</view>
					<view class="cell-input-view" style="align-items:flex-start;">
						<view class="cell-input-view-left"><text>备注</text></view>
						<view class="cell-input-view-right">
							<text class="input-style" style=“word-break:break-all;”>{{ item.remark || '--' }}</text>
						</view>
					</view>
				</view>
			</cell>
			<cell>
				<view>
					<uni-load-more iconType="auto" :status="morestatus" />
				</view>
			</cell>
		</list>
	</view>
</template>

<script>
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import flexibleQueryView from '@/components/common/common-ui/flexible-query-view.vue';
import badgeview from '@/components/common/image-upload/badge-icon.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';

export default {
	components: {
		uniLoadMore,
		flexibleQueryView,
		badgeview,
		textLabelItem
	},
	props: {
		licenseId: String
	},
	data() {
		return {
			datalist: [],
			//上拉下拉
			morestatus: 'more',
			currentpage: 1,
			//设备类型
			cartype: {
				'3': 'iconzl--zhibiche1',
				'4': 'iconzl--jianchache2',
				'2': 'iconzl--qubiche',
				'1': 'iconzl--jianchache2'
			},
			typedefault: 'iconzl--zhibiche1',
			fuzzyParam: '',
			isExportList: true,
			totalCount: '100',
			startTime: '',
			endTime: ''
		};
	},
	created() {
		// uni.getStorage({
		// 	key: this.$savekey.USER_PRIVILEGES_MEG,
		// 	success: res => {
		// 		this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_BATTERY_RECORD_EXPORT);
		// 	}
		// });
	},
	methods: {
		reset(val) {
			this.fuzzyParam = '';
			this.startTime = '';
			this.endTime = '';
			this.headerrefresh();
		},
		query(val) {
			this.fuzzyParam = val.fuzzyParam;
			this.startTime = val.startDate;
			this.endTime = val.endDate;
			this.headerrefresh();
		},
		goImg(item) {
			let isedit = this.isuser(item)
			uni.navigateTo({
				url: "/components/common/image-upload/upload_zb_apendix?item=" + encodeURIComponent(JSON.stringify(item)) +
					"&isedit=" + isedit + "&type=machineapi" + "&filetype=battery" 
			})
		},
		isuser(item) {
			if (item.canUploadFile == '0') {
				return false
			} else {
				return true
			}
		},
		editBattery(item) {
			
		},
		getDate(time) {
			if (!time) return "--";
			return time.split(/\s+/)[0];
		},
		headerrefresh() {
			this.currentpage = 1;
			this.datalist = [];
			this.getNetData();
		},
		footerrefresh() {
			if (this.morestatus == 'noMore') {
				return;
			}
			this.currentpage += 1;
			this.morestatus = 'loading';
			this.getNetData();
		},
		getParts(list) {
			if (!list || list.length <= 0) return '-';
			let needDevice = list
				.map(o => {
					return (
						(o.brand ? o.brand : '') +
						(o.brand && o.modelName ? '-' : '') +
						(o.modelName ? o.modelName : '') +
						(o.modelName && o.seriesNum ? '-' : '') +
						(o.seriesNum ? o.seriesNum : '')
					);
				})
				.join('\n');
			return needDevice;
		},
		//获取数据
		getNetData() {
			uni.showLoading();
			let parame = {
				current: this.currentpage,
				size: 10,
				fuzzyParam: this.fuzzyParam ? this.fuzzyParam : undefined,
				beginDate: this.startTime ? this.startTime + ' 00:00:00' : undefined,
				endTime: this.endTime ? this.endTime + ' 23:59:59' : undefined
			};
			this.$network
				.getData(this.$url.BATTERY_RECORD_LIST, 'POST', parame)
				.then(result => {
					this.datalist = this.datalist.concat(result.records);
					let pages = result.pages;
					let total = result.total;
					this.totalCount = result.total.toString();
					if (pages <= this.currentpage) {
						this.morestatus = 'noMore';
					} else {
						this.morestatus = 'more';
					}
					this.totalCount = result.total.toString();
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
				.catch(err => {
					this.morestatus = 'noMore';
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		},
		exportExcel() {
			let param = {
				current: 1,
				size: this.totalCount,
				fuzzyParam: this.fuzzyParam ? this.fuzzyParam : undefined,
				beginDate: this.startTime ? this.startTime + ' 00:00:00' : undefined,
				endTime: this.endTime ? this.endTime + ' 23:59:59' : undefined
			};
			let url = this.$gxfmethod.getUrl(this.$url.BATTERY_RECORD_LIST);
			let filename = this.$gxfmethod.getFileName('设备电池列表-');
			this.$gxfmethod.downFunc(url, 'POST', param, filename);
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

.list-view-cell {
	display: flex;
	flex-direction: column;
	background: #ffffff;
	border-bottom-style: solid;
	margin:5px 5px 0px 5px;	
	border-bottom-color: #eeeeee;
	border-bottom-width: 1px;
	border-radius: 10px;
	padding: 10px;
}

.car-message-view {
	display: flex;
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	margin-left: 5px;
	margin-right: 5px;
	font-size: $uni-font-size-base;
}

.icon-car {
	font-size: 40px;
}

.icon-car-right {
	display: flex;
	flex: 1;
	flex-direction: column;
}

.icon-car-right-top {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	margin-left: 5px;
}

.icon-car-right-bottom {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color-gray;
	font-size: $uni-font-size-sm;
	margin-left: 5px;
}

.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	margin-top: 5px;
	margin-left: 5px;
	margin-right: 5px;
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
.detail-view{
	display: flex;
	flex-direction: row;
	margin-top: 10px;
	padding-top: 5px;
	justify-content: flex-end; 
	color: #E60000;
	border-top: 1px 
	solid #efefef;
	font-size: $uni-font-size-base;
}
.top-view {
	z-index: 300;
	position: sticky;
	display: flex;
	flex-direction: column;
	width: 100%;
	top: 44px;
	left: 0px;
	margin-bottom: 1px;
	background: #ffffff;
}
.cell-text-right {
	display: flex;
	margin-top: 5px;
	margin-right: 5px;
	justify-content: flex-end;
	align-items: center;
	color: $uni-color-primary;
	font-size: $uni-font-size-base;
}
.type-style{
	font-size: $uni-font-size-base;
	margin-right: 10px;
	// border: $uni-color-primary 1px solid;
	border-radius: 5px;
	padding: 3px 5px;
	color: $uni-color-primary;
}
.item-bottom {
	display: flex;
	flex-direction: row;
	padding: 10px;
	justify-content: flex-end;
	align-items: center;
	border-top: $uni-line-color 1px solid;
	margin-top: 5px;
}
.option {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	color: $uni-color-primary;
	font-size: $uni-font-size-base;
	margin-left: 10px;
	// padding: 4px 10px;
	// border-radius: 50px;
	// border: 1px solid $uni-color-primary;
}
</style>
