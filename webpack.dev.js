const common = require('./webpack.common.js')
const merge = require('webpack-merge')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = merge(common, {
  devtool: 'inline-cheap-source-map',
  plugins: [
    new BundleAnalyzerPlugin({
      openAnalyzer: false
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    proxy: {
      '/': 'http://127.0.0.1:8000'
    }
  }
})
