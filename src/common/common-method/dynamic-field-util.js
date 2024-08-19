const STATISTICS_CONTRACT_ACCOUNT = "contractAccountV2"; //合同账期、履约营收
const STATISTICS_CONTRACT_SETTLE = "contractAccountV2Settlement"; //合同结算营收
const STATISTICS_CUSTOMER = "customerStatisticsV2"; //客户营收
const STATISTICS_STAFF = "businessOwnerStatisticsV2"; //员工营收
const STATISTICS_DEVICE = "machineAccountsV2"; //设备营收
const SORT_ASC_ARRAY = [{
		"label": "正序",
		"value": true
	},
	{
		"label": "倒序",
		"value": false
	}
]
const localFields = [{
	//合同账期营收统计
	"key": STATISTICS_CONTRACT_ACCOUNT,
	"dataList": [{
		"label": "合同名称",
		"value": "contractName",
		"isRequest": true
	}, {
		"label": "合同单号",
		"value": "businessNo",
		"isRequest": true
	},  {
		"label": "合同进度",
		"value": "stateName",
		"isRequest": true
	}, {
		"label": "业务负责人",
		"value": "customerSalesmanName",
		"isRequest": false
	}, {
		"label": "营收",
		"value": "receivableAccount",
		"isRequest": false
	}, {
		"label": "实收",
		"value": "receipt",
		"isRequest": false
	}, {
		"label": "应收",
		"value": "payable",
		"isRequest": false
	}, {
		"label": "区域",
		"value": "orgName",
		"isRequest": false
	}]
}, {
	//合同结算营收统计
	"key": STATISTICS_CONTRACT_SETTLE,
	"dataList": [{
		"label": "合同名称",
		"value": "contractName",
		"isRequest": true
	}, {
		"label": "合同单号",
		"value": "buSinessNo",
		"isRequest": true
	},{
		"label": "合同进度",
		"value": "stateName",
		"isRequest": true
	},{
		"label": "业务负责人",
		"value": "customerSalesmanName",
		"isRequest": false
	}, {
		"label": "营收",
		"value": "receivableAccount",
		"isRequest": false
	}, {
		"label": "实收",
		"value": "receipt",
		"isRequest": false
	}, {
		"label": "应收",
		"value": "payable",
		"isRequest": false
	}, {
		"label": "结算记录",
		"value": "settlementCount",
		"isRequest": false
	}, {
		"label": "区域",
		"value": "orgId",
		"isRequest": false
	}]
}, {
	//客户营收统计
	"key": STATISTICS_CUSTOMER,
	"dataList": [{
		"label": "客户名称",
		"value": "name",
		"isRequest": true
	}, {
		"label": "业务负责人",
		"value": "customerSalesmanName",
		"isRequest": false
	}, {
		"label": "营收",
		"value": "receivableAccount",
		"isRequest": false
	}, {
		"label": "实收",
		"value": "receiptTotal",
		"isRequest": false
	}, {
		"label": "应收",
		"value": "debt",
		"isRequest": false
	}, {
		"label": "区域",
		"value": "orgName",
		"isRequest": false
	}]
}, {
	//客户
	"key": STATISTICS_STAFF,
	"dataList": [{
		"label": "员工姓名",
		"value": "name",
		"isRequest": true
	}, {
		"label": "营收",
		"value": "receivableAccount",
		"isRequest": false
	}, {
		"label": "实收",
		"value": "receiptTotal",
		"isRequest": false
	}, {
		"label": "应收",
		"value": "debt",
		"isRequest": false
	}, {
		"label": "区域",
		"value": "orgName",
		"isRequest": false
	}]
}, {
	//设备营收统计
	"key": STATISTICS_DEVICE,
	"dataList": [{
		"label": "车号",
		"value": "licenseId",
		"isRequest": true
	}, {
		"label": "自喷吗",
		"value": "printCode",
		"isRequest": true
	}, {
		"label": "类型",
		"value": "typeName",
		"isRequest": true
	},  {
		"label": "高度",
		"value": "heightName",
		"isRequest": true
	},  {
		"label": "品牌",
		"value": "brand",
		"isRequest": true
	},  {
		"label": "型号",
		"value": "machineTypeName",
		"isRequest": true
	}, {
		"label": "合同名称",
		"value": "contractName",
		"isRequest": true
	}, {
		"label": "业务负责人",
		"value": "customerSalesmanName",
		"isRequest": false
	}, {
		"label": "营收",
		"value": "receivableAccount",
		"isRequest": false
	}, {
		"label": "区域",
		"value": "orgName",
		"isRequest": false
	}]
}]
//獲取對應的字段數組
const getFieldsByType = function(key) {
	let data = localFields.find(function(o) {
		return o.key == key
	})
	return data ? data.dataList : []
}
//獲取對應的排序字段數組
const getSortFieldsByType = function(key, showFields) {
	let data = localFields.find(function(o) {
		return o.key == key
	})
	let dataList = [];
	if (data) {
		//如果获取接口的showFIeld是null,页面显示所有字段
		if (!showFields) {
			dataList = data.dataList.filter(o => !o.isRequest)
		} else { //否则排序字段为已设置的字段
			data.dataList.map(o => {
				if (!o.isRequest && showFields.some(x => x == o.value)) {
					dataList.push(o)
				}
			})
		}
	}
	return dataList
}



/**
 * //當前字段是否顯示
 * @param {Object} fieldList 字段數組 null返回显示；[]返回不显示
 * @param {Object} fieldValue 需要處理的字段
 */
const isShowField = function(fieldList, fieldValue) {
	if (!fieldValue || !fieldList)
		return true
	if (fieldList.length <= 0)
		return false
	return fieldList.some(o => o == fieldValue) ? true : false
}


export default {
	getFieldsByType,
	isShowField,
	getSortFieldsByType,
	STATISTICS_CONTRACT_ACCOUNT,
	STATISTICS_CONTRACT_SETTLE,
	STATISTICS_CUSTOMER,
	STATISTICS_STAFF,
	STATISTICS_DEVICE,
	SORT_ASC_ARRAY
}
