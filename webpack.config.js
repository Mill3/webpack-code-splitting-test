const path = require('path');

module.exports = {
  mode: 'development',
  watch: true,
  entry: {
    app: './src/app.js',
    module_a: './src/module-a.js',
    module_b: './src/module-b.js',
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      // chunks: 'all',
    },
  }
};