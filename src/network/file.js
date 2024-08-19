import * as savekey from '@/common/common-method/save-key'
import http from './interface';
import gxf from '@/common/common-method/common-gxf-method'

/*  下载文件 */
export const wxDownloadFile = async (url, method='get', data, filename = 'data') => {
  uni.showLoading({
    title: '正在下载中,请稍等...',
    mask: true,
  })
  if(url.startsWith('http')&&method.toLowerCase()=='get'&&!data){
    let headerDic = {
      'Content-Type': 'application/json',
      'Authorization': '',
    };
    let loginMes = uni.getStorageSync(savekey.LOGIN_MEG);
    if (loginMes) {
      let access_token = loginMes.token_type + " " + loginMes.access_token;
      headerDic.Authorization = access_token;
    } else {
      uni.hideLoading()
      return null
    }
    uni.downloadFile({
      url: url,
      header: url.includes('aliyuncs.com') ? {} : headerDic,
      success: (res) => {
        let filePath = res.tempFilePath;
        uni.openDocument({
          filePath: filePath,
          // fileType: 'pdf',
          showMenu: true,
          success: function (res) {
            uni.hideLoading()
          },
          fail: (error) => {
            console.error(error)
            uni.showToast({
              icon: "none",
              title: "打开失败"
            })
          }
        });
      },
      fail: (error) => {
        console.error(error)
        uni.showToast({
          icon: "none",
          title: "下载失败"
        })
      }
    });
  }else{
    let res = await http.request({ url, data, method, disableAbandonDictionary: true, responseType: 'arraybuffer' });
    let path = `${wx.env.USER_DATA_PATH}/${filename}`
    let fs = uni.getFileSystemManager()
    //先清空文件空间
    var dirPath = wx.env.USER_DATA_PATH
    let {files} = await gxf.promisify(fs.readdir)({dirPath});
    await Promise.allSettled(files.filter(f=>!f.includes('miniprogramLog')).map(f=>gxf.promisify(fs.unlink)({filePath:  dirPath + '/' +f})))
		fs.writeFile({
      filePath: path,
      data: res.data,
      encoding: 'binary',
      encoding: 'utf8',
      success(res) {
        uni.openDocument({
          filePath: path,
          showMenu: true
        })
      },
      async fail(res) {
        console.error(res);
        uni.showToast({
          icon: "none",
          title: "保存失败"+res.errno
        })
      },
      complete(res) {
        uni.hideLoading()
      }
    })
  }
}