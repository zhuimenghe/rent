<template>
	<view class="linkman-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="add-container" @click="gotocreat"><i class="iconfont labelstyle iconadd"></i></view>
		<view class="tabstyle">
			<sun-tab
				:value.sync="index"
				:tabList="tabList"
				:scroll="false"
				@change="tabChange"
				activeColor="#E60000"
				activebgColor="#F5F4F9"
				defaultbgColor="#FFFFFF"
				:shownum="false"
			/>
			<view class="search-view">
				<view class="top-search">
					<icon class="search-icon" size="15" type="search" color="#F5F4F9" />
					<input style="margin-left: 10px;font-size: 14px; flex: 1;" v-model="searchkey" :placeholder="placestr" type="text" />
				</view>
				<view class="filter-view-style" @click="searchTo">搜索</view>
			</view>
		</view>
		<view class="list-bg-view">
			<list class="list">
				<cell v-for="(item, index) in dataList" :key="index">
					<view class="cell-view" @click="clickItem(item)">{{ item.name }}</view>
				</cell>
			</list>
		</view>
		<view><uni-load-more iconType="auto" :status="morestatus" /></view>

		<view class="pop-container">
			<uni-popup ref="startDialog" type="center" :mask-click="true">
				<view class="uni-tip">
					<view class="tip-title"><text>新建客户</text></view>
					<view class="row-item" @click="clickContract"><view class="row-tag">新建个人客户</view></view>
					<view class="row-item" @click="clickDevice"><view class="row-tag">新建企业客户</view></view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
import sunTab from '@/components/common/sun-tab/sun-tab.vue';
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
export default {
	components: {
		sunTab,
		uniPopup,
		uniLoadMore
	},
	data() {
		return {
			index: 0,
			tabList: ['个人', '企业'],
			person: true,
			showsublist: true, //是否跳转下一个页面
			searchkey: '',
			placestr: '公司名称/联系人/手机号', //姓名/手机号
			itemDic: {},
			dutyType: '', //1：法人；2：合同；3：结算；4：进退场；5：授权人
			dataList: [],
			currentpage: 1,
			morestatus: 'more',
			fromSource: ''
		};
	},
	onLoad(option) {
		if (option.nextview == 'false') {
			this.showsublist = false;
		}
		if (option.from == 'invoice') {
			this.fromSource = 'invoice';
		}
		if (option.item) {
			let item = JSON.parse(decodeURIComponent(option.item));
			this.itemDic = item;
		}
		this.dutyType = option.dutyType ? option.dutyType : '';
		this.loadData();
		uni.$on('refreshData-linkman', usnerinfo => {
			console.log(usnerinfo);
			let type = usnerinfo.type;
			this.person = type == 'person' ? true : false;
			this.headerrefresh();
		});
	},
	onUnload() {
		uni.$off('refreshData-linkman');
	},
	methods: {
		gotocreat() {
			this.$refs.startDialog.open();
		},
		clickDevice() {
			uni.navigateTo({
				url: './company-creat?edit=false&choose=1'
			});
			this.$refs.startDialog.close();
		},
		clickContract() {
			let url = './person-creat?edit=false&choose=1';
			uni.navigateTo({
				url: url
			});
			this.$refs.startDialog.close();
		},
		tabChange(e) {
			this.index = e.index;
			this.person = this.index == 0 ? true : false;
			if (this.person) {
				this.placestr = '姓名/手机号';
				this.searchkey = '';
			} else {
				this.placestr = '公司名称/联系人/手机号';
				this.searchkey = '';
			}
			this.headerrefresh();
		},
		clickItem(item) {
			if (this.person) {
				uni.$emit('linkman-emit-person', {
					dict: item,
				});
				uni.navigateBack({
					animationDuration: 200
				});
			} else {
				if (this.showsublist == false) {
					uni.$emit('linkman-emit-conpany', {
						dict: item,
					});
					uni.navigateBack({
						animationDuration: 200
					});
					return;
				} else {
					let url = './linkman-company-list?item=' + encodeURIComponent(JSON.stringify(item)) + '&dutyType=' + this.dutyType;
					uni.navigateTo({
						url: url
					});
				}
			}
		},
		headerrefresh() {
			this.currentpage = 1;
			this.dataList = [];
			this.loadData();
		},
		footerrefresh() {
			if (this.morestatus == 'noMore') {
				return;
			}
			this.currentpage += 1;
			this.morestatus = 'loading';
			this.loadData();
		},
		loadData() {
			uni.showLoading();
			let parame = {
				type: this.person ? '2' : '1',
				fuzzyParam: this.searchkey,
				current: this.currentpage,
				size: 15,
				dutyTypeSort: this.dutyType == '' ? undefined : this.dutyType
			};
			let url = "invoice";
			if(this.fromSource == "invoice"){
				url = this.$url.INVOICE_CUSTOMERMSG
			}else{
				url = this.$url.LINKMAN_LIST
			}
			// INVOICE_CUSTOMERMSG
			this.$network
				.getData(url, 'POST', parame)
				.then(result => {
					this.dataList = this.dataList.concat(result.records);
					let pages = result.pages;
					if (pages <= this.currentpage) {
						this.morestatus = 'noMore';
					} else {
						this.morestatus = 'more';
					}
					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
				.catch(err => {
					this.morestatus = 'noMore';
					uni.stopPullDownRefresh();
					uni.hideLoading();
				});
		},

		searchTo() {
			this.headerrefresh();
		}
	},
	onPullDownRefresh() {
		this.headerrefresh();
	},
	onReachBottom() {
		this.footerrefresh();
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

.tabstyle {
	position: fixed;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100px;
	z-index: 1000;
}

.search-view {
	display: flex;
	flex-direction: row;
	height: 50px;
	align-items: center;
	justify-content: flex-start;
	background: $uni-bg-color-grey;
}

.top-search {
	display: flex;
	flex: 1;
	height: 40px;
	flex-direction: row;
	border-radius: 20px;
	align-items: center;
	justify-content: flex-start;
	margin-left: 15px;
	margin-right: 15px;
	background: #edeeee;
	padding-left: 20px;
	padding-right: 20px;
	background: #ffffff;
}

.filter-view-style {
	height: 35px;
	width: 60px;
	display: flex;
	background: $uni-color-primary;
	font-size: 15px;
	align-items: center;
	justify-content: center;
	margin-right: 10px;
	border-radius: 5px;
	color: #ffffff;
}

.list-bg-view {
	margin-top: 100px;
	background: #ffffff;
}

.list {
	display: flex;
	flex-direction: column;
}

.cell-view {
	display: flex;
	flex: 1;
	height: 50px;
	border-bottom-width: 1px;
	border-bottom-color: #eeeeee;
	border-bottom-style: solid;
	justify-content: flex-start;
	align-items: center;
	padding-left: 15px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
}

.add-container {
	position: fixed;
	display: flex;
	bottom: 70px;
	right: 20px;
	height: 45px;
	width: 45px;
	border-radius: 50%;
	box-shadow: 0px 0px 10px #E60000;
	justify-content: center;
	align-items: center;
	background-color: $uni-color-primary;
}

.labelstyle {
	color: #ffffff;
	font-size: 30px;
	font-weight: bold;
}

.pop-container {
	position: relative;
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
