const isDiff = function(o1 = null, o2 = null, key = null) {
 	if (o1 === o2) return false;
 	if (getType(o1) !== getType(o2)) return true;
 	if (o1 === null || o2 === null) return true;
 	if (getType(o1) === "Array") {
 		if (o1.length !== o2.length) return true;
 		return o1.some((item, index) => isDiff(item, o2[index], key));
 	}
 	if (getType(o1) === "Object") {
 		return key ?
 			o1[key] !== o2[key]
 			// : Object.keys(o1).length !== Object.keys(o2).length   //不比对对象属性数量
 			// ? true
 			:
 			Object.keys(o1).some(k => isDiff(o1[k], o2[k], key));
 	}
 	if (getType(o1) === "Date") return o1.getTime() !== o2.getTime();
 	return true;
 };
const getType = function (o) {
 	return Object.prototype.toString.call(o).replace(/(\[object\s|\])/g, "");
 };


 module.exports = {
 	isDiff,
	getType
 }
