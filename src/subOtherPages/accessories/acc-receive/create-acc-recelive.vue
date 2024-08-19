<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<create-step
			processKey="partsCollar"
			@submitApply="clicksave"
			:orgId="dataDic.orgId"
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
					title="出库单号"
					:isEdit="false"
					:content="dataDic.businessNo"
					:isRequire="true"
					/>
					<selectorPick
					title="区域"
					placeholder="请选择区域"
					:content="dataDic.orgName"
					:isRequire="true"
					@clickItem="showPick('area')"
					/>
					<selectorPick
					title="领用人"
					placeholder="请选择领用人"
					:content="dataDic.leaderName"
					:isRequire="true"
					@clickItem="showPick('assgin')"
					/>
					<selectorPick
					title="出库时间"
					placeholder="请选择出库时间"
					:content="changestr(dataDic.collarTime)"
					:isRequire="true"
					@clickItem="showPick('time')"
					/>
					<!-- <selectorPick
					title="总价(元)"
					:isEdit="false"
					:content="dataDic.partsAmount"
					:isRequire="false"
					/> -->
				</view>
				<view class="sum-view-bg">
					<view class="cell-input-view tilte-view-sub">
						<view class="cell-input-view-left boldstyle"><text>出库配件列表</text></view>
						<view class="cell-input-view-right" @click="addacc">
							<text class="input-style" style="color: #E60000;">+ 新增配件</text>
						</view>
					</view>
					<view v-for="(item, index) in dataDic.partsCollarLists" :key="index" class="cell-view">
						<partComponents 
						itemType="recelive"
						@numChange = "getNumValue($event,index,item)"
						@deleteItem = "deletePart($event,index)"
						:dataDic="item" 
						:isEdit='false'
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
					type="parts_collar_type" 
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
import partComponents from '../part-components/part-components.vue';
export default {
	components: {
		selectorPick,
		selectorInput,
		selectorArea,
		imgupload,
		createStep,
		wPicker,
		partComponents
	},
	computed: {},
	data() {
		return {
			dateIcon: 'iconzl--rili',
			companyicon: 'iconiconzhengli_zuzhijiagou',
			righticon: 'iconarrow-right',
			dataDic: {},
			backDic: null,
			isUpdate: false,

			//数据
			selectList: [],
			areaArr: [],
			assignArr: [],
			sourceArr: [],
			selectType: ''
		};
	},
	onLoad(option) {
		if (option.item) {
			//退回编辑,撤回提交
			uni.setNavigationBarTitle({
				title:"修改配件出库单"
			})
			this.backDic = JSON.parse(decodeURIComponent(option.item));
			this.isUpdate = option.isUpdate ? (option.isUpdate === '1' ? true : false) : false;
			if (this.isUpdate) {
				console.log(JSON.stringify(this.backDic));
				this.loaddata(this.backDic.businessNo);
			}
		} else {
			let resData = uni.getStorageSync(this.$savekey.USER_INFO_MEG)
			if(resData){
				let resOrgName = resData.orgName;
				let arr = resOrgName.split('|');
				this.dataDic = {
					...this.dataDic,
					orgName: arr[0],
					orgId: resData.orgIds[0],
					leaderId: resData.id,
					leaderName: resData.username
				};
				this.getBusinessNo();
			}
		}
		if (option.inventory) {
			let inventoryDic = {
				...JSON.parse(decodeURIComponent(option.inventory)),
				partsBasics:{
					...JSON.parse(decodeURIComponent(option.inventory))
				}
			};
			this.dataDic = {
				...this.dataDic,
				orgId: inventoryDic.orgId,
				orgName: inventoryDic.orgName
			};
			let list = [inventoryDic];
			let partsCollarLists = [];
			this.getchecklist(list, partsCollarLists);
		}
		this.getUserLeaders();
		this.loadAreaList();
		uni.$on('choose-acc-emit', usnerinfo => {
			let list = usnerinfo.list || [];
			let partsCollarLists = this.dataDic.partsCollarLists || [];
			//处理数据
			this.getchecklist(list, partsCollarLists);
		});
	},
	onUnload() {
		// 取消监听事件
		uni.$off('choose-acc-emit');
	},
	methods: {
		changestr(str) {
			if (str == null) {
				return '';
			}
			return str.split(' ')[0];
		},
		getLeftNum(item) {
			let stockTotal = item.stockTotal || 0;
			let leftNum = Number(stockTotal);
			return leftNum;
		},
		// 获取退回后通过dataForm接口获取的数据详情
		getBackData(val) {
			this.dataDic = JSON.parse(val);
		},
		// 获取单号
		getBusinessNo() {
			let url = this.$url.CREATE_PART_NO.replace(/{type}/, 'PJCK');
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					this.dataDic = {
						...this.dataDic,
						businessNo: result,
						partsAmount: '0.00'
					};
				})
				.catch(err => {});
		},
		//撤回时获取详情
		loaddata(key) {
			let url = this.$url.ACC_RECEIVE_DETAIL + key;
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
				// orgId : this.dataDic.orgId,
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
					// this.selectList = this.assignArr;
					// this.$refs.selector.show();
				})
				.catch(err => {});
		},
		//选择器
		showPick(type) {
			this.selectType = type;
			if (type === 'area') {
				if (this.dataDic.partsCollarLists && this.dataDic.partsCollarLists.length > 0) {
					return;
				}
				this.selectList = this.areaArr;
				this.$refs.selector.show();
			} else if (type === 'assgin') {
				// if (!this.dataDic.orgId) {
				// 	uni.showToast({
				// 		title: '请选择区域',
				// 		icon: 'none'
				// 	});
				// 	return;
				// }
				// this.getUserLeaders();
				this.selectList = this.assignArr;
				this.$refs.selector.show();
			} else {
				this.$refs.date.show();
			}
		},
		onConfirm(val) {
			if (this.selectType === 'area') {
				let areaCode = val.checkArr;
				if (areaCode.value === this.dataDic.orgId) {
					return;
				}
				this.dataDic = {
					...this.dataDic,
					orgId: areaCode.value,
					orgName: areaCode.label
					// leaderId: "",
					// leaderName: "",
				};
			} else if (this.selectType === 'assgin') {
				let assginCode = val.checkArr;
				this.dataDic = {
					...this.dataDic,
					leaderId: assginCode.value,
					leaderName: assginCode.label
				};
			} else {
				this.dataDic = {
					...this.dataDic,
					collarTime: val.result + ' 00:00:00'
				};
			}
		},
		//数量监听
		getNumValue(val, index, item) {
			let newitem = {
				...item,
				partsNumber: val,
				// partsAmount: this.calcTotal(item.salePrice, val)
			};
			this.dataDic.partsCollarLists.splice(index, 1, newitem);
			// this.calcAllTotal();
		},
		calcTotal(price, num) {
			let total = price * num;
			return this.$datestr.doubleFloat(total).toString();
		},
		calcAllTotal() {
			let total = 0;
			let allnum = 0;
			this.dataDic.partsCollarLists.forEach(o => {
				total = total + parseFloat(o.partsAmount);
				allnum = allnum + Number(o.partsNumber);
			});
			this.dataDic = {
				...this.dataDic,
				partsAmount: this.$datestr.doubleFloat(total).toString(),
				receivingQuantity: allnum.toString()
			};
		},
		//添加配件
		addacc() {
			if (!this.dataDic.orgId) {
				uni.showToast({
					title: '请选择区域',
					icon: 'none'
				});
				return;
			}
			let partsCollarLists = this.dataDic.partsCollarLists || [];
			uni.navigateTo({
				url: './acc-storage-receive-list?list=' + encodeURIComponent(JSON.stringify(partsCollarLists)) + '&orgId=' + this.dataDic.orgId
			});
		},
		getchecklist(newlist, oldList) {
			if (newlist) {
				let list = newlist.map(item => {
					let filterlist = oldList.filter(o => {
						return o.itemNumber === item.itemNumber;
					});
					if (filterlist.length === 1) {
						return filterlist[0];
					} else {
						return {
							...item,
							partsNumber: '0',
							// partsAmount: '0.00'
						};
					}
				});
				this.dataDic = {
					...this.dataDic,
					partsCollarLists: list,
					partsType: list.length.toString()
				};
				console.log(JSON.stringify(this.dataDic));
			}
		},
		//删除配件
		deletePart(e,index) {
			uni.showModal({
				title:'提示',
				content:'确定要删除该配件么?',
				success: (res) => {
					if (res.cancel) {} else {
						this.dataDic.partsCollarLists.splice(index, 1);
						// this.calcAllTotal();
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
			if (!this.dataDic.orgId) {
				uni.showToast({
					title: '请选择区域',
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
					title: '请选择出库时间',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.dataDic.partsCollarLists || this.dataDic.partsCollarLists.length == 0) {
				uni.showToast({
					title: '请新增出库配件',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (this.dataDic.partsCollarLists) {
				let partsCollarLists = this.dataDic.partsCollarLists;
				if (
					partsCollarLists.some(o => {
						return o.partsNumber == 0;
					})
				) {
					uni.showToast({
						title: '存在数量为零的配件',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				
				if (partsCollarLists.some(o => {
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
				.getData(this.$url.ACC_RECEIVE_CREATE + val, 'POST', this.dataDic)
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
						title: err.message,
						icon: 'none'
					});
					uni.hideLoading();
				});
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
.cell-view {
	border-width: 1px;
	border-color: #eeeeee;
	border-style: solid;
	border-radius: 5px;
	margin: 10px;
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
	color: $uni-text-color-gray;
	font-size: $uni-font-size-base;
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
</style>
