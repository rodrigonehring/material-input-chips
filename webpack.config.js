const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './src/MaterialChips/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'material-ui-chips.js'
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
  externals : {
    react: 'commonjs react',
    'react-dom': 'commonjs react-dom',
    'material-ui': 'commonjs material-ui',
  },
  plugins: []
}