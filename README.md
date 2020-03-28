
# 基于Webpack 4.0封装的多页面基础配置。
 
 [在线查看demo](http://webpack.czero.cn)
    

### 项目中Webpack实现功能:

#### 配置
1. 引入 <font color=red>webpack-merge</font> 合并公共基础配置，区分 <font color=#1e90ff>开发环境</font> 和 <font color=#1e90ff>正式环境</font>。
2. 引入 <font color=red>HtmlWebpackPlugin</font>  实现多页面配置。
3. 引入 <font color=red>Ejs</font> 模板实现组件化模块化功能(共用多页面的头部和底部)。
4. 引入 <font color=red>ExtractTextPlugin</font> 提取分离公共CSS文件。
7. 引入 <font color=red>Babel transform-decorators-legacy</font> 最新编译，可编译ES7,ES8(装饰圈@等)。
8. 配置 <font color=red>less-loader</font> 预处理器。
9. 配置 <font color=red>postcss</font> 调高CSS代码在不同浏览器的兼容性。
10. 配置 <font color=red>TypeScript</font>。
11. <font color=#1e90ff>开发环境</font> 使用 <font color=red>devServer</font> , 保存自动刷新页面。
12. <font color=#1e90ff>正式环境</font> 基于Webpack4的 <font color=red>TerserPlugin</font> 更好的压缩代码。


#### 构建
1. 引入 <font color=red>HappyPack</font> 做多线程打包。
2. 引入 <font color=red>HardSourceWebpackPlugin</font> 做硬盘缓存。
3. 引入 <font color=red>SpeedMeasurePlugin</font> 分析打包速度。
4. 引入 <font color=red>BundleAnalyzerPlugin</font>  分析打包完成包的大小。
5. 引入 <font color=red>WebpackBuildNotifierPlugin</font> 构建完成会自动提醒。


### 使用
    
    git clone https://github.com/czero1995/webapck-4x_bace_config.git
    
    cd webapck-4x_bace_config
    
    npm install
    
    开发环境: npm run dev
    
    生产环境: npm run build
    
    分析环境: npm run analyz
    