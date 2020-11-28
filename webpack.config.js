
// using a node.js module to build an absolute path for the output file:
const path = require('path');


// exporting a javascript object in a node.js environment
module.exports = {
    mode: 'development',
    entry: './app.ts',
    output: {
        // this will be single javascript output file
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['ts', 'js']
    }
};