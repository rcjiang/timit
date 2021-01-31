const path = require('path')
const config = require('./webpack.config')

module.exports = Object.assign({}, config, {
  mode: 'development',
  devServer: {
    contentBase: [
      path.resolve(__dirname, 'public'),
      path.resolve(__dirname, 'src'),
    ],
    publicPath: '/dist/',
  }
})