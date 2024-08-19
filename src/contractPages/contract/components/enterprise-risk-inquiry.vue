<template>
    <view class="container">
        <view class="card">
            <view class="top">
                <view class="name">
                    <text class="iconfont" :class="[`client-icon-1`, `iconqiye2`]"></text>
                    <text class="text-lg text-bold ml5">{{ enterpriseName }}</text>
                </view>
                <!-- <view class="user-info">
                    <text>{{ contactName || '-' }} | {{ phoneNum || '-' }}</text>
                </view> -->
            </view>
            <view class="bottom">
                <view class="bottom-item">
                    <text class="bottom-item-col">失信被执行人：<text class="num">{{ riskInfo.executionsSize || 0
                            }}</text></text>
                    <text class="bottom-item-col">被执行人：<text class="num">{{ riskInfo.executedPersonsSize || 0
                            }}</text></text>
                </view>
                <view class="bottom-item">
                    <text class="bottom-item-col">开庭公告：<text class="num">{{ riskInfo.courtNoticeSize || 0
                            }}</text></text>
                    <text class="bottom-item-col">裁判文书：{{ riskInfo.lawsuitsSize || 0 }}</text>
                </view>
            </view>

        </view>
        <!-- 法人变更情况 -->
        <view>
            <view class="title"><span class="line"></span>法人变更情况</view>
            <view class="tabel-wrapper">
                <uni-table emptyText="" v-if="legalPerson.length > 0">
                    <uni-tr>
                        <uni-th width="150" align="left">变更日期</uni-th>
                        <uni-th width="34%" align="left">变更前</uni-th>
                        <uni-th width="34%" align="left">变更后</uni-th>
                    </uni-tr>
                    <!-- 表格数据行 -->
                    <template>
                        <uni-tr v-for="(item, index) in legalPerson" :key="index">
                            <uni-td>{{ item.changeDate || '-' }}</uni-td>
                            <uni-td>{{ item.beforeContent || '-' }}</uni-td>
                            <uni-td>{{ item.afterContent || '-' }}</uni-td>
                        </uni-tr>
                    </template>
                </uni-table>
                <template v-else>
                    <view class="no-data"><empty-data empty-text="当前暂无变更"></empty-data></view>
                </template>
            </view>
        </view>
        <view>
            <view class="title"><span class="line"></span>股东变更情况</view>
            <view class="tabel-wrapper">
                <uni-table emptyText="当前暂无变更" v-if="storeHolder.length > 0">
                    <uni-tr>
                        <uni-th width="100" align="left">变更日期</uni-th>
                        <uni-th width="105" align="left">变更前</uni-th>
                        <uni-th width="35%" align="left">变更后</uni-th>
                    </uni-tr>
                    <template>
                        <uni-tr v-for="(item, index) in storeHolder" :key="index">
                            <uni-td>{{ item.changeDate || '-' }}</uni-td>
                            <uni-td>{{ item.beforeContent || '-' }}</uni-td>
                            <uni-td>{{ item.afterContent || '-' }}</uni-td>
                        </uni-tr>
                    </template>
                </uni-table>
                <template v-else>
                    <view class="no-data"><empty-data empty-text="当前暂无变更"></empty-data></view>
                </template>
            </view>
        </view>
        <view class="detail">
            <view class="title"><span class="line"></span>风险详情</view>
            <view class="card mt0 pd24">
                <template v-if="riskDetailList.length > 0">
                    <view class="detail-item" v-for="(item, index) in riskDetailList" :key="index">
                        <view class="detail-item-row">
                            <view class="detail-item-tag">{{ getRiskType(item.riskType) }}</view>
                            <view class="detail-item-date">{{ item.date || '-' }}</view>
                        </view>
                        <view class="detail-item-row detail-text">
                            详情：{{ item.riskType == 2 ? '被执行金额：' : '' }}{{ item.details || '-' }}{{ item.riskType == 2 ?
                        '元' : '' }}
                        </view>
                    </view>
                    <view><uni-load-more iconType="auto" :status="morestatus" /></view>
                </template>
                <template v-else>
                    <view class="no-data"><empty-data empty-text="暂无数据"></empty-data></view>
                </template>
            </view>
        </view>
        <view style="
          height: 50px;
          width: 100%;
          padding-bottom: calc(env(safe-area-inset-bottom) );
        "></view>
    </view>
</template>
<script>
import EmptyData from "@/components/common/sany/empty-data.vue";
import uniLoadMore from '@/components/common/uni-load-more/uni-load-more.vue';

export default {
    components: {
        EmptyData,
        uniLoadMore
    },
    data() {
        return {
            enterpriseName: '',
            curPage: 1,
            pageSize: 10,
            status: 'more',
            riskInfo: {},
            phoneNum: '',
            contactName: '',
            legalPerson: [],//法人变更
            storeHolder: [],//股东变更
            riskDetailList: [],
            morestatus: 'loading',

        }
    },
    onLoad(option) {
        this.enterpriseName = option.name || '';
        this.contactName = option.contactName || '';
        this.phoneNum = option.phoneNum || ''
        if (this.enterpriseName) {
            this.init()
        }
    },
    onReachBottom() {
        if (this.morestatus == 'noMore') {
            return;
        }
        this.curPage += 1;
        this.morestatus = 'loading';
        this.init();
    },
    methods: {
        getRiskType(type) {
            let typeInfo = {
                1: '失信被执行人',
                2: '被执行人',
                3: '开庭公告',
                4: '裁判文书'
            }
            return typeInfo[type]
        },
        async init() {
            this.legalPerson = [];
            this.storeHolder = [];
            // 根据企业名称查询风险数据
            let param = {
                keyword: this.enterpriseName,
                // keyword: '乐视云计算有限公司',
                curPage: this.curPage,
                pageSize: this.pageSize
            }
            let res = await await this.$network.enterpriseRiskInquiry(param);
            this.riskInfo = res;
            this.legalPerson = res.legalPerson || [];
            this.storeHolder = res.storeHolder || [];
            this.riskDetailList = res.page && res.page.records ? [...this.riskDetailList, ...res.page.records] : this.riskDetailList || [];
            let totalPages = res.page && res.page.pages || 0;
            if (this.curPage < totalPages) {
                this.morestatus = 'more';
            } else {
                this.morestatus = 'noMore';
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.container {
    width: 750rpx;
    background: #F5F4F9;
    margin-top: 24rpx;

    .detail {
        .detail-item {
            @include hairline-bottom();
            padding: 24rpx 0;
            padding-bottom: 5px;

            .detail-item-row {
                display: flex;
                margin-bottom: 15rpx;
                align-items: center;

                .detail-item-tag {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0 12rpx;
                    height: 40rpx;
                    background: rgba(240, 130, 0, 0.2);
                    border-radius: 3rpx;
                    border: 1rpx solid #F08200;
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #F08200;
                }

                .detail-item-date {
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #222222;
                    margin-left: 28rpx;
                }
            }

        }
    }

    .card {
        background: $uni-bg-color;
        padding: 24rpx;
        margin-top: 24rpx;
        padding-bottom: 15rpx;
        font-size: 26rpx;

        .top {
            @include hairline-bottom();
            padding-bottom: 16rpx;

            .name {
                font-size: 32rpx;

                .client-icon-1 {
                    margin-right: 5rpx;
                    font-size: 35rpx;
                    color: #1278FF;
                }
            }

            .user-info {
                margin-top: 11rpx;
                margin-bottom: 5rpx;
                font-weight: 400;
                font-size: 26rpx;
                color: #888888;
            }
        }

        .bottom {
            margin-top: 20rpx;
            font-weight: 400;
            font-size: 26rpx;
            color: #8C8C8C;

            .bottom-item {
                display: flex;
                margin-bottom: 16rpx;

                .bottom-item-col {
                    flex: 1;

                    .num {
                        font-weight: 400;
                        font-size: 26rpx;
                        color: #222222;
                    }
                }
            }
        }

    }
}

.tabel-wrapper {
    padding: 30rpx 10rpx;
    background-color: #fff;
}

::v-deep .uni-table {
    min-width: 0 !important;
}

.title {
    height: 88rpx;
    line-height: 88rpx;
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    display: flex;
    align-items: center;

    .line {
        display: block;
        width: 2px;
        height: 40%;
        background-color: #e60000;
        margin-right: 10px;
    }
}

.ml5 {
    margin-left: 5px;
}

::v-deep .uni-table-scroll {
    overflow-x: hidden !important;
    //    white-space: nowrap;
    //    text-overflow: ellipsis;

}

.mt0 {
    margin-top: 0 !important;
}

.pd24 {
    padding: 24rpx;
}

.detail-text {
    line-height: 40rpx;
}

</style>
<style scoped>
  ::v-deep .uni-table .uni-table-tr .uni-table-th {
    padding:3px 0  6px 8px !important;
   }
   </style>