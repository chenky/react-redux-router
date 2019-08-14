/* eslint-disable no-console */
const path = require('path')
// const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const os = require("os")
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const resolve = (relatedPath) => path.resolve(__dirname, relatedPath)
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const createHappyPlugin = (id, loaders) => new HappyPack({
    id: id,
    loaders: loaders,
    threadPool: happyThreadPool,
    verbose: process.env.HAPPY_VERBOSE === '1' // make happy more verbose with HAPPY_VERBOSE=1
})

const addDLLPugin = [new AddAssetHtmlPlugin({
  filepath: resolve("./assets/dll/*.js")
})]

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.json'],
    modules: [ // 指定以下目录寻找第三方模块，避免webpack往父级目录递归搜索
        resolve('src'),
        resolve('node_modules')
    ],
    // mainFields: ['main'], // 只采用main字段作为入口文件描述字段，减少搜索步骤
    alias: {
        // vue$: "vue/dist/vue.common",
        "@": resolve("src") // 缓存src目录为@符号，避免重复寻址
    }
  },
  entry: [
    path.resolve('src/index.js'),
  ],
  output: {
    filename: '[name].[contenthash:8].bundle.js',
    chunkFilename: "[name].[chunkhash:8].chuck.js",
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  optimization: {
    minimizer: [
      new ParallelUglifyPlugin({ // 多进程压缩
          cacheDir: '.cache/',
          uglifyJS: {
              output: {
                  comments: false,
                  beautify: false
              },
              compress: {
                  // warnings: false,
                  drop_console: true,
                  collapse_vars: true,
                  reduce_vars: true
              }
          }
      }),
    ],
    // runtimeChunk: {
    //   name: "manifest"
    // },
    splitChunks: {
      chunks: "all", // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
      // minSize: 0, // 最小尺寸，30000
      // minChunks: 1, // 最小 chunk ，默认1
      // maxAsyncRequests: 5, // 最大异步请求数， 默认5
      // maxInitialRequests : 3, // 最大初始化请求书，默认3
      // automaticNameDelimiter: '~',// 打包分隔符
      // name: function(){}, // 打包后的名称，此选项可接收 function
      cacheGroups:{ // 这里开始设置缓存的 chunks
          // priority: 0, // 缓存组优先级
          vendor: { // key 为entry中定义的 入口名称
              chunks: "initial", // 必须三选一： "initial" | "all" | "async"(默认就是async) 
              // test: /react|lodash/, // 正则规则验证，如果符合就提取 chunk
              name: "vendor", // 要缓存的 分隔出来的 chunk 名称 
              // minSize: 0,
              // minChunks: 1,
              // enforce: true,
              // maxAsyncRequests: 5, // 最大异步请求数， 默认1
              // maxInitialRequests : 3, // 最大初始化请求书，默认1
              // reuseExistingChunk: true // 可设置是否重用该chunk
          }
      }
    }
  },
  module: {
    rules: [
      // {
      //   test: /\.jsx?/,
      //   // Don't use .babelrc in `yarn link`-ed dependency's directory and use in current direction instead
      //   loader: 'babel-loader?babelrc=false&extends=' + path.resolve(__dirname, '.babelrc')
      // },
      {
        test: /\.jsx?/,
        loader: "happypack/loader?id=happy-babel", // 后面会介绍
        include: [ // 表示只解析以下目录，减少loader处理范围
          resolve("src"),
        ],
        exclude: resolve("node_modules"), // 排除node_modules
        // use: [{
        //     loader: 'babel-loader', 
        //     // include: [ // 表示只解析以下目录，减少loader处理范围
        //     //   resolve("src"),
        //     // ],
        //     // exclude: resolve("node_modules"), // 排除node_modules
        //     options: {//如果有这个设置则不用再添加.babelrc文件进行配置
        //         "babelrc": false,// 不采用.babelrc的配置
        //         "extends": path.resolve(__dirname, '.babelrc'),
        //         "plugins": [
        //             "dynamic-import-webpack"
        //         ]
        //     }
        // }]
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
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      filename: 'index.html',
      // chunks: [],
      // inject: true
    }),
    createHappyPlugin('happy-babel', [{
      loader: 'babel-loader',
      options: {
          babelrc: false,
          "extends": path.resolve(__dirname, '.babelrc'),
          "plugins": [
              "dynamic-import-webpack"
          ],
          cacheDirectory: true // 启用缓存
      }
    }]),
    new webpack.DllReferencePlugin({
      manifest: require("./react.dll.manifest.json")
    }),
    ...addDLLPugin
    // createHappyPlugin('happy-css', ['css-loader', 'vue-style-loader']),
    // new HappyPack({
    //     loaders: [{
    //         path: 'vue-loader',
    //         query: {
    //             loaders: {
    //                 scss: 'vue-style-loader!css-loader!postcss-loader!sass-loader?indentedSyntax'
    //             }
    //         }
    //     }]
    // })
  ],
  resolveLoader: {
    modules: [
      'node_modules',
    ],
  },
}
