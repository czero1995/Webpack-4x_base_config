const path = require("path");
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
	devtool: 'cheap-source-map',   //开启调试模式，cheap-source-map提升打包速度和编译速度。
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
		        test: /\.(less|css)$/,
				use:[ 'style-loader','css-loader','less-loader'],
				exclude: /node_modules/,
		     },
			{
			      test: /\.ejs$/,
				  loader: "ejs-html-loader",			     
				  exclude: /node_modules/,
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
				   },
				   exclude: /node_modules/,
			   },			 
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: '首页',
			filename: 'index.html',
			template: 'ejs-loader!pages/index.ejs',			
			// template: `pages/index.ejs`,			
			chunks: ['index','one'],
		}),
		new HtmlWebpackPlugin({
			title: '第二页',
			filename: 'second.html',
			template: 'ejs-loader!pages/second.ejs',			
			chunks: ['second'],
		}),
		new HtmlWebpackPlugin({
			title: '第三页',
			filename: 'three.html',
			template: 'ejs-loader!pages/three.ejs',			
			chunks: ['three'],
		}),
		new CopyWebpackPlugin([{
		    from: __dirname + '/img',
		    to:'img/'
		}]),
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
	
	//构建本地服务器的相关配置 需要在`package.json`里面激活
	devServer: {
		contentBase:'./build',
		historyApiFallback: true, //不跳转
		inline: true,//实时刷新,
	},
 
}