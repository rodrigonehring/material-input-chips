const webpack = require('webpack');
const path = require('path');
var WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;

const prod = process.env.NODE_ENV === 'production';

const externals = [];

if (prod) {
  externals.push([
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
  ]);
}

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './src/MaterialChips/index.js',
  target: prod ? 'node' : 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    filename: 'material-input-chips.js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  externals,
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