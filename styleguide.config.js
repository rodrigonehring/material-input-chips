const path = require('path')

module.exports = {
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
  },
  require: [
    path.resolve(__dirname, 'styleguide/setup.js'),
  ],
  components: 'src/MaterialChips/index.js',
}