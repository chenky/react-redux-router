/* eslint-disable no-console */
const path = require('path')
// const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
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

// const files = fs.readdirSync(resolve("./assets/dll"))
// const addDLLPugin = files.map(file => {
//   if (/.*\.dll.js/.test(file)) {
//     console.log(file)    
//     return new AddAssetHtmlPlugin({
//       filepath: path.resolve(__dirname, './assets/dll', file)
//     })
//   }
// })

const addDLLPugin = [new AddAssetHtmlPlugin({
  filepath: resolve("./assets/dll/*.js")
})]

module.exports = {
  mode: 'development',
  // devtool: 'eval-source-map',
  // devtool: 'eval',
  // devtool: 'cheap-eval-source-map',
  devtool: 'cheap-module-eval-source-map',
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
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    path.resolve('src/index.js'),
  ],
  output: {
    filename: '[name].bundle.js',
    // chunkFilename: "[name].[hash:5].js",
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      filename: 'index.html',
      // chunks: [],
      // inject: true
    }),
    // new HtmlWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
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
