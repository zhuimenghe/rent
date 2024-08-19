/*
 * uCharts v1.9.3.20190922
 * uni-app平台高性能跨全端图表，支持H5、APP、小程序（微信/支付宝/百度/头条/QQ/360）
 * Copyright (c) 2019 QIUN秋云 https://www.ucharts.cn All rights reserved.
 * Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
 * 
 * uCharts官方网站
 * https://www.uCharts.cn
 * 
 * 开源地址:
 * https://gitee.com/uCharts/uCharts
 * 
 * uni-app插件市场地址：
 * http://ext.dcloud.net.cn/plugin?id=271
 * 
 */

'use strict';

var config = {
	yAxisWidth: 15,
	yAxisSplit: 5,
	xAxisHeight: 15,
	xAxisLineHeight: 15,
	legendHeight: 15,
	yAxisTitleWidth: 15,
	padding: [20, 20, 10, 10],
	pixelRatio: 1,
	rotate: false,
	columePadding: 3,
	fontSize: 12,
	dataPointShape: ['diamond', 'circle', 'triangle', 'rect'],
	// dataPointShape: ['circle', 'circle', 'circle', 'circle'],
	colors: ['#FCA01F', '#45B853', '#5A7AE8', '#f04864', '#8543e0', '#90ed7d'],
	pieChartLinePadding: 15,
	pieChartTextPadding: 5,
	xAxisTextPadding: 3,
	titleColor: '#333333',
	titleFontSize: 20,
	subtitleColor: '#999999',
	subtitleFontSize: 15,
	toolTipPadding: 3,
	toolTipBackground: '#000000',
	toolTipOpacity: 0.7,
	toolTipLineHeight: 20,
	radarLabelTextMargin: 15,
	gaugeLabelTextMargin: 15
};

let assign = function(target, ...varArgs) {
	if (target == null) {
		throw new TypeError('Cannot convert undefined or null to object');
	}
	if (!varArgs || varArgs.length <= 0) {
		return target;
	}
	// 深度合并对象
	function deepAssign(obj1, obj2) {
		for (let key in obj2) {
			obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ?
				deepAssign(obj1[key], obj2[key]) : obj1[key] = obj2[key];
		}
		return obj1;
	}

	varArgs.forEach(val => {
		target = deepAssign(target, val);
	});
	return target;
};

var util = {
	toFixed: function toFixed(num, limit) {
		limit = limit || 2;
		if (this.isFloat(num)) {
			num = num.toFixed(limit);
		}
		return num;
	},
	isFloat: function isFloat(num) {
		return num % 1 !== 0;
	},
	approximatelyEqual: function approximatelyEqual(num1, num2) {
		return Math.abs(num1 - num2) < 1e-10;
	},
	isSameSign: function isSameSign(num1, num2) {
		return Math.abs(num1) === num1 && Math.abs(num2) === num2 || Math.abs(num1) !== num1 && Math.abs(num2) !== num2;
	},
	isSameXCoordinateArea: function isSameXCoordinateArea(p1, p2) {
		return this.isSameSign(p1.x, p2.x);
	},
	isCollision: function isCollision(obj1, obj2) {
		obj1.end = {};
		obj1.end.x = obj1.start.x + obj1.width;
		obj1.end.y = obj1.start.y - obj1.height;
		obj2.end = {};
		obj2.end.x = obj2.start.x + obj2.width;
		obj2.end.y = obj2.start.y - obj2.height;
		var flag = obj2.start.x > obj1.end.x || obj2.end.x < obj1.start.x || obj2.end.y > obj1.start.y || obj2.start.y <
			obj1.end.y;
		return !flag;
	}
};

// hex 转 rgba
function hexToRgb(hexValue, opc) {
	var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	var hex = hexValue.replace(rgx, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});
	var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	var r = parseInt(rgb[1], 16);
	var g = parseInt(rgb[2], 16);
	var b = parseInt(rgb[3], 16);
	return 'rgba(' + r + ',' + g + ',' + b + ',' + opc + ')';
}

function findRange(num, type, limit) {
	if (isNaN(num)) {
		throw new Error('[uCharts] unvalid series data!');
	}
	limit = limit || 10;
	type = type ? type : 'upper';
	var multiple = 1;
	while (limit < 1) {
		limit *= 10;
		multiple *= 10;
	}
	if (type === 'upper') {
		num = Math.ceil(num * multiple);
	} else {
		num = Math.floor(num * multiple);
	}
	while (num % limit !== 0) {
		if (type === 'upper') {
			num++;
		} else {
			num--;
		}
	}
	return num / multiple;
}

function calCandleMA(dayArr, nameArr, colorArr, kdata) {
	let seriesTemp = [];
	for (let k = 0; k < dayArr.length; k++) {
		let seriesItem = {
			data: [],
			name: nameArr[k],
			color: colorArr[k]
		};
		for (let i = 0, len = kdata.length; i < len; i++) {
			if (i < dayArr[k]) {
				seriesItem.data.push(null);
				continue;
			}
			let sum = 0;
			for (let j = 0; j < dayArr[k]; j++) {
				sum += kdata[i - j][1];
			}
			seriesItem.data.push(+(sum / dayArr[k]).toFixed(3));
		}
		seriesTemp.push(seriesItem);
	}
	return seriesTemp;
}

function calValidDistance(self, distance, chartData, config, opts) {
	var dataChartAreaWidth = opts.width - opts.area[1] - opts.area[3];
	var dataChartWidth = chartData.eachSpacing * (opts.chartData.xAxisData.xAxisPoints.length - 1);
	var validDistance = distance;
	if (distance >= 0) {
		validDistance = 0;
		self.event.trigger('scrollLeft');
	} else if (Math.abs(distance) >= dataChartWidth - dataChartAreaWidth) {
		validDistance = dataChartAreaWidth - dataChartWidth;
		self.event.trigger('scrollRight');
	}
	return validDistance;
}

function isInAngleRange(angle, startAngle, endAngle) {
	function adjust(angle) {
		while (angle < 0) {
			angle += 2 * Math.PI;
		}
		while (angle > 2 * Math.PI) {
			angle -= 2 * Math.PI;
		}
		return angle;
	}
	angle = adjust(angle);
	startAngle = adjust(startAngle);
	endAngle = adjust(endAngle);
	if (startAngle > endAngle) {
		endAngle += 2 * Math.PI;
		if (angle < startAngle) {
			angle += 2 * Math.PI;
		}
	}
	return angle >= startAngle && angle <= endAngle;
}

function calRotateTranslate(x, y, h) {
	var xv = x;
	var yv = h - y;
	var transX = xv + (h - yv - xv) / Math.sqrt(2);
	transX *= -1;
	var transY = (h - yv) * (Math.sqrt(2) - 1) - (h - yv - xv) / Math.sqrt(2);
	return {
		transX: transX,
		transY: transY
	};
}

function fillSeries(series, opts, config) {
	var index = 0;
	return series.map(function(item) {
		if (!item.color) {
			item.color = config.colors[index];
			index = (index + 1) % config.colors.length;
		}
		if (!item.index) {
			item.index = 0;
		}
		if (!item.type) {
			item.type = opts.type;
		}
		if (typeof item.show == "undefined") {
			item.show = true;
		}
		if (!item.type) {
			item.type = opts.type;
		}
		if (!item.pointShape) {
			item.pointShape = "circle";
		}
		if (!item.legendShape) {
			item.legendShape = "rect";
		}
		return item;
	});
}

function getDataRange(minData, maxData) {
	var limit = 0;
	var range = maxData - minData;
	if (range >= 10000) {
		limit = 1000;
	} else if (range >= 1000) {
		limit = 100;
	} else if (range >= 100) {
		limit = 10;
	} else if (range >= 10) {
		limit = 5;
	} else if (range >= 1) {
		limit = 1;
	} else if (range >= 0.1) {
		limit = 0.1;
	} else if (range >= 0.01) {
		limit = 0.01;
	} else if (range >= 0.001) {
		limit = 0.001;
	} else if (range >= 0.0001) {
		limit = 0.0001;
	} else if (range >= 0.00001) {
		limit = 0.00001;
	} else {
		limit = 0.000001;
	}
	return {
		minRange: findRange(minData, 'lower', limit),
		maxRange: findRange(maxData, 'upper', limit)
	};
}

function measureText(text) {
	var fontSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : config.fontSize;
	text = String(text);
	var text = text.split('');
	var width = 0;
	for (let i = 0; i < text.length; i++) {
		let item = text[i];
		if (/[a-zA-Z]/.test(item)) {
			width += 7;
		} else if (/[0-9]/.test(item)) {
			width += 5.5;
		} else if (/\./.test(item)) {
			width += 2.7;
		} else if (/-/.test(item)) {
			width += 3.25;
		} else if (/[\u4e00-\u9fa5]/.test(item)) {
			width += 10;
		} else if (/\(|\)/.test(item)) {
			width += 3.73;
		} else if (/\s/.test(item)) {
			width += 2.5;
		} else if (/%/.test(item)) {
			width += 8;
		} else {
			width += 10;
		}
	}
	return width * fontSize / 10;
}

function dataCombine(series) {
	return series.reduce(function(a, b) {
		return (a.data ? a.data : a).concat(b.data);
	}, []);
}

function getTouches(touches, opts, e) {
	let x, y;
	console.log("touches="+JSON.stringify(touches) +"====e:"+JSON.stringify(e));
	if (touches.clientX) {
		if (opts.rotate) {
			y = opts.height - touches.clientX * opts.pixelRatio;
			x = (touches.pageY - e.currentTarget.offsetTop - (opts.height / opts.pixelRatio / 2) * (opts.pixelRatio - 1)) *
				opts.pixelRatio;
		} else {
			x = touches.clientX * opts.pixelRatio;
			y = (touches.pageY - e.currentTarget.offsetTop - (opts.height / opts.pixelRatio / 2) * (opts.pixelRatio - 1)) *
				opts.pixelRatio;
		}
	} else {
		if (opts.rotate) {
			y = opts.height - touches.x * opts.pixelRatio;
			x = touches.y * opts.pixelRatio;
		} else {
			x = touches.x * opts.pixelRatio;
			y = touches.y * opts.pixelRatio;
		}
	}
	return {
		x: x,
		y: y
	}
}

function getSeriesDataItem(series, index) {
	var data = [];
	for (let i = 0; i < series.length; i++) {
		let item = series[i];
		if (item.data[index] !== null && typeof item.data[index] !== 'undefined' && item.show) {
			let seriesItem = {};
			seriesItem.color = item.color;
			seriesItem.type = item.type;
			seriesItem.style = item.style;
			seriesItem.pointShape = item.pointShape;
			seriesItem.disableLegend = item.disableLegend;
			seriesItem.name = item.name;
			seriesItem.show = item.show;
			seriesItem.data = item.format ? item.format(item.data[index]) : item.data[index];
			data.push(seriesItem);
		}
	}
	return data;
}

function getToolTipData(seriesData, calPoints, index, categories) {
	var option = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

	var textList = seriesData.map(function(item) {
		let titleText = [];
		if (categories) {
			titleText = categories;
		} else {
			titleText = item.data;
		}
		return {
			text: option.format ? option.format(item, titleText[index]) : item.name + ': ' + item.data,
			color: item.color
		};
	});
	var validCalPoints = [];
	var offset = {
		x: 0,
		y: 0
	};
	for (let i = 0; i < calPoints.length; i++) {
		let points = calPoints[i];
		if (typeof points[index] !== 'undefined' && points[index] !== null) {
			validCalPoints.push(points[index]);
		}
	}
	for (let i = 0; i < validCalPoints.length; i++) {
		let item = validCalPoints[i];
		offset.x = Math.round(item.x);
		offset.y += item.y;
	}
	offset.y /= validCalPoints.length;
	return {
		textList: textList,
		offset: offset
	};
}

function filterSeries(series) {
	let tempSeries = [];
	for (let i = 0; i < series.length; i++) {
		if (series[i].show == true) {
			tempSeries.push(series[i])
		}
	}
	return tempSeries;
}

function findCurrentIndex(currentPoints, calPoints, opts, config) {
	var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
	var currentIndex = -1;
	var spacing = 0;
	let xAxisPoints = [];
	for (let i = 0; i < calPoints[0].length; i++) {
		xAxisPoints.push(calPoints[0][i].x)
	}
	if ((opts.type == 'line' || opts.type == 'area') && opts.xAxis.boundaryGap == 'justify') {
		spacing = opts.chartData.eachSpacing / 2;
	}
	if (!opts.categories) {
		spacing = 0
	}
	if (isInExactChartArea(currentPoints, opts, config)) {
		xAxisPoints.forEach(function(item, index) {
			if (currentPoints.x + offset + spacing > item) {
				currentIndex = index;
			}
		});
	}
	return currentIndex;
}

function findLegendIndex(currentPoints, legendData, opts) {
	let currentIndex = -1;
	if (isInExactLegendArea(currentPoints, legendData.area)) {
		let points = legendData.points;
		let index = -1;
		for (let i = 0, len = points.length; i < len; i++) {
			let item = points[i];
			for (let j = 0; j < item.length; j++) {
				index += 1;
				let area = item[j]['area'];
				if (currentPoints.x > area[0] && currentPoints.x < area[2] && currentPoints.y > area[1] && currentPoints.y < area[3]) {
					currentIndex = index;
					break;
				}
			}
		}
		return currentIndex;
	}
	return currentIndex;
}

function isInExactLegendArea(currentPoints, area) {
	return currentPoints.x > area.start.x && currentPoints.x < area.end.x && currentPoints.y > area.start.y &&
		currentPoints.y < area.end.y;
}

function isInExactChartArea(currentPoints, opts, config) {
	return currentPoints.x <= opts.width - opts.area[1] + 10 && currentPoints.x >= opts.area[3] - 10 && currentPoints.y >=
		opts.area[0] && currentPoints.y <= opts.height - opts.area[2];
}


function calLegendData(series, opts, config, chartData) {
	let legendData = {
		area: {
			start: {
				x: 0,
				y: 0
			},
			end: {
				x: 0,
				y: 0
			},
			width: 0,
			height: 0,
			wholeWidth: 0,
			wholeHeight: 0
		},
		points: [],
		widthArr: [],
		heightArr: []
	};
	if (opts.legend.show === false) {
		chartData.legendData = legendData;
		return legendData;
	}

	let padding = opts.legend.padding;
	let margin = opts.legend.margin;
	let fontSize = opts.legend.fontSize;
	let shapeWidth = 15 * opts.pixelRatio;
	let shapeRight = 5 * opts.pixelRatio;
	let lineHeight = Math.max(opts.legend.lineHeight * opts.pixelRatio, fontSize);
	if (opts.legend.position == 'top' || opts.legend.position == 'bottom') {
		let legendList = [];
		let widthCount = 0;
		let widthCountArr = [];
		let currentRow = [];
		for (let i = 0; i < series.length; i++) {
			let item = series[i];
			let itemWidth = shapeWidth + shapeRight + measureText(item.name || 'undefined', fontSize) + opts.legend.itemGap;
			if (widthCount + itemWidth > opts.width - opts.padding[1] - opts.padding[3]) {
				legendList.push(currentRow);
				widthCountArr.push(widthCount - opts.legend.itemGap);
				widthCount = itemWidth;
				currentRow = [item];
			} else {
				widthCount += itemWidth;
				currentRow.push(item);
			}
		}
		if (currentRow.length) {
			legendList.push(currentRow);
			widthCountArr.push(widthCount - opts.legend.itemGap);
			legendData.widthArr = widthCountArr;
			let legendWidth = Math.max.apply(null, widthCountArr);
			switch (opts.legend.float) {
				case 'left':
					legendData.area.start.x = opts.padding[3];
					legendData.area.end.x = opts.padding[3] + 2 * padding;
					break;
				case 'right':
					legendData.area.start.x = opts.width - opts.padding[1] - legendWidth - 2 * padding;
					legendData.area.end.x = opts.width - opts.padding[1];
					break;
				default:
					legendData.area.start.x = (opts.width - legendWidth) / 2 - padding;
					legendData.area.end.x = (opts.width + legendWidth) / 2 + padding;
			}
			legendData.area.width = legendWidth + 2 * padding;
			legendData.area.wholeWidth = legendWidth + 2 * padding;
			legendData.area.height = legendList.length * lineHeight + 2 * padding;
			legendData.area.wholeHeight = legendList.length * lineHeight + 2 * padding + 2 * margin;
			legendData.points = legendList;
		}
	} else {
		let len = series.length;
		let maxHeight = opts.height - opts.padding[0] - opts.padding[2] - 2 * margin - 2 * padding;
		let maxLength = Math.min(Math.floor(maxHeight / lineHeight), len);
		legendData.area.height = maxLength * lineHeight + padding * 2;
		legendData.area.wholeHeight = maxLength * lineHeight + padding * 2;
		switch (opts.legend.float) {
			case 'top':
				legendData.area.start.y = opts.padding[0] + margin;
				legendData.area.end.y = opts.padding[0] + margin + legendData.area.height;
				break;
			case 'bottom':
				legendData.area.start.y = opts.height - opts.padding[2] - margin - legendData.area.height;
				legendData.area.end.y = opts.height - opts.padding[2] - margin;
				break;
			default:
				legendData.area.start.y = (opts.height - legendData.area.height) / 2;
				legendData.area.end.y = (opts.height + legendData.area.height) / 2;
		}
		let lineNum = len % maxLength === 0 ? len / maxLength : Math.floor((len / maxLength) + 1);
		let currentRow = [];
		for (let i = 0; i < lineNum; i++) {
			let temp = series.slice(i * maxLength, i * maxLength + maxLength);
			currentRow.push(temp);
		}

		legendData.points = currentRow;

		if (currentRow.length) {
			for (let i = 0; i < currentRow.length; i++) {
				let item = currentRow[i];
				let maxWidth = 0;
				for (let j = 0; j < item.length; j++) {
					let itemWidth = shapeWidth + shapeRight + measureText(item[j].name || 'undefined', fontSize) + opts.legend.itemGap;
					if (itemWidth > maxWidth) {
						maxWidth = itemWidth;
					}
				}
				legendData.widthArr.push(maxWidth);
				legendData.heightArr.push(item.length * lineHeight + padding * 2);
			}
			let legendWidth = 0
			for (let i = 0; i < legendData.widthArr.length; i++) {
				legendWidth += legendData.widthArr[i];
			}
			legendData.area.width = legendWidth - opts.legend.itemGap + 2 * padding;
			legendData.area.wholeWidth = legendData.area.width + padding;
		}
	}

	switch (opts.legend.position) {
		case 'top':
			legendData.area.start.y = opts.padding[0] + margin;
			legendData.area.end.y = opts.padding[0] + margin + legendData.area.height;
			break;
		case 'bottom':
			legendData.area.start.y = opts.height - opts.padding[2] - legendData.area.height - margin;
			legendData.area.end.y = opts.height - opts.padding[2] - margin;
			break;
		case 'left':
			legendData.area.start.x = opts.padding[3];
			legendData.area.end.x = opts.padding[3] + legendData.area.width;
			break;
		case 'right':
			legendData.area.start.x = opts.width - opts.padding[1] - legendData.area.width;
			legendData.area.end.x = opts.width - opts.padding[1];
			break;
	}
	chartData.legendData = legendData;
	return legendData;
}

function calCategoriesData(categories, opts, config, eachSpacing) {
	var result = {
		angle: 0,
		xAxisHeight: config.xAxisHeight
	};
	var categoriesTextLenth = categories.map(function(item) {
		return measureText(item, opts.xAxis.fontSize || config.fontSize);
	});
	var maxTextLength = Math.max.apply(this, categoriesTextLenth);

	if (opts.xAxis.rotateLabel == true && maxTextLength + 2 * config.xAxisTextPadding > eachSpacing) {
		result.angle = 45 * Math.PI / 180;
		result.xAxisHeight = 2 * config.xAxisTextPadding + maxTextLength * Math.sin(result.angle);
	}
	return result;
}

function fixColumeData(points, eachSpacing, columnLen, index, config, opts) {
	return points.map(function(item,index) {
		if (item === null) {
			return null;
		}
		item.width = opts.len[index];//Math.ceil((eachSpacing - 2 * config.columePadding) / columnLen);

		// if (opts.extra.column && opts.extra.column.width && +opts.extra.column.width > 0) {
		// 	item.width = Math.min(item.width, +opts.extra.column.width);
		// }
		// if (item.width <= 0) {
		// 	item.width = 1;
		// }
		// item.x += (index + 0.5 - columnLen / 2) * item.width;
		return item;
	});
}



//某天开始的时间
const getDayStart = function(time) {
	var splitA = time.split(/\s+/);
	var date = splitA[0];
	return new Date(Date.parse(new Date(date))).getTime();
}
//某天结束的时间
const getDayEnd = function(time) {
	return getDayStart(time) + (24 * 60 * 60 - 1) * 1000;
}

//某一时间段开始的位置
const getStartTimePos = function(startTime,beginTime, totalLength) {
	startTime = startTime.replace(/-/g, '/');
	beginTime = '2019-12-16'.replace(/-/g, '/');
	var totalTime = 24 * 60 * 60 * 1000*3;
	var pos = ((new Date(startTime).getTime() - new Date(beginTime).getTime()) / totalTime) * totalLength;
	return pos;

}

//时间段长度
const getTimeBucketLength = function(startTime, endTime, totalLength) {
	startTime = startTime.replace(/-/g, '/');
	endTime = endTime.replace(/-/g, '/');
	var totalTime = 24 * 60 * 60 * 1000*3;
	var len = (new Date(endTime).getTime() - new Date(startTime).getTime()) / totalTime * totalLength;
	return len;
}

function getXAxisPoints(categories, opts, config) {
	var spacingValid = opts.width - opts.area[1] - opts.area[3];
	var dataCount = opts.enableScroll ? Math.min(opts.xAxis.itemCount, categories.length) : categories.length;
	if ((opts.type == 'line' || opts.type == 'area') && dataCount > 1 && opts.xAxis.boundaryGap == 'justify') {
		dataCount -= 1;
	}
	var eachSpacing = spacingValid / dataCount;

	var xAxisPoints = [];
	var startX = opts.area[3];
	var endX = opts.width - opts.area[1];
	var pos = 0;
	var times = opts.times;
	times.forEach(function(item, index) {
		var startPos = getStartTimePos(item.startTime,times[0].startTime, opts.width);
		opts.len[index] = getTimeBucketLength(item.startTime, item.endTime, opts.width);
		// pos +=item;
		xAxisPoints.push(startPos);
	});
	if (opts.xAxis.boundaryGap !== 'justify') {
		if (opts.enableScroll === true) {
			xAxisPoints.push(startX + categories.length * eachSpacing);
		} else {
			xAxisPoints.push(endX);
		}
	}
	return {
		xAxisPoints: xAxisPoints,
		startX: startX,
		endX: endX,
		eachSpacing: eachSpacing
	};
}


function getDataPoints(seriesData, minRange, maxRange, xAxisPoints, eachSpacing, opts, config) {
	var process = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;
	var boundaryGap = 'center';
	if (opts.type == 'line' || opts.type == 'area') {
		boundaryGap = opts.xAxis.boundaryGap;
	}
	var points = [];
	var validHeight = opts.height - opts.area[0] - opts.area[2];
	var validWidth = opts.width - opts.area[1] - opts.area[3];
	seriesData.forEach(function(item, index) {
		if (item === null) {
			points.push(null);
		} else {
			var point = {};
			point.color = item.color;
			point.x = xAxisPoints[index];
			var value = item;
			if (typeof item === 'object' && item !== null) {
				if (item.constructor == Array) {
					let xranges, xminRange, xmaxRange;
					xranges = [].concat(opts.chartData.xAxisData.ranges);

					xminRange = xranges.shift();
					xmaxRange = xranges.pop();
					value = item[1];
					point.x = opts.area[3] + validWidth * (item[0] - xminRange) / (xmaxRange - xminRange);
				} else {
					value = item.value;
				}
			}
			if (boundaryGap == 'center') {
				point.x += Math.round(eachSpacing / 2);
			}
			var height = validHeight ;//* (value - minRange) / (maxRange - minRange);
			console.log("height==="+height+";process==="+process+";opts.area[2]=="+opts.area[2]);
			height *= process;
			point.y = opts.height - Math.round(height) - opts.area[2];
			points.push(point);
		}
	});

	return points;
}

function getStackDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, seriesIndex, stackSeries) {
	var process = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 1;
	var points = [];
	var validHeight = opts.height - opts.area[0] - opts.area[2];

	data.forEach(function(item, index) {
		if (item === null) {
			points.push(null);
		} else {
			var point = {};
			point.color = item.color;
			point.x = xAxisPoints[index] + Math.round(eachSpacing / 2);

			if (seriesIndex > 0) {
				var value = 0;
				for (let i = 0; i <= seriesIndex; i++) {
					value += stackSeries[i].data[index];
				}
				var value0 = value - item;
				var height = validHeight * (value - minRange) / (maxRange - minRange);
				var height0 = validHeight * (value0 - minRange) / (maxRange - minRange);
			} else {
				var value = item;
				var height = validHeight * (value - minRange) / (maxRange - minRange);
				var height0 = 0;
			}
			var heightc = height0;
			height *= process;
			heightc *= process;
			point.y = opts.height - Math.round(height) - opts.area[2];
			point.y0 = opts.height - Math.round(heightc) - opts.area[2];
			points.push(point);
		}
	});

	return points;
}

function getYAxisTextList(series, opts, config, stack) {
	var index = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;
	var data;
	data = dataCombine(series);
	var sorted = [];
	// remove null from data
	data = data.filter(function(item) {
		//return item !== null;
		if (typeof item === 'object' && item !== null) {
			if (item.constructor == Array) {
				return item !== null;
			} else {
				return item.value !== null;
			}
		} else {
			return item !== null;
		}
	});
	data.map(function(item) {
		if (typeof item === 'object') {
			if (item.constructor == Array) {
				if (opts.type == 'candle') {
					item.map(function(subitem) {
						sorted.push(subitem);
					})
				} else {
					sorted.push(item[1]);
				}
			} else {
				sorted.push(item.value);
			}
		} else {
			sorted.push(item);
		}
	})

	var minData = 0;
	var maxData = 0;
	if (sorted.length > 0) {
		minData = Math.min.apply(this, sorted);
		maxData = Math.max.apply(this, sorted);
	}
	//为了兼容v1.9.0之前的项目
	if (index > -1) {
		if (typeof opts.yAxis.data[index].min === 'number') {
			minData = Math.min(opts.yAxis.data[index].min, minData);
		}
		if (typeof opts.yAxis.data[index].max === 'number') {
			maxData = Math.max(opts.yAxis.data[index].max, maxData);
		}
	} else {
		if (typeof opts.yAxis.min === 'number') {
			minData = Math.min(opts.yAxis.min, minData);
		}
		if (typeof opts.yAxis.max === 'number') {
			maxData = Math.max(opts.yAxis.max, maxData);
		}
	}


	if (minData === maxData) {
		var rangeSpan = maxData || 10;
		maxData += rangeSpan;
	}

	var dataRange = getDataRange(minData, maxData);
	var minRange = dataRange.minRange;
	var maxRange = dataRange.maxRange;

	var range = [];
	var eachRange = (maxRange - minRange) / opts.yAxis.splitNumber;

	for (var i = 0; i <= opts.yAxis.splitNumber; i++) {
		range.push(minRange + eachRange * i);
	}
	return range.reverse();
}

function calYAxisData(series, opts, config) {
	//堆叠图重算Y轴
	var columnstyle = assign({}, {
		type: ""
	}, opts.extra.column);
	//如果是多Y轴，重新计算
	var YLength = opts.yAxis.data.length;
	var newSeries = new Array(YLength);
	if (YLength > 0) {
		for (let i = 0; i < YLength; i++) {
			newSeries[i] = [];
			for (let j = 0; j < series.length; j++) {
				if (series[j].index == i) {
					newSeries[i].push(series[j]);
				}
			}
		}
		var rangesArr = new Array(YLength);
		var rangesFormatArr = new Array(YLength);
		var yAxisWidthArr = new Array(YLength);

		for (let i = 0; i < YLength; i++) {
			let yData = opts.yAxis.data[i];
			//如果总开关不显示，强制每个Y轴为不显示
			if (opts.yAxis.disabled == true) {
				yData.disabled = true;
			}
			rangesArr[i] = getYAxisTextList(newSeries[i], opts, config, columnstyle.type, i);
			let yAxisFontSizes = yData.fontSize || config.fontSize;
			yAxisWidthArr[i] = {
				position: yData.position ? yData.position : 'left',
				width: 0
			};
			rangesFormatArr[i] = rangesArr[i].map(function(items) {
				items = util.toFixed(items, 6);
				items = yData.format ? yData.format(Number(items)) : items;
				yAxisWidthArr[i].width = Math.max(yAxisWidthArr[i].width, measureText(items, yAxisFontSizes) + 5);
				return items;
			});
			let calibration = yData.calibration ? 4 * opts.pixelRatio : 0;
			yAxisWidthArr[i].width += calibration + 3 * opts.pixelRatio;
			if (yData.disabled === true) {
				yAxisWidthArr[i].width = 0;
			}
		}

	} else {
		var rangesArr = new Array(1);
		var rangesFormatArr = new Array(1);
		var yAxisWidthArr = new Array(1);
		rangesArr[0] = getYAxisTextList(series, opts, config, columnstyle.type);
		yAxisWidthArr[0] = {
			position: 'left',
			width: 0
		};
		var yAxisFontSize = opts.yAxis.fontSize || config.fontSize;
		rangesFormatArr[0] = rangesArr[0].map(function(item) {
			item = util.toFixed(item, 6);
			item = opts.yAxis.format ? opts.yAxis.format(Number(item)) : item;
			yAxisWidthArr[0].width = Math.max(yAxisWidthArr[0].width, measureText(item, yAxisFontSize) + 5);
			return item;
		});
		yAxisWidthArr[0].width += 3 * opts.pixelRatio;
		if (opts.yAxis.disabled === true) {
			yAxisWidthArr[0] = {
				position: 'left',
				width: 0
			};
			opts.yAxis.data[0] = {
				disabled: true
			};
		} else {
			opts.yAxis.data[0] = {
				disabled: false,
				position: 'left',
				max: opts.yAxis.max,
				min: opts.yAxis.min,
				format: opts.yAxis.format
			};
		}

	}

	return {
		rangesFormat: rangesFormatArr,
		ranges: rangesArr,
		yAxisWidth: yAxisWidthArr
	};

}

function calTooltipYAxisData(point, series, opts, config, eachSpacing) {
	let ranges = [].concat(opts.chartData.yAxisData.ranges);
	let spacingValid = opts.height - opts.area[0] - opts.area[2];
	let minAxis = opts.area[0];
	let items = [];
	for (let i = 0; i < ranges.length; i++) {
		let maxVal = ranges[i].shift();
		let minVal = ranges[i].pop();
		let item = maxVal - (maxVal - minVal) * (point - minAxis) / spacingValid;
		item = opts.yAxis.data[i].format ? opts.yAxis.data[i].format(Number(item)) : item.toFixed(0);
		items.push(String(item))
	}
	return items;
}

function calMarkLineData(points, opts) {
	let minRange, maxRange;
	let spacingValid = opts.height - opts.area[0] - opts.area[2];
	for (let i = 0; i < points.length; i++) {
		points[i].yAxisIndex = points[i].yAxisIndex ? points[i].yAxisIndex : 0;
		let range = [].concat(opts.chartData.yAxisData.ranges[points[i].yAxisIndex]);
		minRange = range.pop();
		maxRange = range.shift();
		let height = spacingValid * (points[i].value - minRange) / (maxRange - minRange);
		points[i].y = opts.height - Math.round(height) - opts.area[2];
	}
	return points;
}

function contextRotate(context, opts) {
	if (opts.rotateLock !== true) {
		context.translate(opts.height, 0);
		context.rotate(90 * Math.PI / 180);
	} else if (opts._rotate_ !== true) {
		context.translate(opts.height, 0);
		context.rotate(90 * Math.PI / 180);
		opts._rotate_ = true;
	}
}

function drawPointText(points, series, config, context) {
	// 绘制数据文案
	var data = series.data;
	points.forEach(function(item, index) {
		if (item !== null) {
			//var formatVal = series.format ? series.format(data[index]) : data[index];
			context.beginPath();
			context.setFontSize(series.textSize || config.fontSize);
			context.setFillStyle(series.textColor || '#666666');
			var value = data[index]
			if (typeof data[index] === 'object' && data[index] !== null) {
				if (data[index].constructor == Array) {
					value = data[index][1];
				} else {
					value = data[index].value
				}
			}
			var formatVal = series.format ? series.format(value) : value;
			context.fillText(String(formatVal), item.x - measureText(formatVal, series.textSize || config.fontSize) / 2, item.y -
				4);
			context.closePath();
			context.stroke();
		}
	});

}

function drawToolTipSplitLine(offsetX, opts, config, context) {
	var toolTipOption = opts.extra.tooltip || {};
	toolTipOption.gridType = toolTipOption.gridType == undefined ? 'solid' : toolTipOption.gridType;
	toolTipOption.dashLength = toolTipOption.dashLength == undefined ? 4 : toolTipOption.dashLength;
	var startY = opts.area[0];
	var endY = opts.height - opts.area[2];

	if (toolTipOption.gridType == 'dash') {
		context.setLineDash([toolTipOption.dashLength, toolTipOption.dashLength]);
	}
	context.setStrokeStyle(toolTipOption.gridColor || '#cccccc');
	context.setLineWidth(1 * opts.pixelRatio);
	context.beginPath();
	context.moveTo(offsetX, startY);
	context.lineTo(offsetX, endY);
	context.stroke();
	context.setLineDash([]);

	if (toolTipOption.xAxisLabel) {
		let labelText = opts.categories[opts.tooltip.index];
		context.setFontSize(config.fontSize);
		let textWidth = measureText(labelText, config.fontSize);

		let textX = offsetX - 0.5 * textWidth;
		let textY = endY;
		context.beginPath();
		context.setFillStyle(hexToRgb(toolTipOption.labelBgColor || config.toolTipBackground, toolTipOption.labelBgOpacity ||
			config.toolTipOpacity));
		context.setStrokeStyle(toolTipOption.labelBgColor || config.toolTipBackground);
		context.setLineWidth(1 * opts.pixelRatio);
		context.rect(textX - config.toolTipPadding, textY, textWidth + 2 * config.toolTipPadding, config.fontSize + 2 *
			config.toolTipPadding);
		context.closePath();
		context.stroke();
		context.fill();

		context.beginPath();
		context.setFontSize(config.fontSize);
		context.setFillStyle(toolTipOption.labelFontColor || config.fontColor);
		context.fillText(String(labelText), textX, textY + config.toolTipPadding + config.fontSize);
		context.closePath();
		context.stroke();
	}
}

function drawMarkLine(opts, config, context) {
	let markLineOption = assign({}, {
		type: 'solid',
		dashLength: 4,
		data: []
	}, opts.extra.markLine);
	let startX = opts.area[3];
	let endX = opts.width - opts.area[1];
	let points = calMarkLineData(markLineOption.data, opts);

	for (let i = 0; i < points.length; i++) {
		let item = assign({}, {
			lineColor: '#DE4A42',
			showLabel: false,
			labelFontColor: '#666666',
			labelBgColor: '#DFE8FF',
			labelBgOpacity: 0.8,
			yAxisIndex: 0
		}, points[i]);

		if (markLineOption.type == 'dash') {
			context.setLineDash([markLineOption.dashLength, markLineOption.dashLength]);
		}
		context.setStrokeStyle(item.lineColor);
		context.setLineWidth(1 * opts.pixelRatio);
		context.beginPath();
		context.moveTo(startX, item.y);
		context.lineTo(endX, item.y);
		context.stroke();
		context.setLineDash([]);
		if (item.showLabel) {
			let labelText = opts.yAxis.format ? opts.yAxis.format(Number(item.value)) : item.value;
			context.setFontSize(config.fontSize);
			let textWidth = measureText(labelText, config.fontSize);
			let bgStartX = opts.padding[3] + config.yAxisTitleWidth - config.toolTipPadding;
			let bgEndX = Math.max(opts.area[3], textWidth + config.toolTipPadding * 2);
			let bgWidth = bgEndX - bgStartX;

			let textX = bgStartX + (bgWidth - textWidth) / 2;
			let textY = item.y;
			context.setFillStyle(hexToRgb(item.labelBgColor, item.labelBgOpacity));
			context.setStrokeStyle(item.labelBgColor);
			context.setLineWidth(1 * opts.pixelRatio);
			context.beginPath();
			context.rect(bgStartX, textY - 0.5 * config.fontSize - config.toolTipPadding, bgWidth, config.fontSize + 2 * config.toolTipPadding);
			context.closePath();
			context.stroke();
			context.fill();

			context.beginPath();
			context.setFontSize(config.fontSize);
			context.setFillStyle(item.labelFontColor);
			context.fillText(String(labelText), textX, textY + 0.5 * config.fontSize);
			context.stroke();
		}
		
	}
}

function drawToolTipHorizentalLine(opts, config, context, eachSpacing, xAxisPoints) {
	var toolTipOption = assign({}, {
		gridType: 'solid',
		dashLength: 4
	}, opts.extra.tooltip);

	var startX = opts.area[3];
	var endX = opts.width - opts.area[1];

	if (toolTipOption.gridType == 'dash') {
		context.setLineDash([toolTipOption.dashLength, toolTipOption.dashLength]);
	}
	context.setStrokeStyle(toolTipOption.gridColor || '#cccccc');
	context.setLineWidth(1 * opts.pixelRatio);
	context.beginPath();
	context.moveTo(startX, opts.tooltip.offset.y);
	context.lineTo(endX, opts.tooltip.offset.y);
	context.stroke();
	context.setLineDash([]);

	if (toolTipOption.yAxisLabel) {
		let labelText = calTooltipYAxisData(opts.tooltip.offset.y, opts.series, opts, config, eachSpacing);
		let widthArr = opts.chartData.yAxisData.yAxisWidth;
		let tStartLeft = opts.area[3];
		let tStartRight = opts.width - opts.area[1];
		for (let i = 0; i < labelText.length; i++) {
			context.setFontSize(config.fontSize);
			let textWidth = measureText(labelText[i], config.fontSize);
			let bgStartX, bgEndX, bgWidth;
			if (widthArr[i].position == 'left') {
				bgStartX = tStartLeft - widthArr[i].width;
				bgEndX = Math.max(bgStartX, bgStartX + textWidth + config.toolTipPadding * 2);
			} else {
				bgStartX = tStartRight;
				bgEndX = Math.max(bgStartX + widthArr[i].width, bgStartX + textWidth + config.toolTipPadding * 2);
			}
			bgWidth = bgEndX - bgStartX;

			let textX = bgStartX + (bgWidth - textWidth) / 2;
			let textY = opts.tooltip.offset.y;
			context.beginPath();
			context.setFillStyle(hexToRgb(toolTipOption.labelBgColor || config.toolTipBackground, toolTipOption.labelBgOpacity ||
				config.toolTipOpacity));
			context.setStrokeStyle(toolTipOption.labelBgColor || config.toolTipBackground);
			context.setLineWidth(1 * opts.pixelRatio);
			context.rect(bgStartX, textY - 0.5 * config.fontSize - config.toolTipPadding, bgWidth, config.fontSize + 2 * config.toolTipPadding);
			context.closePath();
			context.stroke();
			context.fill();

			context.beginPath();
			context.setFontSize(config.fontSize);
			context.setFillStyle(toolTipOption.labelFontColor || config.fontColor);
			context.fillText(labelText[i], textX, textY + 0.5 * config.fontSize);
			context.closePath();
			context.stroke();
			if (widthArr[i].position == 'left') {
				tStartLeft -= (widthArr[i].width + opts.yAxis.padding);
			} else {
				tStartRight += widthArr[i].width + opts.yAxis.padding;
			}
		}
	}
}

//画点击条形图的背景区域
function drawToolTipSplitArea(offsetX, opts, config, context, eachSpacing) {
	// var toolTipOption = assign({}, {
	// 	activeBgColor: '#000000',
	// 	activeBgOpacity: 0.08
	// }, opts.extra.tooltip);
	// var startY = opts.area[0];
	// var endY = opts.height - opts.area[2];
	// context.beginPath();
	// context.setFillStyle(hexToRgb(toolTipOption.activeBgColor, toolTipOption.activeBgOpacity));
	// context.rect(offsetX - eachSpacing / 2, startY, eachSpacing, endY - startY);
	// context.closePath();
	// context.fill();
}

function drawToolTip(textList, offset, opts, config, context, eachSpacing, xAxisPoints) {
	var toolTipOption = assign({}, {
		showBox: true,
		bgColor: '#000000',
		bgOpacity: 0.7,
		fontColor: '#FFFFFF'
	}, opts.extra.tooltip);
	var legendWidth = 4 * opts.pixelRatio;
	var legendMarginRight = 5 * opts.pixelRatio;
	var arrowWidth = 8 * opts.pixelRatio;
	var isOverRightBorder = false;
	if (opts.type == 'line' || opts.type == 'area' || opts.type == 'candle' || opts.type == 'mix') {
		drawToolTipSplitLine(opts.tooltip.offset.x, opts, config, context);
	}

	offset = assign({
		x: 0,
		y: 0
	}, offset);
	offset.y -= 8 * opts.pixelRatio;
	var textWidth = textList.map(function(item) {
		return measureText(item.text, config.fontSize);
	});
	var toolTipWidth = legendWidth + legendMarginRight + 4 * config.toolTipPadding + Math.max.apply(null, textWidth);
	var toolTipHeight = 2 * config.toolTipPadding + textList.length * config.toolTipLineHeight;

	if (toolTipOption.showBox == false) {
		return
	}
	// if beyond the right border
	if (offset.x - Math.abs(opts._scrollDistance_) + arrowWidth + toolTipWidth > opts.width) {
		isOverRightBorder = true;
	}
	if (toolTipHeight + offset.y > opts.height) {
		offset.y = opts.height - toolTipHeight;
	}
	// draw background rect
	context.beginPath();
	context.setFillStyle(hexToRgb(toolTipOption.bgColor || config.toolTipBackground, toolTipOption.bgOpacity || config.toolTipOpacity));
	if (isOverRightBorder) {
		context.moveTo(offset.x, offset.y + 10 * opts.pixelRatio);
		context.lineTo(offset.x - arrowWidth, offset.y + 10 * opts.pixelRatio - 5 * opts.pixelRatio);
		context.lineTo(offset.x - arrowWidth, offset.y);
		context.lineTo(offset.x - arrowWidth - Math.round(toolTipWidth), offset.y);
		context.lineTo(offset.x - arrowWidth - Math.round(toolTipWidth), offset.y + toolTipHeight);
		context.lineTo(offset.x - arrowWidth, offset.y + toolTipHeight);
		context.lineTo(offset.x - arrowWidth, offset.y + 10 * opts.pixelRatio + 5 * opts.pixelRatio);
		context.lineTo(offset.x, offset.y + 10 * opts.pixelRatio);
	} else {
		context.moveTo(offset.x, offset.y + 10 * opts.pixelRatio);
		context.lineTo(offset.x + arrowWidth, offset.y + 10 * opts.pixelRatio - 5 * opts.pixelRatio);
		context.lineTo(offset.x + arrowWidth, offset.y);
		context.lineTo(offset.x + arrowWidth + Math.round(toolTipWidth), offset.y);
		context.lineTo(offset.x + arrowWidth + Math.round(toolTipWidth), offset.y + toolTipHeight);
		context.lineTo(offset.x + arrowWidth, offset.y + toolTipHeight);
		context.lineTo(offset.x + arrowWidth, offset.y + 10 * opts.pixelRatio + 5 * opts.pixelRatio);
		context.lineTo(offset.x, offset.y + 10 * opts.pixelRatio);
	}

	context.closePath();
	context.fill();

	// draw legend
	textList.forEach(function(item, index) {
		if (item.color !== null) {
			context.beginPath();
			context.setFillStyle(item.color);
			var startX = offset.x + arrowWidth + 2 * config.toolTipPadding;
			var startY = offset.y + (config.toolTipLineHeight - config.fontSize) / 2 + config.toolTipLineHeight * index +
				config.toolTipPadding + 1;
			if (isOverRightBorder) {
				startX = offset.x - toolTipWidth - arrowWidth + 2 * config.toolTipPadding;
			}
			context.fillRect(startX, startY, legendWidth, config.fontSize);
			context.closePath();
		}
	});

	// draw text list

	textList.forEach(function(item, index) {
		var startX = offset.x + arrowWidth + 2 * config.toolTipPadding + legendWidth + legendMarginRight;
		if (isOverRightBorder) {
			startX = offset.x - toolTipWidth - arrowWidth + 2 * config.toolTipPadding + +legendWidth + legendMarginRight;
		}
		var startY = offset.y + (config.toolTipLineHeight - config.fontSize) / 2 + config.toolTipLineHeight * index +
			config.toolTipPadding;
		context.beginPath();
		context.setFontSize(config.fontSize);
		context.setFillStyle(toolTipOption.fontColor);
		context.fillText(item.text, startX, startY + config.fontSize);
		context.closePath();
		context.stroke();
	});
}

function drawYAxisTitle(title, opts, config, context) {
	var startX = config.xAxisHeight + (opts.height - config.xAxisHeight - measureText(title)) / 2;
	context.save();
	context.beginPath();
	context.setFontSize(config.fontSize);
	context.setFillStyle(opts.yAxis.titleFontColor || '#333333');
	context.translate(0, opts.height);
	context.rotate(-90 * Math.PI / 180);
	context.fillText(title, startX, opts.padding[3] + 0.5 * config.fontSize);
	context.closePath();
	context.stroke();
	context.restore();
}

function drawColumnDataPoints(series, opts, config, context) {
	let process = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
	let xAxisData = opts.chartData.xAxisData,
		xAxisPoints = xAxisData.xAxisPoints,
		eachSpacing = xAxisData.eachSpacing;
	let columnOption = assign({}, {
		type: 'group',
		width: eachSpacing / 2,
		meter: {
			border: 4,
			fillColor: '#FFFFFF'
		}
	}, opts.extra.column);

	let calPoints = [];
	context.save();

	let leftNum = -2;
	let rightNum = xAxisPoints.length + 2;

	if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
		context.translate(opts._scrollDistance_, 0);
		leftNum = Math.floor(-opts._scrollDistance_ / eachSpacing) - 2;
		rightNum = leftNum + opts.xAxis.itemCount + 4;
	}
	if (opts.tooltip && opts.tooltip.textList && opts.tooltip.textList.length && process === 1) {
		drawToolTipSplitArea(opts.tooltip.offset.x, opts, config, context, eachSpacing);
	}

	series.forEach(function(eachSeries, seriesIndex) {
		let ranges, minRange, maxRange;
		ranges = [].concat(opts.chartData.yAxisData.ranges[eachSeries.index]);
		minRange = ranges.pop();
		maxRange = ranges.shift();

		var data = eachSeries.data;
		switch (columnOption.type) {
			case 'group':
				var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
				var tooltipPoints = getStackDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config,
					seriesIndex, series, process);
				calPoints.push(tooltipPoints);
				points = fixColumeData(points, eachSpacing, series.length, seriesIndex, config, opts);
				console.log("points==="+JSON.stringify(points));
				for (let i = 0; i < points.length; i++) {
					let item = points[i];
					if (item !== null && i > leftNum && i < rightNum) {
						context.beginPath();
						context.setStrokeStyle(item.color || eachSeries.color);
						context.setLineWidth(1)
						context.setFillStyle(item.color || eachSeries.color);
						var startX = item.x - item.width / 2;
						var height = opts.height - item.y - opts.area[2];
						context.moveTo(startX - 1, item.y);
						context.lineTo(startX + item.width - 2, item.y);
						context.lineTo(startX + item.width - 2, opts.height - opts.area[2]);
						context.lineTo(startX, opts.height - opts.area[2]);
						context.lineTo(startX, item.y);
						context.closePath();
						context.stroke();
						context.fill();
					}
				};
				break;
		}
	});

	if (opts.dataLabel !== false && process === 1) {
		series.forEach(function(eachSeries, seriesIndex) {
			let ranges, minRange, maxRange;
			ranges = [].concat(opts.chartData.yAxisData.ranges[eachSeries.index]);
			minRange = ranges.pop();
			maxRange = ranges.shift();
			var data = eachSeries.data;
			switch (columnOption.type) {
				case 'group':
					var points = getDataPoints(data, minRange, maxRange, xAxisPoints, eachSpacing, opts, config, process);
					points = fixColumeData(points, eachSpacing, series.length, seriesIndex, config, opts);
					drawPointText(points, eachSeries, config, context);
					break;
			}
		});
	}

	context.restore();

	return {
		xAxisPoints: xAxisPoints,
		calPoints: calPoints,
		eachSpacing: eachSpacing
	};
}


function drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints) {
	var toolTipOption = opts.extra.tooltip || {};
	if (toolTipOption.horizentalLine && opts.tooltip && process === 1 && (opts.type == 'line' || opts.type == 'area' ||
			opts.type == 'column' || opts.type == 'candle' || opts.type == 'mix')) {
		drawToolTipHorizentalLine(opts, config, context, eachSpacing, xAxisPoints)
	}
	context.save();
	if (opts._scrollDistance_ && opts._scrollDistance_ !== 0 && opts.enableScroll === true) {
		context.translate(opts._scrollDistance_, 0);
	}
	if (opts.tooltip && opts.tooltip.textList && opts.tooltip.textList.length && process === 1) {
		drawToolTip(opts.tooltip.textList, opts.tooltip.offset, opts, config, context, eachSpacing, xAxisPoints);
	}
	context.restore();

}

function drawXAxis(categories, opts, config, context) {

	let xAxisData = opts.chartData.xAxisData,
		xAxisPoints = xAxisData.xAxisPoints,
		startX = xAxisData.startX,
		endX = xAxisData.endX,
		eachSpacing = xAxisData.eachSpacing;
	var boundaryGap = 'center';
	var startY = opts.height - opts.area[2];
	var endY = opts.area[0];

	//绘制滚动条
	if (opts.enableScroll && opts.xAxis.scrollShow) {
		var scrollY = opts.height - opts.area[2] + config.xAxisHeight;
		var scrollScreenWidth = endX - startX;
		var scrollTotalWidth = eachSpacing * (xAxisPoints.length - 1);
		var scrollWidth = scrollScreenWidth * scrollScreenWidth / scrollTotalWidth;
		var scrollLeft = 0;
		if (opts._scrollDistance_) {
			scrollLeft = -opts._scrollDistance_ * (scrollScreenWidth) / scrollTotalWidth;
		}
		context.beginPath();
		context.setLineCap('round');
		context.setLineWidth(6 * opts.pixelRatio);
		context.setStrokeStyle(opts.xAxis.scrollBackgroundColor || "#EFEBEF");
		context.moveTo(startX, scrollY);
		context.lineTo(endX, scrollY);
		context.stroke();
		context.closePath();
		context.beginPath();
		context.setLineCap('round');
		context.setLineWidth(6 * opts.pixelRatio);
		context.setStrokeStyle(opts.xAxis.scrollColor || "#A6A6A6");
		context.moveTo(startX + scrollLeft, scrollY);
		context.lineTo(startX + scrollLeft + scrollWidth, scrollY);
		context.stroke();
		context.closePath();
		context.setLineCap('butt');
	}

	context.save();

	if (opts._scrollDistance_ && opts._scrollDistance_ !== 0) {
		context.translate(opts._scrollDistance_, 0);
	}

	//绘制X轴刻度线
	if (opts.xAxis.calibration === true) {
		context.setStrokeStyle(opts.xAxis.gridColor || "#cccccc");
		context.setLineCap('butt');
		context.setLineWidth(1 * opts.pixelRatio);
		xAxisPoints.forEach(function(item, index) {
			if (index > 0) {
				context.beginPath();
				context.moveTo(item - eachSpacing / 2, startY);
				context.lineTo(item - eachSpacing / 2, startY + 3 * opts.pixelRatio);
				context.closePath();
				context.stroke();
			}
		});
	}
	//绘制X轴网格
	if (opts.xAxis.disableGrid !== true) {
		context.setStrokeStyle(opts.xAxis.gridColor || "#cccccc");
		context.setLineCap('butt');
		context.setLineWidth(1 * opts.pixelRatio);
		if (opts.xAxis.gridType == 'dash') {
			context.setLineDash([opts.xAxis.dashLength, opts.xAxis.dashLength]);
		}
		opts.xAxis.gridEval = opts.xAxis.gridEval || 1;
		xAxisPoints.forEach(function(item, index) {
			if (index % opts.xAxis.gridEval == 0) {
				context.beginPath();
				context.moveTo(item, startY);
				context.lineTo(item, endY);
				context.stroke();
			}
		});
		context.setLineDash([]);
	}


	//绘制X轴文案
	if (opts.xAxis.disabled !== true) {
		// 对X轴列表做抽稀处理
		//默认全部显示X轴标签
		let maxXAxisListLength = categories.length;
		//如果设置了X轴单屏数量
		if (opts.xAxis.labelCount) {
			//如果设置X轴密度
			if (opts.xAxis.itemCount) {
				maxXAxisListLength = Math.ceil(categories.length / opts.xAxis.itemCount * opts.xAxis.labelCount);
			} else {
				maxXAxisListLength = opts.xAxis.labelCount;
			}
			maxXAxisListLength -= 1;
		}

		let ratio = Math.ceil(categories.length / maxXAxisListLength);

		let newCategories = [];
		let cgLength = categories.length;
		for (let i = 0; i < cgLength; i++) {
			if (i % ratio !== 0) {
				newCategories.push("");
			} else {
				newCategories.push(categories[i]);
			}
		}
		newCategories[cgLength - 1] = categories[cgLength - 1];

		var xAxisFontSize = opts.xAxis.fontSize || config.fontSize;
		if (config._xAxisTextAngle_ === 0) {
			newCategories.forEach(function(item, index) {
				var offset = -measureText(String(item), xAxisFontSize) / 2;
				if (boundaryGap == 'center') {
					offset += eachSpacing / 2;
				}
				var scrollHeight = 0;
				if (opts.xAxis.scrollShow) {
					scrollHeight = 6 * opts.pixelRatio;
				}
				context.beginPath();
				context.setFontSize(xAxisFontSize);
				context.setFillStyle(opts.xAxis.fontColor || '#666666');
				context.fillText(String(item), xAxisPoints[index] + offset, startY + xAxisFontSize + (config.xAxisHeight -
					scrollHeight - xAxisFontSize) / 2);
				context.closePath();
				context.stroke();
			});

		} else {
			newCategories.forEach(function(item, index) {
				context.save();
				context.beginPath();
				context.setFontSize(xAxisFontSize);
				context.setFillStyle(opts.xAxis.fontColor || '#666666');
				var textWidth = measureText(String(item), xAxisFontSize);
				var offset = -textWidth;
				if (boundaryGap == 'center') {
					offset += eachSpacing / 2;
				}
				var _calRotateTranslate = calRotateTranslate(xAxisPoints[index] + eachSpacing / 2, startY + xAxisFontSize / 2 + 5,
						opts.height),
					transX = _calRotateTranslate.transX,
					transY = _calRotateTranslate.transY;

				context.rotate(-1 * config._xAxisTextAngle_);
				context.translate(transX, transY);
				context.fillText(String(item), xAxisPoints[index] + offset, startY + xAxisFontSize + 5);
				context.closePath();
				context.stroke();
				context.restore();
			});
		}
	}
	context.restore();

	//绘制X轴轴线
	if (opts.xAxis.axisLine) {
		context.beginPath();
		context.setStrokeStyle(opts.xAxis.axisLineColor);
		context.setLineWidth(1 * opts.pixelRatio);
		context.moveTo(startX, opts.height - opts.area[2]);
		context.lineTo(endX, opts.height - opts.area[2]);
		context.stroke();
	}
}

function drawYAxisGrid(categories, opts, config, context) {
	if (opts.yAxis.disableGrid === true) {
		return;
	}
	let spacingValid = opts.height - opts.area[0] - opts.area[2];
	let eachSpacing = spacingValid / opts.yAxis.splitNumber;
	let startX = opts.area[3];
	let xAxisPoints = opts.chartData.xAxisData.xAxisPoints,
		xAxiseachSpacing = opts.chartData.xAxisData.eachSpacing;
	let TotalWidth = xAxiseachSpacing * (xAxisPoints.length - 1);
	let endX = startX + TotalWidth;

	let points = [];
	for (let i = 0; i < opts.yAxis.splitNumber + 1; i++) {
		points.push(opts.height - opts.area[2] - eachSpacing * i);
	}

	context.save();
	if (opts._scrollDistance_ && opts._scrollDistance_ !== 0) {
		context.translate(opts._scrollDistance_, 0);
	}

	if (opts.yAxis.gridType == 'dash') {
		context.setLineDash([opts.yAxis.dashLength, opts.yAxis.dashLength]);
	}
	context.setStrokeStyle(opts.yAxis.gridColor);
	context.setLineWidth(1 * opts.pixelRatio);
	// points.forEach(function(item, index) {
	// 	context.beginPath();
	// 	context.moveTo(startX, item);
	// 	context.lineTo(endX, item);
	// 	context.stroke();
	// });
	context.beginPath();
	context.moveTo(startX,  opts.area[0]);
	context.lineTo(endX,opts.area[0]);
	context.stroke();
	context.setLineDash([]);

	context.restore();
}

function drawYAxis(series, opts, config, context) {
	if (opts.yAxis.disabled === true) {
		return;
	}
	var spacingValid = opts.height - opts.area[0] - opts.area[2];
	var eachSpacing = spacingValid / opts.yAxis.splitNumber;
	var startX = opts.area[3];
	var endX = opts.width - opts.area[1];
	var endY = opts.height - opts.area[2];
	var fillEndY = endY + config.xAxisHeight;
	if (opts.xAxis.scrollShow) {
		fillEndY -= 3 * opts.pixelRatio;
	}
	if (opts.xAxis.rotateLabel) {
		fillEndY = opts.height - opts.area[2] + 3;
	}
	// set YAxis background
	context.beginPath();
	context.setFillStyle(opts.background || '#ffffff');
	if (opts._scrollDistance_ < 0) {
		context.fillRect(0, 0, startX, fillEndY);
	}
	if (opts.enableScroll == true) {
		context.fillRect(endX, 0, opts.width, fillEndY);
	}
	context.closePath();
	context.stroke();

	var points = [];
	for (let i = 0; i <= opts.yAxis.splitNumber; i++) {
		points.push(opts.area[0] + eachSpacing * i);
	}

	let tStartLeft = opts.area[3];
	let tStartRight = opts.width - opts.area[1];

	for (let i = 0; i < opts.yAxis.data.length; i++) {
		let yData = opts.yAxis.data[i];
		if (yData.disabled !== true) {
			let rangesFormat = opts.chartData.yAxisData.rangesFormat[i];
			let yAxisFontSize = yData.fontSize || config.fontSize;
			let yAxisWidth = opts.chartData.yAxisData.yAxisWidth[i];
			//画Y轴刻度及文案
			rangesFormat.forEach(function(item, index) {
				var pos = points[index] ? points[index] : endY;
				context.beginPath();
				context.setFontSize(yAxisFontSize);
				context.setLineWidth(1 * opts.pixelRatio);
				context.setStrokeStyle(yData.axisLineColor || '#cccccc');
				context.setFillStyle(yData.fontColor || '#666666');
				if (yAxisWidth.position == 'left') {//y轴旁边的数据
					// context.fillText(String(item), tStartLeft - yAxisWidth.width, pos + yAxisFontSize / 2);
					//画刻度线
					if (yData.calibration == true) {
						context.moveTo(tStartLeft, pos);
						context.lineTo(tStartLeft - 3 * opts.pixelRatio, pos);
					}
				} else {
					context.fillText(String(item), tStartRight + 4 * opts.pixelRatio, pos + yAxisFontSize / 2);
					//画刻度线
					if (yData.calibration == true) {
						context.moveTo(tStartRight, pos);
						context.lineTo(tStartRight + 3 * opts.pixelRatio, pos);
					}
				}
				context.closePath();
				context.stroke();
			});
			//画Y轴轴线
			if (yData.axisLine !== false) {
				context.beginPath();
				context.setStrokeStyle(yData.axisLineColor || '#cccccc');
				context.setLineWidth(1 * opts.pixelRatio);
				if (yAxisWidth.position == 'left') {
					context.moveTo(tStartLeft, opts.height - opts.area[2]);
					context.lineTo(tStartLeft, opts.area[0]);
				} else {
					context.moveTo(tStartRight, opts.height - opts.area[2]);
					context.lineTo(tStartRight, opts.area[0]);
				}
				context.stroke();
			}

			//画Y轴标题
			if (opts.yAxis.showTitle) {

				let titleFontSize = yData.titleFontSize || config.fontSize;
				let title = yData.title;
				context.beginPath();
				context.setFontSize(titleFontSize);
				context.setFillStyle(yData.titleFontColor || '#666666');
				if (yAxisWidth.position == 'left') {
					context.fillText(title, tStartLeft - measureText(title, titleFontSize) / 2, opts.area[0] - 10 * opts.pixelRatio);
				} else {
					context.fillText(title, tStartRight - measureText(title, titleFontSize) / 2, opts.area[0] - 10 * opts.pixelRatio);
				}
				context.closePath();
				context.stroke();
			}
			if (yAxisWidth.position == 'left') {
				tStartLeft -= (yAxisWidth.width + opts.yAxis.padding);
			} else {
				tStartRight += yAxisWidth.width + opts.yAxis.padding;
			}
		}
	}
}

function drawLegend(series, opts, config, context, chartData) {
	if (opts.legend.show === false) {
		return;
	}
	let legendData = chartData.legendData;
	let legendList = legendData.points;
	let legendArea = legendData.area;
	let padding = opts.legend.padding;
	let fontSize = opts.legend.fontSize;
	let shapeWidth = 15 * opts.pixelRatio;
	let shapeRight = 5 * opts.pixelRatio;
	let itemGap = opts.legend.itemGap;
	let lineHeight = Math.max(opts.legend.lineHeight * opts.pixelRatio, fontSize);

	//画背景及边框
	context.beginPath();
	context.setLineWidth(opts.legend.borderWidth);
	context.setStrokeStyle(opts.legend.borderColor);
	context.setFillStyle(opts.legend.backgroundColor);
	context.moveTo(legendArea.start.x, legendArea.start.y);
	context.rect(legendArea.start.x, legendArea.start.y, legendArea.width, legendArea.height);
	context.closePath();
	context.fill();
	context.stroke();

	legendList.forEach(function(itemList, listIndex) {
		let width = 0;
		let height = 0;
		width = legendData.widthArr[listIndex];
		height = legendData.heightArr[listIndex];
		let startX = 0;
		let startY = 0;
		if (opts.legend.position == 'top' || opts.legend.position == 'bottom') {
			startX = legendArea.start.x + (legendArea.width - width) / 2;
			startY = legendArea.start.y + padding + listIndex * lineHeight;
		} else {
			if (listIndex == 0) {
				width = 0;
			} else {
				width = legendData.widthArr[listIndex - 1];
			}
			startX = legendArea.start.x + padding + width;
			startY = legendArea.start.y + padding + (legendArea.height - height) / 2;
		}

		context.setFontSize(config.fontSize);
		for (let i = 0; i < itemList.length; i++) {
			let item = itemList[i];
			item.area = [0, 0, 0, 0];
			item.area[0] = startX;
			item.area[1] = startY;
			item.area[3] = startY + lineHeight;
			context.beginPath();
			context.setLineWidth(1 * opts.pixelRatio);
			context.setStrokeStyle(item.show ? item.color : opts.legend.hiddenColor);
			context.setFillStyle(item.show ? item.color : opts.legend.hiddenColor);
			switch (item.legendShape) {
				case 'line':
					context.moveTo(startX, startY + 0.5 * lineHeight - 2 * opts.pixelRatio);
					context.fillRect(startX, startY + 0.5 * lineHeight - 2 * opts.pixelRatio, 15 * opts.pixelRatio, 4 * opts.pixelRatio);
					break;
				case 'triangle':
					context.moveTo(startX + 7.5 * opts.pixelRatio, startY + 0.5 * lineHeight - 5 * opts.pixelRatio);
					context.lineTo(startX + 2.5 * opts.pixelRatio, startY + 0.5 * lineHeight + 5 * opts.pixelRatio);
					context.lineTo(startX + 12.5 * opts.pixelRatio, startY + 0.5 * lineHeight + 5 * opts.pixelRatio);
					context.lineTo(startX + 7.5 * opts.pixelRatio, startY + 0.5 * lineHeight - 5 * opts.pixelRatio);
					break;
				case 'diamond':
					context.moveTo(startX + 7.5 * opts.pixelRatio, startY + 0.5 * lineHeight - 5 * opts.pixelRatio);
					context.lineTo(startX + 2.5 * opts.pixelRatio, startY + 0.5 * lineHeight);
					context.lineTo(startX + 7.5 * opts.pixelRatio, startY + 0.5 * lineHeight + 5 * opts.pixelRatio);
					context.lineTo(startX + 12.5 * opts.pixelRatio, startY + 0.5 * lineHeight);
					context.lineTo(startX + 7.5 * opts.pixelRatio, startY + 0.5 * lineHeight - 5 * opts.pixelRatio);
					break;
				case 'circle':
					context.moveTo(startX + 7.5 * opts.pixelRatio, startY + 0.5 * lineHeight);
					context.arc(startX + 7.5 * opts.pixelRatio, startY + 0.5 * lineHeight, 5 * opts.pixelRatio, 0, 2 * Math.PI);
					break;
				case 'rect':
					context.moveTo(startX, startY + 0.5 * lineHeight - 5 * opts.pixelRatio);
					context.fillRect(startX, startY + 0.5 * lineHeight - 5 * opts.pixelRatio, 15 * opts.pixelRatio, 10 * opts.pixelRatio);
					break;
				default:
					context.moveTo(startX, startY + 0.5 * lineHeight - 5 * opts.pixelRatio);
					context.fillRect(startX, startY + 0.5 * lineHeight - 5 * opts.pixelRatio, 15 * opts.pixelRatio, 10 * opts.pixelRatio);
			}
			context.closePath();
			context.fill();
			context.stroke();

			startX += shapeWidth + shapeRight;
			let fontTrans = 0.5 * lineHeight + 0.5 * fontSize - 2;
			context.beginPath();
			context.setFontSize(fontSize);
			context.setFillStyle(item.show ? opts.legend.fontColor : opts.legend.hiddenColor);
			context.fillText(item.name, startX, startY + fontTrans);
			context.closePath();
			context.stroke();
			if (opts.legend.position == 'top' || opts.legend.position == 'bottom') {
				startX += measureText(item.name, fontSize) + itemGap;
				item.area[2] = startX;
			} else {
				item.area[2] = startX + measureText(item.name, fontSize) + itemGap;;
				startX -= shapeWidth + shapeRight;
				startY += lineHeight;
			}
		}
	});
}


function isRayIntersectsSegment(poi, s_poi, e_poi) {
	if (s_poi[1] == e_poi[1]) {
		return false;
	}
	if (s_poi[1] > poi[1] && e_poi[1] > poi[1]) {
		return false;
	}
	if (s_poi[1] < poi[1] && e_poi[1] < poi[1]) {
		return false;
	}
	if (s_poi[1] == poi[1] && e_poi[1] > poi[1]) {
		return false;
	}
	if (e_poi[1] == poi[1] && s_poi[1] > poi[1]) {
		return false;
	}
	if (s_poi[0] < poi[0] && e_poi[1] < poi[1]) {
		return false;
	}
	let xseg = e_poi[0] - (e_poi[0] - s_poi[0]) * (e_poi[1] - poi[1]) / (e_poi[1] - s_poi[1]);
	if (xseg < poi[0]) {
		return false;
	} else {
		return true;
	}
}

function isPoiWithinPoly(poi, poly) {
	let sinsc = 0;
	for (let i = 0; i < poly.length; i++) {
		let epoly = poly[i][0];
		if (poly.length == 1) {
			epoly = poly[i][0]
		}
		for (let j = 0; j < epoly.length - 1; j++) {
			let s_poi = epoly[j];
			let e_poi = epoly[j + 1];
			if (isRayIntersectsSegment(poi, s_poi, e_poi)) {
				sinsc += 1;
			}
		}
	}

	if (sinsc % 2 == 1) {
		return true;
	} else {
		return false;
	}
}


function drawCanvas(opts, context) {
	context.draw();
}

var Timing = {
	easeIn: function easeIn(pos) {
		return Math.pow(pos, 3);
	},
	easeOut: function easeOut(pos) {
		return Math.pow(pos - 1, 3) + 1;
	},
	easeInOut: function easeInOut(pos) {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 3);
		} else {
			return 0.5 * (Math.pow(pos - 2, 3) + 2);
		}
	},
	linear: function linear(pos) {
		return pos;
	}
};

function Animation(opts) {
	this.isStop = false;
	opts.duration = typeof opts.duration === 'undefined' ? 1000 : opts.duration;
	opts.timing = opts.timing || 'linear';
	var delay = 17;

	function createAnimationFrame() {
		if (typeof setTimeout !== 'undefined') {
			return function(step, delay) {
				setTimeout(function() {
					var timeStamp = +new Date();
					step(timeStamp);
				}, delay);
			};
		} else if (typeof requestAnimationFrame !== 'undefined') {
			return requestAnimationFrame;
		} else {
			return function(step) {
				step(null);
			};
		}
	};
	var animationFrame = createAnimationFrame();
	var startTimeStamp = null;
	var _step = function step(timestamp) {
		if (timestamp === null || this.isStop === true) {
			opts.onProcess && opts.onProcess(1);
			opts.onAnimationFinish && opts.onAnimationFinish();
			return;
		}
		if (startTimeStamp === null) {
			startTimeStamp = timestamp;
		}
		if (timestamp - startTimeStamp < opts.duration) {
			var process = (timestamp - startTimeStamp) / opts.duration;
			var timingFunction = Timing[opts.timing];
			process = timingFunction(process);

			opts.onProcess && opts.onProcess(process);
			animationFrame(_step, delay);
		} else {
			opts.onProcess && opts.onProcess(1);
			opts.onAnimationFinish && opts.onAnimationFinish();
		}
	};
	_step = _step.bind(this);
	animationFrame(_step, delay);
}

// stop animation immediately
// and tigger onAnimationFinish
Animation.prototype.stop = function() {
	this.isStop = true;
};

function drawCharts(type, opts, config, context) {
	var _this = this;
	var series = opts.series;
	var categories = opts.categories;
	series = fillSeries(series, opts, config);
	var duration = opts.animation ? opts.duration : 0;
	_this.animationInstance && _this.animationInstance.stop();
	var seriesMA = null;
	seriesMA = series;

	/* 过滤掉show=false的series */
	opts._series_ = series = filterSeries(series);

	//重新计算图表区域

	opts.area = new Array(4);
	//复位绘图区域
	for (let j = 0; j < 4; j++) {
		opts.area[j] = opts.padding[j];
	}

	//通过计算三大区域：图例、X轴、Y轴的大小，确定绘图区域
	var _calLegendData = calLegendData(seriesMA, opts, config, opts.chartData),
		legendHeight = _calLegendData.area.wholeHeight,
		legendWidth = _calLegendData.area.wholeWidth;

	switch (opts.legend.position) {
		case 'top':
			opts.area[0] += legendHeight;
			break;
		case 'bottom':
			opts.area[2] += legendHeight;
			break;
		case 'left':
			opts.area[3] += legendWidth;
			break;
		case 'right':
			opts.area[1] += legendWidth;
			break;
	}

	let _calYAxisData = {},
		yAxisWidth = 0;
	if (opts.type === 'line' || opts.type === 'column' || opts.type === 'area' || opts.type === 'mix' || opts.type ===
		'candle') {
		_calYAxisData = calYAxisData(series, opts, config);
		yAxisWidth = _calYAxisData.yAxisWidth;
		//如果显示Y轴标题
		if (opts.yAxis.showTitle) {
			let maxTitleHeight = 0;
			for (let i = 0; i < opts.yAxis.data.length; i++) {
				maxTitleHeight = Math.max(maxTitleHeight, opts.yAxis.data[i].titleFontSize ? opts.yAxis.data[i].titleFontSize :
					config.fontSize)
			}
			opts.area[0] += (maxTitleHeight + 6) * opts.pixelRatio;
		}
		let rightIndex = 0,
			leftIndex = 0;
		//计算主绘图区域左右位置
		for (let i = 0; i < yAxisWidth.length; i++) {
			if (yAxisWidth[i].position == 'left') {
				if (leftIndex > 0) {
					opts.area[3] += yAxisWidth[i].width + opts.yAxis.padding;
				} else {
					opts.area[3] += yAxisWidth[i].width;
				}
				leftIndex += 1;
			} else {
				if (rightIndex > 0) {
					opts.area[1] += yAxisWidth[i].width + opts.yAxis.padding;
				} else {
					opts.area[1] += yAxisWidth[i].width;
				}
				rightIndex += 1;
			}
		}
	} else {
		config.yAxisWidth = yAxisWidth;
	}
	opts.chartData.yAxisData = _calYAxisData;

	if (opts.categories && opts.categories.length) {
		opts.chartData.xAxisData = getXAxisPoints(opts.categories, opts, config);
		let _calCategoriesData = calCategoriesData(opts.categories, opts, config, opts.chartData.xAxisData.eachSpacing),
			xAxisHeight = _calCategoriesData.xAxisHeight,
			angle = _calCategoriesData.angle;
		config.xAxisHeight = xAxisHeight;
		config._xAxisTextAngle_ = angle;
		opts.area[2] += xAxisHeight;
		opts.chartData.categoriesData = _calCategoriesData;
	} else {
		opts.chartData.xAxisData = {
			xAxisPoints: []
		};
	}
	//计算右对齐偏移距离
	if (opts.enableScroll && opts.xAxis.scrollAlign == 'right' && opts._scrollDistance_ === undefined) {
		let offsetLeft = 0,
			xAxisPoints = opts.chartData.xAxisData.xAxisPoints,
			startX = opts.chartData.xAxisData.startX,
			endX = opts.chartData.xAxisData.endX,
			eachSpacing = opts.chartData.xAxisData.eachSpacing;
		let totalWidth = eachSpacing * (xAxisPoints.length - 1);
		let screenWidth = endX - startX;
		offsetLeft = screenWidth - totalWidth;
		_this.scrollOption = {
			currentOffset: offsetLeft,
			startTouchX: offsetLeft,
			distance: 0,
			lastMoveTime: 0
		};
		opts._scrollDistance_ = offsetLeft;
	}

	switch (type) {
		case 'column':
			this.animationInstance = new Animation({
				timing: 'easeIn',
				duration: duration,
				onProcess: function onProcess(process) {
					context.clearRect(0, 0, opts.width, opts.height);
					if (opts.rotate) {
						contextRotate(context, opts);
					}
					drawYAxisGrid(categories, opts, config, context);
					drawXAxis(categories, opts, config, context);
					var _drawColumnDataPoints = drawColumnDataPoints(series, opts, config, context, process),
						xAxisPoints = _drawColumnDataPoints.xAxisPoints,
						calPoints = _drawColumnDataPoints.calPoints,
						eachSpacing = _drawColumnDataPoints.eachSpacing;
					opts.chartData.xAxisPoints = xAxisPoints;
					opts.chartData.calPoints = calPoints;
					opts.chartData.eachSpacing = eachSpacing;
					drawYAxis(series, opts, config, context);
					if (opts.enableMarkLine !== false && process === 1) {
						drawMarkLine(opts, config, context);
					}
					drawLegend(opts.series, opts, config, context, opts.chartData);
					drawToolTipBridge(opts, config, context, process, eachSpacing, xAxisPoints);
					drawCanvas(opts, context);
				},
				onAnimationFinish: function onAnimationFinish() {
					_this.event.trigger('renderComplete');
				}
			});
			break;
	}
}

// simple event implement

function Event() {
	this.events = {};
}

Event.prototype.addEventListener = function(type, listener) {
	this.events[type] = this.events[type] || [];
	this.events[type].push(listener);
};

Event.prototype.trigger = function() {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	var type = args[0];
	var params = args.slice(1);
	if (!!this.events[type]) {
		this.events[type].forEach(function(listener) {
			try {
				listener.apply(null, params);
			} catch (e) {
				console.error(e);
			}
		});
	}
};

var Charts = function Charts(opts) {
	opts.pixelRatio = opts.pixelRatio ? opts.pixelRatio : 1;
	opts.fontSize = opts.fontSize ? opts.fontSize * opts.pixelRatio : 13 * opts.pixelRatio;
	opts.title = assign({}, opts.title);
	opts.subtitle = assign({}, opts.subtitle);
	opts.duration = opts.duration ? opts.duration : 1000;
	opts.yAxis = assign({}, {
		data: [],
		showTitle: false,
		disabled: false,
		disableGrid: false,
		splitNumber: 5,
		gridType: 'solid',
		dashLength: 4 * opts.pixelRatio,
		gridColor: '#cccccc',
		padding: 10,
		fontColor: '#666666'
	}, opts.yAxis);
	opts.yAxis.dashLength *= opts.pixelRatio;
	opts.yAxis.padding *= opts.pixelRatio;
	opts.xAxis = assign({}, {
		rotateLabel: false,
		type: 'calibration',
		gridType: 'solid',
		dashLength: 4,
		scrollAlign: 'left',
		boundaryGap: 'center',
		axisLine: true,
		axisLineColor: '#cccccc'
	}, opts.xAxis);
	opts.xAxis.dashLength *= opts.pixelRatio;
	opts.legend = assign({}, {
		show: true,
		position: 'bottom',
		float: 'center',
		backgroundColor: 'rgba(0,0,0,0)',
		borderColor: 'rgba(0,0,0,0)',
		borderWidth: 0,
		padding: 5,
		margin: 5,
		itemGap: 10,
		fontSize: opts.fontSize,
		lineHeight: opts.fontSize,
		fontColor: '#333333',
		format: {},
		hiddenColor: '#CECECE'
	}, opts.legend);
	opts.legend.borderWidth = opts.legend.borderWidth * opts.pixelRatio;
	opts.legend.itemGap = opts.legend.itemGap * opts.pixelRatio;
	opts.legend.padding = opts.legend.padding * opts.pixelRatio;
	opts.legend.margin = opts.legend.margin * opts.pixelRatio;
	opts.extra = assign({}, opts.extra);
	opts.rotate = opts.rotate ? true : false;
	opts.animation = opts.animation ? true : false;
	opts.rotate = opts.rotate ? true : false;

	let config$$1 = JSON.parse(JSON.stringify(config));
	config$$1.colors = opts.colors ? opts.colors : config$$1.colors;
	config$$1.yAxisTitleWidth = opts.yAxis.disabled !== true && opts.yAxis.title ? config$$1.yAxisTitleWidth : 0;
	if (opts.type == 'pie' || opts.type == 'ring') {
		config$$1.pieChartLinePadding = opts.dataLabel === false ? 0 : opts.extra.pie.labelWidth * opts.pixelRatio ||
			config$$1.pieChartLinePadding * opts.pixelRatio;
	}
	if (opts.type == 'rose') {
		config$$1.pieChartLinePadding = opts.dataLabel === false ? 0 : opts.extra.rose.labelWidth * opts.pixelRatio ||
			config$$1.pieChartLinePadding * opts.pixelRatio;
	}
	config$$1.pieChartTextPadding = opts.dataLabel === false ? 0 : config$$1.pieChartTextPadding * opts.pixelRatio;
	config$$1.yAxisSplit = opts.yAxis.splitNumber ? opts.yAxis.splitNumber : config.yAxisSplit;

	//屏幕旋转
	config$$1.rotate = opts.rotate;
	if (opts.rotate) {
		let tempWidth = opts.width;
		let tempHeight = opts.height;
		opts.width = tempHeight;
		opts.height = tempWidth;
	}

	//适配高分屏
	opts.padding = opts.padding ? opts.padding : config$$1.padding;
	for (let i = 0; i < 4; i++) {
		opts.padding[i] *= opts.pixelRatio;
	}
	config$$1.yAxisWidth = config.yAxisWidth * opts.pixelRatio;
	config$$1.xAxisHeight = config.xAxisHeight * opts.pixelRatio;
	if (opts.enableScroll && opts.xAxis.scrollShow) {
		config$$1.xAxisHeight += 6 * opts.pixelRatio;
	}
	config$$1.xAxisLineHeight = config.xAxisLineHeight * opts.pixelRatio;
	config$$1.fontSize = opts.fontSize;
	config$$1.titleFontSize = config.titleFontSize * opts.pixelRatio;
	config$$1.subtitleFontSize = config.subtitleFontSize * opts.pixelRatio;
	config$$1.toolTipPadding = config.toolTipPadding * opts.pixelRatio;
	config$$1.toolTipLineHeight = config.toolTipLineHeight * opts.pixelRatio;
	config$$1.columePadding = config.columePadding * opts.pixelRatio;
	opts.$this = opts.$this ? opts.$this : this;

	this.context = uni.createCanvasContext(opts.canvasId, opts.$this);
	/* 兼容原生H5
	this.context = document.getElementById(opts.canvasId).getContext("2d");
	this.context.setStrokeStyle = function(e){ return this.strokeStyle=e; }
	this.context.setLineWidth = function(e){ return this.lineWidth=e; }
	this.context.setLineCap = function(e){ return this.lineCap=e; }
	this.context.setFontSize = function(e){ return this.font=e+"px sans-serif"; }
	this.context.setFillStyle = function(e){ return this.fillStyle=e; }
	this.context.draw = function(){ }
	*/

	opts.chartData = {};
	opts.len=[];
	this.event = new Event();
	this.scrollOption = {
		currentOffset: 0,
		startTouchX: 0,
		distance: 0,
		lastMoveTime: 0
	};

	this.opts = opts;
	this.config = config$$1;

	drawCharts.call(this, opts.type, opts, config$$1, this.context);
};

Charts.prototype.updateData = function() {
	let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	this.opts = assign({}, this.opts, data);
	this.opts.updateData = true;
	let scrollPosition = data.scrollPosition || 'current';
	switch (scrollPosition) {
		case 'current':
			this.opts._scrollDistance_ = this.scrollOption.currentOffset;
			break;
		case 'left':
			this.opts._scrollDistance_ = 0;
			this.scrollOption = {
				currentOffset: 0,
				startTouchX: 0,
				distance: 0,
				lastMoveTime: 0
			};
			break;
		case 'right':
			let _calYAxisData = calYAxisData(this.opts.series, this.opts, this.config),
				yAxisWidth = _calYAxisData.yAxisWidth;
			this.config.yAxisWidth = yAxisWidth;
			let offsetLeft = 0;
			let _getXAxisPoints0 = getXAxisPoints(this.opts.categories, this.opts, this.config),
				xAxisPoints = _getXAxisPoints0.xAxisPoints,
				startX = _getXAxisPoints0.startX,
				endX = _getXAxisPoints0.endX,
				eachSpacing = _getXAxisPoints0.eachSpacing;
			let totalWidth = eachSpacing * (xAxisPoints.length - 1);
			let screenWidth = endX - startX;
			offsetLeft = screenWidth - totalWidth;
			this.scrollOption = {
				currentOffset: offsetLeft,
				startTouchX: offsetLeft,
				distance: 0,
				lastMoveTime: 0
			};
			this.opts._scrollDistance_ = offsetLeft;
			break;
	}
	drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
};

Charts.prototype.zoom = function() {
	var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.opts.xAxis.itemCount;
	if (this.opts.enableScroll !== true) {
		console.log('请启用滚动条后使用！')
		return;
	}
	//当前屏幕中间点
	let centerPoint = Math.round(Math.abs(this.scrollOption.currentOffset) / this.opts.chartData.eachSpacing) + Math.round(
		this.opts.xAxis.itemCount / 2);
	this.opts.animation = false;
	this.opts.xAxis.itemCount = val.itemCount;
	//重新计算x轴偏移距离
	let _calYAxisData = calYAxisData(this.opts.series, this.opts, this.config),
		yAxisWidth = _calYAxisData.yAxisWidth;
	this.config.yAxisWidth = yAxisWidth;
	let offsetLeft = 0;
	let _getXAxisPoints0 = getXAxisPoints(this.opts.categories, this.opts, this.config),
		xAxisPoints = _getXAxisPoints0.xAxisPoints,
		startX = _getXAxisPoints0.startX,
		endX = _getXAxisPoints0.endX,
		eachSpacing = _getXAxisPoints0.eachSpacing;
	let centerLeft = eachSpacing * centerPoint;
	let screenWidth = endX - startX;
	let MaxLeft = screenWidth - eachSpacing * (xAxisPoints.length - 1);
	offsetLeft = screenWidth / 2 - centerLeft;
	if (offsetLeft > 0) {
		offsetLeft = 0;
	}
	if (offsetLeft < MaxLeft) {
		offsetLeft = MaxLeft;
	}
	this.scrollOption = {
		currentOffset: offsetLeft,
		startTouchX: offsetLeft,
		distance: 0,
		lastMoveTime: 0
	};
	this.opts._scrollDistance_ = offsetLeft;
	drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
};

Charts.prototype.stopAnimation = function() {
	this.animationInstance && this.animationInstance.stop();
};

Charts.prototype.addEventListener = function(type, listener) {
	this.event.addEventListener(type, listener);
};

Charts.prototype.getCurrentDataIndex = function(e) {
	var touches = null;
	if (e.changedTouches) {
		touches = e.changedTouches[0];
	} else {
		touches = e.mp.changedTouches[0];
	}
	if (touches) {
		let _touches$ = getTouches(touches, this.opts, e);
		return findCurrentIndex({
			x: _touches$.x,
			y: _touches$.y
		}, this.opts.chartData.calPoints, this.opts, this.config, Math.abs(this.scrollOption.currentOffset));
	}
	return -1;
};

Charts.prototype.getLegendDataIndex = function(e) {
	var touches = null;
	if (e.changedTouches) {
		touches = e.changedTouches[0];
	} else {
		touches = e.mp.changedTouches[0];
	}
	if (touches) {
		let _touches$ = getTouches(touches, this.opts, e);
		return findLegendIndex({
			x: _touches$.x,
			y: _touches$.y
		}, this.opts.chartData.legendData);
	}
	return -1;
};

Charts.prototype.touchLegend = function(e) {
	var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var touches = null;
	if (e.changedTouches) {
		touches = e.changedTouches[0];
	} else {
		touches = e.mp.changedTouches[0];
	}
	if (touches) {
		var _touches$ = getTouches(touches, this.opts, e);
		var index = this.getLegendDataIndex(e);
		if (index >= 0) {
			this.opts.series[index].show = !this.opts.series[index].show;
			this.opts.animation = option.animation ? true : false;
			this.opts._scrollDistance_ = this.scrollOption.currentOffset;
			drawCharts.call(this, this.opts.type, this.opts, this.config, this.context);
		}
	}

};

Charts.prototype.showToolTip = function(e) {
	var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var touches = null;
	if (e.changedTouches) {
		touches = e.changedTouches[0];
	} else {
		touches = e.mp.changedTouches[0];
	}
	if (!touches) {
		console.log("touchError");
	}
	var _touches$ = getTouches(touches, this.opts, e);
	var currentOffset = this.scrollOption.currentOffset;
	var opts = assign({}, this.opts, {
		_scrollDistance_: currentOffset,
		animation: false
	});
	if (this.opts.type === 'line' || this.opts.type === 'area' || this.opts.type === 'column') {
		var index = this.getCurrentDataIndex(e);
		if (index > -1) {
			var seriesData = getSeriesDataItem(this.opts.series, index);
			if (seriesData.length !== 0) {
				var _getToolTipData = getToolTipData(seriesData, this.opts.chartData.calPoints, index, this.opts.categories,
						option),
					textList = _getToolTipData.textList,
					offset = _getToolTipData.offset;
				offset.y = _touches$.y;
				opts.tooltip = {
					textList: textList,
					offset: offset,
					option: option,
					index: index
				};
			}
		}
		drawCharts.call(this, opts.type, opts, this.config, this.context);
	}
};

Charts.prototype.translate = function(distance) {
	this.scrollOption = {
		currentOffset: distance,
		startTouchX: distance,
		distance: 0,
		lastMoveTime: 0
	};
	let opts = assign({}, this.opts, {
		_scrollDistance_: distance,
		animation: false
	});
	drawCharts.call(this, this.opts.type, opts, this.config, this.context);
};

Charts.prototype.scrollStart = function(e) {
	var touches = null;
	if (e.changedTouches) {
		touches = e.changedTouches[0];
	} else {
		touches = e.mp.changedTouches[0];
	}
	var _touches$ = getTouches(touches, this.opts, e);
	if (touches && this.opts.enableScroll === true) {
		this.scrollOption.startTouchX = _touches$.x;
	}
};

Charts.prototype.scroll = function(e) {
	if (this.scrollOption.lastMoveTime === 0) {
		this.scrollOption.lastMoveTime = Date.now();
	}
	let Limit = this.opts.extra.touchMoveLimit || 20;
	let currMoveTime = Date.now();
	let duration = currMoveTime - this.scrollOption.lastMoveTime;
	if (duration < Math.floor(1000 / Limit)) return;
	this.scrollOption.lastMoveTime = currMoveTime;
	var touches = null;
	if (e.changedTouches) {
		touches = e.changedTouches[0];
	} else {
		touches = e.mp.changedTouches[0];
	}
	if (touches && this.opts.enableScroll === true) {
		var _touches$ = getTouches(touches, this.opts, e);
		var _distance;
		_distance = _touches$.x - this.scrollOption.startTouchX;
		var currentOffset = this.scrollOption.currentOffset;
		var validDistance = calValidDistance(this, currentOffset + _distance, this.opts.chartData, this.config, this.opts);
		this.scrollOption.distance = _distance = validDistance - currentOffset;
		var opts = assign({}, this.opts, {
			_scrollDistance_: currentOffset + _distance,
			animation: false
		});
		drawCharts.call(this, opts.type, opts, this.config, this.context);
		return currentOffset + _distance;
	}
};

Charts.prototype.scrollEnd = function(e) {
	if (this.opts.enableScroll === true) {
		var _scrollOption = this.scrollOption,
			currentOffset = _scrollOption.currentOffset,
			distance = _scrollOption.distance;
		this.scrollOption.currentOffset = currentOffset + distance;
		this.scrollOption.distance = 0;
	}
};
if (typeof module === "object" && typeof module.exports === "object") {
	module.exports = Charts;
	//export default Charts;//建议使用nodejs的module导出方式，如报错请使用export方式导出
}
