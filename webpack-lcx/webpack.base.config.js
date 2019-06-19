const ExtractTextPlugin = require('extract-text-webpack-plugin'); //用于将css从js中抽离出来  可能会碰上不支持高版本的webapck  这时候需要安装 npm install --save-dev extract-text-webpack-plugin@next
const VueLoaderPlugin = require('vue-loader/lib/plugin'); //vue-loader@15.x版本需要用插件来启用
const webpack = require('webpack');
const path = require("path");

module.exports = {
    output:{
        path: path.resolve(__dirname, './dist/'),
        filename: 'js/[name].[chunkhash:8].js',
        publicPath:'/',
        chunkFilename: '[id].[chunkhash:8].chunk.js',
    },
    module : {
        rules: [{
            test: /\.css$/,
            // loader: ['style-loader', 'css-loader', 'postcss-loader']
            loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                            loader: 'css-loader',
                            options: {
                                singleton: true,
                                // minimize: true //css压缩
                            }
                        },
                        'postcss-loader'
                    ]
            })
            }, {
                test: /\.(png|gif|jpg|ttf|woff|woff2|svg|ttf|eot)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 5000, //把小于50000 byte的文件打包成Base64的格式写入JS
                        outputPath: "images/", //当大于是使用file-loader将图片打包到images目录下
                        name: "[name].[ext]?v=[hash]" //定义图片输出的名字,否则会以base64格式输出,在html页面中引入会报找不到图片
                    }
                }
            }, {
                test: /\.(html|htm)$/i,
                use: ['html-withimg-loader']
            }, {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use:[{
                        loader: 'css-loader',
                        options: {
                            singleton: true,
                            minimize: true //css压缩
                        }
                    },"postcss-loader","sass-loader"]
                })
            }, {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: /node_modules/
            }, {
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
                test: /\.(tpl|ejs)$/,
                use: 'ejs-loader'
        }],
    },
    plugins: [

        new VueLoaderPlugin(), //vue-loader@15.x版本之后需要用的插件
        new ExtractTextPlugin({
            // filename: 'page/[name]/[name]-[hash:3].css'
            filename: 'css/[name].min.css',
            allChunks: false
        }), //配置打包之后的css放置于哪个位置,
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor', //以哪个模块作为公共的js
            filename: 'js/[name].[chunkhash:8].js',
            minChunks: function (module,count) {
                //"有正在处理文件" + "这个文件是 .js 后缀" + "这个文件是在 node_modules 中"
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(path.join(__dirname, './node_modules')) === 0
                )
            }
        }), //抽离公共的js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'minifest',
            filename: 'js/[name].[chunkhash:8].js',
            chunks: ['vendor']
        }), //抽离公共的js
      

    ] 
};
