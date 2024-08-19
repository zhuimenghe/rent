<template>
	<view class="creat-invoice-bg">
		<view class="sum-view-bg" style="margin-bottom: 5px;">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>客户信息</text></view>
			</view>
			<select-label-item tagName="客户名称" isRequired="true" hint="请选择客户" :value="customDic.name" :icon="companyicon"
			 @clickItemLabel="gotocustom" />
			<view v-show="ischoose">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>区域</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{customDic.orgName || ""}}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>业务负责人</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{customDic.salesmanName || ""}}</text>
					</view>
				</view>
				<!-- <view v-show="isperson"> -->
				<!-- <view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
					    <view class="cell-input-view-left"><text>开票信息</text></view>
				    </view> -->
				<!-- <view class="cell-input-view">
					<view class="cell-input-view-left"><text>发票抬头</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" type="text" v-model="invoicedes" placeholder="请输入发票抬头" />
					</view>
				</view> -->
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>开户行</text></view>
					<view class="cell-input-view-right">
						<!-- <text class="input-style"  >{{customDic.openingBank || ""}}</text> -->
						<input class="input-style" type="text" v-model="customDic.openingBank" placeholder="请输入开户行" />
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>银行账号</text></view>
					<view class="cell-input-view-right">
						<!-- <text class="input-style"  >{{customDic.bankAccount || ""}}</text> -->
						<input class="input-style" type="text" v-model="customDic.bankAccount" placeholder="请输入银行账号" />
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>识别号</text></view>
					<view class="cell-input-view-right">
						<!-- <text class="input-style"  >{{customDic.taxNumber || ""}}</text> -->
						<input class="input-style" type="text" v-model="customDic.taxNumber" placeholder="请输入识别号" />
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>电话</text></view>
					<view class="cell-input-view-right">
						<!-- <text class="input-style"  >{{customDic.fixedPhone || ""}}</text> -->
						<input class="input-style" type="text" v-model="customDic.fixedPhone" placeholder="请输入联系电话" />
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>单位地址</text></view>
					<view class="cell-input-view-right">
						<!-- <text class="input-style"  >{{customDic.address || ""}}</text> -->
						<input class="input-style" type="text" v-model="customDic.address" placeholder="请输入单位地址" />
					</view>
				</view>
				<!-- </view> -->
				<select-label-item tagName="合同名称" hint="请选择合同" :value="contractDicName" :icon="righticon" @clickItemLabel="gotoContract" />
			</view>
		</view>
		<view class="sum-view-bg">
			<view class="cell-input-view" style="border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
				<view class="cell-input-view-left boldstyle"><text>发票信息</text></view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>发票编号</text><text style="color: #FF0000;">*</text></view>
				<view class="cell-input-view-right">
					<input class="input-style" type="text" v-model="invoicenum" placeholder="请输入发票编号" />
				</view>
			</view>
			<select-label-item tagName="开票日期" hint="请选择日期" isRequired="true" :value="invoiceDate" :icon="dateIcon"
			 @clickItemLabel="showCalendar" />
			<select-label-item tagName="发票类型" hint="请选择发票类型" isRequired="true" :value="invoiceTypeDic.label" :icon="righticon"
			 @clickItemLabel="showdialog" />
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>开票金额(含税)</text></text><text style="color: #FF0000;">*</text></view>
				<view class="cell-input-view-right">
					<input class="input-style" type="digit" v-model="moneytotal" placeholder="请输入金额" />
				</view>
			</view>
			<view class="cell-input-view">
				<view class="cell-input-view-left"><text>税率(%)</text></view>
				<view class="cell-input-view-right">
					<input class="input-style" type="digit" v-model="taxrate" placeholder="请输入税率" />
				</view>
				%
			</view>
			<!-- 上传图片 -->
			<imgupload @uploadfinish="uploadfinish" @deleteUrl="deleteUrl" type="invoice_type" uploadType="attachment" maximg="20"
			 :imgFinishlist="fileList" />

			<text-label-item tagName="备注" placeholder="请输入备注..." @ipnuttext="remarkmethod" :inputValue="remark" />
		</view>
		<view class="bottom-view">
			<view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
			<view class="bottom-right-view" @click="clicksave"><text>确定</text></view>
		</view>
		<!-- 日历 -->
		<uni-calendar style="z-index: 899;" :date="invoiceDate" @confirm="confirm" :insert="false" ref="calendar" />
		<!-- 类型选择 -->
		<w-picker :selectList="selectList" @confirm="dialog" v-show="isshow" mode="selector" ref="selector" themeColor="#E60000" />

		<alertPopup ref="aletrview" @getAssignList="getAssignList" :mask-click="true" />
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import textLabelItem from "@/components/common/uni-item/text-label-item.vue";
	// import uniCalendar from '@/components/common/uni-calendar/uni-calendar.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import alertPopup from '@/components/common/uni-popup/alert-pop.vue';
	import imgupload from '@/components/common/image-upload/image-upload.vue';
	export default {
		components: {
			selectLabelItem,
			textLabelItem,
			// uniCalendar,
			wPicker,
			imgupload,
			alertPopup
		},
		watch:{
			'customDic.openingBank'(val){
				
			},
			'customDic.bankAccount'(val){
				
			},
			'customDic.taxNumber'(val){
				
			},
			'customDic.fixedPhone'(val){
				console.log("fixedPhone"+this.customDic.fixedPhone)
			},
			'customDic.address'(val){
				
			}
		},
		data() {
			return {
				dateIcon: "iconzl--rili",
				companyicon: "iconiconzhengli_zuzhijiagou",
				righticon: "iconarrow-right",
				ischoose: false, //是否选择联系人
				isperson: false, //是否是个人或者企业
				customDic: {}, //用户信息
				contractDic: {
					contractDetailDto: {

					}
				},
				contractDicName: "",
				invoicedes: '', //发票抬头
				invoicenum: '', //发票编号
				invoiceDate: '', //开票日期
				invoiceTypeDic: {}, //发票类型
				moneytotal: "", //金额
				taxrate: "", //税率
				picList: [], //图片列表
				remark: "", //备注
				selectList: [], //发票列表
				fileList: [], //图片列表
				businessNo: "",
				backType: -1,
				backDic: {},
				backDicDetail: {},
			};
		},
		onLoad(option) {
			console.log("option" + JSON.stringify(option.backType))
			if (option.backType === "1" || option.backType === "2") {
				//退回1撤回2
				this.backType = Number(option.backType);
				this.backDic = JSON.parse(decodeURIComponent(option.item));
				this.loaddata(this.backDic.businessNo)
			} else {
				this.invoiceDate = this.$datestr.getnowdate();
				this.getBusinessNo();
			}
			this.loadInvoiceType();
			//监听公司联系人返回
			uni.$on('linkman-emit-conpany', usnerinfo => {
				console.log('conpany' + JSON.stringify(usnerinfo.dict))
				this.ischoose = true;
				this.isperson = true;
				this.customDic = usnerinfo.dict;
				this.invoicedes = this.customDic.name;
				this.contractDic = {
					contractDetailDto: {

					}
				};
				this.contractDicName = "";
			});
			//监听个人联系人返回
			uni.$on('linkman-emit-person', usnerinfo => {
				console.log('person' + JSON.stringify(usnerinfo.dict))
				this.ischoose = true;
				this.isperson = false;
				this.customDic = usnerinfo.dict;
				this.invoicedes = this.customDic.name;
				this.contractDic = {
					contractDetailDto: {

					}
				};
				this.contractDicName = "";
			});
			uni.$on('choose-contract-emit', usnerinfo => {
				this.contractDic = usnerinfo.dict;
				this.customDic = {
					...this.customDic,
					salesman: this.contractDic.contractDetailDto.customerSalesman || "",
					salesmanName: this.contractDic.contractDetailDto.customerSalesmanName || "",
					orgId:this.contractDic.orgId || "",
					orgName:this.contractDic.orgName || "",
				}
				
				this.contractDicName = this.contractDic.customerName + "-" + this.contractDic.contractDetailDto.projectName
			});
		},
		onUnload() {
			// 取消监听事件
			uni.$off('linkman-emit-person');
			uni.$off('linkman-emit-conpany');
			uni.$off('choose-contract-emit');
		},
		methods: {
			/**
			 * 获取单号
			 */
			getBusinessNo() {
				let url = this.$url.CREATE_SETTLE_NO.replace(/contractapi/, "settleapi").replace(/{type}/, 'KP')
				this.$network.getData(url, "GET", null).then((result) => {
					this.businessNo = result;
				}).catch((err) => {

				})
			},
			loaddata(key) {
				uni.showLoading()
				let url = this.$url.SETTLE_INVOICE_DETAIL + key
				this.$network
					.getData(url, 'GET', null)
					.then(result => {
						this.dealData(result)
						uni.hideLoading()
					})
					.catch(err => {
						uni.hideLoading()
					});
			},
			dealData(result) {
				this.ischoose = true;
				this.businessNo = result.businessNo;
				this.backDicDetail = result;
				this.customDic = {
					id: result.customerId || "",
					name: result.customerName || "",
					orgId: result.orgId || "",
					orgName: result.orgName || "",
					address: result.address || "",
					fixedPhone: result.phoneNum || "",
					openingBank: result.openingBank || "",
					bankAccount: result.bankAccount || "",
					taxNumber: result.taxNumber || "",
					salesman: result.customerSalesman || "",
					salesmanName: result.customerSalesmanName || "",
				}
				let customerType = result.customerType;
				if (customerType == '1') {
					this.isperson = true;
				} else {
					this.isperson = false;
				}
				if (result.contractNo != "") {
					this.contractDic = {
						businessNo: result.businessNo || "",
						contractDetailDto: {
							id: result.contractDetailId,
							projectName: result.projectName,
						}
					}
					this.contractDicName = result.customerName + "-" + this.contractDic.contractDetailDto.projectName
				}

				this.invoicenum = result.invoiceNo,
					this.invoiceDate = this.changestr(result.invoiceDate);

				this.invoiceTypeDic = {
					value: result.type,
					label: result.typeName
				}
				this.moneytotal = result.total || "";
				this.taxrate = result.tariff || "";
				this.fileList = result.fileList || []
				this.remark = result.comment || "";
			},
			changestr(str) {
				if (str == null) {
					return '';
				}
				return str.split(' ')[0];
			},
			//加载发票类型
			loadInvoiceType() {
				uni.showLoading();
				this.$network.loadType('invoice_type')
					.then(result => {
						this.selectList = result;
						if (this.selectList.length > 0) {
							this.invoiceTypeDic = this.selectList[0];
						}
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			//显示日历
			showCalendar() {
				this.$refs.calendar.open()
			},
			showdialog() {
				this.$refs.selector.show()
			},
			//跳入合同列表
			gotoContract() {
				let customid = this.customDic.id;
				let url = "/businessPages/invoice/contract-choose?customid=" + customid;
				uni.navigateTo({
					url: url
				});
			},
			//跳入联系人列表
			gotocustom() {
				uni.navigateTo({
					url: '/otherPages/linkman/linkman?nextview=false'
				});
			},
			//显示弹窗
			remarkmethod(val) {
				this.$datestr.printlog(val);
				this.remark = val;
			},
			//日历回调
			confirm(e) {
				this.$datestr.printlog(e);
				this.invoiceDate = e.fulldate
			},
			//弹窗回调
			dialog(val) {
				this.invoiceTypeDic = val.checkArr;
			},
			//上传图片回调
			uploadfinish(val) {
				let list = val.data;
				this.fileList = list;
			},
			//删除回调
			deleteUrl(val) {
				let list = val.data;
				this.fileList = list;
			},
			//取消按钮
			clickecancle() {
				uni.navigateBack({
					delta: 1
				})
			},
			//确定按钮
			clicksave() {
				if (this.customDic.id == undefined || this.customDic.id === "") {
					uni.showToast({
						icon: "none",
						title: "请选择客户"
					});
					return;
				}
				if (this.invoiceTypeDic.value === undefined || this.invoiceTypeDic.value === "") {
					uni.showToast({
						icon: "none",
						title: "请选择发票类型"
					});
					return;
				}
				if (this.moneytotal === "") {
					uni.showToast({
						icon: "none",
						title: "请输入开票金额"
					});
					return;
				}
				if (this.moneytotal === "") {
					uni.showToast({
						icon: "none",
						title: "请输入发票日期"
					});
					return;
				}
				if (this.invoiceNo === "") {
					uni.showToast({
						icon: "none",
						title: "请输入发票编号"
					});
					return;
				}
				if (this.invoiceDate === "") {
					uni.showToast({
						icon: "none",
						title: "请选择开票时间"
					});
					return;
				}

				this.httprequestData();
			},
			httprequestData() {
				uni.showLoading({
					mask: true
				});
				this.workflowcommon.iswf('invoice').then((iswf) => {
					if (iswf) {
						this.workflowcommon
							.getFirstNodeUser('settleapi', 'invoice', this.customDic.orgId, this.customDic.salesman)
							.then(showToast => {
								this.$datestr.printlog(showToast)
								if (showToast) {
									this.$refs.aletrview.open();
									uni.hideLoading();
								} else {
									if (this.backType === 1) {
										//退回
										this.thoughSaveData([], '');
									} else {
										let assnstr = this.workflowcommon.submitData(false, []);
										this.submitSaveData(assnstr);
									}
								}
							})
							.catch(error => {
								uni.hideLoading();
								uni.showToast({
									icon: "none",
									title: error.message
								});
							});
					} else {
						if (this.backType === 1) {
							//退回
							this.thoughSaveData([], '');
						} else {
							this.submitSaveData("");
						}
					}
				})

			},
			//弹窗提示返回
			getAssignList(val) {
				let alist = val.selectArr;
				if (this.backType === 1) {
					//退回
					let asList = alist.map(o => {
						return o.id
					})
					this.thoughSaveData(asList, '');
				} else {
					let assnstr = this.workflowcommon.submitData(true, alist);
					this.submitSaveData(assnstr);
				}
			},
			submitSaveData(val) {
				let customtype = 0;
				if (this.isperson === false) {
					customtype = 2;
				} else {
					customtype = 1;
				}
				let ratenum = ""
				let savedic = {
					...this.backDicDetail,
					"businessNo": this.businessNo,
					"customerId": this.customDic.id,
					"customerName": this.customDic.name || "",
					"orgId": this.customDic.orgId || "",
					"orgName": this.customDic.orgName || "",
					"address": this.customDic.address || "",
					"phoneNum": this.customDic.fixedPhone || "",
					"openingBank": this.customDic.openingBank || "",
					"bankAccount": this.customDic.bankAccount || "",
					"taxNumber": this.customDic.taxNumber || "",
					"customerSalesman": this.customDic.salesman || "",
					"customerSalesmanName": this.customDic.salesmanName || "",
					"customerType": customtype,

					"contractNo": this.contractDic.businessNo || "",
					"contractDetailId": this.contractDic.contractDetailDto.id || "",
					"projectName": this.contractDic.contractDetailDto.projectName || "",

					"invoiceNo": this.invoicenum,
					"invoiceDate": this.invoiceDate + " 06:00:00",
					"type": this.invoiceTypeDic.value,
					"typeName": this.invoiceTypeDic.label,
					"total": this.$datestr.doubleFloat(this.moneytotal),
					"tariff": this.taxrate,
					"comment": this.remark,

					fileList: this.fileList
				}

				let url = this.$url.SETTLE_INVOICE_CREAT + val;
				this.$network.getData(url, 'POST', savedic).then(result => {
						uni.$emit('refresh-contract-list', {
							type: "invoice"
						});
						uni.$emit("refresh-notification-list", {
							type: 'apply'
						})
						uni.navigateBack({
							animationDuration: 200
						});
						uni.hideLoading()
					})
					.catch(err => {
						uni.hideLoading()
						uni.showToast({
							title: err.message,
							icon: 'none'
						});
					});
			},
			thoughSaveData(val, inputstr) {
				let customtype = 0;
				if (this.isperson === false) {
					customtype = 2;
				} else {
					customtype = 1;
				}
				console.log("customDic"+JSON.stringify(this.customDic))
				let savedic = {
					...this.backDicDetail,
					"businessNo": this.businessNo,
					"customerId": this.customDic.id,
					"customerName": this.customDic.name || "",
					"orgId": this.customDic.orgId || "",
					"orgName": this.customDic.orgName || "",
					"address": this.customDic.address || "",
					"phoneNum": this.customDic.fixedPhone || "",
					"openingBank": this.customDic.openingBank || "",
					"bankAccount": this.customDic.bankAccount || "",
					"taxNumber": this.customDic.taxNumber || "",
					"customerSalesman": this.customDic.salesman || "",
					"customerSalesmanName": this.customDic.salesmanName || "",
					"customerType": customtype,

					"contractNo": this.contractDic.businessNo || "",
					"contractDetailId": this.contractDic.contractDetailDto.id || "",
					"projectName": this.contractDic.contractDetailDto.projectName || "",

					"invoiceNo": this.invoicenum,
					"invoiceDate": this.invoiceDate + " 06:00:00",
					"type": this.invoiceTypeDic.value,
					"typeName": this.invoiceTypeDic.label,
					"total": this.$datestr.doubleFloat(this.moneytotal),
					"tariff": this.taxrate,
					"comment": this.remark,

					fileList: this.fileList
				}
				uni.showLoading({
					mask: true
				});
				let jsonstr = JSON.stringify(savedic);
				this.workflowcommon
					.passapply('settleapi', val, inputstr, jsonstr, this.backDic.procDefId, this.backDic.procInstId, this.backDic
						.id)
					.then(showToast => {
						uni.$emit("refresh-notification-list", {
							type: 'wait'
						})
						uni.navigateBack({
							animationDuration: 100
						});
						uni.hideLoading();
					})
					.catch(error => {
						uni.hideLoading();
						uni.showToast({
							icon: "none",
							title: error.message
						});

					});
			},
		}
	};
</script>

<style lang="scss" scoped>
	.creat-invoice-bg {
		display: flex;
		flex: 1;
		width: 100%;
		flex-direction: column;
		background: $uni-bg-color-grey;
	}

	.sum-view-bg {
		display: flex;
		flex-direction: column;
		flex: 1;
		margin: 10px;
		margin-bottom: 70px;
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
		margin-right: 10px;
	}

	.input-style {
		flex: 1;
		text-align: right;
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
		background: #FFFFFF;
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
		color: #FFFFFF;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		margin-right: 10px;
	}

	.boldstyle {
		margin-top: 5px;
		font-size: $uni-font-size-lg;
		font-weight: bold;
		margin-bottom: 10px;
	}
</style>
