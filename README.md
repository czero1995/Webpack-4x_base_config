# 基于Webpack 4.0封装的多页面基础配置。
 
 [在线查看demo](http://webpack.czero.cn)
    

### 项目中Webpack实现功能:

#### 配置
1. 引入 **webpack-merge** 合并公共基础配置，区分 开发环境 和 正式环境。
2. 引入 **HtmlWebpackPlugin**  实现多页面配置。
3. 引入 **Ejs** 模板实现组件化模块化功能(共用多页面的头部和底部)。
4. 引入 **ExtractTextPlugin** 提取分离公共CSS文件。
7. 引入 **Babel transform-decorators-legacy** 最新编译，可编译ES7,ES8(装饰圈@等)。
8. 配置 **less-loader** 预处理器。
9. 配置 **postcss** 调高CSS代码在不同浏览器的兼容性。
10. 配置 **TypeScript**。
11. 开发环境 使用 **devServer** , 保存自动刷新页面。
12. 正式环境 基于Webpack4的 **TerserPlugin** 更好的压缩代码。


#### 构建
1. 引入 **HappyPack** 做多线程打包。
2. 引入 **HardSourceWebpackPlugin** 做硬盘缓存。
3. 引入 **SpeedMeasurePlugin** 分析打包速度。
4. 引入 **BundleAnalyzerPlugin**  分析打包完成包的大小。
5. 引入 **WebpackBuildNotifierPlugin** 构建完成会自动提醒。


### 使用
    
    git clone https://github.com/czero1995/webapck-4x_bace_config.git
    
    cd webapck-4x_bace_config
    
    npm install
    
    开发环境: npm run dev
    
    生产环境: npm run build
    
    分析环境: npm run analyz
    