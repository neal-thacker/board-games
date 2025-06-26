const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const flowbiteReact = require("flowbite-react/plugin/webpack");

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [new HtmlWebpackPlugin({
    template: './public/index.html',
  }), flowbiteReact()],
  devServer: {
    static: './dist',
    port: 3000,
    open: true,
  },
};