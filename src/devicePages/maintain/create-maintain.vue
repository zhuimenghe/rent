<template>
	<view class="creat-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<create-step 
		processKey="maintenance"
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
							<text class="input-style" style="color: #E60000;">保养记录</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>保养单号</text><text style="color: #FF0000;">*</text></view>
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
					<view class="cell-input-view" v-if="dataDic.nature === '2'">
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
						<view class="cell-input-view-left"><text>保修状态</text></view>
						<view class="cell-input-view-right">
							<text class="input-style">{{dataDic.purchaseStateName || "--"}}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left">
							<text>小时表计数</text><text style="color: #FF0000;">*</text>
						</view>
						<view class="cell-input-view-right">
							<input 
							class="input-style" 
							type="number" 
							v-model="dataDic.maintainHourmeter"
							placeholder="抄表填写工作小时数(小时)...." 
							/>
						</view>
					</view>
				</view>
				<view class="sum-view-bg">
					<view class="cell-input-view tilte-view-sub">
						<view class="cell-input-view-left boldstyle"><text>保养信息</text></view>
					</view>
					<select-label-item
					tagName="开始时间" 
					:isRequired="true" 
					hint="请选择开始时间" 
					:value="getYMDHMTime(dataDic.operateStartDate)" 
					:icon="dateIcon" 
					@clickItemLabel="showPick('start')" 
					/>
					<select-label-item 
					tagName="结束时间" 
					:isRequired="true" 
					hint="请选择结束时间" 
					:value="getYMDHMTime(dataDic.operateEndDate)" 
					:icon="dateIcon" 
					@clickItemLabel="showPick('end')" 
					/>
					<view class="cell-input-view">
						<view class="cell-input-view-left">
							<text>保养工时</text><text style="color: #FF0000;">*</text>
						</view>
						<view class="cell-input-view-right">
							<input 
							class="input-style" 
							type="number"  
							v-model="dataDic.maintenanceDuration"
							placeholder="请填写保养工时(小时)...." 
							/>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left">
							<text>所在合同</text>
						</view>
						<view class="cell-input-view-right">
							<input 
							class="input-style" 
							type="text" 
							:value="dataDic.contractName"
							placeholder="请输入合同名称" 
							@input="textChange($event,'contractName')"
							/>
						</view>
						<view class="contract-item" @click="chooseContract">
							<i class="iconfont arrow-c iconarrow-right"></i>
						</view>
					</view>
					<select-label-item
					:isRequired = "true"
					tagName="保养人" 
					hint="请选择保养人" 
					:value="dataDic.maintenancePersonName" 
					:icon="righticon" 
					@clickItemLabel="choosePerson('maintain')"
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
							placeholder="请输入保养同行人...." 
							/>
						</view>
						<view class="addressstyle" @click="choosePerson('together')">
							<i class="iconfont arrow iconzl--kehuguanli--"></i>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left">
							<text>保养地址</text>
						</view>
						<view class="cell-input-view-right">
							<input 
							class="input-style" 
							type="text" 
							v-model="dataDic.address" 
							placeholder="请输入保养地址...." 
							:disabled="isChooseAddress"
							/>
						</view>
						<view class="addressstyle" @click="chooseAddress">
							<i class="iconfont arrow iconzl--zuobiao"></i>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left">
							<text>往返公里数</text>
						</view>
						<view class="cell-input-view-right">
							<input 
							class="input-style" 
							type="number" 
							placeholder="0"
							 v-model="dataDic.mileage"
							/>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left">
							<text>保养金额</text>
						</view>
						<view class="cell-input-view-right">
							<input 
							class="input-style" 
							type="digit" 
							v-model="dataDic.amount" 
							placeholder="0.00" 
							/>
						</view>
					</view>
					<select-label-item
					:isRequired = "true"
					tagName="保养规则" 
					hint="请选择保养规则" 
					:value="dataDic.rulesName" 
					:icon="righticon" 
					@clickItemLabel="showPick('rules')"
					/>
					<select-label-item
					:isRequired = "true"
					tagName="保养级别" 
					hint="请选择保养级别" 
					:value="getLevelString(dataDic.level)" 
					:icon="righticon" 
					@clickItemLabel="showPick('level')"
					/>
					<view style="height: 5px;flex: 1;background: #F5F4F9;"/>
					<scroll-view class="scroll-container" scroll-x="true" show-scrollbar="false">
						<view class="tabs-container">
							<view class="tab-item" :class="{ selected: index === selectProIndex }" v-for="(t, index) in dataDic.rulesProjects ?  dataDic.rulesProjects : []" :key="index"
							 @click="changeTab(index)">
								<text>{{ t.programName }}</text>
							</view>
						</view>
					</scroll-view>
					<view scroll-y="true" show-scrollbar="false" class="pro-item-container">
						<view v-for="(o,i) in dataDic.rulesProjects&&dataDic.rulesProjects[selectProIndex] ? dataDic.rulesProjects[selectProIndex].rulesProjectContents : []" :key="i">
							<view class="option-view" @click="changeChecked(i)">
								<view class="o-left">
									<mycheckbox 
									class="checkbox" 
									:checked="o.checked" 
									color="#E60000" 
									/>
									<view class="option-name">{{o.operationContent}}</view>
								</view>
								<input 
								placeholder="请输入备注" 
								class="input-style-borad" 
								v-model="o.remark" 
								v-if="!o.checked" 
								/>
							</view>
						</view>
					</view>
				</view>
				<view class="sum-view-bg">
					<partComponent :dataDic="dataDic"/>
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
						<view class="cell-input-view-left boldstyle"><text>其他信息</text></view>
					</view>
					<imgupload 
					@uploadfinish="uploadfinish" 
					@deleteUrl="deleteUrl" 
					:imgFinishlist="dataDic.fileList" 
					type="maintance"
					uploadType="attachment" 
					maximg="20" 
					 />
					<text-label-item 
					tagName="备注" 
					placeholder="请输入备注..." 
					@ipnuttext="repairChange($event,'comment')" 
					:inputValue="dataDic.comment"
					/>
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
	// import numToChinese from '@/common/util/num-to-chinese.js';
	import partComponent from '@/devicePages/components/parts-device-record.vue';
	export default {
		components: {
			selectLabelItem,
			textLabelItem,
			labelArrow,
			imgupload,
			createStep,
			wPicker,
			partComponent
		},
		computed: {},
		data() {
			return {
				dateTime:'dateTime',
				dateIcon: 'iconzl--rili',
				companyicon: 'iconiconzhengli_zuzhijiagou',
				righticon: 'iconarrow-right',
				dataDic: {
					mileage:'0',
					partsCollarLists:[]
				},
				backDic: null,
				isUpdate:false,
				SourceIndex:0,
				//数据
				selectProIndex: 0,
				maintainList:[],//维修人
				chooseToggerList:[],//选中的同行人
				addrObj:{},//选中地址
				selectList:[],
				assignArr:[],
				rulesArr:[],//规则
				levelArr:[],//等级
				orgArr:[],
				stateArr:[],
				selectType:'',
				isChooseAddress:false,
				isNeedNo:false,
				isEditProjectName:true,
				focusState:false
			};
		},
		watch:{
			'dataDic.amount'(val) {
				this.dataDic = {
					...this.dataDic,
					amount: val
				};
				setTimeout(()=>{
					this.dataDic = {
						...this.dataDic,
						amount: this.$gxfmethod.getMoneyPart(val)
					};
				}, 50);
			},
			'dataDic.maintenanceDuration'(val) {
				this.dataDic = {
					...this.dataDic,
					maintenanceDuration: val
				};
				setTimeout(()=>{
					this.dataDic = {
						...this.dataDic,
						maintenanceDuration: this.$gxfmethod.getMoneyPart(val)
					};
				}, 50);
			},
			'dataDic.maintainHourmeter'(val) {
				this.dataDic = {
					...this.dataDic,
					maintainHourmeter: val
				};
				setTimeout(()=>{
					this.dataDic = {
						...this.dataDic,
						maintainHourmeter: this.$gxfmethod.getMoneyPart(val)
					};
				}, 50);
			},
			'dataDic.mileage'(val) {
				this.dataDic = {
					...this.dataDic,
					mileage: val
				};
				setTimeout(()=>{
					this.dataDic = {
						...this.dataDic,
						mileage: this.$gxfmethod.getMoneyPart(val)
					};
				}, 50);
			},
		},
		onLoad(option) {
			if (option.item) { 
				uni.setNavigationBarTitle({
					title:'修改保养单'
				})
				//退回编辑,撤回提交
				this.backDic = JSON.parse(decodeURIComponent(option.item))
				this.isUpdate = option.isUpdate ? (option.isUpdate === "1" ? true : false):false
				if(this.isUpdate){
					this.loaddata(this.backDic.businessNo)
				}
			}else{
				this.isNeedNo = true;
				let resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG);
				let isService = this.$gxfmethod.issameRoleType(resData, this.$savekey.USER_ROLE_SEVICER);
				this.dataDic = {
					...this.dataDic,
					orgName:this.$gxfmethod.getorgName(resData),
					orgId:resData.orgId,
					maintenancePerson:isService ? resData.id :undefined,
					maintenancePersonName:isService ? resData.username :undefined,
					// leaderId:res.data.roleType === this.$savekey.USER_ROLE_SEVICER ? res.data.id :undefined,
					// leaderName:res.data.roleType === this.$savekey.USER_ROLE_SEVICER ? res.data.username :undefined,
				};
				if(this.dataDic.maintenancePerson){
					let newlist = this.dataDic.maintenancePerson.split(',');
					this.maintainList = newlist.map((o)=>{
						return {
							id:o
						}
					})
				}
				this.setHoursWithNow();
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
				if(option.rwitem){
					let item = JSON.parse(decodeURIComponent(option.rwitem));
					this.dataDic = {
						...this.dataDic,
						rulesId:item.task.ruleId,
						rulesName:item.task.ruleName,
						level:item.task.level,
						levelId:item.task.levelId,
						todoId:item.id,
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
			this.loadAreaList();
			//同行人
			uni.$on('choosedAssignTogger', obj => {
				let  chooseArr = obj.data || [];
				if(this.selectType == "maintain"){
					this.maintainList = obj.data;
					let choosedRList = [];
					let choosedRIDList = [];
					this.maintainList.forEach(o => {
						choosedRList.push(o.username);
						choosedRIDList.push(o.id);
					});
					this.dataDic = {
						...this.dataDic,
						"maintenancePerson":choosedRIDList.join(','),
						"maintenancePersonName":choosedRList.join(',')
					};
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
				let partsCollarLists = this.dataDic.partsCollarLists || []
				this.getchecklist(list,partsCollarLists)
			});
			uni.$on('parts-edit',partlist=>{
				this.dataDic = {
					...this.dataDic,
					partsCollarLists:[...partlist]
				}
			})
			uni.$on('choose-contract-device',data=>{
				let dict = data.data;
				let customerName = dict.customerName ? dict.customerName : "";
				let projectName = dict.projectName ? dict.projectName : "";
				let name = customerName + "-" +	projectName			
				this.dataDic = {
					...this.dataDic,
					contractName:name
				}
			})
			/*统计*/
			this.$gxfmethod.statisticData(this.$eventId.Device_Administrative,"设备维护","保养保养新增");
		},
		onUnload() {
			// 取消监听事件
			uni.$off('choosedAssignTogger');
			uni.$off('choose-address');
			uni.$off('choose-repair-emit');
			uni.$off('parts-edit');
			uni.$off('choose-contract-device');
		},
		methods: {
			textChange(val,type){
				let dict = {
					...this.dataDic
				}
				dict[type] = val.detail.value
				setTimeout(()=>{
					this.dataDic = {
						...dict
					}
				}, 10);
			},
			focusStateChange(){
				this.focusState = false;
			},
			setHoursWithNow(){
				this.dataDic = {
					...this.dataDic,
					operateStartDate:this.$gxfmethod.getTimeWithTime(this.$gxfmethod.getnowdateSS(),'-2'),
					maintenanceDuration:'2',
					operateEndDate:this.$gxfmethod.getnowdateSS()
				}
			},
			goToRecord(){
				uni.navigateTo({
					url:'/devicePages/device-maintain-record?title=保养记录&type=maintain&licenseId='+this.dataDic.licenseId
				})
			},
			isshowPart(){
				// if(this.dataDic.partsCollarLists){
				// 	return this.dataDic.partsCollarLists.some(o=>{return o.id})
				// }
				// return true
				if(this.dataDic.partsCollarLists && this.dataDic.partsCollarLists.length > 0){
					return true
				}
				return false
			},
			getYMDHMTime(date) {
				let d = ''
				if (date) {
					d = this.$dateUtil.timeFormatYMDHM(date);
				}
				return d;
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
						partsCollarLists:result.partsCollarLists && result.partsCollarLists.length > 0 ? result.partsCollarLists : []
					}
					if(this.dataDic.isLocal && this.dataDic.isLocal=='1'){
						this.isChooseAddress = true;
					}
					this.loadMachineBaseData(result.licenseId);
				}
			},
			// 获取单号
			getBusinessNo() {
				let url = this.$url.CREATE_MACHINE_NO.replace(/{type}/, 'BY')
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
				let urlstr = this.$url.INIT_MAINTAIN.replace(/{licenseId}/, licenseId)
				this.$network.getData(urlstr, 'GET', null).then(result => {
					if(this.isNeedNo){
						this.dataDic = {
							...this.dataDic,
							"businessNo": result.serialNumber,
						}
					}
					this.rulesArr = result.rules ? result.rules.map(o => {
						return {
							label: o.name,
							value: o.id,
						};
					}) : [];
					if (!this.backDic || this.backDic === null) {
						this.dataDic = {
							...this.dataDic,
							licenseId:result.licenseId,
							printCode:result.printCode,
							purchaseState:result.purchaseState,
							purchaseStateName:result.purchaseStateName,
							nature:result.state,
							natureName:result.stateName,
							rulesId:!this.dataDic.rulesId ? (this.rulesArr.length > 0 ? this.rulesArr[0].value : undefined) : this.dataDic.rulesId,
							rulesName:!this.dataDic.rulesName ? (this.rulesArr.length > 0 ? this.rulesArr[0].label : undefined) : this.dataDic.rulesName
						};
					}else{
						this.dataDic = {
							...this.dataDic,
							licenseId:result.licenseId,
							printCode:result.printCode,
						};
					}
					this.getProByruleId()
					uni.hideLoading();
				}).catch(err => {
					uni.hideLoading();
				});
			},
			getProByruleId() {
				uni.showLoading();
				let urlStr = this.$url.MAINTAIN_PROS_BY_RULE.replace(/{leverId}/, this.dataDic.rulesId)
				this.$network.getData(urlStr, "GET", null).then((result) => {
					this.levelArr = result ? result.map(o => {
						return {
							label: this.getLevelString(o.level),
							value: o.id,
							num: o.level
						};
					}) : [];
					if (!this.dataDic.levelId || this.dataDic.levelId == '') {
						this.dataDic = {
							...this.dataDic,
							level: this.levelArr.length > 0 ? this.levelArr[0].num : undefined,
							levelId: this.levelArr.length > 0 ? this.levelArr[0].value : undefined,
						};	
					}
					if(!this.dataDic.rulesProjects || this.dataDic.rulesProjects == ''){
						this.getProByLevel();
					}
					uni.hideLoading();
				}).catch((err) => {
					uni.hideLoading();
				})
			},
			getProByLevel() {
				uni.showLoading();
				let urlStr = this.$url.MAINTAIN_PROS_BY_LEVEL.replace(/{leverId}/, this.dataDic.levelId) + "?state=1"
				this.$network.getData(urlStr, "GET", null).then((result) => {
					this.dataDic = { 
						...this.dataDic,
						rulesProjects: [...this.getContents(result)]
					}
					uni.hideLoading();
				}).catch((err) => {
					uni.hideLoading();
				})
			},
			getContents(rawData) {
				console.log(JSON.stringify(rawData))
				if (!rawData) {
					return [];
				}
				return rawData.map((o, index) => {
					let co = o.rulesProjectContents.map(y => {
						return {
							...y,
							remark: '',
							checked: true
						}
					})
					return {
						...o,
						rulesProjectContents: [...co]
					}
				})
			},
			changeTab(index) {
				this.selectProIndex = index;
			},
			changeChecked(i) {
				this.dataDic.rulesProjects[this.selectProIndex].rulesProjectContents[i].checked = !this.dataDic.rulesProjects[this.selectProIndex]
					.rulesProjectContents[i].checked
				if (this.dataDic.rulesProjects[this.selectProIndex].rulesProjectContents[i].checked) {
					this.dataDic.rulesProjects[this.selectProIndex].rulesProjectContents[i].remark = ""
				}
			},
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
				let param = {
					businessNo: key
				};
				let url = this.$url.MAINTAIN_DETAIL;
				this.$network.getData(url, 'GET', param).then(result => {
					this.dataDic = {
						...result,
						partsCollarLists:result.partsCollarLists && result.partsCollarLists.length > 0 ? result.partsCollarLists : []
					};
					if(this.dataDic.isLocal && this.dataDic.isLocal=='1'){
						this.isChooseAddress = true;
					}
					this.loadMachineBaseData(result.licenseId);
				}).catch(err => {});
			},
			//加载车辆性质
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
						if(this.assignArr.length>0 && (!this.dataDic.maintenancePerson || this.dataDic.maintenancePerson=='')){
							let dict = this.assignArr[0];
							this.dataDic = {
								...this.dataDic,
								"maintenancePerson":dict.value,
								"maintenancePersonName":dict.label
							}
							if(this.dataDic.maintenancePerson){
								let newlist = this.dataDic.maintenancePerson.split(',');
								this.maintainList = newlist.map((o)=>{
									return {
										id:o
									}
								})
							}
						}
					}).catch(err => {});
			},
			//获取保养级别描述
			getLevelString(level) {
				if (level != undefined && level != null) {
					if (level === 0) {
						return '首保';
					}
					return level + '级保养'
				}
				return ""
			},
	        //选择器
			showPick(type) {
				this.selectType = type;
				// 
				if(type === 'assgin'){
					this.selectList = this.assignArr;
					this.$refs.selector.show();
				}else if(type === 'level'){
					this.selectList = this.levelArr;
					this.$refs.selector.show();
				}else if(type === 'nature'){
					this.selectList = this.stateArr;
					this.$refs.selector.show();
				}else if(type === 'org'){
					this.selectList = this.orgArr;
					this.$refs.selector.show();
				}else if(type === 'rules'){
					this.selectList = this.rulesArr;
					this.$refs.selector.show();
				} else{
					if(type === 'collar'){
						this.dateTime = "date"
					}else{
						this.dateTime = "halfDate"
					}
					this.$refs.date.show();
				}
			},
			//选择同行人
			choosePerson(type) {
				this.selectType = type;
				let list = [];
				if(type === 'maintain'){
					list =  [...this.maintainList]
				}else{
					list =  [...this.chooseToggerList]
				}
				uni.navigateTo({
					url: "/devicePages/repair/togger_peson?type=" + this.selectType + "&choosedList=" + JSON.stringify(list)
				});
			},
			//选择维修地址
			chooseAddress(type) {
				if(this.isChooseAddress){
					return;
				}
				uni.navigateTo({
					url: '/otherPages/map/nvr-map?deliveryAddress=' + JSON.stringify(this.addrObj) + '&type=' + type + "&orgId=" + this.dataDic.orgId
				});
			},
			chooseContract(){
				// uni.showActionSheet({
				// 	itemList:["选择合同","手动录入"],
				// 	success: (res)=>{
				// 	    if(res.tapIndex == 0){
				// 			this.isEditProjectName = true;
				// 			let str = "?beginDate=" + this.dataDic.startDate + "&endDate=" + this.dataDic.endDate + "&licenseId" + this.dataDic.licenseId
				// 			uni.navigateTo({
				// 				url:"/devicePages/device-contract" + str
				// 			})
				// 		}else{
				// 			this.isEditProjectName = false;
				// 			setTimeout(()=>{
				// 				this.focusState = true;
				// 			}, 50);
				// 		}
				// 	},
				// 	fail: (res)=>{
				// 	    console.log(res.errMsg);
				// 	}
				// })
				let str = "?beginDate=" + this.dataDic.operateStartDate + "&endDate=" + this.dataDic.operateEndDate + "&licenseId=" + this.dataDic.licenseId
				uni.navigateTo({
					url:"/devicePages/device-contract" + str
				})
			},
			//选择单号
			chooseOrder() {
				if(this.dataDic.reason === '1'){
					uni.navigateTo({
						url:'./choose-maintain-list?item=' + encodeURIComponent(JSON.stringify(this.dataDic))
					})
				}else if(this.dataDic.reason === '2'){
					uni.navigateTo({
						url:'./choose-check-list?item=' + encodeURIComponent(JSON.stringify(this.dataDic))
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
				}else if(this.selectType === 'level'){
					if(val.checkArr.value != this.dataDic.levelId){
						this.dataDic = {
							...this.dataDic,
							level: val.checkArr.num,
							levelId: val.checkArr.value,
							rulesProjects:[]
						}
						this.getProByLevel();
					}
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
				}else if(this.selectType === 'rules'){
					if(val.checkArr.value != this.dataDic.rulesId){
						this.dataDic = {
							...this.dataDic,
							rulesId: val.checkArr.value,
							rulesName:val.checkArr.label,
							level: undefined,
							levelId: undefined,
							rulesProjects:[]
						};
						this.getProByruleId();
					}
				}else if(this.selectType === 'start'){
					this.dataDic = {
						...this.dataDic,
						operateStartDate: val.result + ":00",
						contractName:''
					};
				}else if(this.selectType === 'end'){
					this.dataDic = {
						...this.dataDic,
						operateEndDate: val.result + ":00",
						contractName:''
					};
				}else if(this.selectType === 'collar'){
					this.dataDic = {
						...this.dataDic,
						collarTime: val.result + " 06:00:00"
					};
				}
			},
			//原因分析描述措施
			repairChange(val,type){
				this.dataDic = {
					...this.dataDic,
					comment:val
				}
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
			repairPart(e, index){
				let newlist = [...this.dataDic.partsCollarLists];
				let item = newlist[index];
				let newitem = {
					...item,
					remark : e,
				}
				this.dataDic.partsCollarLists.splice(index,1,newitem)
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
				if (!this.dataDic.operateStartDate) {
					uni.showToast({
						title: '请选择开始时间',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.dataDic.operateEndDate) {
					uni.showToast({
						title: '请选择结束时间',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if(this.$datestr.timedifferent(this.dataDic.operateStartDate,this.dataDic.operateEndDate) != -1){
					uni.showToast({
						title: '开始时间不得晚于结束时间',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.dataDic.maintenanceDuration) {
					uni.showToast({
						title: '请输入保养时长',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.dataDic.maintainHourmeter) {
					uni.showToast({
						title: '请输入小时表计数',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (!this.dataDic.maintenancePerson) {
					uni.showToast({
						title: '请选择保养人',
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
				//保养项
				if(!this.dataDic.rulesProjects || this.dataDic.rulesProjects.length <= 0){
					uni.showToast({
						icon:"none",
						title:'请选择保养项'
					})
					return Promise.reject('success')
				}
				//配件项目
				let list = this.dataDic.partsCollarLists.map(o=>{
					return {
						...o,
						salePrice : !o.salePrice || o.salePrice === '' ? "0.00" : o.salePrice
					}
				});
				if (!this.dataDic.amount) {
					this.dataDic = {
						...this.dataDic,
						amount:'0.00',
						partsCollarLists:[...list]
					}
				}else{
					this.dataDic = {
						...this.dataDic,
						partsCollarLists:[...list]
					}
				}
				return Promise.resolve('success');
			},
			//确定按钮
			clicksave(val) {
				console.log(JSON.stringify(this.dataDic))
				// return
				uni.showLoading({
					mask: true
				});
				this.$network
					.getData(this.$url.CREATE_MAINTAIN + val, 'POST', this.dataDic)
					.then(result => {
						uni.$emit('refresh-maintain', {
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
				if(this.dataDic.reason === '1'){
					uni.navigateTo({
						url: '/devicePages/maintain/maintain-detail?businessNo=' + this.dataDic.relatNo
					});
				}else if(this.dataDic.reason === '2'){
					let param = {
						businessNo:this.dataDic.relatNo
					}
					uni.navigateTo({
						url: '/devicePages/hostling/stock-detail?item=' + encodeURIComponent(JSON.stringify(param))
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
	padding: 10px;
	border-bottom:$uni-line-color 1px dotted;
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
	margin-right: 10px;
}
.input-style-borad {
	flex: 1;
	flex-wrap:wrap;
	text-align: right;
	font-size: $uni-font-size-base;
	margin-right: 10px;
	padding: 5px;
	border: 1px;
	border-radius: 3px;
	border-style: solid;
	border-color: $uni-bg-color-grey;
}
.input-style-center {
	flex: 1;
	text-align: center;
	font-size: $uni-font-size-base;
}
.boldstyle{
	margin-top: 5px;
	font-size: $uni-font-size-lg;
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
.scroll-container {
	display: flex;
	flex-direction: column;
	width: calc(100% - 20px);
	margin: 0px 10px;
	background: #ffffff;
	border-width: 1px 0px 1px 0px;
	border-color: $uni-bg-color-grey;
	border-style: solid;
}

.tabs-container {
	display: flex;
	flex-direction: row;
}

.tab-item {
	padding: 4px 8px;
	white-space: nowrap;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.selected {
	background: #FFFFFF;
	color: $uni-color-primary;
	border-width: 0px 0px 2px 0px;
	border-color: $uni-color-primary;
	border-style: solid;
}
.pro-item-container {
	height: auto;
	margin: 5px 5px 20px 5px;
}
.option-view {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	font-size: $uni-font-size-base;
}

.o-left {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	font-size: $uni-font-size-base;
	margin: 3px 0px;
}

.option-name {
	color: $uni-text-color;
	font-weight: bold;
	margin-right: 8px;
	font-size: $uni-font-size-base;
}
.checkbox {
	transform: scale(0.8);
}

.input-style-list {
	border: 1px solid $uni-bg-color-grey;
	font-size: $uni-font-size-sm;
	width: 100px;
	min-width: 100px;
	padding: 2px;
	margin-right: 10px;
	border-radius: 4px;
}
</style>
