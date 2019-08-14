const webpack = require("webpack")
const path = require('path')
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const dllPath = path.resolve(__dirname, "./assets/dll") // dll文件存放的目录

module.exports = {
    entry: {
        // 把 vue 相关模块的放到一个单独的动态链接库
        // vue: ["babel-polyfill", "fastclick", "vue", "vue-router", "vuex", "axios", "element-ui"]
        // react相关模块放在一个单独的动态链接库中
        react: ['react', 'react-dom', 'redux', 'react-redux', 'react-router', 'react-router-dom']
    },
    output: {
        filename: "[name]-[contenthash:8].dll.js", // 生成vue.dll.js
        path: dllPath,
        library: "_dll_[name]"
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DllPlugin({
            name: "_dll_[name]",
            // manifest.json 描述动态链接库包含了哪些内容
            path: path.join(__dirname, "./", "[name].dll.manifest.json")
        }),
    ],
}