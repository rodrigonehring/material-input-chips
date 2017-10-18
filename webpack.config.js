const webpack = require('webpack');
const path = require('path');
var WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;

const prod = true;

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './src/MaterialChips/index.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',

    filename: 'material-input-chips.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  externals: [
    'material-ui',
    'material-ui/Chip',
    'material-ui/styles',
    'material-ui/Form',
    'material-ui/Input',
    'material-ui/Menu',
    'material-ui/Paper',
    'classnames',
    'prop-types',
    'react',
    'react-dom',
  ],
  plugins: [
    new WebpackBundleSizeAnalyzerPlugin(path.resolve(__dirname, 'dist/plain-report.txt')),
    // prod && new webpack.optimize.UglifyJsPlugin({
    //   minimize: true,
    //   compress: {
    //     warnings: false
    //   }
    // }),
  ]
}