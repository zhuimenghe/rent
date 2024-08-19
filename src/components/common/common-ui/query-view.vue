<template>
	<view class="query-content">
		<view class="query-top-container">
			<view class="query-search-box">
				<i class="iconfont query-search-icon iconzl--sousuo" v-if="!isQuerySalesman"></i>
				<view class="query-search-content">
					<input style="flex: 1;" :placeholder="hint" placeholder-class="placeholder-style" v-model="keyWord" />
				</view>
			</view>
			<view style="flex: 2;">
				<selectView :value='salesmanObj.label' hint='业务负责人' @clickSelect="showPick('salesman')" v-if="isQuerySalesman"/>
			
			</view>
			<view class="query-export-css" @click="exportExcel" v-if="isExportList">
				<text>导出</text>
			</view>
		</view>
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
	</view>
</template>

<script>
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	var timer;
	export default {
		components: {
			selectView,
			wPicker,
		},
		props: {
			isExportList: {
				type: Boolean,
				default: false
			},
			isQuerySalesman: {
				type: Boolean,
				default: true
			},
			hint: {
				type: String,
				default: '模糊搜索'
			},
		},
		watch: {
			keyWord(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.$emit('query', {
						keyWord: this.keyWord,
						salesmanObj: this.salesmanObj,
						
					})
				}, 500);
				

			}
		},
		data() {
			return {
				selectList: [],
				salesmanlist: [],
				keyWord: '',
				salesmanObj: {},
				picktype: '',
			}
		},
		created() {
			this.loadOwnerList()
		},
		methods: {
			//导出
			exportExcel() {
				this.$emit('exportExcel')
			},
			showPick(type) {
				this.picktype = type
				switch (type) {
					case 'salesman':
						this.selectList = this.salesmanlist
						this.$refs.selector.show();
						break;
					default:
						break;
				}

			},
			onConfirm(val) {
				switch (this.picktype) {
					case 'salesman':
						this.salesmanObj = val.checkArr;
						break;
					default:
						break;
				}
				this.$emit('query', {
					keyWord: this.keyWord,
					salesmanObj: this.salesmanObj
				})
			},


			//加载负责人
			loadOwnerList() {
				let param = {
					showAdmin: false,
					roleType: this.$savekey.USER_ROLE_BUSINESS
				};
				this.$network
					.getData(this.$url.USER_LEADERS, 'GET', param)
					.then(result => {
						this.salesmanlist = [];
						this.salesmanlist.push({
							label: '全部',
							value: ''
						});
						this.salesmanlist = this.salesmanlist.concat(
							result ?
							result.map(dict => {
								return {
									label: dict.username,
									value: dict.id
								};
							}) : []
						);
					})
					.catch(err => {
					});
			},
			
		}

	}
</script>

<style lang="scss" scoped>
	.query-content {
		background-color: #FFFFFF;
		padding: 4px 8px;
		display: flex;
		flex-direction: column;
		z-index: 600;
	}

	//第一行
	.query-top-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		background-color: #fff;
		width: 100%;
	}

	.query-search-box {
		background: #F7F7F7;
		height: 35px;
		flex: 3;
		line-height: 35px;
		display: flex;
		margin: 8px;
		flex-direction: row;
		border-radius: 4px;
		justify-content: flex-start;
		align-items: center;
	}

	.query-search-icon {
		color: #999999;
		padding-left: 16px;
		font-size: $uni-font-size-base;
	}

	.query-search-content {
		display: flex;
		flex: 1;
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 10px;
		margin-right: 10px;
	}

	.query-export-css {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 8px;
		padding-right: 8px;
		height: 30px;
		border-radius: 4px;
		margin-right: 5px;
		font-size: $uni-font-size-base;
		color: #E60000;
		border: 1px solid #E60000;
		background: #FFFFFF;
	}

	.query-more-css {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 8px;
		padding-right: 8px;
		height: 30px;
		background: #FFFFFF;
		border: 1px solid #999999;
		border-radius: 4px;
		margin-right: 5px;
		font-size: $uni-font-size-base;
		color: #999999;
	}

	.more-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 4px;
		flex: 1;
	}

	.select-view {
		flex: 1;
	}

	.query-condition-btn {
		display: flex;
		margin-top: 10px;
		flex-direction: row;
		justify-content: space-between;
		background: #FFFFFF;
	}

	.query-clear {
		background-color: $uni-border-color;
	}

	.query-confirm {
		background-color: $uni-color-primary;
	}

	.query-btn-all {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 8px;
		margin-right: 8px;
		padding: 8px;
		text-align: center;
		border-radius: 4px;
		flex: 1;
		color: #ffffff;
		font-size: $uni-font-size-base;
	}
</style>
