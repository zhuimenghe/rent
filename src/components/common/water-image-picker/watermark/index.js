
/**该文件编译时自动生成,不要修改
 * 水印定义文件,编译时自动读取/components/gg-camera/watermark目录下所有的水印实现类，
 * 目的:不要定义在一个文件里建议分模块定义接口防止多人协同冲突
 */
const providers = {};
import WaterMark0 from './impl/0DefaultWaterMark.js'
import WaterMark1 from './impl/painterWaterMark.js'

const waterMark0 = new WaterMark0();
providers[waterMark0.type] = waterMark0;
const waterMark1 = new WaterMark1();
providers[waterMark1.type] = waterMark1;

console.log("水印定义", providers);

export default {
  getProvider: (type) => {
    const provider = providers[type];
    if (!provider) {
      throw new Error('no provide present!')
    }
    return provider
  },
  getAllProvider: () => {
    return JSON.parse(JSON.stringify(Object.values(providers)))
  }
}

