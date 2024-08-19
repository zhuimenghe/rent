<template>
    <view class="container">
        <view class="item">
            <view class="item-title">语音内容</view>
            <view class="item-content">
                <view class="item-content-text">
                    “{ {{orgName||''}} }提醒您，您有尾号{ {{licenseId||''}} }设备低电量持续超{ {{ lowerPowerDay }} }天，为免电池损坏产生索赔纠纷，请尽快为设备充电。”
                </view>
            </view>
        </view>
        <view class="item">
            <view class="item-title">客户信息</view>
            <view class="item-content content">
                <view class="item-content-item">
                    <text style="color: #8C8C8C">推送客户联系人<text style="color:#e60000">*</text></text>
                    <input placeholder-style="text-align: right;color: #8C8C8C" style="flex: 1;font-size: 14px;text-align: right;"
                        placeholder="请输入姓名" v-model="name" />
                </view>
                <view class="item-content-item">
                    <text style="color: #8C8C8C">推送手机号<text style="color:#e60000">*</text></text>
                    <input :maxlength="11" placeholder-style="text-align: right;color: #8C8C8C" style="flex: 1;font-size: 14px;text-align: right;"
                        placeholder="请输入手机号" v-model="phone" />
                </view>
            </view>
        </view>
        <view class="tips">
            注：低电量语音推送发起后，系统会自动给客户联系人拨打语音电话。
        </view>
        <view class="flow-btns">
            <view class="btn cancel-btn" @click="cancel"><text>取消</text></view>
            <view class="btn submit-btn" @click="submit"><text>确定</text></view>
        </view>
    </view>
</template>
<script>
export default {
    name: 'low-battery-voice-reminder',
    data(){
        return {
            name: '',
            phone:'',
            item:{}
        }
    },
    onLoad(option) {
        let item = JSON.parse(decodeURIComponent(option.item));
        this.item=item||{};
        console.log(item, 'options');
    },
  async  created(){
        //手动触发一个action
       await this.$store.dispatch('global/getOrgList');
        console.log(this.$store.state.global.orgs,'orgs');
    },
    computed:{
        licenseId(){
            let item=this.item||{};
            if(item.licenseId){
                return item.licenseId.slice(-5);
            }else{
                return ''
            }
        },
        lowerPowerDay(){
            this.item=this.item||{};
            return Math.floor(Number(this.item.lowPowerHours||0)/24);
        },
        orgName(){
            let orgs=this.$store.state.global.orgs||[];
            return orgs.length>0?orgs[0].label:'';
        },
    },
    methods: {
        cancel() {
            uni.navigateBack({
                animationDuration: 200
            })
        },
        submit() {
            if(!this.name){
                uni.showToast({
                    title: '请输入姓名',
                    icon:'none',
                    duration: 2000
                });
                return;
            }
            if(!this.phone){
                uni.showToast({
                    title: '请输入电话号码',
                    icon:'none',
                    duration: 2000
                });
                return;
            }
            // let lowerPowerDay=Math.ceil(Number(this.item.lowPowerHours)/24);
            let param={
                params:[this.orgName,this.item.licenseId,this.lowerPowerDay],
                mobile:this.phone,
                customerName:this.name,
            }
            this.$network.getData(this.$url.LOWER_VOICE_REMIND, "POST",param).then((result) => {
                if(result.result==1013){
                    uni.showToast({
                        title: result.errmsg,
                        duration: 2000,
                        icon:'none'
                    })
                }
                if(result.result===0){
                    uni.showToast({
                        title: '语音电话提醒成功',
                        duration: 2000,
                        icon:'none'
                    })
                }
				}).catch((err) => {
                    uni.showToast({
                        title: '语音电话提醒失败',
                        duration: 2000,
                        icon:'none'
                    })
                })

        }
    }
}
</script>
<style scoped lang="scss">
.container {
    background-color: #F5F4F9;

    .item {
        .item-title {
            position: relative;
            font-size: 28rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            color: #222222;
            margin-left: 16rpx;
            line-height: 77rpx;
            height: 77rpx;

            &::before {
                content: '';
                position: absolute;
                left: -8px;
                top: 12px;
                width: 4rpx;
                height: 28rpx;
                background: #E60000;
            }
        }

        .item-content {
            padding: 34rpx 45rpx 60rpx 41rpx;
            background: #FFFFFF;
            height: 132rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #181818;
            line-height: 46rpx;

            .item-content-item {
                display: flex;
                justify-content: space-between;
                align-items: center;

                &:first-child {
                    border-bottom: 1rpx solid #ececec;
                    padding-bottom: 20rpx;
                    margin-bottom: 20rpx;
                }
            }
        }

        .content {
            padding: 30rpx;
        }
    }

    .tips {
        font-size: 28rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #FE931F;
        line-height: 42rpx;
        margin-top: 26rpx;
        padding: 0 40rpx 0 16rpx;
    }

    .flow-btns {
        position: fixed;
        display: flex;
        left: 0px;
        right: 0px;
        bottom: 0px;
        height: 60px;
        justify-content: space-between;
        flex-direction: row;
        align-items: center;
        background: #ffffff;
        z-index: 100;
        padding-left: 35rpx;
        padding-right: 35rpx;
        padding-bottom: calc(env(safe-area-inset-bottom) - 10px);

        .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 320rpx;
            height: 64rpx;
            border-radius: 6rpx;
            font-size: 28rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
        }
        .cancel-btn{
            background: #D8D8D8;

        }
        .submit-btn{
            background: #e60000;
        }
    }
}</style>