<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<create-step
			processKey="partsAllocation"
			@submitApply="clicksave"
			:orgId="dataDic.sourceRegionId"
			:itemData="backDic"
			@data-form="getBackData"
			:updateObj="dataDic"
			:isUpdate="isUpdate"
		>
			<view class="creat-bg">
				<view class="sum-view-bg">
					<view class="cell-input-view tilte-view-sub">
						<view class="cell-input-view-left boldstyle"><text>基本信息</text></view>
					</view>
					<selectorPick
					title="调拨单号"
					:isEdit="false"
					:content="dataDic.businessNo"
					:isRequire="true"
					/>
					<selectorPick
					title="调出区域"
					placeholder="请选择调出区域"
					:content="dataDic.sourceRegionName"
					:isRequire="true"
					@clickItem="showPick('areaout')"
					/>
					<selectorPick
					title="调入区域"
					placeholder="请选择调入区域"
					:content="dataDic.targetRegionName"
					:isRequire="true"
					@clickItem="showPick('areain')"
					/>
					<selectorPick
					title="调拨人"
					placeholder="请选择调拨人"
					:content="dataDic.transferName"
					:isRequire="true"
					@clickItem="showPick('assgin')"
					/>
					<selectorPick
					title="调拨时间"
					placeholder="请选择调拨时间"
					:content="changestr(dataDic.allocationTime)"
					:isRequire="true"
					@clickItem="showPick('time')"
					/>
					<!-- <selectorPick
					title="总价(元)"
					:isEdit="false"
					:content="dataDic.partsAmount"
					:isRequire="false"
					/> -->
					<selectorInput
					title="产生费用(元)"
					placeholder="0.00"
					:content="dataDic.cost"
					:isRequire="false"
					@textChage="textChage"
					/>
				</view>
				<view class="sum-view-bg">
					<view class="cell-input-view tilte-view-sub">
						<view class="cell-input-view-left boldstyle"><text>调拨配件列表</text></view>
						<view class="cell-input-view-right" @click="addacc"><text class="input-style" style="color: #E60000;">+ 新增配件</text></view>
					</view>
					<view v-for="(item, index) in dataDic.partsAllocationLists" :key="index" class="cell-view">
						<partComponentsAllot
						:dataDic="item" 
						@goTo = "goTo($event,item,index)"
						@deleteItem = "deletePart($event,index)"
						@numChange = "getNumValue($event,index,item)"
						@textChage="getItemRemark($event,index,item)"
						
						/>
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
					type="parts_allocation_type"
					uploadType="attachment"
					maximg="20"
					/>
					<selectorArea
					title="备注"
					placeholder="请输入备注"
					:content="dataDic.remark"
					:isRequire="false"
					@textChage="remarkmethod"
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
				mode="date" 
				startYear="2000" 
				endYear="3000" 
				:current="true" 
				@confirm="onConfirm" 
				:disabledAfter="true" 
				ref="date" 
				themeColor="#E60000" 
				/>
			</view>
		</create-step>
	</view>
</template>
<script>
import selectorPick from '@/components/common/selector-pick/selector-pick.vue';
import selectorInput from '@/components/common/selector-pick/selector-input.vue';
import selectorArea from '@/components/common/selector-pick/selector-textArea.vue';
import imgupload from '@/components/common/image-upload/image-upload.vue';
import wPicker from '@/components/common/w-picker/w-picker.vue';
import createStep from '@/components/workflow/create-step.vue';
import partComponentsAllot from '../part-components/part-components-allot.vue';
let timer;
export default {
	components: {
		selectorPick,
		selectorInput,
		selectorArea,
		imgupload,
		createStep,
		wPicker,
		partComponentsAllot
	},
	computed: {},
	data() {
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			dataDic: {
				cost: '',
				partsAmount:'0.00'
			},
			backDic: null,
			isUpdate: false,

			//数据
			selectList: [],
			areaArr: [],
			assignArr: [],
			sourceArr: [],
			methodsArr:[],
			selectType: '',
			chooseIndex:0
		};
	},
	onLoad(option) {
		this.loadAreaList();
		this.getUserLeaders();
		this.loadSourceList();
		this.loadMehtodsList();
		if (option.item) {
			//调拨编辑,撤回提交
			this.backDic = JSON.parse(decodeURIComponent(option.item));
			this.isUpdate = option.isUpdate ? (option.isUpdate === '1' ? true : false) : false;
			if (this.isUpdate) {
				this.loaddata(this.backDic.businessNo);
			}
		} else {
			uni.getStorage({
				key: this.$savekey.USER_INFO_MEG,
				success: res => {
					this.dataDic = {
						...this.dataDic,
						transferId: res.data.id,
						transferName: res.data.username
					};
					this.getBusinessNo();
				}
			});
			this.getBusinessNo();
		}
		if (option.inventory) {
			let inventoryDic = {
				...JSON.parse(decodeURIComponent(option.inventory)),
				partsBasics:{
					...JSON.parse(decodeURIComponent(option.inventory))
				}
			};
			//
			this.dataDic = {
				...this.dataDic,
				sourceRegionId: inventoryDic.orgId,
				sourceRegionName: inventoryDic.orgName
			};
			uni.showLoading()
			setTimeout(()=>{
				let list = [inventoryDic];
				let partsAllocationLists = [];
				this.getchecklist(list, partsAllocationLists);
				uni.hideLoading();
			}, 500);
		}
		uni.$on('choose-acc-emit', usnerinfo => {
			let list = usnerinfo.list || [];
			let partsAllocationLists = this.dataDic.partsAllocationLists || [];
			//处理数据
			this.getchecklist(list, partsAllocationLists);
		});
		uni.$on('edit-item-allot', obj => {
			console.log(JSON.stringify(this.dataDic))
			if(obj.type == 'delete'){
				this.dataDic.partsAllocationLists.splice(this.chooseIndex, 1);
				this.calcAllTotal();
			}else{
				this.dataDic.partsAllocationLists.splice(this.chooseIndex, 1,obj.data);
				this.calcAllTotal();
			}
		});
	},
	onUnload() {
		// 取消监听事件
		uni.$off('choose-acc-emit');
	},
	methods: {
		goTo(e, item, index) {
			this.chooseIndex = index;
			uni.navigateTo({
				url: '/subOtherPages/accessories/acc-allot/edit-allot-part?item=' + encodeURIComponent(JSON.stringify(item))
			});
		},
		textChage(val){
			this.dataDic = {
				...this.dataDic,
				cost: val
			};
			val = val.replace(/[^\d.]/g, ''); //清除"数字"和"."以外的字符
			val = val.replace(/^\./g, ''); //验证第一个字符是数字
			val = val.replace(/\.{2,}/g, '.'); //只保留第一个, 清除多余的
			val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
			val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				this.dataDic = {
					...this.dataDic,
					cost: val
				};
			}, 50);
		},
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		// 获取调拨后通过dataForm接口获取的数据详情
		getBackData(val) {
			this.dataDic = JSON.parse(val);
		},
		// 获取单号
		getBusinessNo() {
			let url = this.$url.CREATE_PART_NO.replace(/{type}/, 'PJDB');
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					this.dataDic = {
						...this.dataDic,
						businessNo: result,
						// partsAmount: '0.00'
					};
				})
				.catch(err => {});
		},
		//撤回时获取详情
		loaddata(key) {
			let url = this.$url.ACC_ALLOT_DETAIL + key;
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					this.dataDic = {
						...result
					};
				})
				.catch(err => {});
		},
		//获取区域
		loadAreaList() {
			uni.showLoading();
			let urlstr = this.$url.ORG_LIST;
			this.$network
				.getData(urlstr, 'GET', null)
				.then(result => {
					let list = result;
					this.areaArr = this.getChildren(list);
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
		//加载服务人员
		getUserLeaders() {
			let param = {
				showAdmin: false
				// orgId : "",
				// roleType : this.$savekey.USER_ROLE_SEVICER
			};
			this.$network
				.getData(this.$url.USER_LEADERS, 'GET', param)
				.then(result => {
					this.assignArr = result.map(o => {
						return {
							label: o.username,
							value: o.id
						};
					});
				})
				.catch(err => {});
		},
		//选择器
		showPick(type) {
			this.selectType = type;
			if (type === 'areaout') {
				if (this.dataDic.partsAllocationLists && this.dataDic.partsAllocationLists.length > 0) {
					return;
				}
				this.selectList = this.areaArr;
				this.$refs.selector.show();
			} else if (type === 'areain') {
				this.selectList = this.areaArr;
				this.$refs.selector.show();
			} else if (type === 'assgin') {
				this.selectList = this.assignArr;
				this.$refs.selector.show();
			} else {
				this.$refs.date.show();
			}
		},
		onConfirm(val) {
			if (this.selectType === 'areaout') {
				let areaCode = val.checkArr;
				this.dataDic = {
					...this.dataDic,
					sourceRegionId: areaCode.value,
					sourceRegionName: areaCode.label
				};
			} else if (this.selectType === 'areain') {
				let areaCode = val.checkArr;
				this.dataDic = {
					...this.dataDic,
					targetRegionId: areaCode.value,
					targetRegionName: areaCode.label
				};
			} else if (this.selectType === 'assgin') {
				let assginCode = val.checkArr;
				this.dataDic = {
					...this.dataDic,
					transferId: assginCode.value,
					transferName: assginCode.label
				};
			} else {
				this.dataDic = {
					...this.dataDic,
					allocationTime: val.result + ' 00:00:00'
				};
			}
		},
		getItemRemark(val, index, item){
			let newitem = {
				...item,
				remark:val
			};
			this.dataDic.partsAllocationLists.splice(index, 1, newitem);
		},
		//数量监听
		getNumValue(val, index, item) {
			let newitem = {
				...item,
				partsNumber: val.toString(),
				partsAmount: this.calcTotal(item.salePrice, val)
			};
			this.dataDic.partsAllocationLists.splice(index, 1, newitem);
			this.calcAllTotal();
		},
		calcTotal(price, num) {
			let total = price * num;
			return this.$datestr.doubleFloat(total);
		},
		calcAllTotal() {
			let total = 0;
			let allnum = 0;
			this.dataDic.partsAllocationLists.forEach(o => {
				total = total + parseFloat(o.partsAmount);
				allnum = allnum + Number(o.partsNumber);
			});
			this.dataDic = {
				...this.dataDic,
				partsAmount: this.$datestr.doubleFloat(total).toString(),
				partsNumber: allnum.toString()
			};
		},
		//添加配件
		addacc() {
			if (!this.dataDic.sourceRegionId) {
				uni.showToast({
					title: '请选择调出区域',
					icon: 'none'
				});
				return;
			}
			let partsAllocationLists = this.dataDic.partsAllocationLists || [];
			uni.navigateTo({
				url: './acc-alloct-stock?list=' + encodeURIComponent(JSON.stringify(partsAllocationLists)) + '&orgId=' + this.dataDic.sourceRegionId
			});
		},
		getchecklist(newlist, oldList) {
			console.log(JSON.stringify(newlist))
			if (newlist) {
				let list = newlist.map(item => {
					let filterlist = oldList.filter(o => {
						return o.itemNumber == item.itemNumber;
					});
					if (filterlist.length == 1) {
						return filterlist[0];
					} else {
						return {
							...item,
							sourceItemNumber:item.itemNumber,
							partsNumber: '0',
							purchasingMethod:this.methodsArr[0].value,
							purchasingMethodName:this.methodsArr[0].label,
							partsSourceName:this.sourceArr[0].label,
							partsSource:this.sourceArr[0].value,
							brandName:'',
							salePrice:'',
						};
					}
				});
				console.log(JSON.stringify(list))
				this.dataDic = {
					...this.dataDic,
					partsAllocationLists: list,
					partsType: list.length.toString()
				};
			}
		},
		//删除配件
		deletePart(e,index) {
			uni.showModal({
				title:'提示',
				content:'确定要删除该配件么?',
				success: (res) => {
					if (res.cancel) {} else {
						this.dataDic.partsAllocationLists.splice(index, 1);
						this.calcAllTotal();
					}
				}
			})
		},
		
		//备注
		remarkmethod(val) {
			this.dataDic = {
				...this.dataDic,
				remark: val
			};
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
		checkData() {
			if (!this.dataDic.sourceRegionId) {
				uni.showToast({
					title: '请选择调出区域',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.dataDic.targetRegionId) {
				uni.showToast({
					title: '请选择调入区域',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (this.dataDic.targetRegionId === this.dataDic.sourceRegionId) {
				uni.showToast({
					title: '调入区域与调出区域不能相同',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.dataDic.transferId) {
				uni.showToast({
					title: '请选择调拨人',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.dataDic.allocationTime) {
				uni.showToast({
					title: '请选择调拨时间',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.dataDic.partsAllocationLists || this.dataDic.partsAllocationLists.length == 0) {
				uni.showToast({
					title: '请新增调拨配件',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (this.dataDic.partsAllocationLists) {
				let partsAllocationLists = this.dataDic.partsAllocationLists;
				if (
					partsAllocationLists.some(o => {
						return o.partsNumber == 0;
					})
				) {
					uni.showToast({
						title: '存在数量为零的配件',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (partsAllocationLists.some(o => {
						return o.partsNumber.indexOf(".") !=-1;
					})
				) {
					uni.showToast({
						title: '配件数量请输入正整数',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
			}
			if (!this.dataDic.cost || this.dataDic.cost == "") {
				this.dataDic = {
					...this.dataDic,
					cost:'0.00'
				}
			}
			this.dataDic = {
				...this.dataDic
			}
			return Promise.resolve('success');
		},
		//确定按钮
		clicksave(val) {
			uni.showLoading({
				mask: true
			});
			this.$network
				.getData(this.$url.ACC_ALLOT_CREATE + val, 'POST', this.dataDic)
				.then(result => {
					uni.$emit('refresh-acc-list', {
						type: ''
					});
					uni.$emit('refresh-notification-list', {
						type: 'apply'
					});
					uni.navigateBack({
						animationDuration: 200
					});
					uni.hideLoading();
				})
				.catch(err => {
					uni.showToast({
						title: err.message + ',' + err.details[0],
						icon: 'none'
					});
					uni.hideLoading();
				});
		},
		//加载来源
		loadSourceList() {
			this.$network
				.loadUserType('parts_source')
				.then(result => {
					this.sourceArr = result.map(o => {
						return {
							label: o.label,
							value: o.value
						};
					});
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		//加载方式
		loadMehtodsList() {
			this.$network.loadUserType('purchasing_method').then(result => {
				this.methodsArr = result.map(o => {
					return {
						label: o.label,
						value: o.value
					};
				});
				uni.hideLoading();
			}).catch(err => {
					uni.hideLoading();
			});
		},
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
.cell-view {
	border-width: 1px;
	border-color: #eeeeee;
	border-style: solid;
	border-radius: 5px;
	margin: 10px;
}
.cell-input-view-row {
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
.tilte-view-sub {
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
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
}
.input-style {
	flex: 1;
	text-align: right;
}
.input-style-center {
	flex: 1;
	text-align: center;
}
.boldstyle {
	margin-top: 5px;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	margin-bottom: 10px;
	color: $uni-text-color;
}
.gray-arrow {
	margin-left: 4px;
}
</style>
