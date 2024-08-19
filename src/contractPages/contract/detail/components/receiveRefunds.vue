<template>
    <view class="workin-out">
        <!-- 头部 -->
        <view class="header-icon card">
            <template v-for="item in workInOutList">
                <view class="icon-item">
                    <view class="img-wrapper">
                        <dashboard-icon :icon="item.icon" :iconColor="item.color"
                            :backgroundColor="item.bgc"></dashboard-icon>
                    </view>
                    <view class="txt">
                        <text>{{ item.name }}</text>
                        <text class="bold">{{ Number(item.num).toFixed(2) || '0:00' }}</text>
                    </view>
                </view>
            </template>
        </view>
        <view class="main">
            <!-- 收款记录 -->
            <view class="workin-record ">
                <view class="item-title">
                    <view class="titleDot1">
                        <view class="titleDot2"></view>
                    </view>
                    <text style="margin-left:5px">收款记录</text>
                </view>
                <template v-if="workInList.length > 0">
                    <view class='list' v-for="(item, index) in workInList">
                        <view class="list-item" @click="goTo(item)">
                            <view class="date">
                                <text>收款日期：{{ item.receiptDate && item.receiptDate.split(' ')[0] || '-' }}</text>
                                <text>收款金额：{{ Number(item.total).toFixed(2) || '0:00' }}</text>
                            </view>

                            <view class="gray">
                                <text>收款方式：{{ item.typeName || '-' }}</text>
                                <text class="second">收款联系人：{{ item.contactName || '-' }}</text>
                            </view>
                            <view class="gray">
                                <text>联系方式：{{ item.phoneNum || '-' }}</text>

                                <text class="second">审批状态：{{ item.stateName || '-' }}</text>
                            </view>
                        </view>

                        <!-- <view class="btns">
                        <i class="iconfont iconxiazai3" style="color:coral"></i>
                        <text @click="onNavBarButtonTap(item)">下载</text>
                    </view> -->
                    </view>
                </template>
                <view class="empty-data-box" v-else>
                    <image class="icon" mode="widthFix" src="/static/empty.png"></image>
                    <text class="text">暂无数据</text>
                </view>
            </view>
            <!-- 退款记录 -->
            <view class="workin-record">
                <view class="item-title">
                    <view class="titleDot1">
                        <view class="titleDot2"></view>
                    </view>
                    <text style="margin-left:5px">退款记录</text>
                </view>
                <template v-if="workOutList.length > 0">
                    <view class='list' v-for="(item, index) in workOutList">
                        <view class="list-item" @click="goTo(item)">
                            <view class="date">
                                <text>退款日期：{{ item.refundTime && item.refundTime.split(' ')[0] || '-' }}</text>
                                <text>退款金额：{{ Number(item.total).toFixed(2) || '0:00' }}</text>
                            </view>

                            <view class="gray">
                                <text>退款方式：{{ item.typeName || '-' }}</text>
                                <text class="second">退款联系人：{{ item.contactName || '-' }}</text>
                            </view>
                            <view class="gray">
                                <text>联系方式：{{ item.phoneNum || '-' }}</text>

                                <text class="second">审批状态：{{ item.stateName || '-' }}</text>
                            </view>
                        </view>
                        <!-- <view class="btns">
                        <i class="iconfont iconxiazai3" style="color:coral"></i>
                        <text @click="onNavBarButtonTap(item)">下载</text>
                    </view> -->
                    </view>
                </template>
                <view class="empty-data-box" v-else>
                    <image class="icon" mode="widthFix" src="/static/empty.png"></image>
                    <text class="text">暂无数据</text>
                </view>
            </view>
            <!-- 开票记录 -->
            <view class="workin-record">
                <view class="item-title">
                    <view class="titleDot1">
                        <view class="titleDot2"></view>
                    </view>
                    <text style="margin-left:5px">开票记录</text>
                </view>
                <template v-if="stopRecord.length > 0">
                    <view class='list '>

                        <view class="list-item border-1" v-for="(item, index) in stopRecord" @click="goTo(item)">
                            <view class="date">
                                <text>开票日期：{{ item.createTime && item.createTime.split(' ')[0] || '-' }}</text>
                                <text>开票金额：{{ Number(item.invoiceSum).toFixed(2) || '0:00' }}</text>
                            </view>
                            <view class="gray">
                                <text>发票抬头：{{ item.invoiceName || '-' }}</text>
                            </view>
                            <view class="gray">
                                <text>开票类型：
                                    <template v-if="item.invoiceType == 1">普票</template>
                                    <template v-else-if="item.invoiceType == 2">专票</template>
                                    <template v-else>不开票</template>
                                </text>
                                <text class="second">审批状态：{{ item.stateName || '-' }}</text>
                            </view>
                        </view>
                    </view>
                </template>
                <view class="empty-data-box" v-else>
                    <image class="icon" mode="widthFix" src="/static/empty.png"></image>
                    <text class="text">暂无数据</text>
                </view>

            </view>



        </view>
    </view>
</template>
<script>
import dashboardIcon from "@/components/common/sany/dashboardIcon.vue";

export default {
    components: { dashboardIcon },
    props: {
        baseInfo: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            workInOutCount: {},
            workInList: [],
            workOutList: [],
            stopRecord: [],
        }
    },
    created() {
        console.log(this.baseInfo, 'this.baseInfo');
        this.init();
        this.loaddata();
        this.loaddataheader()
        this.loaddataworkout();
        this.loaddataStopRecord();
    },
    methods: {
        goTo(item) {
            console.log(item, 'goTo');
            let key = item.businessNo.substring(0, 2);
            console.log(key, 'key');
            let self = this;

            console.log(item, "detainInfo11");
            switch (key) {
                case "KP":
                    uni.navigateTo({
                        url:
                            "/businessPages/invoice/invoice-detail?businessNo=" +
                            item.businessNo,
                    });
                    break;
                case "SK":
                    uni.navigateTo({
                        url:
                            "/businessPages/proceed/porceeds-detail?businessNo=" +
                            item.businessNo,
                    });
                    break;
                // 退款
                case "TK":
                    uni.navigateTo({
                        url:
                            "/businessPages/reimburse/reimburse-detail?businessNo=" +
                            item.businessNo,
                    });
                    break;
                default:
                    uni.showToast({
                        icon: "none",
                        title: "该功能未在APP开放，请去PC端处理",
                    });
                    break;
            }
        },
        async loaddataheader() {
            let key = this.baseInfo.businessNo;
            let url = this.$url.SETTLE_PROCEEDS_SYNTHESIZE + key
            let res = await this.$network.getData(url, 'GET', null);
            this.workInOutCount = res;
            console.log(res, 'loaddata');
        },


        // 开票记录
        async loaddataStopRecord() {
            let param = {
                current: 1,
                size: 5000,
                contractNo: this.baseInfo.businessNo
            };
            let res = await this.$network.getData(this.$url.SETTLE_INVOICE_LIST, 'POST', param);
            this.stopRecord = res.records || [];
            console.log(this.stopRecord, 'this.stopRecord');
        },

        async loaddataworkout() {
            let param = {
                current: 1,
                size: 5000,
                contractNo: this.baseInfo.businessNo
            };
            let res = await this.$network.getData(this.$url.SETTLE_REIMBURSE_LIST, 'POST', param)
            this.workOutList = res.records || [];
            console.log(this.workOutList, 'workOutList');
        },
        onNavBarButtonTap(obj) {
            console.log(obj, 'obj');
            if (
                this.baseInfo.state !== "0" &&
                this.baseInfo.state !== "3" &&
                this.baseInfo.state !== "12"
            ) {
                let headerDic = {
                    "Content-Type": "application/json",
                    Authorization: "",
                };
                let loginMes = uni.getStorageSync(this.$savekey.LOGIN_MEG);
                if (loginMes) {
                    let access_token =
                        loginMes.token_type + " " + loginMes.access_token;
                    headerDic.Authorization = access_token;
                    this.downDocument(headerDic, obj);
                }
            } else {
                uni.showToast({
                    icon: "none",
                    title: "暂无下载权限",
                });
            }

        },
        downDocument(headerDic, obj) {
            let url =
                this.$url.BASE_URL +
                this.$url.DOWNLOAD_WORD_CONTRACT +
                "?businessNo=" +
                obj.businessNo;
            this.$network
                .getData(url, "GET", null)
                .then((result) => { })
                .catch((err) => {
                    if (err.code) {
                        uni.showToast({
                            title: err.message + ":" + err.details[0],
                            icon: "none",
                        });
                    } else {
                        setTimeout(() => {
                            this.downxlsc(url, headerDic);
                        }, 100);
                    }
                });
        },
        downxlsc(url, headerDic, obj) {
            let customerName = obj.customerName
                ? obj.customerName
                : "";
            let projectName =
                obj.projectName && obj.projectName
                    ? obj.projectName
                    : "";
            let name = "合同-" + customerName + projectName + "-";
            if (headerDic != null) {
                let filename = this.$gxfmethod.getFileNameDoc(name, ".docx");
                this.$gxfmethod.downFunc(url, "GET", undefined, filename);
            } else {
                let filename = this.$gxfmethod.getFileNameDoc(name, ".pdf");
                this.$gxfmethod.downEsignFunc(url, "GET", undefined, filename);
            }
        },
        async init() {
            if (!this.baseInfo.businessNo || !this.baseInfo.id) return;
            let param = {
                contractNo: this.baseInfo.businessNo,
                id: this.baseInfo.id
            };
            let res = await this.$network.getData(this.$url.SETTLE_PROCEEDS_LIST, "get", param);
            this.workInOutCount = res;
        },

        // 进场记录
        async loaddata() {
            let param = {
                current: 1,
                size: 5000,
                contractNo: this.baseInfo.businessNo
            };
            let res = await this.$network.getData(this.$url.SETTLE_PROCEEDS_PAGE, 'POST', param)
            this.workInList = res.records || [];
            console.log(res, this.workInList, 'this.workInList');
        }
    },
    computed: {
        workInOutList() {
            let _this = this;
            return [{ name: '收款总额', num: _this.workInOutCount['proceedCount'] || 0, icon: 'iconshoukuan1', color: '#52c41a', bgc: '#EDF9E8' },
            { name: '退款总额', num: _this.workInOutCount['reimburseCount'] || 0, icon: 'icontuikuan1', color: '#fe931f', bgc: '#FEF4E8' },
            { name: '开票金额', num: _this.workInOutCount['invoiceCount'] || 0, icon: 'iconfapiao', color: '#3988ff', bgc: '#EBF3FF' }
            ]
        },
    }
}
</script>
<style lang="scss" scoped>
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

.card {
    background: #FFFFFF;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.16);
    border-radius: 10rpx;
    padding: 36rpx 25rpx 0;
    margin-bottom: 30rpx;
}

.border-1 {

    border-bottom: 1rpx solid #E6E6E6;
}

.list {
    padding-bottom: 10rpx;

    .list-item {
        padding: 22rpx 25rpx;
        padding-bottom: 10rpx;
        border-bottom: 1px solid #e6e6e6;
    }

    .date {
        display: flex;
        justify-content: space-between;
        font-size: 30rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #222222;
        margin-bottom: 16rpx;
    }

    .flex {
        flex-wrap: nowrap;
    }

    .gray {
        display: flex;
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #8C8C8C;
        margin-bottom: 12rpx;

        text {
            flex-basis: 50%;
        }

    }
}

.workin-record {
    background: #FFFFFF;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.16);
    border-radius: 10rpx;
    margin-bottom: 38rpx;

    // padding-bottom: 8rpx;
    .list:last-child {
        padding-bottom: 0 !important;

    }
}

.btns {
    width: 100%;
    height: 64rpx;
    background: #F6F6F6;
    display: flex;
    align-items: center;
    color: coral;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #F08200;
    box-sizing: border-box;
    justify-content: flex-end;
    padding: 0 40rpx;

}

.workin-out {
    background-color: #fff;
    padding: 28rpx 16rpx 0 16rpx;

    .header-icon {
        display: flex;
        flex-wrap: wrap;
        padding-left: 13px;

        .icon-item {
            flex-basis: 50%;
            font-size: 24rpx;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            display: flex;
            color: #888888;
            margin-bottom: 30rpx;

            .img-wrapper {
                width: 72rpx;
                height: 72rpx;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .txt {
                margin-left: 18rpx;
                display: flex;
                flex-direction: column;

                .bold {
                    font-size: 32rpx;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #222222;
                    margin-top: 5rpx;
                }
            }
        }
    }

    .main {
        .item-title {
            display: flex;
            align-items: center;
            font-size: 30rpx;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #222222;
            line-height: 50rpx;
            padding: 22rpx 25rpx;
            border-bottom: 1rpx solid #e6e6e6;
        }
    }
}

.second {
    margin-left: 35px;
}
</style>