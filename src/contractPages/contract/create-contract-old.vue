<template>
	<view class="content">
		<create-step processKey="contract" @submitApply="submit" :orgId="contractDic.orgId" :itemData="backDic" @data-form="getBackData"
		 :updateObj="contractDic" :businessOwner="contractDic.customerSalesman">
			<view class="scroll-bgView">
				<list scroll-y="true" class="srcoll-container">
					<cell>
						<view class="item-container  item-distance single-item">
							<view class="label item-key">
								合同类型
								<span style="color: #FF0000;">*</span>
							</view>
							<view class="item-value-container">
								<text class="label item-value ">普通合同</text>
								<!-- <i class="iconfont gray-arrow iconarrow-right"></i> -->
							</view>
						</view>
						<view class="item-container top-line single-item">
							<view class="label item-key">
								区域
								<span style="color: #FF0000;">*</span>
							</view>
							<view class="item-value-container" @click="showPick('region', null)">
								<text class="label item-value ">{{ contractDic.orgName }}</text>
								<i class="iconfont gray-arrow iconarrow-right"></i>
							</view>
						</view>
						<view class="item-container top-line single-item">
							<view class="label item-key">
								业务负责人
								<span style="color: #FF0000;">*</span>
							</view>
							<view class="item-value-container" @click="showPick('leader', null)">
								<text class="label item-value ">{{ contractDic.contractDetailDto.customerSalesmanName }}</text>
								<i class="iconfont gray-arrow iconarrow-right"></i>
							</view>
						</view>
						<view class="item-container top-line single-item">
							<view class="label item-key">
								客户信息
								<span style="color: #FF0000;">*</span>
							</view>
							<view class="item-value-container" @click="getcustomMsg">
								<text class="label item-value value-blue">{{ contractDic.customerName || '请选择' }}</text>
								<i class="iconfont arrow iconarrow-right"></i>
							</view>
						</view>
						<view class="item-container top-line single-item" v-if="contractDic.contractDetailDto.contactName">
							<view class="label item-key">联系人</view>
							<view class="item-value-container">
								<text class="label item-value ">{{ contractDic.contractDetailDto.contactName || '' }}</text>
							</view>
						</view>
						<view class="item-container top-line single-item" v-if="contractDic.contractDetailDto.phoneNum">
							<view class="label item-key">手机号</view>
							<view class="item-value-container">
								<text class="label item-value ">{{ contractDic.contractDetailDto.phoneNum || '' }}</text>
							</view>
							<!-- <i class="iconfont gray-arrow iconarrow-right" ></i> -->
						</view>
						<!-- <view v-if="showMessage" class="item-custommsg">
							<view class="item-msg">
								<text>结算联系人</text>
								<view class="item-customdetail">{{ workcontact }}</view>
							</view>
							<view class="item-msg">
								<text>进退场联系人</text>
								<view class="item-customdetail">{{ workcontact }}</view>
							</view>
						</view> -->
						<view class="item-container item-distance single-item">
							<view class="label item-key" style="display: flex;flex-direction: row;align-items: center;">
								设备信息
								<view style="font-size: 12px;">（小计{{ totalMoney }}元）</view>
								<businessTips tipName='contractSubtotal' />
							</view>
							<view class="item-value-container label">
								<text style="color: #E60000;margin-right: 8px;" @click="addVehicle">新增</text>
								<i class="iconfont item-customdetail iconarrow-right" :id="carshow ? 'translate-arrow' : 'translate-arrow-expend'" style="{margin-right: 0px;}"
								 @click="carshow = !carshow" ref="expandArrow">
								</i>
							</view>
						</view>
						<view class="item-custommsg">
							<view v-if="carshow">
								<view v-for="(item, i) in contractDic.contractDetailDto.orderList" class="vehicle-item-container" :key="i">
									<view class="top-container">
										<view class="title-container">
											<view class="type-title">{{ item.typeName }}/{{ item.heightName || '' }}</view>
											<view class="machine-type">{{ item.machineTypeName }}</view>
										</view>

										<!--  -->
										<uni-number-box :min="1" :compare="true" @class="vehicle - num" @minusChange="showTip($event, i)" @change="getNumValue($event, i)"
										 :value="item.orderNum"></uni-number-box>
									</view>

									<view class="item-all">
										<view class="cell-container">
											<tag-select tagName="租赁方式" :isShowTip="true" tipName="rent" :value="item.settlementTypeName" @click="showPick('rentType', i)"></tag-select>
										</view>

										<view class="cell-container">
											<tag-input tagName="租赁单价(元/台)">
												<input placeholder="0.00" type="digit" :maxlength="maxlength" v-model="item.hire" @input="checkInput($event, 'hire', i)" />
											</tag-input>
										</view>
										<view class="cell-container" v-if="item.settlementType === '4'||item.settlementType === '6'">
											<tag-input tagName="月租(元/台)">
												<input placeholder="0.00" type="digit" :maxlength="maxlength" v-model="item.hireMonthly" @input="checkInput($event, 'hireMonthly', i)" />
											</tag-input>
										</view>

										<view class="cell-container">
											<tag-input tagName="押金(元/台)">
												<input placeholder="0.00" type="digit" :maxlength="maxlength" v-model="item.pledge" @input="checkInput($event, 'pledge', i)" />
											</tag-input>
										</view>
										<view class="cell-container">
											<tag-select tagName="运费类型" :value="item.carriageTypeName" @click="showPick('carriageType', i)"></tag-select>
										</view>
										<view class="cell-container">
											<tag-input tagName="运费(元/台)">
												<input placeholder="0.00" type="digit" :maxlength="maxlength" v-model="item.carriage" @input="checkInput($event, 'carriage', i)" />
											</tag-input>
										</view>
										<view class="cell-container" v-if="isShowDefault">
											<tag-select tagName="预计进场时间" :value="getDate(item.beginDate)||'--'" @click="showTimePick('beginDate', i)" />
										</view>
										<view class="cell-container" v-if="isShowDefault">
											<tag-input tagName="预计租期">
												<view style="display: flex;flex-direction: row;align-items: center;">

													<view style="display: flex;flex-direction: row; align-items: center;" v-if="item.settlementType!=='1'&&item.settlementType!=='4'&&item.settlementType!=='6'">
														<input type="number" v-model="item.whole" @input="checkNum($event, 'whole', i)" style="height: 16px;width: 32px; font-size: 14px;border: 1px solid #E9E9E9;border-radius: 4px;margin-right: 4px;text-align: center;" />
														<view>{{item.settlementType==='5'?'周':'月'}}</view>
													</view>
													<input type="number" :value="item.surplusDay" @input="checkNum($event, 'surplusDay', i,item.settlementType)"
													 style="height: 16px;width: 32px;font-size: 14px;border: 1px solid #E9E9E9;border-radius: 4px;margin-right: 4px;text-align: center;" />
													<view>天</view>
												</view>
											</tag-input>
										</view>
										<view class="cell-container">
											<tag-select tagName="预计退场时间" :value="getDate(item.endDate)||'--'" :isSelect="false" v-if="isShowDefault" />
										</view>
									</view>
									<view class="row-container">
										<tag-select tagName="指定设备" :isLabel="false" :isShowAnnotate="isShowAnnotate(item)">
											<view @click="showAssignPop(i)">
												<view v-if="item.machineList.length <= 0">未指定</view>
												<view v-else>
													<view>
														已指定
														<span style="color: #E60000;">{{ item.machineList.length }}</span>
														辆
													</view>
												</view>
											</view>
										</tag-select>
										<view style="color: #FF0000; font-size: 12px;" @click="deleteItem(i)">删除</view>
									</view>
								</view>
							</view>
						</view>
						<view class=" item-distance muti-item">
							<view class="item-container v-item ">
								<text class="item-key muti-label">支付约定</text>
								<view class="radio-container item-value">
									<selector ref="radio" @change="onChange" :list="settlementTypes" :defaultIndex="defaultIndex" type="radio"></selector>
								</view>
							</view>
						</view>
						<view class="item-container top-line single-item" v-if="isShowSettlementDateType">
							<view class="label item-key">
								结算日类型
								<span style="color: #FF0000;">*</span>
							</view>
							<view class="item-value-container" @click="showPick('settlementDateType', null)">
								<text class="label item-value ">{{ contractDic.contractDetailDto.settlementDayTypeName || '' }}</text>
								<i class="iconfont gray-arrow iconarrow-right"></i>
							</view>
						</view>
						<view class="item-container top-line single-item" v-if="isShowSettlementDate">
							<view class="label item-key">
								结算日
								<span style="color: #FF0000;">*</span>
							</view>
							<view class="item-value-container" @click="showPick('settlementDate', null)">
								<text class="label item-value ">{{ contractDic.contractDetailDto.settlementDay || '' }}号</text>
								<i class="iconfont gray-arrow iconarrow-right"></i>
							</view>
						</view>
						<view class=" item-container single-item top-line" v-if="isShowAdvance">
							<text class="label item-key">预付金额</text>
							<input class="single-input item-value" placeholder="0.00" type="digit" v-model="contractDic.contractDetailDto.advance"
							 @input="checkInput($event, 'advance', '')" />
						</view>
						<view class=" item-container single-item top-line" v-if="isShowAdvance && isShowDefault">
							<text class="label item-key">已付金额</text>
							<input class="single-input item-value" placeholder="0.00" type="digit" v-model="contractDic.contractDetailDto.paidAdvance"
							 @input="checkInput($event, 'paid', '')" />
						</view>
						<view class=" item-container single-item top-line" v-if="isShowAdvance">
							<text class="label item-key">应收金额</text>
							<view class="single-input item-value">
								{{contractDic.contractDetailDto.debtAdvance}}
							</view>
						</view>
						<view class="item-container top-line single-item">
							<view class="label item-key">
								运费减免约定
								<span style="color: #FF0000;">*</span>
							</view>
							<view class="item-value-container" @click="showPick('rentalTripType', null)">
								<text class="label item-value ">{{ contractDic.contractDetailDto.renterTripTypeName || '' }}</text>
								<i class="iconfont gray-arrow iconarrow-right"></i>
							</view>
						</view>
						<view class="item-container top-line single-item">
							<text class="label item-key">开发票</text>
							<view class="item-value-container" @click="showPick('invoice', null)">
								<text class="label item-value ">{{ contractDic.contractDetailDto.invoiceTypeName}}</text>
								<i class="iconfont gray-arrow iconarrow-right"></i>
							</view>
						</view>
						<view class="item-container top-line single-item">
							<text class="label item-key">是否需要配备操作人员</text>
							<switch class="switch" color="#E60000" @change="setNeedOperator" :checked="contractDic.contractDetailDto.allocateFlag"></switch>
						</view>
						<view v-if="contractDic.contractDetailDto.allocateFlag">
							<view class=" item-container single-item top-line">
								<text class="label item-key">人天单价</text>
								<input class="single-input item-value" type="digit" v-model="contractDic.contractDetailDto.allocatePrice"
								 @input="checkInput($event, 'person', '')" />
							</view>
							<!-- <view class=" item-container single-item top-line">
								<text class="label item-key">加班费人天</text>
								<input class="single-input item-value" type="digit" v-model="dayTotal" @input="checkInput($event,'overtime','')" />
							</view> -->
						</view>

						<view class=" item-container single-item item-distance">
							<view class="label item-key">
								工程名
								<span style="color: #FF0000;">*</span>
							</view>
							<input class="single-input item-value" v-model="contractDic.contractDetailDto.projectName" />
						</view>
						<view class="item-container top-line single-item">
							<view class="label item-key">
								作业内容
								<span style="color: #FF0000;">*</span>
							</view>
							<view class="item-value-container" @click="goTo('workType')">
								<text class="label item-value ">{{ contractDic.contractDetailDto.constructionTypeName || '' }}</text>
								<i class="iconfont gray-arrow iconarrow-right"></i>
							</view>
						</view>
						<view class="item-container top-line single-item">
							<view class="label item-key">租赁性质</view>
							<view class="item-value-container" @click="showPick('rentalPro', null)">
								<text class="label item-value ">{{ contractDic.contractDetailDto.rentalTypeName || '' }}</text>
								<i class="iconfont gray-arrow iconarrow-right"></i>
							</view>
						</view>
						<view class="item-container top-line single-item">
							<view class="label item-key">
								交付地点
								<span style="color: #FF0000;">*</span>
							</view>
							<view class="item-value-container">
								<input class="single-input item-value" placeholder="请选择交付地点" @blur="inputAddress" v-model="contractDic.contractDetailDto.deliveryPlace" />
								<i class="iconfont arrow iconzl--zuobiao" @click="chooseAddress('delivery')"></i>
							</view>
						</view>
						<!-- <view class="item-container top-line single-item" @click="chooseAddress('use')">
							<view class="label item-key">使用地点</view>
							<view class="item-value-container">
								<input class="single-input item-value" placeholder="如同交付地点无需再填" disabled="false" v-model="useAddress" />
								<i class="iconfont arrow iconzl--zuobiao"></i>
							</view>
						</view> -->
						<view class="item-container top-line single-item">
							<view class="label item-key">归还地点</view>
							<view class="item-value-container">
								<input class="single-input item-value" placeholder="如同交付地点无需再填" v-model="contractDic.contractDetailDto.returnPlace" />
								<i class="iconfont arrow iconzl--zuobiao" @click="chooseAddress('return')"></i>
							</view>
						</view>
						<view class=" top-line muti-item">
							<view class="item-container v-item ">
								<text class="item-key muti-label">其他约定</text>
								<textarea style="font-size: 15px;" v-model="contractDic.contractDetailDto.covenants"></textarea>
							</view>
						</view>
						<view class="item-container item-distance single-item" @click="isExpandInfo = !isExpandInfo">
							<view class="label item-key">补充信息</view>
							<i class="iconfont iconarrow-right" :id="isExpandInfo ? 'translate-arrow' : 'translate-arrow-expend'" ref="expandArrow"></i>
						</view>
						<view v-show="isExpandInfo" style="padding-bottom: 10px;">
							<view class="item-container top-line single-item">
								<view class="label item-key">合同签订日</view>
								<view class="item-value-container" @click="showTimePick('signieDate', '')">
									<text class="label item-value ">{{ getDate(contractDic.signDate) || '' }}</text>
									<i class="iconfont gray-arrow iconarrow-right"></i>
								</view>
							</view>
							<view class=" item-container single-item top-line">
								<text class="label item-key">纸质合同编号</text>
								<input class="single-input item-value" placeholder="请输入纸质合同编号" v-model="contractDic.paperContractNo" />
							</view>
							<view class="item-container top-line" style="background-color: #FFFFFF;">
								<!-- 上传图片 -->
								<imgupload @uploadfinish="uploadfinish" @deleteUrl="deleteUrl" type="common_contract" uploadType="attachment"
								 :maximg="20" :imgFinishlist="contractDic.fileList" />
							</view>
						</view>

						<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
						<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="false"
						 ref="date" themeColor="#E60000" />
					</cell>
				</list>
			</view>
		</create-step>
		<!-- 	<view class="botton-container">
			<button class="submit-btn" hover-class="submit-btn-press" @click="submit">{{ $t('common.submit') }}</button>
		</view> -->
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import selector from '@/components/common/selector/selector.vue';
	import UniNumberBox from '@/components/common/uni-number-box/uni-number-box.vue';
	import TagInput from '@/components/common/uni-tag/tag-input.vue';
	import TagSelect from '@/components/common/uni-tag/tag-select.vue';
	import hoursUtil from '@/common/util/day-working-hours.js';
	import calRent from '@/common/util/cal-rent-money.js';
	import createStep from '@/components/workflow/create-step.vue';
	import imgupload from '@/components/common/image-upload/image-upload.vue';
	import commonUtils from '@/common/common-method/common-method.js';

	export default {
		components: {
			wPicker,
			selector,
			UniNumberBox,
			TagInput,
			TagSelect,
			createStep,
			imgupload
		},
		computed: {
			getNeedOperator() {
				return this.isNeedOperator;
			}
		},
		data() {
			return {
				contractDic: {
					contractDetailDto: {
						advance: '',
						paidAdvance: '',
						debtAdvance: '0.00',
						allocateFlag: false
					}
				},
				maxlength: 8,
				totalMoney: 0, //小计
				defaultIndex: 0, //支付约定
				settlementTypes: [], //支付约定数组
				settlementType: null, //选中的支付约定方式
				settlementDateType: null, //选中的结算日类型
				settlementDateTypes: [], //选中的结算日类型
				settlementDateTypesM: [], //结算日类型-月结
				settlementDateTypesPM: [], //结算日类型-先预付后月结
				settlementDateTypesP: [], //结算日类型-预付
				isShowSettlementDateType: false,
				isShowSettlementDate: false,
				isShowAdvance: false,
				settlementDates: [], //结算日
				rentalTripTypes: [],
				invoiceList: [], //发票数组
				isNeedOperator: false, //是否需要操作人员
				workTypeList: [], //作业内容数组
				rentalProList: [], //租赁性质数组
				otherpromiseText: '', //其他条件约束
				selectList: [], //底部弹窗数组
				pickType: '', //底部弹窗类型
				isExpandInfo: true, //是否显示补充信息
				showMessage: false, //是否显示结算退场联系人
				workcontact: '', //退场联系人
				carshow: true, //是否显示设备
				addrType: '', //选择地点类型
				contractTypes: [],
				leaders: [], //业务负责人列表
				regions: [],
				rentTypes: [],
				carriageTypes: [],
				carriageType: {},
				orderList: [],
				fileList: [],
				curItem: 0,
				curIndexPop: 0,
				list: [],
				userId: '',
				isDraft: false, //是否有草稿
				backDic: null,
				phoneList: [],
				isShowDefault: true,
				persontype: '',
			};
		},
		onLoad(option) {
			let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO)
			if (resData) {
				let obj = resData.find(o => o.code === 'tenant_name')
				if (obj) {
					this.isShowDefault = obj.value === 'liangXu' ? false : true
				}
			}
			if (option.isedit === 'true') {
				this.isDraft = true;
				this.getContractDetail(option.contractNo);
			} else {
				this.isDraft = false;
				if (!option.item) {
					let resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG)
					if (resData) {
						this.contractDic = {
							...this.contractDic,
							orgId: resData.orgIds[0],
							orgName: resData.orgName,
						}
						// if (resData.roleType === this.$savekey.USER_ROLE_BUSINESS) {
						if (this.$gxfmethod.issameRoleType(resData, this.$savekey.USER_ROLE_BUSINESS)) {
							this.contractDic = {
								...this.contractDic,
								customerSalesman: resData.id,
								customerSalesmanName: resData.username,
								contractDetailDto: {
									...this.contractDic.contractDetailDto,
									customerSalesman: resData.id,
									customerSalesmanName: resData.username
								}
							};
						}
					}
				}
				// this.loadOwnerList();
				//获取结算方式
				this.loadsettlementTypes();
			}
			if (option.item) {
				this.isDraft = true;
				this.backDic = JSON.parse(decodeURIComponent(option.item));
			}
			if (option.link) {
				let obj = JSON.parse(decodeURIComponent(option.link))
				this.persontype = 'person'
				this.contractDic = {
					...this.contractDic,
					customerId: obj.id, //客户名称ID
					customerName: obj.name, //客户名称
					contractDetailDto: {
						...this.contractDic.contractDetailDto,
						contactId: null, //联系人ID
						phoneNum: obj.phoneNum, //联系人手机号
						contactName: obj.name //联系人名称
					}
				};
				this.phoneList = [];
				if (obj.secondaryPhoneList && obj.secondaryPhoneList.length > 0) {
					this.phoneList = obj.secondaryPhoneList;
				}
				if (obj.phoneNum && obj.phoneNum != "") {
					this.phoneList.unshift(obj.phoneNum)
				}
			}
			if (option.clink) {
				let obj = JSON.parse(decodeURIComponent(option.clink))
				this.persontype = 'company'
				let dict = obj.contactsList[0];
				this.contractDic = {
					...this.contractDic,
					customerId: obj.id, //客户名称ID
					customerName: obj.name, //客户名称
					contractDetailDto: {
						...this.contractDic.contractDetailDto,
						contactId: dict.id, //联系人ID
						phoneNum: dict.phoneNum, //联系人手机号
						contactName: dict.name //联系人名称
					}
				};
				this.phoneList = [];
				if (dict.secondaryPhoneList && dict.secondaryPhoneList.length > 0) {
					this.phoneList = dict.secondaryPhoneList;
				}
				if (dict.phoneNum && dict.phoneNum != "") {
					this.phoneList.unshift(dict.phoneNum)
				}
			}
			if (!this.isDraft) {
				this.getBusinessNo()
			}
			uni.$on('linkman-emit', obj => {
				// uni.$emit('linkman-emit', {
				// 	dict: result,
				// 	customer: contractDic
				// });
				this.contractDic = {
					...this.contractDic,
					customerId: obj.customer.id, //客户名称ID
					customerName: obj.customer.name, //客户名称
					contractDetailDto: {
						...this.contractDic.contractDetailDto,
						contactId: obj.dict.id, //联系人ID
						phoneNum: obj.dict.phoneNum, //联系人手机号
						contactName: obj.dict.name //联系人名称
					}
				};
				this.phoneList = [];
				if (obj.dict.secondaryPhoneList && obj.dict.secondaryPhoneList.length > 0) {
					this.phoneList = obj.dict.secondaryPhoneList;
				}
				if (obj.dict.phoneNum && obj.dict.phoneNum != "") {
					this.phoneList.unshift(obj.dict.phoneNum)
				}
			});
			uni.$on('linkman-emit-person', obj => {
				this.contractDic = {
					...this.contractDic,
					customerId: obj.dict.id, //客户名称ID
					customerName: obj.dict.name, //客户名称
					contractDetailDto: {
						...this.contractDic.contractDetailDto,
						contactId: null, //联系人ID
						phoneNum: obj.dict.phoneNum, //联系人手机号
						contactName: obj.dict.name //联系人名称
					}
				};
				this.phoneList = [];
				if (obj.dict.secondaryPhoneList && obj.dict.secondaryPhoneList.length > 0) {
					this.phoneList = obj.dict.secondaryPhoneList;
				}
				if (obj.dict.phoneNum && obj.dict.phoneNum != "") {
					this.phoneList.unshift(obj.dict.phoneNum)
				}
			});
			uni.$on('chooseVehicle', obj => {
				this.getSelectData(obj.data);
			});
			uni.$on('choosedConstruction', obj => {
				console.log('Construction' + JSON.stringify(obj.data));
				let choosedConstructionList = [...obj.data];
				let names = choosedConstructionList.map(o => {
					return o.label;
				});
				let nameIds = choosedConstructionList.map(o => {
					return o.value;
				});
				// this.workTypeData = {
				// 	label: names.join(","),
				// 	value: nameIds
				// }
				this.contractDic = {
					...this.contractDic,
					contractDetailDto: {
						...this.contractDic.contractDetailDto,
						constructionType: nameIds, //施工类型
						constructionTypeName: names.join(',') //施工类型
					}
				};
			});
			uni.$on('assgin-vehicle', obj => {
				let assgins = [];
				if (obj.data && obj.data.length > 0) {
					obj.data.map(o => {
						assgins = [
							...assgins,
							{
								id: o.id,
								licenseId: o.licenseId,
								printCode: o.printCode,
								machineBrand: o.brand,
								machineType: o.type,
								machineTypeName: o.typeName
							}
						];
					});
				}
				this.orderList[this.curIndexPop].machineList = [...assgins];
				this.contractDic = {
					...this.contractDic,
					contractDetailDto: {
						...this.contractDic.contractDetailDto,
						orderList: this.orderList
					}
				};
				console.log(JSON.stringify(this.orderList[this.curIndexPop].machineList));
			});
			uni.$on('choose-address', obj => {
				let result = obj.data;
				console.log(result);
				switch (this.addrType) {
					case 'delivery':
						if (!this.contractDic.contractDetailDto.returnPlace) {
							this.contractDic = {
								...this.contractDic,
								contractDetailDto: {
									...this.contractDic.contractDetailDto,
									returnPlace: result.address //	交付地点
								}
							};
						}
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								deliveryPlace: result.address, //	交付地点
								latitude: result.latitude, //		围栏纬度
								longitude: result.longitude, //		围栏经度
								fenceId: '', //	围栏id
								fenceName: '', //	围栏名称
								radius: result.currentRadius //	围栏半径
							}
						};
						break;
					case 'return':
						// this.returnAddress = result.address;
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								returnPlace: result.address //	交付地点
							}
						};
						break;
					default:
						break;
				}
			});
			for (let i = 1; i < 32; i++) {
				this.settlementDates.push({
					label: i + '号',
					value: i
				});
			}
			this.loadcarriageTypes();
			//获取发票
			this.loadinviceTypes();
			//作业内容
			// this.loadconstructionTypes();
			//租赁性质
			this.loadrentalTypes();
			//合同类型
			// this.loadContractTypes();
			this.loadsettlementDateM();
			this.loadsettlementDatePM();
			this.loadsettlementDateP();
			this.loadRentalTripTypes();
			//设备列表-租赁方式
			this.loadSettlementTypes();
			this.loadOrgList();
		},
		onUnload() {
			// 取消监听事件
			uni.$off('linkman-emit');
			uni.$off('linkman-emit-person');
			uni.$off('chooseVehicle');
			uni.$off('choosedConstruction');
			uni.$off('assgin-vehicle');
		},
		onNavigationBarButtonTap(e) {
			//接口保存草稿
			uni.showLoading({
				mask: true
			});
			let isnext = true
			if (this.contractDic.contractDetailDto.orderList && this.contractDic.contractDetailDto.orderList.length > 0) {
				for (let i = 0; i < this.contractDic.contractDetailDto.orderList.length; i++) {
					let m = this.contractDic.contractDetailDto.orderList[i];
					for (let j = i + 1; j < this.contractDic.contractDetailDto.orderList.length; j++) {
						let n = this.contractDic.contractDetailDto.orderList[j];
						if (m.type === n.type &&
							m.height === n.height &&
							m.settlementType === n.settlementType &&
							this.$datestr.doubleFloat(m.hire) == this.$datestr.doubleFloat(n.hire) &&
							this.$datestr.doubleFloat(m.hireMonthly) == this.$datestr.doubleFloat(n.hireMonthly)) {
							isnext = false
						}
					}
				}
			}
			if (isnext === false) {
				this.showToast('订单中有类型、高度、租赁方式、租金重复,不可提交');
				return;
			}
			let orderList = [];
			if (this.contractDic.contractDetailDto && this.contractDic.contractDetailDto.orderList) {
				orderList = this.contractDic.contractDetailDto.orderList.map(o => {
					o.beginDate = o.beginDate ? (this.findNotStr(o.beginDate, '00:00:00') ? o.beginDate + ' 00:00:00' : o.beginDate) :
						'';
					o.endDate = o.endDate ? (this.findNotStr(o.endDate, '00:00:00') ? o.endDate + ' 00:00:00' : o.endDate) : '';
					return o;
				});
			}
			this.contractDic = {
				...this.contractDic,
				contractType: '1',
				contractTypeName: '普通合同',
				signDate: this.contractDic.signDate ? this.findNotStr(this.contractDic.signDate, '00:00:00') ? this.contractDic.signDate +
					' 00:00:00' : this.contractDic.signDate : null,
				contractDetailDto: {
					...this.contractDic.contractDetailDto,
					orderList: orderList
				}
			};
			this.checkprojectName().then(() => {
				this.$network
					.getData(this.$url.EDIT_CONTRACT + '?draft=true', 'POST', this.contractDic)
					.then(result => {
						uni.$emit('refresh-contract-list', {
							type: 'contract'
						});
						uni.showToast({
							icon: 'none',
							title: '草稿保存成功'
						});
						uni.$emit('refreshList', {
							type: ''
						});
						uni.navigateBack({
							delta: 1
						});
						uni.hideLoading();
					})
					.catch(err => {
						let list = this.contractDic.contractDetailDto.orderList.map(o => {
							return {
								...o,
								"beginDate": this.changestr(o.beginDate),
								"endDate": this.changestr(o.endDate)
							};
						});
						this.contractDic = {
							...this.contractDic,
							"contractDetailDto": {
								...this.contractDic.contractDetailDto,
								orderList: list
							}
						}
						this.orderList = [...this.contractDic.contractDetailDto.orderList];
						uni.showToast({
							title: err.message,
							icon: 'none'
						});
						uni.hideLoading();
					});
			}).catch(() => {
				uni.hideLoading();
				this.showToast('已存在客户名称、项目名称、业务负责人都相同的合同，请修改');

			})

		},
		methods: {
			inputAddress(e) {
				this.contractDic = {
					...this.contractDic,
					contractDetailDto: {
						...this.contractDic.contractDetailDto,
						latitude: null, //		围栏纬度
						longitude: null, //		围栏经度
						fenceId: '', //	围栏id
						fenceName: '', //	围栏名称
						radius: null, //	围栏半径
						"returnPlace": e.detail.value
					}
				};
			},
			/**
			 * 获取单号
			 */
			getBusinessNo() {
				let url = this.$url.CREATE_BUSINESS_NO.replace(/{type}/, 'HT')
				this.$network.getData(url, "GET", null).then((result) => {
					this.contractDic = {
						...this.contractDic,
						"businessNo": result
					}

				}).catch((err) => {

				})
			},
			getBackData(val) {
				console.log('getBackData------------')
				this.contractDic = JSON.parse(val)
				if (this.contractDic.contractDetailDto && this.contractDic.contractDetailDto.orderList) {
					let list = this.contractDic.contractDetailDto.orderList.map(o => {
						return {
							...o,
							"beginDate": this.changestr(o.beginDate),
							"endDate": this.changestr(o.endDate)
						};
					});
					this.contractDic = {
						...this.contractDic,
						"contractDetailDto": {
							...this.contractDic.contractDetailDto,
							orderList: list
						}
					}
					this.contractDic.contractDetailDto.orderList.forEach(o => {
						calRent.getTenancys(o);
						console.log(o);
					})
					this.orderList = [...this.contractDic.contractDetailDto.orderList];
				}
				console.log(JSON.stringify(this.contractDic));
				this.loadsettlementTypes();
				this.loadOwnerList(this.contractDic.orgId, false);
			},
			//修改获取草稿合同数据
			getContractDetail(contractNo) {
				uni.showLoading();
				this.$network
					.getData(this.$url.CONTRACT_DEATIL_BY_NO + '?businessNo=' + contractNo, 'GET', null)
					.then(result => {
						this.contractDic = {
							...result
						};

						if (this.contractDic.contractDetailDto && this.contractDic.contractDetailDto.orderList) {
							let list = this.contractDic.contractDetailDto.orderList.map(o => {
								return {
									...o,
									"beginDate": this.changestr(o.beginDate),
									"endDate": this.changestr(o.endDate)
								};
							});
							this.contractDic = {
								...this.contractDic,
								"contractDetailDto": {
									...this.contractDic.contractDetailDto,
									orderList: list
								}
							}

							this.contractDic.contractDetailDto.orderList.forEach(o => {
								calRent.getTenancys(o);
								console.log(o);
							})
							this.orderList = [...this.contractDic.contractDetailDto.orderList];
						}
						// this.loadOwnerList();
						//获取结算方式
						this.loadsettlementTypes();
						this.loadOwnerList(this.contractDic.orgId, false);
						uni.hideLoading();
					})
					.catch(err => {
						uni.showToast({
							title: err.message,
							icon: 'none'
						});
						uni.hideLoading();
					});
			},
			//过滤选中数据
			getSelectData(rowTypes) {
				console.log('getSelectData' + JSON.stringify(rowTypes));
				this.carshow = true;
				let newItem = rowTypes.filter(t => {
					if (t.checked) {
						t.list = t.list.filter(m => {
							return m.checked;
						});
					}
					return t.checked;
				});
				let arr = [];
				let defaultDate = hoursUtil.dateSFormat(new Date().getTime());
				let defaultS = this.rentTypes.length > 0 ? this.rentTypes[0].value : null;
				newItem.forEach(o => {
					arr = [
						...arr,
						{
							type: o.type,
							typeName: o.typeName,
							height: o.height,
							heightName: o.heightName,
							machineType: o.list.map(y => y.id),
							machineTypeName: this.getMachineTypes(o.list.map(y => y.name)),
							machineList: [],
							beginDate: defaultDate,
							carriage: '',
							endDate: null,
							whole: null,
							surplusDay: null,
							hire: '',
							hireMonthly: '0',
							orderNum: 1,
							carriageTypeName: this.carriageTypes.length > 0 ? this.carriageTypes[0].label : null,
							carriageType: this.carriageTypes.length > 0 ? this.carriageTypes[0].value : null,
							pledge: '',
							settlementType: defaultS,
							tenancy: calRent.calculateDays(defaultDate, defaultDate, defaultS),
							total: '0.00',
							settlementTypeName: this.rentTypes.length > 0 ? this.rentTypes[0].label : null
						}
					];
				});
				this.orderList = [...arr, ...this.orderList];
				this.contractDic = {
					...this.contractDic,
					contractDetailDto: {
						...this.contractDic.contractDetailDto,
						orderList: this.orderList
					}
				};
				console.log(JSON.stringify(this.orderList));
			},
			//加载负责人
			loadOwnerList(orgId, isfirst) {
				let param = {
					showAdmin: false,
					orgId: orgId,
					isAll: true,
					roleType: this.$savekey.USER_ROLE_BUSINESS
				}
				uni.showLoading();
				this.$network
					.getData(this.$url.USER_LEADERS, 'GET', param)
					.then(result => {
						let list = result;
						this.leaders = list.map(dict => {
							return {
								label: dict.username,
								value: dict.id,
								orgIds: dict.orgIds
							};
						});
						if (isfirst === true) {
							if (this.leaders && this.leaders.length > 0 && (!this.contractDic.customerSalesman || this.contractDic.customerSalesman ==
									'')) {
								this.contractDic = {
									...this.contractDic,
									customerSalesman: this.leaders[0].value,
									customerSalesmanName: this.leaders[0].label,
									contractDetailDto: {
										...this.contractDic.contractDetailDto,
										customerSalesman: this.leaders[0].value,
										customerSalesmanName: this.leaders[0].label
									}
								};
							}
						}
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			loadOrgList() {
				this.$network.getData(this.$url.ORG_LIST, 'GET', null).then(result => {
					console.log(JSON.stringify(result));
					this.regions = this.getChildren(result);
					if (!this.isDraft) {
						if (this.regions && this.regions.length > 0) {
							let org = this.regions.find((item) => {
								if (item.value === this.contractDic.orgId) {
									return item
								}
							})
							this.contractDic = {
								...this.contractDic,
								"orgId": org.value,
								"orgName": org.label,
							}
							this.loadOwnerList(this.contractDic.orgId, true);
						}
					} 
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
						// else {
						// 	arr = [...arr, a];
						// }
					});
				}
				return arr;
			},
			//结算方式payment_type
			loadsettlementTypes() {
				this.$network
					.loadType('payment_type')
					.then(result => {
						this.settlementTypes = result;
						if (!this.isDraft) {
							this.settlementType = this.settlementTypes.length > this.defaultIndex ? this.settlementTypes[this.defaultIndex] :
								null;
							this.setPayment();
							this.showAdvance();
							this.showSettlementDateType();
							this.showSettlementDate();
							setTimeout(() => {
								if (this.settlementType.value == '2') {
									//月结
									this.settlementDateTypes = this.settlementDateTypesM;
								} else if (this.settlementType.value == '3') {
									//预付
									this.settlementDateTypes = this.settlementDateTypesP;
								} else if (this.settlementType.value == '4') {
									//先预付后月结
									this.settlementDateTypes = this.settlementDateTypesPM;
								} else {
									this.settlementDateTypes = [];
								}
							}, 300)

						} else {
							this.defaultIndex = this.settlementTypes.findIndex(o => {
								return this.contractDic.contractDetailDto.paymentType === o.value;
							});
							this.settlementType = this.settlementTypes[this.defaultIndex];
							if (this.settlementType.value == '2') {
								//月结
								this.settlementDateTypes = this.settlementDateTypesM;
							} else if (this.settlementType.value == '3') {
								//预付
								this.settlementDateTypes = this.settlementDateTypesP;
							} else if (this.settlementType.value == '4') {
								//先预付后月结
								this.settlementDateTypes = this.settlementDateTypesPM;
							} else {
								this.settlementDateTypes = [];
							}
							this.setPayment();
							this.showAdvance();
							this.showSettlementDateType();
							this.showSettlementDate();
						}

						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			//运费类型carriage_type
			loadcarriageTypes() {
				this.$network
					.loadType('carriage_type')
					.then(result => {
						this.carriageTypes = result;
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			//结算方式点击方法
			onChange: function(info, index) {
				this.defaultIndex = index;
				this.settlementType = this.settlementTypes[this.defaultIndex];
				if (this.settlementType.value == '2') {
					//月结
					this.settlementDateTypes = this.settlementDateTypesM;
				} else if (this.settlementType.value == '3') {
					//预付
					this.settlementDateTypes = this.settlementDateTypesP;
				} else if (this.settlementType.value == '4') {
					//先预付后月结
					this.settlementDateTypes = this.settlementDateTypesPM;
				} else {
					this.settlementDateTypes = [];
				}
				this.setPayment();
				this.showAdvance();
				this.showSettlementDateType();
				this.initSettlementDateType();
				this.showSettlementDate();
				this.initSettlementDate();
			},
			setPayment() {
				this.contractDic = {
					...this.contractDic,
					contractDetailDto: {
						...this.contractDic.contractDetailDto,
						paymentType: this.settlementType.value, //
						paymentTypeName: this.settlementType.label //
					}
				};
			},
			//发票invoice_type
			loadinviceTypes() {
				this.$network
					.loadType('invoice_type')
					.then(result => {
						this.invoiceList = [...result];
						if (!this.isDraft && this.invoiceList.length > 0) {
							this.contractDic = {
								...this.contractDic,
								contractDetailDto: {
									...this.contractDic.contractDetailDto,
									invoiceType: this.invoiceList[0].value,
									invoiceTypeName: this.invoiceList[0].label
								}
							};
						}
					})
					.catch(err => {});
			},
			//作业内容construction_type
			loadconstructionTypes() {
				this.$network
					.loadType('construction_type')
					.then(result => {
						this.workTypeList = this.workTypeList.concat(result);
						// if (this.workTypeList.length > 0) {
						// 	this.workTypeData = this.workTypeList[0]
						// }
					})
					.catch(err => {});
			},
			//租赁性质rental_type
			loadrentalTypes() {
				this.$network
					.loadType('rental_type')
					.then(result => {
						this.rentalProList = this.rentalProList.concat(result);
						if (!this.isDraft && this.rentalProList.length > 0) {
							this.contractDic = {
								...this.contractDic,
								contractDetailDto: {
									...this.contractDic.contractDetailDto,
									rentalType: this.rentalProList[0].value,
									rentalTypeName: this.rentalProList[0].label
								}
							};
						}
					})
					.catch(err => {});
			},
			//合同类型
			loadContractTypes() {
				this.$network
					.loadDic('contract_type')
					.then(result => {
						this.contractTypes = result.records;
						if (!this.isDraft && this.contractTypes.length > 0) {
							this.contractDic = {
								...this.contractDic,
								contractType: this.contractTypes[0].value,
								contractTypeName: this.contractTypes[0].label
							};
						}
					})
					.catch(err => {});
			},
			//结算日类型-月结
			loadsettlementDateM() {
				this.$network
					.loadType('settlement_monthly_type')
					.then(result => {
						this.settlementDateTypesM = result;
					})
					.catch(err => {});
			},
			//结算日类型-预付后月结
			loadsettlementDatePM() {
				this.$network
					.loadType('settlement_prepaid_monthly_type')
					.then(result => {
						this.settlementDateTypesPM = result;
					})
					.catch(err => {});
			},
			//结算日类型-预付
			loadsettlementDateP() {
				this.$network
					.loadType('settlement_prepaid_type')
					.then(result => {
						this.settlementDateTypesP = result;
					})
					.catch(err => {});
			},
			//运费减免约定
			loadRentalTripTypes() {
				this.$network
					.loadType('renter_trip_type')
					.then(result => {
						this.rentalTripTypes = result;
						if (!this.isDraft && this.rentalTripTypes.length > 0) {
							this.contractDic = {
								...this.contractDic,
								contractDetailDto: {
									...this.contractDic.contractDetailDto,
									renterTripType: this.rentalTripTypes[0].value, //
									renterTripTypeName: this.rentalTripTypes[0].label //
								}
							};
						}
					})
					.catch(err => {});
			},
			//租赁方式
			loadSettlementTypes() {
				this.$network
					.loadType('settlement_type')
					.then(result => {
						this.rentTypes = result;
					})
					.catch(err => {});
			},

			//上传图片回调
			uploadfinish(val) {
				console.log('uploadfinish' + JSON.stringify(val));
				let list = val.data;
				this.contractDic = {
					...this.contractDic,
					fileList: list
				};
				console.log('this.contractDic' + JSON.stringify(this.contractDic));
			},
			//删除回调
			deleteUrl(val) {
				let list = val.data;
				this.contractDic = {
					...this.contractDic,
					fileList: list
				};
			},
			showPick: function(type, i) {
				this.pickType = type;
				this.curItem = i ? i : 0;
				if (this.pickType === 'leader') {
					let resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG)
					if (resData) {
						if (this.$gxfmethod.issameAllRoleType(resData, this.$savekey.USER_ROLE_BUSINESS)) {
							return
						}
					}
				}
				switch (this.pickType) {
					case 'leader':
						this.selectList = this.leaders ? this.leaders : [];
						break;
					case 'invoice':
						this.selectList = this.invoiceList ? this.invoiceList : [];
						break;
					case 'workType':
						this.selectList = this.workTypeList ? this.workTypeList : [];
						break;
					case 'rentalPro':
						this.selectList = this.rentalProList ? this.rentalProList : [];
						break;
					case 'rentType': //租赁方式
						this.selectList = this.rentTypes ? this.rentTypes : [];
						break;
					case 'carriageType': //运费方式
						this.selectList = this.carriageTypes ? this.carriageTypes : [];
						break;
					case 'contractType':
						this.selectList = this.contractTypes ? this.contractTypes : [];
						break;
					case 'region':
						this.selectList = this.regions ? this.regions : [];
						break;
					case 'rentalTripType':
						this.selectList = this.rentalTripTypes ? this.rentalTripTypes : [];
						break;
					case 'settlementDateType':
						if (this.settlementType.value == '2') {
							//月结
							this.settlementDateTypes = this.settlementDateTypesM;
						} else if (this.settlementType.value == '3') {
							//预付
							this.settlementDateTypes = this.settlementDateTypesP;
						} else if (this.settlementType.value == '4') {
							//先预付后月结
							this.settlementDateTypes = this.settlementDateTypesPM;
						} else {
							this.settlementDateTypes = [];
						}
						this.selectList = this.settlementDateTypes ? this.settlementDateTypes : [];

						break;
					case 'settlementDate':
						this.selectList = this.settlementDates ? this.settlementDates : [];
						break;
				}
				this.$refs.selector.show();
			},
			checkNum(e, type, i, st) {
				var val = e.target.value;
				setTimeout(() => {
					if (val.indexOf(".") !== -1) {
						var dotIndex = val.indexOf(".");
						val = val.substr(0, dotIndex + 1);
						this.getInputData(type, val, i);
					}
					if (val.indexOf(".") === 0) {
						val = '';
						this.getInputData(type, val, i); //租期
					}

					//限制0后面非。输入
					if (val.substring(0, 1) === "0" && val.length > 1 && val.substring(1, 2) !== "0") {
						val = val.substring(0, 1);
						this.getInputData(type, val, i);
						return
					}
					// if (type === 'surplusDay') {
					// 	console.log('st:' + st)
					// 	if (st === "2" || st === "3") {
					// 		console.log('23:' + val)
					// 		if (Number.parseInt(val) > 30) {
					// 			console.log('30:' + val)
					// 			val = val.substring(0, 1);
					// 			console.log('301:' + val)
					// 			this.getInputData(type, val, i);

					// 		}

					// 	} else if (st === "5") {
					// 		console.log('5:' + val)
					// 		if (Number.parseInt(val) >= 7) {
					// 			console.log('7:' + val)
					// 			val = '';
					// 			this.getInputData(type, val, i);
					// 		}

					// 	}
					// }
					this.getInputData(type, val, i);
				}, 10)
			},
			checkInput(e, type, i) {
				let val = e.target.value;
				let startval = e.target.value;
				if (val.indexOf('.') != -1) {
					var dotIndex = val.indexOf('.');
					if (val.length - 1 - dotIndex > 2) {
						val = val.substr(0, dotIndex + 2 + 1);
						this.getInputData(type, val, i);
					}
				}
				if (val.indexOf('.') == 0) {
					val = '0' + val;
					this.getInputData(type, val, i);
				}
				//限制0后面非。输入
				if (val.substring(0, 1) == '0' && val.length > 1 && val.substring(1, 2) != '.') {
					val = val.substring(0, 1);
					this.getInputData(type, val, i);
					return;
				}
				this.getInputData(type, val, i, startval);
			},

			//小计
			calMoney() {
				let totalMoney = 0;
				this.orderList.forEach(o => {
					console.log('o:' + JSON.stringify(calRent.calculateTotalNew(o)));
					let itemTotal = Number.parseFloat(o.total);
					console.log('itemTotal' + itemTotal);
					totalMoney += itemTotal;
				});
				this.totalMoney = totalMoney.toFixed(2);
				console.log('totalMoney' + this.totalMoney);
			},

			getMachineTypes(names) {
				return names.join(',');
			},

			//给输入框赋值
			getInputData(type, val, i, startValue) {
				if (type === 'hire') {
					let hiredict = {
						...this.orderList[i],
						hire: startValue
					}
					this.orderList.splice(i, 1, hiredict)
					this.contractDic = {
						...this.contractDic,
						contractDetailDto: {
							...this.contractDic.contractDetailDto,
							orderList: this.orderList
						}
					};
				} else if (type === 'hireMonthly') {
					let orderdict = {
						...this.orderList[i],
						hireMonthly: startValue
					}
					this.orderList.splice(i, 1, orderdict)
					this.contractDic = {
						...this.contractDic,
						contractDetailDto: {
							...this.contractDic.contractDetailDto,
							orderList: this.orderList
						}
					};
				} else if (type === 'pledge') {
					let pledgedict = {
						...this.orderList[i],
						pledge: startValue
					}
					this.orderList.splice(i, 1, pledgedict)
					this.contractDic = {
						...this.contractDic,
						contractDetailDto: {
							...this.contractDic.contractDetailDto,
							orderList: this.orderList
						}
					};
				} else if (type === 'carriage') {
					let carriagedict = {
						...this.orderList[i],
						carriage: startValue
					}
					this.orderList.splice(i, 1, carriagedict)
					this.contractDic = {
						...this.contractDic,
						contractDetailDto: {
							...this.contractDic.contractDetailDto,
							orderList: this.orderList
						}
					};
				} else if (type === 'advance') {
					this.contractDic = {
						...this.contractDic,
						contractDetailDto: {
							...this.contractDic.contractDetailDto,
							advance: startValue //是否配备人员
						}
					};
					this.getdebtMoney()
				} else if (type === 'person') {
					this.contractDic = {
						...this.contractDic,
						contractDetailDto: {
							...this.contractDic.contractDetailDto,
							allocatePrice: startValue //是否配备人员
						}
					};
				} else if (type === 'paid') {
					this.contractDic = {
						...this.contractDic,
						contractDetailDto: {
							...this.contractDic.contractDetailDto,
							paidAdvance: startValue //是否配备人员
						}
					};
					this.getdebtMoney()
				} else if (type === 'whole') {
					let wholedict = {
						...this.orderList[i],
						whole: startValue
					}
					this.orderList.splice(i, 1, wholedict)
					this.contractDic = {
						...this.contractDic,
						contractDetailDto: {
							...this.contractDic.contractDetailDto,
							orderList: this.orderList
						}
					};
				} else if (type === 'surplusDay') {
					let surplusDaydict = {
						...this.orderList[i],
						surplusDay: startValue
					}
					this.orderList.splice(i, 1, surplusDaydict)
					this.contractDic = {
						...this.contractDic,
						contractDetailDto: {
							...this.contractDic.contractDetailDto,
							orderList: this.orderList
						}
					};
				}
				setTimeout(() => {
					//限制小数两位
					if (type === 'hire') {
						let dict = {
							...this.orderList[i],
							hire: val
						}
						this.orderList.splice(i, 1, dict)
						this.calMoney();
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								orderList: this.orderList
							}
						};
					} else if (type === 'hireMonthly') {
						let hireMonthlysdict = {
							...this.orderList[i],
							hireMonthly: val
						}
						this.orderList.splice(i, 1, hireMonthlysdict)
						this.calMoney();
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								orderList: this.orderList
							}
						};
					} else if (type === 'pledge') {
						let pledgesdict = {
							...this.orderList[i],
							pledge: val
						}
						this.orderList.splice(i, 1, pledgesdict)
						this.calMoney();
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								orderList: this.orderList
							}
						};
					} else if (type === 'carriage') {
						let carriagesdict = {
							...this.orderList[i],
							carriage: val
						}
						this.orderList.splice(i, 1, carriagesdict)
						this.calMoney();
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								orderList: this.orderList
							}
						};
					} else if (type === 'advance') {
						// this.imprestMoney = val
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								advance: val //是否配备人员
							}
						};
						this.getdebtMoney()
					} else if (type === 'person') {
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								allocatePrice: val //是否配备人员
							}
						};
					} else if (type === 'paid') {
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								paidAdvance: val //是否配备人员
							}
						};
						this.getdebtMoney()
					} else if (type === 'whole') {
						let wholesdict = {
							...this.orderList[i],
							whole: val
						}
						this.orderList.splice(i, 1, wholesdict)
						this.calMoney();
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								orderList: this.orderList
							}
						};
					} else if (type === 'surplusDay') {
						let surplusDaysdict = {
							...this.orderList[i],
							surplusDay: val
						}
						this.orderList.splice(i, 1, surplusDaysdict)
						this.calMoney();
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								orderList: this.orderList
							}
						};
					}
				}, 50);
			},
			getdebtMoney() {
				let allocatePrice = this.contractDic.contractDetailDto.advance || "0"
				let paidAdvance = this.contractDic.contractDetailDto.paidAdvance || "0"
				let debitMoney = Number.parseFloat(allocatePrice) - Number.parseFloat(paidAdvance);
				console.log(debitMoney)
				this.contractDic = {
					...this.contractDic,
					contractDetailDto: {
						...this.contractDic.contractDetailDto,
						debtAdvance: this.$datestr.doubleFloat(debitMoney)
					}
				};
			},
			//显示时间选择器
			showTimePick: function(type, i) {
				this.pickType = type;
				this.curItem = i;
				console.log('showTimePick' + this.curItem);
				this.$refs.date.show();
			},
			/*获取数据完成*/
			/*底部弹窗选择类型*/
			onConfirm: function(val) {
				//{"checkArr":{"label":"专票","value":1},"defaultVal":[1],"result":"专票"}
				console.log(val);
				console.log('curItem' + this.curItem);
				switch (this.pickType) {
					case 'leader':
						// this.leader = val.checkArr;
						this.contractDic = {
							...this.contractDic,
							customerSalesman: val.checkArr.value,
							customerSalesmanName: val.checkArr.label,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								customerSalesman: val.checkArr.value,
								customerSalesmanName: val.checkArr.label
							}
						};
						break;
					case 'invoice': //发票类型
						// this.invoiceData = val.checkArr;
						let invoiceFlag = false;
						if (val.checkArr.value === '0') {
							invoiceFlag = false;
						} else {
							invoiceFlag = true;
						}
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								invoiceType: val.checkArr.value,
								invoiceTypeName: val.checkArr.label,
								invoiceFlag: invoiceFlag
							}
						};
						break;
					case 'workType': //施工类型
						// this.workTypeData = val.checkArr;
						// this.contractDic = {
						// 	...this.contractDic,
						// 	"contractDetailDto": {
						// 		...this.contractDic.contractDetailDto,
						// 		"constructionType": val.checkArr.value,
						// 		"constructionTypeName": val.checkArr.label
						// 	}
						// }
						break;
					case 'rentalPro': //租赁性质
						// this.rentalProData = val.checkArr;
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								rentalType: val.checkArr.value,
								rentalTypeName: val.checkArr.label
							}
						};
						break;
					case 'carriageType': //运费方式
						this.orderList[this.curItem].carriageTypeName = val.checkArr.label;
						this.orderList[this.curItem].carriageType = val.checkArr.value;
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								orderList: this.orderList
							}
						};
						break;
					case 'signieDate': //签约日期
						// this.signieDate = val.result;
						this.contractDic = {
							...this.contractDic,
							signDate: val.result
						};
						break;
					case 'contractType': //合同类型
						this.contractDic = {
							...this.contractDic,
							contractType: val.checkArr.value,
							contractTypeName: val.checkArr.label
						};
						// this.contractType = val.checkArr;
						break;
					case 'region': //区域
						this.contractDic = {
							...this.contractDic,
							orgId: val.checkArr.value,
							orgName: val.checkArr.label,
							customerSalesman: "",
							customerSalesmanName: "",
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								customerSalesman: "",
								customerSalesmanName: ""
							}
						};
						let resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG)
						if (resData) {
							if (this.$gxfmethod.issameAllRoleType(resData, this.$savekey.USER_ROLE_BUSINESS)) {
								if (resData.orgIds.some(o => {
										return o === val.checkArr.value
									})) {
									this.contractDic = {
										...this.contractDic,
										customerSalesman: resData.id,
										customerSalesmanName: resData.username,
										contractDetailDto: {
											...this.contractDic.contractDetailDto,
											customerSalesman: resData.id,
											customerSalesmanName: resData.username
										}
									};
								}
							} else {
								this.loadOwnerList(this.contractDic.orgId, true);
							}
						}
						break;
					case 'settlementDateType': //结算日类型
						// this.settlementDateType = val.checkArr;
						// this.settlementDate = this.settlementDates.length > 0 ? this.settlementDates[0] : null;

						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								settlementDayType: val.checkArr.value, //	结算日方式
								settlementDayTypeName: val.checkArr.label //	结算日方式
							}
						};
						this.showSettlementDate();
						this.initSettlementDate();
						break;
					case 'settlementDate': //结算日
						// this.settlementDate = val.checkArr;
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								settlementDay: val.checkArr.value, //	结算日
								settlementDayName: val.checkArr.label //	结算日
							}
						};
						break;
					case 'rentalTripType': //
						// this.rentalTripType = val.checkArr;
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								renterTripType: val.checkArr.value, //
								renterTripTypeName: val.checkArr.label //
							}
						};
						break;
					case 'rentType': //租赁方式
						this.orderList[this.curItem].settlementTypeName = val.checkArr.label;
						this.orderList[this.curItem].settlementType = val.checkArr.value;
						this.orderList[this.curItem].whole = null
						this.orderList[this.curItem].surplusDay = null
						if (this.orderList[this.curItem].settlementType === '4') {
							this.orderList[this.curItem].hireMonthly = 0.0;
						}
						this.calMoney();

						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								orderList: this.orderList
							}
						};

						break;
					case 'beginDate': //进场日
						this.orderList[this.curItem].beginDate = val.result;
						this.calMoney();
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								orderList: this.orderList
							}
						};
						break;
					case 'endDate': //预计结束时间
						this.orderList[this.curItem].endDate = val.result;
						this.calMoney();
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								orderList: this.orderList
							}
						};
						break;
					case 'phone':
						this.contractDic = {
							...this.contractDic,
							contractDetailDto: {
								...this.contractDic.contractDetailDto,
								phoneNum: val.checkArr.label, //联系人手机号
							}
						};
						break;
					default:
						break;
				}
			},
			setNeedOperator: function(e) {
				this.isNeedOperator = e.target.value;
				if (!this.isNeedOperator) {
					// this.dayMoney = null
					this.contractDic = {
						...this.contractDic,
						contractDetailDto: {
							...this.contractDic.contractDetailDto,
							allocatePrice: null //是否配备人员
						}
					};
				}
				this.contractDic = {
					...this.contractDic,
					contractDetailDto: {
						...this.contractDic.contractDetailDto,
						allocateFlag: e.target.value //是否配备人员
					}
				};
			},
			//是否显示预付款
			showAdvance() {
				if (this.contractDic.contractDetailDto.paymentType == '3' || this.contractDic.contractDetailDto.paymentType == '4') {
					this.isShowAdvance = true;
				} else {
					this.isShowAdvance = false;
					this.contractDic = {
						...this.contractDic,
						contractDetailDto: {
							...this.contractDic.contractDetailDto,
							advance: "" //是否配备人员
						}
					};
					// this.imprestMoney = null
				}
			},
			//是否显示结算日类型
			showSettlementDateType() {
				if (
					this.contractDic.contractDetailDto.paymentType == '2' ||
					this.contractDic.contractDetailDto.paymentType == '3' ||
					this.contractDic.contractDetailDto.paymentType == '4'
				) {
					this.isShowSettlementDateType = true;
				} else {
					this.isShowSettlementDateType = false;
				}
			},
			initSettlementDateType() {
				this.contractDic = {
					...this.contractDic,
					contractDetailDto: {
						...this.contractDic.contractDetailDto,
						settlementDayType: this.isShowSettlementDateType ? (this.settlementDateTypes.length > 0 ? this.settlementDateTypes[
							0].value : null) : null, //	结算日方式
						settlementDayTypeName: this.isShowSettlementDateType ? (this.settlementDateTypes.length > 0 ? this.settlementDateTypes[
							0].label : null) : null //	结算日方式
					}
				};
			},
			//是否显示结算日-选择固定每月固定X日
			showSettlementDate() {
				if (!this.contractDic.contractDetailDto.settlementDayType) {
					this.isShowSettlementDate = false;
					return;
				}
				if (this.contractDic.contractDetailDto.paymentType == '2' && this.contractDic.contractDetailDto.settlementDayType ==
					'2') {
					//月结
					this.isShowSettlementDate = true;
				} else if (this.contractDic.contractDetailDto.paymentType == '3' && this.contractDic.contractDetailDto.settlementDayType ==
					'2') {
					//预付
					this.isShowSettlementDate = true;
				} else if (this.contractDic.contractDetailDto.paymentType == '4' && this.contractDic.contractDetailDto.settlementDayType ==
					'2') {
					//先预付后月结
					this.isShowSettlementDate = true;
				} else {
					this.isShowSettlementDate = false;
				}
			},
			initSettlementDate() {
				this.contractDic = {
					...this.contractDic,
					contractDetailDto: {
						...this.contractDic.contractDetailDto,
						settlementDay: this.isShowSettlementDate ? (this.settlementDates.length > 0 ? this.settlementDates[0].value :
							null) : null, //	结算日
						settlementDayName: this.isShowSettlementDate ? (this.settlementDates.length > 0 ? this.settlementDates[0].label :
							null) : null //	结算日
					}
				};
			},
			// 获取用户信息
			getcustomMsg() {
				// uni.navigateTo({
				// 	url: '/otherPages/linkman/linkman?regio=' + this.contractDic.orgId + '&leader=' + this.contractDic.contractDetailDto.customerSalesman
				// });
				let dict = {
					orgId: this.contractDic.orgId,
					orgName: this.contractDic.orgName,
					customerSalesman: this.contractDic.contractDetailDto.customerSalesman,
					customerSalesmanName: this.contractDic.contractDetailDto.customerSalesmanName,
				}
				uni.navigateTo({
					url: '/otherPages/linkman/linkman?item=' + encodeURIComponent(JSON.stringify(dict)) + '&dutyType=2'
				});
			},
			//选择地址
			chooseAddress(type) {
				this.addrType = type;
				let addrObj = {
					address: this.contractDic.contractDetailDto.deliveryPlace ? this.contractDic.contractDetailDto.deliveryPlace : '',
					latitude: this.contractDic.contractDetailDto.latitude ? this.contractDic.contractDetailDto.latitude : '',
					longitude: this.contractDic.contractDetailDto.longitude ? this.contractDic.contractDetailDto.longitude : '',
					currentRadius: this.contractDic.contractDetailDto.radius ? this.contractDic.contractDetailDto.radius : ''
				};
				uni.navigateTo({
					url: '/otherPages/map/nvr-map?deliveryAddress=' + JSON.stringify(addrObj) + '&showfence=true'
				});
			},
			goTo(type) {
				switch (type) {
					case 'workType':
						let choosedIdList = this.contractDic.contractDetailDto.constructionType ? this.contractDic.contractDetailDto.constructionType :
							[];
						console.log('choosedIdList' + JSON.stringify(choosedIdList));
						uni.navigateTo({
							url: './choose-work-content?choosedIdList=' + encodeURIComponent(JSON.stringify(choosedIdList))
						});
						break;
					default:
						break;
				}
			},
			//去指定设备
			showAssignPop(i) {
				console.info(i);
				this.curIndexPop = i;
				if (this.contractDic.contractDetailDto.orderList[i].orderNum <= 0) {
					uni.showToast({
						title: '请选择设备数量',
						icon: 'none'
					});
					return;
				}
				// if (this.contractDic.contractDetailDto.orderList[i].machineType.length <= 0) {
				// 	uni.showModal({
				// 		content: '请选择具体设备品牌/型号',
				// 		showCancel: false,
				// 		confirmText: '知道了'
				// 	});
				// 	return;
				// }
				uni.navigateTo({
					url: './assign-vehicle?item=' + encodeURIComponent(JSON.stringify(this.contractDic.contractDetailDto.orderList[
						this.curIndexPop]))
				});
			},
			//获取设备类型的数量
			getNumValue(val, position) {
				this.orderList[position].orderNum = val;
				this.contractDic = {
					...this.contractDic,
					contractDetailDto: {
						...this.contractDic.contractDetailDto,
						orderList: this.orderList //是否配备人员
					}
				};
				this.calMoney();
			},
			//提示
			showTip(val, i) {
				console.log('vals===' + val);
				if (this.contractDic.contractDetailDto.orderList[i].machineList.length >= this.contractDic.contractDetailDto.orderList[
						i].orderNum) {
					uni.showModal({
						content: '选择设备不得小于指定设备数量',
						showCancel: false,
						confirmText: '知道了'
					});
					return;
				} else {
					this.contractDic.contractDetailDto.orderList[i].orderNum -= val;
					// this.contractDic = {
					// 	...this.contractDic,
					// 	"contractDetailDto": {
					// 		...this.contractDic.contractDetailDto,
					// 		"orderList": this.orderList, //是否配备人员
					// 	}
					// }
				}
			},
			//新增设备
			addVehicle() {
				uni.navigateTo({
					url: './choose-vehicle'
				});
			},
			//是否显示设备信息指定设备的提示
			isShowAnnotate(item) {
				return item.machineList.length <= 0;
			},
			//移除设备信息项
			deleteItem(i) {
				// this.$delete(this.orderList, i)
				this.contractDic.contractDetailDto.orderList.splice(i, 1);
				this.calMoney();
			},
			showToast(msg) {
				uni.showToast({
					title: msg,
					icon: 'none'
				});
			},
			//是否查找到‘00：00：00’
			findNotStr(str, findstr) {
				return str.indexOf(findstr) === -1;
			},
			changestr(str) {
				if (str == null) {
					return '';
				}
				return str.split(' ')[0];
			},
			getDate(time) {
				if (!time) return null;
				if (this.findNotStr(time, '00:00:00')) {
					return time;
				}
				return time.split(/\s+/)[0];
			},
			checkData() {
				let self = this;
				// if (!self.contractDic.contractTypeName) {
				// 	self.showToast('请选择合同类型');
				// 	return Promise.reject('fail');
				// }

				if (self.contractDic.contractDetailDto && !self.contractDic.contractDetailDto.customerSalesmanName) {
					self.showToast('请选择业务负责人');
					return Promise.reject('fail');
				}
				if (!self.contractDic.customerName) {
					self.showToast('请选择客户信息');
					return Promise.reject('fail');
				}
				if (!self.contractDic.orgName) {
					self.showToast('请选择区域');
					return Promise.reject('fail');
				}
				if (!self.contractDic.contractDetailDto.orderList || (self.contractDic.contractDetailDto.orderList && self.contractDic
						.contractDetailDto.orderList.length <= 0)) {
					self.showToast('请选择设备信息');
					return Promise.reject('fail');
				}
				let list = self.contractDic.contractDetailDto.orderList
				for (let i = 0; i < list.length; i++) {
					let m = list[i];
					for (let j = i + 1; j < list.length; j++) {
						let n = list[j];
						if (m.type === n.type &&
							m.height === n.height &&
							m.settlementType === n.settlementType &&
							this.$datestr.doubleFloat(m.hire) == this.$datestr.doubleFloat(n.hire) &&
							this.$datestr.doubleFloat(m.hireMonthly) == this.$datestr.doubleFloat(n.hireMonthly)) {
							self.showToast('订单中有类型、高度、租赁方式、租金重复,不可提交');
							return Promise.reject('fail');
						}
					}
				}
				if (self.contractDic.contractDetailDto.orderList.some(o => o.hire === '' || Number.parseFloat(o.hire) === 0 || ((o.settlementType ===
						'4' || o.settlementType === '6') && (Number.parseFloat(o.hireMonthly) === 0) || o.hireMonthly === ''))) {
					self.showToast('租金必须大于0');
					return Promise.reject('fail');
				}

				if (self.isShowSettlementDateType && !self.contractDic.contractDetailDto.settlementDayTypeName) {
					self.showToast('请选择结算日类型');
					return Promise.reject('fail');
				}
				if (self.isShowSettlementDate && !self.contractDic.contractDetailDto.settlementDayTypeName) {
					self.showToast('请选择结算日');
					return Promise.reject('fail');
				}

				if (!self.contractDic.contractDetailDto.renterTripTypeName) {
					self.showToast('请选择运费减免约定');
					return Promise.reject('fail');
				}
				if (!self.contractDic.contractDetailDto.projectName) {
					self.showToast('请填写工程名');
					return Promise.reject('fail');
				}

				if (!self.contractDic.contractDetailDto.constructionTypeName) {
					self.showToast('请选择作业内容');
					return Promise.reject('fail');
				}
				if (!self.contractDic.contractDetailDto.deliveryPlace) {
					self.showToast('请选择交付地点');
					return Promise.reject('fail');
				}
				let orderList = this.contractDic.contractDetailDto.orderList.map(o => {
					o.beginDate = o.beginDate ? (this.findNotStr(o.beginDate, '00:00:00') ? o.beginDate + ' 00:00:00' : o.beginDate) :
						null;
					o.endDate = o.endDate ? (this.findNotStr(o.endDate, '00:00:00') ? o.endDate + ' 00:00:00' : o.endDate) : null;
					return o;
				});
				this.contractDic = {
					...this.contractDic,
					contractType: '1',
					contractTypeName: '普通合同',
					signDate: this.contractDic.signDate ?
						this.findNotStr(this.contractDic.signDate, '00:00:00') ?
						this.contractDic.signDate + ' 00:00:00' :
						this.contractDic.signDate : null,
					contractDetailDto: {
						...this.contractDic.contractDetailDto,
						orderList: orderList

					}
				};
				return new Promise((resolve, reject) => {
					this.askSubmit().then(res => {
						if (!this.backDic) {
							this.checkprojectName().then(() => {
								resolve('sucess');

							}).catch(() => {
								self.showToast('已存在客户名称、项目名称、业务负责人都相同的合同，请修改');
								reject('fail')
							})
						} else {
							resolve('sucess');
						}

					}).catch(err => {
						reject('fail');
					})
				})


				return Promise.resolve('success');
			},
			askSubmit() {
				return new Promise((resolve, reject) => {
					let leaderOrgIds = this.leaders.some(o=>o.value==this.contractDic.customerSalesman)?this.leaders.find(o=>o.value==this.contractDic.customerSalesman).orgIds:null
					if (leaderOrgIds && leaderOrgIds.length > 0 && (!leaderOrgIds.some(x => x == this.contractDic.orgId))) {
						uni.showModal({
							title: '提示',
							content: '您选择的业务负责人并非当前选定区域，是否继续操作',
							confirmText: '继续',
							success: res => {
								if (res.cancel) {
									reject('fail');
								} else {
									resolve('success');

								}
							}
						});

					} else {
						resolve('success');

					}
				})
			},
			checkprojectName() {
				let projectDic = {
					projectName: this.contractDic.contractDetailDto.projectName,
					customerId: this.contractDic.customerId,
					customerSalesman: this.contractDic.contractDetailDto.customerSalesman,
				}
				if (this.contractDic.businessNo) {
					projectDic.businessNo = this.contractDic.businessNo
				}
				return new Promise((resolve, reject) => {
					this.$network
						.getData(this.$url.CONTRACT_CHECK_NAME, 'POST', projectDic).then(result => {
							resolve('success')
						}).catch(err => {
							reject('fail')
						});
				})
			},
			submit(val) {
				uni.showLoading({
					mask: true
				});
				this.$network
					.getData(this.$url.EDIT_CONTRACT + val, 'POST', this.contractDic)
					.then(result => {
						console.log(JSON.stringify(result));
						uni.$emit('refresh-contract-list', {
							type: 'contract'
						});
						uni.$emit('refreshList', {
							type: ''
						});
						uni.$emit("refresh-notification-list", {
							type: 'apply'
						})
						uni.showToast({
							icon: 'none',
							title: '创建合同成功'
						});
						uni.removeStorage({
							key: this.userId + '_contract_draft'
						});
						if (this.persontype != "") {
							uni.$emit("goto-business", {
								type: 'apply'
							})
						} else {
							uni.navigateBack({
								delta: 1
							});
						}
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
						uni.showToast({
							title: err.message,
							icon: 'none'
						});
					});
			},
			choosePhone() {
				if (this.phoneList.length === 0) {
					return;
				}
				this.pickType = "phone";
				this.selectList = this.phoneList.map((o, index) => {
					return {
						value: index,
						label: o
					}
				});
				this.$refs.selector.show();
			}
		},
	};
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		background: $uni-bg-color-grey;
	}

	.scroll-bgView {
		flex: 1;
		padding-bottom: 70px;
	}

	.srcoll-container {
		padding-bottom: 81px;
	}

	.item-container {
		margin-left: 10px;
		margin-right: 10px;
		flex: 1;
		background: #ffffff;
	}

	.item-custommsg {
		margin-left: 10px;
		margin-right: 10px;
		padding-bottom: 10px;
		font-size: $uni-font-size-sm;
		color: $uni-text-color-gray;
	}

	.item-msg {
		display: flex;
		flex-direction: row;
		height: 25px;
		padding-left: 16px;
		justify-content: space-between;
		align-items: center;
		background: #ffffff;
	}

	.item-customdetail {
		align-items: center;
		justify-content: flex-end;
	}

	.item-distance {
		margin-top: 10px;
		/* box-shadow: 0px 1px 1px 1px rgba(4, 0, 0, 0.2); */
		border-radius: 2px;
	}

	.single-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 45px;
	}

	.auto-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.item-value-container {
		display: flex;
		flex-direction: row;
		flex: 1;
		padding-right: 4px;
		align-items: center;
		justify-content: flex-end;
	}

	.label {
		font-size: $uni-font-size-base;
		align-self: center;
	}

	.item-key {
		margin-left: 16px;
		color: $uni-text-color;
	}

	.item-value {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.value-blue {
		color: #E60000;
	}

	.arrow {
		color: $uni-color-primary;
		font-size: 16px;
	}

	.gray-arrow {
		color: #555555;
		font-size: 16px;
	}

	.muti-label {
		padding-top: 16px;
		font-size: $uni-font-size-base;
	}

	.v-item {
		display: flex;
		flex-direction: column;
	}

	.radio-container {
		padding-bottom: 20px;
		margin-left: 16px;
		padding-top: 13px;
	}

	.single-input {
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		padding-top: 4px;
		width: 60%;
		min-width: 60%;
		text-align: right;
		margin-right: 18px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.top-line {
		border-color: $uni-border-color;
		border-top-style: solid;
		border-width: 1rpx;
	}

	.switch {
		transform: scale(0.7);
		color: $uni-color-primary;
	}

	radio {
		appearance: none;
		-webkit-appearance: none;
	}

	textarea {
		width: calc(100% - 32px);
		height: 62px;
		margin-left: 16px;
		background-color: #fbfbfb;
		border-radius: 2px;
		margin-top: 8px;
		box-sizing: border-box;
		color: $uni-text-color-gray;
		margin-bottom: 16px;
	}

	.descrpition {
		color: #fca01f;
		font-size: 10px;
		margin-top: 6px;
		margin-left: 16px;
	}

	#translate-arrow {
		font-size: 16px;
		margin-right: 16px;
		transform: rotate(-90deg);
		transition: all 1s;
	}

	#translate-arrow-expend {
		font-size: 16px;
		margin-right: 16px;
		transform: rotate(90deg);
		transition: all 1s;
	}

	.attachment-container {
		display: flex;
		flex-direction: row;
		flex: 1;
		margin-left: 8px;
	}

	.pic-container {
		display: flex;
		flex-direction: row;
	}

	.picItem {
		display: flex;
		width: 54px;
		height: 54px;
		margin: 8px;
		background: #E60000;
	}

	.mask {
		background: rgba(0, 0, 0, 0.3);
		color: #ffffff;
		font-size: $uni-font-size-sm;
		width: 54px;
		height: 54px;
		line-height: 54px;
		text-align: center;
		position: absolute;
		top: 0;
		left: 0;
	}

	.botton-container {
		width: 100%;
		height: 45px;
		padding-bottom: 8px;
		padding-top: 8px;
		position: fixed;
		background: #f9f9f9;
		left: 0;
		bottom: 0;
		z-index: 200;
	}

	.submit-btn {
		margin-left: 16px;
		margin-right: 16px;
		height: 45px;
		color: #ffffff;
		background: #E60000;
	}

	.submit-btn-press {
		margin-left: 16px;
		margin-right: 16px;
		height: 45px;
		color: #ffffff;
		background: #E60000;
		opacity: 0.5;
	}

	.add-pic {
		flex: 1;
		background: #F5F4F9;
		color: #ffffff;
		font-size: 30px;
		line-height: 54px;
		width: 54px;
		margin: 5px;
		text-align: center;
	}

	/***设备信息列表****/

	.vehicle-item-container {
		display: flex;
		flex-direction: column;
		background: #ffffff;
		margin-bottom: 2px;
		padding: 0px 16px;
		border-radius: 4px;
	}

	.top-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.title-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.item-all {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.cell-container {
		width: 50%;
		display: flex;
		flex-direction: row;
	}

	.cell-container input {
		height: 30px;
		margin: 0px;
		padding: 0px;
	}

	.row-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.type-title {
		color: $uni-text-color;
		font-size: 16px;
		font-weight: 500;
		height: 40px;
		line-height: 40px;
	}

	.machine-type {
		color: $uni-text-color-gray;
		font-size: $uni-font-size-sm;
		width: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.type-height {
		color: #999999;
		font-size: 12px;
		height: 40px;
		line-height: 40px;
		margin-left: 2px;
		align-content: center;
	}

	tag-select,
	tag-input {
		flex: 1;
	}
</style>
