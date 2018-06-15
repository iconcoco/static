var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin('[name].[contenthash:8].css');

function htmlPlugin(name, path) {
    return {
        filename: './index.html',
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
        history: './src/pages/History/index.js',
        details: './src/pages/details/index.js',
        vendor: ['vue']
    },

    output: {
        path: path.join(__dirname, './dist/'),
        filename: './js/[name].js',
        chunkFilename: "[id].chunk.js"
    },
    module: {
        loaders: [{
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
                            minimize: false //css压缩
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
        new HtmlWebpackPlugin(htmlPlugin('history', 'history')),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"' //加载xxx.min.js
            }
        }),
        extractCSS,
        new webpack.optimize.CommonsChunkPlugin({ name: "vendor", minChunks: Infinity }),
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: "./",
        quiet: false, //控制台中不输出打包的信息
        noInfo: false,
        hot: true, //开启热点
        inline: true, //开启页面自动刷新
        lazy: false, //不启动懒加载
        progress: true, //显示打包的进度
        watchOptions: {
            aggregateTimeout: 300
        },
        port: '3007', //设置端口号
        //配置反向代理
        proxy: {
            '/': {
                target: 'http://crm.lcx.tobosu.cn/',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true
            }
        }

    }
}