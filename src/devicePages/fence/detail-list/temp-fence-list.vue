<template>
	<view class="fence-bg-view">
		<view class="add-container" @click="gotocreat" v-if="isCreate">
			<i class="iconfont labelstyle iconadd"></i>
		</view>
		<view class="top-search-view">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input placeholder="围栏名称/地址" v-model="searchKey" />
				</view>
			</view>
			<view class="filter-view-style" @click="searchTo">
				<text>搜索</text>
			</view>
			<view class="export-view-style" @click="exportExcel" v-if="isExportList">
				<text>导出</text>
			</view>
		</view>
		<list class="list-view">
			<cell v-for="(item,index) in datalist" :key='index' class='list-view-cell'>
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
					<view class="cell-input-view-left"><text>半径(米)</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.pathType == '1' ? '多边形' : item.radius || '' }}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>设备数量</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.machineNum }}台</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>最后更新时间</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.lastModifyTime || '0' }}</text>
					</view>
				</view>
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>创建人</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.createName}}</text>
					</view>
				</view>
				<!-- <view class="cell-input-view">
					<view class="cell-input-view-left"><text>设备数量</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.machineNum || '0' }}</text>
					</view>
				</view> -->
				<view class="cell-bottom-view">
					<view class="btn-view style-tilte-one" @click="connetcar(item,index)" v-if="isBD">
						<text>关联设备</text>
					</view>
					<view class="btn-view style-tilte-two" @click="editfence(item,index)"  v-if="isAdd">
						<text>修改</text>
					</view>
					<view class="btn-view style-tilte-three" @click="deleteFence(item,index)"  v-if="canDelete">
						<text>删除</text>
					</view>
				</view>
			</cell>
			<cell>
				<uni-load-more iconType="auto" :status="morestatus" />
			</cell>
		</list>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				page: 1,
				datalist: [],
				morestatus: 'more',
				searchKey: '',
				isBD:true,
				isCreate:true,
				isAdd:true,
				canDelete:true,
				isExportList:true,
				totalCount:'100'
			};
		},
		created() {
			uni.getStorage({
				key: this.$savekey.USER_PRIVILEGES_MEG,
				success: (res) => {
					this.isBD = res.data.some(x => x.value === this.$savekey.PERMISSION_MACHINE_FENCE_BIND)
					this.isCreate = res.data.some(x => x.value === this.$savekey.PERMISSION_MACHINE_FENCE_ADD)
					this.isAdd = res.data.some(x => x.value === this.$savekey.PERMISSION_MACHINE_FENCE_EDIT)
					this.canDelete = res.data.some(x => x.value === this.$savekey.PERMISSION_MACHINE_FENCE_DELETE)
					//this.isExportList = res.data.some(x => x.value === this.$savekey.PERMISSION_EXPORT_ALL_LIST);
				}
			})
			uni.showLoading();
			this.loaddata();
		},
		methods: {
			loaddata() {
				//""temp"" "garage" "customer"
				let parame = {
					current: this.page,
					size: 20,
					type: 'temp',
				};
				if (this.searchKey != "") {
					parame.fuzzyParam = this.searchKey;
				}
				this.$network
					.getData(this.$url.MACHINE_FENCE_LIST, 'POST', parame)
					.then(result => {
						this.datalist = this.datalist.concat(result.records);
						let pages = result.pages;
						let total = result.total;
						if (pages == this.page) {
							this.morestatus = 'noMore';
						} else {
							this.morestatus = 'more';
						}
						this.totalCount = result.total.toString()
						uni.stopPullDownRefresh();
						uni.hideLoading();
					})
					.catch(err => {
						this.morestatus = 'noMore';
						uni.stopPullDownRefresh();
						uni.hideLoading();
					});
			},
			refreshheader() {
				this.page = 1;
				this.datalist = [];
				this.loaddata();
			},
			refreshhfooter() {
				if (this.morestatus == 'noMore') {
					return;
				}
				this.page += 1;
				this.loaddata();
				this.morestatus = 'loading';
			},
			//关联设备
			connetcar(item, indde) {
				console.log(item,'item');
				uni.navigateTo({
					url: './correlation-machine?item=' + JSON.stringify(item)
				});
			},
			// 创建
			gotocreat() {
				uni.navigateTo({
					url: './fence-edit?updata=false&type=temp'
				});
			},
			//编辑
			editfence(item, index) {
				uni.navigateTo({
					url: './fence-edit?item=' + JSON.stringify(item) + '&updata=true&type=temp'
				});
			},
			//删除
			deleteFence(item, index) {
				uni.showLoading();
				let urlstr = this.$url.MACHINE_FENCE_DELETE + item.id;
				this.$network
					.getData(urlstr, 'DELETE', null)
					.then(result => {
						this.refreshheader();
					})
					.catch(err => {
						uni.showToast({
							title: err.message,
							icon: "none"
						})
						uni.hideLoading();
					});
			},
			searchTo() {
				this.refreshheader();
			},
			exportExcel(item){
				// let param = {
				// 	type: 'temp' ,
				// 	name : this.searchKey
				// };
				// let url= this.$url.MACHINE_FENCE_LIST + '?isExport=true&current=1&size='+ this.totalCount
				// let downurl = this.$gxfmethod.forEachObj(url,param)
				// console.log(downurl)
				
				let param = {
					type: 'temp' ,
					name : this.searchKey,
					current : 1,
					size : this.totalCount
				};
				let url= this.$url.BASE_URL + this.$url.MACHINE_FENCE_LIST + '?isExport=true'
				let filename = this.$gxfmethod.getFileName('电子围栏列表-');
				this.$gxfmethod.downFunc(url,'POST',param,filename)
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
		// top: 50px;
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

	.filter-view-style{
		height: 30px;
		padding-right: 8px;
		padding-left: 8px;
		display: flex;
		background: $uni-color-primary;
		font-size: $uni-font-size-base;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		border-radius: 5px;
		z-index: 955;
		color: #FFFFFF;
	}
	.export-view-style{
		height: 30px;
		padding-right: 8px;
		padding-left: 8px;
		display: flex;
		font-size: $uni-font-size-base;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		border-radius: 5px;
		z-index: 955;
		color: $uni-color-primary;
		background: #FFFFFF;
		border: 1px solid $uni-color-primary;
	}
	.list-view {
		// margin-top: 100px;
		margin-top: 50px;
		display: flex;
		flex-direction: column;
	}

	.list-view-cell {
		display: flex;
		width: 100%;
		flex-direction: column;
		background: #FFFFFF;
		border-bottom-style: solid;
		margin-top: 10px;
		border-bottom-color: #EEEEEE;
		border-bottom-width: 1px;
		padding-bottom: 10px;
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
