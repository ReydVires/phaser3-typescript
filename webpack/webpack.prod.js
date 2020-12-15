const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const prodWebpackConfig = {
	mode: 'production',
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, '../dist')
	},
	performance: {
		maxEntrypointSize: 900000,
		maxAssetSize: 900000
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					format: { comments: false }
				},
				extractComments: false
			}),
			new OptimizeCSSAssetsPlugin()
		],
		splitChunks: { chunks: 'initial' }
	},
	plugins: [
		new JavaScriptObfuscator({
			rotateStringArray: true,
		}),
		new CleanWebpackPlugin(),
		new webpack.DefinePlugin({
			DEVELOPMENT: JSON.stringify(false),
			PRODUCTION: JSON.stringify(true)
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css'
		}),
		new CopyWebpackPlugin({
			patterns: [{
				from: path.resolve(__dirname, '../assets'),
				to: path.resolve(__dirname, '../dist')
			}]
		})
	],
	module: {
		rules: [{
			test: /\.css$/,
			use: [MiniCssExtractPlugin.loader, 'css-loader']
		}]
	}
};

module.exports = (env) => new Promise((resolve, reject) => {
	common(env)
		.then((config) => resolve(merge(config, prodWebpackConfig)))
		.catch(reject);
});
