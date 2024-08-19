import WaterMark from '../base.js'
import gxf from '@/common/common-method/common-gxf-method'
import m from '@/common/common-method/common-method'

export default class DefaultWaterMark extends WaterMark {

  constructor() {
    super('locationTime', {
      nickname: {
        label: '设置姓名',
        type: 'input',
        default: '',
        placeHolder: '输入姓名',
      },
      // _logo:{
      //   label:'Logo',
      //   type:'image',
      //   default:[],
      //   placeHolder:'请上传Logo',
      // },
    }, '默认', '打卡')
  }

  async render(data, viewPortWidth, viewPortHeight) {
    let { address } = await gxf.getLocationWithAddr();
    let dateStr = m.dateFormat(new Date(), 'yyyy-MM-dd HH:mm')
    return {
      css: {
        // 根节点若无尺寸，自动获取父级节点
        width: this.vpx2px(750, viewPortWidth) + 'px',
        height: this.vpx2px(750, viewPortHeight) + 'px',
      },
      views: [
        {
          type: "view",
          css: {
            padding: this.vpx2px(22, viewPortWidth) + 'px',
            fontSize: this.vpx2px(24, viewPortWidth) + 'px',
            color: '#ffffff',
            position: 'absolute',
            bottom: '0',
            left: '0',
          },
          views: [
            {
              type: 'view',
              views: [
                {
                  type: 'text',
                  text: '\ue62b',
                  css: {
                    fontSize: this.vpx2px(28, viewPortWidth) + 'px',
                    fontFamily: 'iconfont',
                    textShadow: '1px 1px 2px #000'
                  }
                },
                {
                  type: 'text',
                  text: dateStr,
                  css: {
                    marginLeft: this.vpx2px(4, viewPortWidth) + 'px',
                    textShadow: '1px 1px 2px #000'
                  }
                },
              ],
              css: {
                lineHeight: this.vpx2px(28, viewPortWidth) + 'px',
              }
            },
            ...(address ? [
              {
                type: 'view',
                views: [
                  {
                    type: 'text',
                    text: '\ue61a',
                    css: {
                      fontSize: this.vpx2px(28, viewPortWidth) + 'px',
                      fontFamily: 'iconfont',
                      textShadow: '1px 1px 2px #000'
                    }
                  },
                  {
                    type: 'text',
                    text: address,
                    css: {
                      marginLeft: this.vpx2px(4, viewPortWidth) + 'px',
                      textShadow: '1px 1px 2px #000'
                    }
                  }
                ],
                css: {
                  marginTop: this.vpx2px(20, viewPortWidth) + 'px',
                  lineHeight: this.vpx2px(28, viewPortWidth) + 'px',
                }
              }
            ] : []),
            ...(data.remark ? [
              {
                type: 'view',
                views: [
                  {
                    type: 'text',
                    text: '\ue620',
                    css: {
                      fontSize: this.vpx2px(28, viewPortWidth) + 'px',
                      fontFamily: 'iconfont',
                      textShadow: '1px 1px 2px #000'
                    }
                  },
                  {
                    type: 'text',
                    text: data.remark,
                    css: {
                      marginLeft: this.vpx2px(4, viewPortWidth) + 'px',
                      textShadow: '1px 1px 2px #000'
                    }
                  }
                ],
                css: {
                  marginTop: this.vpx2px(20, viewPortWidth) + 'px',
                  lineHeight: this.vpx2px(28, viewPortWidth) + 'px',
                }
              }
            ] : [])
          ]
        }
      ]
    }
  }
}