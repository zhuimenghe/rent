<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<create-step
			processKey="partsReturn"
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
					title="退回单号"
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
					title="退回人"
					placeholder="请选择退回人"
					:content="dataDic.returnUserName"
					:isRequire="true"
					@clickItem="showPick('assgin')"
					/>
					<selectorPick
					title="退回时间"
					placeholder="请选择退回时间"
					:content="changestr(dataDic.returnTime)"
					:isRequire="true"
					@clickItem="showPick('time')"
					/>
					<selectorPick
					title="出库单号"
					placeholder="请选择出库单号"
					:content="dataDic.collarBusinessNo"
					:isRequire="true"
					@clickItem="showPick('collarId')"
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
						<view class="cell-input-view-left boldstyle"><text>退回配件列表</text></view>
						<view class="cell-input-view-right" @click="addacc"><text class="input-style" style="color: #E60000;">+ 新增配件</text></view>
					</view>
					<view v-for="(item, index) in dataDic.partsReturnLists" :key="index" class="cell-view">
						<partComponents
						itemType="return"
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
					type="parts_return_type" 
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
			uni.setNavigationBarTitle({
				title:"修改配件退回单"
			})
			//退回编辑,撤回提交
			this.backDic = JSON.parse(decodeURIComponent(option.item));
			this.isUpdate = option.isUpdate ? (option.isUpdate === '1' ? true : false) : false;
			if (this.isUpdate) {
				this.loaddata(this.backDic.businessNo);
			}
		} else {
			uni.getStorage({
				key: this.$savekey.USER_INFO_MEG,
				success: res => {
					console.log(res);
					let resOrgName = res.data.orgName;
					let arr = resOrgName.split('|');
					this.dataDic = {
						...this.dataDic,
						orgName: arr[0],
						orgId: res.data.orgIds[0],
						returnUserId: res.data.id,
						returnUserName: res.data.username
					};
					this.getBusinessNo();
				}
			});
		}

		this.getUserLeaders();
		this.loadAreaList();
		uni.$on('choose-acc-emit', usnerinfo => {
			let list = usnerinfo.list || [];
			let partsReturnLists = this.dataDic.partsReturnLists || [];
			//处理数据
			this.getchecklist(list, partsReturnLists);
		});
		uni.$on('choose-receive-no', usnerinfo => {
			this.dataDic = {
				...this.dataDic,
				collarId: usnerinfo.id,
				collarBusinessNo: usnerinfo.businessNo,
			};
			this.loadReceiveDetail();
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
		// 获取退回后通过dataForm接口获取的数据详情
		getBackData(val) {
			this.dataDic = JSON.parse(val);
		},
		// 获取单号
		getBusinessNo() {
			let url = this.$url.CREATE_PART_NO.replace(/{type}/, 'PJTH');
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
			let url = this.$url.ACC_BACK_DETAIL + key;
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
					// 	this.selectList = this.assignArr;
					// 	this.$refs.selector.show();
				})
				.catch(err => {});
		},
		//选择器
		showPick(type) {
			this.selectType = type;
			if(type === 'area') {
				if (this.dataDic.partsReturnLists && this.dataDic.partsReturnLists.length > 0) {
					return;
				}
				this.selectList = this.areaArr;
				this.$refs.selector.show();
			}else if(type === 'assgin') {
				this.selectList = this.assignArr;
				this.$refs.selector.show();
			}else if(type == 'collarId'){
				uni.navigateTo({
					url:"/subOtherPages/accessories/acc-back/acc-receive-choose-list"
				})
			}else{
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
					// returnUserId: "",
					// returnUserName: "",
				};
			} else if (this.selectType === 'assgin') {
				let assginCode = val.checkArr;
				this.dataDic = {
					...this.dataDic,
					returnUserId: assginCode.value,
					returnUserName: assginCode.label
				};
			} else {
				this.dataDic = {
					...this.dataDic,
					returnTime: val.result + ' 00:00:00'
				};
			}
		},
		//数量监听
		getNumValue(val, index, item) {
			let newitem = {
				...item,
				partsNumber: val.toString(),
				// partsAmount: this.calcTotal(item.salePrice, val)
			};
			this.dataDic.partsReturnLists.splice(index, 1, newitem);
			// this.calcAllTotal();
		},
		calcTotal(price, num) {
			let total = price * num;
			return this.$datestr.doubleFloat(total);
		},
		calcAllTotal() {
			let total = 0;
			let allnum = 0;
			this.dataDic.partsReturnLists.forEach(o => {
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
			if (!this.dataDic.collarId) {
				uni.showToast({
					title: '请选择出库单',
					icon: 'none'
				});
				return;
			}
			let partsReturnLists = this.dataDic.partsReturnLists || [];
			uni.navigateTo({
				url: './acc-receive-back-list?list=' + encodeURIComponent(JSON.stringify(partsReturnLists)) + '&businessNo=' + this.dataDic.collarBusinessNo
			});
		},
		getchecklist(newlist, oldList) {
			if (newlist) {
				let list = newlist.map(item => {
					let filterlist = oldList.filter(o => {
						return o.itemNumber === item.itemNumber;
					});
					if (filterlist.length === 1) {
						let filtterDict = filterlist[0]
						return {
							...item,
							partsNumber: filtterDict.partsNumber,
						};
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
					partsReturnLists: list,
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
						this.dataDic.partsReturnLists.splice(index, 1);
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
			if (!this.dataDic.returnUserId) {
				uni.showToast({
					title: '请选择退回人',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.dataDic.returnTime) {
				uni.showToast({
					title: '请选择退回时间',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.dataDic.partsReturnLists || this.dataDic.partsReturnLists.length == 0) {
				uni.showToast({
					title: '请新增退回配件',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (this.dataDic.partsReturnLists) {
				let partsReturnLists = this.dataDic.partsReturnLists;
				if (
					partsReturnLists.some(o => {
						return o.partsNumber == 0;
					})
				) {
					uni.showToast({
						title: '存在数量为零的配件',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (partsReturnLists.some(o => {
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
				.getData(this.$url.ACC_BACK_CREATE + val, 'POST', this.dataDic)
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
					uni.hideLoading();
					uni.showToast({
						title: err.message + ',' + err.details[0],
						icon: 'none'
					});
				});
		},
		//获取出库单的详情
		loadReceiveDetail(key) {
			uni.showLoading()
			let url = this.$url.ACC_RECEIVE_DETAIL + this.dataDic.collarBusinessNo;
			this.$network.getData(url, 'GET', null).then(result => {
				let resultMap = {
					...result
				};
				let list = result.partsCollarLists.map(o=>{
					return {
						...o,
						id:undefined,
						canreturn:o.partsNumber,
						totalToBeStored:o.returnNumber,
						stockTotal:parseInt(o.partsNumber) - parseInt(o.returnNumber),
						partsNumber:parseInt(o.partsNumber) - parseInt(o.returnNumber),
						collarListId:o.id,
					}
				});
				this.dataDic = {
					...this.dataDic,
					partsReturnLists:[...list]
				}
				uni.hideLoading()
			}).catch(err => {
				uni.hideLoading()
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
