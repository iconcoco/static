var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin('[name].[contenthash:8].css')


function htmlPlugin(name, path) {
    return {
        filename: './' + path + '/' + name + '.html',
        template: './src/pages/' + path + '/template.html',
        inject: true,
        chunks: ['vendor', name],
        minify: { //压缩html中哪些东西
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true
        }
    }
}

module.exports = {
    entry: {
        History: './src/pages/History/index.js',
        details: './src/pages/details/index.js',
        vendor: ['vue']
    },
    output: {
        path: path.join(__dirname, './dist/'),
        filename: './js/[name].[chunkhash:8].js',
        chunkFilename: "[id].chunk.js"
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                loader: extractCSS.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true //css压缩
                        }
                    }],

                })
            },
            {
                test: /\.(ttf|swf|eot|mp4)$/,
                loader: 'url-loader'
            },
            {
                test: /\.(png|svg|gif|jpg|ico)$/,
                use: [{
                    loader: 'url-loader?limit=4000&name=images/[name]-[hash:5].[ext]'
                }]
            },
            {
                test: /\.json$/,
                loader: "json-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin("./dist"), //清除指定文件夹目录下的重复文件
        new HtmlWebpackPlugin(htmlPlugin('History', 'History')),
        new HtmlWebpackPlugin(htmlPlugin('details', 'details')),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"' //加载xxx.min.js
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false //警告干掉
            },
            comments: false //去掉版权信息等注释
        }),
        extractCSS,
        new webpack.optimize.CommonsChunkPlugin({ name: "vendor", minChunks: Infinity })
    ]
}