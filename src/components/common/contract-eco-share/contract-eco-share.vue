<template lang="">
  <view>
    <p-l-painter ref="painter" hidden></p-l-painter>
    <uni-popup ref="pop" type="center" :mask-click="true">
      <image
        class="banner"
        show-menu-by-longpress
        :src="shareUrl"
        mode="widthFix"
      />
    </uni-popup>
  </view>
</template>
<script>
// import LPainter from './painter/l-painter/l-painter.vue'
export default {
  // components:{LPainter},
  props: {
    settleRevenue: [String, Number],
    settleArrears: [String, Number],
    paid: [String, Number],
    contract: Object
  },
  data() {
    return {
      loadPromise: null,
      shareUrl: ''
    }
  },
  watch: {
    contract(c) {
      if (c) {
        this.loadPromise = this.$network.getData(
          `/contractapi/api/contract/share/info?contractNo=${c.businessNo}&contractId=${c.id}`,
          'GET',
        )
      }
    }
  },
  computed: {

  },
  methods: {
    async share() {
      uni.showLoading();
      let res = await this.loadPromise

      let records = res.workInOutList.slice(0, 2).map(r => {
        return {
          type: 'view',
          css: {
            padding: '10rpx 0',
            borderBottom: '1rpx solid #e6e6e6',
            display: 'flex'
          },
          views: [{
            type: 'text', text: r.date ? r.date.split(' ')[0] : '--', css: { flex: '1', textAlign: 'center' },
          }, {
            type: 'text', text: (r.businessType == 'workIn' ? '进' : '退') + r.count, css: { flex: '1', textAlign: 'center' }
          }]
        }
      })
      if (records.length) {
        records.splice(0, 0, {
          type: 'view',
          css: {
            padding: '10rpx 0',
            borderBottom: '1rpx solid #e6e6e6',
            display: 'flex'
          },
          views: [{
            type: 'text', text: '日期', css: { color: '#8c8c8c', textAlign: 'center', flex: '1' },
          }, {
            type: 'text', text: '数量', css: { color: '#8c8c8c', textAlign: 'center', flex: '1' },
          }]
        })
      }
      let options = {
        css: {
          // 根节点若无尺寸，自动获取父级节点
          width: '750rpx',
          backgroundColor: '#fff',
          color: '#333'
        },
        views: [
          {
            css: {
              borderBottom: "1rpx solid #e6e6e6",
            },
            views: [
              {
                text: this.contract.contractDetailDto.projectName,
                type: "text",
                css: {
                  padding: "24rpx",
                  boxSizing: "border-box",
                  textAlign: "center",
                  lineClamp: 2,
                  lineHeight: "1.5em",
                  fontSize: "28rpx",
                  fontWeight: "bold",
                  width: "100%"
                },
              },
            ],
            type: "view"
          },
          {
            css: {
              padding: "12rpx",
            },
            views: [
              {
                type: "view",
                css: {
                  margin: "22rpx 0",
                },
                views: [
                  {
                    type: 'view',
                    css: {
                      display: 'flex',
                      alignItems: 'center'
                    },
                    views: [
                      {
                        type: 'view',
                        css: {
                          width: '8rpx',
                          height: '24rpx',
                          background: '#E60000'
                        }
                      },
                      {
                        type: 'text',
                        text: '结算概况',
                        css: {
                          fontWeight: 'bold',
                          fontSize: '30rpx',
                          marginLeft: '12rpx',
                          lineHeight: "1em",
                        }
                      }
                    ]
                  },
                  {
                    type: 'view',
                    css: {
                      display: 'flex',
                      marginTop: '20rpx',
                    },
                    views: [
                      {
                        type: 'view',
                        css: {
                          flex: '1',
                          display: 'flex',
                          alignItems: 'center'
                        },
                        views: [
                          {
                            type: 'view',
                            css: {
                              width: '64rpx',
                              height: '64rpx',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(18,120,255,0.15)',
                              marginRight: '6rpx'
                            },
                            views: [{
                              type: 'text',
                              text: '\ue7d4',
                              css: {
                                color: 'rgba(18,120,255,1)',
                                fontFamily: 'iconfont'
                              }
                            }]
                          },
                          {
                            type: 'view',
                            views: [{
                              type: 'view',
                              views: [{
                                type: 'text',
                                text: '结算金额',
                                css: { fontSize: '24rpx' }
                              }]
                            }, {
                              type: 'view',
                              css: { marginTop: '5rpx' },
                              views: [{
                                type: 'text',
                                text: Number(this.settleRevenue).toFixed(2) || "0.00",
                                css: { fontSize: '28rpx', fontWeight: 'bold' }
                              }]
                            }]
                          }
                        ]
                      },
                      {
                        type: 'view',
                        css: {
                          flex: '1',
                          display: 'flex',
                          alignItems: 'center'
                        },
                        views: [
                          {
                            type: 'view',
                            css: {
                              width: '64rpx',
                              height: '64rpx',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(230,0,0,0.15)',
                              marginRight: '6rpx'
                            },
                            views: [{
                              type: 'text',
                              text: '\ue7d4',
                              css: {
                                color: 'rgba(230,0,0,1)',
                                fontFamily: 'iconfont'
                              }
                            }]
                          },
                          {
                            type: 'view',
                            views: [{
                              type: 'view',
                              views: [{
                                type: 'text',
                                text: '结算欠款',
                                css: { fontSize: '24rpx' }
                              }]
                            }, {
                              type: 'view',
                              css: { marginTop: '5rpx' },
                              views: [{
                                type: 'text',
                                text: Number(this.settleArrears).toFixed(2) || "0.00",
                                css: { fontSize: '28rpx', fontWeight: 'bold' }
                              }]
                            }]
                          }
                        ]
                      },
                      {
                        type: 'view',
                        css: {
                          flex: '1',
                          display: 'flex',
                          alignItems: 'center'
                        },
                        views: [
                          {
                            type: 'view',
                            css: {
                              width: '64rpx',
                              height: '64rpx',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(254,147,31,0.15)',
                              marginRight: '6rpx'
                            },
                            views: [{
                              type: 'text',
                              text: '\ue7d4',
                              css: {
                                color: 'rgba(254,147,31,1)',
                                fontFamily: 'iconfont'
                              }
                            }]
                          },
                          {
                            type: 'view',
                            views: [{
                              type: 'view',
                              views: [{
                                type: 'text',
                                text: '已付',
                                css: { fontSize: '24rpx' }
                              }]
                            }, {
                              type: 'view',
                              css: { marginTop: '5rpx' },
                              views: [{
                                type: 'text',
                                text: Number(this.paid).toFixed(2) || "0.00",
                                css: { fontSize: '28rpx', fontWeight: 'bold' }
                              }]
                            }]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                type: "view",
                css: {
                  margin: "22rpx 0",
                },
                views: [
                  {
                    type: 'view',
                    css: {
                      display: 'flex',
                      alignItems: 'center'
                    },
                    views: [
                      {
                        type: 'view',
                        css: {
                          width: '8rpx',
                          height: '24rpx',
                          background: '#E60000'
                        }
                      },
                      {
                        type: 'text',
                        text: '设备概况',
                        css: {
                          fontWeight: 'bold',
                          fontSize: '30rpx',
                          marginLeft: '12rpx',
                          lineHeight: "1em",
                        }
                      }
                    ]
                  },
                  {
                    type: 'view',
                    css: {
                      display: 'flex',
                      marginTop: '20rpx',
                    },
                    views: [
                      {
                        type: 'view',
                        css: {
                          flex: '1',
                          display: 'flex',
                          alignItems: 'center'
                        },
                        views: [
                          {
                            type: 'view',
                            css: {
                              width: '64rpx',
                              height: '64rpx',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(106,95,255,0.15)',
                              marginRight: '6rpx'
                            },
                            views: [{
                              type: 'text',
                              text: '\ue647',
                              css: {
                                color: 'rgba(106,95,255,1)',
                                fontFamily: 'iconfont'
                              }
                            }]
                          },
                          {
                            type: 'view',
                            views: [{
                              type: 'view',
                              views: [{
                                type: 'text',
                                text: '当前进场',
                                css: { fontSize: '24rpx' }
                              }]
                            }, {
                              type: 'view',
                              css: { marginTop: '5rpx' },
                              views: [{
                                type: 'text',
                                text: res.workInMachineCount + '台',
                                css: { fontSize: '28rpx', fontWeight: 'bold' }
                              }]
                            }]
                          }
                        ]
                      },
                      {
                        type: 'view',
                        css: {
                          flex: '1',
                          display: 'flex',
                          alignItems: 'center'
                        },
                        views: [
                          {
                            type: 'view',
                            css: {
                              width: '64rpx',
                              height: '64rpx',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(254,147,31,0.15)',
                              marginRight: '6rpx'
                            },
                            views: [{
                              type: 'text',
                              text: '\ue639',
                              css: {
                                color: 'rgba(254,147,31,1)',
                                fontFamily: 'iconfont'
                              }
                            }]
                          },
                          {
                            type: 'view',
                            views: [{
                              type: 'view',
                              views: [{
                                type: 'text',
                                text: '在租',
                                css: { fontSize: '24rpx' }
                              }]
                            }, {
                              type: 'view',
                              css: { marginTop: '5rpx' },
                              views: [{
                                type: 'text',
                                text: res.rentCount + '台',
                                css: { fontSize: '28rpx', fontWeight: 'bold' }
                              }]
                            }]
                          }
                        ]
                      },
                      {
                        type: 'view',
                        css: {
                          flex: '1',
                          display: 'flex',
                          alignItems: 'center'
                        },
                        views: [
                          {
                            type: 'view',
                            css: {
                              width: '64rpx',
                              height: '64rpx',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(18,120,255,0.15)',
                              marginRight: '6rpx'
                            },
                            views: [{
                              type: 'text',
                              text: '\ue646',
                              css: {
                                color: 'rgba(18,120,255,1)',
                                fontFamily: 'iconfont'
                              }
                            }]
                          },
                          {
                            type: 'view',
                            views: [{
                              type: 'view',
                              views: [{
                                type: 'text',
                                text: '退场',
                                css: { fontSize: '24rpx' }
                              }]
                            }, {
                              type: 'view',
                              css: { marginTop: '5rpx' },
                              views: [{
                                type: 'text',
                                text: res.workOutMachineCount + '台',
                                css: { fontSize: '28rpx', fontWeight: 'bold' }
                              }]
                            }]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
            ],
            type: "view"
          },
          {
            type: 'view',
            css: {
              padding: '0 30rpx'
            },
            views: records
          },
          {
            type: 'view',
            css: { textAlign: 'center', color: '#FE931F', fontSize: '24rpx', marginTop: '17rpx' },
            views: [{
              type: 'text',
              text: '查看更多数据请登录租户端'
            }]
          },
          {
            type: 'view',
            css: { textAlign: 'center', color: '#FE931F', fontSize: '32rpx', marginTop: '0rpx' },
            views: [{
              type: 'text',
              text: '\ue6ed',
              css: { fontFamily: 'iconfont', lineHeight: '1em' }
            }]
          },
          {
            type: 'image',
            src: 'https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/ecomp-qrcode.jpg',
            css: {
              width: '258rpx',
              height: '258rpx',
              margin: '0 auto'
            }
          },
          {
            type: 'text',
            text: '长按保存图片或分享',
            css: { fontSize: '32rpx', width: '100%', margin: '11rpx 0 30rpx 0', textAlign: 'center' }
          }
        ]
      }
      await this.$refs.painter.render(options)
      let { tempFilePath } = await this.$refs.painter.canvasToTempFilePath()
      uni.hideLoading();
      this.shareUrl = tempFilePath
      this.$refs.pop.open()
    }
  }
}
</script>
<style lang="scss" scoped>
  .banner{
    width:668rpx;
    border-radius: 6rpx;
    height:auto;
    // margin-bottom:100px;
  }
</style>