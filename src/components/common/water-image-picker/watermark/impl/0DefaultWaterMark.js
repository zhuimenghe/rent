import WaterMark from '../base.js'

export default class DefaultWaterMark extends WaterMark{
  
  constructor(){
    super('default',{
      nickname:{
        label:'设置姓名',
        type:'input',
        default:'',
        placeHolder:'输入姓名',
      },
      // _logo:{
      //   label:'Logo',
      //   type:'image',
      //   default:[],
      //   placeHolder:'请上传Logo',
      // },
    },'默认','打卡')
  }
  
  async render(data,viewPortWidth,viewPortHeight) {
      const wxml = `
      <view class="container">
        <view class="row0">
          <text class="text textAlignCenter time">${data._Time||'12:00'}</text>
          <text class="text textAlignCenter name ">${data.nickname||'姓名'}</text>
        </view>
        <view class="row1">
          <view class="line">
            <view class="line2"></view>
          </view>
          <view class="column">
            <view class="row2">
              <text class="text date">${data._Date||'2023.01.01'}</text>
              <text class="text week">${data._Week||'星期五'}</text>
              <text class="text weather">${data._Weather||'天气晴'}</text>
            </view>
            <text class="text location">${data._Location||'地址xxxxxxxxxxxxxx'}</text>
          </view>
        </view>
      </view>
      `
      
      const style = {
        container: {
          width: this.vpx2px(750,viewPortWidth,viewPortHeight),
          flexDirection: 'column',
          background: 'rgba(255,255,255,0)',
          fontSize:this.vpx2px(32,viewPortWidth,viewPortHeight),
          color:'#fff',
          marginBottom:10,
        },
        row0: {
          width: this.vpx2px(750,viewPortWidth,viewPortHeight),
          height:this.vpx2px(100,viewPortWidth,viewPortHeight),
          display:'flex',
          flexDirection:'row',
        },
        row1: {
          width: this.vpx2px(750,viewPortWidth,viewPortHeight),
          height:this.vpx2px(120,viewPortWidth,viewPortHeight),
          display:'flex',
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
        },
        line:{
          width: this.vpx2px(60,viewPortWidth,viewPortHeight),
          height: this.vpx2px(120,viewPortWidth,viewPortHeight),
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
        },
        column:{
          display:'flex',
          flexDirection:'column',
          flex:1,
        },
        row2:{
          width: this.vpx2px(540,viewPortWidth,viewPortHeight),
          height:this.vpx2px(50,viewPortWidth,viewPortHeight),
          display:'flex',
          flexDirection:'row',
        },
        red:{
          backgroundColor:'red',
        },
        blue:{
          backgroundColor:'green',
        },
        text:{
          width: this.vpx2px(200,viewPortWidth,viewPortHeight),
          height:this.vpx2px(100,viewPortWidth,viewPortHeight),
          fontSize:this.vpx2px(28,viewPortWidth,viewPortHeight),
        },
        textAlignCenter:{
          textAlign:'center',
          verticalAlign: 'middle',
        },
        time:{
          width: this.vpx2px(240,viewPortWidth,viewPortHeight),
          height:this.vpx2px(100,viewPortWidth,viewPortHeight),
          fontSize:this.vpx2px(74,viewPortWidth,viewPortHeight),
          fontWeight:'bold',
        },
        name:{
          width: this.vpx2px(400,viewPortWidth,viewPortHeight),
          height:this.vpx2px(100,viewPortWidth,viewPortHeight),
          fontSize:this.vpx2px(34,viewPortWidth,viewPortHeight),
          textAlign:'left',
        },
        line2:{
          width: this.vpx2px(8,viewPortWidth,viewPortHeight),
          height: this.vpx2px(100,viewPortWidth,viewPortHeight),
          backgroundColor:'#3b99f8',
          borderRadius:this.vpx2px(4,viewPortWidth,viewPortHeight),
        },
        date:{
          width: this.vpx2px(160,viewPortWidth,viewPortHeight),
          height: this.vpx2px(50,viewPortWidth,viewPortHeight),
        },
        week:{
          width: this.vpx2px(100,viewPortWidth,viewPortHeight),
          height: this.vpx2px(50,viewPortWidth,viewPortHeight),
        },
        weather:{
          width: this.vpx2px(100,viewPortWidth,viewPortHeight),
          height: this.vpx2px(50,viewPortWidth,viewPortHeight),
        },
        location:{
          width: this.vpx2px(650,viewPortWidth,viewPortHeight),
          height: this.vpx2px(50,viewPortWidth,viewPortHeight),
        },
      }
      
      return {
        wxml,
        style
      }
    }
  }