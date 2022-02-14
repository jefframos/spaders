'use strict';

var webpack = require('webpack');
var path = require('path');


var WebpackAutoInject = require('webpack-auto-inject-version');

var plugins = [];
if (process.env.NODE_ENV === "production") {
	plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress: {
				warnings: false
			},
			output: { comments: false }
		})
	)
	plugins.push(
		new WebpackAutoInject()
	);
}


module.exports = {
	devtool: 'source-map',
	entry: ['pixi.js', './src/index.js'],
	output: {
		filename: '../www/js/index.js'
	},
	resolve: {
		extensions: ["", ".js"]
	},
	plugins: [new WebpackAutoInject()],
	module: {
		postLoaders: [
			{
				loader: "transform/cacheable?brfs"
			}
		],
		loaders: [
			{
				test: /\.json$/,
				include: path.join(__dirname, 'node_modules', 'pixi.js'),
				loader: 'json',
			},
			{
				test: /\.js$/,
				exclude: path.join(__dirname, 'node_modules'),
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'stage-0']
				}
			}
		]
	}
};





// const WebpackVersionFilePlugin = require('webpack-version-file-plugin');
// const execa = require('execa');

// const gitHash = execa.sync('git', ['rev-parse', '--short', 'HEAD']).stdout;
// const gitNumCommits = Number(execa.sync('git', ['rev-list', 'HEAD', '--count']).stdout);
// const gitDirty = execa.sync('git', ['status', '-s', '-uall']).stdout.length > 0;

// plugins = [new WebpackVersionFilePlugin({
// 	packageFile: path.join(__dirname, 'package.json'),
// 	template: path.join(__dirname, 'version.ejs'),
// 	outputFile: path.join('build/ts/', 'version.json'),
// 	extras: {
// 		'githash': gitHash,
// 		'gitNumCommits': gitNumCommits,
// 		'timestamp': Date.now(),
// 		'dirty': gitDirty
// 	}
// }),];