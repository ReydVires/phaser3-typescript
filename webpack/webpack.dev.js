const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const devWebpackConfig = {
	mode: 'development',
	devtool: 'eval-source-map',
	devServer: {
		contentBase: './assets'
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			DEVELOPMENT: JSON.stringify(true),
			PRODUCTION: JSON.stringify(false)
		})
	]
};

module.exports = (env) => new Promise((resolve, reject) => {
	common(env)
		.then((config) => resolve(merge(config, devWebpackConfig)))
		.catch(reject);
});
