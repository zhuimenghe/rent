<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<c-nav-bar-btns :buttons="navBtns" @onNavBarButtonTap="onNavBarButtonTap">
			选择同行人
			<template v-slot:fixed>
				<view class="search-container">
					<view class="search-box">
						<i class="iconfont search-icon iconzl--sousuo"></i>
						<view class="search-content">
							<input style="font-size: 14px;" :placeholder="$t('common.searchUserTip')" @input="searchChange" />
						</view>
					</view>
				</view>
			</template>
		</c-nav-bar-btns>
		
		<view class="item-assigner-list">
			<view class="l-item" v-for="(m,pos) in list" :key="pos"  @click="changeCheck(pos)">
				<view class="item-name">
					{{m.username}}
				</view>
				<mycheckbox  class="checkbox" :checked="m.checked" color="#E60000" />
			</view>
		</view>
		<view class="bottom-view">
			<view class="choosed-view">{{$t('common.choosed')}}：<span>{{checkedLength}} </span></view>
			<view class="confirm-view" @click="confirm">{{$t('common.confirm')}}</view>
		</view>
		
		<w-picker 
		:selectList="selectList" 
		@confirm="dialog" 
		mode="selector" 
		ref="selector" 
		themeColor="#E60000" 
		/>
		
	</view>
</template>

<script>
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	export default {
		components: {
			wPicker
		},
		data() {
			return {
				navBtns: [
						{
								"text": "切换区域",
								"type": "none",
								"fontSize": "14px",
								"color": "#E60000",
								"width": "auto"
						}
				],
				allList: [],
				list: [],
				searchKey: "",
				chooseAssigners: [],
				orgId: "",
				selectList:[]
			}
		},
		computed:{
			checkedLength(){
				let ll = this.list.filter(o => {
					return o.checked;
				})
				return ll&&ll.length>0?ll.length:0
			}
		},	
		onLoad(options) {
			setTimeout(()=>{
				if(options.type === 'jx'){
					uni.setNavigationBarTitle({
						title:'选择检修人'
					})
				}else if(options.type === 'repair'){
					uni.setNavigationBarTitle({
						title:'选择维修人'
					})
				}else if(options.type === 'maintain'){
					uni.setNavigationBarTitle({
						title:'选择保养人'
					})
				}else if(options.type === 'xj'){
					uni.setNavigationBarTitle({
						title:'选择巡检人'
					})
				}
			}, 10);
			if (options.choosedList) {
				this.chooseAssigners = JSON.parse(options.choosedList);
				console.log(JSON.stringify(this.chooseAssigners))
				
			}
			// if(options.orgId){
			// 	this.orgId = options.orgId
			// }
			this.getUserLeaders();
			this.loadAreaList();
		},
		methods: {
			onNavBarButtonTap() {
				this.$refs.selector.show();
			},
			loadAreaList() {
				uni.showLoading();
				let urlstr = this.$url.ORG_LIST;
				this.$network
					.getData(urlstr, 'GET', null)
					.then(result => {
						let list = result;
						this.selectList = [{
							label:"全部",
							value:""
						}];
						this.selectList = this.selectList.concat(this.getChildren(list))
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			getChildren(data) {
				let arr = [];
				if (data) {
					data.forEach(o => {
						let a = {
							value: o.id,
							label: o.name
						};
						arr = [...arr, a];
						if (o.children && o.children.length > 0) {
							arr = [...arr, ...this.getChildren(o.children)];
						} 
						// else {
						// 	arr = [...arr, a];
						// }
					});
				}
				return arr;
			},
			searchChange(val) {
				this.searchKey = val.detail.value;
				if (this.searchKey) {
					this.list = this.allList.filter(o => {
						return o.username.indexOf(this.searchKey) != -1
					})
				} else {
					this.list = [...this.allList]
				}
			},
			changeCheck(pos) {
				this.list[pos].checked = !this.list[pos].checked;
				this.getCheckedList();
			},
			/**
			 * 可选择的审批人列表
			 */
			getUserLeaders() {
				let param = {
					showAdmin: false,
					orgId : this.orgId,
					roleType : this.$savekey.USER_ROLE_SEVICER
				}
				this.$network
					.getData(this.$url.USER_LEADERS, 'GET', param)
					.then(result => {
						this.allList = result.map(o => {
							return {
								...o,
								checked: this.chooseAssigners.some(y => y.id == o.id)
							}
						})
						this.list = [...this.allList];
						this.getCheckedList();
					}).catch(err => {
					});
			},
			getCheckedList() {
				this.chooseAssigners = [...this.list.filter(o => {
					return o.checked;
				})];
			},
			confirm() {
				this.getCheckedList()
				uni.$emit("choosedAssignTogger", {
					data: this.chooseAssigners
				})
				uni.navigateBack({
					delta: 1
				})
			},
			dialog(val) {
				let reasonDic = val.checkArr;
				this.orgId = reasonDic.value || "";
				this.getUserLeaders();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		height: 100%;
		background: $uni-bg-color-grey;
		position: relative;
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
		margin-top: 48px;
		margin-bottom: 56px;
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
		position: fixed;
		display: flex;
		left: 0px;
		right: 0px;
		bottom: 0px;
		height: 48px;
		padding-bottom:env(safe-area-inset-bottom);
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
