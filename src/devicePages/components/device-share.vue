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
import * as urlConstant from '@/network/url-constant.js'
import {mapState} from 'vuex'
export default {
  // components:{LPainter},
  props: {
    d: Object
  },
  data() {
    return {
      loadPromise: null,
      shareUrl: ''
    }
  },
  watch: {
    d(d) {
      if (d) {
        this.loadPromise = this.$network.getData(
          `/machineapi/api/machine/monitor/MachineMonitorError?licenseId=${d.licenseId}`,
          'GET',
        )
      }
    }
  },
  computed: {
    ...mapState('user',{
      identifier:s=>s.lesseeInfo.identifier
    })
  },
  methods: {
    getBodyJson(res){
      if(!res.errType) return []
      let typeMap = {
        'lowBattery':'低电量',
        'close':'关机',
        'offline':'离线'
      }
      return [{
        views: [
          {
            type: "view",
            css:{marginBottom:'54rpx'},
            views: [
              {
                type: 'view',
                css: {
                  display: 'flex',
                  alignItems: 'center',
                  margin: "0rpx 0 22rpx 18rpx",
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
                    text: '设备异常',
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
                  padding:'18rpx 40rpx',
                  borderTop: "1rpx solid #e6e6e6",
                  borderBottom: "1rpx solid #e6e6e6",
                },
                views: [
                  //低电量 离线  关机
                  {
                    type:'view',
                    css:{color:'#8C8C8C',fontSize:'28rpx'},
                    views:[
                      {
                        type:'view',
                        css:{display:'flex',alignItems: 'center'},
                        views:[
                          ...(res.errType=='lowBattery'?[
                            {
                              css:{flex:'1',display:'flex',alignItems: 'center'},
                              type:'view',
                              views:[{
                                type:'text',
                                text:'当前电量：',
                              },{
                                type:'text',
                                text:res.batteryPower+'%',
                                css:{color:'#E60000'},
                              }]
                            }
                          ]:[]),
                          {
                            css:{flex:'1',display:'flex',alignItems: 'center'},
                            type:'view',
                            views:[{
                              type:'text',
                              text:typeMap[res.errType]+'天数：',
                            },{
                              type:'text',
                              text:res.days+'天',
                              css:{color:'#E60000'},
                            }]
                          }
                        ]
                      },
                      {
                        type:'view',
                        css:{display:'flex',alignItems: 'center',marginTop:'8rpx'},
                        views:[{
                          type:'text',
                          text:res.errType=='lowBattery' ? '定位时间：' : '最近关机日期：',
                        },{
                          type:'text',
                          text: res.date,
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
      }]
    },
    async share() {
      console.log(this.identifier);
      uni.showLoading();
      let res = await this.loadPromise

      let deviceIcons = {
				'3': '\ue643',
				'4': '\ue642',
				'2': '\ue63f',
				'1': '\ue642'
			}

      let options = {
        css: {
          // 根节点若无尺寸，自动获取父级节点
          width: '750rpx',
          backgroundColor: '#fff',
          color: '#333'
        },
        views: [
          //header
          {
            type:'view',
            css:{
              padding:'45rpx 18rpx 42rpx 18rpx',
              display:'flex',
              alignItems: 'center'
            },
            views:[{
              type:'view',
              css:{borderRadius:'10rpx',border:'1rpx solid #E6E6E6',display:'flex',alignItems: 'center',justifyContent: 'center',width:'76rpx',height:'76rpx'},
              views:[{
                type:'text',
                text:deviceIcons[this.d.machineTypeId] || '\ue642',
                css: { fontFamily: 'iconfont',fontSize:'60rpx',lineHeight:'1em',color:'#E60000' }
              }]
            },{
              type:'view',
              css:{flex:'1',marginLeft:'14rpx'},
              views:[{
                css:{display:'flex',alignItems: 'center'},
                type:'view',
                views:[{
                  type:'text',
                  text:res.printcode,
                  css:{fontWeight:'bold',fontSize:'32rpx'}
                },{
                  type:'view',
                  css:{marginLeft:'10rpx',borderRadius:'16rpx',backgroundColor:'rgba(230,0,0,0.14)',height:'32rpx',padding:'0 18rpx'},
                  views:[{
                    type:'text',
                    css:{fontSize:'24rpx',color:'#e60000',lineHeight:'32rpx'},
                    text:res.licenseId
                  }]
                }]
              },{
                type:'view',
                css:{marginTop:'7rpx',color:'#8C8C8C',fontSize:'24rpx'},
                views:[{
                  type:'text',
                  text:`${res.machineTypeDesc} | ${res.machineHeightDesc} | ${res.machineTypeName} | ${res.machineBrand}`
                }]
              }]
            }]
          },
          //异常
          ...this.getBodyJson(res),
          {
            type: 'view',
            css: { textAlign: 'center', color: '#FE931F', fontSize: '28rpx', marginTop: '0rpx' },
            views: [{
              type: 'text',
              text: '扫码查看设备详细数据'
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
            src: `${urlConstant.BASE_URL}machineapi/api/qrcode/createMachineQrcodeLogo?licenseId=${this.d.licenseId}&schema=${this.identifier}`,
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