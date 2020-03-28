const webpack = require('webpack');
const merge= require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin'); 
const TerserPlugin = require('terser-webpack-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
let prodConfig = {
    mode: 'production',
	devtool: 'inline-source-map', 
	module: {
		rules: [
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
            }
		]
	},
	plugins: [
		new webpack.BannerPlugin('xx所有，翻版必究'),
		new ExtractTextPlugin('./css/[name].css'),		
        new CleanWebpackPlugin(['dist']), 
        new WebpackBuildNotifierPlugin({
            title: "构建成功",
            showDuration: true
          }),
	],
    optimization: {
        minimizer: [
          new TerserPlugin({
            parallel: true,
          }),
        ],
      },
	
 
}

if (process.env.npm_config_report) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    prodConfig.plugins.push(new BundleAnalyzerPlugin())
  }

module.exports =  smp.wrap(merge(baseWebpackConfig,prodConfig));