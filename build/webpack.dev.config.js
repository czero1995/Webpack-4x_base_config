const merge= require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config')
let devConfig = {
	mode: 'development',
	module: {
		rules: [
			{
		        test: /\.(less|css)$/,
				use:[ 'style-loader','css-loader','less-loader'],
				exclude: /node_modules/,
		     },		 
		]
	},
	plugins: [

	],
	
	//构建本地服务器的相关配置 需要在`package.json`里面激活
	devServer: {
		contentBase:'../dist',
		historyApiFallback: true, //不跳转
		inline: true,//实时刷新,
	},
 
}

module.exports=merge(baseWebpackConfig,devConfig);