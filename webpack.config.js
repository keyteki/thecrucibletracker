const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: './web/index.js',
  mode: process.env.NODE_ENV || 'production',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /web/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [ '@babel/env' ]
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  resolve: {
    extensions: [ '*', '.js', '.json' ],
    alias: {
      Components: path.resolve(__dirname, 'web/Components'),
      utils: path.resolve(__dirname, 'web/utils'),
    }
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist/'),
    port: 3002,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
};
