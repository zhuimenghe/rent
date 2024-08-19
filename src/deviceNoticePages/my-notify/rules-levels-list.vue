<template>
	<view class="creat-proceeds-bg">
		<list class="list-style">
			<cell class="cell-style" v-for="(item, index) in checkItemList" :key="index">
				<view class="cell-left-view  title-style">
					<text>{{ item.programName || '' }}</text>
				</view>
				<view class="cell-style-sub" v-for="(itemsub, indexsub) in item.rulesProjectContents" :key="indexsub">
					<text style="margin-left: 20px;">{{ itemsub.operationContent || '' }}</text>
				</view>
			</cell>
		</list>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>
<script>
export default {
	components: {},
	computed:{},
	data() {
		return {
			checkItemList:[]
		};
	},
	onLoad(option) {
		if(option.levelId){
			let levelId = option.levelId;
			this.loaddata(levelId)
		}
	},
	onUnload() {},
	methods: {
		loaddata(levelId){
			uni.showLoading();
			let urlStr = this.$url.MAINTAIN_PROS_BY_LEVEL.replace(/{leverId}/, levelId) + "?state=1"
			this.$network.getData(urlStr, "GET", null).then((result) => {
				this.checkItemList = [...this.getContents(result)]
				uni.hideLoading();
			}).catch((err) => {
				uni.hideLoading();
			})
		},
		getContents(rawData) {
			if (!rawData) {
				return [];
			}
			return rawData.map((o, index) => {
				let co = o.rulesProjectContents.map(y => {
					return {
						...y,
						remark: '',
						checked: true
					}
				})
				return {
					...o,
					rulesProjectContents: [...co]
				}
			})
		},
		showcell(item){
			let rulesProjectContents = item.rulesProjectContents || [];
			return !rulesProjectContents.every(o=>o.checked == true)
		}
	}
};
</script>

<style lang="scss" scoped>
.creat-proceeds-bg {
	display: flex;
	flex: 1;
	width: 100%;
	flex-direction: column;
	background: $uni-bg-color-grey;
}
.list-style {
	display: flex;
	flex-direction: column;
	background: #FFFFFF;
}
.cell-style {
	display: flex;
	flex-direction: column;
	background: #ffffff;
	padding-top: 5px;
	padding-left: 10px;
}
.cell-style-sub {
	display: flex;
	flex-wrap:wrap;
	flex-direction: row;
	background: #ffffff;
	padding-top: 5px;
	padding-bottom: 5px;
	padding-left: 10px;
	border-bottom: 1px #EEEEEE solid;
	font-size: $uni-font-size-base;
	align-items: center;
	color: $uni-text-color;
}
.cell-left-view {
	display: flex;
	flex: 1;
	flex-direction: column;
	padding: 10px;
	border-bottom: 1px #EEEEEE solid;
}
.cell-right-view {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
	margin-left: 20px;
}
.title-style {
	font-size: $uni-font-size-base;
	color: $uni-text-color-grey;
}
.subtitle-style {
	font-size: $uni-font-size-base;
	color: $uni-color-primary;
}
.checkbox {
	transform: scale(0.8);
}
.line-s {
	margin-top: 5px;
	margin-left: 10px;
	margin-right: 10px;
	height: 1px;
	background: #eeeeee;
}
.input-style-borad {
	flex: 1;
	flex-wrap:wrap;
	text-align: right;
	font-size: $uni-font-size-base;
	margin-right: 10px;
	margin-left: 15px;
	padding: 5px;
	border: 1px;
	border-radius: 3px;
	border-style: solid;
	border-color: $uni-bg-color-grey;
}
</style>
