const path = require('path');

module.exports = {
  webpackConfig: require('./webpack.config.js'),
  require: [
    path.resolve(__dirname, 'styleguide/setup.js')
  ],
  components: 'src/MaterialChips/index.js'
};