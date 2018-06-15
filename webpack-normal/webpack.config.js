const webpack = require('webpack');
const path = require('path');
const glob = require('glob');


const uglify = require('uglifyjs-webpack-plugin');//用于压缩js的插件  webpack内部已经自己集成了
const htmlWebpackPlugin = require('html-webpack-plugin');//用于html的刷新热更新
const ExtractTextPlugin = require('extract-text-webpack-plugin');//用于将css从js中抽离出来  可能会碰上不支持高版本的webapck  这时候需要安装 npm install --save-dev extract-text-webpack-plugin@next
const purifycssPlugin = require('purifycss-webpack');//去除多余的css


//用以解决静态资源引用路径的问题  将相对路径变成绝对路径
let url;
if(process.env.type == 'build'){//生产坏境
    url = "http://172.16.1.165:1003/";
}else{//开发坏境
    url = "http://localhost:1003/";
}

const website = {
    path:url
}


module.exports = {
    entry:{
        buddle:'./src/test.js'
    },
    output:{
        path:path.resolve(__dirname,'./dist'),
        filename:'[name].js',
        publicPath:website.path
    },
    module:{
        rules:[{
            test:/\.css$/,
            loader:ExtractTextPlugin.extract({
                fallback:"style-loader",
                use:[{
                    loader:'css-loader',
                    options:{importLoaders: 1 }
                },
                'postcss-loader'
            ]
            })
            // use:["style-loader","css-loader"]
        },{
            test:/\.(png|gif|jpg)$/,
            use:{
                loader:'url-loader',
                options:{
                    limit:500000,
                    outputPath:"images/",
                    name:"[name].[ext]?v=[hash]"//定义图片输出的名字,否则会以base64格式输出,在html页面中引入会报找不到图片
                }
            }
        },{
            test:/\.(html|htm)$/i,
            use:['html-withimg-loader']
        },{
            test:/\.scss$/,
            // use:['style-loader','css-loader','sass-loader']
            loader:ExtractTextPlugin.extract({
                fallback:"style-loader",
                use:["css-loader","postcss-loader","sass-loader"]
            })
        },{
            test:/\.(js|jsx)$/,
            use:"babel-loader",
            exclude:/node_modules/
        }],
    },
    
    plugins:[
        new uglify(),
        new htmlWebpackPlugin({
            template:'./src/index.html',//模板的位置
            hash:true,//hash值 预防浏览器缓存 最好设置为true
            minify:{
                removeAttributeQuotes:true 
            }
        }),
        new ExtractTextPlugin({
            filename: '[name]-[hash:3].css'
        }),//配置打包之后的css放置于哪个位置
        new purifycssPlugin({
            paths:glob.sync(path.join(__dirname,'src/*.html'))
        }),//去除页面中多余的css样式
    ],
    
    devServer:{
        //设置基本目录
        contentBase:path.resolve(__dirname,'./dist'),
        host:'localhost',
        compress:true,
        port:1003
    }
}