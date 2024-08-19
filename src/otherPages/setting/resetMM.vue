<template>
	<view class="custom-bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<list class="list-view">
			<cell class="list-view-cell">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>原密码</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" type="password" v-model="oldMM" placeholder="请输入原密码" />
					</view>
				</view>
			</cell>
			<cell class="list-view-cell">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>新密码</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" type="password" v-model="newMM" placeholder="请输入新密码" />
					</view>
				</view>
			</cell>
			<cell class="list-view-cell">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>再次输入新密码</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" type="password" v-model="snewMM" placeholder="请再次输入新密码" />
					</view>
				</view>
			</cell>
			<cell >
				<view style="font-size: 13px;color: #999999;margin: 4px 10px;">
					提示：密码必须是8~20位，包含字母、数字、特殊字符 ,.@$!%*#?&
				</view>
			</cell>
		</list>
		<view class="bottom-view">
			<view class="bottom-left-view" @click="clickecancle"><text>取消</text></view>
			<view class="bottom-right-view" @click="clicksave"><text>确定</text></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			oldMM: "",
			newMM:"",
			snewMM:""
		};
	},
	onLoad() {
		
	},
	methods: {
		loginOut(){
			uni.showModal({
			    title: '提示',
			    content: '密码修改成功请重新登录',
				showCancel:false,
			    success: (res)=> {
			        if (res.confirm) {
			            uni.removeStorageSync(this.$savekey.LOGIN_MEG);
			            uni.removeStorage({
			                key: this.$savekey.USER_INFO_MEG,
			                success: (res)=>{
			                    this.$datestr.printlog('success');
			                }
			            });
			            uni.removeStorage({
			                key: this.$savekey.USER_PRIVILEGES_MEG,
			                success: (res)=>{
			                    this.$datestr.printlog('success');
			                }
			            });
			            uni.removeStorage({
			                key: 'sys_dic',
			                success: (res)=>{
			                    this.$datestr.printlog('success');
			                }
			            });
						uni.removeStorage({
							key: "passWord",
							success: res => {}
						});
			            uni.reLaunch({
			                url: '../../login'
			            });
			        } 
			    }
			});
			return
		},
		clickecancle(){
			uni.navigateBack({
				delta: 1
			});
		},
		clicksave(){
			if(!this.oldMM){
				uni.showToast({
					icon:"none",
					title:"请输入旧密码"
				})
				return;
			}
			if(!this.newMM){
				uni.showToast({
					icon:"none",
					title:"请输入新密码"
				})
				return;
			}
			if(!this.snewMM){
				uni.showToast({
					icon:"none",
					title:"请再次输入新密码"
				})
				return;
			}
			if(this.oldMM === this.newMM){
				uni.showToast({
					icon:"none",
					title:"旧密码与新密码相同"
				})
				return;
			}	
			if(!this.$datestr.checkPwd(this.newMM)){
				uni.showToast({
					icon:"none",
					title:"密码必须是8~20位，包含字母、数字、特殊字符 ,.@$!%*#?&"
				})
				return;
			}
			if(this.newMM != this.snewMM){
				uni.showToast({
					icon:"none",
					title:"两次输入的密码不一致" 
				})
				return;
			}
			// USER_RESETMM
			let resdata = uni.getStorageSync( this.$savekey.USER_INFO_MEG)
			let idstr = resdata.id;
			// let param = {
			// 	changePwd: true,
			// 	id: idstr,
			// 	newPassword: this.newMM,
			// 	oldPassword: this.oldMM,
			// 	confirm: this.snewMM,
			// };
			let param = {
				changePwd: true,
				id: idstr,
				newPassword: this.$gxfmethod.encrypt(this.newMM),
				oldPassword: this.$gxfmethod.encrypt(this.oldMM),
				confirm: this.$gxfmethod.encrypt(this.snewMM),
			};
			this.$network
				.getData(this.$url.USER_RESETMM, 'PUT', param)
				.then(result => {
					this.loginOut();
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon:"none",
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
	margin-right: 10px;
}
.input-style {
	flex: 1;
	text-align: right;
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
	margin-right: 10px;
}
</style>
