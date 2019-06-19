# 安装依赖包
npm install

# 运行项目
npm run local

# 打包上线
npm run build/npm run prod

#项目目录结构

│  .babelrc
│  .gitignore
│  package-lock.json
│  package.json
│  postcss.config.js
│  README.md
│  webpack.base.config.js
│  webpack.dev.config.js
│  webpack.pro.config.js
│
├─dist
├─ext
│      dev.js           //配置开发环境的IP已经端口号
│      ip.js            //获取本地IP
│      pro.js           //生产环境配置逻辑
│      pro.unit.js      //生产环境配置变量
│
└─src
    ├─components
    ├─css
    ├─images
    ├─js
    └─page
