const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseEnvConfig = require('../config/base.config.json');

const version = require('../package.json').version;
baseEnvConfig.VERSION = version || "0.0.0";

const baseWebpackConfig = {
	entry: {
		app: path.resolve(__dirname, '../src/index.ts')
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: [/\.vert$/, /\.frag$/],
				use: 'raw-loader'
			},
			{
				test: /\.(gif|png|jpe?g|svg|xml)$/i,
				use: 'file-loader'
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html',
			favicon: path.resolve(__dirname, '../src/favicon.ico')
		})
	]
};

function loadEnvironmentConfig (env) {
	return new Promise((resolve, reject) => {
		if (!env || !env.build) return resolve(baseEnvConfig);

		fs.readFile(
			path.resolve(__dirname, `../config/${env.build}.config.json`),
			(err, data) => {
				if (err) return reject(`File ${env.build} config is error / not found`);
				let envConfig = JSON.parse(data.toString('utf8'));
				let combinedConfig = {
					...baseEnvConfig,
					...envConfig
				};
				resolve(combinedConfig);
			}
		);
	});
}

module.exports = (env) => new Promise((resolve, reject) => {
	return loadEnvironmentConfig(env)
		.then(envConfig => {
			baseWebpackConfig.plugins.push(
				new webpack.DefinePlugin({
					CANVAS_RENDERER: JSON.stringify(true),
					WEBGL_RENDERER: JSON.stringify(true),
					CONFIG: JSON.stringify(envConfig)
				})
			);
			resolve(baseWebpackConfig);
		})
		.catch(err => reject(err));
});
