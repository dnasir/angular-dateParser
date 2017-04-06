const webpack = require('webpack');
const path = require('path');
const fs = require("fs");

module.exports = {
    entry: {
        'angular-dateparser': path.resolve(__dirname, 'src/index.ts')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.tsx', '.ts', '.js']
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader'
        }]
    },
    externals: {
        'angular': 'angular'
    },
    plugins: [
        new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf8'))
    ]
}