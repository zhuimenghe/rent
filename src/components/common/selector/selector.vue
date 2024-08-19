<template>
	<view class="container" :class="column">
		<view v-for="(v, i) in list" :key="i" class="item-container">
			<view class="item"  :class=" { active: (type == 'radio' && defaultIndex == i) || (type == 'checkbox' && v.checked) }" :data-i="i" @tap="change($event, v, i)">
				{{ v.text || v.label }}
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'selector',
	data() {
		return {};
	},
	props: {
		defaultIndex: {
			type: Number,
			default: 1
		},
		type: {
			type: String,
			default: 'checkbox'
		},
		column: {
			type: String,
			default: null
		},
		list: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	methods: {
		/* 切换 */
		/**
		 * @param {Object} e
		 * @param {Object} info
		 * @param {Object} index list中选中label的索引
		 */
		change(e, info, index) {
			let i = Number(e.currentTarget.dataset.i);
			/* 单选框 */
			if (this.type == 'radio') {
				// this.defaultIndex = i;
				this.$nextTick(() => {
					this.$emit('change', info, index);
				});
				return;
			}

			this.$nextTick(() => {
				this.$emit('change', index);
			});
		},
		/* 设置值 */
		set(data) {
			let [type, index] = ['checkbox', -1];
			let column = ['', 'col_1', 'col_2', 'col_3'];
			if (data.type == 'radio') {
				type = 'radio';
				index = data.index >= 0 ? data.index : -1;
			}
			this.column = data.column in column ? column[data.column] : '';
			this.type = type;
			this.defaultIndex = index;
			this.list = data.list;
		},
		/* 获取值 */
		get(e) {
			/* 单选框 */
			if (this.type == 'radio') {
				if (this.defaultIndex >= 0) {
					return e;
				} else {
					return null;
				}
			}

			let arr = [];
			this.list.forEach((item, index) => {
				if (item.checked == true) {
					arr.push(item);
				}
			});
			return arr.length > 0 ? arr : null;
		},
		/* 全部选中 */
		checkAll() {
			if (this.type == 'radio') {
				return null;
			}
			this.list.forEach((item, index) => {
				this.$set(this.list[index], 'checked', true);
			});
		},
		/* 取消全部选中 */
		cancelAll() {
			if (this.type == 'radio') {
				this.defaultIndex = 0;
				return null;
			}
			this.list.forEach((item, index) => {
				this.$set(this.list[index], 'checked', false);
			});
		},
		/* 反选全部 */
		invertAll() {
			if (this.type == 'radio') {
				this.defaultIndex = 0;
				return null;
			}
			this.list.forEach((item, index) => {
				this.$set(this.list[index], 'checked', item.checked ? false : true);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	flex: 1;
	justify-content: flex-start;
	align-items: flex-start;
	align-content: flex-start;
	margin-right: -20rpx;
	font-size: 14px;
	text-align: center;
}

.item-container {
	margin-bottom: 8px;
	padding-right: 8px;
	box-sizing: border-box;
}
/**
	 * 列数
	 */
// &.col_1 {
// 	&>view {
// 		width: 100%;
// 	}
// }

// &.col_2 {
// 	&>view {
// 		width: 50%;
// 	}
// }

// &.col_3 {
// 	&>view {
// 		width: 33.3333333%;
// 	}
// }

.item {
	padding: 4px 6px;
	box-sizing: border-box;
	border-radius: 4px;
	border: #e5e5e5 solid 1px;
	background-color: #fff;
	color: #333;
	position: relative;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;

	&.active {
		background-color: #f2ffff;
		color: #E60000;
		border: #E60000 solid 1px;

		//右下角标
		// &::before{
		// 	content: '';
		// 	display:block;
		// 	width: 20px;
		// 	height: 20px;
		// 	background-color: #E60000;
		// 	position: absolute;
		// 	right: -1px;
		// 	bottom: -1px;
		// 	z-index: 1;
		// 	// clip-path: polygon(100% 0, 0% 100%, 100% 100%);
		// }
		// &::after{
		// 	content: '';
		// 	display:block;
		// 	width: 4px;
		// 	height: 8px;
		// 	border-right: #fff solid 2px;
		// 	border-bottom: #fff solid 2px;
		// 	transform:rotate(25deg);
		// 	position: absolute;
		// 	right: 2px;
		// 	bottom: 3px;
		// 	z-index: 2;
		// }
	}
}
</style>
