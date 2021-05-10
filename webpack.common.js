const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            Components: path.resolve(__dirname, 'web/Components'),
            utils: path.resolve(__dirname, 'web/utils')
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './web/index.html',
            inject: true
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    optimization: {
        moduleIds: 'hashed',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: /web/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /.(jpe?g|png|woff(2)?|eot|ttf|cur|svg|mp3|ogg)(\?[a-z0-9=.]+)?$/,
                use: 'url-loader?limit=16384'
            },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
            {
                test: /\.json/,
                exclude: /node_modules/,
                type: 'javascript/auto',
                use: [require.resolve('json-loader')]
            }
        ]
    }
};
