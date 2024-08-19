<template>
	<view class="fence-bg-view">
		<view class="top-search-view">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input placeholder="请输入围栏名称" v-model="searchKey" />
				</view>
			</view>
			<view class="filter-view-style" @click="searchTo">
				<text>搜索</text>
			</view>
		</view>
		<list class="list-view">
			<cell v-for="(item,index) in datalist" :key='index' class='list-view-cell'>
				<radio :checked="v.checked" color="#E60000" @click="changeCheck(item)" />
				<view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>围栏名称</text></view>
						<view class="cell-input-view-right">
							<text class="input-style">{{ item.name || '' }}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>地址</text></view>
						<view class="cell-input-view-right">
							<text class="input-style">{{ item.address || '' }}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>区域</text></view>
						<view class="cell-input-view-right">
							<text class="input-style">{{ item.orgName || '' }}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>半径(米)</text></view>
						<view class="cell-input-view-right">
							<text class="input-style">{{ item.pathType == '1' ? '多边形' : item.radius || '' }}</text>
						</view>
					</view>
					<view class="cell-input-view">
						<view class="cell-input-view-left"><text>最后更新时间</text></view>
						<view class="cell-input-view-right">
							<text class="input-style">{{ item.lastModifyTime || '0' }}</text>
						</view>
					</view>
				</view>
			</cell>
		</list>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				datalist: [],
				chooseId: "",
				searchKey: ''
			};
		},
		onLoad(options) {
			this.$datestr.printlog("temp-fence-list")
			if(options.chooseId){
				this.chooshData = options.chooseId
			}
			uni.showLoading();
			this.loaddata();
		},
		methods: {
			loaddata() {
				//""temp"" "garage" "customer"
				let parame = {
					type: 'temp',
				};
				if (this.searchKey != "") {
					parame.name = this.searchKey;
				}
				this.$network
					.getData(this.$url.MACHINE_FENCE_LIST_BY_USER, 'POST', parame)
					.then(result => {
						this.datalist = result.records.map(o => {
							return {
								...o,
								checked: this.chooseId === o.id
							}
						});
						uni.hideLoading();
					})
					.catch(err => {
						uni.hideLoading();
					});
			},
			searchTo() {
				this.loaddata();
			},
			changeCheck(item) {
				uni.$emit("choose-temp-fence", {
					data: item
				})
				uni.navigateBack({
					animationDuration:200
				})
			},
		}
	};
</script>

<style lang="scss" scoped>
	.fence-bg-view {
		display: flex;
		width: 100%;
		flex-direction: column;
	}

	.add-container {
		position: fixed;
		display: flex;
		bottom: 60px;
		right: 20px;
		height: 40px;
		width: 40px;
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

	.top-search-view {
		position: fixed;
		display: flex;
		flex-direction: row;
		height: 50px;
		width: 100%;
		top: 0px;
		background: #FFFFFF;
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

	.filter-view-style {
		height: 35px;
		width: 60px;
		display: flex;
		background: #eeeeee;
		font-size: 15px;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		border-radius: 5px;
	}

	.list-view {
		margin-top: 100px;
		display: flex;
		flex-direction: column;
	}

	.list-view-cell {
		display: flex;
		width: 100%;
		flex-direction: row;
		align-items: center;
		background: #FFFFFF;
		border-bottom-style: solid;
		margin-top: 10px;
		border-bottom-color: #EEEEEE;
		border-bottom-width: 1px;
	}

	.cell-input-view {
		display: flex;
		flex-direction: row;
		flex: 1;
		align-items: center;
		justify-content: flex-start;
		margin-left: 15px;
		margin-right: 15px;
		margin-top: 10px;
		font-size: $uni-font-size-base;
	}

	.cell-input-view-left {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.cell-input-view-right {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: flex-start;
		color: $uni-text-color;
		font-size: $uni-font-size-base;
	}

	.input-style {
		flex: 1;
		text-align: right;
	}

	.cell-bottom-view {
		display: flex;
		flex: 1;
		height: 50px;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;

	}

	.btn-view {
		display: flex;
		border-radius: 5px;
		margin-right: 10px;
		width: 60px;
		height: 30px;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: $uni-font-size-base;
	}

	.style-tilte-one {
		background: #E60000;
		color: #FFFFFF;

	}

	.style-tilte-two {
		background: #FE931F;
		color: #EEEEEE;

	}

	.style-tilte-three {
		background: #FFFCF7;
		color: #F9C0C8;

	}
</style>
