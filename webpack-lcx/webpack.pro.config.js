const webpack = require('webpack');

const uglify = require('uglifyjs-webpack-plugin'); //用于压缩js的插件  webpack内部已经自己集成了
const htmlWebpackPlugin = require('html-webpack-plugin'); //用于html的刷新热更新
const CleanWebpackPlugin = require('clean-webpack-plugin'); //去除打包文件中重复的文件

const BASECONFIG = require('./webpack.base.config.js');

require('./ext/pro.js')();

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
    output: BASECONFIG.output,
    module: BASECONFIG.module,

    plugins: [
        ...BASECONFIG.plugins,
        // new webpack.optimize.CommonsChunkPlugin({
        //     chunks: ['carespay','index','weChat'],
        //     // children: true,
        //     minChunks: 1
        // }), //抽离公共的js
        new uglify(),
        new CleanWebpackPlugin("./dist"), //去除打包之后重复的文件名称
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
}