<template>
	<view class="record-detail-bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">设备详情</c-nav-bar-btns>
    <view class="flex-scroll-wrapper">
      <!-- 主要布局 -->
      <recordDetailHead 
      :idDataDicNull="idDataDicNull"
      :dataDic="dataDic" 
      :qrcodeUrl="qrcodeUrl" 
      :downloadQrcodeUrl="downloadQrcodeUrl"
      :isShowQrCode="isShowQrCode"
      :isShowUPDATA="isShowUPDATA"
      @canScroll="canScroll"
      />
      <!-- 分隔断 -->
      <view class="line-css"/>
      <!-- <view class="title-search-bg" v-if="!showTab"> -->
      <view class="title-search-bg">
        <view class="title-search">
          <!-- <text class="title-left-text">生命周期</text> -->
          <view class="flex-sub">
            <c-sun-tab :value.sync="tabindex" :tabList="tabList" @change="tabChange" :shownum="false"></c-sun-tab>
          </view>
          <view class="left-title-search" v-if="tabindex==0">
            <view class="group-check" @click="changeGroup">
              <mycheckbox  :checked="isshowContract" style="transform: scale(0.7);" />
              <text>{{ '按合同分组' }}</text>
            </view>
            <!-- <view style="margin-left: 15px;margin-right: 15px;background: #F0F2F4;height: 10px;width: 1px;" v-if="!isshowContract"/>
            <view class="group-check" @click="orderReset" v-if="!isshowContract">
              <i class="iconfont iconzl--zhengxu-" v-if="positiveOrder"></i>
              <i class="iconfont iconzl--daoxu-" v-if="!positiveOrder"></i>
              <text>{{ positiveOrder ? '正序' : '倒序' }}</text>
            </view> -->
            <view style="margin-left: 15px;margin-right: 15px;background: #F0F2F4;height: 10px;width: 1px;"/>
            <view class="filtter-click" @click="showFiltterView">{{'筛选'}}</view>
          </view>
          <view class="text-primary flex-sub text-right" v-else>
            合计：￥{{ moneyUtil.dealNumber(settleTotal) }}
          </view>
        </view>
        <view class="filtter-item-bg" v-if="showFiltter">
          <recordSelector title="自定义显示" placeholder="自定义类型" :content='typeshow' @clickItem="showPick($event,'show')"/>
          <view style="margin-left: 10px;margin-right: 10px;background: #F0F2F4;height: 15px;width: 1px;"/>
          <recordSelector title="开始时间" placeholder="开始时间" :content='beginDate' @clickItem="showPick($event,'begin')"/>
          <view style="margin-left: 10px;margin-right: 10px;background: #F0F2F4;height: 15px;width: 1px;"/>
          <recordSelector title="结束时间" placeholder="结束时间" :content='endDate' @clickItem="showPick($event,'end')"/>
        </view>
        <view class="bottom-save-btn" v-if="showFiltter">
          <view class="left-save-btn"  @click="gotosearch('reset')">{{'重置'}}</view>
          <view class="right-save-btn" @click="gotosearch('ok')">{{'查询'}}</view>
        </view>
      </view>
      <view v-if="tabindex==0">
        <detailList :dataList="lifecycleRecord" v-if="!isshowContract"/>
        <detailContractList :dataList="contractcycleRecord" v-if="isshowContract" @getExArrow = "getExArrow"/>
      </view>
      <view v-else>
        <c-timeline :list="settleList">
          <template v-slot:default="{item,index}" >
            <lvli-card :item="item"></lvli-card>
          </template>
        </c-timeline>
      </view>
    </view>
    <view class="actions-footer-flex">
      <view class="z-btn bg-warn" @click="share">分享设备</view>
    </view>
    <device-share ref="share" :d="dataDic"></device-share>
		<w-picker
		mode="date" 
		startYear="2000" 
		endYear="3000" 
		:current="true" 
		@confirm="onConfirm"
		:disabledAfter="false"
		ref="date" 
		themeColor="#E60000" 
		/>
	</view>
</template>

<script>
import recordDetailHead from './detail-components/record-detail-head.vue';
import recordSelector from './detail-components/record-title-select.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import detailList from './detail-components/record-detail-list.vue';
import LvliCard from './components/lvli-card.vue';
import detailContractList from './detail-components/record-detail-contract-list.vue';
import DeviceShare from "@/devicePages/components/device-share.vue";
import share from "@/common/common-method/share.js";
import {mapState} from 'vuex'
export default {
	components: {
		recordDetailHead,
		recordSelector,
		wPicker,
		detailList,
		detailContractList,
		LvliCard,
    DeviceShare
	},
	data() {
		return {
			idDataDicNull:false,
			tabindex:0,
			tabList: ['生命周期', '结算履历'],
			settleList:[],
			navBtns: [
					{
							"fontSize": "15px",
							"color": "#000000",
							"text": "\ue666",
					},
					{
							"fontSize": "15px",
							"color": "#000000",
							"text": "\ue6d4",
					},
					// #ifdef APP-PLUS
					{
							"fontSize": "15px",
							"color": "#000000",
							"text": "\ue72e",
					}
					// #endif
			],
			dataDic: {},
			qrcodeUrl:'',
			downloadQrcodeUrl:'',
			isshowContract:true,
			positiveOrder:true,
			showFiltter:false,
			selectType:'',
			typeshow:'全部',
			beginDate:'',
			endDate:'',
			circleTreeList:[],//生命周期树
			lifecycleRecord:[],//非合同数据列表
			contractcycleRecord:[],//合同数据列表
			page:1,
			showTab:false,
			tabScroller:true,
			isShowUPDATA:false,
			isShowQrCode:false,
			isShowShare:false,
		};
	},
	onPageScroll(e) {
		if(this.tabScroller){
			if (e.scrollTop >= 200) {
				this.showTab = true;
			}else{
				this.showTab = false;
			}
		}
	},
  computed:{
    ...mapState('user',{
      identifier:s=>s.lesseeInfo.identifier
    })
  },
	onLoad(option) {
		if (option.licenseId) {
			this.getDetailWithLiceseID(option.licenseId);
			let baseUrl = this.$url.BASE_URL + this.$url.DEVICE_ERCODE_IMG_LOGO
      this.qrcodeUrl = `${baseUrl}?licenseId=${option.licenseId}&schema=${this.identifier}`
			this.getCircleData(option.licenseId)
			this.getSettleHistory(option.licenseId)
		}
		uni.$on('refresh-device-circle', item => {
			let list = item.list;
			this.circleTreeList = [...list];
			this.dealCircleList(this.circleTreeList, this.dataDic.licenseId)
		})
		let data = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);
		this.isShowUPDATA = data.some(x => x.value === this.$savekey.PERMISSION_DEVICE_UPDATA)
		this.isShowQrCode = data.some(x => x.value === this.$savekey.PERMISSION_SHOW_DEVICE_QRCODE)
		this.isShowShare = data.some(x => x.value === this.$savekey.PERMISSION_SHARE);
		/*统计*/ 
		this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备档案","详情");
	},
	onUnload() {
		uni.$off('refresh-device-circle')
	},
	onReachBottom() {
		// this.page = this.page + 1;
		// this.dealCircleList(this.circleTreeList, this.dataDic.licenseId)
	},
	methods: {
    share(){
      this.$refs.share.share()
    },
		async getSettleHistory(licenseId){
			let res = await this.$network.fetchMachineSettleHistory(licenseId)
			this.settleList = res.list.map(s=>{
				return{
					...s,
					// beginDate:s.beginDate ? s.beginDate.split(' ')[0] : '',
					// endDate:s.endDate ? s.endDate.split(' ')[0] : '',
					// enableDate:s.enableDate ? s.enableDate.split(' ')[0] : '',
					// settleDate:s.settleDate ? s.settleDate.split(' ')[0] : '',
				}
			});
			this.settleTotal = res.total
		},
		tabChange(e){
			this.tabindex = e.index;
		},
		onNavBarButtonTap(e) {
			if(e.index == 0){
				uni.navigateTo({
					url:'/components/common/image-upload/upload_zb_apendix?item=' + encodeURIComponent(JSON.stringify(this.dataDic)) +'&filetype=vehicle_type&isedit=false' + '&isshowShare=1'
				});
			}else if(e.index == 1){
				if(this.dataDic.deviceNum){
					uni.navigateTo({
						url: '/devicePages/monitor/device-monitor-detail?licenseId=' + this.dataDic.licenseId
					});
				}else{
					uni.showToast({
						icon:'none',
						title:'该设备未安装GPS'
					})
				}
			}else if(e.index == 2){
				if(this.isShowShare){
					this.shareToWX();
				}else{
					uni.showToast({
						icon:'none',
						title:'暂无分享权限'
					})
				}
				
			}
		},
		canScroll(val){
			if(val =='0'){
				this.tabScroller = false
			}else{
				this.tabScroller = true
			}
		},
		isuser(item) {
			if (item.canUploadFile == '0') {
				return false;
			} else {
				return true;
			}
		},
		//分享
		shareToWX(){
			let url = this.$url.BASE_SHARE_URL + "share/machine-share.html?licenseId=" + this.dataDic.licenseId;
			let titleStr = this.dataDic.printCode ? this.dataDic.printCode : '--' + '  |  ' + this.dataDic.licenseId
			let printCodeStr = this.dataDic.printCode ? this.dataDic.printCode : '--'
			let hort = this.dataDic.machineHeightDesc ? this.dataDic.machineHeightDesc : (this.dataDic.tonnageName ? this.dataDic.tonnageName : '-')
			let resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
			let companyName = "-";
			let name = "-";
			let phone = "-";
			let imageUrl = (this.dataDic.fileList && this.dataDic.fileList.length > 0) ? this.dataDic.fileList[0].url : '/static/share_icon.png'
			if(resData){
				companyName = resData.lesseeInfo ? resData.lesseeInfo.tenantName : '-';
				name = resData.username ? resData.username : '-';
				phone = resData.username ? resData.phoneNum : '-';
			}
			let desc = companyName + '欢迎您' + '\n' + name + ' ' + phone
			let shareInfo={
				href:url,
				title:printCodeStr + '  |  ' + hort,
				desc:desc,
				imgUrl:imageUrl
			};
			let shareObjBG = share(shareInfo,this.$gxfmethod.shareList(),(index)=>{
				let shareObj={
					href:shareInfo.href||"",
					title:shareInfo.title||"",
					summary:shareInfo.desc||"",
					success:(res)=>{
						shareObjBG.alphaBg.hide();
						shareObjBG.shareMenu.hide();
					},
					fail:(err)=>{
						console.log("fail:" + JSON.stringify(err));
					}
				};
				switch (index) {
					case 0:
						shareObj.provider="weixin";
						shareObj.scene="WXSceneSession";
						shareObj.type=0;
						shareObj.imageUrl=shareInfo.imgUrl||"";
						uni.share(shareObj);
						break;
					case 1:
						shareObj.provider="weixin";
						shareObj.scene="WXSenceTimeline";
						shareObj.type=0;
						shareObj.imageUrl=shareInfo.imgUrl||"";
						uni.share(shareObj);
						break;
				};
			});
			this.$nextTick(()=>{
				shareObjBG.alphaBg.show();
				shareObjBG.shareMenu.show();
			})
		},
		// 获取详情
		getDetailWithLiceseID(licenseId) {
			let urlstr = this.$url.MACHINE_RECORD_DETAIL + licenseId;
			this.$network.getData(urlstr, 'GET', null).then(result => {
				this.dataDic = {
					...result
				};
				this.idDataDicNull=this.isObjEmpty(this.dataDic);
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		},
		isObjEmpty(o){
        for(var key in o){
          return false
        }
        return true
    },
		//时间处理
		changestr(str) {
			if (str == null) {
				return '--';
			}
			return str.split(' ')[0];
		},
		//显示分组类型
		changeGroup(){
			this.isshowContract = !this.isshowContract
			this.dealCircleList(this.circleTreeList, this.dataDic.licenseId)
		},
		orderReset(){
			this.positiveOrder = !this.positiveOrder
			let reverseList = [...this.lifecycleRecord.reverse()]
			this.lifecycleRecord = [...reverseList];
		},
		showFiltterView(){
			this.showFiltter = !this.showFiltter
		},
		getExArrow(e){
			let item = e.item;
			let index = e.index;
			let dict = {
				...item,
				exportArrow:!item.exportArrow
			}
			this.contractcycleRecord.splice(index,1,dict);
		},
		gotosearch(type){
			uni.showLoading();
			if(type == 'reset'){
				this.showFiltter = false;
				this.beginDate = "";
				this.endDate = "";
				this.dealCircleList(this.circleTreeList, this.dataDic.licenseId)
			}else{
				this.dealCircleList(this.circleTreeList, this.dataDic.licenseId)
			}
		},
		showPick(e,type){
			this.selectType = type;
			if(type == 'show'){
				uni.navigateTo({
					url: './life-circle-flitter?item=' + encodeURIComponent(JSON.stringify(this.circleTreeList))
				})
			}else{
				this.$refs.date.show();
			}
		},
		onConfirm(val){
			if(this.selectType =='begin'){
				this.beginDate = val.result
				console.log(this.beginDate)
			}else if(this.selectType =='end'){
				this.endDate = val.result
			}
		},
		//生命周期数据处理,获取生命周期树状图
		getCircleData(licenseId) {
			uni.showLoading()
			this.$network.getData(this.$url.MACHINE_LIVE_CIRCLE_FILTER, 'GET', null).then(result => {
				this.circleTreeList = result.map((o) => {
					return {
						...o,
						checked: this.isclickChoose(o.child)
					}
				});
				this.dealCircleList(this.circleTreeList, licenseId)
				uni.hideLoading();
			}).catch(err => {
				this.getlifecircle([], licenseId)
				uni.hideLoading();
			});
		},
		dealCircleList(result, licenseId) {
			let circleTypeList = [];
			result.forEach((o) => {
				if (o.checked) {
					let child = o.child || [];
					child.forEach((a) => {
						if (a.checked) {
							circleTypeList.push(a)
						}
					})
				}
			})
			this.typeshow = this.isallChoose(result) ? '全部' : '个性化';
			if (this.isshowContract) {
				//合同
				this.getContractlifecircle(circleTypeList, licenseId);
			} else {
				//非合同
				this.getlifecircle(circleTypeList, licenseId);
			}
		},
		//全部选中
		isallChoose(list) {
			let contactList = [];
			list.forEach(o => {
				contactList = contactList.concat(o.child);
			})
			return contactList.every((o) => {
				return o.checked == true
			})
		},
		//判断某项存在选中
		isclickChoose(list) {
			return list.some((o) => {
				return o.checked == true
			})
		},
		//数据
		//获取生命周期数据
		getlifecircle(circleTypeList, licenseId) {
			let filtterarr = [];
			circleTypeList.forEach(o => {
				filtterarr.push(o.value);
			});
			let paramDic = {
				licenseId: licenseId,
				current: this.page,
				size: 10000,
				businessTypeList: filtterarr,
				startTime: this.beginDate == '' ? undefined : (this.beginDate + " 00:00:00"),
				endTime: this.endDate == '' ? undefined : (this.endDate + " 23:59:59")
			};
			this.$network.getData(this.$url.MACHINE_RECORD_NEWLIFECYCLE, 'POST', paramDic).then(result => {
				this.lifecycleRecord = [...result.records];
				this.positiveOrder = true;
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		},
		getContractlifecircle(circleTypeList, licenseId) {
			let filtterarr = [];
			circleTypeList.forEach(o => {
				filtterarr.push(o.value);
			});
			let paramDic = {
				licenseId: licenseId,
				current: this.page,
				size: 10000,
				businessTypeList: filtterarr,
				startTime: this.beginDate == '' ? undefined : (this.beginDate + " 00:00:00"),
				endTime: this.endDate == '' ? undefined : (this.endDate + " 23:59:59")
			};
			this.$network.getData(this.$url.MACHINE_RECORD_GROUP_LIFECYCLE, 'POST', paramDic).then(result => {
				this.contractcycleRecord = result.map((o) => {
					return {
						...o,
						exportArrow: false
					}
				});
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		},
	}
};
</script>

<style scoped lang="scss">
.record-detail-bg-view {
	width: 100%;
  height:100%;
	background: $uni-bg-color-grey;
  @include flex(column);
}
.title-search-bg-position{
	position: fixed;
	width: 100%;
	top: 0px;
	display: flex;
	flex-direction: column;
	background:#FFFFFF;
	z-index: 50;
}
.line-css{
	width: 100%;
	height: 8px;
	background: $uni-bg-color-grey;
	z-index: 105;
}
.title-search-bg{
	display: flex;
	flex-direction: column;
	background:#FFFFFF;
	z-index: 105;
	margin-bottom: 16px;
}
.title-search{
	display: flex;
	flex-direction: row;
	padding: 12px;
	align-items: center;
	background:#FFFFFF;
}
.title-left-text{
	font-weight: bold;
	font-size: 16px;
}
.left-title-search{
	display: flex;
	flex: 1;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}
.group-check{
	display: flex;
	flex-direction: row;
	font-size: $uni-font-size-base;
	align-items: center;
}
.filtter-click{
	display: flex;
	color: #E60000;
	font-size: $uni-font-size-base;
}
.filtter-item-bg{
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding:0px 12px;
	align-items: center;
}
.bottom-save-btn{
	display: flex;
	flex-direction: row;
	padding: 12px;
}
.left-save-btn{
	flex: 1;
	margin-right: 10px;
	padding: 8px 0px;
	background: #F0F2F4;
	color: #000000;
	font-size: $uni-font-size-base;
	border-radius: 4px;
	text-align: center;
}
.right-save-btn{
	flex: 1;
	margin-left: 10px;
	padding: 8px 0px;
	background: $uni-color-primary;
	color: #FFFFFF;
	font-size: $uni-font-size-base;
	border-radius: 4px;
	text-align: center;
}

</style>
