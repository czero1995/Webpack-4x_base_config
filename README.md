 ![](https://user-gold-cdn.xitu.io/2018/10/24/166a558dd9a6dd33?w=1011&h=489&f=png&s=55017)
 
 Webpack4.x出来也有一段时间了，网上已经有很多关于Webpack4.x原理和新特性的介绍，比如零配置等，这边就不重复了。
 
 最近将之前基于Webpack3.x写的一个项目升级到4.x，记录和总结Webpack3.x升级到4.x遇到的问题以及解决方案。
 
![](https://user-gold-cdn.xitu.io/2018/10/24/166a61c14f03ed79?w=2728&h=1438&f=png&s=373093)
 项目预览gif:
 
 
![](https://user-gold-cdn.xitu.io/2018/10/24/166a61db7609f568?w=2298&h=1442&f=gif&s=692049)
 在线查看:
    [http://webpack.czero.cn](http://webpack.czero.cn)
    
 
 区分3.x和4.x不同之外，也对Webpack进行了构建优化，并分别配置了Webpack3.x和Webpack4.x的基础配置文件托管在Github,可以用在项目中，减少配置的时间。
 
 Webpack3.x：[https://github.com/czero1995/webapck-3x_bace_config](https://github.com/czero1995/webapck-3x_bace_config)
 
 
 Webpack4.x：[https://github.com/czero1995/webapck-4x_bace_config](https://github.com/czero1995/webapck-4x_bace_config)

 
 

### 项目中Webpack实现功能:

* 多页面入口配置
* 使用Ejs模板实现组件化功能(共用头部和底部)
* 提取公共CSS文件
* 使用HappyPack做多线程打包
* 引入最新Babel编译，可编译ES7,ES8(装饰圈@等)
* devServer，保存自动刷新
* 引入Less处理器
* 配置TypeScript
* 每次Build都先删除掉原先Build出来的文件

### 区分开发环境和生产环境
    开发环境: npm run dev
    生产环境: npm run build
区分开发环境可以提高Webpack打包效率，比如

* 开发环境中:


    配置调试模式devtool：cheap-source-map
    
    配置devServer：保存自动刷新

* 生产环境:

    配置调试模式devtool：inline-source-map
    
    加载提取CSS组件
    
    加载PostCss插件(浏览器前缀,提高兼容性)
    
    添加每次Build时先删除之前Build的文件
    
    压缩代码
    
    清空代码注释和空格
    
    加载PostCss插件

### Webpack3.x和Webpack4.x的几个明显的区别和问题
#### 1. 运行webpack要加参数
从4.0开始:运行webpack一定要加参数

**-- mode development** 或者 **--mode productio**n，

分别对应开发环境和生产环境,否则会报警告:

![](https://user-gold-cdn.xitu.io/2018/10/24/166a5f0aff9b12e2?w=1645&h=134&f=png&s=13166)

**3.x (package.json)**

    "scripts": {
        "build": "webpack --optimize-minimize",
        "dev": "webpack-dev-server --config webpack.dev.config.js"
      },

**4.x (package.json)**

    "scripts": {
        "build": "webpack --optimize-minimize --mode production",
        "dev": "webpack-dev-server --config webpack.dev.config.js --mode development"
      },

#### 2. 移除loaders,必须使用rules
在Webpack3.x中还保留之前版本的loaders,与rules并存都可以使用，在新版中完全移除了loaders,必须使用rules。否则会报错,将module下面的loaders改为rules即可
![](https://user-gold-cdn.xitu.io/2018/10/24/166a5f58a444752a?w=735&h=347&f=png&s=81877)

#### 3. 需要安装webpack-cli
4.x需要安装webpack-cli,不然运行不起来 

    npm install webpack-cli --save
![](https://user-gold-cdn.xitu.io/2018/10/24/166a5f225b1ba5ea?w=657&h=407&f=png&s=78550)

#### 4. TypeScript ts-loader版本太低
在webpack3.x中typescript使用正常，升级到webpack4.x之后就用不了typescript了，因为版本太低
修改typescript版本，我的事5.2.2，在package.json中修改ts-loader版本号，或者删掉,重新执行
npm install ts-loader即可
![](https://user-gold-cdn.xitu.io/2018/10/24/166a5f90f553349b?w=1134&h=144&f=png&s=16319)


### 5. ejs无法使用
webpack结合ejs可以做到组件化开发，共用html代码，比如多个页面的头部和底部，用组件引入的方式，方面后面的开发和维护。
3.x中正常使用，4.x会报ejsRenderLoder of undefined，需要修改htmlplugin的配置。
3.x为:

    template: 'ejs-render-loader!pages/index.ejs',
4.x为

    template: 'ejs-loader!pages/index.ejs',
    
![](https://user-gold-cdn.xitu.io/2018/10/24/166a5fbdd89dc2ef?w=1073&h=235&f=png&s=23257)

### 5. text-webpack-plugin版本太低，构建失败

![](https://user-gold-cdn.xitu.io/2018/10/24/166a5fcc37e81120?w=1163&h=414&f=png&s=44103)

在package.json中修改extract-text-webpack-plugin版本号

    "extract-text-webpack-plugin": "^v4.0.0-alpha.0",
    
    

## 贴webpack.config.js代码配置:

### Webpack 3.x

    const path = require("path");
    const webpack = require('webpack');
    const CleanWebpackPlugin = require('clean-webpack-plugin'); /*每次编译之前，先删除之编译好的文件夹*/
    const ExtractTextPlugin = require("extract-text-webpack-plugin"); /*提取css到为单独文件*/
    const HtmlWebpackPlugin = require('html-webpack-plugin'); /*生成html*/
    const CopyWebpackPlugin = require('copy-webpack-plugin'); /*复制文件*/
    const HappyPack = require('happypack');
    const os = require('os');
    const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
    module.exports = {
    	entry: {		
    		index: './js/index.js', // 首页	
    		second:'./js/second.js', // 第二页
    		three: './js/three.js', // 第三页
    		one:'./js/one.ts', // TypeScript		
    	},
    	devtool: 'inline-source-map', 
    	output: {
    		path: path.resolve(__dirname, "./build"),
    		filename: "./js/[name].js", 
    	},
    	module: {
    		loaders: [
    			{
    				test: /\.js?$/,
    				exclude: /node_modules/,
    				use:['babel-loader','happypack/loader?id=happyBabel'],
    			},
    			{
    				test: /\.tsx?$/,
    				use:{
    					loader: 'ts-loader'
    				}
    			},
    			
    			{
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1
                                }
                            }, 
                            {
                                loader: 'postcss-loader',
                                options: {
                                    plugins: (loader) => [
                                        require('autoprefixer')({
                                            browsers: ['last 15 versions']
                                        })
                                    ]
                                }
                            },
                            { loader: 'less-loader'}
                        ]
                    })
                },
    			{
    			      test: /\.ejs$/,
    			      loader: 'ejs-html-loader',			     
    			  },
    			 {
    			 	//提取html里面的img文件
    		        test: /\.(htm|html)$/i,
    		        loader: 'html-withimg-loader',
    		   },
    			   {
    			   	//图片打包
    			   	test:/(\.jpg|\.png|\.gif|\.jpeg|\.ttf)$/, 
    			   	use:{
    			   		loader:'file-loader',
    			   		 options: {
    			   		 	outputPath: '/',
    			   		 	name:'[name].[ext]',		   		 	
    				      	useRelativePath:true
    				    }
    			   	}
    			   },			 
    		]
    	},
    	plugins: [
    		new webpack.BannerPlugin('xx所有，翻版必究'),
    		new ExtractTextPlugin('./css/[name].css'),				
    		// html文件输出
    		new HtmlWebpackPlugin({
    			title: '首页',
    			filename: 'index.html',
    			template: 'ejs-render-loader!pages/index.ejs',			
    			chunks: ['index','one'],
    			hash:true,
    			cach:true,
    			minify:{
    				caseSensitive:false, //是否大小写敏感
    				removeComments:true, //去除注释
    				removeEmptyAttributes:true,//去除空属性
    				collapseWhitespace:true //是否去除空格
    			},
    			inject:'body'
    		}),
    		new HtmlWebpackPlugin({
    			title: '第二页',
    			filename: 'second.html',
    			template: 'ejs-render-loader!pages/second.ejs',			
    			chunks: ['second'],
    			hash:true,
    			cach:true,
    			minify:{
    				caseSensitive:false, //是否大小写敏感
    				removeComments:true, //去除注释
    				removeEmptyAttributes:true,//去除空属性
    				collapseWhitespace:true //是否去除空格
    			},
    			inject:'body'
    		}),
    		new HtmlWebpackPlugin({
    			title: '第三页',
    			filename: 'three.html',
    			template: 'ejs-render-loader!pages/three.ejs',			
    			chunks: ['three'],
    			hash:true,
    			cach:true,
    			minify:{
    				caseSensitive:false, //是否大小写敏感
    				removeComments:true, //去除注释
    				removeEmptyAttributes:true,//去除空属性
    				collapseWhitespace:true //是否去除空格
    			},
    			inject:'body'
    		}),
    
    		new CopyWebpackPlugin([{
    		    from: __dirname + '/img',
    		    to:'img/'
    		}]),
    		new CleanWebpackPlugin(['build']), //编译前先清除文件夹
    		new HappyPack({
    			//用id来标识 happypack处理那里类文件
    		  id: 'happyBabel',
    		  //如何处理  用法和loader 的配置一样
    		  loaders: [{
    			loader: 'babel-loader?cacheDirectory=true',
    		  }],
    		  //共享进程池
    		  threadPool: happyThreadPool,
    		  //允许 HappyPack 输出日志
    		  verbose: true,
    		})
    	],
    
    	resolve:{		
    		extensions: [".js",".less",".css"],
    	},
    	
     
    }
### Webpack 4.x

    const path = require("path");
    const webpack = require('webpack');
    const CleanWebpackPlugin = require('clean-webpack-plugin'); /*每次编译之前，先删除之编译好的文件夹*/
    const ExtractTextPlugin = require("extract-text-webpack-plugin"); /*提取css到为单独文件*/
    const HtmlWebpackPlugin = require('html-webpack-plugin'); /*生成html*/
    const CopyWebpackPlugin = require('copy-webpack-plugin'); /*复制文件*/
    const HappyPack = require('happypack');
    const os = require('os');
    const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
    module.exports = {
    	entry: {		
    		index: './js/index.js', // 首页	
    		second:'./js/second.js', // 第二页
    		three: './js/three.js', // 第三页
    		one:'./js/one.ts', // TypeScript		
    	},
    	devtool: 'inline-source-map', 
    	output: {
    		path: path.resolve(__dirname, "./build"),
    		filename: "./js/[name].js", 
    	},
    	module: {
    		rules: [
    			{
    				test: /\.js?$/,
    				exclude: /node_modules/,
    				use:['babel-loader','happypack/loader?id=happyBabel'],
    			},
    			{
    				test: /\.tsx?$/,
    				use:{
    					loader: 'ts-loader'
    				}
    			},
    			
    			{
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1
                                }
                            }, 
                            {
                                loader: 'postcss-loader',
                                options: {
                                    plugins: (loader) => [
                                        require('autoprefixer')({
                                            browsers: ['last 15 versions']
                                        })
                                    ]
                                }
                            },
                            { loader: 'less-loader'}
                        ]
                    })
                },
    			{
    			      test: /\.ejs$/,
    			      loader: 'ejs-html-loader',			     
    			  },
    			 {
    			 	//提取html里面的img文件
    		        test: /\.(htm|html)$/i,
    				loader: 'html-withimg-loader',
    				exclude: /node_modules/,
    		   },
    			   {
    			   	//图片打包
    			   	test:/(\.jpg|\.png|\.gif|\.jpeg|\.ttf)$/, 
    			   	use:{
    			   		loader:'file-loader',
    			   		 options: {
    			   		 	outputPath: '/',
    			   		 	name:'[name].[ext]',		   		 	
    				      	useRelativePath:true
    				    }
    			   	}
    			   },			 
    		]
    	},
    	plugins: [
    		new webpack.BannerPlugin('xx所有，翻版必究'),
    		new ExtractTextPlugin('./css/[name].css'),				
    		// html文件输出
    		new HtmlWebpackPlugin({
    			title: '首页',
    			filename: 'index.html',
    			template: 'ejs-loader!pages/index.ejs',			
    			chunks: ['index','one'],
    			hash:true,
    			cach:true,
    			minify:{
    				caseSensitive:false, //是否大小写敏感
    				removeComments:true, //去除注释
    				removeEmptyAttributes:true,//去除空属性
    				collapseWhitespace:true //是否去除空格
    			},
    			inject:'body'
    		}),
    		new HtmlWebpackPlugin({
    			title: '第二页',
    			filename: 'second.html',
    			template: 'ejs-loader!pages/second.ejs',			
    			chunks: ['second'],
    			hash:true,
    			cach:true,
    			minify:{
    				caseSensitive:false, //是否大小写敏感
    				removeComments:true, //去除注释
    				removeEmptyAttributes:true,//去除空属性
    				collapseWhitespace:true //是否去除空格
    			},
    			inject:'body'
    		}),
    		new HtmlWebpackPlugin({
    			title: '第三页',
    			filename: 'three.html',
    			template: 'ejs-loader!pages/three.ejs',			
    			chunks: ['three'],
    			hash:true,
    			cach:true,
    			minify:{
    				caseSensitive:false, //是否大小写敏感
    				removeComments:true, //去除注释
    				removeEmptyAttributes:true,//去除空属性
    				collapseWhitespace:true //是否去除空格
    			},
    			inject:'body'
    		}),
    
    		new CopyWebpackPlugin([{
    		    from: __dirname + '/img',
    		    to:'img/'
    		}]),
    		new CleanWebpackPlugin(['build']), //编译前先清除文件夹
    		new HappyPack({
    			//用id来标识 happypack处理那里类文件
    		  id: 'happyBabel',
    		  //如何处理  用法和loader 的配置一样
    		  loaders: [{
    			loader: 'babel-loader?cacheDirectory=true',
    		  }],
    		  //共享进程池
    		  threadPool: happyThreadPool,
    		  //允许 HappyPack 输出日志
    		  verbose: true,
    		})
    	],
    
    	resolve:{		
    		extensions: [".js",".less",".css"],
    	},
    	
     
    }


## Webpack构建优化
### 区分开发环境和生产环境

* 开发环境不需要去压缩代码
* 指定调试模式devtool模式

### 压缩代码用ParalleUglifyPlugin代替自带的UglifyJsPlugin插件

自带的js压缩插件是单线程执行的，而webpack-parallel-uglify-plugin可以并行的执行
开发环境不做无意义的操作

很多配置，在开发阶段是不需要去做的，我们可以区分出开发和线上的两套配置，这样在需要上线的时候再全量编译即可，比如代码压缩，目录内容清理，计算文件hash,提取css文件等

### babel-loader开启缓存

babel-loader在执行的时候，可能会产生一些运行期间重复的公共文件，造成代码体积大多余，同时也会减慢编译效率

可以加上cacheDirectory参数或使用transform-runtime插件试试

	// webpack.config.js
	use: [{
        loader: 'babel-loader',
        options: {
            cacheDirectory: true
        }]


	// .bablerc
	{
	    "presets": [
	        "env",
	        "react"
	    ],
	    "plugins": ["transform-runtime"]
	    
	}
	
### 使用happypack来加速构建

		happypack会采用多进程去打包构建

### 优化构建时的搜索路径alias
### 使用noParse
webpack打包的时候，有时不需要解析某些模块的加载(这些模块并没有依赖，或者并根本没有模块化)，我们可以直接加上这个参数，直接跳过这种解析

	module:{
	noParse: /node_modules\/(jquery.js)
	}


### 启用DllPlugin和DllReferencePlugin预编译库文件
这是最复杂也是提升效果最明显的一步，原理是将第三方库文件单独打包一次，以后的编译都不需要在编译打包第三方库

拷贝静态资源文件，引入DllPlugin和DllReferencePlugin来提前构建一些第三方库，来优化Webpack阿宝。

而在生产环境时，就需要将提前构建好的包同步到dist中

对于commonChunkPlugin,webpack每次打包实际还是需要去处理这些第三方库，只是打包完之后，能把第三方库和我们自己的代码分开。
而DllPlugin则是能把第三方代码完全分离开，即每次只打包项目自身的代码。
在**build/**文件夹下新建**webpack.dll.config.js**文件,复制一下代码:

		const path = require("path")
		const webpack = require("webpack")
		
		module.exports = {
		    // 你想要打包的模块的数组
		    entry: {
		        vendor: ['vue/dist/vue.esm.js', 'axios', 'vue-router', 'vuex']
		    },
		    output: {
		        path: path.join(__dirname, '../static/js'), // 打包后文件输出的位置
		        filename: '[name].dll.js',
		        library: '[name]_library'
		    },
		    plugins: [
		        new webpack.DllPlugin({
		            path: path.join(__dirname, '.', '[name]-manifest.json'),
		            name: '[name]_library',
		            context: __dirname
		        }),
		        // 压缩打包的文件
		        new webpack.optimize.UglifyJsPlugin({
		            compress: {
		                warnings: false
		            }
		        })
		    ]
		}
在**build/webpack.dev.config.js**和**build/webpack.prod.config.js**中添加plugins

		new webpack.DllReferencePlugin({
		      context: __dirname,
		      manifest: require('./vendor-manifest.json')
		}),
		
在**根目录下的index.html**下引入预编译的库

	 	<script src="./static/js/vendor.dll.js"></script>

在**package.json/scripts**下中添加dll命令

    "dll": "webpack --config ./build/webpack.dll.config.js"
    
运行:

	npm run dll
	
然后再

	npm run dev或npm run build


提取公共代码
使用CommonsChunkplugin提取公共的模块，可以减少文件体积，也有助于浏览器层的文件缓存

	npm run dll
	npm run dev 或npm run build