<template>
	<view class="content">
		<view class="search-container">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input :placeholder="$t('common.searchUserTip')" @input="searchChange" />
				</view>
			</view>
		</view>
		<view class="item-assigner-list">
			<view class="l-item" v-for="(m,pos) in list" :key="pos" @click="changeCheck(pos)">
				<view class="item-name">
					{{m.username}}
				</view>
				<mycheckbox class="checkbox" :checked="m.checked" color="#E60000" />
			</view>
		</view>
		<view class="bottom-view">
			<view class="choosed-view">{{$t('common.choosed')}}：<span>{{chooseAssigners.length}} </span></view>
			<view class="confirm-view" @click="confirm">{{$t('common.confirm')}}</view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				allList: [],
				list: [],
				searchKey: "",
				chooseAssigners: [],

			}
		},
		onLoad(options) {
			console.log(options);
			if (options.choosedList && options.choosedList.length > 0) {
				this.chooseAssigners = JSON.parse(options.choosedList);
			}
			this.getUserLeaders();
		},
		methods: {
			searchChange(val) {
				this.searchKey = val.detail.value;
				if (this.searchKey) {
					this.list = this.allList.filter(o => {
						return o.username.indexOf(this.searchKey) != -1
					})
				} else {
					this.list = [...this.allList]
				}

				// this.getUserLeaders();
			},
			/**
			 * checkbox-group的选中监听
			 */
			// chooseChange(e) {
			// 	this.chooseAssigners = e.detail.value;
			// 	this.$datestr.printlog("chooseChange=" + JSON.stringify(e))
			// },
			changeCheck(pos) {
				this.list[pos].checked = !this.list[pos].checked;
				this.getCheckedList();
				this.$datestr.printlog("changeCheck" + JSON.stringify(this.list[pos]))
			},
			/**
			 * 可选择的审批人列表
			 */
			getUserLeaders() {
				let param = {
						showAdmin: false
				}

				this.$network
					.getData(this.$url.USER_LEADERS, 'GET', param)
					.then(result => {

						this.allList = result.map(o => {
							return {
								...o,
								checked: this.chooseAssigners.some(y => y.id === o.id)
							}
						})
						this.list = [...this.allList];

					})
					.catch(err => {

					});
			},
			getCheckedList() {
				this.chooseAssigners = [...this.list.filter(o => {
					return o.checked;
				})];
				this.$datestr.printlog(JSON.stringify(this.chooseAssigners))
			},
			confirm() {
				uni.$emit("choosedAssign", {
					data: this.chooseAssigners
				})
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		background: $uni-bg-color-grey;
		position: relative;
		@include flex(column);
	}

	.search-container {
		flex-direction: row;
		justify-content: space-between;
		height: 48px;
		// position: fixed;
		display: flex;
		width: 100%;
		top: 0px;
		align-items: center;
		background-color: #FFFFFF;
		left: 0;
		z-index: 100;
	}

	.search-box {
		background: #F7F7F7;
		height: 32px;
		flex: 1;
		line-height: 32px;
		display: flex;
		margin-left: 16px;
		margin-right: 16px;
		flex-direction: row;
		padding-left: 16px;
		border-radius: 4px;
	}

	.search-icon {
		color: #999999;
		font-size: 14px;
	}

	.search-content {
		color: #999999;
		font-size: 14px;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 10px;
		flex: 1;
	}

	input {
		width: 95%;
	}

	.item-assigner-list {
		// margin-top: 48px;
		// margin-bottom: 56px;
		flex:1;
		overflow:auto;
	}

	.l-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 45px;
		background-color: #FFFFFF;
		border-color: $uni-bg-color-grey;
		border-style: solid;
		border-width: 0px 0px 1px 0px;
		align-items: center;
	}

	.item-name {
		color: $uni-text-color;
		font-size: $uni-font-size-base;
		margin-left: 16px;
	}

	.checkbox {
		transform: scale(0.7);
		margin-right: 10px;
	}

	.bottom-view {
		// position: fixed;
		display: flex;
		left: 0px;
		right: 0px;
		bottom: 0px;
		height: 48px;
		justify-content: flex-end;
		flex-direction: row;
		align-items: center;
		background: #FFFFFF;
		z-index: 100;
		box-shadow: 1px 0px 1px $uni-text-color-gray;
	}

	.choosed-view {
		margin-left: 16px;
		margin-right: 16px;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.choosed-view span {
		color: $uni-color-primary;
		font-size: $uni-font-size-lg;
		margin-left: 4px;
	}

	.confirm-view {
		margin-right: 16px;
		font-size: $uni-font-size-base;
		color: #FFFFFF;
		background-color: $uni-color-primary;
		padding: 5px 10px;
		border-radius: 4px;
	}
</style>
