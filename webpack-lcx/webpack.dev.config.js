const path = require('path');

const htmlWebpackPlugin = require('html-webpack-plugin'); //用于html的刷新热更新

const BASECONFIG = require('./webpack.base.config.js');
//dev环境的配置
const DEV = require('./ext/dev.js');

function htmlPlugin(dirname,isCommon) {
    //process是node的模块
    return {
        template: isCommon ? `./src/page/common/SPAhtml.js`:`./src/page/${dirname}/html.js`, //模板的位置
        filename: `${dirname}.html`,
        hash: true, //hash值 预防浏览器缓存 最好设置为true
        chunks: ['minifest','vendor', dirname], //页面中需要引入的js模块片段
        chunksSortMode: 'manual', //引入模块片段的顺序
        // loading: loading,
        minify: {
            removeAttributeQuotes: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true
        },

    }
}

module.exports = {
    entry: {
        carespay: ['babel-polyfill','./src/page/carespay/index.js'],        //carespay
        index: ['babel-polyfill','./src/page/index/index.js'],              //登录页面
        // weChat: ['babel-polyfill','./src/page/weChat/index.js'],  //微信公众号
        // vendor: ['vue','jquery'],                                        //页面公共的js
    },
    output: BASECONFIG.output,
    module: BASECONFIG.module,
    plugins: [
        ...BASECONFIG.plugins,
        //需要打包的页面  
        new htmlWebpackPlugin(htmlPlugin('carespay',true)),
        new htmlWebpackPlugin(htmlPlugin('index',true)),
        // new htmlWebpackPlugin(htmlPlugin('weChat')),  
        // new htmlWebpackPlugin({
        //     template:'./src/page/error/html.js',
        //     filename: `502.html`,
        //     chunks:[],
        // }),
        
    ],

    devServer: {
        //设置基本目录
        contentBase: path.resolve(__dirname, './dist'),
        host: DEV.host,
        compress: true,
        port: DEV.port,
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
            //   target: 'http://192.168.10.79:8080/', //zhou
                // target: 'http://192.168.10.65:8080', //yongfu
                // target: 'http://192.168.10.112:8090/', //bing
                target: 'http://192.168.10.210:18081',  //开发环境 
                // target:"http://10.10.100.11:18081",  //测试
                // target:"https://testuser.carespay.com/",  //测试
                // target: 'https://user.carespay.com/',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true
            }
        }
    },
}

