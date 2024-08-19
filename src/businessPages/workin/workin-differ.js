import datestr from '@/common/common-method/common-method.js'
//调度完整流程
const dispatch = function (formkey) {
	let limitsDict = {
		apply: true,
		applyEdit: true,
		savekey: '确定',
		canclekey: '取消'
	}
	switch (formkey) {
		case 'apply':
			break;
		case 'dispatch':
			limitsDict = {
				...limitsDict,
				apply: true,
				applyEdit: false,
				dispatch: true,
				dispatchEdit: true,
				savekey: '通过',
				canclekey: '退回'
			}
			break;
		case 'assignee':
			limitsDict = {
				...limitsDict,
				apply: true,
				applyEdit: false,
				dispatch: true,
				dispatchEdit: false,
				assignee: true,
				assigneeEdit: true,
				savekey: '通过',
				canclekey: '退回'
			}
			break;
		case 'deliver':
			limitsDict = {
				...limitsDict,
				apply: true,
				applyEdit: false,
				dispatch: true,
				dispatchEdit: false,
				assignee: true,
				assigneeEdit: false,
				deliver: true,
				deliverEdit: true,
				savekey: '通过',
				canclekey: '退回'
			}
			break;
		default:
			break;
	}
	return limitsDict;
};
//非调度选物流流程
const logistics = function (formkey, logisticsType) {
	let limitsDict = {
		apply: true,
		applyEdit: true,
		savekey: '确定',
		canclekey: '取消'
	}
	switch (formkey) {
		case 'apply':
			break;
		case 'logistics':
			limitsDict = {
				...limitsDict,
				apply: true,
				applyEdit: false,
				logistics: true,
				logisticsEdit: true,
				savekey: '通过',
				canclekey: '退回'
			}
			break;
		case 'assignee':
			limitsDict = {
				...limitsDict,
				apply: true,
				applyEdit: false,
				logistics: true,
				logisticsEdit: false,
				assignee: true,
				assigneeEdit: true,
				savekey: '通过',
				canclekey: '退回'
			}
			break;
		case 'deliver':
			limitsDict = {
				...limitsDict,
				apply: true,
				applyEdit: false,
				logistics: true,
				logisticsEdit: false,
				assignee: true,
				assigneeEdit: false,
				deliver: true,
				deliverEdit: true,
				savekey: '通过',
				canclekey: '退回'
			}
			break;
		default:
			break;
	}
	if (logisticsType != 2) {
		limitsDict = {
			...limitsDict,
			logistics: false,
		}
	}
	return limitsDict;
};
//全部流程显示
const workinwhole = function () {
	let limitsDict = {
		apply: true,
		applyEdit: true,
		logistics: true,
		logisticsEdit: true,
		assignee: true,
		assigneeEdit: true,
		deliver: true,
		deliverEdit: true,
		savekey: '确定',
		canclekey: '取消'
	}
	return limitsDict;
}
//流程分块
const sfworkin = function (formkey, logisticsType) {
	let limitsDict = {
		apply: true,
		applyEdit: true,
		logistics: true,
		logisticsEdit: true,
		assignee: true,
		assigneeEdit: true,
		savekey: '确定',
		canclekey: '取消'
	}
	switch (formkey) {
		case 'deliver':
			limitsDict = {
				...limitsDict,
				apply: true,
				applyEdit: false,
				logistics: true,
				logisticsEdit: false,
				assignee: true,
				assigneeEdit: false,
				deliver: true,
				deliverEdit: true,
				savekey: '通过',
				canclekey: '退回'
			}
			break;
		default:
			break;
	}
	if (logisticsType != 2) {
		limitsDict = {
			...limitsDict,
			logistics: false,
			logisticsEdit: false,
		}
	}
	return limitsDict;
};
//根据模块拼接
const getLimitWithArr = function (list, processKey) {
	let limitsDict = {}
	if (processKey === "apply") {
		if (list) {
			let formKey = list[0].formKey;
			let arr = formKey.split('|');
			limitsDict = {
				...getdict(arr, true),
				savekey: '确定',
				canclekey: '取消'
			}
		}
	} else {
		if (list) {
			list.map((o) => {
				let formKey = o.formKey || "";
				let arr = formKey.split('|');
				let isedit = true
				if (o.endTime && o.type === 'completed') {
					isedit = false
				}
				limitsDict = {
					...limitsDict,
					...getdict(arr, isedit),
				}
			})
			limitsDict = {
				...limitsDict,
				savekey: limitsDict.applyEdit ? "确定" : "通过",
				canclekey: limitsDict.applyEdit ? "取消" : "退回",
				preview: '预览'
			}
		}
	}
	return limitsDict;
}

//如果是详情 的流程 不能编辑 则能显示
const getdict = function (arr, isedit) {
	let limitsDict = {};
	if (arr.findIndex(o => o == 'apply') != -1) {
		limitsDict = {
			...limitsDict,
			apply: true,
			applyEdit: isedit,
		}
	}
	if (arr.findIndex(o => o == 'logistics') != -1) {
		limitsDict = {
			...limitsDict,
			logistics: true,
			logisticsEdit: isedit,
		}
	}
	if (arr.findIndex(o => o == 'dispatch') != -1) {
		limitsDict = {
			...limitsDict,
			dispatch: true,
			dispatchEdit: isedit,
		}
	}
	if (arr.findIndex(o => o == 'assignee') != -1) {
		limitsDict = {
			...limitsDict,
			assignee: true,
			assigneeEdit: isedit,
		}
	}
	if (arr.findIndex(o => o == 'deliver') != -1) {
		limitsDict = {
			...limitsDict,
			deliver: true,
			deliverEdit: isedit,
		}
	}
	return limitsDict;
}
//详情
const getDetailLimitWithArr = function (list) {
	let limitsDict = {}
	if (list) {
		if (list.length == 1) {//只有一步时
			let formKey = list[0].formKey || "";
			let arr = formKey.split('|');
			console.log(arr)
			limitsDict = {
				...limitsDict,
				...getDetailDict(arr, true),
			}
		} else {
			list.map((o) => {
				let formKey = o.formKey || "";
				let arr = formKey.split('|');
				let show = false
				if (o.endTime && o.type === 'completed') {
					show = true
				}
				limitsDict = {
					...limitsDict,
					...getDetailDict(arr, show),
				}
			})
		}

	}
	return limitsDict;
}
const getDetailDict = function (arr, show) {
	let limitsDict = {};
	if (arr.findIndex(o => o == 'apply') != -1) {
		limitsDict = {
			...limitsDict,
			apply: show,
			applyEdit: false,
		}
	}
	if (arr.findIndex(o => o == 'logistics') != -1) {
		limitsDict = {
			...limitsDict,
			logistics: show,
			logisticsEdit: false,
		}
	}
	if (arr.findIndex(o => o == 'dispatch') != -1) {
		limitsDict = {
			...limitsDict,
			dispatch: show,
			dispatchEdit: false,
		}
	}
	if (arr.findIndex(o => o == 'assignee') != -1) {
		limitsDict = {
			...limitsDict,
			assignee: show,
			assigneeEdit: false,
		}
	}
	if (arr.findIndex(o => o == 'deliver') != -1) {
		limitsDict = {
			...limitsDict,
			deliver: show,
			deliverEdit: false,
		}
	}
	return limitsDict;
}
//时间处理
function changestr(str) {
	if (str == null) {
		return '';
	}
	return str.split(' ')[0];
}
const checkData = function (limitsDict, workInDic, isRemoveRepeat, isLiangXu, bool, formKey, type = 'add') {
	console.log(formKey, 'formKey');
	if (type == 'add' && formKey.indexOf('deliver') != -1) {
		if (bool && (!workInDic.fileList || workInDic.fileList.length == 0)) {
			uni.showToast({
				icon: 'none',
				title: '请选择附件'
			});
			return false;
		}
	}
	//申请
	if (limitsDict.applyEdit) {
		if (!workInDic.contractNo) {
			uni.showToast({
				icon: 'none',
				title: '请选择合同'
			});
			return false;
		}
		if (!workInDic.startPlace) {
			uni.showToast({
				icon: 'none',
				title: '请选择起始地点'
			});
			return false;
		}
		if (!workInDic.deliveryPlace) {
			uni.showToast({
				icon: 'none',
				title: '请选择交机地点'
			});
			return false;
		}
		if (isLiangXu) {
			if (!workInDic.enableDate) {
				uni.showToast({
					icon: 'none',
					title: '请选择起租日'
				});
				return false;
			}
		} else {
			if (isRemoveRepeat === false) {
				if (!workInDic.preBeginDate) {
					uni.showToast({
						icon: 'none',
						title: '请选择计划交机时间'
					});
					return false;
				}
				if (!workInDic.preEnableDate) {
					uni.showToast({
						icon: 'none',
						title: '请选择计划启用时间'
					});
					return false;
				}
				let preEnableDate = workInDic.preEnableDate.split(' ')[0] + " 23:59:59";
				if (datestr.timedifferent(preEnableDate, workInDic.preBeginDate) === -1) {
					uni.showToast({
						icon: 'none',
						title: '计划启用时间不得早于计划交机时间'
					});
					return false;
				}
			}
		}

		if ((!workInDic.orders || workInDic.orders && workInDic.orders.length <= 0) && formKey.indexOf('apply') != -1) {
			uni.showToast({
				icon: 'none',
				title: '请选择设备信息'
			});
			return false;
		}
		if (formKey.indexOf('deliver') != -1 && (!workInDic.machines || (workInDic.machines && workInDic.machines.length == 0))) {
			uni.showToast({
				icon: 'none',
				title: '请选择设备'
			});
			return false;
		}
	}
	//物流
	if (limitsDict.logisticsEdit) {
		if (workInDic.logisticsType == '2' && formKey.indexOf('logistics') != -1) {
			if (!workInDic.logisticsCompanyId) {
				uni.showToast({
					icon: 'none',
					title: '请选择物流公司'
				});
				return false;
			}
			if (!workInDic.logisticsContact || workInDic.logisticsContact.trim() === '') {
				uni.showToast({
					icon: 'none',
					title: '请选择运输联系人'
				});
				return false;
			}
			if (
				workInDic.logisticsPhone &&
				!datestr.isphonenum(workInDic.logisticsPhone)
			) {
				uni.showToast({
					icon: 'none',
					title: '请输入正确的联系人电话'
				});

				return false;
			}
			if (workInDic.logisticsCarriage == null || workInDic.logisticsCarriage === '') {
				uni.showToast({
				  icon: "none",
				  title: "请输入物流运费",
				});
				return false;
			  }
		}
		if (workInDic.logisticsType == '3' && formKey.indexOf('logistics') != -1) {
			if (!workInDic.transportMachine || (workInDic.transportMachine && workInDic.transportMachine.length <= 0)) {
				uni.showToast({
					icon: 'none',
					title: '请选择运输车辆'
				});
				return false;
			}
			if (!workInDic.logisticsContact || workInDic.logisticsContact.trim() === '') {
				uni.showToast({
					icon: 'none',
					title: '请选择运输联系人'
				});
				return false;
			}
			if (!workInDic.logisticsPhone || workInDic.logisticsPhone.trim() === '' || !datestr.isphonenum(workInDic.logisticsPhone)) {
				uni.showToast({
					icon: 'none',
					title: '请输入正确的运输联系人的电话'
				});
				return false;
			}
			if (workInDic.logisticsCarriage == null || workInDic.logisticsCarriage === '') {
				uni.showToast({
				  icon: "none",
				  title: "请输入物流运费",
				});
				return false;
			  }
		}

	}
	//调度
	if (limitsDict.dispatchEdit || limitsDict.logisticsEdit) {
		if (!workInDic.deliveryContact) {
			uni.showToast({
				icon: 'none',
				title: '请选择交机联系人'
			});
			return false;
		}
		if (!workInDic.deliveryPhone || !datestr.isphonenum(workInDic.deliveryPhone)) {
			uni.showToast({
				icon: 'none',
				title: '请输入正确的交机联系人电话'
			});
			return false;
		}
		if (workInDic.logisticsCarriage == null || workInDic.logisticsCarriage === '') {
			uni.showToast({
			  icon: "none",
			  title: "请输入物流运费",
			});
			return false;
		  }
		if (workInDic.logisticsType == '2') {
			if (!workInDic.logisticsCompanyId) {
				uni.showToast({
					icon: 'none',
					title: '请选择物流公司'
				});
				return false;
			}
			if (!workInDic.logisticsContact) {
				uni.showToast({
					icon: 'none',
					title: '请选择物流联系人'
				});
				return false;
			}
			if (!workInDic.logisticsPhone || !datestr.isphonenum(workInDic.logisticsPhone)) {
				uni.showToast({
					icon: 'none',
					title: '请选择物流联系人电话'
				});
				return false;
			}
			if (workInDic.logisticsCarriage == null || workInDic.logisticsCarriage === '') {
				uni.showToast({
				  icon: "none",
				  title: "请输入物流运费",
				});
				return false;
			  }
			// if (!workInDic.logisticsCarriage) {
			// 	uni.showToast({
			// 		icon: 'none',
			// 		title: '请输入物流费'
			// 	});
			// 	return false;
			// }
		}
		if (workInDic.logisticsType == '3') {
			if (!workInDic.transportMachine || workInDic.transportMachine && workInDic.transportMachine.length <= 0) {
				uni.showToast({
					icon: 'none',
					title: '请选择运输车辆'
				});
				return false;
			}
			if (!workInDic.logisticsContact) {
				uni.showToast({
					icon: 'none',
					title: '请选择物流联系人'
				});
				return false;
			}
			if (!workInDic.logisticsPhone || !datestr.isphonenum(workInDic.logisticsPhone)) {
				uni.showToast({
					icon: 'none',
					title: '请选择物流联系人电话'
				});
				return false;
			}
			// if (!workInDic.transportDriver || workInDic.transportDriver && workInDic.transportDriver.length <= 0) {
			// 	uni.showToast({
			// 		icon: 'none',
			// 		title: '请选择运输司机'
			// 	});
			// 	return false;
			// }
		}
	}
	//接机人
	if (limitsDict.assigneeEdit) {
		if (!workInDic.deliveryUser) {
			uni.showToast({
				icon: 'none',
				title: '请选择交机人员'
			});
			return false;
		}
	}
	//交机
	if (limitsDict.deliverEdit) {

		if (!workInDic.beginDate) {
			uni.showToast({
				icon: 'none',
				title: '请选择交机时间'
			});
			return false;
		}
		if (!workInDic.enableDate) {
			uni.showToast({
				icon: 'none',
				title: '请选择启用时间'
			});
			return false;
		}
		// if (datestr.timedifferent(workInDic.beginDate, workInDic.outStoreDate) === -1) {
		// 	uni.showToast({
		// 		icon: 'none',
		// 		title: '交机时间不得早于出库时间'
		// 	});
		// 	return false;
		// }
		let enableDate = workInDic.enableDate.split(' ')[0] + " 23:59:59";
		if (datestr.timedifferent(enableDate, workInDic.beginDate) === -1) {
			uni.showToast({
				icon: 'none',
				title: '启用时间不得早于交机时间'
			});
			return false;
		}
	}
	return true;
}
export default {
	dispatch,
	logistics,
	workinwhole,
	sfworkin,
	getLimitWithArr,
	checkData,
	getDetailLimitWithArr
}
