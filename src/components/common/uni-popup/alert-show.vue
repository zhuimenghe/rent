<template>
	<view v-if="showPopup" class="uni-popup" @touchmove.stop = "nothing">
		<view class="transClass" @click.stop="clear">
			<view class="uni-tip">
				<view class="title-view">
					<text style="text-align: center;">{{title}}</text>
					<text>{{msg}}</text>
				</view>
				<view class="flow-choose">
					<view class="cell-style">
						<view class="cell-style-left">
							<text>车号</text>
						</view>
						<view class="cell-style-right">
							<text>自喷码</text>
						</view>
					</view>
					<scroll-view scroll-y="true" style="margin-top: 5px;margin-bottom: 5px;height: 150px;">
						<view class="cell-style" v-for="(item,index) in dataList" :key = "index">
							<view class="cell-style-left">
								<text>{{item.licenseId || '--'}}</text>
							</view>
							<view class="cell-style-right">
								<text>{{item.printCode || '-'}}</text>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="uni-tip-group-button">
					<text class="uni-tip-button pop-cancel" @click="clickCancle">取消</text>
					<text class="uni-tip-button pop-confirm" @click="clickOk">确定</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import uniTransition from './uni-transition.vue';
export default {
	components: {
		uniTransition
	},
	props: {
		// maskClick
		dataList: {
			type: Array,
			default: []
		},
		msg: {
			type: String,
			default: ""
		},
		title: {
			type: String,
			default: ""
		},
	},
	data() {
		return {
			//===========================
			showPopup: false,
			showTrans: false,
			ani:['zoom-out', 'fade'],
			maskClass: {
				position: 'fixed',
				bottom: 0,
				top: 0,
				left: 0,
				right: 0,
				backgroundColor: 'rgba(0, 0, 0, 0.4)'
			}, //动画
			transClass: {
				'position': 'fixed',
				'display': 'flex',
				'flexDirection': 'column',
				'bottom': 0,
				'left': 0,
				'right': 0,
				'top': 0,
				'justifyContent': 'center',
				'alignItems': 'center'
			} //动画
		};
	},
	created() {
		
		
		
	},
	methods: {
		nothing(){
			return
		},
		clear(e) {
			e.stopPropagation();
		},
		open() {
			this.showPopup = true;
			this.$nextTick(() => { 
				setTimeout(() => {
					this.showTrans = true;
				}, 50);
			});
			this.$emit('change', {
				show: true
			});
		},
		close(type) {
			this.showTrans = false;
			this.$nextTick(() => {
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.$emit('change', {
						show: false
					});
					this.showPopup = false;
				}, 300);
			});
		},
		onTap() {
			if (!this.maskClick) return;
			this.close();
		},
		clickOk() {
			this.$emit('clickOk', {

			});
		},
		clickCancle(){
			this.close();
		}
	}
};
</script>
<style lang="scss" scoped>
.uni-popup {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	backgroundColor: #000000;
	z-index: 999;
}

.uni-popup__mask {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: $uni-bg-color-mask;
	opacity: 0;
}

.mask-ani {
	transition-property: opacity;
	transition-duration: 0.2s;
}

.uni-top-mask {
	opacity: 1;
}

.uni-bottom-mask {
	opacity: 1;
}

.uni-center-mask {
	opacity: 1;
}

.uni-popup__wrapper {
	/* #ifndef APP-NVUE */
	display: block;
	/* #endif */
	position: absolute;
}

.top {
	top: 0;
	left: 0;
	right: 0;
	transform: translateY(-500px);
}

.bottom {
	bottom: 0;
	left: 0;
	right: 0;
	transform: translateY(500px);
}

.center {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	bottom: 0;
	left: 0;
	right: 0;
	top: 0;
	justify-content: center;
	align-items: center;
	transform: scale(1.2);
	opacity: 0;
}

.uni-popup__wrapper-box {
	position: relative;
	display: flex;
	z-index: 600;
}

.content-ani {
	// transition: transform 0.3s;
	transition-property: transform, opacity;
	transition-duration: 0.2s;
}

.uni-top-content {
	transform: translateY(0);
}

.uni-bottom-content {
	transform: translateY(0);
}

.uni-center-content {
	transform: scale(1);
	opacity: 1;
}
.transClass {
	position: fixed;
	display: flex;
	flex-direction: column;
	bottom: 0;
	left: 0;
	right: 0;
	top: 0;
	justify-content: center;
	align-items: center;
}
.uni-tip {
	position: relative;
	display: flex;
	flex-direction: column;
	padding: 15px;
	background-color: #ffffff;
	border-radius: 10px;
	width: 300px;
}
.title-view{
	display: flex;
	flex-direction: column;
	justify-content:center;
	align-items: center;
	margin-top: 10px;
	margin-bottom: 10px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.flow-choose {
	display: flex;
	max-height: 200px;
	flex-direction: column;
	background: #ffffff;
	border-radius: 4px;
	z-index: 500;
}
.cell-style{
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	
}
.cell-style-left{
	display: flex;
	flex: 1;
	margin-top: 5px;
	margin-bottom: 5px;
	justify-content: center;
	font-size: $uni-font-size-sm;
	color: $uni-text-color;
}
.cell-style-right{
	display: flex;
	flex: 1;
	margin-top: 5px;
	margin-bottom: 5px;
	justify-content: center;
	font-size: $uni-font-size-sm;
	color: $uni-text-color;
}
.uni-tip-group-button {
	display: flex;
	flex-direction: row;
	margin-top: 20px;
}

.uni-tip-button {
	flex: 1;
	text-align: center;
	padding: 8px;

	font-size: $uni-font-size-base;
}

.pop-cancel {
	margin-right: 8px;
	color: $uni-text-color-gray;
	background: $uni-bg-color-grey;
	border-radius: 4px;
}

.pop-confirm {
	color: #ffffff;
	margin-left: 8px;
	background: $uni-color-primary;
	border-radius: 4px;
}
</style>
