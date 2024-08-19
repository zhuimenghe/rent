<template>
    <view class="merge-signatures-wrapper">
        <view class="top-tip">
            <view class="tip-icon">?</view>
            <view class="tip-text">系统检测出当前合同有如下单据未进行电签，您可对以下单据进行【合并电签】，客户仅需签署一次即可。不合并签署可选择【单独签署】</view>
        </view>
        <view class="merge-signatures-list">
            <view class="merge-signatures-title">
                <view class="line"></view>
                可合并签署单据
            </view>
            <template v-if="mergeEsignList.length">
                <view class="merge-signatures-item" v-for="(item, index) in mergeEsignList"
                    @click="changeChecked(item, index)">
                    <view class="left">
                        <view class="merge-signatures-item-title">
                            <view class="merge-signatures-item-buiness">单号：{{ item.businessNo || '-' }}</view>
                            <view class="merge-signatures-item-tag">{{ getBusinessTypeName(item) }}</view>
                        </view>
                        <view class="merge-signatures-item-date">
                            创建日期：{{ item.createTime && item.createTime.split(' ')[0] || '-' }}
                        </view>
                    </view>
                    <view class="right">
                        <mycheckbox :inverseColor="item.checked ? true : false" :checked="item.checked"
                            :disabled="false" class="checkbox" color="#E60000" />
                    </view>
                </view>
            </template>
            <view v-else class="empty-data-view">
                <empty-data></empty-data>
            </view>
        </view>

        <view style="height: 80px; width: 100%"></view>
        <view class="bottom-view">
            <view class="bottom-left-view" @click="clickecancle">
                <text>{{ "取消" }}</text>
            </view>
            <view class="bottom-right-view warning" @click="handleEsign('single')">
                <text>单独签署</text>
            </view>
            <view class="bottom-right-view" @click="handleEsign('merge')">
                <text>合并电签</text>
            </view>
        </view>
    </view>
</template>
<script>
import { queryStringfy } from "@/common/common-method/common-method";
import EmptyData from "@/components/common/sany/empty-data.vue";

export default {
    name: 'merge-signatures',
    components: { EmptyData },
    watch: {
        'esignParams.contractNo': {
            handler(val) {
                if (val) {
                    this.getContractDetail(val)
                }
            },
            immediate: true
        }
    },
    data() {
        return {
            curBusiness: {},
            esignParams: {
                mergeBusinessDto: {},
                isMerge: false
            },//合并电签需要的参数
            mergeEsignList: [],
        }
    },
    onLoad(options) {
        this.esignParams = JSON.parse(decodeURIComponent(options.esignParams));
        this.mergeEsignList = JSON.parse(decodeURIComponent(options.mergeEsignList));
        if (this.mergeEsignList.length) {
            this.filterList(); return;
        }
        if (this.esignParams.contractNo) {
            this.getMergeList(this.esignParams.contractNo);
            this.getContractDetail(this.esignParams.contractNo)
        }
    },
    methods: {
        // 请求合同详情
        async getContractDetail(contractNo) {
            let contractObj = await this.$network.getData(
                this.$url.CONTRACT_DEATIL_BY_NO + "?businessNo=" + contractNo,
                "GET",
                null
            );
            this.esignParams={
                ...this.esignParams,
                contactName:contractObj&&contractObj.contractDetailDto?contractObj.contractDetailDto.contactName:'',
                phoneNum:contractObj&&contractObj.contractDetailDto?contractObj.contractDetailDto.phoneNum:'',
            }
        },
        getBusinessTypeName(item) {
            let info = {
                workIn: '进场',
                contract: '合同',
                workOut: '退场',
                settlement: '结算'
            }
            return info[item.businessType] || '合同'
        },
        resetEsignParams() {
            this.esignParams = {
                ...this.esignParams,
                mergeBusinessDto: {},
                isMerge: false
            }
        },
        // 设置需要合并的单号
        setMergeList(list) {
            this.resetEsignParams()
            list = [...list, this.curBusiness];
            let workInNoList = [], workOutNoList = [], settlementNoList = [];
            if (list && list.length) {
                for (let i = 0; i < list.length; i++) {
                    switch (list[i].businessType) {
                        case "contract":
                            this.esignParams.mergeBusinessDto = {
                                ...this.esignParams.mergeBusinessDto,
                                contractNo: list[i].contractNo,
                            };
                            break;
                        case "workIn":
                            workInNoList.push(list[i].businessNo); break;
                        case "workOut":
                            workOutNoList.push(list[i].businessNo); break;
                        case "settlement":
                            settlementNoList.push(list[i].businessNo); break;
                    }
                }
                this.esignParams = {
                    ...this.esignParams,
                    isMerge: true,
                    mergeBusinessDto: {
                        ...this.esignParams.mergeBusinessDto,
                        workInNoList,
                        workOutNoList,
                        settlementNoList,
                    }
                }
            }
        },
        handleEsign(type) {
            let arr = this.mergeEsignList.filter((item) => {
                return item.checked;
            });
            if (type !== 'single') {
                //合并电签
                this.setMergeList(arr);
                if (!arr.length) {
                    uni.showToast({
                        title: '请选择要进行合并的单据',
                        duration: 2000,
                        icon: 'none'
                    });
                    return;
                }
            } else {
                //如果勾选了 但是又点击了单独签署
                if (arr.length) {
                    uni.showToast({
                        title: '请取消勾选后进行单独签署',
                        duration: 2000,
                        icon: 'none'
                    });
                    return;
                }
                this.esignParams = {
                    ...this.esignParams,
                    isMerge: false,
                }
            }

            uni.navigateTo({
                url:
                    "/otherPages/esign/esign-start-process?isStart=true&" +
                    queryStringfy(this.esignParams, false) + "&fromPath=merge-signatures"
            });
        },
        changeChecked(item, index) {
            this.mergeEsignList[index].checked = !this.mergeEsignList[index].checked;
            this.setMergeList(this.mergeEsignList)
        },
        // 根据合同单号获取可合并的列表
        async getMergeList(v) {
            let res = await this.$network.getData(this.$url.CONTRACT_EXECUTE_INFO_ESIGN, "GET", {
                contractNo: v,
            });
            this.mergeEsignList = res ? res.map((item) => {
                return {
                    ...item,
                    checked: false,
                }
            }) : [];
            // 过滤掉businessType等于启动页面的单据
            this.filterList()
        },
        // 过滤掉businessType等于启动页面的单据
        filterList() {
            this.mergeEsignList = this.mergeEsignList.filter((item) => {
                if (item.businessNo == this.esignParams.businessNo) {
                    this.curBusiness = item;
                }
                return item.businessNo !== this.esignParams.businessNo;
            });
        },
        clickecancle() {
            uni.navigateBack({
                delta: 1,
            });
        }
    }
}

</script>
<style lang="scss" scoped>
.empty-data-view {
    margin-top: 50px;
}

.merge-signatures-title {
    height: 20px;
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    margin: 8px 0;
    display: flex;
    align-items: center;

    .line {
        display: block;
        width: 2px;
        height: 80%;
        background-color: #e60000;
        margin-right: 5px;
    }
}

.bottom-view {
    position: fixed;
    display: flex;
    left: 0px;
    right: 0px;
    bottom: 0px;
    height: 60px;
    justify-content: flex-end;
    flex-direction: row;
    align-items: center;
    background: #ffffff;
    z-index: 100;
}

.bottom-left-view {
    display: flex;
    flex: 1;
    height: 40px;
    border-radius: 3px;
    background: #dcdfe6;
    font-size: $uni-font-size-lg;
    color: $uni-text-color-inverse;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 10px;
    margin-left: 10px;
}

.bottom-right-view {
    display: flex;
    flex: 1;
    height: 40px;
    border-radius: 3px;
    background: $uni-color-primary;
    font-size: $uni-font-size-lg;
    color: #ffffff;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 10px;
}

.warning {
    background-color: #f08200;
}

.merge-signatures-item-date {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #8C8C8C;
}

.merge-signatures-item-tag {
    padding: 0 15rpx;
    background: rgba(230, 0, 0, 0.2);
    border-radius: 6rpx;
    border: 1rpx solid #E60000;
    margin-left: 26rpx;
    color: #E60000;
}

.merge-signatures-item-buiness {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 32rpx;
    color: #222222;
}

.merge-signatures-item-title {
    display: flex;
    margin-bottom: 10rpx;
}


.merge-signatures-item {
    padding: 25rpx 28rpx;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
}

.merge-signatures-list {
    margin-top: 24rpx;
}

.merge-signatures-wrapper {
    width: 750rpx;
    background: #F5F4F9;
}

.top-tip {
    height: 115px;
    background: #FFFFFF;
    margin-top: 20rpx;
    padding: 30rpx 40rpx;
    padding-bottom: 48rpx;
    text-align: center;
}

.tip-icon {
    width: 77rpx;
    height: 77rpx;
    background: #FE931F;
    border-radius: 50%;
    color: #fff;
    font-size: 58rpx;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 14rpx;
}

.tip-text {
    text-align: left;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 28rpx;
    color: #333333;
    text-align: justify;
    font-style: normal;
    line-height: 52rpx;
}
</style>