const path = require('path')
const webpack = require('webpack')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const resolve = (relatedPath) => path.resolve(__dirname, relatedPath)

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    path.resolve('src/index.js'),
  ],
  // entry: {
  //   vendor: ['react', 'react-dom', 'redux', 'react-redux', 'react-router', 'react-router-dom', 'babel-polyfill'],
  //   main: ['react-hot-loader/patch','webpack-hot-middleware/client',path.resolve('src/index.js')]
  // },
  output: {
    filename: '[name].bundle.js',
    // chunkFilename: "[name].[hash:5].js",
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  // optimization: {
  //   runtimeChunk: {
  //     name: "manifest"
  //   },
  //   splitChunks: {
  //     chunks: "all", // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
  //     minSize: 0, // 最小尺寸，30000
  //     minChunks: 1, // 最小 chunk ，默认1
  //     maxAsyncRequests: 5, // 最大异步请求数， 默认5
  //     maxInitialRequests : 3, // 最大初始化请求书，默认3
  //     automaticNameDelimiter: '~',// 打包分隔符
  //     name: function(){}, // 打包后的名称，此选项可接收 function
  //     cacheGroups:{ // 这里开始设置缓存的 chunks
  //         // priority: 0, // 缓存组优先级
  //         vendor: { // key 为entry中定义的 入口名称
  //             chunks: "initial", // 必须三选一： "initial" | "all" | "async"(默认就是async) 
  //             // test: /react|lodash/, // 正则规则验证，如果符合就提取 chunk
  //             name: "vendor", // 要缓存的 分隔出来的 chunk 名称 
  //             minSize: 0,
  //             minChunks: 1,
  //             enforce: true,
  //             maxAsyncRequests: 5, // 最大异步请求数， 默认1
  //             maxInitialRequests : 3, // 最大初始化请求书，默认1
  //             reuseExistingChunk: true // 可设置是否重用该chunk
  //         }
  //     }
  //   }
  // },
  module: {
    rules: [
      // {
      //   test: /\.jsx?/,
      //   // Don't use .babelrc in `yarn link`-ed dependency's directory and use in current direction instead
      //   loader: 'babel-loader?babelrc=false&extends=' + path.resolve(__dirname, '.babelrc')
      // },
      {
        test: /\.jsx?/,
        use: [{
            loader: 'babel-loader', 
            options: {//如果有这个设置则不用再添加.babelrc文件进行配置
                "babelrc": false,// 不采用.babelrc的配置
                "extends": path.resolve(__dirname, '.babelrc'),
                "plugins": [
                    "dynamic-import-webpack"
                ]
            }
        }]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        exclude: [resolve('../node_modules')],
        use: [
          'style-loader', {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              // less modules
              modules: true,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          }, 'less-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'images/[hash:8].[name].[ext]'
            }
          }]
      }
    ],
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, 'index.html'),
    //   filename: 'index.html',
    //   chunks: [],
    //   inject: true
    // }),
    // new HtmlWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolveLoader: {
    modules: [
      'node_modules',
    ],
  },
}
