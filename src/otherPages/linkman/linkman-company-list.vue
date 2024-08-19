<template>
	<view class="linkman-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="list-bg-view">
			<list class="list">
				<cell v-for="(item, index) in datalist" :key="index">
					<view class="cell-view">
						<view class="cell-view-bgss" @click="Gocompany(item)">
							<view class="cell-view-cell">
								<view class="cell-view-cell-left"><text>联系人:</text></view>
								<view class="cell-view-cell-right">
									<text>{{ item.name }}</text>
								</view>
							</view>
							<view class="cell-view-cell">
								<view class="cell-view-cell-left"><text>手机号:</text></view>
								<view class="cell-view-cell-right">
								<labelPhone :value="item.phoneNum"/>
								</view>
							</view>
							<view v-for="(d,i) in item.secondaryPhoneList" :key = "i">
								<view class="cell-view-cell">
									<view class="cell-view-cell-left"><text>副手机号{{i + 1}}</text></view>
									<view class="cell-view-cell-right">
										<labelPhone :value="d"/>
									</view>
								</view>
							</view>
							<view class="cell-view-cell">
								<view class="cell-view-cell-left"><text>职位:</text></view>
								<view class="cell-view-cell-right">
									<text>{{ getdutyStr(item.dutyList) }}</text>
								</view>
							</view>
						</view>
						<view class="cell-line-view" />
						<view class="cell-view-bottom" @click="editconnect(item, index)">
							<i class="iconfont cell-view-bottom-image iconzl--bianji"></i>
							<text>修改联系人</text>
						</view>
					</view>
				</cell>
				<cell><view class="bottom-padding" /></cell>
				<cell>
					<view class="cell-input-view" style="margin-top: 10px;">
						<view class="add-contract-view" @click="gotoconnect"><text>+ 新增联系人</text></view>
					</view>
				</cell>
			</list>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="pop-bgView"><view></view></view>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
import labelPhone from '@/components/common/common-ui/label-phone.vue';
export default {
	components: {
		uniPopup,
		labelPhone
	},
	data() {
		return {
			datalist: [],
			customerObj: {},
			isnext: true,
			dutyType:'',
			delta:2
		};
	},
	methods: {
		editconnect(item, index) {
			item={
				...item,
				type:1
			}
			let url = './connect-create?item=' + encodeURIComponent(JSON.stringify(item)) + '&edit=true&index=' + index;
			uni.navigateTo({
				url: url
			});
		},
		gotoconnect() {
			let item={
				type:1
			}
			let url = './connect-create?edit=false'+'&item=' + encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: url 
			});
		},
		getdutyStr(list) {
			let strlist = [];
			list.map(item => {
				if (item === '1') {
					strlist.push('法人');
				}
				if (item === '2') {
					strlist.push('合同');
				}
				if (item === '3') {
					strlist.push('结算');
				}
				if (item === '4') {
					strlist.push('进退场');
				}
			});
			let str = strlist.join(',');
			return str;
		},
		//修改膜层
		editcontract(item) {
			this.$refs.popup.open();
		},
		//加载数据
		loadData() {
			uni.showLoading();
			let url = this.$url.LINKMAN_COMPANY_LIST + this.customerObj.id+'?dutyTypeSort='+this.dutyType;
			this.$network
				.getData(url, 'GET', null)
				.then(result => {
					this.datalist = result;
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		},
		Gocompany(item) {
			if (this.isnext === false) {
				return;
			}
			uni.$emit('linkman-emit', {
				dict: item,
				customer: this.customerObj
			});
			uni.navigateBack({
				delta: this.delta,
				animationDuration: 200
			});
		},
		httpToNet(item){
			let method = "POST";
			if(item.index != -1){
				method = "PUT"
			}
			let dict = item.item;
			dict.customerId = this.customerObj.id;
			this.$network
				.getData(this.$url.LINKMAN_PERSON_CONNECT, method, dict)
				.then(result => {
					uni.hideLoading();
					this.loadData();
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: err.details&&err.details[0]?err.details[0]:err.message,
						icon: 'none'
					});
					
				});
		},
	},
	onLoad(option) {
		this.customerObj = JSON.parse(decodeURIComponent(option.item));
		this.dutyType = option.dutyType;
		this.loadData();
		if (option.isedit == 'true') {
			this.isnext = false;
		}
		this.delta = option.delta?Number(option.delta):2
		uni.$on('refreshData-connect', item => {
			this.httpToNet(item)
		});
	},
	onUnload() {
		uni.$off('refreshData-connect');
	}
};
</script>

<style lang="scss" scoped>
.linkman-view {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}
.list-bg-view {
	display: flex;
	flex: 1;
	background: $uni-bg-color-grey;
}
.list {
	display: flex;
	flex-direction: column;
	flex: 1;
}
.cell-view {
	display: flex;
	flex: 1;
	flex-direction: column;
	border-width: 1px;
	border-color: #eeeeee;
	border-style: solid;
	border-radius: 10px;
	justify-content: flex-start;
	margin-left: 15px;
	margin-right: 15px;
	background: #ffffff;
	margin-top: 10px;
	padding-bottom: 10px;
}
.cell-view-bgss {
	display: flex;
	flex: 1;
	flex-direction: column;
}
.cell-view-cell {
	display: flex;
	flex: 1;
	flex-direction: row;
	margin-top: 5px;
}
.cell-view-cell-left {
	display: flex;
	flex: 1;
	margin-left: 10px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.cell-view-cell-right {
	margin-right: 10px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}
.cell-line-view {
	flex: 1;
	margin-top: 5px;
	background: #eeeeee;
	height: 1px;
	margin-left: 5px;
	margin-right: 5px;
}
.cell-view-bottom {
	display: flex;
	flex: 1;
	justify-content: center;
	font-size: $uni-font-size-base;
	color: $uni-text-color-gray;
	margin-top: 5px;
}
.cell-view-bottom-image {
	font-size: 15px;
	color: $uni-text-color-gray;
	margin-right: 5px;
}
.bottom-padding {
	flex: 1;
	background: #F5F4F9;
	height: 10px;
}
//弹出层
.pop-bgView {
	display: flex;
	flex-direction: column;
	padding: 15px;
	width: 300px;
	background-color: #ffffff;
	border-radius: 10px;
}
.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	margin-left: 15px;
	margin-right: 15px;
	height: 45px;
	font-size: $uni-font-size-base;
}
.add-contract-view {
	display: flex;
	flex: 1;
	height: 40px;
	margin-left: 20px;
	margin-right: 20px;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	background: $uni-color-primary;
	font-size: $uni-font-size-base;
}
</style>
