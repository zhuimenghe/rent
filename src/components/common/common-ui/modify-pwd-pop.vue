<template>
	<!-- 添加弹窗 -->
	<view class="pwd-container" v-if="isShow" @click.stop="">
		<view class="pwd-content">
			<view class="pwd-tip-title">
				<text>{{ title || '' }}</text>
			</view>
			<text style="font-size: 14px;color: #333333">{{ subTitle || '' }}</text>
			<view v-if="isOldPwd">
				<text style="font-size: 13px;color: #333333;margin: 16px 10px;">用户名：{{ userName || '' }}</text>
				<input class="pwd-input-style" type="password" v-model="oldPwd" placeholder="请输入旧密码" />
			</view>
			<input class="pwd-input-style" type="password" v-model="pwd" placeholder="请输入新密码" />
			<input class="pwd-input-style" type="password" v-model="againPwd" placeholder="请再次输入新密码" />
			<text style="font-size: 13px;color: #333333">提示：密码必须是8~20位，包含字母、数字、特殊字符 ,.@$!%*#?&</text>

			<view class="pwd-group-button"><text class="pwd-button" @click.stop="confirm">确定</text></view>
		</view>
	</view>
</template>

<script>
import commonMethod from '@/common/common-method/common-method.js';
import gxfmethod from '@/common/common-method/common-gxf-method.js';
import * as url from '@/network/url-constant.js'
import * as savekey from '@/common/common-method/save-key.js'
import network from '@/network/'
export default {
	name: 'modifyPwdPopup',
	props: {
		title: {
			type: String,
			default: '温馨提示'
		},
		subTitle: {
			type: String,
			default: '首次登录系统后必须修改密码'
		},
		//是否显示旧密码
		isOldPwd: Boolean,
		userName: String,
		tenant: String,
		//是否作为组件使用率
		isComponent: Boolean
	},
	computed: {
		isShow() {
			//除了作为组件show=false时不显示
			if (this.isComponent && !this.show) {
				return false;
			}
			return true;
		}
	},
	data() {
		return {
			oldPwd: '',
			pwd: '',
			againPwd: '',
			show: false
		};
	},
	created() {
		uni.$on("resetPwd",()=>{
			this.hide();
		})
	},
	destroyed() {
		this.$off("resetPwd")
	},
	methods: {
		open() {
			this.show = true;
		},
		hide() {
			this.show = false;
			this.oldPwd =""
			this.pwd =""
			this.againPwd =""
		},
		confirm(e) {
			if (this.isOldPwd && !this.oldPwd) {
				uni.showToast({
					icon: 'none',
					title: '请输入旧密码'
				});
				return;
			}
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
			if (!commonMethod.checkPwd(this.pwd)) {
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

			let param = {
				newPassword: gxfmethod.encrypt(this.pwd),
				oldPassword: gxfmethod.encrypt(this.oldPwd),
				confirm:gxfmethod.encrypt(this.againPwd)
			};
			uni.showLoading()
			if (this.isOldPwd) {
				this.updateExpirePwd();
			} else {
				this.updateOriginPwd();
			}
		},
		//修改过期密码
		updateExpirePwd() {
			uni.showLoading()
			let resdata = uni.getStorageSync(savekey.USER_INFO_MEG);
			let idstr = resdata.id;
			let param = {
				  "newPassword": gxfmethod.encrypt(this.pwd),
				  "oldPassword": gxfmethod.encrypt(this.oldPwd),
				  "tenant": this.tenant,
				  "userName": this.userName
			};
			network
				.getData(url.PASS_EXPIRE_UPDATE, 'POST', param)
				.then(result => {
					uni.hideLoading();
					uni.removeStorage({
						key: "passWord",
						success: res => {}
					});
					uni.showToast({
						image: 'none',
						title: '密码修改成功'
					});
					this.$emit('confirm', param);
					this.hide();
					
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: err.message
					});
				});
		},//修改原始密码
		updateOriginPwd() {
			uni.showLoading()
			let param = {
				newPassword: gxfmethod.encrypt(this.pwd)
			};
			network
				.getData(url.PASS_ORIGIN_UPDATE, 'POST', param)
				.then(result => {
					uni.hideLoading();
					uni.showToast({
						image: 'none',
						title: '密码修改成功'
					});
					this.hide();
					this.loginOut();
					this.$emit('confirm', param);
					
				})
				.catch(err => {
					uni.hideLoading();
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
						uni.removeStorageSync(savekey.LOGIN_MEG);
						uni.removeStorage({
							key: savekey.USER_INFO_MEG,
							success: res => {}
						});
						uni.removeStorage({
							key: savekey.USER_PRIVILEGES_MEG,
							success: res => {}
						});
						uni.removeStorage({
							key: 'sys_dic',
							success: res => {}
						});
						uni.removeStorage({
							key: "passWord",
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
//窗体
.pwd-container {
	/* #ifndef APP-NVUE */
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	z-index: 1000;
	/* #endif */
	background-color: rgba($color: #000000, $alpha: 0.5);
	justify-content: center;
	align-items: center;
}
/* 提示窗口 */
.pwd-content {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	padding: 15px;
	width: 300px;
	background-color: #fff;
	border-radius: 10px;
	justify-content: center;
	align-items: center;
}

.pwd-tip-title {
	display: flex;
	padding: 5px;
	color: $uni-text-color;
	font-size: $uni-font-size-lg;
	font-weight: bold;
	justify-content: center;
	align-items: center;
	font-size: 16px;
	font-weight: bold;
}

.pwd-input-style {
	height: 35px;
	width: 270px;
	background-color: #ffffff;
	/* #ifndef APP-NVUE */
	border-width: 0px 0px 1px 0px;
	/* #endif */
	border-bottom-width: 1px;
	border-bottom-color: $uni-bg-color-grey;
	border-style: solid;
	margin: 10px;
	padding: 4px;
	font-size: 13px;
	color: $uni-text-color;
}

.pwd-group-button {
	display: flex;
	flex-direction: row;
	margin-top: 20px;
}

.pwd-button {
	width: 270px;
	text-align: center;
	padding: 8px 0px;
	font-size: $uni-font-size-base;
	color: $uni-color-primary;
}
</style>
