const path = require('path');

module.exports = {
    //context: path.resolve(__dirname, 'client'),
    devtool: 'inline-source-map',
    entry: './build/main.js',
    mode: 'development',
    // module: {
    //     rules: [{
    //         test: /\.ts?$/,
    //         use: 'ts-loader',
    //         exclude: /node_modules/
    //     }]
    // },
    output: {
        filename: 'maptorium.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
};