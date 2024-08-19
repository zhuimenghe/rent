<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="search-top">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content"><input placeholder="保险业务单号" placeholder-class="placeholder-style" v-model="businessNo" style="font-size: 14px;" /></view>
			</view>
			<view class="export-css" @click="exportExcel" v-if="isExportList"><text>导出</text></view>
		</view>
		<view style="margin-top: 98px;">
			<view v-for="(item, index) in dataList" :key="index" class="item-container">
				<view class="item-row-line">
					<view style="flex: 1;">{{ item.insuranceKey || '-' }}</view>
					<view style="margin-right: 10px;">{{ item.stateName || '-' }}</view>
					<!-- <badgeview
					:num='item.fileList ? item.fileList.length : 0' 
					@addPic="goImg(item)" 
					/> -->
				</view>
				<view class="item-row-line">
					<view class="row-tag">保险业务单号</view>
					<view style="color: #E60000;" @click="goDetail(item)">{{ item.businessNo || '-' }}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">保险公司</view>
					<view>{{ item.insuranceCompany || '-' }}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">保险金额</view>
					<view>{{ getMoney(item.insuranceAmount) }}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">生效时间</view>
					<view>{{ getDate(item.insuranceStartDate) }}/{{ getDate(item.insuranceEndDate) }}</view>
				</view>
				<view class="item-row-line" v-if="item.remainingTime && Number(item.remainingTime) < 0">
					<view class="row-tag">保险状态</view>
					<view style="color: #FF0000;">已脱保</view>
				</view>
				<view class="item-row-line" v-else>
					<view class="row-tag">剩余脱保时间</view>
					<view>{{item.remainingTime}}天</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">购买日期</view>
					<view>{{ getDate(item.buyTime) }}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">购买负责人</view>
					<view>{{ item.insuranceOfficerName || '-' }}</view>
				</view>
				<view class="item-row-line">
					<view class="row-tag">保险设备数量</view>
					<view>{{ item.count || '0' }}</view>
				</view>
				<view class="item-view">
					<view style="display: flex;flex: 1;justify-content: flex-start;">
						<badgeBottom
						:num='item.fileListNum ? item.fileListNum : 0' 
						@addPic="goImg(item)" 
						/>
					</view>
					<taskBtn :itemData="item" />
					<view
					class="all-records-view" 
					@click="editCreate(item)"
					v-if="ishowupdata(item)">修改</view>
					<view class="all-records-view" @click="goDetail(item)">详情</view>
				</view>
			</view>
			<view><uni-load-more iconType="auto" :status="morestatus" /></view>
		</view>
	</view>
</template>

<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
import selectView from '@/components/common/common-ui/selector-view.vue';
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import taskBtn from '@/common/common-method/task_common_btn.vue';
import badgeview from '@/components/common/image-upload/badge-icon.vue'

let timer;
export default {
	components: {
		selectLabelItem,
		uniPopup,
		selectView,
		uniLoadMore,
		wPicker,
		taskBtn,
		badgeview
	},
	watch: {
		businessNo: {
			handler(val) {
				if(timer){
					clearTimeout(timer);
				}
				timer = setTimeout(()=>{
					uni.showLoading()
					this.headerrefresh();
				}, 500)
			}
		}
	},
	data() {
		return {
			businessNo: '',
			dataList: [],
			morestatus: 'more',
			pageSize: 5,
			curPage: 1,
			createBy: '',
			isExportList: true,
			totalCount: '100'
		};
	},
	created() {
		let resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG)
		this.createBy = resData.id;
		uni.getStorage({
			key: this.$savekey.USER_PRIVILEGES_MEG,
			success: res => {
				//this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
			}
		});
		/*统计*/
		this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备保险","保险记录列表");
		
		// this.getInsuranceDevice();
	},
	methods: {
		editCreate(item){
			uni.navigateTo({
				url: '/devicePages/insurance/create-insurance?isUpdate=1&item=' + encodeURIComponent(JSON.stringify(item))
			});
		},
		ishowupdata(item){
			return  this.iscreator(item) && (item.state == '0' || item.state == '3')
		},
		iscreator(item) {
			if (item.createBy === this.createBy) {
				return true
			} else {
				return false
			}
		},
		goImg(item) {
			let isedit = this.isuser(item)
			uni.navigateTo({
				url: "/components/common/image-upload/upload_zb_apendix?item=" + encodeURIComponent(JSON.stringify(item)) +
					"&isedit=" + isedit + "&type=jx" + "&filetype=insurance" + "&isshowShare=1" 
			})
		},
		isuser(item) {
			if (item.canUploadFile == '0') {
				return false
			} else {
				return true
			}
		},
		getDate(time) {
			if (!time) return '';
			return time.split(/\s+/)[0];
		},
		getMoney(money) {
			return money ? '￥' + this.moneyUtil.dealNumber(money) : '-';
		},
		goDetail(item) {
			uni.navigateTo({
				url: './insurance-detail?businessNo=' + item.businessNo
			});
		},

		headerrefresh() {
			this.curPage = 1;
			this.dataList = [];
			this.getInsuranceDevice();
		},
		footerrefresh() {
			if (this.morestatus == 'noMore') {
				return;
			}
			this.curPage += 1;
			this.morestatus = 'loading';
			this.getInsuranceDevice();
		},
		getInsuranceDevice() {
			let param = {
				size: this.pageSize,
				current: this.curPage
			};
			if (this.businessNo) {
				param = {
					...param,
					businessNo: this.businessNo
				};
			}
			uni.showLoading();
			this.$network
				.getData(this.$url.INSURANCE_RECORD_PAGE, 'POST', param)
				.then(result => {
					this.dataList = this.dataList.concat(result.records);
					let pages = result.pages;
					if (pages <= this.curPage) {
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
			 
			// let param = {
			// 	businessNo: this.businessNo
			// };
			// let url= this.$url.INSURANCE_RECORD_PAGE + '?isExport=true&current=1&size='+ this.totalCount
			// let downurl = this.$gxfmethod.forEachObj(url,param)
			// console.log(downurl)

			let param = {
				current: 1,
				size: this.totalCount,
				businessNo: this.businessNo
			};
			let url = this.$gxfmethod.getUrl(this.$url.INSURANCE_RECORD_PAGE);
			let filename = this.$gxfmethod.getFileName('设备保险记录列表-');
			console.log(url)
			this.$gxfmethod.downFunc(url, 'POST', param, filename);
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	background-color: $uni-bg-color-grey;
	position: relative;
}

.search-top {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: #ffffff;
	box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2);
	padding-bottom: 4px;
	width: 100%;
	position: fixed;
	top: 44px;
	left: 0px;
	z-index: 100;
	padding-top: 6px;
}

.search-box {
	background: #F7F7F7;
	height: 35px;
	flex: 3;
	line-height: 35px;
	display: flex;
	margin: 0px 4px;
	flex-direction: row;
	padding-left: 4px;
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
	flex: 1;
}

.select-view {
	flex: 2;
}

.btn-confirm {
	padding: 0px 6px;
	height: 35px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	font-size: $uni-font-size-base;
	color: #ffffff;
	background-color: $uni-color-primary;
	border-radius: 4px;
	margin: 0px 4px;
}

.btn-reset {
	padding: 0px 6px;
	height: 35px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	background-color: $uni-bg-color-grey;
	border-radius: 4px;
	margin: 0px 4px;
}

.item-container {
	background-color: #ffffff;
	margin-bottom: 4px;
	border-radius: 4px;
}

.item-row-line {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	min-height: 30px;
	padding: 0px 10px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}

.item-view {
	display: flex;
	flex-direction: row;
	padding: 10px;
	justify-content: flex-end;
	align-items: center;
	border-top: 1px solid $uni-bg-color-grey;
}
.all-records-view{
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
/* 提示窗口 */

.pop-container {
	position: relative;
}

.uni-tip {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
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
	height: 40px;
	line-height: 40px;
	margin-top: 10px;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}

.row-tag {
	width: 85px;
	min-width: 85px;
	text-align: left;
}

.input-style {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	padding: 2px 6px;
	border: 1px solid $uni-bg-color-grey;
	border-radius: 4px;
}

.text-style {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	padding: 2px 6px;
	height: 40px;
	line-height: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.uni-tip-group-button {
	display: flex;
	flex-direction: row;
	margin-top: 20px;
}

.notice {
	color: #fca01f;
	font-size: $uni-font-size-sm;
	background-color: #fff8ee;
	padding: 4px 10px;
	margin: 10px 0px;
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
	color: #ffffff;
	margin-left: 8px;
	background: $uni-color-primary;
	border-radius: 4px;
}
.export-css {
	display: flex;
	align-items: center;
	justify-content: center;
	padding-left: 8px;
	padding-right: 8px;
	height: 30px;
	background: #FFFFFF;
	border-radius: 4px;
	margin-right: 5px;
	font-size: $uni-font-size-base;
	color: $uni-color-primary;
	border: 1px solid $uni-color-primary;
}
</style>
