/* eslint-disable no-console */
// const path = require('path')
const express = require('express')
const app = express()

app.use(express.static('./'))

app.listen(9999, (err) => {
  if (err) {
    return console.error(err) // eslint-disable-line no-console
  }
  console.log('Listening at http://localhost:9999') // eslint-disable-line no-console
})
