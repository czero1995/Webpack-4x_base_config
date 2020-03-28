const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin'); 
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

module.exports = {
	entry: {						
		index: './js/index.js', // 首页	
		second:'./js/second.js', // 第二页
		three: './js/three.js', // 第三页
		one:'./js/one.ts', // TypeScript	
	},
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "./js/[name].js", 
	},
	module: {
		rules:[
			{
				test: /\.js?$/,
				exclude: /node_modules/,
				use:['babel-loader?cacheDirectory','happypack/loader?id=happyBabel'],
			},
			{
				test: /\.tsx?$/,
				use:{
					loader: 'ts-loader'
				}
			},
			{
				test: /\.ejs$/,
				loader: "ejs-html-loader",			     
				exclude: /node_modules/,
			},
			{
			   test: /\.(htm|html)$/i,
			   loader: 'html-withimg-loader',
			   exclude: /node_modules/,
		  },
		  {
			test:/(\.jpg|\.png|\.gif|\.jpeg|\.ttf)$/, 
			use:{
				loader:'file-loader',
				 options: {
					 outputPath: '/',
					 name:'[name].[ext]',		   		 	
				   useRelativePath:true
			 }
			}
		}
		],
	},
	
	plugins:[
		new HtmlWebpackPlugin({
			title: '首页',
			filename: 'index.html',
			template: 'ejs-loader!pages/index.ejs',			
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
		    from: 'img/',
		    to:'img/'
		}]),
		new HappyPack({
		  id: 'happyBabel',
		  loaders: [{
			loader: 'babel-loader?cacheDirectory=true',
		  }],
		  threadPool: happyThreadPool,
		  verbose: true,
		}),
		
new HardSourceWebpackPlugin({
    cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
    recordsPath: 'node_modules/.cache/hard-source/[confighash]/records.json',
    configHash: function(webpackConfig) {
       return require('node-object-hash')({sort: false}).hash(webpackConfig);
    },
    environmentHash: {
       root: process.cwd(),
       directories: [],
       files: ['package-lock.json', 'yarn.lock'],
    },
})
	],
	resolve:{		
		extensions: [".js",".less",".css"],
	},
	
}