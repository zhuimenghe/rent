<template>
    <view class="container">
        <view class="search-container">
            <selectView :isShowBackground="false" style="width: 25%;" :value="subletStateObj.label" hint="转租状态"
                @clickSelect="showPick('subletState')" />
            <selectView :isShowBackground="false" style="width: 25%;" :value="rentStateObj.label" hint="租赁状态"
                @clickSelect="showPick('rentState')" />
            <selectView :isShowBackground="false" style="width: 25%;" :value="lockStatusObj.label" hint="锁机状态"
                @clickSelect="showPick('lockStatus')" />
            <selectView :isShowBackground="false" style="width: 25%;" :value="gpsObj.label" hint="GPS定位"
                @clickSelect="showPick('gpsObj')" />
        </view>
        <view class="content-containger">
            <view class="item-title">
                <view style="display:flex;align-items:center">
                    <view class="titleDot1">
                        <view class="titleDot2"></view>
                    </view>
                    <text style="margin-left:3px" class="bold">设备列表</text>
                </view>

            </view>
            <template v-if="dataList.length > 0">
                <view class="item-content" v-for="(item, index) in dataList" :key="index">
                    <view class="lisenid">
                        <text>{{ item.licenseId || '' }}<text v-if="item.printCode">（{{ item.printCode || ''
                                }}）</text></text>
                        <text class="state" style="color:#F08200" v-if="item.rentState == '已退租'">已退租</text>
                        <text class="state" style="color:#52C41A" v-else>租赁中</text>
                    </view>
                    <view class="height">
                        {{ item.label || '' }}{{ item.heightName ? ' | ' + item.heightName : '' }}{{ item.brand ? ' | '
                            +
                        item.brand : '' }}{{ item.name ? ' | ' + item.name : '' }}{{ item.subletState == 1 ? ' | 转租' : ' |自有' }}
                    </view>
                    <view class="stateName">
                        <view v-if="item.accStatus === '1' || item.accStatus === '0'">
                            <text v-if="item.accStatus === '1'">开机</text>
                            <text v-if="item.accStatus === '0'" style="background-color: #E60000;">关机</text>
                        </view>
                        <view v-if="item.lockStatus === '1' || item.lockStatus === '0'">
                            <text v-if="item.lockStatus === '1'" style="background-color: #E60000;">{{
                                item.lockStatusName
                                || '-' }}</text>
                            <text v-if="item.lockStatus === '0'">{{ item.lockStatusName || '-' }}</text>
                        </view>
                        <view v-if="item.offlineMode === false || item.offlineMode === true">
                            <text v-if="item.offlineMode === false">在线</text>
                            <text v-if="item.offlineMode === true" style="background-color: #E60000;">当前离线{{
                                item.offlineHours || 0 }}小时</text>
                        </view>
                    </view>
                    <view class="workin">
                        <text>
                            <text class="label">启用日期：</text>
                            <text class="value">{{ item.enableDate ? item.enableDate.split(' ')[0] : '-' }}</text>
                        </text>
                        <text>
                            <text class="label">截止日期：</text>
                            <text class="value">{{ item.settleDate ? item.settleDate.split(' ')[0] : '-' }}</text>
                        </text>
                    </view>
                    <view class="power">
                        <text class="label">
                            当前电量：
                        </text>
                        <text class="value success">{{ item.batteryPower === null ? '-' : item.batteryPower + '%'
                            }}</text>
                    </view>
                    <view class="location">
                        <text class="label">
                            当前定位：
                        </text>
                        <text class="value">{{ item.address || '-' }}</text>
                    </view>
                    <view class="location location-date">
                        <text class="label">
                            定位时间：
                        </text>
                        <text class="value">{{ item.locateDate || '-' }}</text>
                    </view>
                    <view class="btns">
                        <view>
                            <i class="iconfont iconIc-huabanche-yisuoche"
                                :style="{ color: !item.isGpsMachine || !item.showLockBtn || !!item.settleDate||!lockPermission ? '#C2C2C2' : 'coral' }"></i>
                            <text
                                :class="[!item.isGpsMachine || !item.showLockBtn || !!item.settleDate||!lockPermission ? 'disabled' : '']"
                                @click="lockOr(item, 'lock', 1)">锁车</text>
                        </view>
                        <!-- <view  v-if="d.dynamicPasswordSupport">
                            <i class="iconfont iconsuoche1"
                                :style="{ color: !item.isGpsMachine || item.showLockBtn ? '#C2C2C2' : 'coral' }"></i>
                               
                             <text :class="[!item.isGpsMachine || item.showLockBtn || !!item.settleDate ? 'disabled' : '']"
                                @click="handlePassword(item)">密码解锁</text>
                        </view> -->
                        <view>
                            <i class="iconfont iconsuoche1"
                                :style="{ color: !item.isGpsMachine || item.showLockBtn||!lockPermission ? '#C2C2C2' : 'coral' }"></i>
                            <text
                                :class="[!item.isGpsMachine || item.showLockBtn || !!item.settleDate||!lockPermission ? 'disabled' : '']"
                                @click="lockOr(item, 'unlock', 0)">解锁</text>
                        </view>
                        <view>
                            <i class="iconfont iconjiankongpingtai"
                                :style="{ color: !item.isGpsMachine ? '#C2C2C2' : 'coral' }"></i>
                            <text @click="gotoDetail(item, 'monitor')"
                                :style="{ color: !item.isGpsMachine ? '#C2C2C2' : 'coral' }">监控</text>
                        </view>
                        <view>
                            <i class="iconfont icondangan1-copy" style="color: coral"></i>
                            <text @click="gotoDetail(item, 'archives')">档案</text>
                        </view>
                    </view>
                </view>
            </template>
            <view class="empty-data-box" v-else>
                <image class="icon" mode="widthFix" src="/static/empty.png"></image>
                <text class="text">暂无数据</text>
            </view>
        </view>

        <uni-popup ref="confirmPop" type="center" :mask-click="true">
            <view class="confirm-popup">
                <view class="text-center text-lg text-bold">提示</view>
                <view class="margin-top-xl text-gray">
                    <view style="margin-bottom:3px;color:#222;font-size: 32rpx;">
                        您确定将以下设备进行{{ curOpType ? '锁车' : '解锁' }}吗？
                    </view>
                    <view class="licenseid">
                        <text class="label">机号</text>
                        <text class="label">自喷码</text>
                    </view>
                    <view class="licenseid">
                        <text class="value">{{ curDevice.licenseId || '-' }}</text>
                        <text class="value">{{ curDevice.printCode || '-' }}</text>
                    </view>
                    <view class="reason" v-if="curOpType">
                        <text class="value">锁车原因</text>
                        <view style="border:1px solid #ccc;padding:2px;margin-top:10px">
                            <textarea v-model="reason" placeholder-style="color:#8c8c8c;font-size:14px;padding:6px"
                                placeholder="请输入锁车原因" />
                        </view>
                    </view>
                </view>
                <view class="flex justify-between margin-top-xl">
                    <view style="width:236rpx;background:#F4F3F8;color:#8c8c8c" class="z-btn bg-light-gray radius"
                        @click="$refs.confirmPop.close()">取消</view>
                    <view style="width:236rpx" class="z-btn bg-primary radius" @click="confirmOperation">确定</view>
                </view>
            </view>
        </uni-popup>
        <w-picker canText="重置" :selectList="selectList" @cancel="handleCancel" @confirm="onConfirm" mode="selector"
            ref="selector" themeColor="#E60000" />
    </view>
</template>
<script>
import selectView from "@/components/common/common-ui/selector-view.vue";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import { lockDevice } from '@/network';

export default {
    name: 'device-inventory',
    props: {
        baseInfo: {
            type: Object,
            default: () => { }
        }
    },
    components: {
        selectView,
        wPicker
    },
    data() {
        return {
            lockPermission: false,//是否有锁车与解锁的权限
            curOpType: 0,
            reason: null,
            //转租状态
            subletStateObj: {
                label: '转租状态',
                value: null,
                selectList: [
                    {
                        label: '转租',
                        value: '1',
                    },
                    {
                        label: '自有',
                        value: '0',
                    }
                ]
            },
            // 租赁状态
            rentStateObj: {
                label: '租赁状态',
                value: null,
                selectList: [
                    {
                        label: '已退租',
                        value: '1',
                    },
                    {
                        label: '租赁中',
                        value: '0',
                    }
                ]
            },
            // 锁机状态
            lockStatusObj: {
                label: '锁机状态',
                value: null,
                selectList: [
                    {
                        label: '已锁',
                        value: '1',
                    },
                    {
                        label: '未锁',
                        value: '0',
                    }
                ]
            },
            // GPS定位
            gpsObj: {
                label: 'GPS定位',
                value: null,
                selectList: [
                    {
                        label: '有',
                        value: '1',
                    },
                    {
                        label: '没有',
                        value: '0',
                    }
                ]
            },
            selectList: [],//选择框保存的数据
            picktype: '',
            dataList: [],
            curDevice: {}
        }
    },
    created() {
        this.init();
        this.getHasPermissionOfLock()
    },
    methods: {
        // 获取是否有锁车和解锁的权限
        getHasPermissionOfLock() {
            try {
                this.lockPermission = JSON.parse(uni.getStorageSync('hasLockPersion'))
                console.log(this.lockPermission, 'this.lockPermission');
            } catch (error) {
                this.lockPermission = false;
            }
        },
        handlePassword(deviceInfo) {
            if (!!deviceInfo.settleDate) return;//已还租的设备 不允许进行解锁机
            let url = `/devicePages/control/components/lock-by-password?licenseId=${deviceInfo.licenseId}`;
            uni.navigateTo({
                url: url
            });
        },
        handleCancel(payload) {
            console.log(payload, 'handleCancel');
            switch (this.picktype) {
                case "subletState":
                    this.subletStateObj.value = null; this.subletStateObj.label = null; this.init()
                    break;
                case "rentState":
                    this.rentStateObj.value = null; this.rentStateObj.label = null; this.init()
                    break;
                case "lockStatus":
                    this.lockStatusObj.value = null; this.lockStatusObj.label = null; this.init()
                    break;
                case "gpsObj":
                    this.gpsObj.value = null; this.gpsObj.label = null; this.init()
                    break;
                default:
                    break;
            }
        },
        async confirmOperation() {
            if (this.curOpType && !this.reason) {
                uni.showToast({
                    title: '请输入锁车原因',
                    duration: 2000,
                    icon: 'none'
                });
                return;
            }
            uni.showLoading({
                title: '提交中'
            });
            await lockDevice({ licenseIdList: [this.curDevice.licenseId], operationType: this.curOpType, opReason: this.reason })
            this.$refs.confirmPop.close()
            uni.showToast({
                title: '指令提交成功',
                duration: 2000,
            });
            this.init()
            this.loadmore(true, this.list.length)
        },
        lockOr(item, type, opType) {
            this.curOpType = opType;
            this.curDevice = item;
            //已还租设备 不让进行解锁机操作
            if (!!item.settleDate||!this.lockPermission) return;
            //未锁 展示锁车的按钮 已锁 展示解锁按钮 lockStatus==='0' 未锁 showLockBtn
            if (type === 'lock' && item.showLockBtn) {
                this.$refs.confirmPop.open();
                this.reason = null;
            } else if (type === 'unlock' && !item.showLockBtn) {
                this.$refs.confirmPop.open();
                this.reason = null;
            }
        },
        async init() {
            let params = {
                contractNo: this.baseInfo.businessNo,
                subletState: this.subletStateObj.value !== null ? this.subletStateObj.value : null,
                rentState: this.rentStateObj.value !== null ? this.rentStateObj.value : null,
                lockStatus: this.lockStatusObj.value !== null ? this.lockStatusObj.value : null,
                gpsInfo: this.gpsObj.value !== null ? this.gpsObj.value : null
            }
            let res = await this.$network.getmachineInfoListApi(params);
            console.log(res, 'getmachineInfoListApi');
            this.dataList = res.records;
        },
        gotoDetail(item, type) {
            switch (type) {
                case 'monitor':
                    if (!item.isGpsMachine) {
                        uni.showToast({
                            title: '当前设备暂无监控数据',
                            duration: 2000,
                            icon: 'none'
                        }); return;
                    }
                    uni.navigateTo({
                        url:
                            "/devicePages/monitor/device-monitor-detail?licenseId=" +
                            item.licenseId +
                            "&deviceNum=" +
                            item.deviceNum,
                    }); break;
                case 'archives': uni.navigateTo({
                    url: '/devicePages/record/device-record-detail?licenseId=' + item.licenseId
                }); break;
                default: break;
            }

        },
        showPick(type) {
            this.picktype = type;
            switch (type) {
                case "subletState":
                    this.selectList = this.subletStateObj.selectList;
                    break;
                case "rentState":
                    this.selectList = this.rentStateObj.selectList;
                    break;
                case "lockStatus":
                    this.selectList = this.lockStatusObj.selectList;
                    break;
                case "gpsObj":
                    this.selectList = this.gpsObj.selectList;
                    break;
                default:
                    break;
            }
            this.$refs.selector.show();
        },
        onConfirm(val) {
            switch (this.picktype) {
                case "subletState":
                    this.subletStateObj = {
                        ...this.subletStateObj,
                        value: val.checkArr.value,
                        label: val.checkArr.label
                    };
                    this.init();
                    break;
                case "rentState":
                    this.rentStateObj = {
                        ...this.rentStateObj,
                        value: val.checkArr.value,
                        label: val.checkArr.label
                    };
                    this.init();

                    break;
                case "lockStatus":
                    this.lockStatusObj = {
                        ...this.lockStatusObj,
                        value: val.checkArr.value,
                        label: val.checkArr.label
                    };
                    this.init();

                    break;
                case "gpsObj":
                    this.gpsObj = {
                        ...this.gpsObj,
                        value: val.checkArr.value,
                        label: val.checkArr.label
                    };
                    this.init();
                    break;
                default:
                    break;
            }
        },
    }
}
</script>
<style scoped lang="scss">
.confirm-popup {
    box-sizing: border-box;
    width: 648rpx;
    border-radius: 8rpx;
    padding: 30rpx 32rpx 24rpx 32rpx;
    background: $uni-bg-color;
}

.empty-data-box {
    margin-top: 60rpx;
    margin-bottom: 30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 15px;
    color: var(--text-color-gray);

    .icon {
        width: 108rpx;
    }

    .text {
        font-size: 28rpx;
    }
}

.disabled {
    color: #C2C2C2;
}

.item-content {
    padding: 14rpx 0 0 0;

    &:last-child {
        margin-bottom: 30rpx;
    }

    .lisenid {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #222222;
        padding: 0 22rpx;

        .state {
            font-size: 28rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #52C41A;
        }
    }

    .height {
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #8C8C8C;
        padding: 0 22rpx;
        margin-top: 8rpx;
    }

    .stateName {
        padding: 0 22rpx;
        display: flex;

        view {
            margin-left: 16rpx;

            &:first-child {
                margin-left: 0;
            }
        }

        text {

            display: inline-block;
            // width: 64rpx;
            // height: 32rpx;
            padding: 4rpx 16rpx;
            background: #52C41F;
            border-radius: 6px;
            color: #fff;
            margin-left: 16rpx;
            margin-top: 8rpx;
            font-size: 24rpx;

            &:first-child {
                margin-left: 0;
            }
        }
    }

    .workin {
        padding: 0 22rpx;

        margin-top: 8rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &:last-child {
            margin-right: 35rpx;
        }
    }

    .power {
        padding: 0 22rpx;

        margin-top: 8rpx;
    }

    .location {
        padding: 0 22rpx;
        margin-top: 8rpx;
    }

}

.btns {
    width: 100%;
    height: 64rpx;
    margin-top: 16rpx;
    background: #f6f6f6;
    display: flex;
    align-items: center;
    color: coral;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #f08200;
    box-sizing: border-box;
    justify-content: space-between;
    padding: 0 40rpx;

    i {
        margin-right: 5rpx;
    }

    view {
        display: flex;
        align-items: center;
    }
}

.label {
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8C8C8C;
}

.value {
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #222222;
}

.container {
    padding: 0 12rpx;
    // padding-bottom: 30rpx;
}

.success {
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #52C41F;
}

.content-containger {
    background: #FFFFFF;
    // box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.16);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.16) inset;
    border-radius: 6rpx;
}

.search-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0 !important;
}

.item-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #222222;
    line-height: 50rpx;
    padding: 22rpx 25rpx;
    border-bottom: 1rpx solid #e6e6e6;
}

.licenseid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #E6E6E6;
    line-height: 70rpx;

    text {
        flex: 1;
        text-align: center;
    }

    .label {
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #888888;
    }

    .value {
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #222222;
    }
}

.reason {
    margin-top: 40rpx;

    text {
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #222222;
    }

    textarea {
        height: 150rpx;
        font-size: 13px;

    }
}
</style>