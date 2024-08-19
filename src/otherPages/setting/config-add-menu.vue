<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="model">
			<view class="title-tag">我的新建</view>
			<view class="pop-gird-container" v-if="selectList.length>0">
				<view class="pop-gird" v-for="(item,pos) in selectList" :key="pos" @click="removeMenus(item,pos)">
					<view class="item-top"><i class="iconfont close-image iconzl--cuowu"></i></view>
					<i class="iconfont tip-image" :style="{'color':item.color}">{{item.icon}}</i>
					<view style="font-size: 12px;color:#333333">{{item.title}}</view>
				</view>
			</view>
			<view v-else class="empty-view">
				暂无功能
			</view>
		</view>

		<view class="model">
			<view class="title-tag">全部新建功能</view>
			<view class="pop-gird-container" v-if="addList.length>0">
				<view class="pop-gird" v-for="(item,pos) in addList" :key="pos" @click="addMenus(item,pos)" v-if="!item.checked">
					<view class="item-top"><i class="iconfont edit-image iconjia"></i></view>
					<i class="iconfont tip-image" :style="{'color':item.color}">{{item.icon}}</i>
					<view style="font-size: 12px;color:#333333">{{item.title}}</view>
				</view>
			</view>
			<view v-else class="empty-view">
				暂无功能
			</view>
		</view>

	</view>
</template>

<script>
	// import commonIcon from '@/common/common-method/common-icon.js'
	export default {
		data() {
			return {
				//
				addList: [],
				selectList: []
			}
		},
		onLoad(option) {
			this.selectList = JSON.parse(decodeURIComponent(option.selectList))
			this.getAddAllMenus();
		},
		methods: {
			removeMenus(item, pos) {
				this.selectList.splice(pos, 1);
				this.getCheckedList()
			},
			addMenus(item, pos) {
				if (this.selectList.length >= 8) {
					uni.showToast({
						title: '最多可添加8个新增功能',
						icon: 'none'
					})
					return
				}
				this.selectList = this.selectList.length > 0 ? [...this.selectList, item] : [item];
				this.getCheckedList()

			},
			//重组选中后的数据
			getCheckedList() {
				this.addList = this.addList.map(o => {
					return {
						...o,
						checked: this.selectList.length > 0 && this.selectList.some(y => y.id == o.id) ? true : false
					}
				})
			},
			getAddAllMenus() {
				this.$network.getData(this.$url.ADD_MENUS_URL, "GET").then((result) => {
					this.addList = result ? result.map(o => {
						return {
							id: o.id,
							title: o.name,
							icon: o.appIcon ? commonIcon.icons.some(x => o.appIcon.indexOf(x.id) != -1) ? commonIcon.icons.find(x => o.appIcon
								.indexOf(x.id) != -1).icon : '\ue614' : '',
							color: o.iconColor ? o.iconColor : '',
							url: o.appComponent ? o.appComponent : '',
							backgroundColor: o.iconBackgroundColor ? o.iconBackgroundColor : '',
							checked: this.selectList && this.selectList.some(x => x.id == o.id) ? true : false
						}
					}) : [];
				}).catch((err) => {})
			},
			saveAddAllMenus() {
				let userId = ""
				let obj = uni.getStorageSync(this.$savekey.USER_INFO_MEG)
				if (obj) {
					userId = obj.id;
				}
				let param = this.selectList && this.selectList.length > 0 ? this.selectList.map((o, index) => {
					return {
						sort: index,
						permissionId: o.id,
						userId: userId,
					}
				}) : []
				this.$network.getData(this.$url.SAVE_ADD_MENUS_URL, "POST", param).then((result) => {
					this.getMyAddMenus()
				}).catch((err) => {})
			},
			getMyAddMenus() {
				let param = {
					isApp: true
				};
				this.$network.getData(this.$url.ALL_ADD_MENUS_URL, "GET", param).then((result) => {
					uni.setStorage({
						key: this.$savekey.MY_ADD_MENUS,
						data: result?result:[],
						success: () => {
							uni.$emit('refresh-add-menus')
							uni.showToast({
								icon: "none",
								title: "配置完成"
							})
							uni.navigateBack({
								delta: 1
							})
						},
						fail: () => {}
					});
				}).catch((err) => {})
			},

		},
		onNavigationBarButtonTap() {
			this.saveAddAllMenus();
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		background-color: $uni-bg-color-grey;
		position: relative;
	}

	.model {
		background-color: #ffffff;
		border-radius: 4px;
		margin-bottom: 8px;
	}

	.title-tag {
		width: calc(100% - 16px);
		padding: 8px;
		text-align: center;
		font-size: 14px;
		font-weight: bold;
	}

	.empty-view {
		width: calc(100% - 16px);
		padding: 8px;
		border-top: 1px solid $uni-bg-color-grey;
		color: $uni-text-color-gray;
		text-align: center;
		font-size: 14px;
	}

	.pop-gird-container {
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-start;
		padding-bottom: 8px;
		border-top: 1px solid $uni-bg-color-grey;
	}

	.pop-gird {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: calc((100% - 4px)/4);
		justify-content: center;
		font-size: $uni-font-size-base;
		padding: 6px 0px 8px 0px;
		border-bottom: 1px solid $uni-bg-color-grey;
		border-right: 1px solid $uni-bg-color-grey;
	}

	.item-top {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
		width: 100%;
	}

	.close-image {
		font-size: 14px;
		text-align: center;
		color: $uni-text-color-gray;
	}

	.edit-image {
		font-size: 12px;
		text-align: center;
		width: 14px;
		height: 14px;
		color: #FFFFFF;
		margin-right: 8px;
		background-color: #E60000;
		border-radius: 50%;
	}

	.pop-gird-image {
		// width: 30px;
		// height: 30px;
		// border-radius: 50%;
		// text-align: center;
		// padding: 8px;
	}

	.tip-image {
		font-size: 25px;
		margin: 8px 0px;
		color: $uni-color-primary;
	}
</style>
