<template>
	<view class="content">
		<view class="topSearch">
			<view class="search-box">
				<i class="iconfont search-icon iconzl--sousuo"></i>
				<view class="search-content">
					<input 
					placeholder="请输入人员名称" 
					v-model="keyWord" 
					style="flex: 1;font-size: 14px;"
					/>
				</view>
			</view>
		</view>
		<view style="height: 50px;width: 100%;"/>
		<view class="item-assigner-list">
			<view class="l-item" v-for="(m, pos) in list" :key="pos" @click="changeCheck(pos)">
				<view class="item-name">{{ m.label }}</view>
				<mycheckbox class="checkbox" :checked="m.checked" color="#E60000" />
			</view>
		</view>
		<view style="height: 50px;width: 100%;"/>
		<view class="bottom-view">
			<view class="choosed-view">
				{{ $t('common.choosed') }}：
				<span>{{ checkedLength }}</span>
			</view>
			<view class="confirm-view" @click="confirm">{{ $t('common.confirm') }}</view>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
let timer;
import wPicker from '@/components/common/w-picker/w-picker.vue';
export default {
	components: {
		wPicker
	},
	watch: {
		keyWord: {
			handler(val) {
				if(timer){
					clearTimeout(timer);
				}
				timer = setTimeout(()=>{
					if (val) {
						this.list = this.allList.filter(o=>{return o.label.search(val) != -1})
					} else {
						this.list = [...this.allList]
					}
				}, 500)
			}
		}
	},
	data() {
		return {
			allList:[],
			list: [],
			itemDic:{},
			chooseAssigners: [],
			keyWord:""
		};
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
		if (options.list) {
			this.chooseAssigners = JSON.parse(decodeURIComponent(options.list));
		}
		if(options.itemDic){
			let dict = JSON.parse(decodeURIComponent(options.itemDic));
			this.itemDic = {
				...dict
			}
		}
		this.loadDesCTypes();
	},
	methods: {
		loadDesCTypes() {
			uni.showLoading()
			let param = {
				orgId:this.itemDic.orgId,
				processKey:this.itemDic.processKey,
				createBy:this.itemDic.createBy,
				businessOwner:this.itemDic.businessOwner
			}
			//WORKFLOW_PERSON_LIST
			let url =  this.$url.WORKFLOW_PERSON_LIST;
			this.$network.getData(url, 'GET', param).then(result => {
				this.allList = result.map(o=>{
					return {
						"value" : o.userId,
						"label" : o.username,
						"checked": this.chooseAssigners.some(y => y.value == o.userId)
					}
				}) 
				this.list = [...this.allList];
				this.getCheckedList();
				uni.hideLoading();
			}).catch(err => {
				uni.hideLoading();
			});
		},
		changeCheck(pos) {
			this.list[pos].checked = !this.list[pos].checked;
			this.getCheckedList();
		},
		getCheckedList() {
			this.chooseAssigners = [
				...this.list.filter(o => {
					return o.checked;
				})
			];
		},
		confirm() {
			this.getCheckedList();
			uni.$emit('chooseReason', {
				data: this.chooseAssigners
			});
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	width: 100%;
	min-height: 100%;
	background: $uni-bg-color-grey;
	position: relative;
}
.topSearch{
	display: flex;
	width: 100%;
	position: fixed;
	height: 49px;
	background: #FFFFFF;
	top: 0px;
	align-items: center;
	left: 0;
	z-index: 100;
	border-bottom: solid 1px $uni-bg-color-grey;
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
.item-assigner-list {
	width: 100%;
	margin-top: 0px;
	margin-bottom: 0px;
}

.l-item {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	height: 45px;
	background-color: #ffffff;
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
	height: 50px;
	justify-content: flex-end;
	flex-direction: row;
	align-items: center;
	background: #ffffff;
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
	color: #ffffff;
	background-color: $uni-color-primary;
	padding: 5px 10px;
	border-radius: 4px;
}
</style>
