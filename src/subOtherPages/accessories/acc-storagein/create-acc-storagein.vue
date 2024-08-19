<template>
	<view class="creat-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<create-step
			processKey="partsStorage"
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
					title="入库单号"
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
					title="入库人"
					placeholder="请选择入库人"
					:content="dataDic.warehousesName"
					:isRequire="true"
					@clickItem="showPick('assgin')"
					/>
					<selectorPick
					title="入库时间"
					placeholder="请选择入库时间"
					:content="changestr(dataDic.storageTime)"
					:isRequire="true"
					@clickItem="showPick('time')"
					/>
					<selectorPick
					title="总价(元)"
					:isEdit="false"
					:content="dataDic.partsAmount"
					:isRequire="false"
					/>
				</view>
				<view class="sum-view-bg">
					<view class="cell-input-view tilte-view-sub">
						<view class="cell-input-view-left boldstyle"><text>入库配件列表</text></view>
						<view class="cell-input-view-right" @click="addacc"><text class="input-style" style="color: #E60000;">+ 新增配件</text></view>
					</view>
					<view v-for="(item, index) in dataDic.partsStorageLists" :key="index" class="cell-view">
						<partComponentsAdd
						@goTo = "goTo($event,item,index)"
						@deleteItem = "deletePart($event,index)"
						:dataDic="item" 
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
					type="parts_storage_type"
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
				endYear="3000" :current="true" 
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
import partComponentsAdd from '../part-components/part-components-add.vue';
export default {
	components: {
		selectorPick,
		selectorInput,
		selectorArea,
		imgupload,
		createStep,
		wPicker,
		partComponentsAdd
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
			SourceIndex: 0,
			//数据
			selectList: [],
			areaArr: [],
			assignArr: [],
			sourceArr: [],
			methodsArr:[],
			selectType: '',
			chooseIndex: 0
		};
	},
	onLoad(option) {
		if (option.item) {
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
					let resOrgName = res.data.orgName;
					let arr = resOrgName.split('|');
					this.dataDic = {
						...this.dataDic,
						orgName: arr[0],
						orgId: res.data.orgIds[0],
						warehousesId: res.data.id,
						warehousesName: res.data.username
						// warehousesId:res.data.roleType === this.$savekey.USER_ROLE_SEVICER ? res.data.id :undefined,
						// warehousesName:res.data.roleType === this.$savekey.USER_ROLE_SEVICER ? res.data.username :undefined,
					};
					this.getBusinessNo();
				}
			});
		}
		if (option.inventory) {
			let inventoryDic = JSON.parse(decodeURIComponent(option.inventory));
			let list = [inventoryDic];
			let partsStorageLists = [];
			this.getchecklist(list, partsStorageLists);
		}
		this.loadAreaList();
		this.getUserLeaders();
		this.loadSourceList();
		this.loadMehtodsList();
		uni.$on('choose-acc-emit', usnerinfo => {
			let list = usnerinfo.list || [];
			console.log(list);
			let partsStorageLists = this.dataDic.partsStorageLists || [];
			console.log(JSON.stringify(this.dataDic));
			//// 处理数据
			this.getchecklist(list, partsStorageLists);
		});
		uni.$on('edit-item', obj => {
			if(obj.type == 'delete'){
				this.dataDic.partsStorageLists.splice(this.chooseIndex, 1);
				this.calcAllTotal();
			}else{
				this.dataDic.partsStorageLists.splice(this.chooseIndex, 1,obj.data);
				this.calcAllTotal();
			}
		});
	},
	onUnload() {
		// 取消监听事件
		uni.$off('choose-acc-emit');
		uni.$off('edit-item');
	},
	methods: {
		getFirstItemName(arr){
			if(arr.length>0){
				return arr[0].label
			}
			return ""
		},
		getFirstItemValue(arr){
			if(arr.length>0){
				return arr[0].value
			}
			return ""
		},
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
		goTo(e, item, index) {
			this.chooseIndex = index;
			// uni.navigateTo({
			// 	url: '/subOtherPages/accessories/acc-storagein/choose-material-part?basicsId=' + item.basicsId
			// });
			uni.navigateTo({
				url: '/subOtherPages/accessories/acc-storagein/edit-storagein-part?item=' + encodeURIComponent(JSON.stringify(item))
			});
		},
		// 获取单号
		getBusinessNo() {
			let url = this.$url.CREATE_PART_NO.replace(/{type}/, 'PJRK');
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
			let url = this.$url.ACC_STORAGR_DETAIL + key;
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
					if (o.status == 1) {
						let a = {
							value: o.id,
							label: o.name
						};
						arr = [...arr, a];
						if (o.children && o.children.length > 0) {
							arr = [...arr, ...this.getChildren(o.children)];
						}
					}
				});
			}
			return arr;
		},
		//加载服务人员
		getUserLeaders() {
			let param = {
				showAdmin: false
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
		//选择器
		showPick(type) {
			this.selectType = type;
			if (type === 'area') {
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
			if (this.selectType === 'area') {
				let areaCode = val.checkArr;
				if (areaCode.value === this.dataDic.orgId) {
					return;
				}
				this.dataDic = {
					...this.dataDic,
					orgId: areaCode.value,
					orgName: areaCode.label
				};
			}else if (this.selectType === 'assgin') {
				let assginCode = val.checkArr;
				this.dataDic = {
					...this.dataDic,
					warehousesId: assginCode.value,
					warehousesName: assginCode.label
				};
			} else {
				this.dataDic = {
					...this.dataDic,
					storageTime: val.result + ' 00:00:00'
				};
			}
		},
		calcAllTotal() {
			let total = 0;
			this.dataDic.partsStorageLists.forEach(o => {
				total = total + parseFloat(o.partsAmount);
			});
			this.dataDic = {
				...this.dataDic,
				partsAmount: this.$datestr.doubleFloat(total).toString()
			};
			console.log(JSON.stringify(this.dataDic));
		},
		//添加配件
		addacc() {
			let partsStorageLists = this.dataDic.partsStorageLists || [];
			uni.navigateTo({
				url: './acc-all-list?list=' + encodeURIComponent(JSON.stringify(partsStorageLists))
			});
		},
		getchecklist(newlist, oldList) {
			let list = newlist.map(item => {
				return {
					...item,
					itemNumber: '',
					basicsId: item.partsBasics.id,
					partsNumber: '0',
					purchasingMethod:item.purchasingMethod ? item.purchasingMethod : this.getFirstItemValue(this.methodsArr),
					purchasingMethodName:item.purchasingMethodName? item.purchasingMethodName : this.getFirstItemName(this.methodsArr),
					partsSource: item.partsSource ? item.partsSource : this.getFirstItemValue(this.sourceArr),
					partsSourceName: item.partsSourceName ? item.partsSourceName : this.getFirstItemName(this.sourceArr),
					brandName: item.brandName || '',
					salePrice: item.salePrice || '',
					partsAmount: '0.00'
				};
			});
			let totalList = oldList.concat(list);
			this.dataDic = {
				...this.dataDic,
				partsStorageLists: totalList
			};
		},
		//删除配件
		deletePart(e,index) {
			console.log(index)
			uni.showModal({
				title:'提示',
				content:'确定要删除该配件么?',
				success: (res) => {
					if (res.cancel) {} else {
						this.dataDic.partsStorageLists.splice(index, 1);
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
			if (!this.dataDic.orgId) {
				uni.showToast({
					title: '请选择区域',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.dataDic.warehousesId) {
				uni.showToast({
					title: '请选择入库人',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.dataDic.storageTime) {
				uni.showToast({
					title: '请选择入库时间',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (!this.dataDic.partsStorageLists || this.dataDic.partsStorageLists.length == 0) {
				uni.showToast({
					title: '请新增入库配件',
					icon: 'none'
				});
				return Promise.reject('fail');
			}
			if (this.dataDic.partsStorageLists) {
				let partsStorageLists = this.dataDic.partsStorageLists;
				if (
					partsStorageLists.some(o => {
						return o.itemNumber === '';
					})
				) {
					uni.showToast({
						title: '存在未输入料号的配件',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (
					partsStorageLists.some(o => {
						return o.partsSource === '';
					})
				) {
					uni.showToast({
						title: '存在未选择配件来源的配件',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (
					partsStorageLists.some(o => {
						return o.partsNumber == 0;
					})
				) {
					uni.showToast({
						title: '存在数量为零的配件',
						icon: 'none'
					});
					return Promise.reject('fail');
				}
				if (partsStorageLists.some(o => {
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
			return new Promise((resolve, reject) => {
				this.checkPartData().then(res => {
					if (res === 'fail') {
						reject('fail');
					} else {
						let rusultlist = res;
						if (res.length > 0) {
							let itemno = '';
							let itemnoold = '';
							res.forEach(o => {
								if (itemno === '') {
									itemno = o.itemNumber || '';
									itemnoold = o.newItemNumber || '';
								} else {
									itemno = itemno + ',' + o.itemNumber;
									itemnoold = itemnoold + ',' + o.newItemNumber;
								}
							});
							// let allstr = '[' + itemno + ']' + '已经存在相同型号、价格、来源的物料号[' + itemnoold + '],选择确定，使用当前物料号，选择取消，请手动修改物料信息';
							let allstr = '当前物料号:[' + itemno + ']对应的库存配件信息与本次入库不符';
							uni.showToast({
								title:allstr,
								icon:'none'
							})
							reject('fail');
							// uni.showModal({
							// 	title: '提示',
							// 	content: allstr,
							// 	success: res => {
							// 		if (res.cancel) {
							// 			reject('fail');
							// 		} else {
							// 			resolve('sucess');
							// 		}
							// 	},
							// 	fail: error => {
							// 		reject('fail');
							// 	}
							// });
						} else {
							resolve('sucess');
						}
					}	
				}).catch(e => {
					reject('fail');
				});
			});
			this.dataDic = {
				...this.dataDic
			}
			return Promise.resolve('success');
		},
		checkPartData() {
			let url = this.$url.ACC_STORAGR_CHECK;
			return new Promise((resolve, reject) => {
				this.$network
					.getData(url, 'POST', this.dataDic)
					.then(result => {
						resolve(result);
					})
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.message + ',' + err.details[0]
						});
						reject('fail');
					});
			});
		},
		//确定按钮
		clicksave(val) {
			uni.showLoading({
				mask: true
			});
			this.$network
				.getData(this.$url.ACC_STORAGR_CREATE + val, 'POST', this.dataDic)
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
	margin-left: 10px;
	margin-right: 10px;
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
	padding: 10px 0px;
}

.cell-input-view-right {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	padding: 10px 0px;
}

.input-style {
	flex: 1;
	text-align: right;
	font-size: 14px;
}

.input-style-center {
	flex: 1;
	text-align: center;
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
</style>
