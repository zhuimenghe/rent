<template>
	<view class="pop-container">
		<uni-popup ref="deviceDialog" type="center" :mask-click="false">
			<view class="uni-tip">
				<view class="row-item" @click="clickLocal">
					<view class="row-tag"><text>现场扫码</text></view>
				</view>
				<view class="row-item" @click="clickDevice">
					<view class="row-tag"><text>手动录入</text></view>
				</view>
				<view class="row-item" style="background: #dcdcdc;" @click="clickCancle">
					<view class="row-tag"><text>取消</text></view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
export default {
	components: {
		uniPopup
	},
	props: {
		showDialog: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: 'repair'
		},
	},
	watch: {
		showDialog: {
			handler(val) {
				if(val){
					this.$refs.deviceDialog.open();
					
				}else{
					this.$refs.deviceDialog.close();
				}
			}
		},
	},
	data() {
		return {};
	},
	created() {},
	methods: {
		chooseThisCar(item){
			if(this.type == "maintain"){
				if(!item.bindRules || item.bindRules === null){
					uni.showToast({
						title:"请先绑定保养规则后再进行保养",
						icon:"none"
					})
					return
				}
				let url = "./create-maintain?isLocal=1&itemmachine=" + encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url:url
				})
			}else if(this.type == "check"){
				if(!item.bindRules || item.bindRules === null){
					uni.showToast({
						title:"请先绑定检修规则后再进行检修",
						icon:"none"
					})
					return
				}
				let url = "./create-service?isLocal=1&itemmachine=" + encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url:url
				})
			}else if(this.type == "polling"){
				if(!item.bindRules || item.bindRules === null){
					uni.showToast({
						title:"请先绑定巡检规则后再进行巡检",
						icon:"none"
					})
					return
				}
				let url = "./create-polling?isLocal=1&itemmachine=" + encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url:url
				})
			}else if(this.type == "battery"){
				if(!item.bindRules || item.bindRules === null){
					uni.showToast({
						title:"请先绑定电池巡检规则后再进行电池巡检",
						icon:"none"
					})
					return
				}
				let url = "./create-battery-polling?isLocal=1&itemmachine=" + encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url:url
				})
			}else{
				let url = "./create-repair?isLocal=1&itemmachine=" + encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url:url
				})
			}
		},
		clickDevice(){
			this.$refs.deviceDialog.close();
			let url = "/devicePages/repair/create-choose-car?type=" + this.type
			uni.navigateTo({
				url:url
			})
		},
		clickLocal(){
			this.$refs.deviceDialog.close();
			uni.scanCode({
				success: (res) => {
					let codeResult = res.result;
					let licenseId = this.$datestr.getQueryString('licenseId', codeResult);
					if(!licenseId || licenseId ==null || licenseId ==""){
						uni.showToast({
							title:"暂无该车辆",
							icon:'none',
							mask:true
						})
						return
					}
					this.loadCarMessage(licenseId)
				}
			});
		},
		loadCarMessage(keyWord){
			uni.showLoading();
			let param= {
				current: this.page,
				size: 1,
				licenseId: keyWord,
				// keyword:keyWord
			}
			let url = this.$url.MACHINE_RECORD
			if(this.type == "maintain"){
				url = url + "?type=1"
			}else if(this.type == "check"){
				url = url + "?type=2"
			}else if(this.type == "polling"){
				url = url + "?type=3"
			}else if(this.type == "battery"){
				url = url + "?type=4"
			}
			this.$network.getData(url, 'POST', param).then(result => {
				if(result.records.length > 0){
					this.chooseThisCar(result.records[0])
				}else{
					uni.showToast({
						title:"暂无该车辆",
						icon:'none',
						mask:true
					})
				}
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		},
		clickCancle(){
			this.$refs.deviceDialog.close();
		}
	}
};
</script>
<style lang="scss">
.pop-container {
	position: relative;
	z-index: 400;
}

/* 提示窗口 */
.uni-tip {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	padding: 15px;
	width: 300px;
	background-color: #fff;
	border-radius: 10px;
	justify-content: center;
	align-items: center;
}

.tip-title {
	display: flex;
	padding: 5px;
	width: 290px;
	border-width: 0px 0px 1px 0px;
	border-color: $uni-bg-color-grey;
	border-style: solid;
	color: $uni-text-color;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	justify-content: center;
	align-items: center;
}

.row-item {
	display: flex;
	width: 270px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin: 10px;
	padding: 10px;
	background: $uni-color-primary;
	color: #ffffff;
	font-size: $uni-font-size-base;
	border-radius: 5px;
}

.row-tag {
	width: 98px;
	text-align: center;
}
</style>
