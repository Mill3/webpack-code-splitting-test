const path = require('path');

module.exports = {
  mode: 'development',
  watch: true,
  entry: {
    index: './src/index.js',
    app: './src/app.js',
    module_a: './src/module-a.js',
    module_b: './src/module-b.js',
    quotes: './src/modules/quotes/index.js',
    sliders: './src/modules/sliders/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};