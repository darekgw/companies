const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const env = process.env.NODE_ENV;

module.exports = {
  entry: "./packages/app/root-element.js",

  mode: env,

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: "/"
  },

  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 3500,
    hot: true
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: "babel-loader"
    }]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};