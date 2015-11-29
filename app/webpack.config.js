var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/app.js',
    redirect: ['hellojs']
  },
	output: {
    path: path.join(__dirname, "dist"),
    filename: '[name].js'
	},
	module: {
		loaders: [
      { test: /\.ttf(\?(.*))?$/, loader: 'file?name=content/[hash].[ext]' },
		  { test: /\.eot(\?(.*))?$/, loader: 'file?name=content/[hash].[ext]' },
		  { test: /\.svg(\?(.*))?$/, loader: 'file?name=content/[hash].[ext]' },
		  { test: /\.less$/, loader: 'style!css!less' },
      { test: /\.html$/, loader: 'file?name=content/[hash].[ext]' },
      { test: /\.(woff|woff2)(\?(.*))?$/, loader: 'url?prefix=factorynts/&limit=5000&mimetype=application/font-woff&name=content/[hash].[ext]' }
    ]
	},
	devtool: 'source-map',
  plugins: [
    //new webpack.optimize.CommonsChunkPlugin("redirect", "redirect.js"),
    new HtmlWebpackPlugin({template: 'src/index.html', inject: 'body', chunks: ['app']}),
    new HtmlWebpackPlugin({filename: 'redirect.html', chunks: ['redirect']}),
  ],
  devServer: {
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    }
  }
};
