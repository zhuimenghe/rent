<template>
	<view class="custom-bg-view">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="title-bar" :style="{height:headHeight+'px',lineHeight:headHeight+'px'}">
			修改初始密码
		</view>
		<view class="subtitle">首次登录系统后必须修改密码</view>
		<list class="list-view">
			<cell class="list-view-cell">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>新密码</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" type="password" v-model="pwd" placeholder="请输入新密码" />
					</view>
				</view>
			</cell>
			<cell class="list-view-cell">
				<view class="cell-input-view">
					<view class="cell-input-view-left"><text>新密码确认</text></view>
					<view class="cell-input-view-right">
						<input class="input-style" type="password" v-model="againPwd" placeholder="请再次输入新密码" />
					</view>
				</view>
			</cell>
			<cell>
				<view style="font-size: 13px;color: #999999;margin: 4px 10px;">
					提示：密码必须是8~20位，包含字母、数字、特殊字符 ,.@$!%*#?&
				</view>
			</cell>
		</list>
		<view class="bottom-view" @click="clicksave">确定</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			pwd: '',
			againPwd: ''
		};
	},
	computed:{
		...mapState('system',{
			headHeight:s=>s.statusBarHeight+s.titleBarHeight
		})
	},
	onLoad() {},
	methods: {
		clicksave() {
			if (!this.pwd) {
				uni.showToast({
					icon: 'none',
					title: '请输入新密码'
				});
				return;
			}
			if (!this.againPwd) {
				uni.showToast({
					icon: 'none',
					title: '请再次输入新密码'
				});
				return;
			}
			if (!this.$datestr.checkPwd(this.pwd)) {
				uni.showToast({
					icon: 'none',
					title: '密码必须是8~20位，包含字母、数字、特殊字符 ,.@$!%*#?&'
				});
				return;
			}
			if (this.pwd != this.againPwd) {
				uni.showToast({
					icon: 'none',
					title: '两次输入的密码不一致'
				});
				return;
			}
			this.updateOriginPwd();
		},
		//修改原始密码
		updateOriginPwd() {
			uni.showLoading()
			let param = {
				newPassword: this.$gxfmethod.encrypt(this.pwd)
			};
			this.$network
				.getData(this.$url.PASS_ORIGIN_UPDATE, 'POST', param)
				.then(result => {
					uni.hideLoading()
					uni.showToast({
						image: 'none',
						title: '密码修改成功'
					});
					setTimeout(() => {
						this.loginOut();
					}, 500);
				})
				.catch(err => {
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: err.message
					});
				});
		},
		loginOut() {
			uni.showModal({
				title: '提示',
				content: '密码修改成功请重新登录',
				showCancel: false,
				success: res => {
					if (res.confirm) {
						uni.removeStorageSync(this.$savekey.LOGIN_MEG);
						uni.removeStorage({
							key: this.$savekey.USER_INFO_MEG,
							success: res => {}
						});
						uni.removeStorage({
							key: this.$savekey.USER_PRIVILEGES_MEG,
							success: res => {}
						});
						uni.removeStorage({
							key: 'sys_dic',
							success: res => {}
						});
						uni.removeStorage({
							key: 'passWord',
							success: res => {}
						});
						uni.reLaunch({
							url: '/pages/login'
						});
					}
				}
			});
			return;
		}
	}
};
</script>

<style lang="scss" scoped>
.custom-bg-view {
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
	background-color: #fff;
}
.title-bar {
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding-top: 4px;
	color: #333333;
	font-weight: bold;
	font-size: 16px;
	border-bottom: 1px solid $uni-bg-color;
}
.subtitle{
	color: #999999;
	font-size: 13px;
	padding: 10px;
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
	padding: 10px 0px;
	border-bottom-color: #eeeeee;
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
	margin-top: 5px;
	height: 50px;
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
	font-size: 13px;
}
.bottom-view {
	padding: 10px;
	border-radius: 20px;
	background: #fff;
	border: 1px solid $uni-color-primary;
	font-size: 14px;
	color:$uni-color-primary;
	align-items: center;
	justify-content: center;
	text-align: center;
	margin: 30px 10px;
}
</style>
