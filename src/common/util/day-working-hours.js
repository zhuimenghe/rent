//某天开始的时间
const getDayStart = function (time) {
	var splitA = time.split(/\s+/);
	var date = splitA[0];
	return new Date(Date.parse(new Date(date))).getTime();
}
//某天结束的时间
const getDayEnd = function (time) {
	return getDayStart(time) + (24 * 60 * 60 - 1) * 1000;
}

//某一时间段开始的位置
const getStartTimePos = function (startTime, totalLength) {
	startTime = startTime.replace(/-/g, '/');
	var totalTime = 24 * 60 * 60 * 1000;
	var pos = ((new Date(startTime).getTime() - getDayStart(startTime)) / totalTime) * totalLength;
	return pos;

}

//时间段长度
const getTimeBucketLength = function (startTime, endTime, totalLength) {
	startTime = startTime.replace(/-/g, '/');
	endTime = endTime.replace(/-/g, '/');
	var totalTime = 24 * 60 * 60 * 1000;
	var len = (new Date(endTime).getTime() - new Date(startTime).getTime()) / totalTime * totalLength;
	return len;
}
//2019-12-02 转换成2019年12月02日
const formatDateSToC = function (date) {
	date = date.replace(/-/g, '/');
	return dateFormat(new Date(date).getTime())
}
//2019-12-02 18:00:00 转换成2019年12月02日 18:00:00
const formatTimeSToC = function (date) {
	date = date.replace(/-/g, '/');
	return datetimeFormat(new Date(date).getTime())
}


//long型时间转化成 yyyy-MM-dd HH:MM:SS
function datetimeSFormat(longTypeDate) {
	var dateTypeDate = "";
	var date = new Date();
	if (longTypeDate) {
		date.setTime(longTypeDate);
	}
	dateTypeDate += date.getFullYear() + "-"; //年    
	dateTypeDate += getMonth(date) + "-"; //月     
	dateTypeDate += getDay(date) + " "; //日    
	dateTypeDate += " " + getHours(date); //时    
	dateTypeDate += ":" + getMinutes(date); //分  
	dateTypeDate += ":" + getSeconds(date); //分
	return dateTypeDate;
}

//long型时间转化成 yyyy-MM-dd
// function dateSFormat(longTypeDate) {
// 	var dateTypeDate = "";
// 	var date = new Date();
// 	date.setTime(longTypeDate);
// 	dateTypeDate += date.getFullYear() + "-"; //年    
// 	dateTypeDate += getMonth(date) + "-"; //月     
// 	dateTypeDate += getDay(date); //日 
// 	return dateTypeDate;
// }

function dateSFormat(inputDate) {
	let date = new Date();

	if (typeof inputDate === 'string') {
		// 如果输入是字符串，替换 '-' 为 '/'，然后转换为日期
		date = new Date(inputDate.replace(/-/g, '/'));
	} else if (typeof inputDate === 'number') {
		// 如果输入是数字（长整型时间戳），直接设置时间
		date.setTime(inputDate);
	} else if (inputDate instanceof Date) {
		// 如果输入已经是 Date 对象，直接使用
		date = inputDate;
	} else {
		// 无效输入时返回空字符串或其他错误处理
		return '';
	}

	let year = date.getFullYear();
	let month = getMonth(date); // 假设 getMonth 已正确实现
	let day = getDay(date); // 假设 getDay 已正确实现

	return `${year}-${month}-${day}`;
}

// function datetimeFormat(longTypeDate) {
// 	var dateTypeDate = "";
// 	var date = new Date();
// 	date.setTime(longTypeDate);
// 	dateTypeDate += date.getFullYear() + "年"; //年    
// 	dateTypeDate += getMonth(date) + "月"; //月     
// 	dateTypeDate += getDay(date) + "日"; //日    
// 	dateTypeDate += " " + getHours(date); //时    
// 	dateTypeDate += ":" + getMinutes(date); //分  
// 	dateTypeDate += ":" + getSeconds(date); //分
// 	return dateTypeDate;
// }

function datetimeFormat(inputDate) {
	let date = new Date();

	if (typeof inputDate === 'string') {
		// 如果输入是字符串，替换 '-' 为 '/'，然后转换为日期
		date = new Date(inputDate.replace(/-/g, '/'));
	} else if (typeof inputDate === 'number') {
		// 如果输入是数字（长整型时间戳），直接设置时间
		date.setTime(inputDate);
	} else if (inputDate instanceof Date) {
		// 如果输入已经是 Date 对象，直接使用
		date = inputDate;
	} else {
		// 无效输入时返回空字符串或其他错误处理
		return '';
	}

	let year = date.getFullYear();
	let month = getMonth(date); // 假设 getMonth 已正确实现
	let day = getDay(date); // 假设 getDay 已正确实现

	let hours = getHours(date); //时    
	let minutes = getMinutes(date); //分  
	let seconds = getSeconds(date); //秒

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


/*  
 * 时间格式化工具 
 * 把Long类型的1527672756454日期还原yyyy-MM-dd格式日期   
 */
const dateFormat = function (longTypeDate) {
	var dateTypeDate = "";
	var date = new Date();
	date.setTime(longTypeDate);
	dateTypeDate += date.getFullYear() + "年"; //年    
	dateTypeDate += getMonth(date) + "月"; //月     
	dateTypeDate += getDay(date) + "日"; //日    
	return dateTypeDate;
}

const yearMonthFormat = function (longTypeDate) {
	var dateTypeDate = "";
	var date = new Date();
	date.setTime(longTypeDate);
	dateTypeDate += date.getFullYear() + "-"; //年    
	dateTypeDate += getMonth(date); //月   
	return dateTypeDate;
}

function getYear(date) {
	return date.getFullYear();
}
//返回 01-12 的月份值     
function getMonth(date) {
	var month = "";
	month = date.getMonth() + 1; //getMonth()得到的月份是0-11    
	if (month < 10) {
		month = "0" + month;
	}
	return month;
}
//返回01-30的日期    
function getDay(date) {
	var day = "";
	day = date.getDate();
	if (day < 10) {
		day = "0" + day;
	}
	return day;
}
//小时  
function getHours(date) {
	var hours = "";
	hours = date.getHours();
	if (hours < 10) {
		hours = "0" + hours;
	}
	return hours;
}
//分  
function getMinutes(date) {
	var minute = "";
	minute = date.getMinutes();
	if (minute < 10) {
		minute = "0" + minute;
	}
	return minute;
}
//秒  
function getSeconds(date) {
	var second = "";
	second = date.getSeconds();
	if (second < 10) {
		second = "0" + second;
	}
	return second;
}

//日期格式化，返回值形式为yy-mm-dd
function timeFormat(date) {
	if (!date) {
		date = new Date()
	}
	if (typeof (date) === "string") {
		date = new Date(date)
	}
	var y = date.getFullYear(); //年
	var m = date.getMonth() + 1; //月
	var d = date.getDate(); //日
	if (m < 10) {
		m = "0" + m;
	}
	if (d < 10) {
		d = "0" + d;
	}

	return y + "-" + m + "-" + d;
}

//日期格式化，返回值形式为yy-mm-dd HH:mm
function timeFormatYMDHM(date) {
	if (!date) {
		date = new Date()
	}
	if (typeof (date) === "string") {
		date = date.replace(/-/g, '/');
		date = new Date(date)
	}
	var y = date.getFullYear(); //年
	var m = date.getMonth() + 1; //月
	var d = date.getDate(); //日
	var h = getHours(date); //时
	var mm = getMinutes(date); //分
	if (m < 10) {
		m = "0" + m;
	}
	if (d < 10) {
		d = "0" + d;
	}

	return y + "-" + m + "-" + d + " " + h + ":" + mm;
}
//日期格式化，返回值形式为yy-mm
function timeFormatYM(date) {
	if (!date) {
		date = new Date()
	}
	if (typeof (date) === "string") {
		date = new Date(date)
	}
	var y = date.getFullYear(); //年
	var m = date.getMonth() + 1; //月
	if (m < 10) {
		m = "0" + m;
	}

	return y + "-" + m;
}

//获取这周的周一
function getFirstDayOfWeek(date) {
	var weekday = date.getDay() || 7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
	date.setDate(date.getDate() - weekday + 1); //往前算（weekday-1）天，年份、月份会自动变化
	return timeFormat(date);
}

//获取当月第一天
function getFirstDayOfMonth(date) {
	date.setDate(1);
	return timeFormat(date);
}
// 获取当前月的最后一天
function getLastDayOfMonth(date) {
	var currentMonth = date.getMonth();
	var nextMonth = ++currentMonth;
	var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
	var oneDay = 1000 * 60 * 60 * 24;
	return timeFormat(new Date(nextMonthFirstDay - oneDay));
}

//获取当季第一天
function getFirstDayOfSeason(date) {
	var month = date.getMonth();
	if (month < 3) {
		date.setMonth(0);
	} else if (2 < month && month < 6) {
		date.setMonth(3);
	} else if (5 < month && month < 9) {
		date.setMonth(6);
	} else if (8 < month && month < 11) {
		date.setMonth(9);
	}
	date.setDate(1);
	return timeFormat(date);
}

//获取当年第一天
function getFirstDayOfYear(date) {
	date.setDate(1);
	date.setMonth(0);
	return timeFormat(date);
}
const getNowDate = function () {
	let date = new Date;
	let year = date.getFullYear(); //当前年份
	let month = date.getMonth() + 1; //当前的月份(0-11,0代表1月) 
	let days = date.getDate(); //当前的星期X(0-6,0代表星期天) 
	if (month < 10) {
		month = "0" + month;
	}
	if (days < 10) {
		days = "0" + days;
	}
	return year + "-" + month + "-" + days;
}

module.exports = {
	getStartTimePos,
	getTimeBucketLength,
	dateFormat,
	datetimeFormat,
	datetimeSFormat,
	dateSFormat,
	formatDateSToC,
	formatTimeSToC,
	yearMonthFormat,
	getFirstDayOfWeek,
	getFirstDayOfMonth,
	getLastDayOfMonth,
	getFirstDayOfSeason,
	getFirstDayOfYear,
	timeFormat,
	timeFormatYM,
	timeFormatYMDHM
}
