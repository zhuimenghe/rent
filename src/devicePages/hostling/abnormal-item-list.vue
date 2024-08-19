<template>
	<view class="creat-proceeds-bg">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<list class="list-style">
			<cell class="cell-style" v-for="(item, index) in checkItemList" :key="index" v-if="showcell(item)">
				<view class="cell-left-view  title-style">
					<text>{{ item.programName || '' }}</text>
				</view>
				<view class="cell-style-sub" v-for="(itemsub, indexsub) in item.rulesProjectContents" :key="indexsub" v-if="!itemsub.checked" >
					<mycheckbox
					class="checkbox"
					:checked="itemsub.checked" 
					color="#E60000" 
					:disabled="true"
					/>
					<text>{{ itemsub.operationContent || '' }}</text>
					<view class="input-style-borad">
						<text>{{ itemsub.remark || '&nbsp;' }}</text>
					</view>
				</view>
			</cell>
		</list>
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
		if(option.item){
			let type = 'jx';
			if(option.type && option.type == 'xj'){
				type = "xj"
			}else if(option.type && option.type == 'dcxj'){
				type = "dcxj"
			}
			let dict = JSON.parse(decodeURIComponent(option.item));
			this.loaddata(dict.businessNo,type)
		}
	},
	onUnload() {},
	methods: {
		loaddata(key,type){
			uni.showLoading();
			let url = this.$url.STOCK_SERVICE_DETAIL
			if(type == "xj"){
				url = this.$url.MACHINE_POLLING_DETAIL
			}
			if(type == "dcxj"){
				url = this.$url.BATTERY_POLLING_DETAIL
			}
			let param= {
				businessNo:key
			}
			this.$network.getData(url, 'GET', param).then(result => {
				this.checkItemList = result.rulesProjects || []
				uni.hideLoading()
			}).catch(err => {
				uni.hideLoading()
			});
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
	color: $uni-text-color;
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
