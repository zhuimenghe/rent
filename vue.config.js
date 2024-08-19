const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  transpileDependencies: ['@dcloudio/uni-ui'],
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: process.env.NODE_ENV === 'production'
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@c', resolve('src/components'))
      .set('@static', resolve('src/static'))
  },
  configureWebpack: config => {
    return {
      module: {
        rules: [
          {
            test: /manifest.json$/,
            loader: 'json5-loader',
            type: 'javascript/auto',
          }
        ]
      },
      plugins: [
        // new BundleAnalyzerPlugin()
        // new CompressionWebpackPlugin({
        //   filename: '[path].gz[query]',
        //   algorithm: 'gzip',
        //   test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),//匹配文件名
        //   threshold: 10240,//对10K以上的数据进行压缩
        //   minRatio: 0.8,
        //   deleteOriginalAssets:false,//是否删除源文件
        // })
      ]
    }
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      scss: {
        // @/ 是 src/ 的别名
        prependData: `
          @import '~@/uni.scss';
          @import '~@/assets/scss/mixins/_index.scss';
        `
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://rental-test.sany.com.cn',
        changeOrigin: true,
        secure: false,
        logLevel: "debug",
        // bypass: (req, res) => {
        //   // req.headers.host = 'rental-test.sany.com.cn'
        //   // delete req.headers.referer
        //   // delete req.headers['sec-fetch-site']
        //   // delete req.headers['sec-fetch-mode']
        //   // delete req.headers['sec-fetch-dest']
        //   // delete req.headers.origin
        //   let old = req.headers
        //   req.headers = {
        //     'content-type':old['content-type'],
        //     'cookie':old.cookie,
        //     'Accept-Encoding': 'gzip, deflate, br',
        //     host:'rental-test.sany.com.cn',
        //     accept:'*/*',
        //     'user-agent':old['user-agent'],
        //     origin:'https://rental-test.sany.com.cn'
        //   }
        //   console.log(req.headers);
        // },
        headers: {
          Connection: 'keep-alive'
        }
      }
    },
    host: "0.0.0.0",
    port: 2021, // 端口号
    https: false, // https:{type:Boolean}
    open: true // 配置自动启动浏览器
  },
}