const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = {
  mode: 'development',
  watch: true,
  entry: {
    index: './src/index.js',
    style: './src/scss/index.scss',
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].[hash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name].css`,
      chunkFilename: `[name].[hash].css`
    }),
  ],
  resolve: {
    alias: {
      '@modules': path.resolve(__dirname, 'src/modules/'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [MiniCssExtractPlugin.loader, `css-loader`, `sass-loader`]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
};