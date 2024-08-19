<template>
	<view class="custom-bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<list class="list-view">
			<cell class="list-view-cell">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>用户名</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.ssn || '-' }}</text>
					</view>
				</view>
			</cell>
			<cell class="list-view-cell">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>区域</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.orgName || '-' }}</text>
					</view>
				</view>
			</cell>
			<cell class="list-view-cell">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>角色</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ $gxfmethod.RoleName(item) }}</text>
					</view>
				</view>
			</cell>
			<cell class="list-view-cell">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>姓名</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.username || '--' }}</text>
						<!-- <input class="input-style" type="text" v-model="item.username" placeholder="请输入姓名" /> -->
					</view>
				</view>
			</cell>
			<cell class="list-view-cell">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>手机号</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.phoneNum || '--' }}</text>
						<!-- <input class="input-style" type="number" v-model="item.phoneNum" placeholder="请输入手机号" /> -->
					</view>
				</view> 
			</cell>
			<cell class="list-view-cell">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>邮箱</text></view>
					<view class="cell-input-view-right">
						<text class="input-style">{{ item.email || '--' }}</text>
						<!-- <input class="input-style" type="text" v-model="item.email" placeholder="请输入邮箱" /> -->
					</view>
				</view>
			</cell>
			<!-- #ifdef MP-WEIXIN -->
			<cell class="list-view-cell">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>微信</text></view>
					<view class="cell-input-view-right justify-end ">
						<block v-if="mnOpenid">
							<button v-if="!canSelfCheck" class="z-btn text-primary padding-lr" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">解绑</button>
							<view class="text-primary" v-else @click="selfUnBind">解绑</view>
						</block>
						<text v-else>未绑定</text>
					</view>
				</view>
			</cell>
			<!-- #endif -->
		</list>
		<!-- <view class="bottom-view">
			<view class="bottom-right-view" @click="clicksave"><text>保存</text></view>
		</view> -->
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			item: {},
			canSelfCheck:false,
		};
	},
	computed:{
		...mapState('user',['mnOpenid'])
	},
	async onLoad() {
		let self = this;
		uni.getStorage({
			key: this.$savekey.USER_INFO_MEG,
			success: function(res) {
				console.log(res)
				self.item = res.data;
			}
		});
		let [err, res] = await uni.login();
		this.canSelfCheck = await this.$network.unbindWeixinSelfCheck(res.code)
	},
	methods: {
		async selfUnBind(){
			try {
				let [err, res] = await uni.login();
				let result = await this.$network.unbindWeixinSelf(res.code);
				uni.showToast({title:'解绑成功'})
				this.$store.commit('user/setState',{mnOpenid:''})
			} catch (error) {
				uni.showToast({title:'解绑失败',icon:'none'})
			}
		},
		async getPhoneNumber(e){
			try{
				await this.$network.unbindWeixinWithPhone(e.detail.code);
				uni.showToast({title:'解绑成功'})
				this.$store.commit('user/setState',{mnOpenid:''})
			}catch(err){
				uni.showToast({title:'手机号不匹配,解绑失败',icon:'none',duration:'2500'})
			}
		},
		getRoleType(dic){
			if(dic.roleiIdNameList){
				let list = dic.roleiIdNameList || [];
				let namestr = "";
				list.forEach((o)=>{
					if(namestr === ""){
						namestr = o;
					}else{
						namestr = namestr + "," + o;
					}
				})
			}
			return '-'
		},
		clicksave(){
			if(!this.$datestr.isphonenum(this.item.phoneNum)){
				uni.showToast({
					title:'请输入正确的手机号',
					icon:'none'
				})
				return
			}
			// USER_INFO
			let param = {
				id: this.item.id,
				username: this.item.username,
				phoneNum: this.item.phoneNum,
				email: this.item.email, 
			};
			this.$network
				.getData(this.$url.USER_INFO, 'PUT', param)
				.then(result => {
					uni.showToast({
						image:"none",
						title:"修改成功"
					})
					setTimeout(()=>{
						uni.$emit('refresh-user', {
						    type: ""
						});
						uni.navigateBack({
							delta: 1
						});
					},100)
				})
				.catch(err => {
					uni.showToast({
						image:"none",
						title:err.message
					})
				});
			
		}
	}
};
</script>

<style lang="scss" scoped>
.custom-bg-view {
	display: flex;
	width: 100%;
	flex-direction: column;
}
.list-view {
	display: flex;
	flex-direction: column;
}
.list-view-cell {
	display: flex;
	width: 100%;
	flex-direction: column;
	background: #ffffff;
	border-bottom-style: solid;
	margin-top: 10px;
	border-bottom-color: #eeeeee;
	border-bottom-width: 1px;
}
.cell-input-view {
	display: flex;
	flex-direction: row;
	flex: 1;
	align-items: center;
	justify-content: flex-start;
	margin: 10px;
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
	font-size: $uni-font-size-base;
}
.bottom-view{
	position: fixed;
	display: flex;
	left: 0px;
	right: 0px;
	bottom: 0px;
	height: 60px;
	padding-bottom:calc(env(safe-area-inset-bottom) - 10px);
	justify-content: flex-end;
	flex-direction: row;
	align-items: center;
	background: #FFFFFF;
	z-index: 100;
}
.bottom-left-view{
	display: flex;
	flex: 1;
	height: 40px;
	border-radius: 20px;
	background: $uni-bg-color-grey;
	font-size: $uni-font-size-lg;
	color: $uni-color-primary;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-right: 10px;
	margin-left: 10px;
}
.bottom-right-view{
	display: flex;
	flex: 1;
    height: 40px;
    border-radius: 20px;
    background: $uni-color-primary;
    font-size: $uni-font-size-lg;
    color: #FFFFFF;
	align-items: center;
	justify-content: center;
	font-weight: bold;
	margin-left: 10px;
	margin-right: 10px;
}
</style>
