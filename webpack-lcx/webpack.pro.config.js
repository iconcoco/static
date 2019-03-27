const webpack = require('webpack');
const path = require('path');

const uglify = require('uglifyjs-webpack-plugin'); //用于压缩js的插件  webpack内部已经自己集成了
const htmlWebpackPlugin = require('html-webpack-plugin'); //用于html的刷新热更新
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //用于将css从js中抽离出来  可能会碰上不支持高版本的webapck  这时候需要安装 npm install --save-dev extract-text-webpack-plugin@next
const VueLoaderPlugin = require('vue-loader/lib/plugin'); //vue-loader@15.x版本需要用插件来启用
const CleanWebpackPlugin = require('clean-webpack-plugin'); //去除打包文件中重复的文件


function htmlPlugin(dirname,isCommon) {
    //process是node的模块
    return {
        template: isCommon ? `./src/page/common/SPAhtml.js`:`./src/page/${dirname}/html.js`, //模板的位置
        filename: `${dirname}.html`,
        hash: true, //hash值 预防浏览器缓存 最好设置为true
        chunks: ['minifest','vendor', dirname], //页面中需要引入的js模块片段
        chunksSortMode: 'manual', //引入模块片段的顺序
        minify: {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true
        },

    }
};

module.exports = {
    entry: { 
        carespay:  ['babel-polyfill','./src/page/carespay/index.js'],
        index:  ['babel-polyfill','./src/page/index/index.js'],
        weChat: ['babel-polyfill','./src/page/weChat/index.js'],  //微信公众号
        // vendor: ['vue','jquery'],
    },
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: 'js/[name].js',
        publicPath: '/',
        chunkFilename: '[id].bundle.js',
    },
    module: {
        rules: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                        loader: 'css-loader',
                        options: {
                            // importLoaders: 1,
                            singleton: true,
                            minimize: true //css压缩
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
        new uglify(),
        new CleanWebpackPlugin("./dist"), //去除打包之后重复的文件名称
        new VueLoaderPlugin(), //vue-loader@15.x版本之后需要用的插件
        new ExtractTextPlugin({
            filename: 'css/[name].min.css',
            allChunks: false
        }), //配置打包之后的css放置于哪个位置,
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor', //以哪个模块作为公共的js
            filename: 'js/[name].js',
            minChunks: function (module,count) {
                return (
                    module.resource &&
                    module.resource.indexOf(path.join(__dirname, './node_modules')) === 0
                )
            }
        }), //抽离公共的js
        new webpack.optimize.CommonsChunkPlugin({
            name: 'minifest',
            filename: 'js/[name].js',
            chunks: ['vendor']
        }), //抽离公共的js
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        //需要打包的页面
          
        new htmlWebpackPlugin(htmlPlugin('carespay',true)),
        new htmlWebpackPlugin(htmlPlugin('index',true)),
        new htmlWebpackPlugin(htmlPlugin('weChat')),  
        new htmlWebpackPlugin({
            template:'./src/page/error/html.js',
            filename: `502.html`,
            chunks:[],
        }),

    ],

    devServer: {
        //设置基本目录
        contentBase: path.resolve(__dirname, './dist'),
        host: 'localhost',
        compress: true,
        port: 1005,
        // 允许开发服务器访问本地服务器的包JSON文件，防止跨域
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        // 设置热替换
        // hot: true,
        // 设置页面引入
        inline: true,
        proxy: {
            '/': {
                target: 'http://10.10.100.15:18099/',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true
            }
        }
    },
}