const _systemInfo = uni.getSystemInfoSync();

export default class WaterMark{
  
  type='';
  
  title='未命名';
  
  group='未命名';
  /**
   * 表单项
   */
  form = {};
  
  windowWidth = _systemInfo.windowWidth;
  
  windowHeight = _systemInfo.windowHeight;
  
  constructor(type,form,title,group){
    console.log(type,form);
    this.type=type;
    this.form=form;
    this.title=title;
    this.group=group;
  }
  /**
   * @param {Object} orientation 横屏/竖屏
   * @param {Object} data 表单值
   */
  async render(data,viewPortWidth,viewPortHeight) {
    throw new Error('未实现')
  }
  /**
   * vpx转为px
   * @param {Object} vpx 750表示整个视窗大小
   * @param {Object} poster 
   */
  vpx2px(vpx,viewPortWidth,viewPortHeight,minpx){
    const px = (viewPortWidth / 750) * vpx;
    if(minpx && px<minpx){
      return minpx;
    }
    return px;
  }
}