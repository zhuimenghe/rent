<template>
	<view class="creat-person-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="company">
			<view class="sum-view-bg" style="margin-bottom: 5px;">
				<view class="cell-input-view" style="flex: 1;height: 40px; border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
					<text class="boldstyle">基本信息</text>
				</view>
				<select-label-item 
				tagName="区域" 
				isRequired="true" 
				hint="请选择区域" 
				:value="companyDic.orgName" 
				:icon="righticon" 
				@clickItemLabel="choosearea" 
				/>
				<select-label-item 
				tagName="业务负责人" 
				isRequired="true" 
				hint="请选择业务负责人" 
				:value="companyDic.salesmanName" 
				:icon="righticon" 
				@clickItemLabel="chooseowner" 
				/>
				<view class="cell-input-view">
					<view class="cell-input-view-left">
						<text>客户名称</text>
						<text style="color: #FF0000;">*</text>
					</view>
					<view class="cell-input-view-right">
						<input 
						class="input-style" 
						type="text" 
						v-model="companyDic.name" 
						placeholder="请输入客户名称...." 
						/>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>客户地址</text></view>
					<view class="cell-input-view-right">
						<input 
						class="input-style" 
						type="text" 
						v-model="companyDic.address" 
						placeholder="请输入客户地址...." 
						/>
					</view>
				</view>
				<imgupload
					@uploadfinish="uploadfinishYyzz"
					@deleteUrl="deleteUrlYyzz"
					type="business_license"
					uploadType="attachment"
					maximg="1"
					title="营业执照"
					:imgFinishlist="companyDic.businessLicenseList?companyDic.businessLicenseList : []"
				/>
				<imgupload
					@uploadfinish="uploadfinishOthoer"
					@deleteUrl="deleteUrlOthoer"
					type="other_attachments"
					uploadType="attachment"
					maximg="20"
					title="其他附件"
					:imgFinishlist="companyDic.otherAttachmentsList?companyDic.otherAttachmentsList : []"
				/>
				<text-label-item 
				tagName="备注" 
				placeholder="请输入备注..." 
				@ipnuttext="remarkmethod" 
				:inputValue="companyDic.remark"
				/>
			</view>
			<view class="sum-view-bg" style="margin-bottom: 5px;">
				<view class="cell-input-view" style="flex: 1;height: 40px; border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
					<text class="boldstyle">发票抬头</text>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>银行账号</text></view>
					<view class="cell-input-view-right">
						<input 
						class="input-style" 
						type="text"
						v-model="companyDic.bankAccount" 
						placeholder="请输入银行账号...."
						/>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>开户行</text></view>
					<view class="cell-input-view-right">
						<input 
						class="input-style" 
						type="text" 
						v-model="companyDic.openingBank" 
						placeholder="请输入开户行...." 
						/>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>纳税人识别号</text></view>
					<view class="cell-input-view-right">
						<input 
						class="input-style" 
						type="text" 
						v-model="companyDic.taxNumber" 
						placeholder="请输入纳税人识别号...." 
						/>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>公司固话</text></view>
					<view class="cell-input-view-right">
						<input 
						class="input-style" 
						type="text" 
						v-model="companyDic.fixPhone" 
						placeholder="请输入公司固话...." 
						/>
					</view>
				</view>
			</view>
			<view class="sum-view-bg" style="margin-bottom: 80px;">
				<view class="cell-input-view" style="flex: 1;height: 40px; border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;">
					<text class="boldstyle">联系人信息</text>
				</view>
				<list>
					<cell v-for="(item, index) in companyDic.contactsList || []" :key="index">
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>联系人</text></view>
							<view class="cell-input-view-right">
								<text class="input-style">{{ item.name || '-' }}</text>
							</view>
						</view>
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>手机号</text></view>
							<view class="input-style"><labelPhone :value="item.phoneNum" /></view>
						</view>
						<view v-for="(d, i) in item.secondaryPhoneList" :key="i">
							<view class="cell-input-view">
								<view class="cell-input-view-left">
									<text>副手机号{{ i + 1 }}</text>
								</view>
								<view class="cell-input-view-right">
									<view class="input-style"><labelPhone :value="d" /></view>
								</view>
							</view>
						</view>
						<view class="cell-input-view">
							<view class="cell-input-view-left"><text>职责</text></view>
							<text class="input-style">{{ getdutyStr(item.dutyList) }}</text>
						</view>
						<view class="cell-bottom-view">
							<view class="btn-view style-tilte-two" @click="editconnect(item, index)"><text>修改</text></view>
							<view class="btn-view style-tilte-three" @click="deleteconnect(item, index)"><text>删除</text></view>
						</view>
						<view style="height: 1px;flex: 1;background: #EEEEEE;" />
					</cell>
					<cell>
						<view class="cell-input-view" style="margin-top: 10px;">
							<view class="add-contract-view" @click="gotoconnect"><text>+ 新增联系人</text></view>
						</view>
					</cell>
				</list>
			</view>
		</view>
		<view class="bottom-view">
			<view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
			<view class="bottom-right-view" @click="clicksave"><text>保存</text></view>
		</view>
		<!-- 类型选择 -->
		<w-picker 
		:selectList="selectList" 
		@confirm="dialog" 
		mode="selector" 
		ref="selector" 
		themeColor="#E60000" 
		/>
	</view>
</template>
<script>
import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';
import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
import labelPhone from '@/components/common/common-ui/label-phone.vue';
export default {
	components: {
		selectLabelItem,
		wPicker,
		imgupload,
		textLabelItem,
		labelPhone
	},
	data() {
		return {
			righticon: 'iconarrow-right',
			areaList: [],
			ownerList: [],
			selectList: [],
			isedit: false,	
			//------
			personDic:{},
			companyDic:{},
			customerType:'1'
		};
	},
	onLoad(option) {
		if (option.edit == 'true') {
			let item = JSON.parse(decodeURIComponent(option.item));
			this.getDetailWithId(item.id);
			this.isedit = true;
		} else {
			let res = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
			if (res) {
				// if (res.roleType === this.$savekey.USER_ROLE_BUSINESS) {
				if(this.$gxfmethod.issameRoleType(res,this.$savekey.USER_ROLE_BUSINESS)) {
					this.companyDic = {
						...this.companyDic,
						orgId: res.orgIds[0],
						orgName: res.orgName,
						salesman: res.id,
						salesmanName: res.username
					};
					this.personDic = {
						...this.personDic,
						orgId: res.orgIds[0],
						orgName: res.orgName,
						salesman: res.id,
						salesmanName: res.username
					};
				}else{
					this.companyDic = {
						...this.companyDic,
						orgId: res.orgName,
						orgName: res.orgIds[0]
					};
					this.personDic = {
						...this.personDic,
						orgId: res.orgName,
						orgName: res.orgIds[0],
					};
				}
			}
		}
		//企业用户回传联系人
		uni.$on('refreshData-connect', item => {
			let dict = item.item;
			let list = this.companyDic.contactsList || []
			if (item.index == -1) {
				list.push(dict);
			} else {
				list.splice(item.index, 1, dict);
			}
			this.companyDic = {
				...this.companyDic,
				contactsList:[...list]
			}
		});
		this.loadAreaList();
	},
	onUnload() {
		uni.$off('refreshData-connect');
	},
	methods: {
		//根据id获取客户详情
		getDetailWithId(customId) {
			let url = this.$url.CUSRTOMER_DETAIL + customId;
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					if(this.customerType === '1'){
						this.companyDic = {
							...result
						};
					}else{
						this.personDic = {
							...result
						};
					}
				})
				.catch(err => {});
		},
		getdutyStr(list) {
			let strlist = [];
			list.map(item => {
				if (item === '1') {
					strlist.push('法人');
				}
				if (item === '2') {
					strlist.push('合同');
				}
				if (item === '3') {
					strlist.push('结算');
				}
				if (item === '4') {
					strlist.push('进退场');
				}
			});
			let str = strlist.join(',');
			return str;
		},
		//加载地区
		loadAreaList() {
			uni.showLoading();
			let urlstr = this.$url.ORG_LIST;
			this.$network
				.getData(urlstr, 'GET', null)
				.then(result => {
					let list = result;
					this.areaList = this.getChildren(list);
					if (this.isedit === false) {
						if (this.areaList.length > 0) {
							let org = this.areaList.find(item => {
								if (item.value === this.companyDic.orgId) {
									return item;
								}
							});
							this.loadOwnerList(item.value, true);
						}
					} else {
						this.loadOwnerList(this.companyDic.orgId, false);
					}
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		getChildren(data) {
			let arr = [];
			if (data) {
				data.forEach(o => {
					let a = {
						value: o.id,
						label: o.name
					};
					arr = [...arr, a];
					if (o.children && o.children.length > 0) {
						arr = [...arr, ...this.getChildren(o.children)];
					}
				});
			}
			return arr;
		},
		//加载负责人
		loadOwnerList(orgId, isfirst) {
			let param = {
				showAdmin: false,
				orgId: orgId ? orgId : '',
				roleType: this.$savekey.USER_ROLE_BUSINESS
			};
			uni.showLoading();
			this.$network
				.getData(this.$url.USER_LEADERS, 'GET', param)
				.then(result => {
					let list = result;
					this.ownerList = list.map(dict => {
						return {
							label: dict.username,
							value: dict.id
						};
					});
					if (isfirst === true) {
						if (this.ownerList.length > 0 && !this.companyDic.salesmans) {
							this.ownerDic = this.ownerList[0];
						}
					}
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		//-----------------------------
		choosearea() {
			this.type = 'area';
			this.selectList = [];
			this.selectList = [...this.areaList];
			this.showdialog();
		},
		chooseowner() {
			this.type = 'owner';
			this.selectList = [];
			this.selectList = [...this.ownerList];
			this.showdialog();
		},
		//显示底部picker
		showdialog() {
			this.$refs.selector.show();
		},
		//弹窗回调
		dialog(val) {
			if (this.type === 'area') {
				let res = val.checkArr;
				if(this.customerType === '1'){
					this.companyDic = {
						...this.companyDic,
						orgId: res.value,
						orgName: res.label
					};
				}else{
					this.personDic = {
						...this.personDic,
						orgId: res.value,
						orgName: res.label
					};
				}
				this.loadOwnerList(res.value, true);
			} else if (this.type === 'owner') {
				if(this.customerType === '1'){
					this.companyDic = {
						...this.companyDic,
						salesman: res.value,
						salesmanName: res.label
					};
				}else{
					this.personDic = {
						...this.personDic,
						salesman: res.value,
						salesmanName: res.label
					};
				}
			}
		},
		//企业用户删除联系人
		deleteconnect(item, index) {
			let list  = this.companyDic.contractList || [];
			list.splice(index, 1);
			this.companyDic = {
				...this.companyDic,
				contractList: [...list],
			};
		},
		//企业用户编辑联系人
		editconnect(item, index) {
			item={
				...item,
				type:2
			}
			let url = './connect-create?item=' + encodeURIComponent(JSON.stringify(item)) + '&edit=true&index=' + index;
			uni.navigateTo({
				url: url
			});
		},
		//企业用户新增联系人
		gotoconnect() {
			let item={
				type:2
			}
			let url = './connect-create?edit=false'+'&item=' + encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: url
			});
		},
		//营业执照
		uploadfinishYyzz(val) {
			let list = val.data;
			this.companyDic = {
				...this.companyDic,
				businessLicenseList: [...list],
			};
		},
		deleteUrlYyzz(val) {
			let list = val.data;
			this.companyDic = {
				...this.companyDic,
				businessLicenseList: [...list],
			};
		},
		//其他附件
		uploadfinishOthoer(val) {
			let list = val.data;
			this.companyDic = {
				...this.companyDic,
				otherAttachmentsList: [...list],
			};
		},
		deleteUrlOthoer(val) {
			let list = val.data;
			this.companyDic = {
				...this.companyDic,
				otherAttachmentsList: [...list],
			};
		},
		//个人身份证正面
		uploadfinishFront(val) {
			let list = val.data;
			this.personDic = {
				...this.personDic,
				identityCardFront: [...list],
			};
		},
		deleteUrlFront(val) {
			let list = val.data;
			this.personDic = {
				...this.personDic,
				identityCardFront: [...list],
			};
		},
		////个人身份证反面
		uploadfinishBehind(val) {
			let list = val.data;
			this.personDic = {
				...this.personDic,
				identityCardBehind: [...list],
			};
		},
		deleteUrlBehind(val) {
			let list = val.data;
			this.personDic = {
				...this.personDic,
				identityCardBehind: [...list],
			};
		},
		//附件列表上传附件回调
		uploadAttachment(val) {
			let list = val.data;
			this.personDic = {
				...this.personDic,
				fileList: [...list],
			};
		},
		//附件列表删除附件
		deleteAttachment(val) {
			let list = val.data;
			this.personDic = {
				...this.personDic,
				fileList: [...list],
			};
		},
		//显示弹窗
		remarkmethod(val) {
			this.remark = val;
			if(this.customerType === '1'){
				this.companyDic = {
					...this.companyDic,
					remark: val,
				};
			}else{
				this.personDic = {
					...this.personDic,
					remark: val
				};
			}
		},
		//取消按钮
		clickecancle() {
			uni.navigateBack({
				delta: 1
			});
		},
		//确定按钮
		clicksave() {
			console.log(JSON.stringify(this.companyDic));
			return
			if (this.areaDic.label == undefined || this.areaDic.label === '') {
				uni.showToast({
					icon: 'none',
					title: '请选择区域'
				});
				return;
			}
			if (this.ownerDic.label === undefined || this.ownerDic.label === '') {
				uni.showToast({
					icon: 'none',
					title: '请选择业务负责人'
				});
				return;
			}
			if (this.customName === '') {
				uni.showToast({
					icon: 'none',
					title: '请输入姓名'
				});
				return;
			}
			// if (this.phoneNum === '') {
			// 	uni.showToast({
			// 		icon: 'none',
			// 		title: '请输入手机号'
			// 	});
			// 	return;
			// }
			// if(this.$datestr.isphonenum(this.phoneNum) === false){
			// 	uni.showToast({
			// 		icon: 'none',
			// 		title: '请输入正确手机号'
			// 	});
			// 	return;
			// }
			if (this.contractList.length === 0) {
				uni.showToast({
					icon: 'none',
					title: '请添加联系人'
				});
				return;
			}
			this.httprequestData();
		},
		httprequestData() {
			uni.showLoading({
				mask: true
			});
			this.saveDic.orgId = this.areaDic.value;
			this.saveDic.salesman = this.ownerDic.value;
			this.saveDic.name = this.customName;
			this.saveDic.address = this.customAddress;
			this.saveDic.businessLicenseList = this.yyzzDic;
			this.saveDic.otherAttachmentsList = this.otherDic;
			this.saveDic.remark = this.remark;
			this.saveDic.type = '1';
			this.saveDic.bankAccount = this.bankAccount;
			this.saveDic.openingBank = this.openingBank;
			this.saveDic.taxNumber = this.taxNumber;
			this.saveDic.fixedPhone = this.fixPhone;
			this.saveDic.contactsList = this.contractList;

			let method = 'POST';
			if (this.isedit === true) {
				method = 'PUT';
			}
			this.$network
				.getData(this.$url.LINKMAN_PERSON_CREAT, method, this.saveDic)
				.then(result => {
					uni.hideLoading();
					uni.showToast({
						title: '修改成功',
						icon: 'none'
					});
					uni.$emit('refreshData-linkman', {
						type: 'company'
					});
					uni.navigateBack({
						delta: 1
					});
				})
				.catch(err => {
					uni.hideLoading();
					if (err.code == 50003) {
						uni.showToast({
							title: err.details[0],
							icon: 'none'
						});
					} else {
						uni.showToast({
							title: err.details && err.details[0] ? err.details[0] : err.message,
							icon: 'none'
						});
					}
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.creat-person-bg {
	display: flex;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}
.company{
	display: flex;
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
	margin: 10px;
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
	font-size: $uni-font-size-base;
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

.add-contract-view {
	display: flex;
	flex: 1;
	height: 40px;
	margin-left: 20px;
	margin-right: 20px;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	background: $uni-color-primary;
	font-size: $uni-font-size-base;
}

.cell-bottom-view {
	display: flex;
	flex: 1;
	height: 50px;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
}

.btn-view {
	display: flex;
	border-radius: 5px;
	margin-right: 10px;
	width: 60px;
	height: 30px;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	font-size: $uni-font-size-base;
}

.style-tilte-one {
	background: #E60000;
	color: #ffffff;
}

.style-tilte-two {
	background: #FE931F;
	color: #eeeeee;
}

.style-tilte-three {
	background: #fffcf7;
	color: #f9c0c8;
}

.boldstyle {
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin: 10px;
}
</style>
