<template>
	<view class="creat-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<create-step 
		processKey="repair"
		@submitApply="clicksave" 
		:itemData="backDic" 
		@data-form="getBackData"
		:updateObj="dataDic"
		:isUpdate="isUpdate">
			<view class="creat-bg">
				<view class="sum-view-bg">
					<view class="cell-input-view tilte-view-sub">
						<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
						<view class="cell-input-view-right" @click="goToRecord">
							<text class="input-style" style="color: #E60000;">维修记录</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>维修单号</text><text style="color: #FF0000;">*</text></view>
						<view class="cell-input-view-right">
							<text class="input-style">{{dataDic.businessNo || "--"}}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>自喷码</text></view>
						<view class="cell-input-view-right">
							<text class="input-style">{{dataDic.printCode || "--"}}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>车号</text><text style="color: #FF0000;">*</text></view>
						<view class="cell-input-view-right">
							<text class="input-style">{{dataDic.licenseId || "--"}}</text>
						</view>
					</view>
					<!-- <select-label-item
					:isRequired = "true"
					tagName="租赁状态" 
					hint="请选择租赁状态" 
					:value="dataDic.natureName" 
					:icon="righticon" 
					@clickItemLabel="showPick('nature')"
					/>
					<view class="cell-input-view" v-if="dataDic.nature == '2'">
						<view class="cell-input-view-left">
							<text>工地</text>
						</view>
						<view class="cell-input-view-right">
							<input 
							class="input-style" 
							type="text" 
							v-model="dataDic.projectName" 
							placeholder="请填写工地名称...." 
							/>
						</view>
					</view> -->
					<select-label-item
					:isRequired = "true"
					tagName="区域" 
					hint="请选择区域" 
					:value="dataDic.orgName" 
					:icon="righticon" 
					@clickItemLabel="showPick('org')"
					/>
					<view class="cell-input-view">
						<view class="cell-input-view-left">
							<text>小时表计数</text><text style="color: #FF0000;">*</text>
						</view>
						<view class="cell-input-view-right">
							<input 
							class="input-style" 
							type="number" 
							v-model="dataDic.preHours" 
							placeholder="抄表填写工作小时数(小时)...." 
							/>
						</view>
					</view>
				</view>
				<view class="sum-view-bg">
					<view class="cell-input-view tilte-view-sub">
						<view class="cell-input-view-left boldstyle"><text>维修信息</text></view>
					</view>
					<select-label-item
					tagName="开始时间" 
					:isRequired="true" 
					hint="请选择开始时间" 
					:value="getYMDHMTime(dataDic.startDate)" 
					:icon="dateIcon" 
					@clickItemLabel="showPick('start')" 
					/>
					<view class="cell-input-view">
						<view class="cell-input-view-left">
							<text>维修工时</text><text style="color: #FF0000;" v-if="dataDic.isComplete == '1'">*</text>
						</view>
						<view class="cell-input-view-right">
							<input 
							class="input-style" 
							type="number" 
							v-model="dataDic.repairHour" 
							placeholder="请填写维修工时(小时)...." 
							/>
						</view>
					</view>
					<select-label-item 
					:tagName="dataDic.isComplete == '1' ? '结束时间' : '预计结束时间'" 
					:isRequired="dataDic.isComplete == '1'" 
					hint="请选择结束时间" 
					:value="getYMDHMTime(dataDic.endDate)" 
					:icon="dateIcon" 
					@clickItemLabel="showPick('end')" 
					/>
					<view class="cell-input-view" @click="showPick('switch')" >
						<view class="cell-input-view-left"><text>是否维修完成</text></view>
						<view class="cell-input-view-right" style="justify-content: flex-end;">
							<mycheckbox 
							style="transform: scale(0.8);"
							color="#E60000" 
							:checked="dataDic.isComplete == '1'" 
							/>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left">
							<text>维修金额</text>
						</view>
						<view class="cell-input-view-right">
							<input 
							class="input-style" 
							type="digit" 
							v-model="dataDic.repairTotal" 
							placeholder="0.00" 
							/>
						</view>
					</view>
					<select-label-item
					:isRequired = "true"
					tagName="维修来源" 
					hint="请选择维修来源" 
					:value="dataDic.reasonName" 
					:icon="righticon" 
					@clickItemLabel="showPick('reason')"
					/>
					<view class="cell-input-view" style="margin: 0px;"  v-if="dataDic.reason == '1' || dataDic.reason == '2' || dataDic.reason == '3'">
						<view style="display: flex;flex: 1;">
							<select-label-item
							:isRequired = "true"
							tagName="关联单号" 
							hint="请关联单号" 
							:value="dataDic.associatedBusinessNo" 
							:icon="righticon" 
							@clickItemLabel="chooseOrder"
							/>
						</view>
						<view style="color: #E60000;margin-right: 10px;" v-if="dataDic.associatedBusinessNo" @click="gotoDetail">
							<text>详情</text>
						</view>
					</view>
					<view style="display:flex; margin: 0px;flex-direction: column;"  v-if="dataDic.reason == '5'">
						<view class="cell-input-view">
							<view class="cell-input-view-left">
								<text>报修人</text><text style="color: #FF0000;">*</text>
							</view>
							<view class="cell-input-view-right">
								<input 
								class="input-style" 
								type="text" 
								v-model="dataDic.reporter" 
								placeholder="请输入报修人" 
								/>
							</view>
						</view>
						<view class="cell-input-view">
							<view class="cell-input-view-left">
								<text>报修人联系方式</text><text style="color: #FF0000;">*</text>
							</view>
							<view class="cell-input-view-right">
								<input 
								class="input-style" 
								type="number" 
								v-model="dataDic.phoneNum" 
								placeholder="请输入报修人联系方式" 
								/>
							</view>
						</view>
						<select-label-item
						tagName="报修时间" 
						:isRequired="true" 
						hint="请选择报修时间" 
						:value="getYMDHMTime(dataDic.reportTime)" 
						:icon="dateIcon" 
						@clickItemLabel="showPick('report')" 
						/>
					</view>
					<select-label-item
					:isRequired = "true"
					tagName="维修人" 
					hint="请选择维修人" 
					:value="dataDic.repairter" 
					:icon="righticon" 
					@clickItemLabel="choosePerson('repair')"
					/>
					<view class="cell-input-view">
						<view class="cell-input-view-left">
							<text>同行人</text>
						</view>
						<view class="cell-input-view-right">
							<input 
							class="input-style" 
							type="text" 
							v-model="dataDic.togetherPeople" 
							placeholder="请输入维修同行人...." 
							/>
						</view>
						<view class="addressstyle" @click="choosePerson('together')">
							<i class="iconfont arrow iconzl--kehuguanli--"></i>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left">
							<text>维修地址</text>
						</view>
						<view class="cell-input-view-right">
							<input 
							class="input-style" 
							type="text" 
							v-model="dataDic.address" 
							placeholder="请输入维修地址...." 
							:disabled="isChooseAddress"
							/>
						</view>
						<view class="addressstyle" @click="chooseAddress">
							<i class="iconfont arrow iconzl--zuobiao"></i>
						</view>
					</view>
				</view>
				<view class="sum-view-bg">
					<view class="cell-input-view tilte-view-sub">
						<view class="cell-input-view-left boldstyle"><text>故障信息</text></view>
					</view>
					<select-label-item
					:isRequired = "true"
					tagName="故障类型" 
					hint="请选择故障类型" 
					:value="dataDic.repairTypeName" 
					:icon="righticon" 
					@clickItemLabel="showPick('repairType')"
					/>
					<text-label-item
					tagName="故障原因" 
					placeholder="请输入故障原因..." 
					@ipnuttext="repairChange($event,'cause')" 
					:isRequired="true" 
					:inputValue="dataDic.description" 
					/>
					<text-label-item
					tagName="故障原因分析" 
					placeholder="请输入故障原因分析..." 
					@ipnuttext="repairChange($event,'analysis')" 
					:isRequired="true" 
					:inputValue="dataDic.responsibleParty" 
					/>
					<text-label-item
					tagName="故障处理措施和预防措施" 
					placeholder="请输入故障处理措施和预防措施..." 
					@ipnuttext="repairChange($event,'guard')" 
					:isRequired="true" 
					:inputValue="dataDic.measures" 
					/>
				</view>
				<view class="sum-view-bg">
					<view class="cell-input-view tilte-view-sub">
						<view class="cell-input-view-left boldstyle"><text>配件信息</text></view>
						<view class="cell-input-view-right" @click="addacc">
							<text class="input-style" style="color: #E60000;">+ 新增</text>
						</view>
					</view>
					<view v-for="(item,index) in dataDic.partsCollarLists" :key="index" class="cell-view">
						<view class="cell-input-view" style="margin: 5px 10px;">
							<view class="cell-input-view-left" style="color: #999999;"><text>配件名称</text></view>
							<view class="cell-input-view-right" v-if="!item.id">
								<input 
								class="input-style"
								style="margin-left:15px;text-align: left;"
								type="text" 
								v-model="item.partsBasics.name"
								placeholder="请输入配件名称"
								/>
							</view>
							<view class="cell-input-view-right" v-else>
								<text class="input-style" style="margin-left:15px;text-align:left;">{{item.partsBasics.name || "--"}}</text>
							</view>
							<view style="margin-left: 15px;">
								<uni-number-box 
								:min= "0"
								:max="10000"
								:inputdisabled="false"
								:compare="false"
								@change="getNumValue($event,index,item)" 
								:value="item.partsNumber"
								/> 
							</view>
						</view>
						<view class="cell-input-view" style="margin: 5px 10px;">
							<view class="cell-input-view" style="margin-left: 0px;">
								<view class="cell-input-view-left" style="color: #999999;"><text>配件单价(元)</text></view>
								<view class="cell-input-view-right" v-if="!item.id">
									<input 
									class="input-style"
									style="margin-left:15px;text-align: left;"
									type="text" 
									@input="checkPrice($event,index)"
									:value="item.salePrice"
									placeholder="0.00"
									/>
								</view>
								<view class="cell-input-view-right" v-else>
									<text class="input-style" style="margin-left:15px;text-align:left;">{{item.salePrice || "--"}}</text>
								</view>
							</view>
						</view>
						<view class="cell-input-view" style="margin: 5px 10px;">
							<view class="cell-input-view-left" style="color: #999999;"><text>单类总价(元)</text></view>
							<view class="cell-input-view-right">
								<text class="input-style" style="margin-left:15px;text-align:left;">{{item.partsAmount || "0"}}</text>
							</view>
						</view>
						<text-label-item
						tagName="备注" 
						placeholder="请输入备注..." 
						@ipnuttext="repairPart($event,index)" 
						:isRequired="false" 
						:inputValue="item.remark" 
						/>
						<view class="cell-input-view" style="margin: 5px 10px;">
							<view class="cell-input-view-right" @click="deletePart(index)">
								<text class="input-style" style="color: #FF0000;">删除</text>
							</view>
						</view>
					</view>
					<select-label-item
					v-if="isshowPart()"
					:isRequired = "true"
					tagName="领用人" 
					hint="请选择领用人" 
					:value="dataDic.leaderName" 
					:icon="righticon" 
					@clickItemLabel="showPick('assgin')"
					/>
					<select-label-item
					v-if="isshowPart()"
					:isRequired = "true"
					tagName="领用时间" 
					hint="请选择领用时间" 
					:value="changestr(dataDic.collarTime)" 
					:icon="dateIcon" 
					@clickItemLabel="showPick('collar')"
					/>
				</view>
				<view class="sum-view-bg">
					<view class="cell-input-view tilte-view-sub">
						<view class="cell-input-view-left boldstyle"><text>电池信息</text></view>
						<view class="cell-input-view-right" @click="addbattery">
							<text class="input-style" style="color: #E60000;">+ 新增</text>
						</view>
					</view>
					<view v-for="(item,index) in dataDic.batteryList" :key="index" class="cell-view">
						<view class="cell-input-view" style="margin: 5px 10px;">
							<view class="cell-input-view-left" style="color: #999999;"><text>电池品牌</text><text style="color: #FF0000;">*</text></view>
							<view class="cell-input-view-right">
								<input 
								class="input-style"
								style="margin-left:15px;"
								@input="checkBattery($event,index,'brand')"
								type="text" 
								:value="item.brand"
								placeholder="请输入电池品牌"
								/>
							</view>
						</view>
						<view class="cell-input-view" style="margin: 5px 10px;">
							<view class="cell-input-view-left" style="color: #999999;"><text>电池型号</text><text style="color: #FF0000;">*</text></view>
							<view class="cell-input-view-right">
								<input 
								class="input-style"
								style="margin-left:15px;"
								@input="checkBattery($event,index,'modelName')"
								type="text" 
								:value="item.modelName"
								placeholder="请输入电池型号"
								/>
							</view>
						</view>
						<view class="cell-input-view" style="margin: 5px 10px;">
							<view class="cell-input-view-left" style="color: #999999;"><text>电池序列号</text></view>
							<view class="cell-input-view-right">
								<input 
								class="input-style"
								style="margin-left:15px;"
								@input="checkBattery($event,index,'seriesNum')"
								type="text" 
								:value="item.seriesNum"
								placeholder="请输入电池序列号"
								/>
							</view>
						</view>
						<view class="cell-input-view" style="margin: 5px 10px;">
							<view class="cell-input-view-left" style="color: #999999;"><text>电池名称</text></view>
							<view class="cell-input-view-right">
								<input 
								class="input-style"
								style="margin-left:15px;"
								@input="checkBattery($event,index,'name')"
								type="text" 
								:value="item.name"
								placeholder="请输入电池名称"
								/>
							</view>
						</view>
						<select-label-item
						:isRequired = "true"
						tagName="电池日期" 
						tagColor="#999999"
						hint="请选择电池日期" 
						:value="changestr(item.updateDate)" 
						:icon="dateIcon" 
						@clickItemLabel="showBPick('batterytime',index)"
						/>
						<text-label-item
						tagName="备注" 
						placeholder="请输入备注..." 
						@ipnuttext="repairBattery($event,index)" 
						:isRequired="false" 
						:inputValue="item.remark" 
						/>
						<view class="cell-input-view" style="margin: 5px 10px;">
							<view class="cell-input-view-right" @click="deleteBattery(index)">
								<text class="input-style" style="color: #FF0000;">删除</text>
							</view>
						</view>
					</view>
				</view>
				<view class="sum-view-bg">
					<view class="cell-input-view tilte-view-sub">
						<view class="cell-input-view-left boldstyle"><text>其他信息</text></view>
					</view>
					<imgupload
					@uploadfinish="uploadfinish" 
					@deleteUrl="deleteUrl" 
					:imgFinishlist="dataDic.fileList" 
					type="repair"
					uploadType="attachment" 
					maximg="20" 
					 />
					<text-label-item 
					tagName="备注" 
					placeholder="请输入备注..." 
					@ipnuttext="repairChange($event,'remark')" 
					:inputValue="dataDic.remark"
					/>
				</view>
				<view class="pop-container">
					<uni-popup ref="startDialog" type="center" :mask-click="false">
						<view class="uni-tip">
							<view class="tip-title"><text>新增</text></view>
							<view class="row-item" @click="clickType('url')">
								<view class="row-tag"><text>从配件库存中添加</text></view>
							</view>
							<view class="row-item" @click="clickType('add')">
								<view class="row-tag"><text>手动输入配件</text></view>
							</view>
							<view class="row-item" style="background: #dcdcdc;" @click="clickCancle">
								<view class="row-tag"><text>取消</text></view>
							</view>
						</view>
					</uni-popup>
				</view>
				<w-picker
				:selectList="selectList" 
				@confirm="onConfirm" 
				mode="selector" 
				ref="selector"
				themeColor="#E60000" 
				/>
				<w-picker 
				:mode="dateTime" 
				startYear="2000" 
				endYear="3000" 
				:current="true" 
				@confirm="onConfirm"
				:disabledAfter="false"
				ref="date" 
				themeColor="#E60000" 
				/>
			</view>
		</create-step>
	</view>
</template>
<script>
	import selectLabelItem from '@/components/common/uni-item/select-label-item.vue';
	import textLabelItem from '@/components/common/uni-item/text-label-item.vue';
	import labelArrow from '@/components/common/common-ui/label-arrow.vue';
	import imgupload from '@/components/common/image-upload/image-upload.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	import createStep from '@/components/workflow/create-step.vue';
	import UniNumberBox from '@/components/common/uni-number-box/uni-number-box.vue';
	import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
	export default {
		components: {
			selectLabelItem,
			textLabelItem,
			labelArrow,
			imgupload,
			createStep,
			wPicker,
			UniNumberBox,
			uniPopup
		},
		computed: {},
		data() {
			return {
				dateTime:'dateTime',
				numindex:0,
				dateIcon: 'iconzl--rili',
				companyicon: 'iconiconzhengli_zuzhijiagou',
				righticon: 'iconarrow-right',
				dataDic: {
					isComplete:'1',
					partsCollarLists:[],
					batteryList:[]
				},
				backDic: null,
				isUpdate:false,
				SourceIndex:0,
				fromType:'',//来源
				//数据
				repairList:[],//维修人
				chooseToggerList:[],//选中的同行人
				chooseReason:[],
				addrObj:{},//选中地址
				selectList:[],
				assignArr:[],
				reasonArr:[],
				causeTypeArr:[],
				stateArr:[],
				orgArr:[],
				selectType:'',
				isChooseAddress:false,
				isNeedNo:false
			};
		},
		watch:{
			'dataDic.repairTotal'(val) {
				this.dataDic = {
					...this.dataDic,
					repairTotal: val
				};
				setTimeout(()=>{
					this.dataDic = {
						...this.dataDic,
						repairTotal: this.$gxfmethod.getMoneyPart(val)
					};
				}, 50);
			},
			'dataDic.repairHour'(val) {
				this.dataDic = {
					...this.dataDic,
					repairHour: val
				};
				setTimeout(()=>{
					this.dataDic = {
						...this.dataDic,
						repairHour: this.$gxfmethod.getMoneyPart(val)
					};
				}, 50);
			},
		},
		onLoad(option) {
			if (option.item) { 
				uni.setNavigationBarTitle({
					title:'修改维修单'
				})
				//退回编辑,撤回提交
				this.backDic = JSON.parse(decodeURIComponent(option.item))
				this.isUpdate = option.isUpdate ? (option.isUpdate === "1" ? true : false):false
				if(this.isUpdate){
					this.loaddata(this.backDic.businessNo)
				}
			}else{
				this.isNeedNo = true;
				uni.getStorage({
					key: this.$savekey.USER_INFO_MEG,
					success: res => {
						this.dataDic = {
							...this.dataDic,
							orgName:this.$gxfmethod.getorgName(res.data),
							orgId:res.data.orgId,
							repairterId:res.data.roleType === this.$savekey.USER_ROLE_SEVICER ? res.data.id :undefined,
							repairter:res.data.roleType === this.$savekey.USER_ROLE_SEVICER ? res.data.username :undefined,
							// leaderId:res.data.roleType === this.$savekey.USER_ROLE_SEVICER ? res.data.id :undefined,
							// leaderName:res.data.roleType === this.$savekey.USER_ROLE_SEVICER ? res.data.username :undefined,
						};
						if(this.dataDic.repairterId){
							let newlist = this.dataDic.repairterId.split(',');
							this.repairList = newlist.map((o)=>{
								return {
									id:o
								}
							})
						}
					}
				});
				if(option.itemmachine){
					let item = JSON.parse(decodeURIComponent(option.itemmachine));
					this.loadMachineBaseData(item.licenseId);
				}
				if(option.isLocal){
					this.isChooseAddress = true;
					this.dataDic = {
						...this.dataDic,
						"isLocal":"1",
					}
				}else{
					this.dataDic = {
						...this.dataDic,
						"isLocal":"0",
					}
				}
				if(option.xjitem){
					let item = JSON.parse(decodeURIComponent(option.xjitem));
					this.fromType = 'xj'
					this.dataDic = {
						...this.dataDic,
						associatedBusinessNo:item.businessNo,
					}
					this.loadMachineBaseData(item.machineDto.licenseId);
				}
				if(option.jxitem){
					let item = JSON.parse(decodeURIComponent(option.jxitem));
					this.fromType = 'jx'
					this.dataDic = {
						...this.dataDic,
						associatedBusinessNo:item.businessNo,
					}
					this.loadMachineBaseData(item.licenseId);
				}
				if(option.rwitem){
					this.fromType = 'rw'
					let item = JSON.parse(decodeURIComponent(option.rwitem));
					let reason = "1";
					if(item.task.repairSource == '2'){
						reason = "1";
					}else if(item.task.repairSource == '3'){
						reason = "2";
					}else if(item.task.repairSource == '4'){
						reason = "3";
					}
					this.dataDic = {
						...this.dataDic,
						reason:reason,
						reasonName:item.task.repairSourceName,
						todoId:item.id,
						associatedBusinessNo:item.task.sourceNumber,
					}
					this.loadMachineBaseData(item.licenseId);
				}
				// this.getBusinessNo()
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						this.pointToAddress(res.latitude, res.longitude);
					}
				});
			}
			this.getStateList()
			this.getUserLeaders();
			// this.loadDesCTypes();
			this.loadAreaList();
			//同行人
			uni.$on('choosedAssignTogger', obj => {
				let  chooseArr = obj.data || [];
				if(this.selectType === 'repair'){
					this.repairList = obj.data;
					let choosedRList = [];
					let choosedRIDList = [];
					this.repairList.forEach(o => {
						choosedRList.push(o.username);
						choosedRIDList.push(o.id);
					});
					this.dataDic = {
						...this.dataDic,
						"repairterId":choosedRIDList.join(','),
						"repairter":choosedRList.join(',')
					};
					// if(!this.dataDic.leaderId || this.dataDic.leaderId ===""){
					// 	this.dataDic = {
					// 		...this.dataDic,
					// 		"leaderId": this.repairList.length > 0 ? this.repairList[0].id : undefined,
					// 		"leaderName":this.repairList.length > 0 ? this.repairList[0].username : undefined,
					// 		"repairterId":choosedRIDList.join(','),
					// 		"repairter":choosedRList.join(',')
					// 	};
					// }else{
					// 	this.dataDic = {
					// 		...this.dataDic,
					// 		"repairterId":choosedRIDList.join(','),
					// 		"repairter":choosedRList.join(',')
					// 	};
					// }
				}else{
					this.chooseToggerList = obj.data;
					let choosedList = [];
					let choosedIDList = [];
					this.chooseToggerList.forEach(o => {
						choosedList.push(o.username);
						choosedIDList.push(o.id);
					});
					this.dataDic = {
						...this.dataDic,
						// "togetherPeopleId":choosedIDList.join(','),
						"togetherPeople":choosedList.join(',')
					};
				}
			});
			//维修原因
			uni.$on('chooseReason', obj => {
				let  chooseArr = obj.data || [];
				this.chooseReason = obj.data;
				let choosedList = [];
				let choosedIDList = [];
				this.chooseReason.forEach(o => {
					choosedList.push(o.label);
					choosedIDList.push(o.value);
				});
				this.dataDic = {
					...this.dataDic,
					"repairType":choosedIDList.join(','),
					"repairTypeName":choosedList.join(',')
				};
			});
			//地址
			uni.$on('choose-address', obj => {
				let result = obj.data
				this.addrObj = {
					address: result.address, //	交付地点
					latitude: result.latitude, //纬度
					longitude: result.longitude //经度
				};
				this.dataDic = {
					...this.dataDic,
					"address":result.address
				};
			});
			//配件项
			uni.$on('choose-repair-emit', usnerinfo => {
				let list = usnerinfo.list || [];
				let parts = this.dataDic.partsCollarLists || []
				this.getchecklist(list,parts)
			});
			//保养
			uni.$on('choose-maintain-emit', usnerinfo => {
				let item = usnerinfo.item || {};
				this.dataDic = {
					...this.dataDic,
					associatedBusinessNo:item.businessNo
				}
			});
			//检修
			uni.$on('choose-check-emit', usnerinfo => {
				let item = usnerinfo.item || {};
				this.dataDic = {
					...this.dataDic,
					associatedBusinessNo:item.businessNo
				}
			});
			//巡检
			uni.$on('choose-polling-emit', usnerinfo => {
				let item = usnerinfo.item || {};
				this.dataDic = {
					...this.dataDic,
					associatedBusinessNo:item.businessNo
				}
			});
		},
		onUnload() {
			// 取消监听事件
			uni.$off('choosedAssignTogger');
			uni.$off('choose-address');
			uni.$off('choose-repair-emit');
			uni.$off('choose-maintain-emit');
		},
		methods: {
			goToRecord(){
				uni.navigateTo({
					url:'/devicePages/device-maintain-record?title=维修记录&type=repair&licenseId='+this.dataDic.licenseId
				})
			},
			getYMDHMTime(date) {
				let d = ''
				if (date) {
					d = this.$dateUtil.timeFormatYMDHM(date);
				}
				return d;
			},
			isshowPart(){
				if(this.dataDic.partsCollarLists && this.dataDic.partsCollarLists.length > 0){
					return true
				}
				return false
			},
			changestr(str) {
				if (str == null) {
					return '';
				}
				return str.split(' ')[0];
			},
			// 获取退回后通过dataForm接口获取的数据详情
			getBackData(val) {
				if(!this.isUpdate){
					let result = JSON.parse(val);
					this.dataDic = {
						...result,
						partsCollarLists:result.partsCollarLists && result.partsCollarLists.length > 0 ? result.partsCollarLists : [],
						batteryList:result.batteryList && result.batteryList.length > 0 ? result.batteryList : [],
					};
					if(this.dataDic.isLocal && this.dataDic.isLocal=='1'){
						this.isChooseAddress = true;
					}
					let newlist = this.dataDic.repairterId.split(',');
					this.repairList = newlist.map((o)=>{
						return {
							id:o
						}
					})
					let reasonArrs = this.dataDic.repairType.split(',');
					this.chooseReason = reasonArrs.map((o)=>{
						return {
							id:o
						}
					})
					this.loadMachineBaseData(result.licenseId);
				}
			},
			// 获取单号
			getBusinessNo() {
				let url = this.$url.CREATE_MACHINE_NO.replace(/{type}/, 'WX')
				this.$network.getData(url, "GET", null).then((result) => {
					this.dataDic = {
						...this.dataDic,
						"businessNo": result,
					}
				}).catch((err) => {})
			},
			//定位信息
			async pointToAddress(latitude, longitude) {
				let address = await this.$gxfmethod.pointToAddress(latitude, longitude);
				this.addrObj = {
					latitude: latitude,
					longitude: longitude,
					address
				};
				this.dataDic = {
					...this.dataDic,
					address
				}
			},
			//获取车辆基础信息
			loadMachineBaseData(licenseId){
				let urlstr = this.$url.REPAIR_CREATE_DIC + licenseId;
				this.$network.getData(urlstr, 'GET', null).then(result => {
					if(!this.backDic){
						this.dataDic = {
							...this.dataDic,
							licenseId:result.licenseId,
							printCode:result.printCode,
							nature:result.state,
							natureName:result.stateName
						};
					}else{
						this.dataDic = {
							...this.dataDic,
							licenseId:result.licenseId,
							printCode:result.printCode,
						};
					}
					this.reasonArr = result.reason.map(o => {
						return {
							label: o.value,
							value: o.key
						};
					});
					if(this.fromType === 'jx'){
						let dict = this.reasonArr.filter(o=>{return o.value == '2'})[0];
						this.dataDic = {
							...this.dataDic,
							reason:dict.value,
							reasonName:dict.label,
						}
					}else if(this.fromType === 'xj'){
						let dict = this.reasonArr.filter(o=>{return o.value == '3'})[0];
						console.log(JSON.stringify(dict))
						this.dataDic = {
							...this.dataDic,
							reason:dict.value,
							reasonName:dict.label,
						}
						console.log(JSON.stringify(this.dataDic))
					}
					if(this.isNeedNo){
						this.dataDic = {
							...this.dataDic,
							"businessNo": result.serialNumber,
						}
					}
					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
				});
			},
			//原因
			// loadDesCTypes() {
			// 	this.$network.loadType('repair_record_type').then(result => {
			// 		this.causeTypeArr = [...result];
			// 		uni.hideLoading();
			// 	}).catch(err => {});
			// },
			//区域
			loadAreaList(){
				uni.showLoading();
				let urlstr = this.$url.ORG_LIST;
				this.$network
					.getData(urlstr, 'GET', null)
					.then(result => {
						let list = result;
						this.orgArr = this.getChildren(list);
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
			//撤回时获取详情
			loaddata(key) {
				let url = this.$url.MACHINE_REPAIR_DETAIL;
				let param = {
					businessNo: key
				};
				this.$network.getData(url, 'GET', param).then(result => {
					this.dataDic = {
						...result,
						partsCollarLists:result.partsCollarLists && result.partsCollarLists.length > 0 ? result.partsCollarLists : [],
						batteryList:result.batteryList && result.batteryList.length > 0 ? result.batteryList : [],
					};
					if(this.dataDic.isLocal && this.dataDic.isLocal=='1'){
						this.isChooseAddress = true;
					}
					let newlist = this.dataDic.repairterId.split(',');
					this.repairList = newlist.map((o)=>{
						return {
							id:o
						}
					})
					let reasonArrs = this.dataDic.repairType.split(',');
					this.chooseReason = reasonArrs.map((o)=>{
						return {
							id:o
						}
					})
					this.loadMachineBaseData(result.licenseId);
				}).catch(err => {});
			},
			//加载维修性质
			getStateList(){
				this.$network.loadType('rental_status').then(result => {
					this.stateArr = result;
				}).catch(err => {});
			},
			//加载服务人员
			getUserLeaders() {
				let param = {
					showAdmin: false,
					// orgId : this.dataDic.orgId,
					roleType : this.$savekey.USER_ROLE_SEVICER
				}
				this.$network
					.getData(this.$url.USER_LEADERS, 'GET', param)
					.then(result => {
						this.assignArr = result.map(o => {
							return {
								label:o.username,
								value:o.id
							}
						})
					}).catch(err => {});
			},
	        //选择器
			showPick(type) {
				this.selectType = type;
				// 
				if(type === 'assgin'){
					this.selectList = this.assignArr;
					this.$refs.selector.show();
				}else if(type === 'switch'){
					this.dataDic = {
						...this.dataDic,
						isComplete: this.dataDic.isComplete == '1' ? '0' : '1'
					};
				}else if(type === 'reason'){
					if(this.fromType === 'rw'){
						return
					}
					this.selectList = this.reasonArr;
					this.$refs.selector.show();
				}else if(type === 'repairType'){
					// this.selectList = this.causeTypeArr;
					// this.$refs.selector.show();
					let list = [...this.chooseReason];
					console.log(JSON.stringify(list))
					uni.navigateTo({
						url: './repair-reason?choosedList=' + JSON.stringify(list)
					});
				}else if(type === 'nature'){
					this.selectList = this.stateArr;
					this.$refs.selector.show();
				}else if(type === 'org'){
					this.selectList = this.orgArr;
					this.$refs.selector.show();
				}else{
					if(type === 'collar'){
						this.dateTime = "date"
					}else{
						this.dateTime = "halfDate"
					}
					this.$refs.date.show();
				}
			},
			showBPick(type,index) {
				this.dateTime = "date";
				this.selectType = type;
				this.numindex = index;
				this.$refs.date.show();
			},
			//选择同行人
			choosePerson(type) {
				this.selectType = type;
				let list = [];
				if(type === 'repair'){
					list =  [...this.repairList]
				}else{
					list =  [...this.chooseToggerList]
				}
				console.log(JSON.stringify(list))
				uni.navigateTo({
					url: './togger_peson?choosedList=' + JSON.stringify(list) + "&type=" + type + "&orgId=" + this.dataDic.orgId
				});
			},
			//选择维修地址
			chooseAddress() {
				if(this.isChooseAddress){
					return;
				}
				uni.navigateTo({
					url: '/otherPages/map/nvr-map?deliveryAddress=' + JSON.stringify(this.addrObj)
				});
			},
			//选择单号
			chooseOrder() {
				if(this.fromType === 'rw'){
					return
				}
				if(this.dataDic.reason == '1'){
					uni.navigateTo({
						url:'./choose-maintain-list?item=' + encodeURIComponent(JSON.stringify(this.dataDic))
					})
				}else if(this.dataDic.reason == '2'){
					uni.navigateTo({
						url:'./choose-check-list?item=' + encodeURIComponent(JSON.stringify(this.dataDic))
					})
				}else if(this.dataDic.reason == '3'){
					uni.navigateTo({
						url:'./choose-polling-list?item=' + encodeURIComponent(JSON.stringify(this.dataDic))
					})
				}
			},
			onConfirm(val) {
				if(this.selectType === 'assgin'){
					this.dataDic = {
						...this.dataDic,
						leaderId: val.checkArr.value,
						leaderName:val.checkArr.label
					};
				}else if(this.selectType === 'reason'){
					if(this.dataDic.reason != val.checkArr.value){
						this.dataDic = {
							...this.dataDic,
							associatedBusinessNo:"",
							reason: val.checkArr.value,
							reasonName:val.checkArr.label
						};
					}
				}else if(this.selectType === 'repairType'){
					this.dataDic = {
						...this.dataDic,
						repairType: val.checkArr.value,
						repairTypeName:val.checkArr.label
					};
				}else if(this.selectType === 'nature'){
					this.dataDic = {
						...this.dataDic,
						nature: val.checkArr.value,
						natureName:val.checkArr.label
					};
				}else if(this.selectType === 'org'){
					this.dataDic = {
						...this.dataDic,
						orgId: val.checkArr.value,
						orgName:val.checkArr.label
					};
				}else if(this.selectType === 'start'){
					this.dataDic = {
						...this.dataDic,
						startDate: val.result + ':00'
					};
				}else if(this.selectType === 'end'){
					if(this.$datestr.gettimedifferencenow(val.result + ':00') > 0){
						this.dataDic = {
							...this.dataDic,
							endDate: val.result + ':00',
							isComplete: '1'
						};
					}else{
						this.dataDic = {
							...this.dataDic,
							endDate: val.result + ':00',
							isComplete: '0'
						};
					}
				}else if(this.selectType === 'report'){
					this.dataDic = {
						...this.dataDic,
						reportTime: val.result + ':00',
					};
				}else if(this.selectType === 'collar'){
					this.dataDic = {
						...this.dataDic,
						collarTime: val.result + " 06:00:00"
					};
				}else if(this.selectType == "batterytime"){
					let newlist = [...this.dataDic.batteryList];
					let item = newlist[this.numindex];
					let newitem = {
						...item,
						updateDate : val.result + " 06:00:00",
					}
					this.dataDic.batteryList.splice(this.numindex,1,newitem)
				}
			},
			//原因分析描述措施
			repairChange(val,type){
				if(type === 'cause'){
					this.dataDic = {
						...this.dataDic,
						description: val
					};
				}else if(type === 'analysis'){
					this.dataDic = {
						...this.dataDic,
						responsibleParty: val
					};
				}else if(type === 'guard'){
					this.dataDic = {
						...this.dataDic,
						measures: val
					};
				}else if(type === 'remark'){
					this.dataDic = {
						...this.dataDic,
						remark:val
					}
				}
			},
			//添加配件
			addacc() {
				this.$refs.startDialog.open();
			},
			addbattery(){
				let datestr = this.$datestr.dateFormat();
				this.dataDic.batteryList.push({
					brand:"",
					modelName:'',
					updateDate:datestr,
					seriesNum:'',
					name:'',
					remark:''
				})
			},
			clickType(type) {
				if(type === 'url'){
					// let parts = this.dataDic.parts.filter(o=>{
					// 	return o.id
					// })
					uni.navigateTo({
						url: './choose-part-list?list=' + encodeURIComponent(JSON.stringify(this.dataDic.partsCollarLists))
					});
				}else{
					this.dataDic.partsCollarLists.push({
						partsBasics:{
							name:"",
						},
						salePrice:"",
						partsNumber:'0',
						remark:''
					})
				}
				this.$refs.startDialog.close();
			},
			clickCancle() {
				this.$refs.startDialog.close();
			},
			getchecklist(newlist,oldList){
				if(newlist){
					let list = newlist.map((item)=>{
						if(item.stockId){
							let filterlist = oldList.filter(o=>{return o.stockId === item.stockId});
							if(filterlist.length > 0){
								return filterlist[0]
							}
							return {
								...item,
								id:undefined,
								partsNumber:'0',
								remark:''
							};
						}else{
							return item;
						}
					})
					this.dataDic = {
						...this.dataDic,
						partsCollarLists:[...list]
					}
				}
			},
			//删除配件
			deletePart(index) {
				this.dataDic.partsCollarLists.splice(index,1)
			},
			deleteBattery(index){
				this.dataDic.batteryList.splice(index,1)
			},
			//数量监听
			getNumValue(val,index,item){
				let salePrice = item.salePrice || 0
				let newitem = {
					...item,
					partsNumber : val.toString(),
					partsAmount : this.getAllPrice(salePrice,val)
				}
				this.dataDic.partsCollarLists.splice(index,1,newitem)
			},
			getAllPrice(price,num){
				let total = price * num;
				return this.$datestr.doubleFloat(total).toString()
			},
			//配件价格监听
			checkPrice(e, index) {
				let val = e.detail.value;
				let newlist = [...this.dataDic.partsCollarLists];
				let item = newlist[index];
				let newitem = {
					...item,
					salePrice : val,
				}
				this.dataDic.partsCollarLists.splice(index,1,newitem)
				setTimeout(()=> {
					let newlisttwo = [...this.dataDic.partsCollarLists];
					let partsNumber = item.partsNumber || 0
					let newitemtwo = {
						...newlisttwo[index],
						salePrice : this.$gxfmethod.getMoneyPart(val),
						partsAmount : this.getAllPrice(this.$gxfmethod.getMoneyPart(val),partsNumber)
					}
					this.dataDic.partsCollarLists.splice(index,1,newitemtwo)
				}, 50);
			},
			checkBattery(e, index,bkey){
				let val = e.detail.value;
				let newlist = [...this.dataDic.batteryList];
				let item = newlist[index];
				item[bkey] = val;
				let newitem = {
					...item,
				}
				this.dataDic.batteryList.splice(index,1,newitem)
			},
			repairPart(e, index){
				let newlist = [...this.dataDic.partsCollarLists];
				let item = newlist[index];
				let newitem = {
					...item,
					remark : e,
				}
				this.dataDic.partsCollarLists.splice(index,1,newitem)
			},
			repairBattery(e, index){
				let newlist = [...this.dataDic.batteryList];
				let item = newlist[index];
				let newitem = {
					...item,
					remark : e,
				}
				this.dataDic.batteryList.splice(index,1,newitem)
			},
			//取消按钮
			clickecancle() {
				uni.navigateBack({
					delta: 1
				});
			},
			//上传图片回调
			uploadfinish(val) {
				let list = val.data;
				this.dataDic = {
					...this.dataDic,
					fileList: list
				};
			},
			//删除回调
			deleteUrl(val) {
				let list = val.data;
				this.dataDic = {
					...this.dataDic,
					fileList: list
				};
			},
			//检验数据
			checkData() {
				this.dataDic = {
					...this.dataDic
				}
				if (!this.dataDic.preHours) {
					uni.showToast({
						title: '请选择小时表计数',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.dataDic.startDate) {
					uni.showToast({
						title: '请选择开始时间',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (this.dataDic.isComplete == '1' && !this.dataDic.endDate) {
					uni.showToast({
						title: '请选择结束时间',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (this.dataDic.isComplete == '1' && !this.dataDic.repairHour) {
					uni.showToast({
						title: '请输入维修时长',
						icon: 'none'
					});
					return Promise.reject('fail'); 
				}
				if (!this.dataDic.repairterId) {
					uni.showToast({
						title: '请选择维修人',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (this.dataDic.partsCollarLists && this.dataDic.partsCollarLists.length > 0) {
					if(this.dataDic.partsCollarLists.some(o=>{return !o.partsBasics.name || o.partsBasics.name === ''})){
						uni.showToast({
							title: '配件列表存在配件名称为空的项',
							icon: 'none'
						});
						return Promise.reject('fail');
					}
					if(this.dataDic.partsCollarLists.some(o=>{return !o.partsNumber || parseInt(o.partsNumber) === 0})){
						uni.showToast({
							title: '配件列表存在配件数量为0的项',
							icon: 'none'
						});
						return Promise.reject('fail');
					}
					if (!this.dataDic.leaderId) {
						uni.showToast({
							title: '请选择领用人',
							icon: 'none'
						});
						return Promise.reject('fail');
					}
					if (!this.dataDic.collarTime) {
						uni.showToast({
							title: '请选择领用时间',
							icon: 'none'
						});
						return Promise.reject('fail');
					}
				}
				if (!this.dataDic.reason) {
					uni.showToast({
						title: '请选择维修来源',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if(this.dataDic.reason == '1' || this.dataDic.reason == '2' || this.dataDic.reason == '3'){
					if (!this.dataDic.associatedBusinessNo) {
						uni.showToast({
							icon: 'none',
							title: '请关联单号'
						});
						return Promise.reject('fail');
					}
				}
				if(this.dataDic.reason == '5'){
					if (!this.dataDic.reporter) {
						uni.showToast({
							icon: 'none',
							title: '请输入报修人'
						});
						return Promise.reject('fail');
					}
					if (!this.dataDic.phoneNum) {
						uni.showToast({
							icon: 'none',
							title: '请输入报修人联系方式'
						});
						return Promise.reject('fail');
					}
					if (!this.dataDic.reportTime) {
						uni.showToast({
							icon: 'none',
							title: '请选择报修时间'
						});
						return Promise.reject('fail');
					}
				}
				if (!this.dataDic.repairType) {
					uni.showToast({
						title: '请选择故障类型',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.dataDic.description) {
					uni.showToast({
						icon: 'none',
						title: '请输入故障原因'
					});
					return Promise.reject('fail');
				}
				if (!this.dataDic.responsibleParty) {
					uni.showToast({
						icon: 'none',
						title: '请输入故障原因分析'
					});
					return Promise.reject('fail');
				}
				if (!this.dataDic.measures) {
					uni.showToast({
						icon: 'none',
						title: '请输入故障处理措施和预防措施'
					});
					return Promise.reject('fail');
				}
				if (this.dataDic.batteryList && this.dataDic.batteryList.length > 0) {
					if(this.dataDic.batteryList.some(o=>{return !o.brand || o.brand === ''})){
						uni.showToast({
							title: '电池列表存在电池品牌为空的项',
							icon: 'none'
						});
						return Promise.reject('fail');
					}
					if(this.dataDic.batteryList.some(o=>{return !o.modelName || o.modelName === ''})){
						uni.showToast({
							title: '电池列表存在电池型号为空的项',
							icon: 'none'
						});
						return Promise.reject('fail');
					}
					if(this.dataDic.batteryList.some(o=>{return !o.updateDate || o.updateDate === ''})){
						uni.showToast({
							title: '电池列表存在电池日期为空的项',
							icon: 'none'
						});
						return Promise.reject('fail');
					}
				}
				if (this.dataDic.partsCollarLists && this.dataDic.partsCollarLists.length > 0) {
					let list = this.dataDic.partsCollarLists.map(o=>{
						return {
							...o,
							salePrice : !o.salePrice || o.salePrice === '' ? "0.00" : o.salePrice
						}
					});
					this.dataDic = {
						...this.dataDic,
						partsCollarLists:[...list]
					}
				}
				return Promise.resolve('success');
			},
			//确定按钮
			clicksave(val) {
				// console.log(JSON.stringify(this.dataDic))
				// return
				uni.showLoading({
					mask: true
				});
				this.$network
					.getData(this.$url.MACHINE_REPAIR_CREATE + val, 'POST', this.dataDic)
					.then(result => {
						uni.$emit('refreshData-repair', {
							type: ''
						});
						uni.$emit('refreshData-overhaul', {
							type: ''
						});
						uni.$emit('refresh-polling', {
							type: ''
						});
						uni.$emit("refresh-notification-list", {
							type: 'apply'
						})
						uni.navigateBack({
							animationDuration: 200
						});
						uni.hideLoading();
					})
					.catch(err => {
						let message = err.message || ""
						let details = err.details ? err.details[0] : ""
						uni.showToast({
							title: message + "," + details,
							icon: 'none'
						});
					});
			},
			//------------------详情
			gotoDetail(){
				if(this.dataDic.reason == '1'){
					uni.navigateTo({
						url: '/devicePages/maintain/maintain-detail?businessNo=' + this.dataDic.associatedBusinessNo
					});
				}else if(this.dataDic.reason == '2'){
					let param = {
						businessNo:this.dataDic.associatedBusinessNo
					}
					uni.navigateTo({
						url: '/devicePages/hostling/stock-detail?item=' + encodeURIComponent(JSON.stringify(param))
					});
				}else if(this.dataDic.reason == '3'){
					uni.navigateTo({
						url: '/devicePages/polling/polling-detail?businessNo=' + this.dataDic.associatedBusinessNo
					});
				}
			}
		}
	};
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
	margin-bottom: 10px;
	background: #ffffff;
	border-radius: 10px;
	padding-bottom: 10px;
}
.cell-view{
	display: flex;
	flex-direction: column;
	border-width: 1px;
	border-color: #eeeeee;
	border-style: solid;
	border-radius: 5px;
	margin: 10px;
}
.cell-input-view-row{
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	font-size: $uni-font-size-base;
}
.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	margin: 10px;
	font-size: $uni-font-size-base;
}
.cell-input-view-cell {
	display: flex;
	flex-direction: column;
	flex: 1;
	margin: 10px;
	font-size: $uni-font-size-base;
	background: $uni-bg-color-grey;
}
.tilte-view-sub{
	border-bottom-width: 1px;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
}
.cell-input-view-left {
	display: flex;
	min-width: 50px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.cell-input-view-right {
	display: flex;
	flex: 1;
	margin-left: 10px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.input-style {
	flex: 1;
	flex-wrap:wrap;
	text-align: right;
	font-size: $uni-font-size-base;
}
.input-style-center {
	flex: 1;
	text-align: center;
	font-size: $uni-font-size-base;
}
.boldstyle{
	margin-top: 5px;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-bottom: 10px;
	color: $uni-text-color;
}
.gray-arrow {
	margin-left: 4px;
}
.addressstyle {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	width: 40px;
	margin-right: 0px;
}
.arrow {
	display: flex;
	font-size: 18px;
	justify-content: center;
	align-items: center;
	color: $uni-color-primary;
}
.pop-container {
	position: relative;
}
	/* 提示窗口 */
.uni-tip {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	padding: 15px;
	width: 300px;
	background-color: #fff;
	border-radius: 10px;
	justify-content: center;
	align-items: center;
}

.tip-title {
	display: flex;
	padding: 5px;
	width: 290px;
	border-width: 0px 0px 1px 0px;
	border-color: $uni-bg-color-grey;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	justify-content: center;
	align-items: center;
}

.row-item {
	display: flex;
	width: 270px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin: 10px;
	padding: 10px;
	background: $uni-color-primary;
	color: #FFFFFF;
	font-size: $uni-font-size-base;
	border-radius: 5px
}
.row-tag {
	width: 150px;
	text-align: center;
}
.cell-input-view-input{
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	font-size: $uni-font-size-base;
}
.cell-input-view-left-input {
	display: flex;
	min-width: 40px;
	padding: 10px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.cell-input-view-right-input {
	display: flex;
	flex: 1;
	padding: 10px 0px;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.input-style-input {
	flex: 1;
	flex-wrap:wrap;
	text-align: right;
	font-size: $uni-font-size-base;
}
</style>
