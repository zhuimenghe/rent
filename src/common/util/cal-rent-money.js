import addDays from 'date-fns/addDays';
import store from '@/store'
import format from 'date-fns/format';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import differenceInMonths from 'date-fns/differenceInMonths';
import subDays from 'date-fns/subDays';
import subMonths from 'date-fns/subMonths';
import addMonths from 'date-fns/addMonths';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import differenceInDays from 'date-fns/differenceInDays';
import getDaysInMonth from 'date-fns/getDaysInMonth';
const subMonthThree = function (bgDate) {
	let date = addDays(subMonths(bgDate, 3), 1)
	return format(date, 'yyyy-MM-dd')
}
const subDaysThrity = function (bgDate) {
	let date = addDays(subDays(bgDate, 8), 1)
	return format(date, 'yyyy-MM-dd')
}
const AddsubDays = function (bgDate, days) {
	let startdate = new Date(bgDate.replace(/-/g, "/").replace(/-/g, "/"));
	let date = addDays(startdate, days)
	return format(date, 'yyyy-MM-dd')
}
const getType = o => {
	return Object.prototype.toString.call(o).replace(/(\[object\s|\])/g, "");
};
const escapeDate = date => {
	if (getType(date) === "Date") {
		return dateFormat(date, "yyyy/MM/dd  HH:mm:ss");
	} else {
		return date.replace(/-/g, "/");
	}
};

/**
 * 计算租金相关内容(从新建审批单页面抽取为通用方法)
 * 注意：计算时间间隔时，包含起始时间当天
 * 如：beginDate: 2019-05-22 endDate: 2019-05-22 租赁为1天
 * 按自然月计算
 * beginDate: 2019-05-22 endDate: 2019-06-21 租赁为1月0天
 * @param settlementType
 * @param beginDate
 * @param endDate
 */
const calculateTotal = function (item) {
	let total = 0; //小计
	let dayText = '';
	// 首先判断日期是否合法
	let beginDate = null;
	let endDate = null;
	let settlementType = "";
	if (!item.settlementType ||
		!item.beginDate ||
		!item.endDate) {
		console.log("notNull")
		dayText = '--';
		console.log("Null")
	} else {
		console.log("notNull")
		settlementType = item.settlementType;
		let orderNum = Number(item.orderNum); //数量
		let hire = Number.parseFloat(item.hire); // 租金
		//格式化成函数需要的类型 new Date(年，月，日)
		let bs = item.beginDate.split("-");
		beginDate = new Date(bs[0], bs[1] - 1, bs[2])
		let es = item.endDate.split("-");
		endDate = new Date(es[0], es[1] - 1, es[2])

		endDate = addDays(endDate, 1); // 为了使计算结果包含结束日期当天
		let days = differenceInCalendarDays(endDate, beginDate);
		if (!(days >= 0)) {
			days = 0;
		}
		let surplusDay = 0;
		switch (settlementType) {
			case '1': // 按天
				total = days * hire * orderNum;
				dayText = days + '天';
				break;
			case '2': // 按月(30天)
				total = days / 30 * hire * orderNum;
				surplusDay = days % 30;
				dayText = Math.floor(days / 30) + '月' + surplusDay + '天';
				break;
			case '3': // 按自然月
				let surplusMonth3 = getSurplusMonth(beginDate, endDate);
				surplusDay = getSurplusDay(beginDate, endDate, surplusMonth3);
				total = (surplusMonth3 + surplusDay / 30) * hire * orderNum;
				dayText = surplusMonth3 + '月' + surplusDay + '天';
				break;
			case '4': // 按日租转月租
				let hireMonthly = parseFloat(item.hireMonthly); // （日租转月租）月租金
				/* 逻辑：1.租期小于一个月，比较日租金和月租金，若月租金比较少，应收为一个月的月租金；
				 2.租金大于1个月，按照月租金（自然月）计算；*/

				let surplusMonth4 = getSurplusMonth(beginDate, endDate);
				surplusDay = getSurplusDay(beginDate, endDate, surplusMonth4);

				if (surplusMonth4 < 1) {
					let totalDay = days * hire;
					total = totalDay > hireMonthly ? hireMonthly * orderNum : totalDay * orderNum;
				} else {
					total = (surplusMonth4 + surplusDay / 30) * hireMonthly * orderNum;
				}

				dayText = days + '天';
				break;
			case '5': // 按周
				total = days / 7 * hire * orderNum;
				surplusDay = days % 7;
				dayText = Math.floor(days / 7) + '周' + surplusDay + '天';
				break;
			default:
				break;
		}
	}
	item.tenancy = dayText;
	item.total = total > 0 ? Number(total).toFixed(2) : '0.00';
	return item;
}
const calculateTotalWithHMS = function (item) {
	let total = 0; //小计
	let dayText = '';
	// 首先判断日期是否合法
	let beginDate = null;
	let endDate = null;
	let settlementType = "";
	if (!item.settlementType ||
		!item.beginDate ||
		!item.endDate) {
		console.log("notNull")
		dayText = '--';
		console.log("Null")
	} else {
		console.log("notNull")
		settlementType = item.settlementType;
		let orderNum = Number(item.orderNum); //数量
		let hire = Number.parseFloat(item.hire); // 租金
		//格式化成函数需要的类型 new Date(年，月，日)
		let beginDatestr = item.beginDate.split(' ')[0];
		let endDatestr = item.endDate.split(' ')[0];
		let bs = beginDatestr.split("-");
		beginDate = new Date(bs[0], bs[1] - 1, bs[2])
		let es = endDatestr.split("-");
		endDate = new Date(es[0], es[1] - 1, es[2])

		endDate = addDays(endDate, 1); // 为了使计算结果包含结束日期当天
		let days = differenceInCalendarDays(endDate, beginDate);
		if (!(days >= 0)) {
			days = 0;
		}
		let surplusDay = 0;
		switch (settlementType) {
			case '1': // 按天
				total = days * hire * orderNum;
				dayText = days + '天';
				break;
			case '2': // 按月(30天)
				total = days / 30 * hire * orderNum;
				surplusDay = days % 30;
				dayText = Math.floor(days / 30) + '月' + surplusDay + '天';
				break;
			case '3': // 按自然月
				let surplusMonth3 = getSurplusMonth(beginDate, endDate);
				surplusDay = getSurplusDay(beginDate, endDate, surplusMonth3);
				total = (surplusMonth3 + surplusDay / 30) * hire * orderNum;
				dayText = surplusMonth3 + '月' + surplusDay + '天';
				break;
			case '4': // 按日租转月租
				let hireMonthly = parseFloat(item.hireMonthly); // （日租转月租）月租金
				/* 逻辑：1.租期小于一个月，比较日租金和月租金，若月租金比较少，应收为一个月的月租金；
				 2.租金大于1个月，按照月租金（自然月）计算；*/
				let surplusMonth4 = getSurplusMonth(beginDate, endDate);
				surplusDay = getSurplusDay(beginDate, endDate, surplusMonth4);
				if (surplusMonth4 < 1) {
					let totalDay = days * hire;
					total = totalDay > hireMonthly ? hireMonthly * orderNum : totalDay * orderNum;
				} else {
					total = (surplusMonth4 + surplusDay / 30) * hireMonthly * orderNum;
				}
				dayText = days + '天';
				break;
			case '5': // 按周
				total = days / 7 * hire * orderNum;
				surplusDay = days % 7;
				dayText = Math.floor(days / 7) + '周' + surplusDay + '天';
				break;
			default:
				break;
		}
	}
	item.tenancy = dayText;
	item.total = total > 0 ? Number(total).toFixed(2) : '0.00';
	return item;
}
const calculateTotalNew = function (item) {
	let total = 0; //小计
	let dayText = '';
	// 首先判断日期是否合法
	let beginDate = null;
	let endDate = null;
	let settlementType = "";
	if (!item.settlementType ||
		!item.beginDate) {
		dayText = '--';
		return {
			...item,
			tenancy: '--',
			total: 0
		}
	} else {
		settlementType = item.settlementType;
		let orderNum = Number(item.orderNum); //数量
		let hire = Number.parseFloat(item.hire); // 租金
		//格式化成函数需要的类型 new Date(年，月，日)
		let bs = item.beginDate.split(' ')[0].split("-");
		beginDate = new Date(bs[0], bs[1] - 1, bs[2])
		switch (settlementType) {
			case '1': // 按天
				if (item.surplusDay && Number.parseInt(item.surplusDay) > 0) {
					total = Number.parseInt(item.surplusDay) * hire * orderNum;
					dayText = item.surplusDay + '天';
					endDate = format(subDays(addDays(beginDate, Number.parseInt(item.surplusDay)), 1),
						'yyyy-MM-dd');
				} else {
					dayText = '--'
				}

				break;
			case '2': // 按月(30天)
				// if ((item.whole && Number.parseInt(item.whole) > 0) || (item.surplusDay && Number.parseInt(item
				// 	.surplusDay) > 0)) {
				// 	let wd = (item.whole ? Number.parseInt(item.whole) : 0) * 30 + (item.surplusDay ? Number
				// 		.parseInt(item.surplusDay) :
				// 		0);
				// 	endDate = format(subDays(addDays(beginDate, wd), 1), 'yyyy-MM-dd')

				// }

				if (item.surplusDay) {
					total = Number.parseInt(item.surplusDay) * item.hire / 30 * orderNum;
					dayText = item.surplusDay + '天'
				} else {
					dayText = '--'
				}
				break;
			case '3': // 按自然月
				if ((item.whole && Number.parseInt(item.whole) > 0) || (item.surplusDay && Number.parseInt(item
					.surplusDay) > 0)) {
					endDate = addMonths(beginDate, item.whole ? Number.parseInt(item.whole) : 0);
					endDate = addDays(endDate, item.surplusDay ? Number.parseInt(item.surplusDay) : 0);
					endDate = subDays(endDate, 1);
					endDate = format(endDate, 'yyyy-MM-dd');
				}
				if (endDate) {
					dayText = (item.whole ? item.whole : '0') + '月' + (item.surplusDay ? item.surplusDay : '0') +
						'天';
					total = ((item.whole ? Number.parseInt(item.whole) : 0) + (item.surplusDay ? Number.parseInt(
						item.surplusDay) : 0) /
						30) * hire * orderNum;
				} else {
					dayText = '--'
				}

				break;
			case '4': // 按日租转月租
				if (item.surplusDay && Number.parseInt(item.surplusDay) > 0) {
					let hireMonthly = parseFloat(item.hireMonthly); // （日租转月租）月租金
					/* 逻辑：1.租期小于一个月，比较日租金和月租金，若月租金比较少，应收为一个月的月租金；
					 2.租金大于1个月，按照月租金（自然月）计算；*/

					endDate = subDays(addDays(beginDate, Number.parseInt(item.surplusDay)), 1); //最后日期需减1，因为包括开始时间

					let month = getSurplusMonth(beginDate, addDays(endDate, 1)); //计算自然月的时候，需要将减后的一天加上
					let day = getSurplusDay(beginDate, addDays(endDate, 1), month);

					if (month < 1) {
						let totalDay = Number.parseInt(item.surplusDay) * hire;
						total = totalDay > hireMonthly ? hireMonthly * orderNum : totalDay * orderNum;
					} else {
						total = (month + day / 30) * hireMonthly * orderNum;
					}

					// if (month < 1) {
					// 	let totalDay = Number.parseInt(item.surplusDay) * hire;
					// 	total = totalDay > hireMonthly ? hireMonthly * orderNum : totalDay * orderNum;
					// } else {
					// 	total = Number.parseInt(item.surplusDay) / 30 * hireMonthly * orderNum;
					// }

					endDate = format(endDate, 'yyyy-MM-dd')
					dayText = item.surplusDay + '天';


				} else {
					dayText = '--';
				}
				break;
			case '5': // 按周
				if ((item.whole && Number.parseInt(item.whole) > 0) || (item.surplusDay && Number.parseInt(item
					.surplusDay) > 0)) {
					let wd = (item.whole ? Number.parseInt(item.whole) : 0) * 7 + (item.surplusDay ? Number
						.parseInt(item.surplusDay) :
						0);
					endDate = format(subDays(addDays(beginDate, wd), 1), 'yyyy-MM-dd')

				}
				if (endDate) {
					dayText = (item.whole ? item.whole : '0') + '周' + (item.surplusDay ? item.surplusDay : '0') +
						'天';
					total = ((item.whole ? Number.parseInt(item.whole) : 0) + (item.surplusDay ? Number.parseInt(
						item.surplusDay) :
						0) / 7) * hire * orderNum;
				} else {
					dayText = '--'
				}

				break;
			case '6': // 月租(月份)
				if (item.surplusDay && Number.parseInt(item.surplusDay) > 0) {
					endDate = format(subDays(addDays(beginDate, Number.parseInt(item.surplusDay)), 1),
						'yyyy-MM-dd');
					let hireMonthly1 = parseFloat(item.hireMonthly); // 月租金
					/* 逻辑：月租(月份)" 租赁方式 为  “a天 + n个整自然月份 + b天*/
					let beginDay = startOfDay(beginDate);
					// 计算结束时间
					let endDay = endOfDay(subDays(addDays(beginDate, Number.parseInt(item.surplusDay)), 1));
					//开始时间的月初时间
					let monthStartDay = startOfMonth(beginDay);
					//结束时间的月末时间
					let monthLastDay = endOfMonth(endDay);
					//是否月初 月末
					let isStart = beginDay.getTime() == monthStartDay.getTime();
					let isEnd = endDay.getTime() == monthLastDay.getTime();
					//相差月份
					let months = differenceInMonths(monthLastDay, monthStartDay);
					let day = 0;

					//月份小于等于0 如果占到月初跟月末 月份等于1
					// 根据是否月初月末 计算距离天数
					if (months <= 0) {
						months = isStart && isEnd ? 1 : 0;
						day =
							(isStart && isEnd) ?
								0 :
								differenceInDays(
									new Date(endDay),
									subDays(new Date(beginDay), 1)
								);
					} else {
						// 如果是月初月末  月份加1
						if (isStart && isEnd) {
							months = months + 1;
						} else {
							if (!isStart && !isEnd) {
								months = months - 1;
							}
							day = !isStart ?
								differenceInDays(endOfMonth(beginDay), beginDay) + 1 :
								day;
							day = !isEnd ?
								day + differenceInDays(endDay, startOfMonth(endDay)) + 1 :
								day;
						}
					}
					total = (months * hireMonthly1 + day * hire) * orderNum;
					dayText = item.surplusDay + '天';

				} else {
					dayText = '--'
				}
				break;
			default:
				break;
		}
	}
	total = total + (Number.parseFloat(item.pledge ? item.pledge : 0) + Number.parseFloat(item.carriage ? item
		.carriage :
		0)) * (item.orderNum ? item.orderNum : 0);
	item.tenancy = dayText;
	item.total = total > 0 ? Number(total).toFixed(2) : '0.00';
	return item;
}
const calculateTotalSelf = function (item, monthConfig) {
	let total = 0; //小计
	let dayText = '';
	// 首先判断日期是否合法
	let beginDate = null;
	let endDate = null;
	let settlementType = "";
	if (!item.settlementType ||
		!item.beginDate) {
		// console.log("notNull")
		dayText = '--';
		// console.log("Null")
		return {
			...item,
			tenancy: '--',
			total: 0
		}
	} else {
		settlementType = item.settlementType;
		let orderNum = Number(item.orderNum); //数量
		if (Number(item.hire) == 0 && Number(item.hireMonthly) == 0) return 0;

		let hire = Number.parseFloat(item.hire); // 租金
		//格式化成函数需要的类型 new Date(年，月，日)
		let bs;
		if (item.beginDate) {
			bs = item.beginDate.split(' ')[0].split("-");
			beginDate = new Date(bs[0], bs[1] - 1, bs[2]);
		}
		switch (settlementType) {
			case '1': // 按天
				if (item.surplusDay && Number.parseInt(item.surplusDay) > 0) {
					total = Number.parseInt(item.surplusDay) * hire * orderNum;
					dayText = item.surplusDay + '天';
					endDate = format(subDays(addDays(beginDate, Number.parseInt(item.surplusDay)), 1),
						'yyyy-MM-dd');
				} else {
					dayText = '--'
				}
				break;
			case '2': // 按月(30天)
				let es;
				if (item.endDate) {
					es = item.endDate.split(' ')[0].split("-");
					endDate = new Date(es[0], es[1] - 1, es[2]);
				}
				let surplusMonth = getSurplusMonth(beginDate, endDate);
				let surplusDay = getSurplusDay(beginDate, endDate, surplusMonth) + 1;
				if (monthConfig == '30') {
					if (item.surplusDay) {
						total = Number.parseInt(item.surplusDay) * item.hire / 30 * orderNum;
						dayText = item.surplusDay + '天'
					} else {
						dayText = '--';
					}
				} else {
					//自然月
					let endDate;
					if (item.endDate) {
						let es = item.endDate.split(' ')[0].split("-");
						endDate = new Date(es[0], es[1] - 1, es[2]);
						endDate = addDays(endDate, 1)
					}
					let surplusMonth = getSurplusMonth(beginDate, endDate);
					let surplusDay = getSurplusDay(beginDate, endDate, surplusMonth);
					let last =
						surplusMonth > 0 ? addMonths(beginDate, surplusMonth) : beginDate;
					// let daysInMonth = getDaysInMonth(last);
					if ((item.whole && Number.parseInt(item.whole) > 0) || (item.surplusDay && Number.parseInt(item
						.surplusDay) > 0)) {
						endDate = addMonths(beginDate, item.whole ? Number.parseInt(item.whole) : 0);
						endDate = addDays(endDate, item.surplusDay ? Number.parseInt(item.surplusDay) : 0);
						// endDate = subDays(endDate, 1);
						endDate = format(endDate, 'yyyy-MM-dd');
					}
					if (endDate) {
						dayText = (item.whole ? item.whole : '0') + '月' + (item.surplusDay ? item.surplusDay : '0') +
							'天';
						total = orderNum * ((surplusMonth * item.hire) + (item.hire / 30) * surplusDay)
					} else {
						dayText = '--'
					}
					if (item.surplusDay === '0' || item.surplusDay === null || item.surplusDay === undefined || item.surplusDay === '') {
						total = 0;
					};
				}
				break;
			case '3': {
				// 按月(30天)
				let es
				if (item.endDate) {
					es = item.endDate.split(' ')[0].split("-");
					endDate = new Date(es[0], es[1] - 1, es[2])
				}
				let surplusMonth = getSurplusMonth(beginDate, endDate);
				let surplusDay = getSurplusDay(beginDate, endDate, surplusMonth) + 1;
				if (monthConfig == '30') {
					if (item.surplusDay) {
						total = Number.parseInt(item.surplusDay) * item.hire / 30 * orderNum;
						dayText = item.surplusDay + '天'
					} else {
						dayText = '--';
					}
				} else {
					//自然月
					let endDate;
					if (item.endDate) {
						let es = item.endDate.split(' ')[0].split("-");
						endDate = new Date(es[0], es[1] - 1, es[2]);
						endDate = addDays(endDate, 1)
					}
					let surplusMonth = getSurplusMonth(beginDate, endDate);
					let surplusDay = getSurplusDay(beginDate, endDate, surplusMonth);
					let last =
						surplusMonth > 0 ? addMonths(beginDate, surplusMonth) : beginDate;
					// let daysInMonth = getDaysInMonth(last);
					if ((item.whole && Number.parseInt(item.whole) > 0) || (item.surplusDay && Number.parseInt(item
						.surplusDay) > 0)) {
						endDate = addMonths(beginDate, item.whole ? Number.parseInt(item.whole) : 0);
						endDate = addDays(endDate, item.surplusDay ? Number.parseInt(item.surplusDay) : 0);
						// endDate = subDays(endDate, 1);
						endDate = format(endDate, 'yyyy-MM-dd');
					}
					if (endDate) {
						dayText = (item.whole ? item.whole : '0') + '月' + (item.surplusDay ? item.surplusDay : '0') +
							'天';
						total = orderNum * ((surplusMonth * item.hire) + (item.hire / 30) * surplusDay)
					} else {
						dayText = '--'
					}
					if (item.surplusDay === '0' || item.surplusDay === null || item.surplusDay === undefined || item.surplusDay === '') {
						total = 0;
					};
				}
			}
				break
			case '4': // 按日租转月租
				endDate = subDays(addDays(beginDate, Number.parseInt(item.surplusDay)), 1); //最后日期需减1，因为包括开始时间
				let month = getSurplusMonth(beginDate, addDays(endDate, 1)); //计算自然月的时候，需要将减后的一天加上
				let day = getSurplusDay(beginDate, addDays(endDate, 1), month);
				if (monthConfig == '30') {
					let month = parseInt(Math.floor(item.surplusDay / 30)) || 0;
					let days = parseInt(item.surplusDay % 30);
					total = days * item.hire;
					if (month < 1) {
						total = total > item.hireMonthly
							? orderNum * (item.hireMonthly)
							: orderNum * (total + item.hireMonthly * (month));
					} else {
						total = orderNum * (item.hireMonthly * (month) + item.hireMonthly / 30 * days)
					}

				} else {
					//自然月
					if (item.surplusDay && Number.parseInt(item.surplusDay) > 0) {
						let hireMonthly = parseFloat(item.hireMonthly); // （日租转月租）月租金
						/* 逻辑：1.租期小于一个月，比较日租金和月租金，若月租金比较少，应收为一个月的月租金；
						 2.租金大于1个月，按照月租金（自然月）计算；*/

						endDate = subDays(addDays(beginDate, Number.parseInt(item.surplusDay)), 1); //最后日期需减1，因为包括开始时间

						let month = getSurplusMonth(beginDate, addDays(endDate, 1)); //计算自然月的时候，需要将减后的一天加上
						let day = getSurplusDay(beginDate, addDays(endDate, 1), month);

						if (month < 1) {
							let totalDay = Number.parseInt(item.surplusDay) * hire;
							total = totalDay > hireMonthly ? hireMonthly * orderNum : totalDay * orderNum;
						} else {
							total = (month + day / 30) * hireMonthly * orderNum;
						}

						endDate = format(endDate, 'yyyy-MM-dd')
						dayText = item.surplusDay + '天';
					} else {
						dayText = '--';
					}
				}

				break;

			default:
				break;
		}
	}
	total = total + (Number.parseFloat(item.pledge ? item.pledge : 0) + Number.parseFloat(item.carriage ? item
		.carriage :
		0)) * (item.orderNum ? item.orderNum : 0);
	item.tenancy = dayText;
	item.total = total > 0 ? Number(total).toFixed(2) : '0.00';
	return item;
}

const getTenancys = function (item) {
	let total = 0; //小计
	let dayText = '';
	// 首先判断日期是否合法
	let beginDate = null;
	let endDate = null;
	let whole = null
	let sd = null
	let settlementType = "";
	if (!item.settlementType ||
		!item.beginDate ||
		!item.endDate) {
		dayText = '--';
		let param = {
			whole: '',
			surplusDay: '',
			total: '0',
		}
		return param
	} else {
		settlementType = item.settlementType;
		let orderNum = Number(item.orderNum); //数量
		let hire = Number.parseFloat(item.hire); // 租金
		//格式化成函数需要的类型 new Date(年，月，日)
		let bs = item.beginDate.split(' ')[0].split("-");
		beginDate = new Date(bs[0], bs[1] - 1, bs[2])
		let es = item.endDate.split(' ')[0].split("-");
		endDate = new Date(es[0], es[1] - 1, es[2])

		endDate = addDays(endDate, 1); // 为了使计算结果包含结束日期当天
		let days = differenceInCalendarDays(endDate, beginDate);
		if (!(days >= 0)) {
			days = 0;
		}
		let surplusDay = 0;
		switch (settlementType) {
			case '1': // 按天
				dayText = days + '天';
				sd = days;
				break;
			case '2': // 按月(30天)
				total = days / 30 * hire * orderNum;
				surplusDay = days % 30;
				dayText = Math.floor(days / 30) + '月' + surplusDay + '天';

				whole = Math.floor(days / 30)
				sd = surplusDay;
				break;
			case '3': // 按自然月
				let surplusMonth3 = getSurplusMonth(beginDate, endDate);
				surplusDay = getSurplusDay(beginDate, endDate, surplusMonth3);
				total = (surplusMonth3 + surplusDay / 30) * hire * orderNum;
				dayText = surplusMonth3 + '月' + surplusDay + '天';
				whole = surplusMonth3
				sd = surplusDay;
				break;
			case '4': // 按日租转月租
				let hireMonthly = parseFloat(item.hireMonthly); // （日租转月租）月租金
				/* 逻辑：1.租期小于一个月，比较日租金和月租金，若月租金比较少，应收为一个月的月租金；
				 2.租金大于1个月，按照月租金（自然月）计算；*/

				let surplusMonth4 = getSurplusMonth(beginDate, endDate);
				surplusDay = getSurplusDay(beginDate, endDate, surplusMonth4);

				if (surplusMonth4 < 1) {
					let totalDay = days * hire;
					total = totalDay > hireMonthly ? hireMonthly * orderNum : totalDay * orderNum;
				} else {
					total = (surplusMonth4 + surplusDay / 30) * hireMonthly * orderNum;
				}
				dayText = days + '天';
				sd = days;
				break;
			case '5': // 按周
				total = days / 7 * hire * orderNum;
				surplusDay = days % 7;
				dayText = Math.floor(days / 7) + '周' + surplusDay + '天';
				whole = Math.floor(days / 7)
				sd = surplusDay;
				break;
			case '6': // 月租(月份)
				let hireMonthly1 = parseFloat(item.hireMonthly); // （月租金
				let hire = parseFloat(item.hire); // （日租金
				/* 逻辑：月租(月份)" 租赁方式 为  “a天 + n个整自然月份 + b天*/


				let beginDay = startOfDay(beginDate);

				// 先把前面加上的一天去掉的
				let endDay = endOfDay(new Date(subDays(endDate, 1)));
				console.log(endDay)

				//开始时间的月初时间
				let monthStartDay = startOfMonth(beginDay);

				//结束时间的月末时间
				let monthLastDay = endOfMonth(endDay);

				//是否月初 月末
				let isStart = beginDay.getTime() == monthStartDay.getTime();
				let isEnd = endDay.getTime() == monthLastDay.getTime();

				//相差月份
				let months = differenceInMonths(monthLastDay, monthStartDay);

				let day = 0;

				//月份小于等于0 如果占到月初跟月末 月份等于1
				// 根据是否月初月末 计算距离天数
				if (months <= 0) {
					months = isStart && isEnd ? 1 : 0;
					day =
						isStart && isEnd ?
							0 :
							differenceInDays(
								new Date(endDay),
								subDays(new Date(beginDay), 1)
							);
				} else {
					// 如果是月初月末  月份加1
					if (isStart && isEnd) {
						months = months + 1;
					} else {
						if (!isStart && !isEnd) {
							months = months - 1;
						}
						day = !isStart ?
							differenceInDays(endOfMonth(beginDay), beginDay) + 1 :
							day;
						day = !isEnd ?
							day + differenceInDays(endDay, startOfMonth(endDay)) + 1 :
							day;
					}
				}

				total = (months * hireMonthly1 + day * hire) * orderNum;
				sd = days;
				dayText = days + '天';
				break;
			default:
				break;
		}
		item.whole = whole ? whole : '0';
		item.surplusDay = sd ? sd : '0';
		console.log(JSON.stringify(item));
		return item;
	}
}

/**
 * 计算两个日期相差的月份
 * @param beginDate
 * @param endDate
 * @returns {any}
 */
function getSurplusMonth(beginDate, endDate) {
	let surplusMonth = differenceInMonths(endDate, beginDate);
	if (isNaN(surplusMonth) || surplusMonth < 0) {
		surplusMonth = 0;
	}
	return surplusMonth;
}

/**
 * 计算两个日期相差的天数
 * @param {Object} beginDate
 * @param {Object} endDate
 */
function getDaysOfDiffer(beginDate, endDate) {

	//格式化成函数需要的类型 new Date(年，月，日)
	let bs = beginDate.split("-");
	beginDate = new Date(bs[0], bs[1] - 1, bs[2])
	let es = endDate.split("-");
	endDate = new Date(es[0], es[1] - 1, es[2])

	endDate = addDays(endDate, 1); // 为了使计算结果包含结束日期当天
	let days = differenceInCalendarDays(endDate, beginDate);
	if (!(days >= 0)) {
		days = 0;
	}
	return days;
}

/**
 * 计算两个日期相差的几个整月外的天数
 * @param beginDate
 * @param endDate
 * @param surplusMonth
 * @returns {number}
 */
function getSurplusDay(beginDate, endDate, surplusMonth) {
	let surplusDay = 0;
	// 将起始时间加上surplusMonth，计算间隔的天数
	let date = addMonths(beginDate, surplusMonth);
	surplusDay = differenceInCalendarDays(endDate, date);
	if (isNaN(surplusDay)) {
		surplusDay = 0;
	} else if (surplusDay < 0) {
		surplusDay = getDaysInMonth(beginDate) + surplusDay;
	}
	if (endDate == null || beginDate == null) {
		surplusDay = 0;
	}
	return surplusDay;
}

const calculateDays = function (beginDate, endDate, settlementType) {
	let total = 0; //小计
	let dayText = '';
	if (!beginDate || !endDate || !settlementType) {
		dayText = '--';
	} else {
		//格式化成函数需要的类型 new Date(年，月，日)
		let bs = beginDate.split("-");
		beginDate = new Date(bs[0], bs[1] - 1, bs[2])
		let es = endDate.split("-");
		endDate = new Date(es[0], es[1] - 1, es[2])
		endDate = addDays(endDate, 1); // 为了使计算结果包含结束日期当天
		let days = differenceInCalendarDays(endDate, beginDate);
		if (!(days >= 0)) {
			days = 0;
		}
		let surplusDay = 0;
		switch (settlementType) {
			case '3': // 按自然月
				let surplusMonth3 = getSurplusMonth(beginDate, endDate);
				surplusDay = getSurplusDay(beginDate, endDate, surplusMonth3);
				dayText = surplusMonth3 + '月' + surplusDay + '天';
				break;
			case '1': // 按天
			case '4': // 按日租转月租
			case '6': // 月租(月份)
			default:
				dayText = days + '天';
				break;
		}
	}
	return dayText;
}

//这里假设我们即不知道输入数字的整数位数，也不知道小数位数
/*将100000转为100,000.00形式*/
const dealNumber = function (money) {
	// 检查是否包含非数值字符，如 '*'
	if (money && money.toString().indexOf("*") !== -1) {
		return money;
	}

	// 解析金额为数值并格式化
	if (money && Number.parseFloat(money) !== 0) {
		money = Number.parseFloat(money).toFixed(2); // 格式化为两位小数
		let [left, right] = money.split('.'); // 分割整数和小数部分

		// 处理小数部分：如果小数两位都是0，则忽略小数部分
		if (right === "00") {
			right = '';
		} else {
			right = '.' + right; // 保留小数点和小数部分
		}

		// // 对整数部分进行每三位逗号分隔
		// const temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
		// return (Number.parseFloat(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
		// 直接返回整数部分和小数部分，不进行千分位处理
		return (Number.parseFloat(money) < 0 ? "" : "") + left + right;
	} else {
		return '0';
	}
};
//这里假设我们即不知道输入数字的整数位数，也不知道小数位数
/*将100000转为100,000.00形式*/
const dealNumberNoZero = function (money) {
	// 检查是否包含非数值字符，如 '*'
	if (money && money.toString().indexOf("*") !== -1) {
		return money;
	}

	// 解析金额为数值并格式化
	if (money && Number.parseFloat(money) !== 0) {
		money = Number.parseFloat(money).toFixed(2); // 格式化为两位小数
		let [left, right] = money.split('.'); // 分割整数和小数部分

		// 处理小数部分：如果小数两位都是0，则忽略小数部分
		if (right === "00") {
			right = '';
		} else {
			right = '.' + right; // 保留小数点和小数部分
		}

		// // 对整数部分进行每三位逗号分隔
		// const temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
		// return (Number.parseFloat(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
		// 直接返回整数部分和小数部分，不进行千分位处理
		return (Number.parseFloat(money) < 0 ? "" : "") + left + right;
	} else {
		return '0';
	}
};
/*将100,000.00转为100000形式*/
const undoNubmer = function (money) {
	if (money && money != null) {
		money = String(money);
		var group = money.split('.');
		var left = group[0].split(',').join('');
		return Number(left + "." + group[1]);
	} else {
		return "";
	}
}
const getCheckMoney = function (val) {
	if (!val) {
		return '';
	}
	let value = '';
	if (val.indexOf(".") != -1) {
		var dotIndex = val.indexOf(".");
		if (val.length - 1 - dotIndex > 2) {
			value = val.substr(0, dotIndex + 2 + 1);
		}
	}
	if (val.indexOf(".") == 0) {
		value = "0" + val;
	}

	//限制0后面非。输入
	if (val.substring(0, 1) == "0" && val.length > 1 && val.substring(1, 2) != ".") {
		value = val.substring(0, 1);
	}

	return value ? value : val;
}
const getTenancysWithSmple = function (item) {
	let total = 0; //小计
	let dayText = '';
	// 首先判断日期是否合法
	let beginDate = null;
	let endDate = null;
	let whole = null
	let sd = null
	let settlementType = "";
	if (!item.settlementType || !item.beginDate || !item.endDate) {
		let param = {
			whole: '',
			surplusDay: '',
			total: '0',
		}
		return param
	} else {
		settlementType = item.settlementType;
		let orderNum = 1; //数量
		let hire = Number.parseFloat(item.hire); // 租金
		let bs = item.beginDate.split(' ')[0].split("-");
		beginDate = new Date(bs[0], bs[1] - 1, bs[2])
		let es = item.endDate.split(' ')[0].split("-");
		endDate = new Date(es[0], es[1] - 1, es[2])
		endDate = addDays(endDate, 1); // 为了使计算结果包含结束日期当天
		let days = differenceInCalendarDays(endDate, beginDate);
		if (!(days >= 0)) {
			days = 0;
		}
		let surplusDay = 0;
		switch (settlementType) {
			case '1': // 按天
				dayText = days + '天';
				sd = days;
				break;
			case '2': // 按月(30天)
				total = days / 30 * hire * orderNum;
				surplusDay = days % 30;
				dayText = Math.floor(days / 30) + '月' + surplusDay + '天';

				whole = Math.floor(days / 30)
				sd = surplusDay;
				break;
			case '3': // 按自然月
				let surplusMonth3 = getSurplusMonth(beginDate, endDate);
				surplusDay = getSurplusDay(beginDate, endDate, surplusMonth3);
				total = (surplusMonth3 + surplusDay / 30) * hire * orderNum;
				dayText = surplusMonth3 + '月' + surplusDay + '天';
				whole = surplusMonth3
				sd = surplusDay;
				break;
			case '4': // 按日租转月租
				let hireMonthly = parseFloat(item.hireMonthly); // （日租转月租）月租金
				/* 逻辑：1.租期小于一个月，比较日租金和月租金，若月租金比较少，应收为一个月的月租金；
				 2.租金大于1个月，按照月租金（自然月）计算；*/

				let surplusMonth4 = getSurplusMonth(beginDate, endDate);
				surplusDay = getSurplusDay(beginDate, endDate, surplusMonth4);

				if (surplusMonth4 < 1) {
					let totalDay = days * hire;
					total = totalDay > hireMonthly ? hireMonthly * orderNum : totalDay * orderNum;
				} else {
					total = (surplusMonth4 + surplusDay / 30) * hireMonthly * orderNum;
				}
				dayText = days + '天';
				sd = days;
				break;
			case '5': // 按周
				total = days / 7 * hire * orderNum;
				surplusDay = days % 7;
				dayText = Math.floor(days / 7) + '周' + surplusDay + '天';
				whole = Math.floor(days / 7)
				sd = surplusDay;
				break;
			case '6': // 月租(月份)
				let hireMonthly1 = parseFloat(item.hireMonthly); // （月租金
				let hire = parseFloat(item.hire); // （日租金
				/* 逻辑：月租(月份)" 租赁方式 为  “a天 + n个整自然月份 + b天*/


				let beginDay = startOfDay(beginDate);

				// 先把前面加上的一天去掉的
				let endDay = endOfDay(new Date(subDays(endDate, 1)));
				console.log(endDay)

				//开始时间的月初时间
				let monthStartDay = startOfMonth(beginDay);

				//结束时间的月末时间
				let monthLastDay = endOfMonth(endDay);

				//是否月初 月末
				let isStart = beginDay.getTime() == monthStartDay.getTime();
				let isEnd = endDay.getTime() == monthLastDay.getTime();

				//相差月份
				let months = differenceInMonths(monthLastDay, monthStartDay);

				let day = 0;

				//月份小于等于0 如果占到月初跟月末 月份等于1
				// 根据是否月初月末 计算距离天数
				if (months <= 0) {
					months = isStart && isEnd ? 1 : 0;
					day =
						isStart && isEnd ?
							0 :
							differenceInDays(
								new Date(endDay),
								subDays(new Date(beginDay), 1)
							);
				} else {
					// 如果是月初月末  月份加1
					if (isStart && isEnd) {
						months = months + 1;
					} else {
						if (!isStart && !isEnd) {
							months = months - 1;
						}
						day = !isStart ?
							differenceInDays(endOfMonth(beginDay), beginDay) + 1 :
							day;
						day = !isEnd ?
							day + differenceInDays(endDay, startOfMonth(endDay)) + 1 :
							day;
					}
				}

				total = (months * hireMonthly1 + day * hire) * orderNum;
				sd = days;
				dayText = days + '天';
				break;
			default:
				break;
		}
		let param = {
			whole: whole ? whole : '0',
			surplusDay: sd ? sd : '0',
			total: total ? total : '0',
		}
		return param;
	}
}
const calculateTotalWithSmple = function (item) {
	let total = 0; //小计
	let dayText = '';
	// 首先判断日期是否合法
	let beginDate = "";
	let endDate = "";
	let settlementType = "";
	let orderNum = 1; //数量
	let hire = item.hire && item.hire != "" ? Number.parseFloat(item.hire) : 0; // 租金
	let hireMonthly = item.hireMonthly && item.hireMonthly != "" ? Number.parseFloat(item.hireMonthly) : 0; // 租金
	let pledge = item.pledge && item.pledge != "" ? Number.parseFloat(item.pledge) : 0; // 押金
	let carriage = item.carriage && item.carriage != "" ? Number.parseFloat(item.carriage) : 0; // 运费
	let surplusDay = item.surplusDay && item.surplusDay != "" ? Number.parseFloat(item.surplusDay) : 0; //日
	let whole = item.whole && item.whole != "" ? Number.parseFloat(item.whole) : 0; //日
	if (!item.settlementType || !item.beginDate) {
		let param = {
			tenancy: "",
			endDate: "",
			totoal: "0.00"
		}
		return param
	} else {
		settlementType = item.settlementType;
		//格式化成函数需要的类型 new Date(年，月，日)
		let bs = item.beginDate.split(' ')[0].split("-");
		beginDate = new Date(bs[0], bs[1] - 1, bs[2])
		switch (settlementType) {
			case '1': // 按天
				if (surplusDay > 0) {
					total = surplusDay * hire * orderNum;
					dayText = item.surplusDay + '天';
					endDate = format(subDays(addDays(beginDate, surplusDay), 1), 'yyyy-MM-dd');
				} else {
					dayText = ''
				}
				break;
			case '2': // 按月(30天)
				if (whole > 0 || surplusDay > 0) {
					let wd = whole * 30 + surplusDay;
					endDate = format(subDays(addDays(beginDate, wd), 1), 'yyyy-MM-dd')

				}
				if (endDate) {
					dayText = whole.toString() + '月' + surplusDay.toString() + '天';
					total = (whole + surplusDay / 30) * hire * orderNum;
				} else {
					dayText = ''
				}
				break;
			case '3': // 按自然月
				if (whole > 0 || surplusDay > 0) {
					endDate = addMonths(beginDate, whole);
					endDate = addDays(endDate, surplusDay);
					endDate = subDays(endDate, 1);
					endDate = format(endDate, 'yyyy-MM-dd');
				}
				if (endDate) {
					dayText = whole.toString() + '月' + surplusDay.toString() + '天';
					total = (whole + surplusDay / 30) * hire * orderNum;
				} else {
					dayText = ''
				}
				break;
			case '4': // 按日租转月租
				if (surplusDay > 0) {
					/* 逻辑：1.租期小于一个月，比较日租金和月租金，若月租金比较少，应收为一个月的月租金；
					 2.租金大于1个月，按照月租金（自然月）计算；*/
					endDate = subDays(addDays(beginDate, surplusDay), 1); //最后日期需减1，因为包括开始时间
					let month = getSurplusMonth(beginDate, addDays(endDate, 1)); //计算自然月的时候，需要将减后的一天加上
					let day = getSurplusDay(beginDate, addDays(endDate, 1), month);
					if (month < 1) {
						let totalDay = surplusDay * hire;
						total = totalDay > hireMonthly ? hireMonthly * orderNum : totalDay * orderNum;
					} else {
						total = (month + day / 30) * hireMonthly * orderNum;
					}
					endDate = format(endDate, 'yyyy-MM-dd')
					dayText = item.surplusDay + '天';
				} else {
					dayText = '';
				}
				break;
			case '5': // 按周
				if (whole > 0 || surplusDay > 0) {
					let wd = whole * 7 + surplusDay;
					endDate = format(subDays(addDays(beginDate, wd), 1), 'yyyy-MM-dd')
				}
				if (endDate) {
					dayText = whole.toString() + '周' + surplusDay.toString() + '天';
					total = (whole + surplusDay / 7) * hire * orderNum;
				} else {
					dayText = ''
				}

				break;
			case '6': // 月租(月份)
				if (surplusDay > 0) {
					endDate = format(subDays(addDays(beginDate, surplusDay), 1), 'yyyy-MM-dd');
					/* 逻辑：月租(月份)" 租赁方式 为  “a天 + n个整自然月份 + b天*/
					let beginDay = startOfDay(beginDate);
					// 计算结束时间
					let endDay = endOfDay(subDays(addDays(beginDate, surplusDay), 1));
					//开始时间的月初时间
					let monthStartDay = startOfMonth(beginDay);
					//结束时间的月末时间
					let monthLastDay = endOfMonth(endDay);
					//是否月初 月末
					let isStart = beginDay.getTime() == monthStartDay.getTime();
					let isEnd = endDay.getTime() == monthLastDay.getTime();
					//相差月份
					let months = differenceInMonths(monthLastDay, monthStartDay);
					let day = 0;
					//月份小于等于0 如果占到月初跟月末 月份等于1
					// 根据是否月初月末 计算距离天数
					if (months <= 0) {
						months = isStart && isEnd ? 1 : 0;
						day = (isStart && isEnd) ? 0 : differenceInDays(new Date(endDay), subDays(new Date(
							beginDay), 1));
					} else {
						// 如果是月初月末  月份加1
						if (isStart && isEnd) {
							months = months + 1;
						} else {
							if (!isStart && !isEnd) {
								months = months - 1;
							}
							day = !isStart ?
								differenceInDays(endOfMonth(beginDay), beginDay) + 1 :
								day;
							day = !isEnd ?
								day + differenceInDays(endDay, startOfMonth(endDay)) + 1 :
								day;
						}
					}
					total = (months * hireMonthly + day * hire) * orderNum;
					dayText = surplusDay + '天';

				} else {
					dayText = ''
				}
				break;
			default:
				break;
		}
	}
	total = total + pledge + carriage * 1;
	let param = {
		tenancy: dayText,
		endDate: endDate ? (endDate + ' 23:59:59') : "",
		total: total > 0 ? Number(total).toFixed(2) : '0.00',
	}
	return param;
}
const calculationTenancy = function (settlementType, beginDate, endDate, isObject) {
	if (!settlementType || !beginDate || !endDate) return "-";

	beginDate = new Date(escapeDate(beginDate));
	endDate = new Date(escapeDate(endDate));

	endDate = addDays(endDate, 1); // 为了使计算结果包含结束日期当天
	let days = differenceInCalendarDays(endDate, beginDate);

	if (!(days >= 0)) {
		days = 0;
	}
	let surplusDay = 0;
	switch (settlementType) {
		case "1": // 按天
			if (isObject) {
				return {
					days: days,
					// eslint-disable-next-line no-undef
					label: days + "天",
				};
			}
			// eslint-disable-next-line no-undef
			return days + "天";
		case "2": {
			// 按月(30天)
			surplusDay = days % 30;
			if (isObject) {
				return {
					days: days,
					months: Math.floor(days / 30),
					rentDays: surplusDay,
					// eslint-disable-next-line no-undef
					label:
						Math.floor(days / 30) +
						// eslint-disable-next-line no-undef
						"月" +
						surplusDay +
						// eslint-disable-next-line no-undef
						"天",
				};
			}

			// eslint-disable-next-line no-undef
			return (
				Math.floor(days / 30) +
				// eslint-disable-next-line no-undef
				"月" +
				surplusDay +
				// eslint-disable-next-line no-undef
				"天"
			);
		}
		case "3": {
			// 按自然月
			let surplusMonth = getSurplusMonth(beginDate, endDate);
			surplusDay = getSurplusDay(beginDate, endDate, surplusMonth);

			if (isObject) {
				return {
					days: days,
					months: surplusMonth,
					rentDays: surplusDay,
					// eslint-disable-next-line no-undef
					label:
						surplusMonth +
						// eslint-disable-next-line no-undef
						"月" +
						surplusDay +
						// eslint-disable-next-line no-undef
						"天",
				};
			}

			// eslint-disable-next-line no-undef
			return (
				surplusMonth +
				// eslint-disable-next-line no-undef
				"月" +
				surplusDay +
				// eslint-disable-next-line no-undef
				"天"
			);
		}
		case "4": {
			// 按日租转月租
			/* 逻辑：1.租期小于一个月，比较日租金和月租金，若月租金比较少，应收为一个月的月租金；
		   2.租金大于1个月，按照月租金（自然月）计算； */

			let surplusMonth = getSurplusMonth(beginDate, endDate);
			surplusDay = getSurplusDay(beginDate, endDate, surplusMonth);

			if (isObject) {
				return {
					days: days,
					months: surplusMonth,
					rentDays: surplusDay,
					// eslint-disable-next-line no-undef
					label: days + "天",
				};
			}
			// eslint-disable-next-line no-undef
			return days + "天";
		}
		case "5": {
			// let day = differenceInDays(endDate, beginDate);
			let week = Math.floor(days / 7);
			if (days >= 7) surplusDay = days % 7;
			else surplusDay = days;

			if (isObject) {
				return {
					days: days,
					weeks: week,
					rentDays: surplusDay,
					// eslint-disable-next-line no-undef
					label:
						week +
						// eslint-disable-next-line no-undef
						"周" +
						surplusDay +
						// eslint-disable-next-line no-undef
						"天",
				};
			}
			// eslint-disable-next-line no-undef
			return (
				week +
				// eslint-disable-next-line no-undef
				"周" +
				surplusDay +
				// eslint-disable-next-line no-undef
				"天"
			);
		}
		case "6": {
			// 月租（月份）
			/* 逻辑：1.开始日期是否是  月初
				  2.结束日期是否是  月末
		   */

			let beginDay = startOfDay(beginDate);

			// 先把前面加上的一天去掉的
			let endDay = endOfDay(new Date(subDays(endDate, 1)));

			//开始时间的月初时间
			let monthStartDay = startOfMonth(beginDay);

			//结束时间的月末时间
			let monthLastDay = endOfMonth(endDay);

			//是否月初 月末
			let isStart = beginDay.getTime() == monthStartDay.getTime();
			let isEnd = endDay.getTime() == monthLastDay.getTime();

			//相差月份
			let months = differenceInMonths(monthLastDay, monthStartDay);

			let day = 0;

			//月份小于等于0 如果占到月初跟月末 月份等于1
			// 根据是否月初月末 计算距离天数
			if (months <= 0) {
				months = isStart && isEnd ? 1 : 0;
				day =
					isStart && isEnd
						? 0
						: differenceInDays(
							new Date(endDay),
							subDays(new Date(beginDay), 1)
						);
			} else {
				// 如果是月初月末  月份加1
				if (isStart && isEnd) {
					months = months + 1;
				} else {
					if (!isStart && !isEnd) months = months - 1;
					day = !isStart
						? differenceInDays(endOfMonth(beginDay), beginDay) + 1
						: day;
					day = !isEnd
						? day + differenceInDays(endDay, startOfMonth(endDay)) + 1
						: day;
				}
			}

			if (isObject) {
				return {
					days: days,
					months: months,
					rentDays: day,
					// eslint-disable-next-line no-undef
					label: days + "天",
				};
			}
			// eslint-disable-next-line no-undef
			return days + "天";
		}
	}
}
export default {
	calculateTotal,
	calculateDays,
	getDaysOfDiffer,
	dealNumber,
	dealNumberNoZero,
	undoNubmer,
	calculateTotalNew,
	getTenancys,
	calculateTotalWithHMS,
	subMonthThree,
	getCheckMoney,
	getTenancysWithSmple,
	calculateTotalWithSmple,
	AddsubDays,
	subDaysThrity,
	calculationTenancy,
	calculateTotalSelf
}
