<template>
    <view class="container">
        <view class="inner">
            <view class="form">
                <!-- <view class="form-item">
                    <view class="form-item-title" style="margin-right:22px">机号</view>
                    <input style="flex: 1;font-size: 14px;" class="first" placeholder="请输入机号" v-model="licenseId" />
                </view> -->
                <view class="form-item">
                    <view class="form-item-title" style="margin-right:16rpx">动态码</view>
                    <input style="flex: 1;font-size: 14px;" maxlength="8" class="first" placeholder="请输入设备动态码"
                        v-model="dynamicCodes" />
                </view>
                <view class="form-item">
                    <view class="form-item-title">解锁密码</view>
                    <input style="font-size: 14px;width:176px" placeholder="请输入解锁密码"  v-model=" password " />
                    <view class="btn" @click=" generatePassword ">生成密码</view>
                </view>
                <view class="form-item">
                    <view class="copy" @click=" copyPassword ">复制密码</view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            licenseId: '',
            dynamicCodes: '',
            password: '',
            width: '159px'
        }
    },
    onLoad(options) {
        this.licenseId = options.licenseId || null;
    
        console.log(options, 'options');
    },
    methods: {
        generatePassword() {
            let params = {
                licenseId: this.licenseId,
                operationType: "0",
                dynamicCode: this.dynamicCodes
            }
            if (!this.dynamicCodes) {
                uni.showToast({
                    icon: 'none',
                    title: '请输入动态码'
                });
                return;
            }
            this.$network.getData(this.$url.UNLOCK_BY_PASSWORD + '?timestamp=' + new Date().getTime(), 'POST', params).then(res => {
                console.log(res, 'GET_MACHINE_TYPE_SCENE_RULE_BY_MACHINETYPE');
                if (res) {
                    this.password = res;
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: '密码生成失败'
                    });
                }
            })
        },
        copyPassword() {
            let that = this;
            if (!this.password) {
                uni.showToast({
                    icon: 'none',
                    title: '请先生成密码'
                });
                return;
            } else {
                uni.setClipboardData({
                    data: that.password,
                    success: function () {
                        uni.showToast({ title: "复制成功", icon: "none" });
                    }
                });
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.copy {
    font-size: 28rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #FE931F;
}

.container {
    width: 750rpx;
    background: #F5F4F9;
}

.inner {
    width: 750rpx;
    background: #FFFFFF;
    margin-top: 36rpx;
}

.form {
    padding: 60rpx 60rpx 60rpx 50rpx;
}

.form-item {
    display: flex;
    align-items: center;
    margin-top: 40rpx;
    justify-content: space-between;

    &:first-child {
        margin-top: 5rpx;
    }
}

.form-item-title {
    font-size: 28rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #222222;
    // margin-right: 16rpx;
}

input {
    border: 1rpx solid #e6e6e6;
    height: 70rpx;
    text-indent: 15rpx;
}

.first {
    margin-left: 15px;
}

.btn {
    width: 173rpx;
    height: 72rpx;
    background: #E60000;
    border-radius: 6rpx;
    color: #FFFFFF;
    text-align: center;
    line-height: 72rpx;
    // margin-left: 24rpx;
}
</style>