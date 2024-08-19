<template>
	<view class="bgview">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="top-search-view">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input placeholder="搜索" v-model="keyWord" />
				</view>
			</view>
		</view>
		<list class="listView">
			<cell class="cellView" v-for="(item, index) in dataList" :key="index">
				<view class="topView" @click="backItem(item)">
					<view class="titleStyle">{{ item.displayName || ""}}</view>
					<view class="subtitleStyle">{{ phoneNumShow(item) }}</view>
				</view>
				<view class="lineView" />
			</cell>
		</list>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				keyWord: "",
				dataList: [],
				alllist: [],
			};
		},
		onLoad() {
			this.getContractList();
		},
		watch: {
			keyWord(val) {
				this.search(val);
			}
		},
		methods: {
			search(value) {
				console.log(value);
				if (!value) {
					this.dataList = [...this.alllist];
				} else {
					this.dataList = []
					this.alllist.forEach(o => {
						if (o.displayName) {
							let is = (o.displayName.indexOf(value) !== -1) ? true : false
							if (is) {
								this.dataList = [...this.dataList, o]
							}
						}

					})
				}

			},
			phoneNumShow(item) {
				if (item.phoneNumbers && item.phoneNumbers.length > 0) {
					let str1 = item.phoneNumbers[0].value.replace(/ /g, '');
					let str2 = str1.replace(/-/g, '');
					let str3 = str2.replace(/\+86/g, '');
					return str3
				}
				return "--";
			},
			getContractList() {
				// #ifdef APP-PLUS
				plus.contacts.getAddressBook(
					plus.contacts.ADDRESSBOOK_PHONE, // || plus.contacts.ADDRESSBOOK_PHONE
					(info) => {

						info.find(['id', 'displayName', 'phoneNumbers'], (list) => {
							this.alllist = [...list];
							this.dataList = [...this.alllist];
							console.log(JSON.stringify(this.dataList.length));
						});
					},
					error => {
						console.log(error);
					}
				);
				// #endif
			},
			// getContractSIMList() {
			// 	plus.contacts.getAddressBook(
			// 		plus.contacts.ADDRESSBOOK_PHONE || plus.contacts.ADDRESSBOOK_SIM,
			// 		(info) => {
			// 			info.find(['id', 'displayName', 'phoneNumbers'], (list) => {
			// 				this.alllist = [...list];
			// 				this.dataList = [...this.alllist];
			// 				console.log(JSON.stringify(this.dataList.length));
			// 			});
			// 		},
			// 		error => {
			// 			console.log(error);
			// 		}
			// 	);
			// },
			backItem(item) {
				uni.$emit("phone-contract-item", {
					data: item
				})
				uni.navigateBack({
					delta: 1
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.bgview {
		display: flex;
		width: 100%;
		background: #ffffff;
	}

	.listView {
		margin-top: 50px;
		width: 100%;
		background: #ffffff;
	}

	.cellView {
		display: flex;
		width: 100%;
		flex-direction: column;
	}

	.topView {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 50px;
		justify-content: flex-start;
		margin-bottom: 10px;
	}

	.titleStyle {
		display: flex;
		margin-top: 10px;
		align-items: center;
		justify-content: flex-start;
		color: #222831;
		font-size: 15px;
		margin-left: 20px;
	}

	.subtitleStyle {
		display: flex;
		margin-top: 5px;
		align-items: center;
		justify-content: flex-start;
		color: #222831;
		font-size: 13px;
		margin-left: 20px;
	}

	.lineView {
		margin-top: 5px;
		display: flex;
		height: 1px;
		margin-left: 5px;
		margin-right: 5px;
		background: #cccccc;
	}

	.top-search-view {
		position: fixed;
		display: flex;
		flex-direction: row;
		height: 50px;
		width: 100%;
		background: #ffffff;
		justify-content: center;
		align-items: center;
	}

	.search-box {
		background: #F7F7F7;
		height: 35px;
		flex: 1;
		line-height: 35px;
		display: flex;
		margin: 8px 16px;
		flex-direction: row;
		padding-left: 16px;
		border-radius: 4px;
		justify-content: flex-start;
		align-items: center;
	}

	.search-icon {
		color: #999999;
		font-size: $uni-font-size-base;
	}

	.search-content {
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 10px;
	}
</style>
