<template>
	<view class="content-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view " style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>业务类型</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.transportTypeName || '--'}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>项目名称</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{dataDic.projectName || '--'}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>业务单号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.externalKey || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>运输数量</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.machineNum || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>物流费用</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">￥{{moneyUtil.dealNumber(dataDic.logisticsCarriage || "0")}}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>创建时间</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.createTime || '--' }}</text>
				</view>
			</view>
			<!-- <view class="cell-input-view" v-if="dataDic.logisticsProviderType === '2'">
				<view class="cell-input-view-left"><text>物流方信息</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.logisticsCompanyName || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view" v-if="dataDic.logisticsProviderType === '2'">
				<view class="cell-input-view-left"><text>物流联系人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.logisticsContact || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view" v-if="dataDic.logisticsProviderType === '2'">
				<view class="cell-input-view-left"><text>物流联系人电话</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.logisticsPhone || '--' }}</text>
				</view>
			</view>  -->
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>物流备注</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.logisticsRemark || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>我方负责人</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.customerSalesmanName || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view" v-if="dataDic.carInfos && dataDic.carInfos.length > 0">
				<view class="cell-input-view-left"><text>物流运输车</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ getVehicleName(dataDic) || '--' }}</text>
				</view>
			</view>
			<view class="cell-input-view" v-if="dataDic.drivers && dataDic.drivers.length > 0">
				<view class="cell-input-view-left"><text>司机</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ getDriverName(dataDic)||'--' }}</text>
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>物流单号</text></view>
				<view class="cell-input-view-right">
					<text class="input-style">{{ dataDic.businessNo || '--' }}</text>
				</view>
			</view>
		</view>
		<view class="sum-view-bg" style="margin-bottom: 5px;" v-if="dataDic.cargoInformations && dataDic.cargoInformations.length > 0">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>货物信息</text></view>
			</view>
			<view class="list-bg-view" v-for="(item,index) in dataDic.cargoInformations" :key='index'>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>货物名称</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.goodsName || '--' }}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>货物备注</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.remark || '--' }}</text>
					</view>
				</view>
				<!-- <view class="cell-input-view">
					<view class="cell-input-view-left"><text>运输方式</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.logisticsProviderName || '--' }}</text>
					</view>
				</view> -->
				<view class="cell-input-view" v-if="item.logisticsProviderType === '2'">
					<view class="cell-input-view-left"><text>物流公司</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.logisticsCompanyName || '--' }}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>联系人</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.logisticsContact || '--' }}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>联系电话</text></view>
					<view class="cell-input-view-right" @click="callPhone(item.logisticsPhone)">
						<text class="input-style" style="color: #E60000;">{{ item.logisticsPhone || '--' }}</text>
					</view>
				</view>
				<view class="cell-input-view" v-if="item.logisticsProviderType === '3'">
					<view class="cell-input-view-left"><text>里程数</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.distance || '--' }}</text>
					</view>
					<view>公里</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>货物运费</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">￥{{moneyUtil.dealNumber(item.logisticsCarriage || "0")}}</text>
					</view>
				</view>
				<view class="cell-input-view" v-if="item.logisticsProviderType != '1'">
					<view class="cell-input-view-left"><text>车牌号</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ getCarName(item) }}</text>
					</view>
				</view>
				<view class="cell-input-view" v-if="item.logisticsProviderType != '1'">
					<view class="cell-input-view-left"><text>司机</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ getDriveName(item) }}</text>
					</view>
				</view>
				<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;" v-if="item.logisticsProviderType != '1'">
					<view class="cell-input-view-left"><text>司机联系方式</text></view>
					<view class="cell-input-view-right" @click="callPhone(getDrivePhone(item))">
						<text class="input-style" style="color: #E60000;">{{ getDrivePhone(item) }}</text>
					</view>
				</view>
				<view class="cell-input-view" style="border-bottom-width: 2px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
					<view class="cell-input-view-left" style="flex:1;color: #222831;"></view>
					<view class="cell-input-view-right-click" @click="changMoney(item,index)" v-if="isedit">
						<text>修改</text>
					</view>
				</view>
			</view>
		</view>
		<view class="pop-container">
			<uni-popup ref="picDialog" type="center" :mask-click="false">
				<view class="uni-tip" >
					<view class="tip-title">
						运输信息
					</view>
					<view class="row-item">
						<view class="row-tag">货物名称</view>
						<view class="input-style">{{dialogData.goodsName || '--'}}</view>
					</view>
					<view class="row-item">
						<view class="row-tag">货物备注</view>
						<input 
						class="input-style" 
						v-model="dialogData.remark" 
						placeholder="请输入货物备注..." 
						/>
					</view>
					<view class="row-item" v-if="dialogData.logisticsProviderType === '2'">
						<view class="row-tag">物流公司</view>
						<view class="input-style">{{dialogData.logisticsCompanyName || '--'}}</view>
					</view>
					<view class="row-item">
						<view class="row-tag">联系人</view>
						<input 
						class="input-style" 
						v-model="dialogData.logisticsContact" 
						placeholder="请输入联系人..." 
						/>
					</view>
					<view class="row-item">
						<view class="row-tag">联系人电话</view>
						<input 
						class="input-style" 
						v-model="dialogData.logisticsPhone" 
						placeholder="请输入联系人电话..." 
						/>
					</view>	
					<view class="row-item" v-if="dialogData.logisticsProviderType === '3'">
						<view class="row-tag">里程数</view>
						<input 
						class="input-style" 
						v-model="dialogData.distance" 
						placeholder="请输入里程数..." 
						/>
						<view>公里</view>
					</view>
					<view class="row-item">
						<view class="row-tag">货物运费</view>
						<input 
						class="input-style" 
						v-model="dialogData.logisticsCarriage" 
						placeholder="请输入货物运费..." 
						/>
					</view>
					<view class="row-item" @click="chooseAll('device')" v-if="dialogData.logisticsProviderType != '1'">
						<view class="row-tag">车牌号</view>
						<view class="input-style">{{getCarName(dialogData) != '--' ? getCarName(dialogData)  : '请绑定车辆'}}</view>
						<i class="iconfont iconarrow-right" style="padding-right: 8px;"></i>
					</view>
					<view class="row-item" @click="chooseAll('driver')" v-if="dialogData.logisticsProviderType != '1'">
						<view class="row-tag">司机</view>
						<view class="input-style">{{getDriveName(dialogData) != '--' ? getDriveName(dialogData) : '请绑定司机'}}</view>
						<i class="iconfont iconarrow-right" style="padding-right: 8px;"></i>
					</view>
					<view class="row-item" v-if="dialogData.logisticsProviderType != '1'">
						<view class="row-tag">司机联系方式</view>
						<view class="input-style">{{getDrivePhone(dialogData)}}</view>
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
import imgupload from '@/components/common/image-upload/image-upload.vue';
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
export default {
	components: {
		imgupload,
		uniPopup
	},
	data() {
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			dataDic:{},
			selectIndex:0,
			isedit:true,
			dialogData:{},
			widthnum:'300px'
		};
	},
	watch: {
		'dialogData.logisticsCarriage'(val) {
			this.dialogData = {
				...this.dialogData,
				logisticsCarriage:val
			};
			setTimeout(() => {
				val = val.replace(/[^\d.]/g, ''); //清除"数字"和"."以外的字符
				val = val.replace(/^\./g, ''); //验证第一个字符是数字
				val = val.replace(/\.{2,}/g, '.'); //只保留第一个, 清除多余的
				val = val
					.replace('.', '$#$')
					.replace(/\./g, '')
					.replace('$#$', '.');
				val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
				this.dialogData = {
					...this.dialogData,
					logisticsCarriage:val
				};
			}, 50);
		},
	},
	onLoad(options) {
		let itemDic = JSON.parse(decodeURIComponent(options.item))
		if(options.isedit){
			this.isedit = false
		}
		// uni.getSystemInfo({
		// 	success:(res) =>{
		// 		console.log(res.screenWidth)
		// 		this.widthnum = (res.screenWidth - 50) + 'px'
		// 		console.log(this.widthnum)
		// 	}
		// })
		this.loadData(itemDic);
		uni.$on('finishchoose-device', data=>{
			let dict = data.data;
			let carInfos = this.dialogData.carInfos ? this.dialogData.carInfos : {};
			let idstr = carInfos.id ? carInfos.id : ''
			this.dialogData = {
				...this.dialogData,
				carInfos:{
					...carInfos,
					...dict,
					id:idstr==='' ? undefined : idstr,
					machineId:dict.id
				}
			}
		});
		uni.$on('finishchoose-driver', data=>{
			let dict = data.data;
			let drivers = this.dialogData.drivers ? this.dialogData.drivers : {};
			let idstr = drivers.id ? drivers.id : ''
			this.dialogData = {
				...this.dialogData,
				drivers:{
					...drivers,
					...dict,
					id:idstr==='' ? undefined : idstr,
					"driverId":dict.id,
					"driverName":dict.name,
					"mobile":dict.phoneNum,
				}
			}
		});
	},
	methods: {
		loadData(item){
			uni.showLoading()
			let url = this.$url.LOGISTICS_RECORD_DETAIL + item.id
			this.$network.getData(url, 'GET', null).then(result => {
				this.dataDic = {
					...result
				}
				uni.hideLoading()
			}).catch(err => {
				uni.hideLoading()
			});
		},
		callPhone(phone) {
			if (!this.isadd && phone) {
				uni.makePhoneCall({
					phoneNumber: phone,
					success: res => {
						console.log('调用成功!');
					},
					fail: res => {
						console.log('调用失败!');
					}
				});
			}
		},
		getVehicleName(item){
			let names= item.carInfos ? item.carInfos.map(o=>{
				return o.licenseId
			}):[]
			return names.join(',')
		},
		getDriverName(item){
			let names= item.drivers ? item.drivers.map(o=>{
				return o.name
			}):[]
			return names.join(',');
		},
		getCarName(item){
			// let carInfos = item.carInfos || [];
			// if(carInfos.length === 0){
			// 	return '--'
			// }
			// let carInfosName = carInfos.map((o)=>{
			// 	return o.licenseId;
			// })
			// return carInfosName.toString()
			let carInfos = item.carInfos || {};
			return carInfos.licenseId || '--'
		},
		getDriveName(item){
			let drivers = item.drivers || {};
			return drivers.driverName || '--'
		},
		getDrivePhone(item){
			let drivers = item.drivers || {};
			return drivers.mobile || '--'
		},
		chooseAll(type,item,index){
			// this.selectIndex = index;
			// console.log(this.selectIndex)
			if(type === 'device'){
				uni.navigateTo({
					url:'./choose-device?item=' + encodeURIComponent(JSON.stringify(this.dialogData))
				})
			}else if(type === 'driver'){
				uni.navigateTo({
					url:'./choose-driver?item=' + encodeURIComponent(JSON.stringify(this.dialogData))
				})
			}
		},
		updateDetail(){
			let url = this.$url.LOGISTICS_RECORD_DETAIL_UPDATA
			this.$network.getData(url, 'PUT', this.dataDic).then(result => {
				uni.$emit('refresh-record-list', {
				    type: "refund"
				});
				this.dataDic = {
					...result
				}
				uni.showToast({
					title:'物流信息已更新',
					icon:'none'
				})
				this.$refs.picDialog.close()
			}).catch(err => {
				let str = err.details ? err.details[0] : ''
				uni.showToast({
					title: err.message + "," + str,
					icon: 'none'
				});
			});
		},
		changMoney(item,index){
			this.selectIndex = index;
			this.dialogData = {
				...item
			}
			this.$refs.picDialog.open()
		},
		cancelDialog() {
			this.$refs.picDialog.close()
		},
		confirmDialog() {
			// if (!this.dialogData.logisticsPhone) {
			// 	uni.showToast({
			// 		title: "请输入联系电话",
			// 		icon: "none"
			// 	})
			// 	return
			// }
			if (!this.dialogData.logisticsCarriage || this.dialogData.logisticsCarriage === '') {
				uni.showToast({
					title: "请输货物运费",
					icon: "none"
				})
				return
			}
			if (this.dialogData.logisticsPhone && this.$datestr.isphonenum(this.dialogData.logisticsPhone) === false) {
				uni.showToast({
					icon: 'none',
					title: '请输入正确手机号'
				});
				return;
			}
			uni.showModal({
				title: '提示',
				content: "确定修改'" + this.dialogData.goodsName + "'的信息么?",
				success: res => {
					if (res.confirm) {
						let cargoInformations = this.dataDic.cargoInformations || [];
						cargoInformations.splice(this.selectIndex,1,this.dialogData);
						this.dataDic = {
							...this.dataDic,
							cargoInformations:[...cargoInformations]
						}
						uni.showLoading();
						setTimeout(() =>{
							this.updateDetail()
						}, 100);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content-bg{
	display: flex;
	width: 100%;
	flex-direction: column;
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

.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	padding: 10px;
	border-bottom:$uni-line-color 1px dotted;
	font-size: $uni-font-size-base;
	// border-bottom: 1px solid $uni-bg-color-grey;
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
	min-height: 24px;
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
.boldstyle {
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-top: 5px;
	margin-bottom: 10px;
	color: #222831;
}
.update-btn{
	padding: 3px 5px;
	border-radius: 3px;
	background: $uni-color-primary;
	color: #FFFFFF;
	font-size: $uni-font-size-base;
	font-weight: normal;
}
.pop-container {
	position: relative;
}

/* 提示窗口 */
.uni-tip {
	display: flex;
	flex-direction: column;
	padding: 8px 10px;
	background-color: #fff;
	border-radius: 10px;
	width: 300px;
}

.tip-title {
	padding: 8px;
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
	padding: 8px 0px;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	border-bottom: 1px solid $uni-bg-color-grey;
}
.col-item {
	display: flex;
	margin-top: 5px;
	flex-direction: column;
	align-items: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.row-tag {
	width: 60px;
	text-align: left;
}
.input-style {
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	padding: 2px 6px;
}
.text-style{
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	padding: 2px 6px;
	border-radius: 4px;
	width: calc(100% - 15px );
	margin-top: 8px;
}
.uni-tip-group-button {
	display: flex;
	flex-direction: row;
	margin-top: 10px;
}

.uni-tip-button {
	flex: 1;
	text-align: center;
	padding: 5px 8px;
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
.list-bg-view{
	display: flex;
	flex-direction: column;
	margin-top: 5px;
}
.cell-input-view-child{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	padding:10px 10px 10px 30px;
	margin-left: 1px;
	margin-right: 1px;
	margin-top: 1px;
	font-size: $uni-font-size-base;
	border-bottom: 1px solid $uni-bg-color-grey;
	background: $uni-bg-color-grey;
}
.fontdetailcolor {
	color: $uni-color-primary;
	margin-bottom: 10px;
}
.cell-text-right {
	display: flex;
	margin-top: 5px;
	margin-right: 15px;
	justify-content: flex-end;
	align-items: center;
	font-size: $uni-font-size-base;
}
.cell-input-view-right-click{
	display: flex;
	margin-left: 10px;
	padding: 3px 5px;
	border-radius: 3px;
	background: $uni-color-primary;
	color: #FFFFFF;
	font-size: $uni-font-size-sm;
}
.left-style {
	display: flex;
	margin-left: 10px;
}
</style>
