/* eslint-disable no-console */
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const express = require('express')
const config = require('./webpack.dev.config')

const app = express()
const compiler = webpack(config)

// console.log("server publicPath:"+config.output.publicPath)
// console.log("server root path:" + path.join(__dirname, 'index.html'))

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
}))

app.use(webpackHotMiddleware(compiler))

app.get('*', (req, res) => {
  // console.log(req.path)
  // if(req.path.includes('.js')){
  //   console.log(req)
  // }  
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(8080, (err) => {
  if (err) {
    return console.error(err) // eslint-disable-line no-console
  }
  console.log('Listening at http://localhost:8080') // eslint-disable-line no-console
})
