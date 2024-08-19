<template>
	<view class="bgview">
		<view class="top-view">
			<textarea
			class="textclass"
			placeholder="请输入评论内容"
			v-model="textvalue"
			/>
			<view class="line-sp"/>
			<view class="med-view" @click="gotoChoosePerson">
				<view class="left-title-bg">{{"@"}}</view>
				<view :class="getNames() == '' ? 'text-no-names' : 'text-names'">
					<text>{{getNames() == "" ? "请选择要抄送的对象" : getNames()}}</text>
				</view>
				<i class="iconfont right-icon iconarrow-right"></i>
			</view>
		</view>
		<view class="submitclass" @click="submit">
			<text>提交</text>
		</view>
    <s-sany-popup ref="customToast"></s-sany-popup>
	</view>
</template>

<script>
export default{
	data() {
		return {
			textvalue:"",
			itemData:{},
			userList:[]
		};
	},
	onLoad(option) {
		this.itemData = JSON.parse(decodeURIComponent(option.item));
		uni.$on("chooseReason",(res)=>{
			this.userList = [...res.data];
		})
	},
	methods:{
		getNames(){
			let names = "";
			this.userList.forEach(o=>{
				if(names == ""){
					names = o.label;
				}else{
					names = names + "," + o.label;
				}
			})
			return names;
		},
		gotoChoosePerson(){
			let url = "/businessPages/workin/work-flow-choosePerson?list=" + 
			encodeURIComponent(JSON.stringify(this.userList)) + "&itemDic=" + encodeURIComponent(JSON.stringify(this.itemData))
			uni.navigateTo({
				url:url
			})
		},
		submit(){
			if(this.textvalue === ""){
				uni.showToast({
					title:"请输入评论内容",
					icon:'none'
				})
				return
			}
			let userIds = this.userList.map(o=>{
				return o.value;
			})
			uni.showLoading();
			let param = {
				flowId:this.itemData.id,
				comment:this.textvalue,
				userId:userIds.length>0 ? userIds.toString() : undefined
			}
			this.$network
				.getData(this.$url.PROCESS_NODE_COMMENT, 'POST', param)
				.then(result => {
					uni.$emit("refresh-list", {})
					uni.showToast({
						title:'评论发布成功',
						icon:"none"
					})
					uni.navigateBack({
						delta: 1
					});
				})
				.catch(err => {
					uni.showToast({
						icon: "none",
						title: error.message
					});
				});
		}
	}
}
</script>

<style scoped lang="scss">
.bgview {
	// width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: $uni-bg-color-grey;
}
.top-view{
	margin-top: 20px;
	width: calc(100% - 30px);
	border: 1px solid #e0e0e0;
	border-radius: 5px;
	background: #FFFFFF;
}
.textclass{
	width: calc(100% - 10px);
	height: 150px;
	font-size: $uni-font-size-base;
	color: #222831;
	margin: 5px;
	background: #FFFFFF;
}
.submitclass{
	display: flex;
	width: calc(100% - 30px);
	margin-top: 20px;
	padding-top: 10px;
	padding-bottom: 10px;
	font-size: 17px;
	color: #FFFFFF;
	font-weight: bold;
	justify-content: center;
	background: $uni-color-primary;
	border-radius: 5px;
}
.line-sp{
	width: 100%;
	background: #e0e0e0;
	height: 1px;
}
.med-view{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	width: calc(100% - 10px);
	font-size: $uni-font-size-base;
	color: #222831;
	margin: 5px;
	background: #FFFFFF;
}
.left-title-bg{
	width: 30px;
	height: 30px;
	border-radius: 3px;
	color: #FFFFFF;
	font-size: 15px;
	background: #E60000;
	text-align: center;
	line-height: 30px;
}
.text-names{
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: flex-end;
	margin-left: 5px;
	margin-right: 5px;
	color: #222831;
	font-size: 14px;
}
.text-no-names{
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: flex-end;
	margin-left: 5px;
	margin-right: 5px;
	color: #999999;
	font-size: 14px;
}
.right-icon{
	font-size: $uni-font-size-base;
	color: #999999;
}
</style>
