import * as savekey from "@/common/common-method/save-key.js"

/**
 * 判断是否显示处理的权限
 * @param {Object} assigneeList
 */
const isShowDeal = function(assigneeList) {
	if (!assigneeList || assigneeList.length <= 0) {
		return false
	}
	let userMsg = uni.getStorageSync(savekey.USER_INFO_SYNC);
	console.log("userMsg------------"+JSON.stringify(userMsg))
	if (userMsg && userMsg.id && assigneeList.findIndex(o => o === userMsg.id) != -1) {
		return true
	}
	return false
}



export default {
	isShowDeal
}
