<template>
    <view class="payment-total">
        <!-- 当期结算转租成本模块 -->
        <view class="settlement-section">
            <view class="settlement-title">当期结算转租成本：￥{{ moneyUtil.dealNumber(contractTotal) || 0 }}</view>
            <view class="settlement-info">
                <view class="settlement-item">租金:￥{{ moneyUtil.dealNumber(receivableHireTotal) || 0 }}</view>
                <view class="settlement-item">运费:￥{{ moneyUtil.dealNumber(receivableCarriageTotal) || 0 }}</view>
                <view class="settlement-item">其他:￥{{ moneyUtil.dealNumber(receivableLaborCostTotal) || 0 }}</view>
            </view>
        </view>

        <!-- 已付金额模块 -->
        <view class="paid-amount-section">
            <view class="paid-amount-header">
                <label class="amount-label">已付金额：</label>
                <input type="digit" :class="{ 'focused': isFocused }" @focus="handleFocus" @blur="(e) => { handleBlur(); valueChange(e, 'paidTotal') }" v-model="paymentTotal.paidTotal"
                    class="amount-input" :placeholder="isPreview ? '-' : '请输入已付金额'" :disabled="isPreview" />
            </view>
            <view class="amount-notes">
                <label class="notes-label">备注：</label>
                <input type="text" @blur="(e) => valueChange(e, 'paidRemark')" v-model="paymentTotal.paidRemark" class="notes-input" :placeholder="isPreview ? '-' : '请输入备注内容'"
                    :disabled="isPreview" />
            </view>
        </view>

        <!-- 履约应付模块 -->
        <view class="payable-section">
            <view class="payable-left">履约应付：￥{{ moneyUtil.dealNumber(paymentTotal.settleInfoDto.payableCurrent.total) || 0 }}</view>
            <view class="payable-right">
                <view class="payable-item">租金:￥{{ moneyUtil.dealNumber(paymentTotal.settleInfoDto.payableCurrent.price) || 0 }}</view>
                <view class="payable-item">运费:￥{{ moneyUtil.dealNumber(paymentTotal.settleInfoDto.payableCurrent.freight) || 0 }}</view>
            </view>
        </view>
    </view>
</template>
  
<script>
export default {
    name: 'PaymentTotal',
    props: {
        externalPaymentTotal: {
            type: Object,
            default: () => ({}),
        },
        businessNo: {
            type: String,
        },
        isPreview: {
            type: Boolean,
            default: false,
        }
    },
    watch: {
        externalPaymentTotal: {
            handler(newVal) {
                this.paymentTotal = { ...newVal }; // 当外部 props 改变时，更新内部数据
            },
            deep: true, // 深度监听，以便于监听对象内部属性的变化
            immediate: true, // 立即触发一次handler，确保初始值也被处理
        },
    },
    data() {
        return {
            paymentTotal: {}, // 内部用于处理的数据
            isFocused: false,
        };
    },
    computed: {
        /* 当期结算转租成本总计 */
        contractTotal() {
            let _this = this.paymentTotal.settleInfoDto;
            if (_this) {
                if (_this.subletPayableList && _this.payable) {
                    let total = _this.subletPayableList.reduce((x, y) => x + Number(y.payableTotal), 0);
                    if (this.isEdit) {
                        _this.payable.total = total;
                    }
                    console.log('---------------------total', total)
                }
                return _this.payable.total || 0;
            } else {
                return 0
            }
        },
        /* 本期应收租金 */
        receivableHireTotal() {
            let _this = this.paymentTotal.settleInfoDto;
            if (_this && _this.subletPayableList && _this.payable) {
                let total = _this.subletPayableList.reduce((x, y) => {
                    let list = y.machinePayableList.filter((o) => o.checked);
                    let h = list.reduce((z, w) => z + (Number(w.hireTotal) + Number(w.pauseHireTotal)), 0);
                    return x + h;
                }, 0);
                console.log('---------------------total', total)
                if (this.isEdit) _this.payable.price = total;
            }
            return (_this && _this.payable && _this.payable.price) ? _this.payable.price : 0;
        },
        /* 本期运费 */
        receivableCarriageTotal() {
            let _this = this.paymentTotal.settleInfoDto;
            if (_this) {
                if (_this.subletPayableList && _this.payable) {
                    let total = _this.subletPayableList.reduce((x, y) => {
                        let list = y.machinePayableList.filter((o) => o.checked);
                        let h = list.reduce((z, w) => z + Number(w.freight), 0);
                        return x + h;
                    }, 0);
                    if (this.isEdit) _this.payable.freight = total;
                }
                return (_this && _this.payable && _this.payable.freight) ? _this.payable.freight : 0;
            } else {
                return 0
            }
        },
        /* 本期其他费用 */
        receivableLaborCostTotal() {
            let _this = this.paymentTotal.settleInfoDto;
            if (_this) {
                if (_this.subletPayableList && _this.payable) {
                    let total = _this.subletPayableList.reduce((x, y) => x + (Number(y.laborCost) + Number(y.other)), 0);
                    if (this.isEdit) _this.payable.other = total;
                }
                return (_this && _this.payable && _this.payable.other) ? _this.payable.other : 0;
            } else {
                return 0
            }
        },
    },

    methods: {
        handleFocus() {
            this.isFocused = true;
        },
        handleBlur() {
            this.isFocused = false;
        },
        valueChange(e, changedProperty) {
            console.log(`${changedProperty}Change`, e.detail.value);
            let param = {}
            param[changedProperty] = e.detail.value
            // 根据 changedProperty 更新相应的属性
            this.$emit('update-settleInfo', param);
        },
        // 事件处理器和方法
    },
};
</script>
  
<style lang="scss" scoped>
.payment-total {
    background-color: $uni-bg-color;

    .settlement-section {
        padding: 24rpx;
        line-height: 56rpx;
        border-bottom: 1rpx solid #E6E6E6;

        .settlement-title {
            font-size: 32rpx;
            font-weight: bolder;
        }


        .settlement-info {
            display: flex;
            justify-content: space-between;

            .settlement-item {
                width: 33%;
                font-size: 28rpx;
                color: #8C8C8C;
            }
        }
    }

    .paid-amount-section {
        padding: 24rpx;
        line-height: 86rpx;
        border-bottom: 1rpx solid #E6E6E6;

        .paid-amount-header {
            display: flex;
            justify-content: space-between;

            .amount-label {
                font-size: 32rpx;
                font-weight: bolder;
            }

            .amount-input {
                font-size: 32rpx;
                border: 1rpx solid #E6E6E6;
                height: 86rpx;
                line-height: 86rpx;
                border-radius: 10rpx;
                padding: 5rpx 10rpx;
                box-sizing: border-box;
                text-align: right;

                &.focused {
                    border-color: #F08200
                }
            }
        }


        .amount-notes {
            font-size: 32rpx;
            color: #8C8C8C;
            display: flex;
            justify-content: space-between;

            .notes-label {
                font-size: 32rpx;
            }

            .notes-input {
                font-size: 32rpx;
                border-radius: 10rpx;
                height: 86rpx;
                line-height: 86rpx;
                padding: 6rpx 11rpx;
                box-sizing: border-box;
                text-align: right;
            }
        }
    }

    .payable-section {
        padding: 24rpx;
        line-height: 56rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .payable-left {
            font-size: 32rpx;
            font-weight: bolder;
            flex: 1;

        }

        .payable-right {
            flex: 1;
            display: flex;
            justify-content: flex-start;
            color: #8C8C8C;

            .payable-item {
                width: 33%;
                font-size: 28rpx;
            }

        }


    }
}
</style>
  